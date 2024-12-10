import { createRoot } from "react-dom/client";
import { MainView } from "./components/main-view/main-view";

// Bundle `./index.scss`
import './index.scss';

// Main component
const DojoDBApplication = () => {
    return (
        < MainView />
    );
};

// Find root of app
const container = document.querySelector('#root');
const root = createRoot(container);

// Render app in root DOM element
root.render(<DojoDBApplication />);
