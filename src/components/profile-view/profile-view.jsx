import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./profile-view.scss";

import { Row, Col, Button, Form, Card, Collapse, FloatingLabel, Alert } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";

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
    const handleRemoveFromFavourites = (movieID) => {
        if (!username) {
            console.error("Username is not defined!");
            return;
        }
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
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${storedToken}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch profile.");
                }

                const data = await response.json();
                const { user } = data;

                setProfile(user);
                setNewInfo({
                    username: user.username,
                    email: user.email,
                    birthday: user.birthday,
                    password: "",
                });

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

    // Update the username state 
    useEffect(() => {
        if (user && user.username !== username) {
            setUsername(user.username);
        }
    }, [user]);

    const handleProfileUpdate = (e) => {
        e.preventDefault();

        if (newInfo.password && newInfo.password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError(null);

        const updatedData = {
            newUsername: newInfo.username || undefined,
            newEmail: newInfo.email || undefined,
            newPassword: newInfo.password || undefined,
            newBirthday: newInfo.birthday || undefined,
            favourites: newInfo.favourites || []
        };
        if (newInfo.username !== profile.username) {
            updatedData.username = newInfo.username;
        }
        if (newInfo.email !== profile.email) {
            updatedData.email = newInfo.email;
        }
        if (newInfo.birthday !== profile.birthday) {
            updatedData.birthday = newInfo.birthday;
        }
        if (newInfo.password) {
            updatedData.password = newInfo.password;
        }

        if (Object.keys(updatedData).length === 0) {
            setError("No changes detected.");
            setLoading(false);
            return;
        }

        const usernameToUse = profile.username || newInfo.username;

        fetch(`https://dojo-db-e5c2cf5a1b56.herokuapp.com/users/${profile.username}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then(response => response.ok ? response.json() : Promise.reject("Failed to update"))
            .then(updatedUser => {
                setProfile(updatedUser.user);
                setEditing(false);
                setNewInfo({
                    username: updatedUser.user.username,
                    email: updatedUser.user.email,
                    birthday: updatedUser.user.birthday,
                    password: "",
                });
                onProfileUpdate(updatedUser.user);
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    };

    // Delete account 
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
        <>
            <Row className="justify-content-center profileView mb-5" >
                <h1 className="my-4">User Profile</h1>
                <Col md={12}>
                    {error && <Alert variant="info">{error}</Alert>}
                    {!editing ? (
                        <>
                            <Row>
                                <Col md={8} className="align-items-left mb-4 flex-grow-1">
                                    <p><strong>Username:</strong> {profile.username}</p>
                                    <p><strong>Email:</strong> {profile.email}</p>
                                    <p><strong>Birthday:</strong> {profile.birthday ? formatDate(profile.birthday) : "Not provided"}</p>
                                </Col>
                                <Col md={4} className="align-items-center">
                                    <div ><Button variant="secondary" className="m-2" onClick={() => setEditing(true)}>Edit Profile</Button></div>
                                    <div > <Button variant="outline-light" className="m-2" nClick={deleteAccount}>Delete Account</Button></div>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        <>
                            <Form onSubmit={handleProfileUpdate}>
                                <FloatingLabel controlId="username" label="Username" className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your username"
                                        value={newInfo.username}
                                        onChange={(e) => setNewInfo({ ...newInfo, username: e.target.value })}
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="email" label="Email" className="mb-3">
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter your email"
                                        value={newInfo.email}
                                        onChange={(e) => setNewInfo({ ...newInfo, email: e.target.value })}
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="birthday" label="Birthday" className="mb-3">
                                    <Form.Control
                                        type="date"
                                        placeholder="Enter your birthday"
                                        value={newInfo.birthday || profile.birthday?.slice(0, 10) || ""}
                                        onChange={(e) => setNewInfo({ ...newInfo, birthday: e.target.value })}
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="password" label="New Password" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="New password"
                                        value={newInfo.password}
                                        onChange={(e) => setNewInfo({ ...newInfo, password: e.target.value })}
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="confirmPassword" label="Confirm New Password" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </FloatingLabel>

                                <Row className="justify-content-center mt-5">
                                    <Col xs={12} md={6} lg={4} className="mx-auto">
                                        <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </Col>
                                    <Col xs={12} md={6} lg={4} className="mx-auto">
                                        <Button variant="secondary" onClick={() => setEditing(false)}>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>;
                        </>
                    )}
                </Col>
            </Row>

            <Row className="g-3 text-center uppercase">
                <h3  className="my-4">Favourite Movies</h3>
                {favouriteMovies.length > 0 ? (
                    favouriteMovies.map(movie => (
                        <Col key={movie.id} md={4} xs={12} sm={6} lg={3}>
                            <Card className="h-100">
                                <div className="image-container">
                                    <Card.Img variant="top" src={movie.image.imageUrl} alt={movie.title} loading="lazy" />
                                </div>
                                <Card.Body>
                                    <Card.Title>
                                        <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
                                    </Card.Title>
                                </Card.Body>
                                <Button
                                    variant="dark"
                                    onClick={() => handleRemoveFromFavourites(movie.id)}
                                >
                                    <i className="bi bi-heart-fill"></i>
                                </Button>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="uppercase">You have no favourite movies yet. Add some from the movie list!
                    <br/>  <i class="bi bi-search-heart-fill"></i>

                    </p>
                )}
            </Row>

        </>
    );
}
ProfileView.propTypes = {
    user: PropTypes.object.isRequired,
    movies: PropTypes.array.isRequired,
    onLogout: PropTypes.func.isRequired,
    favourites: PropTypes.array.isRequired,
    onRemove: PropTypes.func.isRequired,
    onProfileUpdate: PropTypes.func.isRequired,
};
