import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

export const MovieCard = ({ movie, isFavourite, onToggleFavourite, onRemove }) => {
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
                <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} loading="lazy" />
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title>
                    <h5><Link to={`/movies/${movie.id}`}>{movie.title}</Link></h5>
                </Card.Title>
                <Card.Text className="mt-auto">
                    Directed by{" "}
                    {movie.director && movie.director.name ? (
                        <Link to={`/directors/${movie.director.name}`}>{movie.director.name}</Link>
                    ) : (
                        <span>Unknown Director</span>
                    )}
                </Card.Text>
            </Card.Body>

            {/* Add/Remove Favourite button */}
            <Button
                variant={isFavourite ? "dark" : "dark"}
                onClick={handleClick}
                className="btn-heart"
            >
                {isFavourite ? (
                    <>
                        <i className="bi bi-heart-fill"></i>
                    </>
                ) : (
                    <>
                        <i className="bi bi-heart"></i>
                    </>
                )}
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
        }),
    }).isRequired,
    isFavourite: PropTypes.bool.isRequired,
    onToggleFavourite: PropTypes.func.isRequired,
    onRemove: PropTypes.func,
};