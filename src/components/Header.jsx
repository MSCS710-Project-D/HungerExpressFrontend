import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'; // Removed duplicate Typography import
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authSlice';
import { updateUserAsync } from '../actions/auth';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import Settings from './Settings';
import Typography from '@mui/material/Typography'; // Keep this single import for Typography



const Header = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const currentUser = useSelector(state => state.user?.currentUser);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false); // State for Settings Dialog

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    setIsSettingsDialogOpen(true);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\d{10}$/; // Assumes a 10-digit phone number
    return phoneNumberPattern.test(phoneNumber);
  };

  const handleUpdateClick = () => {
    // Fetch current values here and populate profileData
    // For demonstration purposes, I'm using dummy data
    setProfileData({
      username: user?.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      address: user.address,
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    // Check if phone number is valid before submitting the update
    if (profileData.phone_number && !isValidPhoneNumber(profileData.phone_number)) {
      enqueueSnackbar('Invalid phone number format. Please enter a 10-digit number.', { variant: 'error' });
      return;
    }
  
    try {
      await dispatch(updateUserAsync(profileData));
      enqueueSnackbar('Update User Success', { variant: 'success' });
      setIsUpdateModalOpen(false);
    } catch (err) {
      enqueueSnackbar('Update User Failed', { variant: 'error' });
    }
  };

  const [passwordData, setPasswordData] = useState({
    username: user?.username,
    existingPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match!');
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        // Adjust the endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (data.success) {
        setPasswordError('Password changed successfully!');
        setIsChangePasswordModalOpen(false);
      } else {
        setPasswordError(data.message || 'Error changing password.');
      }
    } catch (error) {
      setPasswordError('Error changing Password.');
    }
  };

  const [isOrderFoodOpen, setIsOrderFoodOpen] = useState(false);
  const orderFoodRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideOrderFood = (event) => {
      if (orderFoodRef.current && !orderFoodRef.current.contains(event.target)) {
        setIsOrderFoodOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideOrderFood);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideOrderFood);
    };
  }, []);

  const handleSearch = () => {
    // Here, dispatch an action to your backend to search with the searchTerm
    console.log('Searching for:', searchTerm);
    fetch(`/search?q=${searchTerm}`)
      .then((response) => response.json())
      .then((data) => {
        // Process and display the results
        console.log(data);
      })
      .catch((error) => {
        console.error('Error fetching search results:', error);
      });
  };

  const handleUserIdChange = (newUserId) => {
    // Assuming user ID change is triggered by user action, e.g., input field change
    setProfileData((prev) => ({
      ...prev,
      username: newUserId,
      email: newUserId, // Automatically set email to new user ID
    }));
  };

  const handleEmailChange = (newEmail) => {
    if (isValidEmail(newEmail) || newEmail === '') {
      setProfileData((prev) => ({
        ...prev,
        email: newEmail,
        username: newEmail, // Automatically set user ID to new email
      }));
    }
  };

  const isValidEmail = (email) => {
    // Basic email validation: check for "@" and a valid domain suffix
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box display="flex" alignItems="center" flexGrow={1}>
            <img src="/logo.png" alt="Logo" style={{ width: '50px', marginRight: '15px' }} />
            <Typography variant="h6">Hunger Express</Typography>
          </Box>

          <Box mx={2} display="flex" alignItems="center">
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              variant="outlined"
              style={{ backgroundColor: 'white', width: '600px' }} // Adjust the width value as needed
            />
            <Button color="primary" variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>

          <Box className="order-food-dropdown" ref={orderFoodRef} style={{ position: 'relative' }}>
            <Button
              color="inherit"
              onClick={() => setIsOrderFoodOpen(!isOrderFoodOpen)}
              style={{
                marginRight: '10px',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '4px',
              }}
            >
              Order Food {isOrderFoodOpen ? '▲' : '▼'}
            </Button>
            {isOrderFoodOpen && (
              <ul className={`dropdown-menu ${isOrderFoodOpen ? 'show' : ''}`} style={{ position: 'absolute', top: '100%', left: '0' }}>
                <li>
                  <Button onClick={() => {/* Handle Search by Cuisines logic */ }}>Search by Cuisines</Button>
                </li>
                <li>
                  <Button onClick={() => {/* Handle Search by Restaurants logic */ }}>Search by Restaurants</Button>
                </li>
              </ul>
            )}
          </Box>
          <Button
            color="inherit"
            style={{
              marginRight: '10px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '4px',
            }}
            onClick={() => {/* Handle My Orders logic here */ }}
          >
            My Orders
          </Button>

          <Button
            color="inherit"
            onClick={() => setIsChangePasswordModalOpen(true)}
            style={{
              marginRight: '10px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '4px',
            }}
          >
            Change Password
          </Button>
          <Box className="profile-dropdown" ref={dropdownRef}>
            <Button
              color="inherit"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '4px',
              }}
            >
              Profile {isOpen ? '▲' : '▼'}
            </Button>
            {isOpen && (
              <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                <li>
                  <Button onClick={handleSettingsClick}>Settings</Button>
                </li>
                <li>
                  <Button onClick={handleUpdateClick}>Update</Button>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      setIsOpen(false); // Close the dropdown
                      dispatch(logout()); // Dispatch the logout action
                    }}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          {/* Add the User ID input field here */}
          <TextField
            label="User ID"
            variant="outlined"
            value={profileData.username}
            onChange={(e) => {
              const newUserId = e.target.value;
              handleUserIdChange(newUserId);
            }}
            style={{ marginTop: '20px', marginBottom: '10px', width: '100%' }} // Added marginTop: '20px'
            />
         <TextField
            label="Email"
            variant="outlined"
            value={profileData.email}
            onChange={(e) => {
              const newEmail = e.target.value;
              handleEmailChange(newEmail);
            }}
            style={{ marginBottom: '10px', width: '100%' }}
            error={!isValidEmail(profileData.email)}
            helperText={!isValidEmail(profileData.email) ? 'Invalid email format' : ''}
          />

          <TextField
                label="Phone Number"
                variant="outlined"
                value={profileData.phone_number}
                onChange={(e) => {
                  const phoneNumber = e.target.value;
                  if (phoneNumber === '' || /^\d+$/.test(phoneNumber)) {
                    setProfileData((prev) => ({ ...prev, phone_number: phoneNumber }));
                  }
                }}
                inputProps={{
                  type: 'number',
                  pattern: '[0-9]*'
                }}
                style={{ marginBottom: '10px', width: '100%' }}
              />

            {Object.keys(profileData).map((key) => (
                  <div key={key}>
                    {key !== 'username' && key !== 'phone_number' && key !== 'email' && (
                      <>
                        <Typography variant="body1">{key}</Typography>
                        <TextField
                          label={`New ${key}`}
                          variant="outlined"
                          value={profileData[key]}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, [key]: e.target.value }))}
                          style={{ marginBottom: '10px' }}
                        />
                      </>
                    )}
                  </div>
                ))}
                <Button variant="contained" color="primary" onClick={handleUpdateSubmit}>
                  Update
                </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsDialogOpen} onClose={() => setIsSettingsDialogOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <Settings />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSettingsDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            value={passwordData.username}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, username: e.target.value }))}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <TextField
            label="Existing Password"
            variant="outlined"
            type="password"
            value={passwordData.existingPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, existingPassword: e.target.value }))}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <TextField
            label="New Password"
            variant="outlined"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          {passwordError && <Typography color="error">{passwordError}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsChangePasswordModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
