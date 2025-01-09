import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Form, Col, Button, Alert, FloatingLabel, Row } from "react-bootstrap";

export const SignupView = ({ onSignedUp }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const convertDateFormat = (date) => {
        if (!date) return null;
        const [day, month, year] = date.split(".");
        return `${year}-${month}-${day}`;
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
                alert("Signup successful - you can login now");
                navigate("/login");
            })
            .catch((error) => {
                console.error("Error during signup:", error);
                setErrorMessage(error.message || "Something went wrong. Please try again.");
            });
    };
    return (
        <Row className="form">
            <Col xs={12} md={6} lg={4} className="mx-auto">
                <h1 className="my-4">Create an account:</h1>
                <Form id="signupForm" onSubmit={handleSubmit}>
                    <Form.Group controlId="username">
                        <FloatingLabel controlId="floatingUsername" label="Username" className="mb-3">
                            <Form.Control
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                            <Form.Text className="input-info">Please enter a username.</Form.Text>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="3"
                                placeholder="Enter your password"
                            />
                            <Form.Text className="input-info">The password must be at least 3 characters long.</Form.Text>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group controlId="email">
                        <FloatingLabel controlId="floatingEmail" label="Email" className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                            <Form.Text className="input-info">Please enter a valid email address.</Form.Text>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group controlId="birthday">
                        <FloatingLabel controlId="floatingBirthday" label="Birthday" className="mb-3">
                            <Form.Control
                                name="birthday"
                                type="date"
                                value={birthday}
                                onChange={(e) => setBirthday(e.target.value)}
                                placeholder="Select your birthday"
                            />
                        </FloatingLabel>
                    </Form.Group>

                    {errorMessage && <Alert variant="info">{errorMessage}</Alert>}
                    {successMessage && <Alert variant="info">{successMessage}</Alert>}

                    <Button variant="primary" type="submit" size="lg" className="w-100 mt-5">
                        Sign up
                    </Button>
                </Form>
            </Col>
        </Row>
    );
};

SignupView.propTypes = {
    onSignedUp: PropTypes.func.isRequired,
};