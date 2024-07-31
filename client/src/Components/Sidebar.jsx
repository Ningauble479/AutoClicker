import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li><Link to="/">Main Menu</Link></li>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/upgrades">Upgrades</Link></li>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/building/1">Building Management</Link></li>
        <li><Link to="/survivors">Survivors</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
