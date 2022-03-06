
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login'
import Register from './pages/Register'
import Subscription from './pages/Subscription'
import { Navigate } from "react-router-dom"
import Global from "./global";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={sessionStorage.getItem("isLoggedIn")
          ? <Home />
          : <Navigate to="/login" />} />
        <Route exact path="/login" element={sessionStorage.getItem("isLoggedIn")
          ? <Navigate to="/" />
          : <Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="/subscription" element={<Subscription />} />
        {/* <Route exact path="/" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}