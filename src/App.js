import React, { useState } from 'react';
// Removed unused react-router-dom imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import AboutUs from "./components/AboutUs"; // Correct import for AboutUs
import ContactUs from "./components/ContactUs"; // Correct import for ContactUs
import Services from './components/Services';
import Chatbot from './components/Chatbot';
import ManageAttendance from './components/ManageAttendance';
import FeeReports from './components/FeeReports';
import StudentMarks from './components/StudentMarks';
import ExtraCurricularRecords from './components/ExtraCurricularRecords';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [currentPage, setCurrentPage] = useState('Home');

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCurrentPage('Home');
  };

  const renderContent = () => {
    if (isLoggedIn) {
      if (userType === 'admin') {
        // Correctly pass setCurrentPage to all admin dashboard pages
        switch (currentPage) {
          case 'ManageAttendance':
            return <ManageAttendance setCurrentPage={setCurrentPage} />;
          case 'FeeReports':
            return <FeeReports setCurrentPage={setCurrentPage} />;
          case 'StudentMarks':
            return <StudentMarks setCurrentPage={setCurrentPage} />;
          case 'ExtraCurricularRecords':
            return <ExtraCurricularRecords setCurrentPage={setCurrentPage} />;
          default:
            return <AdminDashboard onLogout={handleLogout} setCurrentPage={setCurrentPage} />;
        }
      } else {
        // Student dashboard logic
        return <StudentDashboard onLogout={handleLogout} />;
      }
    } else {
      // If not logged in, render the page based on the currentPage state
      switch (currentPage) {
        case 'Home':
          return <Hero onLogin={handleLogin} />;
        case 'Services':
          return <Services />;
        case 'About Us':
          return <AboutUs />; // Render the AboutUs component
        case 'Chatbot':
          return <Chatbot />;
        case 'Contact Us':
          return <ContactUs />; // Render the ContactUs component
        default:
          return <Hero onLogin={handleLogin} />;
      }
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;