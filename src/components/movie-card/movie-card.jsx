import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

import "./movie-card.scss";

export const MovieCard = ({ movie }) => {
    return (
        <Card className="movie-card h-100 bg">
            <Link to={`/movies/${movie.id}`}>
                <div className="image-container">
                    <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} />
                </div>
                <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>Directed by {movie.director.name}</Card.Text>
                </Card.Body>
            </Link>
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
};
