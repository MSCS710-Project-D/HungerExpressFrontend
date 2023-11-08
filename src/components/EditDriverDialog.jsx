import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDriver } from '../actions/deliveryDriver'; // Ensure this action creator is correctly imported

const EditDriverDialog = ({ driver, onClose, onSave }) => {
    const dispatch = useDispatch();
    // Initialize the editedDriver state with the driver prop if it exists, otherwise with an empty object
    const [editedDriver, setEditedDriver] = useState(driver || {});

    // Update the editedDriver state when the driver prop changes
    useEffect(() => {
        if (driver) {
            setEditedDriver(driver);
        }
    }, [driver]);

    // Handle input changes and update the editedDriver state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedDriver(prev => ({ ...prev, [name]: value }));
    };

    // Handle the form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (editedDriver._id) {
            dispatch(updateDriver(editedDriver._id, editedDriver)); // Dispatch the action to update the driver
            onSave(editedDriver); // Call the onSave prop with the edited driver
        }
        onClose(); // Close the dialog
    };

    // If there's no driver, don't render the dialog
    if (!driver) {
        return null;
    }

    return (
        <div className="driver-dialog-overlay">
            <div className="driver-dialog">
                <button className="close-button" onClick={onClose}>X</button>
                <h3>Edit Driver</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={editedDriver.name || ''} // Use an empty string if editedDriver.name is undefined
                            onChange={handleChange}
                        />
                    </label>
                    {/* Add more fields as needed */}
                    <button type="submit" className="submit-button">Save</button>
                </form>
            </div>
        </div>
    );
};

export default EditDriverDialog;
