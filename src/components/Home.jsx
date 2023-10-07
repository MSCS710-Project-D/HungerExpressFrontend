import React, { useState, useEffect } from 'react';
import { fetchRestaurants } from '../actions/restaurantActions';
import RestaurantPane from './RestaurantPane';

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
            <div className="restaurant-grid">
                {restaurants.map(restaurant => (
                    <RestaurantPane key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
        </div>
    );
}

export default Home
