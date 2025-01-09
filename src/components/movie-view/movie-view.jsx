import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Col, Row, Button, Figure, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { startLoading, finishLoading } from "../../actions/progressAction";

import { MovieCard } from "../movie-card/movie-card";
import "./movie-view.scss";

export const MovieView = ({ allMovies, favourites = [], onToggleFavourite }) => {
    const { movieID } = useParams();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const movie = allMovies.find(movie => movie.id === movieID);
    const isFavourite = Array.isArray(favourites) && favourites.some(fav => fav.movieId === movie.id);

    // Similar movies 
    const similarMovies = allMovies
        .filter(simMovie => simMovie.id !== movie.id)
        .slice(0, 3);

    useEffect(() => {
        if (movie) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [movie]);

    const handleToggleFavourite = () => {
        onToggleFavourite(movie.id, isFavourite);
    };

    return (
        <div className="movieView d-flex flex-column h-100">
            {/* Single movie title */}
            <Row>
                <Col>
                    <h1 className="mt-4">{movie.title}</h1>
                    <div className="mb-4 center dark">
                        <p>Directed by <Link to={`/directors/${movie.director.name}`}>{movie.director.name}</Link></p>
                    </div>
                </Col>
            </Row>
            {/* Single Movie Details */}
            <Row className="align-items-center movieDetails mb-4 flex-grow-1">
                <Col md={4} className="p-3">
                    <Figure className="w-100">
                        <Figure.Image
                            width="100%"
                            alt={movie.title}
                            src={
                                movie.image && movie.image.imageUrl
                                    ? movie.image.imageUrl
                                    : "https://placehold.co/600x400/000000/FFF"
                            }
                            className="img-fluid"
                        />
                        <Figure.Caption className="small">
                            <span className="font-weight-bold">Image from: </span>
                            {movie.image?.imageAttribution || "N/A"}
                        </Figure.Caption>
                    </Figure>
                </Col>
                <Col md={8} className="d-flex flex-column justify-content-between">
                    <Row className="d-flex justify-content-between">
                        <Col xs={6} className="d-flex justify-content-start mb-4">
                            <div>
                                <p>
                                    <span className="font-weight-bold">Genre: </span>
                                    <Link to={`/genres/${movie.genre.name}`}>{movie.genre.name}</Link></p>
                            </div>
                        </Col>
                        <Col xs={6} className="d-flex justify-content-end">
                            <div>
                                <p>
                                    <span className="font-weight-bold">Release Year: </span>
                                    <Link to={`/movies/release-year/${movie.releaseYear}`}>{movie.releaseYear}</Link>
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <div className="description my-4 flex-grow-1 d-flex align-items-center">
                        <p>{movie.description}</p>
                    </div>
                    <div className="moreInfo">
                        <div className="actors mb-3">
                            <div>
                                {movie.actors && movie.actors.length > 0 ? (
                                    movie.actors.map((actor, index) => (
                                        <p key={index}>
                                            <span className="font-weight-bold"><Link to={`/actors/${actor.name}`}>{actor.name}</Link></span> as "{actor.role}"
                                            {index < movie.actors.length - 1 && ", "}
                                        </p>
                                    ))
                                ) : (
                                    <p>N/A</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Add/Remove Favourite button */}
                    <div className="d-flex justify-content-end mt-auto">
                        <Button
                            variant={isFavourite ? "dark" : "dark"}
                            onClick={handleToggleFavourite}
                            className="ms-3 btn-heart"
                        >
                            {isFavourite ? (
                                <>
                                    <i className="bi bi-heart-fill"></i>
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-heart"></i>
                                </>
                            )}
                        </Button>
                    </div>
                </Col>
            </Row>
            {/* Back Home button */}
            <div className="d-flex justify-content-end mb-3">
                <Link to="/" className="back-btn">
                    <Button variant="secondary"><i className="bi bi-arrow-left-short"></i>
                        Back</Button>
                </Link>
            </div>
            {/* Similar Movies */}
            <h3>Movies like "{movie.title}"</h3>
            <Row>
                {loading ? (
                    // Spinner while loading
                    <Col xs="auto" className="text-center mt-5">
                        <Spinner animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                ) : similarMovies.length > 0 ? (
                    similarMovies.map((similarMovie) => {
                        const isFavourite = favourites.some(fav => fav.movieId === similarMovie.id);
                        return (
                            <Col key={similarMovie.id} md={4} className="mb-5 g-3 d-flex justify-content-center">
                                <MovieCard
                                    movie={similarMovie}
                                    isFavourite={isFavourite}
                                    onToggleFavourite={onToggleFavourite}
                                />
                            </Col>
                        );
                    })
                ) : (
                    <Col>
                        <p>No similar movies found.</p>
                    </Col>
                )}
            </Row>
        </div>
    );
};



MovieView.propTypes = {
    allMovies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            genre: PropTypes.shape({
                name: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
            }).isRequired,
            image: PropTypes.shape({
                imageUrl: PropTypes.string,
                imageAttribution: PropTypes.string,
            }),
            releaseYear: PropTypes.number.isRequired,
            director: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            actors: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    role: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,

    favourites: PropTypes.arrayOf(
        PropTypes.shape({
            movieId: PropTypes.string.isRequired,
        })
    ).isRequired,

    onToggleFavourite: PropTypes.func.isRequired,
};
