// Importing necessary dependencies
import { useContext, useState } from 'react'; // React hooks for state management
import { CartContext, useCart } from '../contexts/CartContext'; // Custom context for cart management
import { Link, Navigate, useNavigate } from 'react-router-dom'; // React Router for navigation
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion for animations
import { toast } from 'react-toastify'; // Toast notifications for user feedback
import 'react-toastify/dist/ReactToastify.css'; // Styles for toast notifications

// CartPage component: Displays the user's cart, allows quantity updates, removal of items, and order submission
function CartPage() {
    // Destructuring cart-related functions and data from CartContext
    const { cart, removeFromCart, updateQuantity, cartTotal, setCart, saveOrder } = useCart();
    // Hook to programmatically navigate to other routes
    const navigate = useNavigate();
    // State to store user notes for the order (e.g., "No onions, make it quick")
    const [notes, setNotes] = useState('');
    // State to control the visibility of the "Confirm Order" modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // State to control the visibility of the "Cancel Order" modal
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    // const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    //   if (cart.length === 0) {
    //     return (
    //       <div className="p-6">
    //         <h1 className="text-3xl font-bold text-secondary mb-4">Your Cart</h1>
    //         <p className="text-gray-600">Your cart is empty.</p>
    //         <Link to="/" className="text-primary hover:underline">Continue Shopping</Link>
    //       </div>
    //     );
    //   }

    // Function to handle order confirmation and submission
    const handleConfirmOrder = () => {
        // Check if the cart is not empty before proceeding
        if (cart.length > 0) {
            // Save the order to history with the cart items, total, and user notes
            saveOrder(cart, cartTotal, notes);
            // Navigate to the confirmation page, passing the order and total as state
            navigate('/confirmation', { state: { order: cart, total: cartTotal } });
            // Delay clearing the cart and notes to avoid race conditions with navigation
            setTimeout(() => {
                setCart([]); // Delayed clearing to prevent race condition
                setNotes(''); // Clear the notes when order is submitted
            }, 100);
            // Close the confirmation modal
            setIsModalOpen(false);
            // Display a success toast notification to the user
            toast.success("🎉 Order placed successfully!", {
                position: "top-right", // Position of the toast
                autoClose: 3000, // Auto-close after 3 seconds
                hideProgressBar: false, // Show progress bar
                closeOnClick: true, // Close on click
                pauseOnHover: true, // Pause on hover
                draggable: true, // Allow dragging
                style: {
                    backgroundColor: "#4CAF50", // Green background for success
                    color: "#fff", // White text
                    fontSize: "16px" // Font size for readability
                }
            });
        }
    };

    // Function to handle order cancellation
    const handleCancelOrder = () => {
        setCart([]); // Clear the cart
        setIsCancelModalOpen(false); // Close the cancel order modal
        // Display an info toast notification to the user
        toast.info("🚫 Order canceled successfully!", {
            position: "top-right", // Position of the toast
            autoClose: 3000, // Auto-close after 3 seconds
        });
        navigate('/'); // Redirect to home page
    };

    // Render the CartPage UI
    return (
        // Main container with padding
        <div className="p-6">
            <h1 className="text-3xl font-bold text-secondary mb-4">Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty. <Link to="/" className="text-orange-500">Go back to the menu</Link>.</p>
            ) : (
                // Display cart items and order summary if the cart is not empty
                <>
                    {/* List of cart items */}
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                                {/* Item details (name and price) */}
                                <div>
                                    <h2 className="text-xl font-semibold text-secondary">{item.name}</h2>
                                    <p className="text-gray-600">${item.price.toFixed(2)} x {item.qty}</p>
                                </div>
                                {/* Quantity controls and remove button */}
                                <div className="flex items-center space-x-2">
                                    {/* Decrease quantity button */}
                                    <button
                                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                                        className="bg-gray-200 text-secondary px-2 py-1 rounded hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    {/* Display current quantity */}
                                    <span>{item.qty}</span>
                                    {/* Increase quantity button */}
                                    <button
                                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                                        className="bg-gray-200 text-secondary px-2 py-1 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                    {/* Remove item button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Order summary and notes section */}
                    <div className="mt-6">
                        {/* Display the total price of the cart */}
                        <p className="text-xl font-bold text-secondary">Total: ${cartTotal.toFixed(2)}</p>
                        {/* Notes input field */}
                        <div className="mt-4">
                            <label htmlFor="notes" className="block text-gray-700 mb-2">
                                Add Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border rounded"
                                rows="3"
                                placeholder="E.g., Please make it quick, no onions"
                            />
                        </div>
                        {/* Submit & Cancel Order Buttons */}
                        <div className="mt-4 flex space-x-4">
                            {/* Submit Order button - opens confirmation modal */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
                            >
                                Submit Order
                            </button>
                            {/* Cancel Order button - opens cancel confirmation modal */}
                            <button
                                onClick={() => setIsCancelModalOpen(true)}
                                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                            >
                                Cancel Order
                            </button>
                        </div>
                    </div>
                </>
            )}
            {/* Confirmation Modal with Animation */}
            <AnimatePresence>
                {isModalOpen && (
                    // Modal overlay with animation
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 2 }}
                    // onAnimationComplete={() => console.log("Confirm Order Modal Animation Completed")} // Debug log
                    >
                        {/* Modal content with animation */}
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-lg w-96"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold text-secondary mb-4">Confirm Order</h2>
                            <p className="text-gray-700">Are you sure you want to place this order?</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                {/* Cancel button to close the modal */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                {/* Confirm button to submit the order */}
                                <button
                                    onClick={handleConfirmOrder}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >

            {/* Cancel Order Confirmation Modal */}
            <AnimatePresence>
                {isCancelModalOpen && (
                    // Modal overlay with animation
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Modal content with animation */}
                        <motion.div
                            className="bg-white p-6 rounded-lg shadow-lg w-96"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl font-semibold text-secondary mb-4">Cancel Order</h2>
                            <p className="text-gray-700">Are you sure you want to cancel this order? This action cannot be undone.</p>
                            <div className="mt-4 flex justify-end space-x-2">
                                {/* Button to keep the order and close the modal */}
                                <button
                                    onClick={() => setIsCancelModalOpen(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                >
                                    No, Keep Order
                                </button>
                                {/* Button to confirm cancellation */}
                                <button
                                    onClick={handleCancelOrder}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Yes, Cancel Order
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
// Export the CartPage component as the default export
export default CartPage;