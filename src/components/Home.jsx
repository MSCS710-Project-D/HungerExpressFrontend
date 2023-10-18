import React, { useState, useEffect } from 'react';
import { fetchRestaurants, deleteRestaurant } from '../actions/restaurantActions'; // Import the deleteRestaurant function
import RestaurantPane from './RestaurantPane';
import ImagePanel from './ImagePanel';
import MenuModal from './MenuModal';
import { fetchMenuItems } from '../actions/menuItems.js';
import { useSelector } from 'react-redux';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const user_type = useSelector(state => state.user?.user_type);

    useEffect(() => {
        const loadRestaurants = async () => {
            const data = await fetchRestaurants();
            setRestaurants(data);
        };

        loadRestaurants();
    }, []);

    // Create a function to handle restaurant deletion
    const handleDeleteRestaurant = async (restaurantId) => {
        try {
            await deleteRestaurant(restaurantId);
            alert('Restaurant deleted successfully!');
            // After deletion, you may want to refresh the list of restaurants
            const updatedRestaurants = restaurants.filter(restaurant => restaurant._id !== restaurantId);
            setRestaurants(updatedRestaurants);
        } catch (error) {
            alert('Error deleting restaurant. Please try again.');
        }
    };

    const handleRestaurantClick = async (restaurant) => {
        setSelectedRestaurant(restaurant);
        const items = await fetchMenuItems(restaurant._id);
        setMenuItems(items);
        setIsMenuModalVisible(true);
    };

    return (
        <div>
            <ImagePanel />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '55px' }} className="restaurant-grid">
                {restaurants.map((restaurant) => (
                    <RestaurantPane
                        key={restaurant._id}
                        restaurant={restaurant}
                        onRestaurantClick={() => handleRestaurantClick(restaurant)}
                        user_type={user_type}
                        onDelete={() => handleDeleteRestaurant(restaurant._id)} // Pass restaurant ID for deletion
                    />
                ))}
            </div>
            {isMenuModalVisible && selectedRestaurant && (
                <MenuModal
                    restaurant={selectedRestaurant}
                    menuItems={menuItems}
                    onClose={() => setIsMenuModalVisible(false)}
                />
            )}
        </div>
    );
}

export default Home;
