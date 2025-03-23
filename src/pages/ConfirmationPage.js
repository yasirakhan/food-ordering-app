import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

function ConfirmationPage() {
  const { cart, cartTotal, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    setCart([]); // Clear the cart
    navigate('/'); // Navigate to Home
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-secondary mb-4">Your Order is Submitted Successfully!</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-secondary mb-2">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.name} x {item.qty}</span>
            <span>${(item.price * item.qty).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-secondary mt-2">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={handleBackToHome}
        className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
      >
        Back to Home
      </button>
    </div>
  );
}

export default ConfirmationPage;