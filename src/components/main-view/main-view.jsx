import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view"; 

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [user, setUser] = useState(storedUser ? storedUser : null);
    const [token, setToken] = useState(storedToken ? storedToken : null);

    useEffect(() => { // Fetch movies if token is available
        if (!token) return; // Don't fetch if there is no token
        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/movies", {
          headers: {
            Authorization: `Bearer ${token}`, // Send token for authentication
          },
        })
        .then ((response) => response.json())
        .then ((data) => {
            const moviesFromApi = data.map((movie) => ({
                id:movie._id,
                title: movie.title,
                description: movie.description,
                genre: {
                    name: movie.genre.name,
                    description:movie.genre.description
                },
                image: {
                    imageUrl: movie.image.imageUrl ,
                    imageAttribution: movie.image.imageAttribution
                },
                featured: true,
                director: {
                    name: movie.director.name,
                    bio: movie.director.bio,
                    birthYear: movie.director.birthYear,
                    deathYear: movie.director.deathYear,
                }
            }));
            setMovies(moviesFromApi); 
        })
        .catch((error) => alert("Error fetching movies: " + error));
    }, [token]); // Only fetch when token changes
    
    const handleMovieClick = (newSelectedMovie) => {
        setSelectedMovie(newSelectedMovie); // Update the selected movie when a similar movie is clicked
    };

    const handleLogin = (user, token) => { // Login
        setUser (user);
        setToken (token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    };

    const handleLogout = () => { // Logout (reset)
        setUser (null);
        setToken (null);
        localStorage.clear ();
    };

    if (!user) { // Show LoginView  and SignupView if no user is logged in
        return (
            <div className="mainView_form">
                < LoginView on onLoggedIn={ handleLogin } /> 
                <p>or</p>
                < SignupView/>
            </div>
        );
    }

    if (selectedMovie) { // Show MovieView, if a movie is selected
    return (
        <MovieView 
        movie={selectedMovie} 
        allMovies={movies} 
        onBackClick={() => setSelectedMovie(null)} 
        onMovieClick={handleMovieClick}
        />
    );
    }

    if (movies.length === 0) { // If no movies a re available
    return <div>The list is empty!</div>;
    }

    return ( // Default view:showing all movie cards
        <div>
        {movies.map((movie) => (
        <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={() => {
                setSelectedMovie(movie); // When a movie card is clicked, set it as the selected movie
            }}
        />
        ))}
    </div>
    );
};
export default MainView;