import { createRoot } from "react-dom/client";
import Container from "react-bootstrap/Container";
import "bootstrap-icons/font/bootstrap-icons.css";

import { MainView } from "./components/main-view/main-view";

// Redux
import { progressReducer } from "./reducers/progressReducer";
import { createStore } from "redux";
import { Provider } from "react-redux";

// Bundle `./index.scss`
import "./index.scss";

// Main component
const store = createStore(progressReducer);

const DojoDBApplication = () => {
    return (
        <Provider store={store}>
            <Container>
                <MainView />
            </Container>
        </Provider>
    );
};

// Find root of app
const container = document.querySelector("#root");
const root = createRoot(container);

// Render app in root DOM element
root.render(<DojoDBApplication />);
