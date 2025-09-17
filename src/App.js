// src/App.js
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {isLoggedIn ? (
          userType === 'admin' ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <StudentDashboard onLogout={handleLogout} />
          )
        ) : (
          <Hero onLogin={handleLogin} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;