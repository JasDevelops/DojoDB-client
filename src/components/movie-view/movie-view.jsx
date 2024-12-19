import PropTypes from "prop-types";

import "./movie-view.scss";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Figure from "react-bootstrap/Figure";

import { MovieCard } from "../movie-card/movie-card";

export const MovieView = ({ movie, allMovies, onBackClick, onMovieClick }) => {

    {/* Filter movies by same genre, excl. current movie, limit similar movies to 3 */ }
    const similarMovies = allMovies
        .filter((m) => m.genre.name === movie.genre.name && m.id !== movie.id)
        .slice(0, 3);
    return (
        <Col className="movieView">

            <Row className="bg mt-5 mb-5 p-3  justify-content-between" style={{ height: "100%" }}>
                <div className="title mb-3">
                    <h2>{movie.title}</h2>
                </div>
                <Col md={4} className="d-flex flex-column justify-content-betwen align-items-center">
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
                <Col md={8} className="d-flex flex-column justify-content-between" >
                    <div className="description mb-4">
                        <span>{movie.description}</span>
                    </div>

                    <div className="mb-3">
                        <span className="font-weight-bold">Director: </span>
                        <span>{movie.director.name}</span>
                    </div>
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
                    <div className="mt-auto">
                        <Button onClick={onBackClick} className="back-btn">Back</Button>
                    </div>
                </Col>
            </Row>
            <h3>Similar Movies</h3>
            <Row>
                {similarMovies.length > 0 ? (
                    similarMovies.slice(0, 3).map((similarMovie) => (
                        <Col key={similarMovie.id} md={4} className="mb-4">
                            <Card className="movie-card  h-100 bg" onClick={() => onMovieClick(similarMovie)}>
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
                                    <Button onClick={() => onMovieClick(similarMovie)} >View Details</Button>
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
        </Col>
    );
};
MovieView.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        genre: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
        image: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            imageAttribution: PropTypes.string.isRequired,
        }).isRequired,
        actors: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                role: PropTypes.string.isRequired,
            })
        ).isRequired,
        releaseYear: PropTypes.number.isRequired,
    }).isRequired,
    allMovies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            genre: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
        })
    ).isRequired,
    onBackClick: PropTypes.func.isRequired,
    onMovieClick: PropTypes.func.isRequired,
};