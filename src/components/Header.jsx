import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Typography from '@mui/material/Typography';
import '../styles/Header.scss';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { clearOrder } from '../reducers/orderSlice';
import { Table, TableBody, TableCell, TableHead, TableRow, Avatar } from '@mui/material';
import AddVehicleDialog from '../components/AddVehicleDialog';
import "../styles/VehicleDialog.scss";
import AddressModal from './AddressModal';
import axios from 'axios';
import DriverManagement from './DriverManagement';
import EditDriverDialog from '../components/EditDriverDialog';
import DriversComponent from '../components/DriversComponent';
import { fetchAllOrders } from '../actions/order'; 
import AdminOrders from '../components/AdminOrders'; 

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
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const order = useSelector((state) => state.order);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const cart = useSelector(state => state.order);
  const navigate = useNavigate();
  const [isDriverDropdownOpen, setIsDriverDropdownOpen] = useState(false);
  const driverDropdownRef = useRef(null);
  const [searchLicensePlate, setSearchLicensePlate] = useState('');
  const [isLicensePlateDialogOpen, setIsLicensePlateDialogOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDriversComponentOpen, setIsDriversComponentOpen] = useState(false);
  const [isDriversDialogOpen, setIsDriversDialogOpen] = useState(false);
  const [isEditDriverDialogOpen, setIsEditDriverDialogOpen] = useState(false);


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

  const [vehicle, setVehicle] = useState({
    user_id: '', // This will be autogenerated or fetched from the user table
    vehicle_type: '',
    license_plate: '',
    availability: ''
  });

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
  });

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver); 
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);   
    setSelectedDriver(null);   
  };

  const handleAllOrdersNavigation = () => {
    navigate('/allOrders'); 
    dispatch(fetchAllOrders());
  };

  const dropdownRef = useRef(null);
  const restaurantDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const myOrdersRef = useRef(null);

  // Effect for My Orders dropdown
  useEffect(() => {
    const handleClickOutsideMyOrders = (event) => {
      if (myOrdersRef.current && !myOrdersRef.current.contains(event.target)) {
        setIsMyOrdersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideMyOrders);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMyOrders);
    };
  }, []);

  // Effect for "Delivery Driver" dropdown
  useEffect(() => {
    const handleClickOutsideDriver = (event) => {
      if (driverDropdownRef.current && !driverDropdownRef.current.contains(event.target)) {
        setIsDriverDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideDriver);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDriver);
    };
  }, []);

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
  const [isAddVehicleDialogOpen, setIsAddVehicleDialogOpen] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setRestaurantImage(file);
    }
  };
  const handleAddDriver = () => {
    setIsAddVehicleDialogOpen(true);
  };
  const handleLogout = () => {
    dispatch(clearOrder());
  }

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
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMyOrdersOpen(false);  // Close the dropdown
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleUpdateDriver = async () => {
    try {
      // Assuming you have an endpoint to update driver details
      const response = await axios.put(`https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers/${selectedDriver._id}`, selectedDriver);
      alert('Driver details updated successfully!');
      setIsEditDialogOpen(false); // Close the edit dialog after updating
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver details:", error);
      alert('Error updating driver details. Please try again.');
    }
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

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrivers = async (edit) => {
    try {
      const response = await axios.get('https://us-central1-maristhungerexpress.cloudfunctions.net/api/drivers');
      setDrivers(response.data);
      setIsDriverDropdownOpen(true);

      if (edit) setIsEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      alert('Error fetching drivers. Please try again.');
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);
  const handleDeleteDriver = async () => {
    // Confirm with the user
    const isConfirmed = window.confirm('Are you sure you want to delete this driver?');

    if (isConfirmed) {
      try {
        const response = await fetch(`YOUR_API_ENDPOINT?licensePlate=${searchLicensePlate}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          alert('Driver deleted successfully!');
        } else {
          alert('Error deleting driver. Please try again.');
        }
      } catch (error) {
        console.error("Error deleting driver:", error);
        alert('Error deleting driver. Please try again.');
      }
    }
  };

  const handleDriverSelection = (driver) => {
    setSelectedDriver(driver);
    setIsEditDialogOpen(true); // Open the edit dialog
  };

  const handleEditDrivers = () => {
    // Logic to open the EditDriverDialog
    setIsEditDriverDialogOpen(true); // Assuming you have a state to control the dialog visibility
  };
  // Function to open the edit dialog with the selected driver
  const openEditDriverDialog = (driver) => {
    setSelectedDriver(driver);
    setIsEditDriverDialogOpen(true);
  };

  const closeEditDriverDialog = () => {
    setIsEditDriverDialogOpen(false);
    setSelectedDriver(null);
  };


  const handleSearchDriver = () => {
    // Fetch the driver details based on the license plate
    const driverDetails = drivers;

    if (driverDetails) {
      // Populate the vehicle state with the fetched details
      setVehicle(driverDetails);
      // Open the edit dialog
      setIsAddVehicleDialogOpen(true);
      // Close the license plate dialog
      setIsLicensePlateDialogOpen(false);
    } else {
      alert('Driver not found!');
    }
  };


  const handleOpenMyOrders = () => {
    setIsOrderDropdownOpen(prevState => !prevState); // Toggle the dropdown state
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
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Typography variant="h6" style={{ fontFamily: 'Roboto', fontSize: '24px', color: '#333' }}>
                Hunger Express
              </Typography>
            </Link>
          </Box>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            {
              user?.user_type !== "admin" && (
                <Button
                  color="inherit"
                  onClick={() => {
                    navigate('/order-history')
                    // setIsMyOrdersOpen(!isMyOrdersOpen);
                  }}
                  style={dropdownButtonStyle}  // Use the same style as Order Food
                  onMouseEnter={(e) => handleDropdownHover(e, '#1976D2')}  // Use the same hover effect
                  onMouseLeave={(e) => handleDropdownHover(e, customColors.secondary)}  // Use the same hover out effect
                >
                  My Orders
                </Button>
              )
            }
          </div>
          <Box className="restaurant-dropdown" ref={dropdownRef} style={{ position: 'relative', marginRight: '10px' }}>
            {
              user?.user_type === 'admin' && (
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
              )
            }
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
          {
            user?.user_type === 'admin' && (
              <Button
                color="inherit"
                style={{
                  marginRight: '10px',
                  borderRadius: '4px',
                  backgroundColor: customColors.secondary,
                  transition: 'background-color 0.3s ease',
                  color: 'white'
                }}
                onClick={handleAllOrdersNavigation}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1976D2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = customColors.secondary;
                }}
              >
                All Orders
              </Button>

            )
          }
          {/* Delivery Driver dropdown */}
          <Box className="driver-dropdown" ref={driverDropdownRef} style={{ position: 'relative', marginRight: '10px' }}>
            {
              user?.user_type === 'admin' && (
                <Button
                  color="primary"
                  onClick={() => setIsDriverDropdownOpen(!isDriverDropdownOpen)}
                  style={dropdownButtonStyle}
                  onMouseEnter={(e) => handleDropdownHover(e, '#1976D2')}
                  onMouseLeave={(e) => handleDropdownHover(e, customColors.secondary)}
                >
                  Delivery Driver {isDriverDropdownOpen ? '▲' : '▼'}
                </Button>
              )
            }
            {isDriverDropdownOpen && (
              <ul className={`dropdown-menu ${isDriverDropdownOpen ? 'show' : ''}`}>
                <li>
                  <Button onClick={handleAddDriver}>Add Driver</Button>
                </li>
                <li>
                  <Button onClick={() => { fetchDrivers(true) }}>Edit Drivers</Button>
                </li>
                {/* <li>
                  <Button onClick={handleDeleteDriver}>Delete Driver</Button>
                </li> */}
              </ul>
            )}
          </Box> {/* Make sure this closing tag is present */}
          <EditDriverDialog
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            driver={drivers}
            onSave={() => {
              setIsEditDialogOpen(false)
              //  fetchDrivers();
            }}
          />
          {/* Add Vehicle Dialog */}
          {isAddVehicleDialogOpen && (
            <AddVehicleDialog
              onClose={() => setIsAddVehicleDialogOpen(false)}
              onSave={(vehicleData) => {
                // Handle the logic to save the vehicle data here
                setIsAddVehicleDialogOpen(false);
              }}
            />
          )}
          {/* Drivers Dialog */}
          {isDriversDialogOpen && (
            <DriversComponent onClose={() => setIsDriversDialogOpen(false)} />
          )}
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
                <Button onClick={() => setIsAddressModalOpen(true)}>Manage Address</Button>
                <AddressModal
                  isOpen={isAddressModalOpen}
                  onClose={() => setIsAddressModalOpen(false)}
                />
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
            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={() => setIsAddressModalOpen(false)}
            />
          </Box>
          {
            user?.user_type !== 'admin' && (
              <Button
                color="inherit"
                style={{
                  marginRight: '10px',
                  borderRadius: '4px',
                  backgroundColor: customColors.secondary,
                  transition: 'background-color 0.3s ease',
                  color: 'white'
                }}
                onClick={() => setIsCartDialogOpen(true)}
              >
                <ShoppingCartIcon style={{ marginRight: '5px' }} /> {order?.orderItems?.length}
              </Button>
            )
          }
        </Toolbar>
      </AppBar >
      <Dialog open={isCartDialogOpen} onClose={() => setIsCartDialogOpen(false)}>
        <DialogTitle>Shopping Cart</DialogTitle>
        <DialogContent>
          {order?.orderItems?.length ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.orderItems.map((item, index) => {
                  const itemId = item?._id;
                  if (!itemId) {
                    console.warn("Unexpected item structure:", item);
                    return null;
                  }

                  return (
                    <TableRow key={itemId}>
                      <TableCell>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{ width: '50px', height: '50px' }} />
                        ) : (
                          <Avatar variant="square">N/A</Avatar>
                        )}
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>${item.subtotal}</TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={4} align="right">Total:</TableCell>
                  <TableCell>${order.order.total_price}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body1">Your cart is empty.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCartDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            navigate('/checkout');
            setIsCartDialogOpen(false);
          }} color="primary">
            Checkout
          </Button>
        </DialogActions>
      </Dialog>
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
