import React, { useState } from "react";

export const LoginView = ({ onLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.user) {
                localStorage.setItem("token", data.token);
                onLoggedIn(data.user, data.token); // Pass user and token to MainView
            } else {
                setErrorMessage("Invalid username or password.");
            }
        })
        .catch(() => {
            setErrorMessage("Something went wrong. Please try again.");
        });
};

    return (
        <div className="LoginView_submit">
        <form onSubmit={handleSubmit}>
            <label>
                username:
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            {errorMessage && <p>{errorMessage}</p>} 
            <button type="submit">Submit</button>
        </form>
        </div>
    );
};
