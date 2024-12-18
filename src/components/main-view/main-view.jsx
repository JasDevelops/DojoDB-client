import { useState, useEffect } from "react";

import "./main-view.scss";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [showLogin, setShowLogin] = useState(true); // Show LoginView or SignupView

    useEffect(() => { // Fetch movies if token is available
        if (!token) return; // Don't fetch if there is no token
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
                        description: movie.genre.description
                    },
                    image: {
                        imageUrl: movie.image?.imageUrl,
                        imageAttribution: movie.image?.imageAttribution
                    },
                    featured: true,
                    director: {
                        name: movie.director.name,
                        bio: movie.director.bio,
                        birthYear: movie.director.birthYear,
                        deathYear: movie.director.deathYear,
                    }
                }));
                setMovies(moviesFromApi);
            })
            .catch((error) => alert("Error fetching movies: " + error));
    }, [token]); // Only fetch when token changes

    const handleMovieClick = (newSelectedMovie) => {
        setSelectedMovie(newSelectedMovie); // Update the selected movie when a similar movie is clicked
    };

    const handleLogin = (user, token) => { // Login
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const handleLogout = () => { // Logout (reset)
        setUser(null);
        setToken(null);
        localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    if (!user) {
        return (
            <Row className="mainView_form w-100 min-vh-100">
                <Col className="w-100">
                    <div className="slider-toggle-container" onClick={() => setShowLogin(!showLogin)}>
                        <div className={`slider-circle ${showLogin ? "login" : "signup"}`} />
                        <span className={`slider-text-left ${showLogin ? "active" : ""}`}>Log in</span>
                        <span className={`slider-text-right ${!showLogin ? "active" : ""}`}>Sign up</span>
                    </div>
                </Col>

                <Col className="d-flex justify-content-center align-items-start flex-grow-1 w-100 col-11 col-md-10 col-lg-8">
                    {showLogin ? <LoginView onLoggedIn={handleLogin} /> : <SignupView />}
                </Col>
            </Row>
        );
    }

    if (selectedMovie) { // Show MovieView, if a movie is selected
        return (
            <Row className="movieView_main">
                <MovieView
                    movie={selectedMovie}
                    allMovies={movies}
                    onBackClick={() => setSelectedMovie(null)}
                    onMovieClick={handleMovieClick}
                />
            </Row>
        );
    }

    if (movies.length === 0) { // If no movies a re available
        return (
            <Row className="mainView_empty">
                <div>The list is empty!</div>;
            </Row>
        );
    }

    return ( // Default view:showing all movie cards
        <div className="movieCards_main">
            <Row className="d-flex justify-content-end align-items-start">
                <Col className="auto logout-col">
                    <Button className="logout-btn" variant="primary" onClick={handleLogout}>Logout</Button>
                </Col>
            </Row>

            <Row className="w-100 gx-4 gy-4">
                {movies.map((movie) => (
                    <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <MovieCard
                            movie={movie}
                            onMovieClick={() => setSelectedMovie(movie)}
                        />
                    </Col>
                ))}
            </Row>
        </div>

    );
};
export default MainView;