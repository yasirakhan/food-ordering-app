import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

function Navbar() {
  const { cart } = useContext(CartContext);
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);

  return (
    <nav className="bg-secondary text-white p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide hover:text-primary transition-colors">
        FlavorQuest
      </Link>
      <div className="space-x-6">
        <Link to="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/cart" className="hover:text-primary transition-colors relative">
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;