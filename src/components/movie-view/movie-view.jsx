import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Col, Row, Button, Figure } from "react-bootstrap";
import PropTypes from "prop-types";

import { MovieCard } from "../movie-card/movie-card";
import "./movie-view.scss";

export const MovieView = ({ allMovies, favourites, onToggleFavourite }) => {
    const { movieID } = useParams();
    const movie = allMovies.find(movie => movie.id === movieID);

    if (!movie) {
        return <Col><h3>Loading...</h3></Col>;
    }
    const isFavourite = favourites.some(fav => fav.movieId === movie.id);

    const handleToggleFavourite = () => {
        onToggleFavourite(movie.id, isFavourite);
    };
    // Similar movies 
    const similarMovies = allMovies
        .filter(simMovie => simMovie.id !== movie.id)
        .slice(0, 3);

    return (
        <div className="movieView d-flex flex-column h-100">
            <Row>
                <Col>
                    <h1 className="my-4">{movie.title}</h1>
                </Col>
            </Row>
            <Row className="align-items-center movieDetails mb-4 flex-grow-1">
                <Col md={4}>
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
                        <Figure.Caption>
                            <span className="font-weight-bold small">Image from </span>
                            {movie.image?.imageAttribution || "N/A"}
                        </Figure.Caption>
                    </Figure>
                </Col>
                <Col md={8}>
                <Row>
                        <Col xs={6} className="d-flex justify-content-start">
                            <div>
                                <span className="font-weight-bold small">Genre: </span>
                                <span>{movie.genre.name}</span>
                            </div>
                        </Col>
                        <Col xs={6}className="d-flex justify-content-end">
                            <div>
                                <span className="font-weight-bold small">Release Year: </span>
                                <span>{movie.releaseYear}</span>
                            </div>
                        </Col>
                    </Row>
                    <div className="uppercase mb-4">
                        <span>{movie.description}</span>
                    </div>
                    <div className="actors mb-3">
                        <span>
                            {movie.actors && movie.actors.length > 0 ? (
                                movie.actors.map((actor, index) => (
                                    <span key={index}>
                                        {actor.name} as "{actor.role}"
                                    </span>
                                ))
                            ) : (
                                <span>N/A</span>
                            )}
                        </span>
                    </div>
                    <div className="directors mb-4">
                        <span>directed by {movie.director.name}</span>
                    </div>

                    <div className="d-flex justify-content-end">
                    <Button
                        variant={isFavourite ? "dark" : "dark"}
                        onClick={handleToggleFavourite}
                        className="ms-3"
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

        <div className="d-flex justify-content-end mb-3">
            <Link to="/" className="back-btn">
                <Button variant="primary">Back</Button>
            </Link>
        </div>
            <Row>
                <h3 className="my-4">Similar Movies</h3>
                <Row>
                    {similarMovies.map(similarMovie => {
                        const isFavourite = favourites.some(fav => fav.movieId === similarMovie.id);
                        return (
                            <Col key={similarMovie.id} md={4} className="mb-4">
                                <MovieCard
                                    movie={similarMovie}
                                    isFavourite={isFavourite}
                                    onToggleFavourite={onToggleFavourite}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </Row>
        </div>
    );
};

MovieView.propTypes = {
    allMovies: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            genre: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            title: PropTypes.string.isRequired,
            image: PropTypes.shape({
                imageUrl: PropTypes.string,
                imageAttribution: PropTypes.string,
            }),
            description: PropTypes.string.isRequired,
            director: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }).isRequired,
            releaseYear: PropTypes.number.isRequired,
        })
    ),
    favourites: PropTypes.array.isRequired,
    onToggleFavourite: PropTypes.func.isRequired,
};