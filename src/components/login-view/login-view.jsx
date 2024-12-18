import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

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
        <Col className="loginView_form bg w-100 p-4">
            <h4>Welcome back!</h4>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username">
                    <FloatingLabel
                        controlId="floatingTextarea"
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
                        controlId="floatingTextarea"
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
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                <Button variant="primary" type="submit" className="mt-5">
                    Submit
                </Button>
            </Form>
        </Col>
    );
};
