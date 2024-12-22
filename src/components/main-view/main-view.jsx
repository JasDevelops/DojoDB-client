import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from "react-router-dom";

import { NavigationBar } from "../navigation-bar/navigation-bar";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";

import "./main-view.scss";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [allMovies, setAllMovies] = useState([]);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [favourites, setFavourites] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);

    const getUniqueSimilarMovies = (movies) => {
        return Array.from(new Set(movies.map(movie => movie.id)))
            .map(id => movies.find(movie => movie.id === id));
    };

    const { movieID } = useParams();

    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    useEffect(() => {
        if (!token || !user) return;

        const fetchData = async () => {
            try {
                // Fetch movies
                const moviesResponse = await fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies", {
                    headers: {
                        "Authorization": `Bearer ${storedToken}`,
                        "Content-Type": "application/json"
                    },
                });
                const moviesData = await moviesResponse.json();
                const moviesFromApi = moviesData.map((movie) => ({
                    id: movie._id.toString(),
                    title: movie.title,
                    description: movie.description,
                    genre: {
                        name: movie.genre.name,
                        description: movie.genre.description,
                    },
                    image: movie.image,
                    director: { name: movie.director.name },
                    actors: movie.actors,
                    releaseYear: movie.releaseYear,
                }));

                // Fetch favourites
                const favouritesResponse = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}`, {
                    headers: {
                        "Authorization": `Bearer ${storedToken}`,
                        "Content-Type": "application/json"
                    },
                });

                const favouritesData = await favouritesResponse.json();
                const favouritesList = Array.isArray(favouritesData.user.favourites)
                    ? favouritesData.user.favourites
                    : [];

                const updatedMovies = moviesFromApi.map((movie) => ({
                    ...movie,
                    isFavourite: favouritesList.some((fav) => fav.movieId.toString() === movie.id),
                }));

                setFavourites(favouritesList);
                setAllMovies(updatedMovies);
                setSimilarMovies(getUniqueSimilarMovies(moviesFromApi.slice(0, 3))); 

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [token, user]);

    const toggleFavourite = async (movieID, isFavourite) => {
        const endpoint = `https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`;
        const method = isFavourite ? "DELETE" : "PUT";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Authorization": `Bearer ${storedToken}`,
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) throw new Error(`Failed to update favourites: ${response.status}`);

            const updatedFavourites = await response.json();

            // Update favourites in the local state
            setFavourites(updatedFavourites.favourites);
            setAllMovies((prevMovies) =>
                prevMovies.map((movie) =>
                    movie.id === movieID
                        ? { ...movie, isFavourite: !isFavourite }
                        : movie
                )
            );
        } catch (error) {
            console.error("Error toggling favourite:", error);
            alert("An error occurred while updating your favourites.");
        }
    };

    const handleLogin = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };

    return (
        <BrowserRouter>
            <NavigationBar user={user} onLoggedOut={handleLogout} />
            <Routes>
                <Route path="/login" element={user ? (<Navigate to="/" />) : (<Col md={6}><LoginView onLoggedIn={handleLogin} /></Col>)} />
                <Route path="/signup" element={user ? (<Navigate to="/" />) : (<Col md={6}><SignupView /></Col>)} />
                <Route path="/profile" element={user ? (
                    <ProfileView
                        user={user}
                        movies={allMovies}
                        favourites={favourites}
                        onRemove={toggleFavourite}
                        onProfileUpdate={handleProfileUpdate}
                    />
                ) : (<Navigate to="/login" />)} />
                <Route path="/movies/:movieID" element={user ? (
                    <MovieView
                        allMovies={allMovies}
                        user={user}
                        favourites={favourites}
                        onToggleFavourite={toggleFavourite}
                        similarMovies={similarMovies}
                    />
                ) : (<Navigate to="/login" replace />)} />
                <Route path="/" element={user ? (
                    allMovies.length === 0 ? (
                        <Col><h3>The list is empty!</h3></Col>
                    ) : (
                        <Row className="w-100 gx-4 gy-4">
                            {allMovies.map((movie) => (
                                <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                                    <MovieCard
                                        movie={movie}
                                        isFavourite={favourites.some(fav => fav.movieId.toString() === movie.id.toString())}
                                        onToggleFavourite={(movieId, isFavourite) => toggleFavourite(movieId, isFavourite)}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )
                ) : (<Navigate to="/login" replace />)} />
            </Routes>
        </BrowserRouter>
    );
};

export default MainView;
