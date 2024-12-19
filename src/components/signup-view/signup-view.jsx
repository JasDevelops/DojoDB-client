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

    const convertDateFormat = (date) => {
        if (!date) return null; // If no date is provided, return null
        const [day, month, year] = date.split(".");
        return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
        if (password.length < 3) {
            setErrorMessage("Password must be at least 3 characters long.");
            return;
        }
        if (username.length < 1) {
            setErrorMessage("Please enter a username.");
            return;
        }

        const data = {
            username: username,
            password: password,
            email: email,
            ...(birthday && { birthday: birthday }),
                };

        fetch("https://dojo-db-e5c2cf5a1b56.herokuapp.com/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((errorData) => {
                    const errorMessage = errorData.message || "Signup failed. Please try again.";
                    throw new Error(errorMessage);
                });
            }
            return response.json();
        })
        .then((data) => {
            console.log("Signup successful:", data);
            alert("Signup successful - you can login now");
            window.location.reload();  
        })
        .catch((error) => {
            console.error("Error during signup:", error);
            setErrorMessage(error.message || "Something went wrong. Please try again.");
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
                            placeholder="Enter your username"
                            minLength="1"
                        />
                        <Form.Text className="input-info">
                            Please enter a username.
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
                            minLength="3"
                            placeholder="Enter your password"
                        />
                        <Form.Text className="input-info">
                            The password must be at least 3 characters long.
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
