import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignUpPage from './components/SignUpPage';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import ProfilePage from './components/ProfilePage';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';
import EventDetails from './components/EventDetails';
import EditEvent from './components/EditEvent'; 
import FeaturedEvents from './components/FeaturedEvents';
import Calendar from './calendar'
import './styles/App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/event/:id" element={<EventDetails />} /> 
        <Route path="/edit-event/:id" element={<EditEvent />} />
        <Route path="/featured-events" element={<FeaturedEvents />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;
