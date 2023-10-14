import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signupUserAsync } from "../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    if (!isValidEmail(email)) {
      setError("Invalid email format");
      return;
    }
    try {
      e.preventDefault();
      const resp = dispatch(signupUserAsync({ email, password, firstName, lastName }));
      console.log(resp);
      navigate('/');
    } catch (err) {
      console.log(err);
      setError("Signup failed. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login'); // Assuming your login route is '/login'
  };


  const isValidEmail = (email) => {
    // Basic email validation: check for "@" and a valid domain suffix
    return /\S+@\S+\.\S+/.test(email);
  };

  return (
    <>
      {loading && <Loader />}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundImage: `url("/Login.jpeg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Box
          component="div"
          sx={{
            width: "340px",
            padding: "30px",
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Almost opaque white
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.25)", // Soft box shadow
            marginRight: "10%",
          }}
        >
          <Typography variant="h5" align="center" mb={3} color="textSecondary">
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              variant="outlined"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              style={{ height: "56px" }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Signup
            </Button>
            </form>
          {error && (
            <Typography variant="body2" color="error" align="center" mt={2}>
              {error}
            </Typography>
          )}
          <Typography 
            variant="body2" 
            align="center" 
            mt={2} 
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleLoginRedirect}
          >
            Back to Login
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Signup;
