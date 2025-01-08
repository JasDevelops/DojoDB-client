import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";

import { MovieCard } from "../movie-card/movie-card";

export const SearchResultsView = ({ favourites = [], allMovies, onToggleFavourite }) => {
    const { searchTerm } = useParams();
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchTerm) {
                setError("Search term is empty.");
                setSearchResults([]);
                return;
            }
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/search/${encodeURIComponent(searchTerm)}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        setError(`No results found for "${searchTerm}".`);
                        setSearchResults([]);
                        return;
                    }
                    console.error(`Error: ${response.status} - ${response.statusText}`);
                    setError(`Error fetching search results: ${response.statusText}`);
                    return;
                }
                const data = await response.json();
                if (response.ok && Array.isArray(data) && data.length > 0) {
                    const updatedResults = data.map(movie => ({
                        ...movie,
                        id: movie._id,
                    }));
                    setSearchResults(updatedResults);
                    setError("");
                } else {

                    setSearchResults([]);
                    setError(`No results found for "${searchTerm}".`);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
                setError(`There was an error fetching search results for "${searchTerm}". Please try again later.`);
            }
        };
        if (searchTerm) {
            setError("");
            fetchSearchResults();
        }
    }, [searchTerm]);

    return (
        <>
            <Row className="g-3 mb-5">
                {error ? (
                    <Row>
                        <Col className="h5 center">{error}</Col>
                    </Row>
                ) : (
                    searchResults.length > 0 && (
                        <>
                            <Row>
                                <Col className="mb-3"><h3>Search results for "{searchTerm}":</h3></Col>
                            </Row>
                            {searchResults.map((searchMovie) => (
                                <Col key={searchMovie.id} xs={12} sm={6} md={4} lg={3}>
                                    <MovieCard
                                        movie={searchMovie}
                                        isFavourite={favourites.some(fav => fav.movieId === searchMovie.id)}
                                        onToggleFavourite={onToggleFavourite}
                                    />
                                </Col>
                            ))}
                        </>
                    )
                )}
            </Row>
        </>
    );
};
SearchResultsView.propTypes = {
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