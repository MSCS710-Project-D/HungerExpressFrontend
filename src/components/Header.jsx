import React, { useState, useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <img src="/logo.png" alt="Logo" style={{ width: '50px', marginRight: '15px' }} />
          <Typography variant="h6">
            Hunger Express
          </Typography>
        </Box>
        <Box>
          <Button style={{background: 'white'}} onClick={() => {dispatch(logout())}}>Logout</Button>
        </Box>
        <Box className="profile-dropdown" ref={dropdownRef}>
          <Button color="inherit" onClick={() => setIsOpen(!isOpen)}>Profile</Button>
          {isOpen && (
            <ul className="dropdown-menu">
              <li><Button onClick={() => {/* Handle Settings */}}>Settings</Button></li>
              <li><Button onClick={() => {/* Handle Update */}}>Update</Button></li>
              <li><Button onClick={() => {/* Handle Logout */}}>Logout</Button></li>
            </ul>
          )}
        </Box> 
      </Toolbar>
    </AppBar>
  );
};

export default Header;
