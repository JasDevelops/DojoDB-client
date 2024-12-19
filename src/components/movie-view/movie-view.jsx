import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Col, Row, Button, Figure } from "react-bootstrap";
import PropTypes from "prop-types";

import { MovieCard } from "../movie-card/movie-card";
import "./movie-view.scss";

export const MovieView = ({ allMovies, user, onUpdateFavorites, similarMovies }) => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the movie details using movieId
    useEffect(() => {
        const currentMovie = allMovies.find((movie) => movie.id === movieId);
        setMovie(currentMovie);
        // Check if the movie is in the user's favorites
        if (user && user.FavoriteMovies.includes(movieId)) {
            setIsFavorite(true);
        }
    }, [movieId, allMovies, user]);

    // Add/Remove from Favorites
    const toggleFavorite = () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const method = isFavorite ? "DELETE" : "POST"; // POST to add, DELETE to remove
        const url = `https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/favorites/${movieId}`;

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to ${isFavorite ? "remove from" : "add to"} favorites.`);
                }
                return response.json();
            })
            .then((data) => {
                setIsFavorite(!isFavorite); // Toggle the favorite status
                setLoading(false);
                onUpdateFavorites(); // Callback to update the favorites list in the parent component
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    };
    if (!movie) {
        return <Col><h3>Loading...</h3></Col>;
    }

    return (
        <div className="movieView">
            <Row className="bg mt-5 mb-5 p-3 justify-content-between" style={{ height: "100%" }}>
                {/* Movie Title */}
                <div className="title mb-3">
                    <h2>{movie.title}</h2>
                </div>
                {/* Movie Image and Attribution */}
                <Col md={4} className="d-flex flex-column justify-content-between align-items-center">
                    <Figure className="w-100">
                        <Figure.Image
                            width="100%"
                            alt={movie.title}
                            src={movie.image.imageUrl}
                            className="img-fluid rounded"
                        />
                        <Figure.Caption>
                            <span className="font-weight-bold">Image Attribution: </span>
                            {movie.image.imageAttribution}
                        </Figure.Caption>
                    </Figure>
                </Col>
                {/* Movie Details (Description, Director, Actors, Genre, Release Year) */}
                <Col md={8} className="d-flex flex-column justify-content-between">
                    <div className="description mb-4">
                        <span>{movie.description}</span>
                    </div>
                    {/* Director Info */}
                    <div className="mb-3">
                        <span className="font-weight-bold">Director: </span>
                        <span>{movie.director.name}</span>
                    </div>
                    {/* Actors Info */}
                    <div className="mb-3">
                        <span className="font-weight-bold">Actors: </span>
                        {movie.actors && movie.actors.length > 0 ? (
                            movie.actors.map((actor, index) => (
                                <span key={actor._id}>
                                    {actor.name} as "{actor.role}"
                                    {index < movie.actors.length - 1 ? ', ' : ''}
                                </span>
                            ))
                        ) : (
                            <span>No actors available</span>
                        )}
                    </div>
                    {/* Genre and Release Year */}
                    <Row className="mb-3 mt-3" style={{ flexGrow: 1 }}>
                        <Col xs={6} className="d-flex justify-content-start align-items-start">
                            <div>
                                <span className="font-weight-bold">Genre: </span>
                                <span>{movie.genre.name}</span>
                            </div>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-end align-items-start">
                            <div>
                                <span className="font-weight-bold">Release Year: </span>
                                <span>{movie.releaseYear}</span>
                            </div>
                        </Col>
                    </Row>
                    {/* Add/Remove to Favorites Button */}
                    <div className="mb-3">
                        {loading ? (
                            <Button variant="secondary" disabled>Loading...</Button>
                        ) : (
                            <Button
                                variant={isFavorite ? "danger" : "primary"}
                                onClick={toggleFavorite}
                            >
                                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                            </Button>
                        )}
                        {error && <p className="text-danger">{error}</p>}
                    </div>
                    {/* Back Button */}
                    <div className="mt-auto">
                        <Link to="/" className="back-btn">
                            <Button variant="secondary">Back</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
            {/* Similar Movies Section */}
            <h3>Similar Movies</h3>
            <Row>
                {similarMovies.length > 0 ? (
                    similarMovies.map((similarMovie) => (
                        <Col key={similarMovie.id} md={4} className="mb-4">
                            <Card className="movie-card h-100 bg">
                                <div className="image-container">
                                    <Card.Img
                                        variant="top"
                                        src={similarMovie.image.imageUrl}
                                        alt={similarMovie.title}
                                    />
                                </div>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{similarMovie.title}</Card.Title>
                                    <Card.Text>Directed by {similarMovie.director.name}</Card.Text>
                                    <Link to={`/movies/${similarMovie.id}`} className="btn btn-primary">
                                        View Details
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No similar movies found - sorry!</p>
                    </Col>
                )}
            </Row>
        </div>
    );
};

MovieView.propTypes = {
    allMovies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            genre: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            title: PropTypes.string.isRequired,
            image: PropTypes.shape({
                imageUrl: PropTypes.string.isRequired,
                imageAttribution: PropTypes.string.isRequired,
            }).isRequired,
            description: PropTypes.string.isRequired,
            director: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            actors: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    role: PropTypes.string.isRequired,
                })
            ),
            releaseYear: PropTypes.number.isRequired,
        })
    ).isRequired,
    user: PropTypes.object.isRequired, // User object to check for favorite movies
    onUpdateFavorites: PropTypes.func.isRequired, // Callback to update the favorites list
    similarMovies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            genre: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            image: PropTypes.shape({
                imageUrl: PropTypes.string.isRequired,
            }).isRequired,
        })
    ).isRequired,
};