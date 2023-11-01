import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../actions/order';
import { Paper, Grid, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import '../styles/Checkout.scss';

function Checkout() {
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);

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


    const handleDeliveryChange = (e) => {
        setDeliveryAddress({
            ...deliveryAddress,
            [e.target.name]: e.target.value
        });
    };

    const handleBillingChange = (e) => {
        setBillingAddress({
            ...billingAddress,
            [e.target.name]: e.target.value
        });
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
    
        dispatch(createOrder(newOrder));
    };
    
    return (
        <div className="checkout-container">
            <h2>Checkout</h2>
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
                            {!useDeliveryForBilling && (
                                <>
                                    <h3>Billing Address</h3>
                                    <TextField 
                                        className="mui-text-field"
                                        label="First Name" 
                                        name="firstName" 
                                        value={billingAddress.firstName} 
                                        onChange={handleBillingChange} 
                                        required 
                                    />
                                    <TextField 
                                        className="mui-text-field"
                                        label="Last Name" 
                                        name="lastName" 
                                        value={billingAddress.lastName} 
                                        onChange={handleBillingChange} 
                                        required 
                                    />
                                    <TextField 
                                        className="mui-text-field"
                                        label="Address Line 1" 
                                        name="address1" 
                                        value={billingAddress.address1} 
                                        onChange={handleBillingChange} 
                                        required 
                                    />
                                    <TextField 
                                        className="mui-text-field"
                                        label="Address Line 2" 
                                        name="address2" 
                                        value={billingAddress.address2} 
                                        onChange={handleBillingChange} 
                                    />
                                    <TextField 
                                        className="mui-text-field"
                                        label="City" 
                                        name="city" 
                                        value={billingAddress.city} 
                                        onChange={handleBillingChange} 
                                        required 
                                    />
                                    <TextField 
                                        className="mui-text-field"
                                        label="Zip Code" 
                                        name="zipCode" 
                                        value={billingAddress.zipCode} 
                                        onChange={handleBillingChange} 
                                        required 
                                    />
                                    <TextField 
                                        className="mui-text-field"
                                        label="State" 
                                        name="state" 
                                        value={billingAddress.state} 
                                        onChange={handleBillingChange} 
                                        required 
                                    />
                                </>
                            )}
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

        </div>
    );
}    

export default Checkout;
