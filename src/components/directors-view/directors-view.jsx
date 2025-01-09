import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, finishLoading } from "../../actions/progressAction";

import { MovieCard } from "../movie-card/movie-card";

export const DirectorsView = ({ favourites = [], onToggleFavourite }) => {
    const { name } = useParams();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState("");
    const [director, setDirector] = useState(null);
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.loading);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                dispatch(startLoading());

                const token = localStorage.getItem("token");
                const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/directors/${name}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (response.ok && data.movies && data.movies.length > 0) {
                    setDirector({
                        name: data.name,
                        bio: data.bio,
                        birthYear: data.birthYear,
                        deathYear: data.deathYear,
                    });
                    const updatedMovies = data.movies.map(movie => ({
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
                setError(`There was an error fetching movies by director "${name}"`);
            } finally {
                dispatch(finishLoading());
            }
        };

        fetchMovies();
    }, [name, dispatch]);


    return (
        <>
            {director ? (
                <div className="dark mb-4 center">
                    <h3 className="mb-5">"{director.name}"</h3>
                    <p className="mb-4">{director.bio}</p>
                    <p><strong>Born:</strong> {director.birthYear}</p>
                    {director.deathYear && (
                        <p><strong>Died:</strong> {director.deathYear}</p>
                    )}
                </div>
            ) : (
                <p>Director information is unavailable.</p>
            )}
            <h3>Movies directed by "{name}"</h3>
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
                    movies.map((directorMovie) => (

                        <Col key={directorMovie.id} sm={6} md={4} lg={3}>
                            <MovieCard
                                movie={directorMovie}
                                isFavourite={favourites.some(fav => fav.movieId === directorMovie.id)}
                                onToggleFavourite={onToggleFavourite}
                            />
                        </Col>
                    ))
                )}
            </Row>
        </>
    );
};

DirectorsView.propTypes = {
    favourites: PropTypes.arrayOf(PropTypes.shape({
        movieId: PropTypes.string.isRequired,
    })),
    onToggleFavourite: PropTypes.func,
};