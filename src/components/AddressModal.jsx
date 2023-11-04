import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddressInputRow from './AddressInputRow'; // Adjust the path as per your directory structure
import SavedAddresses from './SavedAddresses';
import { useAddress } from './AddressContext'; // Adjust the path as per your directory structure

function AddressModal({ isOpen, onClose }) {
    const { savedAddresses, addAddress } = useAddress();
    const [address, setAddress] = useState({
        name: '',
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveAddress = () => {
        addAddress(address);
        setAddress({
            name: '',
            firstName: '',
            lastName: '',
            address1: '',
            address2: '',
            city: '',
            zipCode: '',
            state: ''
        }); // Reset the form
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>Manage Addresses</DialogTitle>  
            <DialogContent>
                <AddressInputRow address={address} onChange={handleAddressChange} />
                <SavedAddresses addresses={savedAddresses} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSaveAddress} color="primary">Save Address</Button>
                <Button onClick={onClose} color="secondary">Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddressModal;
