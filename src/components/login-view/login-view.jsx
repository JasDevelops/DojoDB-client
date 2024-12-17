import React, { useState } from "react";
import "./login-view.scss";

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
        <div className="loginView_form">
            <h4>Login</h4>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Username:</span>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <span>Password:</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};
