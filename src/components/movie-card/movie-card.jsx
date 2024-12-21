import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import "./movie-card.scss";

export const MovieCard = ({ movie, isFavourite, onAddToFavourites, onRemoveFromFavourites }) => {
    const handleFavouriteToggle = () => {
        if (isFavourite) {
            onRemoveFromFavourites(movie.id);
        } else {
            onAddToFavourites(movie.id);
        }
    };
    const isFavourite = favourites.some((fav) => fav.movieId === movie._id);

    return (
        <Card lassName="h-100">
            <div className="image-container">
                <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} loading="lazy"/>
            </div>
            <Card.Body >
            <Card.Title>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link></Card.Title>
                
                <Card.Text>Directed by {movie.director.name}</Card.Text>
            </Card.Body>
            {/* Add/Remove Favourite button */}
            <Button
                variant={isFavourite ? "danger" : "primary"}
                onClick={handleFavouriteToggle}
            >
                {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
            </Button>
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
