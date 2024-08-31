import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Account from './components/account';
import ForgotPassword from './components/forgotpass';
import ChangePassword from './components/changepass';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/forgotpass" element={<ForgotPassword />} />
        <Route path="/changepass" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
