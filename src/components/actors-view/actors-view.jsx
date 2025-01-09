import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { startLoading, finishLoading } from "../../actions/progressAction";

import { MovieCard } from "../movie-card/movie-card";

export const ActorsView = ({ favourites = [], onToggleFavourite }) => {
    const { name } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [actor, setActor] = useState(null);

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
                    setActor({
                        name: data.name,
                        role: data.roles.map(movie => movie.role).join(", ")
                    });
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
            {actor ? (
                <div className="dark mb-4 center">
                    <h3 className="mb-5">"{actor.name}"</h3>
                    {movies.map((actorMovie) => (
                        <div key={actorMovie.id} className="mb-3">
                            <p>In&nbsp;<Link className="font-weight-bold inlineLink" to={`/movies/${actorMovie.id}`}>"{actorMovie.title}"</Link>
                                &nbsp;as&nbsp;"{actorMovie.role}" </p>
                        </div>

                    ))}
                </div>
            ) : (
                <p>Actor information is unavailable.</p>
            )}
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