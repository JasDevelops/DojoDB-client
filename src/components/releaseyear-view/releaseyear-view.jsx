import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

export const ReleaseYear = ({ favourites = [], onToggleFavourite }) => {
    const { year } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies/release-year/${year}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok && Array.isArray(data) && data.length > 0) {
                    const updatedMovies = data.map(movie => ({
                        ...movie,
                        id: movie._id,
                    }));
                    setMovies(updatedMovies);
                    setError("");
                } else {
                    setMovies([]);
                    setError("");
                }
            } catch (err) {
                setMovies([]);
                setError(`There was an error fetching movies by release year "${year}"`);
            }
        };

        fetchMovies();
    }, [year]);

    return (
        <>
            <h3>Movies Released in {year}</h3>
            {error && <p>{error}</p>}
            <Row>
                {movies.map((releaseYearMovie) => {
                    return (

                        <Col key={releaseYearMovie.id} sm={6} md={4} lg={3}>
                            <MovieCard
                                movie={releaseYearMovie}
                                isFavourite={favourites.some(fav => fav.movieId === releaseYearMovie.id)}
                                onToggleFavourite={onToggleFavourite}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

ReleaseYear.propTypes = {
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
};