import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>Neo Library Book Management</h2>
      <div className="nav-links">
        <Link to="/" className="home">Home</Link>
        <Link to="/viewbooks" className="view-books">Books</Link>
      </div>
    </nav>
  );
};

export default Navbar;