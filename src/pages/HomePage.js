// Importing necessary dependencies from React
// useState for managing component state, useContext for accessing context (though not used directly here)
import { useState, useContext } from 'react';

// Importing React Router components for navigation
// Link for creating navigation links (not used in this file but imported)
// import { Link } from 'react-router-dom';

// Importing menu data from a local file
// Static menu data containing items with properties like name, category, price, etc.
import menuData from '../data/menuData';

// Importing custom hook to access cart-related functions
// Custom hook to access CartContext for adding items to the cart
import { useCart } from '../contexts/CartContext';

// Importing Modal component from react-modal for displaying item details
import Modal from 'react-modal'; // Modal component for showing item details in a popup

// Defining custom styles for the modal to control its appearance and positioning
const customStyles = {
    content: {
        top: '50%', // Center the modal vertically
        left: '50%', // Center the modal horizontally
        right: 'auto', // Allow the right edge to adjust automatically
        bottom: 'auto', // Allow the bottom edge to adjust automatically
        marginRight: '-50%', // Adjust margin for centering
        transform: 'translate(-50%, -50%)', // Center the modal using transform
        maxWidth: '500px', // Set a maximum width for the modal
        width: '90%', // Make the modal responsive (90% of the viewport width)
        padding: '20px', // Add padding inside the modal
        borderRadius: '8px', // Round the corners of the modal
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle shadow for depth
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay behind the modal
    },
};

// HomePage component: Displays the menu, allows filtering by category, and adding items to the cart
function HomePage() {
    // State to track the currently selected category for filtering menu items
    const [category, setCategory] = useState('All'); // Default to "All" to show all items

    // State to manage the toast notification message (e.g., "Item added to cart!")
    const [toast, setToast] = useState(null); // Initially null, set to a message when an item is added to the cart

    // Destructuring addToCart function from CartContext to add items to the cart
    const { addToCart } = useCart(); // Access the addToCart function from CartContext

    // Create a list of unique categories from menuData, including "All" as the first option
    const categories = ['All', ...new Set(menuData.map(item => item.category))]; // Extract unique categories and prepend "All"

    // State to control the visibility of the modal for item details
    const [modalIsOpen, setModalIsOpen] = useState(false); // Initially false (modal is closed)

    // State to store the currently selected item for display in the modal
    const [selectedItem, setSelectedItem] = useState(null); // Initially null, set to an item when the modal opens

    // Filter menu items based on the selected category
    const filteredItems = category === 'All'
        ? menuData // If "All" is selected, show all items
        : menuData.filter(item => item.category === category); // Otherwise, filter items by the selected category

    // Function to open the modal and set the selected item
    const openModal = (item) => {
        setSelectedItem(item); // Set the selected item to display in the modal
        setModalIsOpen(true); // Open the modal
    };

    // Function to close the modal and clear the selected item
    const closeModal = () => {
        setModalIsOpen(false); // Close the modal
        setSelectedItem(null); // Clear the selected item
    };

    // Function to handle adding an item to the cart and showing a toast notification
    const handleAddToCart = (item) => {
        addToCart(item); // Add the item to the cart using the CartContext function
        setToast(`${item.name} added to cart!`); // Show a toast notification with the item name
        setTimeout(() => setToast(null), 2000); // Hide the toast after 2 seconds (2000ms)
    };

    // Render the HomePage UI
    return (
        // Main container with padding
        <div className="p-6">
            {/* Page title */}
            <h1 className="text-3xl font-bold text-secondary mb-4">Welcome to FlavorQuest</h1>

            {/* Category filter buttons */}
            <div className="flex space-x-4 mb-6">
                {/* Map through each category to create a filter button */}
                {categories.map(cat => (
                    // Button for each category with a unique key
                    <button
                        key={cat} // Unique key for each category button
                        onClick={() => setCategory(cat)} // Set the selected category on click
                        // Conditional styling: active category is highlighted
                        className={`px-4 py-2 rounded-full font-semibold transition-colors 
                            ${category === cat ? 'bg-primary text-white' : 'bg-gray-200 text-secondary hover:bg-gray-300'}`}
                    >
                        {cat} {/* Display the category name */}
                    </button>
                ))}
            </div>

            {/* Grid layout for displaying menu items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Map through filtered items to display each menu item */}
                {filteredItems.map(item => (
                    // Individual menu item card with a unique key and hover effects
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:scale-105">
                        {/* Item image */}
                        <img
                            src={item.image} // Image source from menu data
                            alt={item.name} // Alt text for accessibility
                            className="w-full h-52 object-cover rounded-lg border border-gray-200" // Styling for the image
                        />
                        {/* Item name */}
                        <h2 className="text-xl font-semibold text-secondary mt-2">{item.name}</h2>
                        {/* Item description */}
                        <p className="text-gray-600">{item.description}</p>
                        {/* Item price */}
                        <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                        {/* Buttons for viewing details and adding to cart */}
                        <div className="mt-2 flex justify-between items-center">
                            {/* Button to open the modal for more details */}
                            <button
                                onClick={() => openModal(item)} // Open the modal with the selected item
                                className="mt-2 text-orange-500 hover:underline" // Styling for the "See More Details" button
                            >
                                See More Details
                            </button>
                            {/* Button to add the item to the cart */}
                            <button
                                onClick={() => handleAddToCart(item)} // Add the item to the cart on click
                                className="mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition" // Styling for the "Add to Cart" button
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for displaying item details */}
            <Modal
                isOpen={modalIsOpen} // Control whether the modal is open
                onRequestClose={closeModal} // Close the modal when the overlay is clicked or the escape key is pressed
                style={customStyles} // Apply custom styles to the modal
                contentLabel="Item Details Modal" // Accessibility label for the modal
            >
                {/* Display item details if a selected item exists */}
                {selectedItem && (
                    <div>
                        {/* Item name in the modal */}
                        <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
                        {/* Item image in the modal */}
                        <img
                            src={selectedItem.image} // Image source from the selected item
                            alt={selectedItem.name} // Alt text for accessibility
                            className="w-full h-48 object-cover rounded-lg mb-4" // Styling for the image
                        />
                        {/* Item description */}
                        <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                        {/* Item price */}
                        <p className="text-gray-800 mb-2">
                            <strong>Price:</strong> ${selectedItem.price}
                        </p>
                        {/* Item ingredients */}
                        <p className="text-gray-800 mb-2">
                            <strong>Ingredients:</strong> {selectedItem.ingredients}
                        </p>
                        {/* Item calories */}
                        <p className="text-gray-800 mb-2">
                            <strong>Calories:</strong> {selectedItem.calories} kcal
                        </p>
                        {/* Item preparation time */}
                        <p className="text-gray-800 mb-4">
                            <strong>Preparation Time:</strong> {selectedItem.prepTime}
                        </p>
                        {/* Button to close the modal */}
                        <button
                            onClick={closeModal} // Close the modal on click
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600" // Styling for the "Close" button
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>

            {/* Toast notification for adding items to the cart */}
            {toast && (
                // Display the toast notification if it exists
                <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
                    {toast} {/* Display the toast message (e.g., "Item added to cart!") */}
                </div>
            )}
        </div>
    );
}

// Export the HomePage component as the default export
export default HomePage;