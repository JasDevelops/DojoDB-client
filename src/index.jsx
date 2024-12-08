import { createRoot } from 'react-dom/client';

// Bundle `./index.scss`
import './index.scss';

// Main component
const DojoDBApplication = () => {
    return (
    <div className="dojo-db">
        <div>Kickstart your day...</div>
    </div>
    );
};

// Find root of app
const container = document.querySelector('#root');
const root = createRoot(container);

// Render app in root DOM element
root.render(<DojoDBApplication />);
