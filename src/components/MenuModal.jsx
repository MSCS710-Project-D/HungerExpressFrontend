import React from 'react';
import MenuItems from './MenuItems';

const MenuModal = ({ restaurant, onClose }) => {
    // Check if restaurant.menuItems is defined before mapping
    const menuItems = restaurant.menuItems || [];

    return (
        <div className="menu-modal-overlay">
            <div className="menu-modal">
                <button onClick={onClose}>Close</button>
                <h2>Menu Items for {restaurant.name}</h2>
                <ul>
                    {menuItems.map(item => (
                        <li key={item.id}>{item.name} - ${item.price}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MenuModal;
