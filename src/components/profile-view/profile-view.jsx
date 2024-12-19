import { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, onLogout, movies }) => {
    const [profile, setProfile] = useState(user); 
    const [editing, setEditing] = useState(false); 
    const [newInfo, setNewInfo] = useState({
        username: user.username,
        email: user.email,
        birthday: user.birthday,
        password: '', 
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch user favorite movies based on their favorites array
    useEffect(() => {
        const favoriteMoviesList = movies.filter(m => user.FavoriteMovies.includes(m._id));
        setFavoriteMovies(favoriteMoviesList);
    }, [movies, user]);

    // Update user information on form submission
    const handleProfileUpdate = (e) => {
        e.preventDefault();
        if (newInfo.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newInfo),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to update your profile");
            }
            return response.json();
        })
        .then(data => {
            setLoading(false);
            setProfile(newInfo);
            setEditing(false);
        })
        .catch(error => {
            setLoading(false);
            setError(error.message);
        });
    };

    // Handle remove movie from favorites
    const handleRemoveFromFavorites = (movieId) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/favorites/${movieId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to remove movie from favorites");
            }
            return response.json();
        })
        .then(() => {
            setLoading(false);
            setFavoriteMovies(favoriteMovies.filter(m => m._id !== movieId));
        })
        .catch(error => {
            setLoading(false);
            setError(error.message);
        });
    };
// Delete Account
const deleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
        setLoading(true); 
        const token = localStorage.getItem("token");
        const username = user.username;  

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${username}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to delete account.");
            }
            return response.json();
        })
        .then(data => {
            setLoading(false);
            onLogout(); // Log the user out after successful deletion
            navigate("/login"); // Redirect to login page after account deletion
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
        navigate('/login'); // Redirect to login page after logout
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

                                {/* Display Favorite Movies */}
                                <h3>Favorite Movies</h3>
                                <Row>
                                    {favoriteMovies.length > 0 ? (
                                        favoriteMovies.map(movie => (
                                            <Col key={movie._id} md={4}>
                                                <MovieCard
                                                    movie={movie}
                                                    isFavorite
                                                    onRemove={() => handleRemoveFromFavorites(movie._id)}
                                                />
                                            </Col>
                                        ))
                                    ) : (
                                        <p>You have no favorite movies yet.</p>
                                    )}
                                </Row>

                                <Button variant="primary" onClick={() => setEditing(true)}>Edit Profile</Button>
                                <Button variant="danger" onClick={deleteAccount}>Delete Account</Button>
                                <Button variant="danger" onClick={handleLogout}>Logout</Button>
                            </>
                        ) : (
                            <>
                                {/* Edit Profile Form */}
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