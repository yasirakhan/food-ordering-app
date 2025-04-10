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
    const { getUserHistory, updateDeliveryStatus } = useCart();

    // Fetch the user's order history
    const history = getUserHistory();

    // State to track which orders are expanded (showing details) or collapsed
    const [expandedOrders, setExpandedOrders] = useState({});

    // State to track whether the order history is still loading
    const [isLoading, setIsLoading] = useState(true);

    // useEffect to fetch the order history and update the loading state
    useEffect(() => {
        const historyData = getUserHistory();
        setIsLoading(false);
    }, [getUserHistory]);

    // Function to toggle the expanded/collapsed state of an order's details
    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
    };

    // Function to generate a status badge with appropriate color and icon based on the order status
    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': { color: 'bg-gray-100 text-gray-800', icon: <FaClock className="inline mr-1" /> },
            'In Progress': { color: 'bg-blue-100 text-blue-800', icon: <FaTruck className="inline mr-1" /> },
            'Out for Delivery': { color: 'bg-orange-100 text-orange-800', icon: <FaBoxOpen className="inline mr-1" /> },
            'Delivered': { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="inline mr-1" /> },
            'Cancelled': { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle className="inline mr-1" /> }
        };

        const { color, icon } = statusMap[status] || statusMap['Pending'];
        return <span className={`px-4 py-1 rounded-full font-medium text-sm ${color} flex items-center`}>{icon} {status}</span>;
    };

    // Render the HistoryPage UI
    return (
        <div className="container mx-auto p-8 bg-gradient-to-b from-red-150 to-red-200 min-h-screen">
            {/* Page title with a modern look */}
            <h1 className="text-4xl font-extrabold mb-8 text-gray-900 tracking-tight">Order History</h1>

            {/* Check if the history is still loading */}
            {isLoading ? (
                <p className="text-lg text-gray-600">Loading order history...</p>
            ) : history.length === 0 ? (
                <p className="text-lg text-gray-600">
                    You have no orders yet.{' '}
                    <Link to="/" className="text-orange-500 font-semibold hover:underline">
                        Go back to the menu
                    </Link>.
                </p>
            ) : (
                <div className="space-y-6">
                    {history.map((entry) => (
                        <div
                            key={entry.orderId}
                            className="bg-gray-50 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200"
                        >
                            {/* Order header (clickable to toggle details) */}
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleOrderDetails(entry.orderId)}
                            >
                                {/* Order ID and timestamp with better contrast */}
                                <h2 className="text-xl font-bold text-gray-900">
                                    Order #{entry.orderId.slice(0, 8)} -{' '}
                                    <span className="text-gray-600 font-medium">
                                        {new Date(entry.timestamp).toLocaleString()}
                                    </span>
                                </h2>
                                {getStatusBadge(entry.deliveryStatus || 'Pending')}
                            </div>

                            {/* Expanded order details in a nested card */}
                            {expandedOrders[entry.orderId] && (
                                <div className="mt-6">
                                    {/* Nested card for order details with a different background */}
                                    <div className="bg-white p-5 rounded-lg shadow-inner border border-gray-300">
                                        <p className="text-gray-700 mb-4">
                                            <strong className="font-semibold text-gray-900">Delivery Partner:</strong>{' '}
                                            {entry.deliveryPartner?.name || 'Not Assigned'}
                                            <span className="text-sm text-gray-500">
                                                {' '}
                                                (Contact: {entry.deliveryPartner?.contact || 'N/A'})
                                            </span>
                                        </p>

                                        {entry.order.map(item => (
                                            <div key={item.id} className="flex justify-between text-gray-800 mb-3">
                                                <span className="font-medium">{item.name} x {item.qty}</span>
                                                <span className="font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                                            </div>
                                        ))}

                                        {/* Total with a background strip */}
                                        <div className="flex justify-between font-bold text-gray-900 mt-4 text-lg bg-gray-200 py-3 px-4 rounded-md">
                                            <span>Total</span>
                                            <span>${entry.total.toFixed(2)}</span>
                                        </div>

                                        {entry.notes && (
                                            <p className="mt-4 text-gray-700">
                                                <strong className="font-semibold text-gray-900">Notes:</strong> {entry.notes}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistoryPage;