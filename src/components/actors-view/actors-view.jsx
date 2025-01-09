import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { startLoading, finishLoading } from "../../actions/progressAction";

import { MovieCard } from "../movie-card/movie-card";

export const ActorsView = ({ favourites = [], onToggleFavourite }) => {
    const { name } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                dispatch(startLoading());
                setLoading(true);

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
            } finally {
                setLoading(false);
                dispatch(finishLoading());
            }
        };

        fetchMovies();
    }, [name, dispatch]);

    return (
        <>
            <h3>Movies with "{name}"</h3>
            {error && <p>{error}</p>}
            <Row className="g-3 mb-5 d-flex justify-content-center">
                {loading ? (
                    // Spinner while loading
                    <Col xs="auto">
                        <Spinner animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                ) : (
                    movies.map((actorMovie) => (
                        <Col key={actorMovie.id} sm={6} md={4} lg={3}>
                            <MovieCard
                                movie={actorMovie}
                                isFavourite={favourites.some(fav => fav.movieId === actorMovie.id)}
                                onToggleFavourite={onToggleFavourite}
                            />
                        </Col>
                    ))
                )}
            </Row>
        </>
    );
};

ActorsView.propTypes = {
    favourites: PropTypes.arrayOf(
        PropTypes.shape({
            movieId: PropTypes.string.isRequired,
        })
    ).isRequired,
    onToggleFavourite: PropTypes.func.isRequired,
};