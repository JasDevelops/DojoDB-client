import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { startLoading, finishLoading } from "../../actions/progressAction";

import { MovieCard } from "../movie-card/movie-card";

export const GenreView = ({ favourites = [], onToggleFavourite }) => {
    const { name } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [genre, setGenre] = useState(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchGenreData = async () => {
            try {
                dispatch(startLoading());
                setLoading(true);

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
                    setLoading(false);
                    dispatch(finishLoading());

                } else {
                    setMovies([]);
                    setError("No movies found for this genre.");
                }
            } catch (err) {
                setMovies([]);
                setError(`There was an error fetching movies for genre "${name}"`);
            } finally {
                setLoading(false);
                dispatch(finishLoading());
            }
        };

        fetchGenreData();
    }, [name, dispatch]);

    return (
        <>
            {genre ? (
                <div className="genre-info dark mb-4 center">
                    <h3 className="mb-5">"{genre.name}"</h3>
                    <p className="mb-4">{genre.description}</p>
                </div>
            ) : (
                <p>Genre information is unavailable.</p>
            )}
            <h3>Movies in the "{name}" genre</h3>
            {error && <p>{error}</p>}
            <Row className="g-3 mb-5 d-flex justify-content-center"> {loading ? (
                // Spinner while loading
                <Col xs="auto">
                    <Spinner animation="grow" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Col>
            ) : (
                movies.map((genreMovie) => (
                    <Col key={genreMovie.id} sm={6} md={4} lg={3}>
                        <MovieCard
                            movie={genreMovie}
                            isFavourite={favourites.some(fav => fav.movieId === genreMovie.id)}
                            onToggleFavourite={onToggleFavourite}
                        />
                    </Col>
                ))
            )}
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
