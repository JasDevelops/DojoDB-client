import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import FloatingLabel from 'react-bootstrap/FloatingLabel';

export const SignupView = ({ onSignedUp }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
        if (password.length < 5) {
            setErrorMessage("Password must be at least 5 characters long.");
            return;
        }
        if (username.length < 3) {
            setErrorMessage("Username must be at least 5 characters long.");
            return;
        }

        const data = {
            username: username,
            password: password,
            email: email,
            birthday: birthday,
        };


        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.ok) {
                alert("Signup successful - you can login now");
                window.location.reload();
            } else {
                return response.json().then((errorData) => {
                    setErrorMessage(errorData.message || "Signup failed.");
                });
            }
        })
            .catch(() => {
                setErrorMessage("Something went wrong. Please try again.");
            });
    };
    return (
        <Col className="signupView_form bg w-100 p-4">
            <h4>Create an account:</h4>
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
                            minLength="5"
                            placeholder="Enter your username"
                        />
                        <Form.Text className="input-info">
                            The username must be at least 5 characters long.
                        </Form.Text>
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
                            minLength="5"
                            placeholder="Enter your password"
                        />
                        <Form.Text className="input-info">
                            The password must be at least 5 characters long.
                        </Form.Text>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="email">
                    <FloatingLabel
                        controlId="floatingTextarea"
                        label="Email"
                        className="mb-3"
                    >
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                            placeholder="Enter your email"
                        />
                        <Form.Text className="input-info">
                            Please enter a valid email address.
                        </Form.Text>
                    </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="birthday">
                    <FloatingLabel
                        controlId="floatingTextarea"
                        label="Birthday"
                        className="mb-3"
                    >
                        <Form.Control
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            placeholder="Select your birthday"
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
