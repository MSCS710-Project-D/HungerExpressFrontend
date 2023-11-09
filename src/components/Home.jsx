// Home.jsx
import React, { useState, useEffect } from 'react';
import { fetchRestaurants } from '../actions/restaurantActions';
import RestaurantPane from './RestaurantPane';
import ImagePanel from './ImagePanel';
import MenuModal from './MenuModal';
import { fetchMenuItems } from '../actions/menuItems.js';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [menuItems, setMenuItems] = useState([]); 


    useEffect(() => {

        const order = localStorage.getItem('order');

        if (order) {
            const parsedOrder = JSON.parse(order);
            const _id = parsedOrder.payload._id

            console.log('TESTTTTTT', _id);

            fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/orders/process/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(() => {
                localStorage.removeItem('order');
            })
            
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
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '55px'}} className="restaurant-grid">
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
            {/* Include the MenuItems component */}
            {/* {selectedRestaurant && <MenuItems restaurant={selectedRestaurant} />} */}
        </div>
    );
}

export default Home;
