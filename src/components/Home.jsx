// Home.jsx
import React, { useState, useEffect } from 'react';
import { fetchRestaurants } from '../actions/restaurantActions';
import RestaurantPane from './RestaurantPane';
import ImagePanel from './ImagePanel';
import MenuModal from './MenuModal';
import { fetchMenuItems } from '../actions/menuItems.js';
import ChatBot from '../components/ChatBot'; // Import the ChatBot component


const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [isChatBotVisible, setIsChatBotVisible] = useState(false); // State to control chatbot visibility

    // Function to toggle chatbot visibility
    const toggleChatBot = () => {
        setIsChatBotVisible(prev => !prev);
    };

    useEffect(() => {
        const orderString = localStorage.getItem('order');
        if (orderString) {
            const parsedOrder = JSON.parse(orderString);
            if (parsedOrder && parsedOrder.payload && parsedOrder.payload._id) {
                const _id = parsedOrder.payload._id;
                console.log('TESTTTTTT', _id);

                fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/process/${_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then(() => {
                    localStorage.removeItem('order');
                });
            }
        }
        const loadRestaurants = async () => {
            const data = await fetchRestaurants();
            setRestaurants(data);
        };

        loadRestaurants();
    }, []);

    const handleRestaurantClick = async (restaurant) => {
        setSelectedRestaurant(restaurant);
        const items = await fetchMenuItems(restaurant._id); // Fetch menu items
        setMenuItems(items); // Set menu items
        setIsMenuModalVisible(true);
    };

    return (
        <div>
            <ImagePanel />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '55px' }} className="restaurant-grid">
                {restaurants.map(restaurant => (
                    <RestaurantPane
                        key={restaurant._id}
                        restaurant={restaurant}
                        onRestaurantClick={() => handleRestaurantClick(restaurant)}
                    />
                ))}
            </div>
            {isMenuModalVisible && selectedRestaurant && (
                <MenuModal
                    restaurant={selectedRestaurant}
                    menuItems={menuItems} // Pass menu items to MenuModal
                    onClose={() => setIsMenuModalVisible(false)}
                />
            )}
            {/* Chatbot Trigger Button */}
            <button
                onClick={toggleChatBot}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Chat with Us
            </button>

            {/* Chatbot Component */}
            <ChatBot
                open={isChatBotVisible}
                onClose={toggleChatBot}
            />
            {isChatBotVisible && (
                <ChatBot
                    open={isChatBotVisible}
                    onClose={() => setIsChatBotVisible(false)}
                />
            )}
        </div>
    );
}

export default Home;
