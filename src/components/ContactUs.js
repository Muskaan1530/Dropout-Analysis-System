import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const mentors = [
    {
      name: "Dr. Rakesh Sharma",
      role: "Lead Mentor",
      phone: "+91 9876543210",
      linkedin: "https://www.linkedin.com/in/rakesh-sharma"
    },
    {
      name: "Priya Verma",
      role: "Career Guide",
      phone: "+91 9123456789",
      linkedin: "https://www.linkedin.com/in/priya-verma"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would add logic to send the form data, e.g., to an API
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Contact Us</h1>
        <p style={{ color: 'white' }}>We'd love to hear from you! Reach out to our mentors or send us a message.</p>
      </header>
      
      <div className="contact-sections-grid">
        {/* Mentors Section */}
        <div className="mentor-section">
          <h2>Our Mentors</h2>
          <div className="mentor-cards-container">
            {mentors.map((mentor, index) => (
              <div key={index} className="mentor-card">
                <h3 className="mentor-name">{mentor.name}</h3>
                <p className="mentor-role">{mentor.role}</p>
                <div className="mentor-details">
                  <p style={{ color: 'white' }}>📱 {mentor.phone}</p>
                  <p>
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="linkedin-link"
                    >
                      🔗 LinkedIn Profile
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Contact & Form */}
        <div className="general-contact-and-form">
          <div className="general-contact-info">
            <h2>General Queries</h2>
            <p style={{ color: 'white' }}>
              For general inquiries, feel free to email us directly.
              <br/>
              📧: <strong style={{ color: 'skyblue' }}>support@edudropx.com</strong>
            </p>
          </div>
          
          <div className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form-grid">
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="contact-input"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="contact-input"
                required
              />
              <textarea
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="contact-textarea"
                rows="4"
                required
              ></textarea>
              <button type="submit" className="contact-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;