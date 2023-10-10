import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authSlice';
import { updateUserAsync } from '../actions/auth';
import { useSnackbar } from 'notistack';




const Header = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const currentUser = useSelector(state => state.user?.currentUser);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    user_type: ''
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

  const handleUpdateClick = () => {
    // Fetch current values here and populate profileData
    // For demonstration purposes, I'm using dummy data
    setProfileData({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      address: user.address,
      user_type: user.user_type
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async () => {
    // Handle the update logic here
    debugger;
    try {
      await dispatch(updateUserAsync(profileData));
      enqueueSnackbar('Update User Success');
      console.log(profileData);
      setIsUpdateModalOpen(false);
    } catch (err) {
      enqueueSnackbar('Update User Failed')
    }
  };

  const [passwordData, setPasswordData] = useState({
    //username: currentUser.username, // Pre-populate the username
    username: currentUser?.username || '',
    existingPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New password and confirm password do not match!");
      return;
    }
    // TODO: Implement the logic to change the password using the provided data
    console.log(passwordData);
    setPasswordError('Password changed successfully!');
    setIsChangePasswordModalOpen(false);
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
    console.log("Searching for:", searchTerm);
    fetch(`/search?q=${searchTerm}`)
    .then(response => response.json())
    .then(data => {
      // Process and display the results
      console.log(data);
    })
    .catch(error => {
      console.error("Error fetching search results:", error);
    });
  };
  

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <img src="/logo.png" alt="Logo" style={{ width: '50px', marginRight: '15px' }} />
          <Typography variant="h6">
            Hunger Express
          </Typography>
        </Box>
        
        <Box mx={2} display="flex" alignItems="center">
            <TextField
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search..."
              variant="outlined"
              style={{ backgroundColor: 'white', width: '600px' }}  // Adjust the width value as needed
            />
            <Button color="primary" variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Box>
        <Box className="order-food-dropdown" ref={orderFoodRef} style={{ position: 'relative' }}>
          <Button color="inherit" onClick={() => setIsOrderFoodOpen(!isOrderFoodOpen)}
          style={{ marginRight: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '4px' }}
          >
            Order Food {isOrderFoodOpen ? '▲' : '▼'}
          </Button>
          {isOrderFoodOpen && (
            <ul className={`dropdown-menu ${isOrderFoodOpen ? 'show' : ''}`} style={{ position: 'absolute', top: '100%', left: '0' }}>
              <li><Button onClick={() => {/* Handle Search by Cuisines logic */}}>Search by Cuisines</Button></li>
              <li><Button onClick={() => {/* Handle Search by Restaurants logic */}}>Search by Restaurants</Button></li>
            </ul>
          )}
        </Box>
        <Button color="inherit"
          style={{ marginRight: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '4px' }}
          onClick={() => {/* Handle My Orders logic here */}}
        >
          My Orders
        </Button>
          
        <Button color="inherit" onClick={() => setIsChangePasswordModalOpen(true)}
          style={{ marginRight: '10px', border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '4px' }}
        >
          Change Password
        </Button>
        <Box className="profile-dropdown" ref={dropdownRef}>
          <Button color="inherit" onClick={() => setIsOpen(!isOpen)}
          style={{ border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '4px' }}
          >
            Profile {isOpen ? '▲' : '▼'}
          </Button>
          {isOpen && (
            <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
              <li><Button onClick={() => {/* Handle Settings */}}>Settings</Button></li>
              <li><Button onClick={handleUpdateClick}>Update</Button></li>
              <li>
                <Button onClick={() => {
                  setIsOpen(false); // Close the dropdown
                  dispatch(logout()); // Dispatch the logout action
                }}>
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
          {Object.keys(profileData).map((key) => (
            <div key={key}>
              <Typography variant="body1">{key}</Typography>
              <TextField
                label={`New ${key}`}
                variant="outlined"
                value={profileData[key]}
                onChange={(e) => setProfileData((prev) => ({ ...prev, [key]: e.target.value }))}
                style={{ marginBottom: '10px' }}
              />
            </div>
          ))}
          <Button variant="contained" color="primary" onClick={handleUpdateSubmit}>
            Update
          </Button>
        </DialogContent>
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
