import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from "react-router-dom";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

import "./main-view.scss";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [favourites, setFavourites] = useState([]);

    useEffect(() => {
        if (!token || !user) return; // Ensure both token and user are available

        const fetchMoviesAndFavourites = async () => {
            try {
                // Fetch movies
                const moviesResponse = await fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const moviesData = await moviesResponse.json();
                const moviesFromApi = moviesData.map((movie) => ({
                    id: movie._id,
                    title: movie.title,
                    description: movie.description,
                    genre: {
                        name: movie.genre.name,
                        description: movie.genre.description,
                    },
                    image: {
                        imageUrl: movie.image?.imageUrl,
                        imageAttribution: movie.image?.imageAttribution,
                    },
                    director: {
                        name: movie.director.name,
                    },
                    actors: movie.actors,
                    releaseYear: movie.releaseYear,
                }));
                setMovies(moviesFromApi); // Update the movies list

                // Fetch user's favourites
                const favouritesResponse = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const favouritesData = await favouritesResponse.json();
                console.log('Fetched favourites data:', favouritesData);

                // Check if favouritesData.favourites exists and is an array
                const favourites = Array.isArray(favouritesData.favourites) ? favouritesData.favourites : [];
                setFavourites(favourites); // Update favourites list

                setMovies((prevMovies) =>
                    prevMovies.map((movie) =>
                        favourites.some(
                            (fav) => fav.movieId.toString() === movie.id
                        )
                            ? { ...movie, isFavourite: true }
                            : movie
                    )
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchMoviesAndFavourites();
    }, [token, user]);

    const MovieWithParams = ({ movies, getSimilarMovies, user, onAddToFavourites, onRemoveFromFavourites }) => {
        const { movieID } = useParams();
        const movie = movies.find((m) => m.id === movieID);

        if (!movie) {
            return <Col><h3>Movie not found</h3></Col>;
        }

        // Get similar movies
        const similarMovies = getSimilarMovies(movieID).slice(0, 3);

        return (
            <MovieView
                movie={movie}
                allMovies={movies}
                similarMovies={similarMovies}
                user={user}
                onAddToFavourites={onAddToFavourites}
                onRemoveFromFavourites={onRemoveFromFavourites}
            />
        );
    };



    // Login
    const handleLogin = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        console.log('Logged in user:', user);


    };

    // Logout (reset)
    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    // Generate similar movies
    const getSimilarMovies = (movieID) => {
        const currentMovie = movies.find(movie => movie.id === movieID);
        if (!currentMovie) return [];
        return movies.filter(movie =>
            movie.genre.name === currentMovie.genre.name && movie.id !== movieID
        );
    };

    // Add to Favourites
    const onAddToFavourites = (movieID) => {
        if (!user || !token) {
            console.log('Adding to favourites for user:', user.username, 'movie ID:', movieID);
            return;
        }
        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.favourites) {
                    // Update the local favourites list and movie state
                    setFavourites(data.favourites);  // Update favourites from response
                    setMovies((prevMovies) =>
                        prevMovies.map((movie) =>
                            movie.id === movieID ? { ...movie, isFavourite: true } : movie
                        )
                    );
                }
            })
            .catch((error) => {
                console.error("Error adding to favourites:", error);
            });
    };

    // Remove from Favourites
    const onRemoveFromFavourites = (movieID) => {
        if (!user || !token) {
            console.error("User or token is missing.");
            return;
        }

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.favourites) {
                    // Update the local favourites list and movie state
                    setFavourites(data.favourites);  // Update favourites from response
                    setMovies((prevMovies) =>
                        prevMovies.map((movie) =>
                            movie.id === movieID ? { ...movie, isFavourite: false } : movie
                        )
                    );
                }
            })
            .catch((error) => {
                console.error("Error removing from favourites:", error);
            });
    };

    return (
        <BrowserRouter>
            <NavigationBar user={user} onLoggedOut={(handleLogout) => { setUser(null); }} />
            <Row className="mainView justify-content-md-center">
                <Routes>
                    {/* Login Route */}
                    <Route
                        path="/login"
                        element={
                            user ? (
                                <Navigate to="/" />
                            ) : (
                                <Col md={6}>
                                    <LoginView onLoggedIn={handleLogin} />
                                </Col>
                            )
                        }
                    />
                    {/* Signup Route */}
                    <Route
                        path="/signup"
                        element={
                            user ? (
                                <Navigate to="/" />
                            ) : (
                                <Col md={6}>
                                    <SignupView />
                                </Col>
                            )
                        }
                    />
                    {/* Profile Route */}
                    <Route
                        path="/profile"
                        element={
                            user ? (
                                <ProfileView
                                    user={user}
                                    movies={movies}
                                    onLogout={handleLogout}
                                    favourites={favourites}
                                    onRemoveFromFavourites={onRemoveFromFavourites}
                                />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Movie Details Route */}
                    <Route
                        path="/movies/:movieID"
                        element={
                            user ? (
                                <MovieWithParams
                                    movies={movies}
                                    getSimilarMovies={getSimilarMovies}
                                    user={user}
                                    onAddToFavourites={onAddToFavourites}
                                    onRemoveFromFavourites={onRemoveFromFavourites}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    {/* Main Movie List Route */}
                    <Route
                        path="/"
                        element={
                            user ? (
                                movies.length === 0 ? (
                                    <Col><h3>The list is empty!</h3></Col>
                                ) : (
                                        <Row className="w-100 gx-4 gy-4">
                                            {movies.map((movie) => (
                                                <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                                                    <MovieCard
                                                        movie={movie}
                                                        isFavourite={favourites.includes(movie.id)}
                                                        onAddToFavourites={onAddToFavourites}
                                                        onRemoveFromFavourites={onRemoveFromFavourites}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                )
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </Row>
        </BrowserRouter>
    );
};


export default MainView;