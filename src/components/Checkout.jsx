import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/order';
import { Paper, Grid, TextField, FormControlLabel, Checkbox, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import '../styles/Checkout.scss';
import Confetti from 'react-confetti';
import { useAddress } from './AddressContext';

function Checkout() {
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);
    const [showSuccess, setShowSuccess] = useState(false);
    const { savedAddresses } = useAddress();
    const [selectedAddress, setSelectedAddress] = useState("None"); 


    const [deliveryAddress, setDeliveryAddress] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const [billingAddress, setBillingAddress] = useState({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        state: ''
    });

    const [useDeliveryForBilling, setUseDeliveryForBilling] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'creditCard'
    const [paypalDetails, setPaypalDetails] = useState({})

    const paypalRef = React.useRef();

    useEffect(() => {
        if (savedAddresses.length > 0) {
            setDeliveryAddress(savedAddresses[0]);
        }
    }, [savedAddresses]);

    
    useEffect(() => {
        if (!window.paypal) {
            return;
        }

        // Check if PayPal buttons are already rendered
        if (paypalRef?.current?.children?.length === 0) {
            window.paypal.Buttons({
                createOrder: function(data, actions) {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: order.order.total_price
                            }
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        setPaypalDetails(details);
                        alert('Transaction completed by ' + details.payer.name.given_name);
                    });
                }
            }).render(paypalRef.current);
        }
    }, [paymentMethod]);


    useEffect(() => {
        if (useDeliveryForBilling) {
            setBillingAddress(deliveryAddress);
        }
    }, [useDeliveryForBilling, deliveryAddress]);

    const handleDeliveryChange = (e) => {
        setDeliveryAddress({
            ...deliveryAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressSelection = (e) => {
        if (e.target.value === "None") {
            setDeliveryAddress({
                firstName: '',
                lastName: '',
                address1: '',
                address2: '',
                city: '',
                zipCode: '',
                state: ''
            });
        } else {
            const selectedAddress = savedAddresses[e.target.value];
            setDeliveryAddress(selectedAddress);
        }
    };

    const handleBillingChange = (e) => {
        setBillingAddress({
            ...billingAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleAddressChange = (e) => {
        const selectedIndex = e.target.value;
        if (selectedIndex !== "") {
            const selectedAddress = savedAddresses[selectedIndex];
            setDeliveryAddress(selectedAddress);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const deliveryString = Object.values(deliveryAddress).join(', ');
        const billingString = useDeliveryForBilling ? deliveryString : Object.values(billingAddress).join(', ');
    
        // Construct the order object
        const newOrder = {
            ...order,
            order: {
                ...order.order,
                delivery_address: deliveryString,
                billing_address: billingString
            }
        };
    
        // // Conditionally add payment_info only if needed
        if (paymentMethod === 'cash') {
            newOrder.order.payment_info = {type: "COD", amount: order.order.total_price};
        } else if (paypalDetails) {
            newOrder.order.payment_info = paypalDetails;
        }
    
        dispatch(createOrder(newOrder))
        .then((resp) => {

            console.log(resp);
            localStorage.setItem('order', JSON.stringify(resp));
            var test = resp;
            
            // Show confetti and success message upon successful dispatch
            setShowSuccess(true);

            // Redirect to home after 5 seconds
            setTimeout(() => {
                console.log(test)
                setShowSuccess(false); // Hide confetti and success message
                window.location.href = "/home"; // Redirect to home page
            }, 5000);
        })
        .catch(error => {
            // Handle any errors from the dispatch here
            console.error("Error creating order:", error);
        });
    };
    
    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
            <FormControl variant="outlined" sx={{ width: '250px', marginBottom: '20px' }}>
                <InputLabel id="saved-address-label">Select a Saved Address</InputLabel>
                <Select
                    labelId="saved-address-label"
                    label="Select a Saved Address"
                    onChange={handleAddressSelection}
                    value={selectedAddress}
                >
                    <MenuItem value="None">
                        <em>None</em>
                    </MenuItem>
                    {savedAddresses.map((address, index) => (
                        <MenuItem key={index} value={index}>
                            {address.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Paper elevation={3} className="checkout-paper">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <h3>Delivery Address</h3>
                            <TextField 
                                className="mui-text-field"
                                label="First Name" 
                                name="firstName" 
                                value={deliveryAddress.firstName} 
                                onChange={handleDeliveryChange} 
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Last Name" 
                                name="lastName" 
                                value={deliveryAddress.lastName} 
                                onChange={handleDeliveryChange} 
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Address Line 1" 
                                name="address1" 
                                value={deliveryAddress.address1} 
                                onChange={handleDeliveryChange} 
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Address Line 2" 
                                name="address2" 
                                value={deliveryAddress.address2} 
                                onChange={handleDeliveryChange} 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="City" 
                                name="city" 
                                value={deliveryAddress.city} 
                                onChange={handleDeliveryChange} 
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Zip Code" 
                                name="zipCode" 
                                value={deliveryAddress.zipCode} 
                                onChange={handleDeliveryChange} 
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="State" 
                                name="state" 
                                value={deliveryAddress.state} 
                                onChange={handleDeliveryChange} 
                                required 
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={useDeliveryForBilling}
                                        onChange={(e) => setUseDeliveryForBilling(e.target.checked)}
                                    />
                                }
                                label="Use Delivery Address as Billing Address"
                            />
                            <h3>Billing Address</h3>
                            <TextField 
                                className="mui-text-field"
                                label="First Name" 
                                name="firstName" 
                                value={billingAddress.firstName} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Last Name" 
                                name="lastName" 
                                value={billingAddress.lastName} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Address Line 1" 
                                name="address1" 
                                value={billingAddress.address1} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Address Line 2" 
                                name="address2" 
                                value={billingAddress.address2} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                            />
                            <TextField 
                                className="mui-text-field"
                                label="City" 
                                name="city" 
                                value={billingAddress.city} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="Zip Code" 
                                name="zipCode" 
                                value={billingAddress.zipCode} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                                required 
                            />
                            <TextField 
                                className="mui-text-field"
                                label="State" 
                                name="state" 
                                value={billingAddress.state} 
                                onChange={handleBillingChange} 
                                disabled={useDeliveryForBilling}
                                required 
                            />
                        </Grid>
                    </Grid>
    
                    <h3>Payment Method</h3>
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="cash">Cash on Delivery</option>
                        <option value="paypal">PayPal</option>
                    </select>
    
                    {paymentMethod === 'paypal' && (
                        <div ref={paypalRef}></div>
                    )}
    
                    <Button type="submit" variant="contained" color="primary" className="place-order-button">Place Order</Button>
                </form>
            </Paper>
            {showSuccess && (
                <>
                    <Confetti />
                    <div className="success-message">Order created successfully!</div>
                </>
            )}
        </div>
    );
}

export default Checkout;
