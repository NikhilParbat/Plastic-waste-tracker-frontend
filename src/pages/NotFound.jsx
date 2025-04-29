// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={styles.link}>Go Home</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
  },
  title: {
    fontSize: '48px',
    color: '#333',
  },
  message: {
    fontSize: '18px',
    marginTop: '10px',
  },
  link: {
    marginTop: '20px',
    display: 'inline-block',
    color: '#4caf50',
    textDecoration: 'none',
    fontSize: '16px',
  }
};

export default NotFound;
