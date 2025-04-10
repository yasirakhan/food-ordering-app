# FlavorQuest - Food Ordering App

FlavorQuest is a React-based food ordering application built as a capstone project. It allows users to browse a menu, filter items by category, add items to a cart, adjust quantities, and submit orders with a confirmation page.

## Features
- **Menu with Filtering**: Browse food items and filter by category (All, Mains, Appetizers, Desserts).
- **Cart Management**: Add items to the cart, adjust quantities, and remove items.
- **Order Submission**: Submit orders and view a confirmation page with an order summary.
- **Responsive Design**: Built with Tailwind CSS for a clean, responsive UI.
- **Toast Notifications**: Success messages when adding items to the cart.
- **Cart Item Count**: Displays the total number of items in the cart in the Navbar.

## Tech Stack
- **React**: Frontend framework.
- **React Router**: For navigation between pages.
- **Tailwind CSS**: For styling (via CDN).
- **Context API**: For state management (cart).

## Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd food-ordering-app

2. Install dependencies:
    npm install

3. Start the development server
    npm start

4. Open http://localhost:3000 in your browser.

Project Structure

food-ordering-app/
├── node_modules/              # Dependencies
├── public/                   # Public assets
│   ├── index.html            # Main HTML file
│   ├── favicon.ico           # Favicon
│   ├── logo192.png           # Logo (default, unused)
│   ├── logo512.png           # Logo (default, unused)
│   ├── manifest.json         # Web app manifest
│   └── robots.txt            # Robots file
├── src/                      # Source code
│   ├── assets/               # Assets (e.g., images)
│   │   └── images/           # Food images
│   │       ├── spicy-mango-burger.jpg
│   │       ├── crispy-lotus-fries.jpg
│   │       ├── honeydew-sorbet.jpg
│   │       └── tamarind-chicken.jpg
│   ├── components/           # Reusable components
│   │   └── Navbar.js         # Navigation bar component
│   ├── contexts/             # Context for state management
│   │   └── CartContext.js    # Cart state management
|   |   └── UserContext.js    # User state management
│   ├── pages/                # Page components
│   │   ├── HomePage.js       # Homepage with menu and filtering
│   │   ├── CartPage.js       # Cart page for managing items
│   │   └── ConfirmationPage.js # Order confirmation page
│   │   └── HistoryPage.js    # History page
│   │   └── LoginPage.js      # Login page
│   ├── data/                 # Mock data
│   │   └── menuData.js       # Menu items data
│   ├── App.js                # Main app component with routing
│   ├── index.js              # Entry point for React
│   └── index.css             # Global styles
├── screenshots/              # Screenshots for README
│   ├── homepage.png
│   ├── cart-page.png
│   └── confirmation-page.png
├── .gitignore                # Git ignore file
├── package.json              # Project metadata and dependencies
├── package-lock.json         # Dependency lock file
└── README.md                 # Project documentation

Usage:
Homepage: Browse food items, filter by category, and add items to the cart.
Cart Page: View cart items, adjust quantities, remove items, and submit the order.
Confirmation Page: View the order summary and return to the Homepage (cart is cleared).

Future Improvements:
Persist cart data in local storage.
Add user authentication for order history.
Improve mobile responsiveness.


Author:
Yasir Arafat Khan
SAP ID: 52280913