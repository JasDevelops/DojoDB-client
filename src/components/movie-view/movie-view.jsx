import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Col, Row, Button, Figure, Card, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

import { MovieCard } from "../movie-card/movie-card";
import "./movie-view.scss";

export const MovieView = ({ allMovies, user, favourites, onAddToFavourites, onRemoveFromFavourites, similarMovies }) => {
    const { movieID } = useParams();
    const [movie, setMovie] = useState(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the movie details using movieID
    useEffect(() => {
        const currentMovie = allMovies.find((movie) => movie.id === movieID);
        setMovie(currentMovie);

        // Check if the movie is in the user's favourites
        setIsFavourite(user?.favourites?.some(fav => fav.movieId === movieID) || false);
    }, [movieID, allMovies, user]);

    // Add/Remove from Favourites
    const toggleFavourite = (movieID, username) => {
        if (!username) {
            return;
        }

        setLoading(true); // Start loading
        setError(null); // Clear any previous errors

        const token = localStorage.getItem("token");
        const method = isFavourite ? "DELETE" : "PUT"; // PUT to add, DELETE to remove

        console.log('User favourites:', user.favourites);

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${username}/favourites/${movieID}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to ${isFavourite ? "remove from" : "add to"} favourites.`);
                }
                return response.json();
            })
            .then(() => {
                setIsFavourite(!isFavourite); // Toggle the favourite status
                setLoading(false); // Stop loading
            })
            .catch((error) => {
                setError(error.message); // Set error message
                setLoading(false); // Stop loading
            });
    };

    // Similar movies button toggle function
    const toggleSimilarMovieFavourite = (movieID) => {
        if (!user) {
            return;
        }

        const token = localStorage.getItem("token");
        const method = isFavourite ? "DELETE" : "PUT"; // PUT to add, DELETE to remove

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to toggle similar movie favourite.");
                }
                return response.json();
            })
            .then(() => {
                setIsFavourite(!isFavourite); // Toggle the favourite status
            })
            .catch((error) => {
                setError(error.message); // Set error message
            });
    };

    if (!movie) {
        return <Col><h3>Loading...</h3></Col>;
    }

    return (
        <div className="movieView">
            <Row >
                <Col>
                    <h2>{movie.title}</h2>
                </Col>

                <Col md={4} >
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

                <Col md={8} >
                    <div className="description mb-4">
                        <span>{movie.description}</span>
                    </div>

                    <div >
                        <span className="font-weight-bold">Director: </span>
                        <span>{movie.director.name}</span>
                    </div>

                    <Row >
                        <Col xs={6}>
                            <div>
                                <span className="font-weight-bold">Genre: </span>
                                <span>{movie.genre.name}</span>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div>
                                <span className="font-weight-bold">Release Year: </span>
                                <span>{movie.releaseYear}</span>
                            </div>
                        </Col>
                    </Row>

                        
                    <div className="mt-auto">
                        <Link to="/" className="back-btn">
                            <Button variant="secondary">Back</Button>
                        </Link>
                    </div>
                </Col>
            </Row>

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
                                    <Card.Title>
                                        <Link to={`/movies/${similarMovie.id}`}>
                                            {similarMovie.title}
                                        </Link>
                                    </Card.Title>
                                    <Card.Text>Directed by {similarMovie.director.name}</Card.Text>
                                    <Button
                                        variant={isFavourite ? "danger" : "primary"}
                                        onClick={() => toggleSimilarMovieFavourite(similarMovie.id)}
                                    >
                                        {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                                    </Button>
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
            releaseYear: PropTypes.number.isRequired,
        })
    ),
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        favourites: PropTypes.array.isRequired,
    }).isRequired,
    similarMovies: PropTypes.array.isRequired,
};
