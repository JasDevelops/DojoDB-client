import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom ";

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

    useEffect(() => {
        // Don"t fetch if there is no token
        if (!token) return;

        // Fetch movies if token is available
        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies", {
            headers: {
                Authorization: `Bearer ${token}`, // Send token for authentication
            },
        })
            .then((response) => response.json())
            .then((data) => {
                const moviesFromApi = data.map((movie) => ({
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
                    featured: true,
                    director: {
                        name: movie.director.name,
                        bio: movie.director.bio,
                        birthYear: movie.director.birthYear,
                        deathYear: movie.director.deathYear,
                    },
                    actors: movie.actors,
                    releaseYear: movie.releaseYear,
                }));
                setMovies(moviesFromApi);
            })
            .catch((error) => alert("Error fetching movies: " + error));
    }, [token]); // Only fetch when token changes

    const handleLogin = (user, token) => {
        // Login
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const handleLogout = () => {
        // Logout (reset)
        setUser(null);
        setToken(null);
        localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <BrowserRouter>
        <NavigationBar user={user} onLoggedOut={() => { setUser(null); }} />
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
                                <ProfileView user={user} movies={movies} />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    {/* Movie Details Route */}
                    <Route
                        path="/movies/:movieId"
                        element={
                            user ? (
                                movies.length === 0 ? (
                                    <Col><h3>The list is empty!</h3></Col>
                                ) : (
                                    <MovieView allMovies={movies} onBackClick={() => <Navigate to="/" />} />
                                )
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
                                    <>
                                        <Row className="d-flex justify-content-end align-items-start">
                                            <Col className="auto logout-col">
                                                <Button className="logout-btn" variant="primary" onClick={handleLogout}>
                                                    Logout
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row className="w-100 gx-4 gy-4">
                                            {movies.map((movie) => (
                                                <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                                                    <Link to={`/movies/${movie.id}`}>
                                                        <MovieCard movie={movie} />
                                                    </Link>    
                                                </Col>
                                            ))}
                                        </Row>
                                    </>
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
