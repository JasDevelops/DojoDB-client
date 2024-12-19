import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Col, Row, Card, Button, Figure } from "react-bootstrap";
import PropTypes from "prop-types";

import "./movie-view.scss";

export const MovieView = ({ allMovies }) => {
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);

    // Fetch the movie details using movieId
    useEffect(() => {
        const currentMovie = allMovies.find((movie) => movie.id === movieId);
        setMovie(currentMovie);
    }, [movieId, allMovies]);

    if (!movie) {
        return <Col><h3>Loading...</h3></Col>;
    }

    // Filter similar movies by the same genre, excluding the current movie
    const similarMovies = allMovies
        .filter((m) => m.genre.name === movie.genre.name && m.id !== movie.id)
        .slice(0, 3);

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
};