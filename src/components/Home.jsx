// Home.jsx
import React, { useState, useEffect } from 'react';
import { fetchRestaurants } from '../actions/restaurantActions';
import RestaurantPane from './RestaurantPane';
import ImagePanel from './ImagePanel';
import MenuModal from './MenuModal';
import MenuItems from './MenuItems';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);

    useEffect(() => {
        const loadRestaurants = async () => {
            const data = await fetchRestaurants();
            setRestaurants(data);
        };

        loadRestaurants();
    }, []);

    const handleRestaurantClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setIsMenuModalVisible(true);
    };

    return (
        <div>
            <ImagePanel />
            <div className="restaurant-grid">
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
                    onClose={() => setIsMenuModalVisible(false)}
                />
            )}
            {/* Include the MenuItems component */}
            {/* {selectedRestaurant && <MenuItems restaurant={selectedRestaurant} />} */}
        </div>
    );
}

export default Home;
