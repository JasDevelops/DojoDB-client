import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Row, Col, Button, Form, Card, ListGroup, FloatingLabel, Alert, ListGroupItem } from "react-bootstrap";
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

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

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

        if (!validateEmail(newInfo.email)) {
            setError("Please enter a valid email address.");
            return;
        }

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

    // Remove confirm password content
    useEffect(() => {
        if (editing) {
            setConfirmPassword("");
        }
    }, [editing]);

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
                <Col sm={12} md={10}>
                    {error && <Alert variant="info">{error}</Alert>}
                    {!editing ? (
                        // User Profile
                        <>
                            <div className="mb-4 dark lightBg p-5">
                                <p className="mb-2"><strong>Username:</strong> {profile.username}</p>
                                <p className="mb-2"><strong>Email:</strong> {profile.email}</p>
                                <p className="mb-0"><strong>Birthday:</strong> {profile.birthday ? formatDate(profile.birthday) : "Not provided"}</p>
                            </div>
                            <Row className="justify-content-end mt-5">
                                <Col xs={12} md="auto" className="d-flex flex-column align-items-end">
                                    <Button
                                        variant="secondary"
                                        className="mb-3 w-100 w-md-auto"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="outline-dark"
                                        className="w-100 w-md-auto"
                                        onClick={deleteAccount}
                                    >
                                        Delete Account
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        // User Profile Edit
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
                                        value={
                                            newInfo.birthday
                                                ? newInfo.birthday.split("T")[0]
                                                : profile.birthday
                                                    ? profile.birthday.split("T")[0]
                                                    : ""
                                        }
                                        onChange={(e) => setNewInfo({ ...newInfo, birthday: e.target.value })}
                                    />
                                </FloatingLabel>
                                <FloatingLabel controlId="password" label="New Password" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="New password"
                                        minLength="3"
                                        value={newInfo.password}
                                        onChange={(e) => setNewInfo({ ...newInfo, password: e.target.value })}
                                        autoComplete="new-password"
                                    />
                                    <Form.Text className="input-info">The password must be at least 3 characters long.</Form.Text>
                                </FloatingLabel>
                                <FloatingLabel controlId="confirmPassword" label="Confirm New Password" className="mb-3">
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="off"
                                    />
                                </FloatingLabel>
                                <Row className="justify-content-end mt-5">
                                    <Col xs={12} md="auto" className="d-flex flex-column align-items-end">
                                        <Button variant="secondary" type="submit" className="mb-3 w-100 w-md-auto">
                                            Save Changes
                                        </Button>
                                        <Button variant="outline-dark" onClick={() => setEditing(false)} className="w-100 w-md-auto">
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>;
                        </>
                    )}
                </Col>
            </Row>

            <Row className="g-3 justify-content-center mb-5">
                <h3>Favourite Movies: </h3>
                {favouriteMovies.length > 0 ? (
                    favouriteMovies.map(movie => (
                        <Col key={movie.id} xs={12} sm={6} md={4} lg={3}>
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
                                    className="btn-heart"
                                    variant="dark"
                                    onClick={() => handleRemoveFromFavourites(movie.id)}
                                >
                                    <i className="bi bi-heart-fill"></i>
                                </Button>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="center dark mb-3">You have no favourite movies yet.
                        <span className="secondary"><i className="bi bi-heartbreak-fill"></i></span> Add some from the movie list!
                    </p>
                )}
            </Row>

        </>
    );
}
ProfileView.propTypes = {
    user: PropTypes.shape({
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        birthday: PropTypes.string.isRequired,
    }).isRequired,
    movies: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
        }).isRequired,
    })).isRequired,
    onLogout: PropTypes.func.isRequired,
    favourites: PropTypes.arrayOf(PropTypes.shape({
        movieId: PropTypes.number.isRequired,
    })).isRequired,
    onRemove: PropTypes.func.isRequired,
    onProfileUpdate: PropTypes.func.isRequired,
};
