// Importing necessary dependencies from React
// useRef for tracking interval, useState for state management, useEffect for side effects
import { useRef, useState, useEffect } from 'react';

// Importing React Router hooks for navigation and accessing route state
// Link for navigation links, useNavigate for programmatic navigation, useLocation to access route state
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Importing custom hook to access cart-related data and functions
// Custom hook to access CartContext for order history
import { useCart } from '../contexts/CartContext';

// ConfirmationPage component: Displays the order confirmation details and tracks the order status
function ConfirmationPage() {
    // const { cart, cartTotal, setCart } = useContext(CartContext);
    // const navigate = useNavigate();

    // Accessing the route state passed from the CartPage (contains order and total)
    // useLocation hook to get the state passed via navigation
    const { state } = useLocation();

    // Destructuring the order and total from the route state, with fallback values if state is undefined
    // Fallback to empty array and 0 if state is not provided
    const { order, total } = state || { order: [], total: 0 };

    // Destructuring getUserHistory function from CartContext to fetch order history
    // Custom hook to access order history from CartContext
    const { getUserHistory } = useCart();

    // State to store the current (latest) order being tracked
    // Initially null, will be updated with the latest order
    const [currentOrder, setCurrentOrder] = useState(null);

    // useRef to store the interval ID for polling order updates, allowing cleanup on unmount
    // Ref to track the interval ID for polling
    const intervalRef = useRef(null);

    //   const handleBackToHome = () => {
    //     setCart([]); // Clear the cart
    //     navigate('/'); // Navigate to Home
    //   };

    // Function to fetch the latest order from the user's order history
    const fetchLatestOrder = () => {

        // Fetch the user's order history using the getUserHistory function
        const history = getUserHistory();
        console.log("Fetched order history:", history); // Debugging log

        // Check if the history is empty or undefined, log a warning if so
        if (!history || history.length === 0) {
            console.warn("No order history found!");
            return;
        }

        // Get the most recent order (last item in the history array)
        const latestOrder = history[history.length - 1];
        console.log("Latest order:", latestOrder);

        // Update the state with the latest order
        setCurrentOrder(latestOrder);

        // Stop polling if order is delivered or cancelled
        if (latestOrder.deliveryStatus === 'Cancelled' || latestOrder.deliveryStatus === 'Delivered') {
            console.log("Stopping polling: Order is", latestOrder.deliveryStatus);
            clearInterval(intervalRef.current);// Clear the polling interval to stop further updates
            intervalRef.current = null;// Set the interval ref to null to indicate polling has stopped
        }
    };

    // useEffect to fetch the latest order and set up polling for status updates
    useEffect(() => {
        // Fetch the initial order immediately when the component mounts
        fetchLatestOrder();

        // Start polling every 2 seconds
        intervalRef.current = setInterval(() => {
            console.log("Polling for order updates...");
            fetchLatestOrder();// Fetch the latest order to check for status updates
        }, 2000);

        // Cleanup function to clear the interval when the component unmounts
        return () => {
            if (intervalRef.current) {// Check if the interval is still active
                clearInterval(intervalRef.current); // Cleanup on unmount
                intervalRef.current = null; // Reset the ref
            }
        };
    }, [getUserHistory]);// Dependency array: re-run if getUserHistory changes

    // Calculating the progress for the status bar
    // Array defining the possible status steps for an order (excluding Cancelled)
    const statusSteps = ['Pending', 'In Progress', 'Out for Delivery', 'Delivered'];
    const getProgress = (status) => {
        if (status === 'Cancelled') return 0;  // Stop progress if cancelled

        // Find the index of the current status in the statusSteps array
        const index = statusSteps.indexOf(status); // Get the index of the current status

        // Calculate the progress percentage based on the current status indexconst index = statusSteps.indexOf(status);
        return ((index + 1) / statusSteps.length) * 100; // returning percentage(%) value
    };

    // Render the ConfirmationPage UI
    return (
        // Main container with padding
        <div className="p-6">
            {/* Check if the order array is empty (i.e., no order data was passed) */}
            {order.length === 0 ? (
                <p>No order found. <Link to="/" className="text-primary">Go back to the menu</Link>.</p>
            ) : (

                // Display the order confirmation details if an order exists
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold text-secondary mb-4">Your Order is Submitted Successfully!</h1>

                    {/* Order summary section */}
                    <h2 className="text-xl font-semibold text-secondary mb-2">Order Summary</h2>

                    {/* List of items in the order */}
                    {order.map(item => (
                        <div key={item.id} className="flex justify-between mb-2">
                            <span>{item.name} x {item.qty}</span>
                            <span>${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                    ))}

                    {/* Total price of the order */}
                    <div className="flex justify-between font-bold text-secondary mt-2">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    {/* Order tracking section (displayed only if currentOrder exists) */}
                    {currentOrder && (
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-secondary mb-2">Order Tracking</h2>

                            {/* Display the current delivery status */}
                            <p className="text-gray-600 mb-2">
                                <strong>Status:</strong> {currentOrder.deliveryStatus}
                            </p>

                            {/* Progress bar to visually represent the order status */}
                            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                                <div
                                    className="bg-orange-500 h-4 rounded-full"
                                    style={{ width: `${getProgress(currentOrder.deliveryStatus)}%` }}
                                ></div>
                            </div>

                            {/* Display the delivery partner's name */}
                            <p className="text-gray-600 mb-2">
                                <strong>Delivery Partner:</strong> {currentOrder.deliveryPartner.name}
                            </p>

                            {/* Display the delivery partner's contact information */}
                            <p className="text-gray-600 mb-2">
                                <strong>Contact:</strong> {currentOrder.deliveryPartner.contact}
                            </p>
                        </div>
                    )}

                    {/* Link to navigate back to the home page */}
                    <Link
                        to="/"
                        className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
                    >
                        Back to Home
                    </Link>
                </div>
            )}
        </div>
    );
}

// Export the ConfirmationPage component as the default export
export default ConfirmationPage;