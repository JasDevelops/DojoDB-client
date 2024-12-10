import { createRoot } from "react-dom/client";
import { MainView } from "./components/main-view/main-view";

import './index.scss';

const cors = require('cors');
app.use(cors());


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
