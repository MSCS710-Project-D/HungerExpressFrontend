import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center">
          <img src="/logo.png" alt="Logo" style={{ width: '50px', marginRight: '15px' }} />
          <Typography variant="h6">
            Hunger Express
          </Typography>
        </Box>
        <Box>
        <Button style={{background: 'white'}} onClick={() => {dispatch(logout())}}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
