import { useState, useEffect } from "react";
import { Row, Col, Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const ProfileView = ({ user, movies, onLogout, favourites, onRemove, onProfileUpdate }) => {
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState(user.username || null);

    const [newInfo, setNewInfo] = useState({
        username: user.username || "",
        email: user.email || "",
        birthday: user.birthday || "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        };
   // Update the username state whenever the user prop changes (e.g., when the username is updated)
   useEffect(() => {
    if (user && user.username !== username) {
        setUsername(user.username);
    }
}, [user]);

// Handle removing a movie from favourites
const handleRemoveFromFavourites = (movieID) => {
    if (!username) {
        console.error("Username is not defined!");
        return;
    }

    // Continue with your fetch or API call to remove the movie
    const token = localStorage.getItem("token");

    fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${username}/favourites/${movieID}`, {
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
            // Update the favouriteMovies after deletion
            setFavouriteMovies(favouriteMovies.filter(m => String(m.id) !== String(movieID)));
        })
        .catch(error => {
            setLoading(false);
            setError(error.message);
        });
};
 
    // Fetch user profile and favourites
    useEffect(() => {
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
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile.");
                }

                const data = await response.json();
                const { user } = data;

                setProfile(user);

                // Populate favouriteMovies
                const favouriteMoviesList = movies.filter(movie =>
                    user.favourites.some(fav => String(fav.movieId) === String(movie.id))
                );
                setFavouriteMovies(favouriteMoviesList);
                
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [movies, user]);

    const handleProfileUpdate = () => {
        if (newInfo.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null);

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${user.username}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newInfo),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to update profile");
                return response.json();
            })
            .then((updatedUser) => {
                onProfileUpdate(updatedUser);
                setEditing(false);
                setNewInfo({ ...newInfo });
            })
            .catch((error) => setError(error.message))
            .finally(() => setLoading(false));
    };
    // Delete account handler
    const deleteAccount = () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            setLoading(true);
            const token = localStorage.getItem("token");

            fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${username}`, {
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
                        {error && <div style={{ color: "red" }}>{error}</div>}
                        {!editing ? (
                            <>
                                <p><strong>Username:</strong> {profile.username}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Birthday:</strong> {profile.birthday ? formatDate(profile.birthday) : 'Not provided'}</p>
                                <h3>Favourite Movies</h3>
                                <Row>
                                    {favouriteMovies.length > 0 ? (
                                        favouriteMovies.map(movie => (
                                            <Col key={movie.id} md={4}>
                                                <div>
                                                <h5>
                        <a href={`/movies/${movie.id}`}>{movie.title}</a>
                    </h5>
                    <Button onClick={() => handleRemoveFromFavourites(movie.id)}>
                        Remove from Favourites
                    </Button>
                                                </div>
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
                                            placeholder={profile.username || 'Enter your username'} 
                                            value={newInfo.username}
                                            onChange={e => setNewInfo({ ...newInfo, username: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder={profile.email || 'Enter your email'}
                                            value={newInfo.email}
                                            onChange={e => setNewInfo({ ...newInfo, email: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="birthday">
                                        <Form.Label>Birthday</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={newInfo.birthday || profile.birthday?.slice(0, 10) || ''}
                                            onChange={e => setNewInfo({ ...newInfo, birthday: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="currentPassword">
                                        <Form.Label>Current Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your current password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="password">
                                        <Form.Label>New Password</Form.Label>
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
