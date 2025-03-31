// Importing necessary dependencies from React
import { useState } from 'react'; // useState for managing component state (username, password, error)

// Importing custom hook to access user-related functions
import { useUser } from '../contexts/UserContext'; // Custom hook to access UserContext for login functionality

// Importing React Router hook for navigation
import { useNavigate } from 'react-router-dom'; // useNavigate for programmatic navigation after login

// LoginPage component: Handles user login with username and password
function LoginPage() {
    // State to store the username entered by the user
    const [username, setUsername] = useState(''); // Initially empty

    // State to store the password entered by the user
    const [password, setPassword] = useState(''); // Initially empty

    // State to store any error message (e.g., invalid credentials)
    const [error, setError] = useState(''); // Initially empty

    // Destructuring the login function from UserContext to authenticate the user
    const { login } = useUser(); // Access the login function from UserContext

    // Hook to programmatically navigate to other routes
    const navigate = useNavigate(); // Used to redirect the user after successful login

    // Function to handle the login form submission
    const handleLogin = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior (page refresh)
        
        // Attempt to log in using the provided username and password
        const success = login(username, password); // Call the login function from UserContext
        
        // Check if the login was successful
        if (success) {
            navigate('/'); // Redirect to the HomePage on successful login
        } else {
            setError('Invalid username or password'); // Display an error message if login fails
        }
    };

    // Render the LoginPage UI
    return (
        // Main container with Tailwind CSS classes for layout, centering, and max width
        <div className="container mx-auto p-4 max-w-md">
            {/* Page title */}
            <h1 className="text-2xl font-bold mb-4">Login to FlavorQuest</h1>
            
            {/* Display an error message if it exists */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {/* Login form */}
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
                {/* Username input field */}
                <div className="mb-4">
                    {/* Label for the username input */}
                    <label htmlFor="username" className="block text-gray-700 mb-2">
                        Username
                    </label>
                    {/* Input field for the username */}
                    <input
                        type="text" // Text input type
                        id="username" // ID for accessibility (linked to the label)
                        value={username} // Controlled input value
                        onChange={(e) => setUsername(e.target.value)} // Update username state on change
                        className="w-full p-2 border rounded" // Styling for the input
                        required // Make the field required
                    />
                </div>
                
                {/* Password input field */}
                <div className="mb-4">
                    {/* Label for the password input */}
                    <label htmlFor="password" className="block text-gray-700 mb-2">
                        Password
                    </label>
                    {/* Input field for the password */}
                    <input
                        type="password" // Password input type (hides the text)
                        id="password" // ID for accessibility (linked to the label)
                        value={password} // Controlled input value
                        onChange={(e) => setPassword(e.target.value)} // Update password state on change
                        className="w-full p-2 border rounded" // Styling for the input
                        required // Make the field required
                    />
                </div>
                
                {/* Submit button for the form */}
                <button
                    type="submit" // Form submission button
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600" // Styling for the button
                >
                    Login
                </button>
            </form>
        </div>
    );
}

// Export the LoginPage component as the default export
export default LoginPage;