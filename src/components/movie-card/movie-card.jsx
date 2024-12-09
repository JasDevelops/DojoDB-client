export const MovieCard = ({ movie, onMovieClick }) => {
    return <div className="movieCard" onClick={() => onMovieClick(movie)}>{movie.title}</div>;
};  
