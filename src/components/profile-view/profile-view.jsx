import { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, movies, onLogout, favourites, onRemoveFromFavourites }) => {
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    const [newInfo, setNewInfo] = useState({
        username: user.username || '',
        email: user.email || '',
        birthday: user.birthday || '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch user profile and favourites
    useEffect(() => {
        console.log("useEffect is running");

        const fetchProfile = async () => {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const storedToken = localStorage.getItem("token");

            if (!storedUser || !storedToken) {
                setError("User or token is missing. Please log in again.");
                return;
            }

            const username = storedUser.username;
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${username}`, {
                    headers: { "Authorization": `Bearer ${storedToken}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile.");
                }

                const data = await response.json();
                const { user } = data;

                console.log("Fetched user:", user);
                console.log("Movies array:", movies);
                console.log("User's favourites:", user.favourites);

                setProfile(user);

                // Populate favouriteMovies
                const favouriteMoviesList = movies.filter(movie =>
                    user.favourites.includes(String(movie.id))
                );
                console.log("Favourite Movies List:", favouriteMoviesList);

                setFavouriteMovies(favouriteMoviesList);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [movies,user]);

    // Handle profile update on form submission
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        if (newInfo.password && newInfo.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const updatedData = { ...newInfo };
        if (!updatedData.password) {
            delete updatedData.password;
        }

        const token = localStorage.getItem("token");
        setLoading(true);

        try {
            const response = await fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile.");
            }

            const updatedProfile = await response.json();
            setProfile(updatedProfile);
            setEditing(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle removing a movie from favourites
    const handleRemoveFromFavourites = (movieID) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}/favourites/${movieID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to remove movie from favourites");
                }
                return response.json();
            })
            .then(() => {
                setLoading(false);
                setFavouriteMovies(favouriteMovies.filter(m => m.id !== movieID));
            })
            .catch(error => {
                setLoading(false);
                setError(error.message);
            });
    };

    // Delete account handler
    const deleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            setLoading(true);
            const token = localStorage.getItem("token");

            fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${profile.username}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to delete account.");
                    }
                    return response.json();
                })
                .then(() => {
                    setLoading(false);
                    onLogout();
                    navigate("/signup");
                })
                .catch(error => {
                    setLoading(false);
                    setError(error.message);
                });
        }
    };

    // Handle logout
    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    return (
        <Row className="justify-content-center">
            <Col md={8}>
                <Card>
                    <Card.Body>
                        <h2>User Profile</h2>
                        {loading && <div>Loading...</div>}
                        {error && <div style={{ color: 'red' }}>{error}</div>}
                        {!editing ? (
                            <>
                                <p><strong>Username:</strong> {profile.username}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Birthday:</strong> {profile.birthday}</p>
                                <h3>Favourite Movies</h3>
                                <Row>
                                    {favouriteMovies.length > 0 ? (
                                        favouriteMovies.map(movie => (
                                            <Col key={movie.id} md={4}>
                                                <MovieCard
                                                    movie={movie}
                                                    isFavourite
                                                    onRemove={() => handleRemoveFromFavourites(movie.id)}
                                                />
                                            </Col>
                                        ))
                                    ) : (
                                        <p>You have no favourite movies yet. Add some from the movie list!</p>
                                    )}
                                </Row>
                                <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
                                <Button variant="danger" onClick={deleteAccount}>Delete Account</Button>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Form onSubmit={handleProfileUpdate}>
                                    <Form.Group controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={newInfo.username}
                                            onChange={e => setNewInfo({ ...newInfo, username: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={newInfo.email}
                                            onChange={e => setNewInfo({ ...newInfo, email: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="birthday">
                                        <Form.Label>Birthday</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={newInfo.birthday}
                                            onChange={e => setNewInfo({ ...newInfo, birthday: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="New password"
                                            value={newInfo.password}
                                            onChange={e => setNewInfo({ ...newInfo, password: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="confirmPassword">
                                        <Form.Label>Confirm New Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button variant="success" type="submit">Save Changes</Button>
                                    <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
                                </Form>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};
