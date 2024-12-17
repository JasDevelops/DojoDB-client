import PropTypes from "prop-types";
import "./movie-view.scss";

import { MovieCard } from "../movie-card/movie-card";

export const MovieView = ({ movie, allMovies, onBackClick, onMovieClick }) => {

    {/* Filter movies by same genre, excl. current movie, limit similar movies to 3 */}
    const similarMovies = allMovies
    .filter ((m) => m.genre.name === movie.genre.name && m.id !==movie.id)
    .slice(0, 3);
    return (
        <div className="movieView">
            
            {/* Current movie details */}
            <div>
                <img src={movie.image.imageUrl} alt={movie.title} />
            </div>
            <div className="title">
                <span>Title: </span>
                <span>{movie.title}</span>
            </div>            
            <div>
                <span>Description: </span>
                <span>{movie.description}</span>
            </div>
            <div>
                <span>Genre: </span>
                <span>{movie.genre.name}</span>
            </div>
            <div>
                <span>Director: </span>
                <span>{movie.director.name}</span>
            </div>
            <div>
                <span>Image Attribution: </span>
                <span>{movie.image.imageAttribution}</span>
            </div>
        <button onClick={onBackClick} className="back-button">Back</button>
        
        {/* Similar movies */}
        <hr />
        <h3>Similar movies</h3>
        <div className="similarMovies">
            {similarMovies.length > 0 ? (
                similarMovies.map((similarMovie) => (
                    <div key={similarMovie.id} className="similarMovieCard">
                    <div className="imageBox">
                        <img 
                            src={similarMovie.image.imageUrl} 
                            alt={similarMovie.title} 
                        />
                    </div>    
                    <div className="movieDetails">
                        <h4>{similarMovie.title}</h4>
                    </div>
                    <button onClick={() => onMovieClick(similarMovie)}>View Details</button>
                </div>
            ))
        ) : (
            <p>No similar movies found - sorry!</p>
        )}
        </div>
    </div>
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