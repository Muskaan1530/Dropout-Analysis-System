import React, { useState } from "react";
import logo from "../assets/logo.jpg";

function Navbar({ setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      {/* Desktop Menu */}
      <ul className="desktop-menu">
        <li>
          <button style = {{
    padding: '8px 15px',
    borderRadius: '5px',
    backgroundColor: '#facc15',
    border: '1px solid #facc15',
    color: 'black',
    cursor: 'pointer',
  }} onClick={() => setCurrentPage('Home')}>Home</button>
        </li>
        <li>
          <button style = {{
    padding: '8px 15px',
    borderRadius: '5px',
    backgroundColor: '#facc15',
    border: '1px solid #facc15',
    color: 'black',
    cursor: 'pointer',
  }} onClick={() => setCurrentPage('About Us')}>About</button>
        </li>
        <li>
          <button style = {{
    padding: '8px 15px',
    borderRadius: '5px',
    backgroundColor: '#facc15',
    border: '1px solid #facc15',
    color: 'black',
    cursor: 'pointer',
  }} onClick={() => setCurrentPage('Services')}>Services</button>
        </li>
        <li>
          <button style = {{
    padding: '8px 15px',
    borderRadius: '5px',
    backgroundColor: '#facc15',
    border: '1px solid #facc15',
    color: 'black',
    cursor: 'pointer',
  }} onClick={() => setCurrentPage('Chatbot')}>Chatbot</button>
        </li>
        <li>
          <button style = {{
    padding: '8px 15px',
    borderRadius: '5px',
    backgroundColor: '#facc15',
    border: '1px solid #facc15',
    color: 'black',
    cursor: 'pointer',
  }} onClick={() => setCurrentPage('Contact Us')}>Contact</button>
        </li>
      </ul>

      <button style = {{
    padding: '8px 15px',
    borderRadius: '5px',
    backgroundColor: '#facc15',
    border: '1px solid #facc15',
    color: 'black',
    cursor: 'pointer',
  }} className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <button onClick={() => { setCurrentPage('Home'); setIsOpen(false); }}>Home</button>
          <button onClick={() => { setCurrentPage('About Us'); setIsOpen(false); }}>About Us</button>
          <button onClick={() => { setCurrentPage('Services'); setIsOpen(false); }}>Services</button>
          <button onClick={() => { setCurrentPage('Chatbot'); setIsOpen(false); }}>Chatbot</button>
          <button onClick={() => { setCurrentPage('Contact Us'); setIsOpen(false); }}>Contact</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
