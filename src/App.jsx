import React, {useEffect} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./App.scss";

//components
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Header from "./components/Header";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { fetchUserLocation } from "./reducers/locationSlice"; 
import Settings from './components/Settings'; 


function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// function isAdmin({ children }) {
//   const user = useSelector((state) => state.auth.user);

//   return user.user_type === 'admin' ? children : <Navigate to="/login" replace />;
// }

// function isUser({ children }) {
//   const user = useSelector((state) => state.auth.user);

//   return user.user_type === 'user' ? children : <Navigate to="/login" replace />;
// }

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserLocation())
  }, [])
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/settings" element={<Settings />} />

          {/* <Route path='/order'
            element={
              <isUser></isUser>
            }
          >
          </Route> */}

          {/* Add more routes as needed */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
