import { Link } from 'react-router-dom';// Importing Link for navigation  
import { useContext } from 'react';// Importing useContext to access context values  
import { CartContext } from '../contexts/CartContext';// Importing CartContext for cart data  
import { useCart } from '../contexts/CartContext';// Alternative way to use cart context  
import { useUser } from '../contexts/UserContext';// Importing UserContext to manage authentication  

function Navbar() {
    // Extracting cart data from CartContext 
    const { cart } = useContext(CartContext);
    // Calculating the total number of items in the cart
    const itemCount = cart.reduce((total, item) => total + item.qty, 0);
    // Extracting user details and logout function from UserContext  
    const { user, logout } = useUser();

    return (
        <nav className="bg-secondary text-white p-4 flex justify-between items-center shadow-lg">
            {/* Brand Name / Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wide hover:text-primary transition-colors">
                FlavorQuest
            </Link>
            {/* Navigation Links */}
            <div className="space-x-6">
                <Link to="/" className="hover:text-primary transition-colors">
                    Home
                </Link>
                {/* Conditional rendering based on user authentication */}
                {user ? (
                    <>
                        {/* Cart link displaying item count */}
                        <Link to="/cart" className="mr-4">Cart ({itemCount})</Link>
                        {/* Order history link */}
                        <Link to="/history" className="mr-4">History</Link>
                        {/* Logout button showing the logged-in username */}
                        <button onClick={logout} className="text-white">
                            Logout ({user.username})
                        </button>
                    </>
                ) : (
                    // Show login link when no user is logged in
                    <Link to="/login">Login</Link>
                )}
                {/* Alternative cart display with item count badge (currently commented out) */}
                {/* <Link to="/cart" className="hover:text-primary transition-colors relative">
                    Cart
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-4 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </Link> */}
            </div>
        </nav>
    );
}

export default Navbar;