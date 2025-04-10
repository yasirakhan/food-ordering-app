// Importing necessary dependencies from React Router for routing
// Router for routing, Route for defining routes, Routes for grouping routes, Navigate for redirection
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Importing the Navbar component for navigation
import Navbar from './components/Navbar'; // Navbar component for the app's navigation bar

// Importing page components for different routes
import HomePage from './pages/HomePage'; // HomePage component for the main menu page
import CartPage from './pages/CartPage'; // CartPage component for the cart page
import ConfirmationPage from './pages/ConfirmationPage'; // ConfirmationPage component for the order confirmation page
import LoginPage from './pages/LoginPage'; // LoginPage component for the login page
import HistoryPage from './pages/HistoryPage'; // HistoryPage component for the order history page

// Importing context providers for cart and user state management
import { CartProvider } from './contexts/CartContext'; // CartProvider to provide cart-related state and functions to the app
import { UserProvider, useUser } from './contexts/UserContext'; // UserProvider to provide user-related state and functions, useUser to access user state

// Importing ToastContainer for toast notifications
import { ToastContainer } from 'react-toastify'; // ToastContainer for displaying toast notifications throughout the app

// Importing styles for react-toastify
import 'react-toastify/dist/ReactToastify.css'; // CSS styles for toast notifications

// Importing Modal from react-modal for accessibility binding
import Modal from 'react-modal'; // Modal component (used in HomePage) for displaying modals

// Binding react-modal to the app's root element for accessibility
Modal.setAppElement('#root'); // Bind Modal to the root element to ensure proper accessibility (e.g., for screen readers)

// ProtectedRoute component: Protects routes by redirecting unauthenticated users to the login page
function ProtectedRoute({ children }) {
  // Access the current user from UserContext
  const { user } = useUser(); // Get the user state (null if not logged in)

  // Conditionally Rendering the children (protected content) or redirect to the login page
  return user ? children : <Navigate to="/login" />; // If user is logged in, Rendering the children; otherwise, redirect to /login
}

// App component: The main entry point of the application
function App() {
  // Rendering the app with context providers, router, and routes
  return (
    <UserProvider> {/* Wrapping the app in UserProvider to provide user-related state and functions */}
      <CartProvider> {/* Wrapping the app in CartProvider to provide cart-related state and functions */}
        <Router> {/* Wrapping the app in Router to enable routing */}
          <div className="min-h-screen bg-accent"> {/* Main container with Tailwind CSS classes for minimum height and background color */}
            <Navbar /> {/* Rendering the Navbar component at the top of every page */}
            <Routes> {/* Defining the app's routes using Routes */}
              <Route path="/login" element={<LoginPage />} /> {/* Route for the login page (public, no authentication required) */}
              <Route path="/" element={<HomePage />} /> {/* Route for the homepage (public, no authentication required) */}
              <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} /> {/* Route for the cart page (protected, requires authentication) */}
              <Route path="/confirmation" element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} /> {/* Route for the confirmation page (protected, requires authentication) */}
              <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} /> {/* Route for the history page (protected, requires authentication) */}
            </Routes>
          </div>
          <ToastContainer position="top-right" autoClose={2000} /> {/* Rendering the ToastContainer to display toast notifications throughout the app */}
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

// Export the App component as the default export
export default App;