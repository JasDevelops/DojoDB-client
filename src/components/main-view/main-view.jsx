import { useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([
        {
            id: 1,
            title: "Enter the Dragon",
            description: "Bruce Lee stars as a martial artist recruited by a secret British agency to infiltrate a crime lord's island fortress for a deadly tournament. This classic is one of the most influential martial arts films ever.",
            genre: {
                name: "Action",
                description: "High-energy films packed with intense fight scenes, fast-paced choreography, and adrenaline-pumping sequences that showcase the power and skill of martial artists in combat.",
            },
            image: {
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Saxon_and_Kelly.jpg",
                imageAttribution: "Public domain, via Wikimedia Commons",
            },
            featured: true,
            director: {
                name: "Robert Clouse",
                bio: "Robert Clouse was an American film director, best known for his martial arts films, most notably Enter the Dragon.",
                birthYear: 1928,
                deathYear: 1997,
            },
        },
        {
            id: 2,
            title: "Drunken Master",
            description: "Jackie Chan stars as a young man who learns the unconventional Drunken Fist style of kung fu. The film mixes humor with martial arts in a unique blend that became a hallmark of Chan's career.",
            genre: {
                name: "Action",
                description: "High-energy films packed with intense fight scenes, fast-paced choreography, and adrenaline-pumping sequences that showcase the power and skill of martial artists in combat.",
            },
            image: {
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/7/77/Yueng_Siu-tien.jpg",
                imageAttribution: "Yueng Siu-tien by Yuen Siu-tien, licensed under CC BY-SA 4.0",
            },
            featured: true,
            director: {
                name: "Yuen Woo-Ping",
                bio: "Yuen Woo-ping is a Hong Kong martial arts film director, choreographer, and producer. He is renowned for his work on action choreography in films like The Matrix and Crouching Tiger, Hidden Dragon.",
                birthYear: 1945,
            },
        },
        {
            id: 3,
            title: "Crouching Tiger, Hidden Dragon",
            description: "This epic film tells the story of a stolen sword, forbidden love, and a martial arts journey. It blends action with deep emotional storytelling.",
            genre: {
                name: "Action",
                description:  "High-energy films packed with intense fight scenes, fast-paced choreography, and adrenaline-pumping sequences that showcase the power and skill of martial artists in combat.",
            },
            image: {
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Maruyama_Okyo_-_Tiger_and_Dragon%2C_Tiger_-_81.693.1_-_Detroit_Institute_of_Arts.jpg",
                imageAttribution: "Maruyama Ōkyo, Public domain, via Wikimedia Commons",
            },
            featured: true,
            director: {
                name: "Ang Lee",
                bio: "Ang Lee is a Taiwanese-American filmmaker known for his versatile approach to storytelling. His work often explores themes of identity and human emotion.",
                birthYear: 1954,
            },
        },
    ]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    
    if (selectedMovie) {
    return (
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
    }
    if (movies.length === 0) {
    return <div>The list is empty!</div>;
    }

    return (
        <div>
        {movies.map((movie) => (
        <MovieCard
            key={movie.id}
            movie={movie}
            onMovieClick={(newSelectedMovie) => {
                setSelectedMovie(newSelectedMovie);
            }}
        />
        ))}
    </div>
    );
};
export default MainView;