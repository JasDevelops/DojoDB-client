import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

export const GenreView = ({ favourites = [], onToggleFavourite }) => {
    const { name } = useParams(); 
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [genre, setGenre] = useState(null);

    useEffect(() => {
        const fetchGenreData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/genres/${name}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (response.ok && data.movies && data.movies.length > 0) {
                    setGenre({
                        name: data.name,
                        description: data.description,
                    });
                    const updatedMovies = data.movies.map(movie => ({
                        ...movie,
                        id: movie._id,
                    }));
                    setMovies(updatedMovies);
                    setError("");
                } else {
                    setMovies([]);
                    setError("No movies found for this genre.");
                }
            } catch (err) {
                setMovies([]);
                setError(`There was an error fetching movies for genre "${name}"`);
            }
        };

        fetchGenreData();
    }, [name]);

    return (
        <>
            {genre ? (
                <div className="genre-info dark mb-4 center">
                    <h3 className="mb-5">Genre: {genre.name}</h3>
                    <p className="mb-4">{genre.description}</p>
                </div>
            ) : (
                <p>Loading genre information...</p>
            )}
            <h3>Movies in the "{name}" genre</h3>
            {error && <p>{error}</p>}
            <Row className="g-3 mb-5 d-flex justify-content-center">
                {movies.map((genreMovie) => {
                    return (
                        <Col key={genreMovie.id} sm={6} md={4} lg={3}>
                            <MovieCard
                                movie={genreMovie}
                                isFavourite={favourites.some(fav => fav.movieId === genreMovie.id)}
                                onToggleFavourite={onToggleFavourite}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

GenreView.propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.shape({
        movieId: PropTypes.string.isRequired,
    })),
    onToggleFavourite: PropTypes.func,
};
