import React from 'react';

const RestaurantPane = ({ restaurant }) => {
    return (
        <div className="restaurant-pane">
            <img src={restaurant.imageURL} alt={restaurant.name} />
            <h2>{restaurant.name}</h2>
            <p>{restaurant.description}</p>
            {/* Add more restaurant details as needed */}
        </div>
    );
}

export default RestaurantPane;
