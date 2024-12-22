import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import "./movie-card.scss";

export const MovieCard = ({movie, isFavourite, onToggleFavourite, onRemove }) => {
    const handleClick = () => {
        if (onRemove) {
            onRemove(movie.id);
        } else {
            onToggleFavourite(movie.id, isFavourite); 
        }
    }; 
    return (
        <Card className="h-100">
            <div className="image-container">
            console.log(movie);
                <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} loading="lazy"/>
            </div>
            <Card.Body>
                <Card.Title>
                    <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                </Card.Title>
                <Card.Text>Directed by {movie.director.name}</Card.Text>
            </Card.Body>
            {/* Add/Remove Favourite button */}
            <Button
                variant={isFavourite ? "danger" : "primary"}
                onClick={handleClick}
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
            imageAttribution: PropTypes.string,
        }).isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    isFavourite: PropTypes.bool.isRequired,
    onToggleFavourite: PropTypes.func,  
    onRemove: PropTypes.func,  
};