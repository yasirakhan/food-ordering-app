import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { v4 as uuidv4 } from 'uuid';

// Mocking list of delivery partners(randomly assigned to orders)
const mockDeliveryPartners = [
    { id: 1, name: "Veera Sangoli", contact: "+91-9878-76-8765" },
    { id: 2, name: "Samarth Uphadhyaya", contact: "+91-998-987-6543" },
    { id: 3, name: "Manikanta Veraga", contact: "+91-879-456-7890" },
    { id: 4, name: "Ketan Kulkarni", contact: "+91-687-897-7880" },
];

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    // const [history, setHistory] = useState(() => {
    //     const savedHistory = localStorage.getItem('orderHistory');
    //     return savedHistory ? JSON.parse(savedHistory) : {};
    // });

    // Loading order history from localStorage (persisted orders)
    const [history, setHistory] = useState(() => {
        const savedHistory = localStorage.getItem('orderHistory');
        let parsedHistory = savedHistory ? JSON.parse(savedHistory) : {};

        // Migrating old data: Adding missing fields to existing orders
        Object.keys(parsedHistory).forEach(userId => {
            parsedHistory[userId] = parsedHistory[userId].map(order => ({
                ...order,
                orderId: typeof order.orderId === 'string' && order.orderId
                    ? order.orderId
                    : String(order.orderId || uuidv4()), // Ensure orderId is a string
                deliveryStatus: order.deliveryStatus || 'Pending',
                deliveryPartner: order.deliveryPartner || {
                    name: 'Not Assigned',
                    contact: 'N/A',
                },
                notes: order.notes || '',
            }));
        });

        return parsedHistory;
    });

    // Persisting history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('orderHistory', JSON.stringify(history));
    }, [history]);

    const { user } = useUser();

    // Add an item to the cart (or increase quantity if already added)
    const addToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, qty: cartItem.qty + 1 }
                        : cartItem
                );
            }
            return [...prevCart, { ...item, qty: 1 }];
        });
    };

    // Remove an item from the cart
    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    // Update the quantity of an item in the cart(if qty <=0 removing it)
    const updateQuantity = (id, qty) => {
        if (qty <= 0) {
            removeFromCart(id);
        } else {
            setCart((prevCart) =>
                prevCart.map((item) =>
                    item.id === id ? { ...item, qty } : item
                )
            );
        }
    };

    // Save the order to history when a user checks out
    const saveOrder = (order, total, notes) => {
        if (!user) return; // Only save orders for logged-in users
        const timestamp = new Date().toISOString();
        const userHistory = history[user.id] || []; // Generating a simple order ID (incrementing based on user's history length)
        const orderId = uuidv4();
        // Assigning a random delivery partner
        const deliveryPartner =
            mockDeliveryPartners[Math.floor(Math.random() * mockDeliveryPartners.length)];
        const newOrder = { orderId, order, total, timestamp, deliveryStatus: 'Pending', notes: notes || '', deliveryPartner, };
        setHistory((prevHistory) => ({
            ...prevHistory,
            [user.id]: [...(prevHistory[user.id] || []), newOrder],
        }));
        // Simulating status updates
        simulateStatusUpdates(orderId);
    };

    // Updating the delivery status of an order
    const updateDeliveryStatus = (orderId, newStatus) => {
        if (!user) return;
        setHistory((prevHistory) => ({
            ...prevHistory,
            [user.id]: (prevHistory[user.id] || []).map((entry) =>
                entry.orderId === orderId ? { ...entry, deliveryStatus: newStatus } : entry
            ),
        }));
    };

    // Simulating delivery status updates at different time intervals
    const simulateStatusUpdates = (orderId) => {
        const statusUpdates = [
            { status: 'In Progress', delay: 3000 }, // 5 seconds
            { status: 'Out for Delivery', delay: 6000 }, // 10 seconds
            // { status: 'Delivered', delay: 15000 }, // 15 seconds
        ];

        //     statusUpdates.forEach(({ status, delay }) => {
        //         setTimeout(() => {
        //             updateDeliveryStatus(orderId, status);
        //         }, delay);
        //     });
        // };

        // Randomly deciding the final status
        const randomOutcome = Math.random();
        let finalStatus;
        if (randomOutcome < 0.2) {
            // 20% chance to cancel the order
            finalStatus = { status: 'Cancelled', delay: 4000 };
        } else if (randomOutcome < 0.5) {
            // 30% chance to stay "Out for Delivery" (simulating a delay)
            finalStatus = null; // No further update
        } else {
            // 50% chance to deliver the order
            finalStatus = { status: 'Delivered', delay: 9000 };
        }

        // Apply intermediate status updates
        statusUpdates.forEach(({ status, delay }) => {
            setTimeout(() => {
                setHistory((prevHistory) => {
                    const userOrders = prevHistory[user.id] || [];
                    const order = userOrders.find(order => order.orderId === orderId);

                    // Stop updating if the order was canceled
                    if (order?.deliveryStatus === 'Cancelled') {
                        return prevHistory;
                    }

                    return {
                        ...prevHistory,
                        [user.id]: userOrders.map(o =>
                            o.orderId === orderId ? { ...o, deliveryStatus: status } : o
                        ),
                    };
                });
            }, delay);
        });

        // Apply final status only if the order is not canceled
        if (finalStatus) {
            setTimeout(() => {
                setHistory((prevHistory) => {
                    const userOrders = prevHistory[user.id] || [];
                    const order = userOrders.find(order => order.orderId === orderId);

                    // **Check if order is already canceled before updating**
                    if (order?.deliveryStatus === 'Cancelled') {
                        return prevHistory; // Prevent further updates
                    }

                    return {
                        ...prevHistory,
                        [user.id]: userOrders.map(o =>
                            o.orderId === orderId ? { ...o, deliveryStatus: finalStatus.status } : o
                        ),
                    };
                });
            }, finalStatus.delay);
        }
    };

    // Retrieving order history for the logged-in user
    const getUserHistory = () => {
        return user ? history[user.id] || [] : [];
    };

    // Calculating total price of items in the cart
    const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, cartTotal, saveOrder, getUserHistory, updateDeliveryStatus, }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the CartContext in components
export const useCart = () => useContext(CartContext);