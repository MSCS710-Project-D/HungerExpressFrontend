import React, { useState, useEffect } from 'react';
import '../styles/restaurants.scss';

const RestaurantPane = ({ restaurant }) => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        if (isMenuVisible) {
            fetch(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/menuItems/restaurant/${restaurant._id}`)
                .then(response => response.json())
                .then(data => setMenuItems(data))
                .catch(error => console.error("Error fetching menu items:", error));
        }
    }, [isMenuVisible, restaurant._id]);

    return (
        <div className="restaurant-pane" onClick={() => setIsMenuVisible(true)}>
            <img src={restaurant.imageURL} alt={restaurant.name} className="restaurant-image" />
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
            {isMenuVisible && (
                <div className="menu-modal">
                    <button onClick={() => setIsMenuVisible(false)}>Close</button>
                    <h2>Menu Items</h2>
                    <ul>
                        {menuItems.map(item => (
                            <li key={item.id}>{item.name} - ${item.price}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default RestaurantPane;
