
import React from 'react';
import { TextField } from '@mui/material';

function AddressInputRow({ address, onChange }) {
    return (
        <div className="address-input-row">
            <TextField 
                label="Address Type" 
                name="name" 
                value={address.name} 
                onChange={onChange} 
                required 
            />
            <TextField
                label="First Name"
                name="firstName"
                value={address.firstName}
                onChange={onChange}
                required
            />
            <TextField
                label="Last Name"
                name="lastName"
                value={address.lastName}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="Address Line 1"
                name="address1"
                value={address.address1}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="Address Line 2"
                name="address2"
                value={address.address2}
                onChange={onChange}
            />
            <TextField
                className="mui-text-field"
                label="City"
                name="city"
                value={address.city}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="Zip Code"
                name="zipCode"
                value={address.zipCode}
                onChange={onChange}
                required
            />
            <TextField
                className="mui-text-field"
                label="State"
                name="state"
                value={address.state}
                onChange={onChange}
                required
            />
        </div>
    );
}

export default AddressInputRow;
