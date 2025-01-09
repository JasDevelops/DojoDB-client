import { useState, useEffect } from "react";
import { Row, Col, Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams, Link } from "react-router-dom";

import { NavigationBar } from "../navigation-bar/navigation-bar";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { SearchResultsView } from "../searchresults-view/searchresults-view";
import { ReleaseYear } from "../releaseyear-view/releaseyear-view";
import { ActorsView } from "../actors-view/actors-view";
import { DirectorsView } from "../directors-view/directors-view";
import { GenreView } from "../genre-view/genre-view";

import { useDispatch, useSelector } from "react-redux";
import { startLoading, finishLoading } from "../../actions/progressAction";

export const MainView = () => {
    console.log("MainView rendered");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [allMovies, setAllMovies] = useState([]);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);
    const [favourites, setFavourites] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const { movieID } = useParams();
    const [error, setError] = useState("");
    const [genreFilter, setGenreFilter] = useState("");
    const [releaseYearFilter, setReleaseYearFilter] = useState("");
    const [directorFilter, setDirectorFilter] = useState("");
    const [actorFilter, setActorFilter] = useState("");
    const [titleFilter, setTitleFilter] = useState("");
    const [genres, setGenres] = useState([]);
    const [releaseYears, setReleaseYears] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);

    const dispatch = useDispatch();

    const getUniqueSimilarMovies = (movies) => {
        return Array.from(new Set(movies.map(movie => movie.id)))
            .map(id => movies.find(movie => movie.id === id));
    };

    const handleProfileUpdate = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    const filterMovies = (movies) => {
        return movies.filter(movie => {
            return (
                (genreFilter ? movie.genre.name.toLowerCase().includes(genreFilter.toLowerCase()) : true) &&
                (releaseYearFilter ? movie.releaseYear === Number(releaseYearFilter) : true) &&
                (directorFilter ? movie.director.name.toLowerCase().includes(directorFilter.toLowerCase()) : true) &&
                (actorFilter ? movie.actors && movie.actors.some(actor => actor.name.toLowerCase().includes(actorFilter.toLowerCase())) : true) &&
                (titleFilter ? movie.title.toLowerCase().includes(titleFilter.toLowerCase()) : true)
            );
        });
    };
//Spinner
useEffect(() => {
    const loadTimeout = setTimeout(() => {
        console.log("Simulated loading timeout triggered");
        dispatch(finishLoading()); 
    }, 1000); 

    return () => clearTimeout(loadTimeout); 
}, []); 

    useEffect(() => {
        if (!token || !user) return;

        const fetchData = async () => {
            try {
                console.log("Fetching data...");

                // Start loading (progress )
                dispatch(startLoading());

                // Fetch movies
                const moviesResponse = await fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies", {
                    headers: {
                        "Authorization": `Bearer ${storedToken}`,
                        "Content-Type": "application/json"
                    },
                });
                const moviesData = await moviesResponse.json();
                const moviesFromApi = moviesData.map((movie) => ({
                    id: movie._id.toString(),
                    title: movie.title,
                    description: movie.description,
                    genre: {
                        name: movie.genre.name,
                        description: movie.genre.description,
                    },
                    image: movie.image,
                    director: { name: movie.director.name },
                    actors: movie.actors,
                    releaseYear: movie.releaseYear,
                }));

                // Fetch favourites
                const favouritesResponse = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}`, {
                    headers: {
                        "Authorization": `Bearer ${storedToken}`,
                        "Content-Type": "application/json"
                    },
                });

                const favouritesData = await favouritesResponse.json();
                const favouritesList = Array.isArray(favouritesData.user.favourites)
                    ? favouritesData.user.favourites
                    : [];
                const updatedMovies = moviesFromApi.map((movie) => ({
                    ...movie,
                    isFavourite: favouritesList.some((fav) => fav.movieId.toString() === movie.id),
                }));

                setFavourites(Array.isArray(favouritesList) ? favouritesList : []);
                setAllMovies(updatedMovies);
                setSimilarMovies(getUniqueSimilarMovies(moviesFromApi.slice(0, 3)));
                setError("");

                //Filter
                const genres = [...new Set(moviesFromApi.map(movie => movie.genre.name))].sort();
                const releaseYears = [...new Set(moviesFromApi.map(movie => movie.releaseYear))].sort((a, b) => a - b);
                const directors = [...new Set(moviesFromApi.map(movie => movie.director.name))].sort();
                const actors = [...new Set(moviesFromApi.flatMap(movie => movie.actors.map(actor => actor.name)))].sort();

                setGenres(genres);
                setReleaseYears(releaseYears);
                setDirectors(directors);
                setActors(actors);

            } catch (error) {
                console.error("Error fetching data:", error);
                setError(`There was an error fetching the data.`);
            } finally {
                console.log("Data fetching finished, setting loading to false...");
                dispatch(finishLoading());
            }
        };
        fetchData();
    }, [token, user, dispatch]);
    // Toggle Favourite
    const toggleFavourite = async (movieID, isFavourite) => {
        const endpoint = `https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`;
        const method = isFavourite ? "DELETE" : "PUT";

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    "Authorization": `Bearer ${storedToken}`,
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) throw new Error(`Failed to update favourites: ${response.status}`);

            const updatedFavourites = await response.json();

            // Update favourites
            setFavourites(updatedFavourites.favourites);
            setAllMovies((prevMovies) =>
                prevMovies.map((movie) =>
                    movie.id === movieID
                        ? { ...movie, isFavourite: !isFavourite }
                        : movie
                )
            );
        } catch (error) {
            alert("An error occurred while updating your favourites.");
        }
    };

    // Login
    const handleLogin = (user, token) => {
        console.log('Logging in user:', user);
        console.log('Token:', token);
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    // Logout
    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };
    const loading = useSelector((state) => state.loading);

    return (
        <BrowserRouter>
            <NavigationBar user={user} onLoggedOut={handleLogout} />
            {loading ? (
                <Row className="justify-content-center">
                    <Col xs="auto">
                        <Spinner animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                </Row>
            ) : (
                <Routes>
                    {/* Login */}
                    <Route path="/login" element={user ? (<Navigate to="/" replace/>) : (<Col>
                        <LoginView onLoggedIn={handleLogin} /></Col>)}
                    />
                    {/* Signup */}
                    <Route path="/signup" element={user ? (<Navigate to="/" replace/>) : (<Col>
                        <SignupView /></Col>)}
                    />
                    {/* Search */}
                    <Route path="/search/:searchTerm" element={user ? (
                        <SearchResultsView
                            allMovies={allMovies}
                            favourites={favourites}
                            onToggleFavourite={toggleFavourite}
                        />
                    ) : (<Navigate to="/login" replace />)}
                    />
                    {/* Profile */}
                    <Route path="/profile" element={user ? (
                        <ProfileView
                            user={user}
                            movies={allMovies}
                            favourites={favourites}
                            onLogout={handleLogout}
                            onRemove={toggleFavourite}
                            onProfileUpdate={handleProfileUpdate}
                        />
                    ) : (<Navigate to="/login" />)}
                    />
                    {/* Movie Details */}
                    <Route path="/movies/:movieID" element={user ? (
                        <MovieView
                            allMovies={allMovies}
                            user={user}
                            favourites={favourites}
                            onToggleFavourite={toggleFavourite}
                            similarMovies={similarMovies}
                        />
                    ) : (<Navigate to="/login" replace />)}
                    />
                    {/* Home */}
                    <Route path="/" element={user ? (
                        allMovies.length === 0 ? (
                            <Col><h3>The list is empty!</h3></Col>
                        ) : (
                            // filter
                            <Row>
                                {/* 1st Filter Row */}
                                <Row className="g-3 d-flex justify-content-between">
                                    <Col sm={12} md={3} lg={2} className="d-flex justify-content-md-start mb-3">
                                        {/* Genre Filter */}
                                        <DropdownButton
                                            id="genre-filter"
                                            title="Filter by Genre"
                                            onSelect={(value) => setGenreFilter(value)}
                                            value={genreFilter}
                                            variant="outline-dark"
                                        >
                                            <Dropdown.Item eventKey="">All Genres</Dropdown.Item>
                                            {genres.map((genre, index) => (
                                                <Dropdown.Item key={index} eventKey={genre}>{genre}</Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                    <Col sm={12} md={3} lg={2} className="d-flex justify-content-sm-start justify-content-md-center mb-3">
                                        {/* Release Year Filter */}
                                        <DropdownButton
                                            id="release-year-filter"
                                            title="Filter by Year"
                                            onSelect={(value) => setReleaseYearFilter(value)}
                                            value={releaseYearFilter}
                                            variant="outline-dark"
                                        >
                                            <Dropdown.Item eventKey="">All Years</Dropdown.Item>
                                            {releaseYears.map((year, index) => (
                                                <Dropdown.Item key={index} eventKey={year}>{year}</Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                    <Col sm={12} md={3} lg={2} className="d-flex justify-content-sm-start justify-content-md-center mb-3">
                                        {/* Director Filter */}
                                        <DropdownButton
                                            id="director-filter"
                                            title="Filter by Director"
                                            onSelect={(value) => setDirectorFilter(value)}
                                            value={directorFilter}
                                            variant="outline-dark"
                                        >
                                            <Dropdown.Item eventKey="">All Directors</Dropdown.Item>
                                            {directors.map((director, index) => (
                                                <Dropdown.Item key={index} eventKey={director}>{director}</Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                    <Col sm={12} md={3} lg={2} className="d-flex justify-content-sm-start justify-content-md-end mb-3">
                                        {/* Actor Filter */}
                                        <DropdownButton
                                            id="actor-filter"
                                            title="Filter by Actor"
                                            onSelect={(value) => {
                                                console.log(value);
                                                setActorFilter(value)
                                            }}
                                            value={actorFilter}
                                            variant="outline-dark"
                                        >
                                            <Dropdown.Item eventKey="">All Actors</Dropdown.Item>
                                            {actors.map((actor, index) => (
                                                <Dropdown.Item key={index} eventKey={actor}>{actor}</Dropdown.Item>
                                            ))}
                                        </DropdownButton>
                                    </Col>
                                </Row>
                                {/* 2nd Filter Row */}
                                <Row className="g-3 mb-3 d-flex justify-content-between">
                                    <Col sm={12} md={6} className="d-flex justify-content-md-start">
                                        {/* Title Filter */}
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by title"
                                            value={titleFilter}
                                            onChange={(e) => setTitleFilter(e.target.value)}
                                        />
                                    </Col>
                                    {/* Clear All Filters Row */}
                                    <Col sm={12} md={6} className="d-flex justify-content-sm-start justify-content-md-end">
                                        {/* clear Filter */}
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => {
                                                setGenreFilter("");
                                                setReleaseYearFilter("");
                                                setDirectorFilter("");
                                                setActorFilter("");
                                                setTitleFilter("");
                                            }}
                                        >
                                            Clear All Filters <i className="bi bi-x"></i>
                                        </button>
                                    </Col>
                                </Row>
                                {/* breadcrumbs */}
                                <Row className="g-3 d-flex justify-content-center">
                                    {genreFilter || releaseYearFilter || directorFilter || actorFilter || titleFilter ? (
                                        <Row>
                                            <h2>Results for applied filters:</h2>
                                            <Col className="g-3 mb-3 d-flex justify-content-center">
                                                <nav aria-label="breadcrumb">
                                                    <ol className="breadcrumb">
                                                        {genreFilter && (
                                                            <li className="breadcrumb-item">
                                                                <span className="font-weight-bold">Genre: </span>
                                                                <Link to={`/genres/${genreFilter}`}>{genreFilter}</Link>
                                                                <button className="btn btn-link" onClick={() => setGenreFilter("")}><i className="bi bi-x"></i>
                                                                </button>
                                                            </li>
                                                        )}
                                                        {releaseYearFilter && (
                                                            <li className="breadcrumb-item">
                                                                <span className="font-weight-bold">Year: </span>
                                                                <Link to={`/movies/release-year/${releaseYearFilter}`}>{releaseYearFilter}</Link>
                                                                <button className="btn btn-link" onClick={() => setReleaseYearFilter("")}><i className="bi bi-x"></i></button>
                                                            </li>
                                                        )}
                                                        {directorFilter && (
                                                            <li className="breadcrumb-item">
                                                                <span className="font-weight-bold">Director: </span>
                                                                <Link to={`/directors/${directorFilter}`}>{directorFilter}</Link>
                                                                <button className="btn btn-link" onClick={() => setDirectorFilter("")}><i className="bi bi-x"></i></button>
                                                            </li>
                                                        )}
                                                        {actorFilter && (
                                                            <li className="breadcrumb-item">
                                                                <span className="font-weight-bold">Actor: </span>
                                                                <Link to={`/actors/${actorFilter}`}>{actorFilter}</Link>
                                                                <button className="btn btn-link" onClick={() => setActorFilter("")}><i className="bi bi-x"></i></button>
                                                            </li>
                                                        )}
                                                        {titleFilter && (
                                                            <li className="breadcrumb-item">
                                                                <span className="font-weight-bold">{`Title: ${titleFilter}`}</span>
                                                                <button className="btn btn-link" onClick={() => setTitleFilter("")}><i className="bi bi-x"></i></button>
                                                            </li>
                                                        )}
                                                    </ol>
                                                </nav>
                                            </Col>
                                        </Row>
                                    ) : null}
                                </Row>
                                {/* no movies for filter */}
                                {filterMovies(allMovies).length === 0 ? (
                                    <Row className="g-3 mb-5 d-flex justify-content-center">
                                        <Col><h3>No movies for the applied filters found!</h3></Col>
                                    </Row>
                                ) : (
                                    // filtered movies
                                    <Row className="g-3 mb-5 d-flex justify-content-center">
                                        {filterMovies(allMovies).map((movie) => (
                                            <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
                                                <MovieCard
                                                    movie={movie}
                                                    isFavourite={
                                                        Array.isArray(favourites) &&
                                                        favourites.some(fav => fav.movieId.toString() === movie.id.toString())
                                                    }
                                                    onToggleFavourite={(movieId, isFavourite) => toggleFavourite(movieId, isFavourite)}
                                                />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Row>
                        )
                    ) : (<Navigate to="/login" replace />)}
                    />

                    {/* ReleaseYear */}
                    <Route path="/movies/release-year/:year" element={user ? (
                        <Row className="g-3 mb-5">
                            <ReleaseYear
                                allMovies={allMovies}
                                favourites={favourites}
                                onToggleFavourite={toggleFavourite}
                            />
                        </Row>
                    ) : (<Navigate to="/login" replace />)}
                    />

                    {/* Actor */}
                    <Route path="/actors/:name" element={user ? (
                        <Row className="g-3 mb-5">
                            <ActorsView
                                allMovies={allMovies}
                                favourites={favourites}
                                onToggleFavourite={toggleFavourite}
                            />
                        </Row>
                    ) : (<Navigate to="/login" replace />)}
                    />

                    {/* Director */}
                    <Route path="/directors/:name" element={user ? (
                        <Row className="g-3 mb-5">
                            <DirectorsView
                                allMovies={allMovies}
                                favourites={favourites}
                                onToggleFavourite={toggleFavourite}
                            />
                        </Row>
                    ) : (<Navigate to="/login" replace />)}
                    />

                    {/* Genre */}
                    <Route path="/genres/:name" element={user ? (
                        <Row className="g-3 mb-5">
                            <GenreView
                                allMovies={allMovies}
                                favourites={favourites}
                                onToggleFavourite={toggleFavourite}
                            />
                        </Row>
                    ) : (<Navigate to="/login" replace />)}
                    />
                </Routes>
            )}
        </BrowserRouter>
    );
};

export default MainView;
