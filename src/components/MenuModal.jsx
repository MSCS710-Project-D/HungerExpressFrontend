import React, { useState } from 'react';

const MenuModal = ({ restaurant, menuItems, onClose }) => {
    const [quantities, setQuantities] = useState({});

    const updateQuantity = (itemId, amount) => {
        setQuantities(prevQuantities => {
            const currentQuantity = prevQuantities[itemId] || 0;
            const updatedQuantity = Math.max(0, currentQuantity + amount);
            return { ...prevQuantities, [itemId]: updatedQuantity };
        });
    };

    const handleAddToCart = (itemName) => {
        alert(`${itemName} added to cart!`);
    };

    return (
        <div className="menu-modal-overlay">
            <div className="menu-modal">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Menu Items for {restaurant.name}</h2>
                {menuItems.map(item => (
                    <div key={item._id} className="menu-item-details">
                        <div className="quantity-control">
                            <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                            <span>{quantities[item._id] || 0}</span>
                            <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                        </div>
                        <div className="menu-item-info">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p>Price: ${item.price}</p>
                            <p>Availability: {item.availability}</p>
                            <p>Allergy Info: {item.allergy_info.join(', ') || 'None'}</p>
                            <p>Calories: {item.calories}</p>
                        </div>
                        <button className="add-to-cart-button" onClick={() => handleAddToCart(item.name)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MenuModal;
