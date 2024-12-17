import React, { useState } from "react";
import "./signup-view.scss";

export const SignupView = ({ onSignedUp }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }
        if (password.length < 5) {
            setErrorMessage("Password must be at least 5 characters long.");
            return;
        }
        if (username.length < 5) {
            setErrorMessage("Username must be at least 3 characters long.");
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
            if (!response.ok) {
                alert("Signup successful - you can login now");
                window.location.reload();  // Reload page on successful signup
            } else {
                alert("Signup failed");
            }
        })
        .catch(() => {
            setErrorMessage("Something went wrong. Please try again.");
        });
        };

    return (
        <div className="signupView_form">
        <h4>SignUp</h4>
        <form onSubmit={handleSubmit}>
            <label>
            <span>username:</span>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength="3"
                    title="The username must be at least 3 characters long."
                />
            </label>
            <label>
            <span>password:</span>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="5"
                    title="The password must be at least 3 characters long."
                />
            </label>
            <label>
            <span>email:</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                    title="Please enter a valid email address."
                />
            </label>
            <label>
            <span>birthday: (optional)</span>
                <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
        </div>
    );
};
