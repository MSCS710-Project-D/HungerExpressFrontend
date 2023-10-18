import React, { useState } from 'react';
import '../styles/restaurants.scss';
import { updateRestaurant, deleteRestaurant } from '../actions/restaurantActions';
import { useSelector } from 'react-redux';

const BASE_URL = "https://us-central1-maristhungerexpress.cloudfunctions.net/api/";

const RestaurantPane = ({ restaurant, onRestaurantClick, user_type, onDelete }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [editableRestaurant, setEditableRestaurant] = useState(null);

    const handleEditClick = (restaurant) => {
        setEditableRestaurant(restaurant);
        setModalOpen(true);
    };

    const handleSaveClick = async () => {
        try {
            await updateRestaurant(editableRestaurant);
            alert('Restaurant updated successfully!');
            setModalOpen(false);
        } catch (error) {
            alert('Error updating restaurant. Please try again.');
        }
    };

    const handleDeleteClick = async () => {
        // Call the onDelete function passed from Home.jsx
        onDelete(restaurant._id);
    };

    return (
        <div className="restaurant-pane" style={{ width: '350px' }}>
            <div onClick={() => onRestaurantClick(restaurant._id)}>
                <img width={350} height={350} src={restaurant.restaurantImg} alt={restaurant.name} className="restaurant-images" />
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
            {/* Display the edit and delete buttons based on user_type */}
            {user_type === 'admin' && (
                <div className="restaurant-actions">
                    <button className="edit-button" onClick={() => handleEditClick(restaurant)}>Edit</button>
                    <button className="delete-button" onClick={handleDeleteClick}>Delete</button>
                </div>
            )}
            {isModalOpen && (
                <div className="menu-modal-overlay">
                    <div className="menu-modal">
                        <button className="close-button" onClick={() => setModalOpen(false)}>X</button>
                        <h3>Edit Restaurant</h3>
                        <label>
                            Name:
                            <input type="text" value={editableRestaurant.name} onChange={(e) => setEditableRestaurant({...editableRestaurant, name: e.target.value})} />
                        </label>
                        <label>
                            Description:
                            <input type="text" value={editableRestaurant.description} onChange={(e) => setEditableRestaurant({...editableRestaurant, description: e.target.value})} />
                        </label>
                        <label>
                            Address:
                            <input type="text" value={editableRestaurant.address} onChange={(e) => setEditableRestaurant({...editableRestaurant, address: e.target.value})} />
                        </label>
                        <label>
                            Phone Number:
                            <input type="text" value={editableRestaurant.phone_number} onChange={(e) => setEditableRestaurant({...editableRestaurant, phone_number: e.target.value})} />
                        </label>
                        <button className="submit" onClick={handleSaveClick}>Save</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestaurantPane;
