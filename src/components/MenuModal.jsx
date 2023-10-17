import React, { useState } from 'react';

const MenuModal = ({ restaurant, menuItems, onClose }) => {
    const [quantities, setQuantities] = useState({});
    const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
    // State for the new menu item form
    const [newMenuItem, setNewMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        availability: '',
        image_url: '',
        allergy_info: [],
        calories: ''
    });

    const handleOpenAddMenuItemDialog = () => {
        setIsAddMenuItemDialogOpen(true);
    };

    const handleCloseAddMenuItemDialog = () => {
        setIsAddMenuItemDialogOpen(false);
    };

    const handleSaveMenuItem = (newMenuItem) => {
    // Here, you can update the state and/or make an API call to save the new menu item to the backend.
    console.log(newMenuItem);
};

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitMenuItem = () => {
        handleSaveMenuItem(newMenuItem);
        handleCloseAddMenuItemDialog();
    };
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
                <button onClick={handleOpenAddMenuItemDialog}>Add Menu Item</button>
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
                            <div className="menu-item-actions">
                                <button className="add-to-cart-button" onClick={() => handleAddToCart(item.name)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
            </div>
            {isAddMenuItemDialogOpen && (
                <div className="add-menu-item-overlay">
                    <div className="add-menu-item-dialog">
                        <h3>Add New Menu Item</h3>
                        <label>
                            Name:
                            <input type="text" name="name" value={newMenuItem.name} onChange={handleInputChange} />
                        </label>
                        <label>
                            Description:
                            <input type="text" name="description" value={newMenuItem.description} onChange={handleInputChange} />
                        </label>
                        <label>
                            Price:
                            <input type="number" name="price" value={newMenuItem.price} onChange={handleInputChange} />
                        </label>
                        <label>
                            Availability:
                            <input type="text" name="availability" value={newMenuItem.availability} onChange={handleInputChange} />
                        </label>
                        <label>
                            Image URL:
                            <input type="text" name="image_url" value={newMenuItem.image_url} onChange={handleInputChange} />
                        </label>
                        <label>
                            Allergy Info (comma-separated):
                            <input type="text" name="allergy_info" value={newMenuItem.allergy_info.join(', ')} onChange={(e) => setNewMenuItem(prevState => ({ ...prevState, allergy_info: e.target.value.split(', ').map(item => item.trim()) }))} />
                        </label>
                        <label>
                            Calories:
                            <input type="text" name="calories" value={newMenuItem.calories} onChange={handleInputChange} />
                        </label>
                        <button onClick={handleSubmitMenuItem}>Save</button>
                        <button onClick={handleCloseAddMenuItemDialog}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuModal;
