// Importing React for building the UI
// Core React library for creating components
import React from 'react'; 

// Importing ReactDOM for rendering the React app into the DOM
// ReactDOM client for rendering the app in the browser (React 18+)
import ReactDOM from 'react-dom/client'; 

// Importing global CSS styles for the app
// Global CSS file for applying styles across the app
import './index.css'; 

// Importing the main App component
// The root component of the application (App.js)
import App from './App'; 

// Create a root for rendering the React app
// Get the root DOM element with ID 'root' and create a React root for rendering
const root = ReactDOM.createRoot(document.getElementById('root')); 

// Render the app into the DOM
root.render(
    // Wrap the app in React.StrictMode for development checks
    // Render the main App component
    <React.StrictMode>        
        <App />
    </React.StrictMode>
);