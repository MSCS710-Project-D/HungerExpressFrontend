import React, { useState, useEffect } from 'react';
import { fetchRestaurants } from '../actions/restaurantActions';
import RestaurantPane from './RestaurantPane';
import ImagePanel from './ImagePanel';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const loadRestaurants = async () => {
            const data = await fetchRestaurants();
            setRestaurants(data);
        };

        loadRestaurants();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            
            {/* Image Panel Component */}
            <ImagePanel />

            <div className="restaurant-grid">
                {restaurants.map(restaurant => (
                    <RestaurantPane key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
}

export default Home;
