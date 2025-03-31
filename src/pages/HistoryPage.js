// Importing necessary dependencies from React, useState for state management
import { useState, useEffect } from 'react';

// Importing React Router hooks for navigation and accessing route state
import { Link } from 'react-router-dom';

// Custom hook to access CartContext for order history
import { useCart } from '../contexts/CartContext';

// Importing icons from react-icons for visual representation of order statuses
import { FaTruck, FaCheckCircle, FaClock, FaTimesCircle, FaBoxOpen } from 'react-icons/fa';

// HistoryPage component: Displays the user's order history with expandable details and a loading state
function HistoryPage() {
    // Destructuring getUserHistory and updateDeliveryStatus functions from CartContext
    // Access functions to fetch order history and update delivery status
    const { getUserHistory, updateDeliveryStatus } = useCart();

    // Fetch the user's order history
    // Array of past orders for the current user
    const history = getUserHistory();

    // State to track which orders are expanded (showing details) or collapsed
    // Object mapping order IDs to their expanded state (true/false)
    const [expandedOrders, setExpandedOrders] = useState({});

    // State to track whether the order history is still loading
    // Initially true, set to false after fetching history
    const [isLoading, setIsLoading] = useState(true);

    // useEffect to fetch the order history and update the loading state
    useEffect(() => {
        // Fetch the user's order history using getUserHistory
        const historyData = getUserHistory();

        // Set loading state to false after fetching the history
        // Indicate that loading is complete
        setIsLoading(false);
    }, [getUserHistory]); // Dependency array: re-run if getUserHistory changes

    // const handleStatusChange = (orderId, newStatus) => {
    //     if (orderId) {
    //         updateDeliveryStatus(orderId, newStatus);
    //     }
    // };

    // Function to toggle the expanded/collapsed state of an order's details
    const toggleOrderDetails = (orderId) => {
        // Update the expandedOrders state by toggling the boolean value for the given orderId
        // Toggle the expanded state (true -> false, false -> true)
        setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    // Function to generate a status badge with appropriate color and icon based on the order status
    const getStatusBadge = (status) => {
        // Define a mapping of statuses to their respective colors and icons
        const statusMap = {
            'Pending': { color: 'bg-gray-200 text-gray-700', icon: <FaClock className="inline" /> }, // Gray badge with clock icon for "Pending"
            'In Progress': { color: 'bg-blue-200 text-blue-700', icon: <FaTruck className="inline" /> }, // Blue badge with truck icon for "In Progress"
            'Out for Delivery': { color: 'bg-orange-200 text-orange-700', icon: <FaBoxOpen className="inline" /> }, // Orange badge with box icon for "Out for Delivery"
            'Delivered': { color: 'bg-green-200 text-green-700', icon: <FaCheckCircle className="inline" /> }, // Green badge with check icon for "Delivered"
            'Cancelled': { color: 'bg-red-200 text-red-700', icon: <FaTimesCircle className="inline" /> } // Red badge with cancel icon for "Cancelled"
        };

        // Get the color and icon for the given status, default to "Pending" if status is not found
        // Fallback to "Pending" styling if status is invalid
        const { color, icon } = statusMap[status] || statusMap['Pending'];

        // Return a styled span element with the icon and status text
        return <span className={`px-3 py-1 rounded-lg font-semibold ${color}`}>{icon} {status}</span>;
    };

    // Render the HistoryPage UI
    return (

        // Main container with Tailwind CSS classes for layout, padding, background, and minimum height
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">

            {/* Page title */}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Order History</h1>

            {/* Check if the history is still loading */}
            {isLoading ? (
                // Display a loading message while fetching the order history
                <p>Loading order history...</p>
            ) : history.length === 0 ? (
                // Display a message and link to the menu if there are no orders
                <p>You have no orders yet. <Link to="/" className="text-orange-600 hover:underline">Go back to the menu</Link>.</p>
            ) : (
                // Display the list of orders if there are any
                <div className="space-y-6">
                    {/* Map through each order in the history */}
                    {history.map((entry) => (

                        // Individual order card with a unique key, styling, and hover effect
                        <div key={entry.orderId} className="bg-white p-5 rounded-lg shadow-md transition duration-300 hover:shadow-lg">

                            {/* Order header (clickable to toggle details) */}
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOrderDetails(entry.orderId)}>

                                {/* Order ID and timestamp */}
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Order #{entry.orderId.slice(0, 8)} - {new Date(entry.timestamp).toLocaleString()}
                                </h2>

                                {/* Display the status badge for the order */}
                                {getStatusBadge(entry.deliveryStatus || 'Pending')}
                            </div>

                            {/* Expanded order details (shown only if the order is expanded) */}
                            {expandedOrders[entry.orderId] && (
                                <div className="mt-4 border-t pt-4">

                                    {/* Delivery partner information */}
                                    <p className="text-gray-600 mb-2">
                                        <strong>Delivery Partner:</strong> {entry.deliveryPartner?.name || 'Not Assigned'}
                                        <span className="text-sm text-gray-500"> (Contact: {entry.deliveryPartner?.contact || 'N/A'})</span>
                                    </p>

                                    {/* List of items in the order */}
                                    {entry.order.map(item => (
                                        <div key={item.id} className="flex justify-between text-gray-700 mb-2">
                                            <span>{item.name} x {item.qty}</span>
                                            <span>${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}

                                    {/* Total price of the order */}
                                    <div className="flex justify-between font-bold text-gray-900 mt-2 text-lg">
                                        <span>Total</span>
                                        <span>${entry.total.toFixed(2)}</span>
                                    </div>

                                    {/* Display order notes if they exist */}
                                    {entry.notes && <p className="mt-2 text-gray-600"><strong>Notes:</strong> {entry.notes}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Export the HistoryPage component as the default export
export default HistoryPage;