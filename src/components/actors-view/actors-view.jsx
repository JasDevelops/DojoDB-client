import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { MovieCard } from "../movie-card/movie-card";

export const ActorsView = ({ favourites = [], onToggleFavourite }) => {
    const { name } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/actors/${name}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (response.ok && data.roles && data.roles.length > 0) {
                    const updatedMovies = data.roles.map(movie => ({
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
                setError(`There was an error fetching movies by actor "${name}"`);
            }
        };

        fetchMovies();
    }, [name]);

    return (
        <>
            <h3>Movies with "{name}"</h3>
            {error && <p>{error}</p>}
            <Row className="g-3 mb-5">
                {movies.map((actorMovie) => {
                    return (

                        <Col key={actorMovie.id} sm={6} md={4} lg={3}>
                            <MovieCard
                                movie={actorMovie}
                                isFavourite={favourites.some(fav => fav.movieId === actorMovie.id)}
                                onToggleFavourite={onToggleFavourite}
                            />
                        </Col>
                    );
                })}
            </Row>
        </>
    );
};

ActorsView.propTypes = {
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
    favourites: PropTypes.array,
    onToggleFavourite: PropTypes.func,
};