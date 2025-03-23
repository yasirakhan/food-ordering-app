import { useState, useContext } from 'react';
import menuData from '../data/menuData';
import { CartContext } from '../contexts/CartContext';

function HomePage() {
    const [category, setCategory] = useState('All');
    const [toast, setToast] = useState(null);
    const { addToCart } = useContext(CartContext);
    const categories = ['All', ...new Set(menuData.map(item => item.category))];
    const filteredItems = category === 'All' ? menuData : menuData.filter(item => item.category === category);

    const handleAddToCart = (item) => {
        addToCart(item);
        setToast(`${item.name} added to cart!`);
        setTimeout(() => setToast(null), 2000); // Hide toast after 2 seconds
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-secondary mb-4">Welcome to FlavorQuest</h1>
            <div className="flex space-x-4 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors ${category === cat ? 'bg-primary text-white' : 'bg-gray-200 text-secondary hover:bg-gray-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:scale-105">
                        <img src={item.image} alt={item.name} className="w-full h-52 object-cover rounded-lg border border-gray-200" />
                        <h2 className="text-xl font-semibold text-secondary mt-2">{item.name}</h2>
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                        <button
                            onClick={() => handleAddToCart(item)}
                            className="mt-2 bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
            {toast && (
                <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg">
                    {toast}
                </div>
            )}
        </div>
    );
}

export default HomePage;