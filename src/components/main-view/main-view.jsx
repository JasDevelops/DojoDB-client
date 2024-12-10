import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect (() => {
        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies")
        .then ((response) => response.json())
        .then ((data) => {
            const moviesFromApi = data.map((movie) => ({
                id:movie._id,
                title: movie.title,
                description: movie.description,
                genre: {
                    name: movie.genre.name,
                    description:movie.genre.description
                },
                image: {
                    imageUrl: movie.image.imageUrl ,
                    imageAttribution: movie.image.imageAttribution
                },
                featured: true,
                director: {
                    name: movie.director.name,
                    bio: movie.director.bio,
                    birthYear: movie.director.birthYear,
                    deathYear: movie.director.deathYear,
                }
            }));
            setMovies(moviesFromApi);
        });
    }, []
    );
    
    if (selectedMovie) {
    return (
        <MovieView 
        movie={selectedMovie} 
        onBackClick={() => setSelectedMovie(null)} 
        />
    );
    }

    if (movies.length === 0) {
    return <div>The list is empty!</div>;
    }

    return (
        <div>
        {movies.map((movie) => (
        <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => {
                setSelectedMovie(newSelectedMovie);
            }}
        />
        ))}
    </div>
    );
};
export default MainView;