import React, { useState } from "react";
import logo from "../assets/logo.jpg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
     <div className="logo"> 
      <img src={logo} alt="logo" /></div>

      {/* Desktop Menu */}
      <ul className="desktop-menu">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#contact">Chatbot</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      
      <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <select className="mobile-menu">
          <option value="Home"><a href="#home">Home</a></option>
          <option value="About Us"><a href="#About Us">About Us</a></option>
          <option value="Services"><a href="#Services">Services</a></option>
          <option value="Chatbot"><a href="#Chatbot">Chatbot</a></option>
          <option value="Contact"><a href="#Contact">Contact</a></option>
          
        </select>
       
      )}
    </nav>
  );
}

export default Navbar;