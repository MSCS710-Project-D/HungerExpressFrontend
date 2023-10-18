import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; 

const MenuModal = ({ restaurant, menuItems, onClose }) => {
    const [quantities, setQuantities] = useState({});
    const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
    const [searchId, setSearchId] = useState(''); // For searching by ID
    const [localMenuItems, setLocalMenuItems] = useState(menuItems);
    const userRole = useSelector(state => state.user?.user_role); 

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

    const BASE_URL = "https://us-central1-maristhungerexpress.cloudfunctions.net/api";

    const handleOpenAddMenuItemDialog = () => {
        setNewMenuItem(prevState => ({
            ...prevState,
            restaurant_id: restaurant._id
        }));
        setIsAddMenuItemDialogOpen(true);
    };
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewMenuItem(prevState => ({
                    ...prevState,
                    image_url: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCloseAddMenuItemDialog = () => {const deleteMenuItem = async (menuItemId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/menuItems/delete/${menuItemId}`);
            console.log(response.data);
            // Update local state by filtering out the deleted item
            setLocalMenuItems(prevItems => prevItems.filter(item => item._id !== menuItemId));
        } catch (error) {
            console.error("Error deleting menu item:", error);
        }
    };
    
        setIsAddMenuItemDialogOpen(false);
    };

    const handleSaveMenuItem = async (payload) => {
        try {
            const response = await axios.post(`${BASE_URL}/menuItems/create`, payload);
            console.log(response.data);
            fetchAllMenuItemsForRestaurant(restaurant._id); // Refresh the menu items after saving
        } catch (error) {
            console.error("Error creating menu item:", error);
        }
    };
    
    useEffect(() => {
        fetchAllMenuItemsForRestaurant(restaurant._id);
    }, [restaurant]);

    const fetchMenuItemById = async (menuItemId) => {
        try {
            const response = await axios.get(`${BASE_URL}/menuItems/menu/${menuItemId}`);
            console.log(response.data);
            // Set the data to your state or handle as needed
        } catch (error) {
            console.error("Error fetching menu item:", error);
        }
    };

    const fetchAllMenuItemsForRestaurant = async (restaurantId) => {
        try {
            const response = await axios.get(`${BASE_URL}/menuItems/restaurant/${restaurantId}`);
            console.log(response.data);
            setLocalMenuItems(response.data); // Update the local state with the fetched menu items
        } catch (error) {
            console.error("Error fetching menu items for restaurant:", error);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitMenuItem = () => {
        const payload = {
            restaurant_id: newMenuItem.restaurant_id,
            name: newMenuItem.name,
            description: newMenuItem.description,
            price: parseFloat(newMenuItem.price).toFixed(2), // Ensure price is a float
            availability: newMenuItem.availability,
            image_url: newMenuItem.image_url
        };
    
        if (newMenuItem._id) {
            // If the newMenuItem has an _id, it means it's an existing item and we're editing it
            editMenuItem(newMenuItem._id, payload);
        } else {
            // Otherwise, it's a new item and we're creating it
            handleSaveMenuItem(payload);
        }
        handleCloseAddMenuItemDialog();
    };
    

    const editMenuItem = async (menuItemId, updatedData) => {
        try {
            const response = await axios.put(`${BASE_URL}/menuItems/update/${menuItemId}`, updatedData);
            console.log(response.data);
            // Refresh your menu items or handle the response as needed
        } catch (error) {
            console.error("Error updating menu item:", error);
        }
    };

    const updateQuantity = (itemId, amount) => {
        setQuantities(prevQuantities => {
            const currentQuantity = prevQuantities[itemId] || 0;
            const updatedQuantity = Math.max(0, currentQuantity + amount);
            return { ...prevQuantities, [itemId]: updatedQuantity };
        });
    };

    const deleteMenuItem = async (menuItemId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/menuItems/delete/${menuItemId}`);
            console.log(response.data);
            // Update local state by filtering out the deleted item
            setLocalMenuItems(prevItems => prevItems.filter(item => item._id !== menuItemId));
        } catch (error) {
            console.error("Error deleting menu item:", error);
        }
    };
    
    const handleEditMenuItem = (item) => {
        setNewMenuItem(item); // Populate the form with the item's details
        handleOpenAddMenuItemDialog(); // Open the dialog
    };

    const handleAddToCart = (itemName) => {
        alert(`${itemName} added to cart!`);
    };

    
    return (
        <div className="menu-modal-overlay">
            <div className="menu-modal">
                <button className="close-button" onClick={onClose}>&times;</button>
                {userRole === 'admin' && ( // Conditionally render the button for admins
                    <button className="add-menu-item-button" onClick={handleOpenAddMenuItemDialog}>Add Menu Item</button>
                )}
                <input 
                    type="text" 
                    placeholder="Enter menu item ID" 
                    value={searchId} 
                    onChange={(e) => setSearchId(e.target.value)} 
                />
                <button className="search-id-button" onClick={() => fetchMenuItemById(searchId)}>Search by ID</button>
                <h2>Menu Items for {restaurant.name}</h2>
                <div className="menu-item-list">
                    {localMenuItems?.map (item => (
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
                                <button className="edit-button" onClick={() => handleEditMenuItem(item)}>Edit</button>
                                <button className="delete-button" onClick={() => deleteMenuItem(item._id)}>Delete</button>
                                <button className="add-to-cart-button" onClick={() => handleAddToCart(item.name)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isAddMenuItemDialogOpen && (
                <div className="add-menu-item-overlay">
                    <div className="add-menu-item-dialog">
                        <h3>Add New Menu Item</h3>
                        <label>
                            Restaurant ID:
                            <input type="text" name="restaurant_id" value={newMenuItem.restaurant_id} readOnly />
                        </label>
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
                            <input type="number" step="0.01" name="price" value={newMenuItem.price} onChange={handleInputChange} />
                        </label>
                        <label>
                            Availability:
                            <select name="availability" value={newMenuItem.availability} onChange={handleInputChange}>
                                <option value="">Select Availability</option>
                                <option value="In stock">In stock</option>
                                <option value="Out of stock">Out of stock</option>
                                {/* Add more options as needed */}
                            </select>
                        </label>
                        <label>
                            Image URL:
                            <input 
                                type="text" 
                                name="image_url" 
                                value={newMenuItem.image_url || ''} // Ensure it falls back to an empty string if undefined
                                onChange={handleInputChange} 
                            />
                        </label>

                        <label>
                            Or Upload Image:
                            <input 
                                type="file" 
                                accept="image/*" 
                                name="uploaded_image" 
                                onChange={handleImageUpload} 
                            />
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