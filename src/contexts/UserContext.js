import { createContext, useContext, useState } from 'react';

// Mocking user data (in a real app, we need to connect this to a backend system)
const mockUsers = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
    { id: 3, username: 'user3', password: 'password3' },
    { id: 4, username: 'user4', password: 'password4' },
];

// Creating a context to manage user authentication state
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // State to store the currently logged-in user (null means no user is logged in)
    const [user, setUser] = useState(null);

    // Function to authenticate a user based on username and password
    const login = (username, password) => {
        // Check if the provided credentials match any user in the mock data
        const foundUser = mockUsers.find(
            u => u.username === username && u.password === password
        );
        if (foundUser) {
            setUser(foundUser);// Set the authenticated user in state
            return true;
        }
        return false;// Return false if credentials are incorrect
    };

    // Function to log out the user by clearing the user state
    const logout = () => {
        setUser(null);
    };

    return (
        // Providing the user state and authentication functions to all child components  
        <UserContext.Provider value={{ user, login, logout }}>
            {children}{/* Rendering child components inside the provider so they can access the context */}
        </UserContext.Provider>
    );
};

// Custom hook to easily access the UserContext in other components
export const useUser = () => useContext(UserContext);