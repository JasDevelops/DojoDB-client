import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import "./movie-card.scss";

export const MovieCard = ({ movie, isFavourite, onAddToFavourites, onRemoveFromFavourites }) => {
    return (
        <Card className="movie-card h-100 bg">
            <div className="image-container">
                <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} loading="lazy"/>
            </div>
            <Card.Body className="d-flex flex-column justify-content-between">
                <Link to={`/movies/${movie.id}`}>
                    <Card.Title>{movie.title}</Card.Title>
                </Link>
                <Card.Text>Directed by {movie.director.name}</Card.Text>
            </Card.Body>
            {/* Add/Remove Favourite button */}
            <div className="movie-card-footer">
                    <Button
                    variant={isFavourite ? "danger" : "primary"}
                    onClick={() => isFavourite ? onRemoveFromFavourites(movie.id) : onAddToFavourites(movie.id)}>
                    {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                </Button>
                            </div>
        </Card>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
        }).isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    isFavourite: PropTypes.bool.isRequired,
    onAddToFavourites: PropTypes.func.isRequired,
    onRemoveFromFavourites: PropTypes.func.isRequired,
};
