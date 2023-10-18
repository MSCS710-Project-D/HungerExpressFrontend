import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material'; // Removed duplicate Typography import
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/authSlice';
import { updateUserAsync } from '../actions/auth';
import { fetchRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../actions/restaurantActions';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import Settings from './Settings';
import Typography from '@mui/material/Typography'; // Keep this single import for Typography
import '../styles/Header.scss'; // Adjust the file path to match your project structure



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
  const [isRestaurantModalOpen, setIsRestaurantModalOpen] = useState(false);
  const [restaurantAction, setRestaurantAction] = useState(''); // 'add', 'modify', or 'delete'
  const [restaurantImage, setRestaurantImage] = useState(null); // State to hold the uploaded image

  const customColors = {
    primary: '#FF5722', // Example primary color
    secondary: '#2196F3', // Example secondary color
    background: '#F5F5F5', // Example background color
    text: '#333', // Example text color
  };

  const dropdownButtonStyle = {
    marginRight: '10px',
    borderRadius: '4px',
    backgroundColor: customColors.secondary, // Custom button color
    transition: 'background-color 0.3s ease', // Smooth hover effect
    border: '1px solid rgba(255, 255, 255, 0.5)'
  };

  const [restaurantData, setRestaurantData] = useState({
    _id: '',
    name: '',
    description: '',
    address: '',
    phone_number: '',
    owner_id: '',
    category_id: '',
    restaurantImg: '',
  });

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });

  const dropdownRef = useRef(null);
  const restaurantDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutsideRestaurant = (event) => {
      if (restaurantDropdownRef.current && !restaurantDropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleClickOutsideProfile = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false); // <-- New state for Profile dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutsideRestaurant);
    document.addEventListener('mousedown', handleClickOutsideProfile);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideRestaurant);
      document.removeEventListener('mousedown', handleClickOutsideProfile);
    };
  }, []);
  const handleOpenRestaurantModal = (action) => {
    setRestaurantAction(action);
    if (action === 'add') {
      setRestaurantData({
        _id: '',
        name: '',
        description: '',
        address: '',
        phone_number: '',
        owner_id: '',
        category_id: '',
        restaurantImg: '',
      });
    }
    setIsRestaurantModalOpen(true);
  };

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false); // <-- New state for Profile dropdown

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRestaurantImage(file);
    }
  };

  const handleAddRestaurant = async () => {
    try {
      const response = await dispatch(addRestaurant(restaurantData));
      setIsRestaurantModalOpen(false);
      setRestaurantData({
        _id: '',
        name: '',
        description: '',
        address: '',
        phone_number: '',
        owner_id: '',
        category_id: '',
        restaurantImg: '',
      });
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  };

  const handleModifyRestaurant = async () => {
    try {
      const response = await dispatch(updateRestaurant(restaurantData));
      setIsRestaurantModalOpen(false);
      setRestaurantData({
        _id: '',
        name: '',
        description: '',
        address: '',
        phone_number: '',
        owner_id: '',
        category_id: '',
        restaurantImg: '',
      });
    } catch (error) {
      console.error("Error modifying restaurant:", error);
    }
  };

  const handleDropdownHover = (e, color) => {
    e.target.style.backgroundColor = color; 
  };

  const handleDeleteRestaurant = async () => {
    try {
      const response = await dispatch(deleteRestaurant(restaurantData._id));
      setIsRestaurantModalOpen(false);
      setRestaurantData({
        _id: '',
        name: '',
        description: '',
        address: '',
        phone_number: '',
        owner_id: '',
        category_id: '',
        restaurantImg: '',
      });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  const handleRestaurantActions = (action) => {
    if (restaurantAction === 'add') {
      handleAddRestaurant();
    } else if (restaurantAction === 'modify') {
      handleModifyRestaurant();
    } else if (restaurantAction === 'delete') {
      handleDeleteRestaurant();
    }
  }
  
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
      const response = await fetch('https://us-central1-maristhungerexpress.cloudfunctions.net/api/user/change-password', {
        // Adjust the endpoint as needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordData.newPassword,
          existingPassword: passwordData.existingPassword,
          username: passwordData.username
        }),
      });

      setPasswordError('');
      setIsChangePasswordModalOpen(false);
      setPasswordData({
        username: user?.username,
        existingPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
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

  const handleOpenMyOrders = () => {
    // Implement the logic for opening My Orders here.
  };  

  const isValidEmail = (email) => {
    // Basic email validation: check for "@" and a valid domain suffix
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <>
      <AppBar position="static" className="header" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Toolbar style={{ background: 'linear-gradient(to right, #ff8a00, #ec4e20)' }} className="header">
        
          <Box display="flex" alignItems="center" flexGrow={1}>
            <img src="/logo.png" alt="Logo" style={{ width: '50px', marginRight: '15px' }} />
            <Typography variant="h6" style={{ fontFamily: 'Roboto', fontSize: '24px', color: '#333' }}>
              Hunger Express
            </Typography>
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
              style={dropdownButtonStyle}
              onMouseEnter={(e) => handleDropdownHover(e, '#1976D2')}
              onMouseLeave={(e) => handleDropdownHover(e, customColors.secondary)}
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
            color="primary"
            style={{
              marginRight: '10px',
              borderRadius: '4px',
              backgroundColor: customColors.secondary, // Custom button color
              transition: 'background-color 0.3s ease', // Smooth hover effect
            }}
            onClick={handleOpenMyOrders}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1976D2'; // Change color on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = customColors.secondary; // Restore color on hover out
            }}
          >
            My Orders
          </Button>
          <Box className="restaurant-dropdown" ref={dropdownRef} style={{ position: 'relative', marginRight: '10px' }}>
          <Button
              color="primary"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                marginRight: '10px',
                borderRadius: '4px',
                backgroundColor: customColors.secondary, // Custom button color
                transition: 'background-color 0.3s ease', // Smooth hover effect
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1976D2'; // Change color on hover
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = customColors.secondary; // Restore color on hover out
              }}
            >
              Restaurants {isOpen ? '▲' : '▼'}
            </Button>
              {isOpen && (
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                  <li>
                    <Button onClick={() => handleOpenRestaurantModal('add')}>Add Restaurant</Button>
                  </li>
                  <li>
                    <Button onClick={() => handleOpenRestaurantModal('modify')}>Modify Restaurant</Button>
                  </li>
                  <li>
                    <Button onClick={() => handleOpenRestaurantModal('delete')}>Delete Restaurant</Button>
                  </li>
                </ul>
              )}
            </Box>

            <Button
            color="inherit"
            style={{
              marginRight: '10px',
              borderRadius: '4px',
              backgroundColor: customColors.secondary, // Custom button color
              transition: 'background-color 0.3s ease', // Smooth hover effect
              color: 'white'
            }}
            onClick={() => setIsChangePasswordModalOpen(true)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1976D2'; // Change color on hover
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = customColors.secondary; // Restore color on hover out
            }}
          >
            Change Password
          </Button>
          <Box className="profile-dropdown" ref={profileDropdownRef} style={{ position: 'relative', marginRight: '10px' }}>
          <Button
              color="inherit"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              style={dropdownButtonStyle}
              onMouseEnter={(e) => handleDropdownHover(e, '#1976D2')}
              onMouseLeave={(e) => handleDropdownHover(e, customColors.secondary)}
            >
              Profile {isProfileDropdownOpen ? '▲' : '▼'}
            </Button>
            {isProfileDropdownOpen && (
              <ul className={`dropdown-menu ${isProfileDropdownOpen ? 'show' : ''}`}>
                <li>
                  <Button onClick={handleSettingsClick}>Settings</Button>
                </li>
                <li>
                  <Button onClick={handleUpdateClick}>Update</Button>
                </li>
                <li>
                  <Button
                    onClick={() => {
                      setIsProfileDropdownOpen(false); // Close the dropdown
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

      <Dialog open={isRestaurantModalOpen} onClose={() => setIsRestaurantModalOpen(false)}>
      
        <DialogTitle>
          {restaurantAction === 'add' && 'Add Restaurant'}
          {restaurantAction === 'modify' && 'Modify Restaurant'}
          {restaurantAction === 'delete' && 'Delete Restaurant'}
        </DialogTitle>
        <DialogContent>
          {/* Always show ID and Name fields */}
          <TextField
            label="ID"
            variant="outlined"
            value={restaurantData._id}
            onChange={(e) => setRestaurantData((prev) => ({ ...prev, _id: e.target.value }))}
            style={{ marginBottom: '10px', width: '100%' }}
          />
          <TextField
            label="Name"
            variant="outlined"
            value={restaurantData.name}
            onChange={(e) => setRestaurantData((prev) => ({ ...prev, name: e.target.value }))}
            style={{ marginBottom: '10px', width: '100%' }}
          />

          {/* Only show these fields for 'Add Restaurant' action */}
          {restaurantAction === 'add' && (
            <>
              <TextField
                label="Description"
                variant="outlined"
                value={restaurantData.description}
                onChange={(e) => setRestaurantData((prev) => ({ ...prev, description: e.target.value }))}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <TextField
                label="Address"
                variant="outlined"
                value={restaurantData.address}
                onChange={(e) => setRestaurantData((prev) => ({ ...prev, address: e.target.value }))}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <TextField
                label="Phone Number"
                variant="outlined"
                value={restaurantData.phone_number}
                onChange={(e) => setRestaurantData((prev) => ({ ...prev, phone_number: e.target.value }))}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              {/* Add the file input for uploading an image */}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setRestaurantData((prev) => ({ ...prev, restaurantImg: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                style={{ marginBottom: '10px', width: '100%' }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRestaurantModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRestaurantActions} color="primary">
            {restaurantAction === 'add' && 'Add'}
            {restaurantAction === 'modify' && 'Modify'}
            {restaurantAction === 'delete' && 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
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
