import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-secondary mb-4">Your Cart</h1>
        <p className="text-gray-600">Your cart is empty.</p>
        <Link to="/" className="text-primary hover:underline">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-secondary mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
            <div>
              <h2 className="text-xl font-semibold text-secondary">{item.name}</h2>
              <p className="text-gray-600">${item.price.toFixed(2)} x {item.qty}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item.id, item.qty - 1)}
                className="bg-gray-200 text-secondary px-2 py-1 rounded hover:bg-gray-300"
              >
                -
              </button>
              <span>{item.qty}</span>
              <button
                onClick={() => updateQuantity(item.id, item.qty + 1)}
                className="bg-gray-200 text-secondary px-2 py-1 rounded hover:bg-gray-300"
              >
                +
              </button>
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
      <div className="mt-6">
        <p className="text-xl font-bold text-secondary">Total: ${cartTotal.toFixed(2)}</p>
        <Link
          to="/confirmation"
          className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
        >
          Submit Order
        </Link>
      </div>
    </div>
  );
}

export default CartPage;