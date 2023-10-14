import React from 'react';
import '../styles/restaurants.scss';

const BASE_URL = "https://us-central1-maristhungerexpress.cloudfunctions.net/api/";

const RestaurantPane = ({ restaurant, onRestaurantClick }) => {
    return (
        <div className="restaurant-pane">
            <div onClick={() => onRestaurantClick(restaurant._id)}>
                <img src={`${BASE_URL}restaurant-images/${restaurant._id}`} alt={restaurant.name} className="restaurant-images" />
                <div className="restaurant-name">{restaurant.name}</div>
                <div className="restaurant-description">{restaurant.description}</div>
                <div className="restaurant-details">
                    <div className="restaurant-address">
                        <span className="icon">📍</span>
                        {restaurant.address}
                    </div>
                    <div className="restaurant-phone">
                        <span className="icon">📞</span>
                        {restaurant.phone_number}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RestaurantPane;
