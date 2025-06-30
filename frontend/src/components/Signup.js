import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/user/signup', formData);
      alert("Signup successful! Please login.");
      window.location.href = '/login';
    } catch (err) {
      const errorMsg = err.response?.data?.details || "Signup failed";

      if (errorMsg.includes("duplicate key error") || errorMsg.includes("User already exists")) {
        alert("User already exists! Redirecting to login...");
        window.location.href = '/login';
      } else {
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="auth-box">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <button type="submit">Signup</button>
      </form>

      {/* ➕ Login Instead Button */}
      <p style={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <button onClick={() => window.location.href = '/login'} style={{
          background: 'none',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          textDecoration: 'underline',
          padding: 0,
          fontSize: 'inherit'
        }}>
          Login Instead
        </button>
      </p>
    </div>
  );
};

export default Signup;
