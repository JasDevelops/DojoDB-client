export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div className="movieView">
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
        <button onClick={onBackClick}>Back</button>
    </div>
    );
};  