// src/components/Hero.js
import React, { useState } from "react";
// Make sure this image path is correct according to your project structure
import image3 from "../assets/image3.jpg";

function Hero({ onLogin }) { // onLogin prop ko receive karein
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleGetStarted = () => setShowPopup(true);

  const handleRoleSelect = (role) => {
    setUserType(role);
    setShowPopup(false);
    setShowForm(true);
  };
  
  const handleClose = () => {
    setShowPopup(false);
    setShowForm(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // For now, we directly call onLogin.
    // Later, you can add real authentication here.
    if (onLogin) {
      onLogin(userType);
    }
  };

  const renderForm = () => {
    const title = userType === 'admin' ? 'Admin Login' : 'Student Login';
    return (
      <div className="form-container">
        <div className="form-content">
          <button className="close-btn" onClick={handleClose}>&times;</button>
          <h3>{title}</h3>
          <form onSubmit={handleFormSubmit}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="hero-content-wrapper"> {/* Renamed for clarity */}
        <div className="hero-text">
          <h1>Welcome to EduDropX</h1>
          <p>A platform to predict and prevent student dropouts!</p>
          <button className="get-started-btn" onClick={handleGetStarted}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src={image3} alt="Illustration of a person" />
        </div>
      </div>

      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <button className="close-btn" onClick={handleClose}>&times;</button>
            <h3>Are you a...</h3>
            <div className="popup-buttons">
              <button className="popup-btn" onClick={() => handleRoleSelect('admin')}>Admin/Mentor</button>
              <button className="popup-btn" onClick={() => handleRoleSelect('student')}>Student</button>
            </div>
          </div>
        </div>
      )}

      {showForm && renderForm()}
    </>
  );
}

export default Hero;