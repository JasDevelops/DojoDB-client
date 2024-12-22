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
        <div className="movieView">
            <Row>
                <Col>
                    <h2>{movie.title}</h2>
                </Col>
                <Col md={4}>
                    <Figure className="w-100">
                        <Figure.Image
                            width="100%"
                            alt={movie.title}
                            src={movie.image && movie.image.imageUrl ? movie.image.imageUrl : 'https://placehold.co/600x400/000000/FFF'}
                            className="img-fluid rounded"
                        />

                        <Figure.Caption>
                            <span className="font-weight-bold">Image Attribution: </span>
                            {movie.image?.imageAttribution || 'N/A'}
                        </Figure.Caption>
                    </Figure>
                </Col>
                <Col md={8}>
                    <div className="description mb-4">
                        <span>{movie.description}</span>
                    </div>
                    <div>
                        <span className="font-weight-bold">Director: </span>
                        <span>{movie.director.name}</span>
                    </div>
                    <Row>
                        <Col xs={6}>
                            <div>
                                <span className="font-weight-bold">Genre: </span>
                                <span>{movie.genre.name}</span>
                            </div>
                        </Col>
                        <Col xs={6}>
                            <div>
                                <span className="font-weight-bold">Release Year: </span>
                                <span>{movie.releaseYear}</span>
                            </div>
                        </Col>
                    </Row>
                    <button onClick={handleToggleFavourite}>
                        {isFavourite ? "Remove from Favourites" : "Add to Favourites"}
                    </button>
                    <div className="mt-auto">
                        <Link to="/" className="back-btn">
                            <Button variant="secondary">Back</Button>
                        </Link>
                    </div>
                </Col>
            </Row>

            <h3>Similar Movies</h3>
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
