import PropTypes from "prop-types";

import "./movie-card.scss";

import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
        <Card className="movie-card h-100 bg" onClick={() => onMovieClick(movie)}>
            <div className="image-container">
                <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} />
            </div>
            <Card.Body className="d-flex flex-column justify-content-between">
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>Directed by {movie.director.name}</Card.Text>
            </Card.Body>
        </Card>
    );
};
MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
        }).isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired,
};