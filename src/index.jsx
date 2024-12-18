import { createRoot } from "react-dom/client";
import Container from "react-bootstrap/Container";

import { MainView } from "./components/main-view/main-view";

// Bundle `./index.scss`
import "./index.scss";

// Main component
const DojoDBApplication = () => {
    return (
        <Container className="d-flex align-items-center justify-content-center min-vh-100" >
            <MainView />
        </Container>
    );
};

// Find root of app
const container = document.querySelector("#root");
const root = createRoot(container);

// Render app in root DOM element
root.render(<DojoDBApplication />);
