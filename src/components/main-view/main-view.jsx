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

    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [favourites, setFavourites] = useState([]);

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!token || !user) return;
    
        // Fetch movies and favourites
        const fetchData = async () => {
            try {
                // Fetch movies 
                const moviesResponse = await fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies", {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                const moviesData = await moviesResponse.json();
                const moviesFromApi = moviesData.map((movie) => ({
                    id: movie._id.toString(), // Ensure this is a string
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
                console.log("Fetched Movies:", moviesFromApi);
    
                // Fetch favourites
                const favouritesResponse = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const favouritesData = await favouritesResponse.json();
                console.log("Fetched Favourites Data:", favouritesData);
    
                // Access favourites correctly (it will be an array under `favourites`)
                const favouritesList = Array.isArray(favouritesData.user.favourites) 
                    ? favouritesData.user.favourites 
                    : [];
                console.log("Parsed Favourites List:", favouritesList);
    
                // Map movies and update their isFavourite status
                const updatedMovies = moviesFromApi.map((movie) => ({
                    ...movie,
                    isFavourite: favouritesList.some((fav) => fav.movieId.toString() === movie.id), // Compare ObjectId with string
                }));
                console.log("Updated Movies with isFavourite:", updatedMovies);
    
                setFavourites(favouritesList);
                setMovies(updatedMovies);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [token, user]);  // Dependency on token and user to refetch data
    
    
const toggleFavourite = async (movieID, isFavourite) => {
    const endpoint = `https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`;
    const method = isFavourite ? "DELETE" : "PUT";

    try {
        const response = await fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error(`Failed to update favourites: ${response.status}`);

        const updatedFavourites = await response.json();

        // Update movies and favourites states
        setFavourites(updatedFavourites.favourites);
        setMovies((prevMovies) =>
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
    
const MovieWithParams = ({ movies, user, onToggleFavourite }) => {
    const { movieID } = useParams();
    const movie = movies.find((m) => m.id === movieID);

    if (!movie) {
        return <Col><h3>Movie not found</h3></Col>;
    }

    const getSimilarMovies = (movieID) => {
        const currentMovie = movies.find((movie) => movie.id === movieID);
        if (!currentMovie) return [];
        return movies.filter(
            (movie) => movie.genre.name === currentMovie.genre.name && movie.id !== movieID
        );
    };
    const similarMovies = getSimilarMovies(movieID).slice(0, 3);

    return (
        <MovieView
            movie={movie}
            allMovies={movies}
            similarMovies={similarMovies}
            user={user}
            onToggleFavourite={() => onToggleFavourite(movie.id, movie.isFavourite)}
        />
    );
};
    const handleLogin = (user, token) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        console.log('Logged in user:', user);
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
    };
    return (
        <BrowserRouter>
            {/* Navigation */}

            <NavigationBar user={user} onLoggedOut={handleLogout} />
            <Routes>
                {/* Login Route */}

                <Route
                    path="/login"
                    element={
                        user ? (
                            <Navigate to="/" />
                        ) : (
                            <Col md={6}><LoginView onLoggedIn={handleLogin} /></Col>
                        )
                    }
                />
                {/* Signup Route Route */}

                <Route
                    path="/signup"
                    element={
                        user ? (
                            <Navigate to="/" />
                        ) : (
                            <Col md={6}><SignupView /></Col>
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
                favourites={favourites}
                onToggleFavourite={toggleFavourite} // Adjusted to pass toggle function
            />
        ) : (
            <Navigate to="/login" />
        )
    }
/>
                {/* MovieView Route */}

                <Route
    path="/movies/:movieID"
    element={
        user ? (
            <MovieWithParams
                movies={movies}
                user={user}
                onToggleFavourite={toggleFavourite} // Adjusted to use defined function
            />
        ) : (
            <Navigate to="/login" replace />
        )
    }
/>
                {/* MovieCard Route */}
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
                    isFavourite={movie.isFavourite}
                    onToggleFavourite={() => toggleFavourite(movie.id, movie.isFavourite)}
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
        </BrowserRouter>
    );
};

export default MainView;
