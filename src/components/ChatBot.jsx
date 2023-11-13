import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ChatBot = ({ open, onClose }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        console.log('Message sent:', message);
        // Implement the logic to handle the message
        setMessage(''); // Clear the message input after sending
    };

    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="chatbot-dialog-title">
            <DialogTitle id="chatbot-dialog-title">Chat with Us</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="message"
                    label="Type your message"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleSend} variant="contained" color="secondary">
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatBot;
