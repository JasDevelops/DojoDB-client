import React, { useState } from "react";
import { Form, Col, Button, Alert, FloatingLabel, Row } from "react-bootstrap";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            username: username,
            password: password,
        };

        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                if (data.user && data.token) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));  // Store user data
                    onLoggedIn(data.user, data.token); // Callback to MainView to update the user state
                } else {
                    setErrorMessage("Invalid username or password.");
                }
            })
            .catch((error) => {
                setErrorMessage("Something went wrong. Please try again.");
                console.error("Error during login:", error);
            });
    };

    return (
        <Row className="form">
            <Col xs={12} md={6} lg={4} className="mx-auto">
                <h1 className="my-4">Welcome back!</h1>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <FloatingLabel
                            controlId="loginUsername"
                            label="Username"
                            className="mb-3"
                        >
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <FloatingLabel
                            controlId="loginPassword"
                            label="Password"
                            className="mb-3"
                        >
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </FloatingLabel>
                    </Form.Group>
                    {errorMessage && <Alert variant="info">{errorMessage}</Alert>}
                    <Button variant="primary" type="submit" size="lg" className="w-100 mt-5">
                        Log in
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};
