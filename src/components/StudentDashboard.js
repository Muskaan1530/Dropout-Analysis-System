// src/components/StudentDashboard.js
import React from 'react';

function StudentDashboard({ onLogout }) {
  // Merged dummy data for all sections
  const myStatus = {
    // For Stat Cards (from Image 1)
    courses: 6,
    assignmentsDue: 3,
    overallGrade: "A-",
    
    // For Performance Snapshot (from Image 2)
    status: "ON TRACK",
    attendance: 78,
    averageScore: 65,
    
    // For Progress Tracker (from Image 3)
    subjects: [
      { name: "Physics", score: 85, status: "Excellent" },
      { name: "Maths", score: 60, status: "On Track" },
      { name: "Chemistry", score: 45, status: "Needs Attention" },
    ]
  };

  const getStatusInfo = (status) => {
    if (status === "Needs Attention") return { label: "Needs Attention 🔴", color: "red" };
    if (status === "On Track") return { label: "On Track 🟡", color: "yellow" };
    return { label: "Excellent 🟢", color: "green" };
  };

  return (
    <div className="dashboard-container student-dashboard-merged">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Student Dashboard</h1>
          <div className="user-info">
            <span className="user-name">Welcome, Rohan!</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* ## Section 1: Stat Cards (from Image 1) ## */}
      <div className="stat-cards-container">
        <div className="stat-card">
          <h2>My Courses</h2>
          <p className="highlight-text">{myStatus.courses}</p>
        </div>
        <div className="stat-card">
          <h2>Assignments Due</h2>
          <p className="highlight-text">{myStatus.assignmentsDue}</p>
        </div>
        <div className="stat-card">
          <h2>Overall Grade</h2>
          <p className="highlight-text">{myStatus.overallGrade}</p>
        </div>
      </div>
      
      {/* ## Section 2: My Performance Snapshot (from Image 2) ## */}
      <div className="section-card">
        <h2>My Performance Snapshot</h2>
        <div className="performance-snapshot">
          <div className="snapshot-main">
            <span className="snapshot-label">Your Current Status</span>
            <span className={'snapshot-status status-${getStatusInfo(myStatus.status).color}'}>
              {myStatus.status} {getStatusInfo(myStatus.status).label.split(' ')[1]}
            </span>
          </div>
          <div className="snapshot-secondary">
            <div className="snapshot-item">
              <span className="snapshot-label">My Attendance</span>
              <span className="snapshot-value">{myStatus.attendance}%</span>
            </div>
            <div className="snapshot-item">
              <span className="snapshot-label">My Average Score</span>
              <span className="snapshot-value">{myStatus.averageScore}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* ## Section 3: My Progress Tracker (from Image 3) ## */}
      <div className="section-card">
        <h2>My Progress Tracker</h2>
        <ul className="progress-tracker-list">
          {myStatus.subjects.map(subject => {
            const subjectStatusInfo = getStatusInfo(subject.status);
            return (
              <li key={subject.name}>
                <span className="subject-name">{subject.name}</span>
                <span className="subject-score">Score: {subject.score}%</span>
                <span className={'subject-status status-${subjectStatusInfo.color}'}>{subjectStatusInfo.label}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ## Combined Support Section ## */}
      <div className="support-grid">
        {/* ## Section 4: Support & Resources (from Image 1) ## */}
        <div className="section-card">
            <h2>Support & Resources</h2>
            <ul className="support-list">
                <li><button className="tool-btn">Connect with a Mentor</button></li>
                <li><button className="tool-btn">Counseling Services</button></li>
                <li><button className="tool-btn">Motivational Hub</button></li>
            </ul>
        </div>
        {/* ## Section 5: Need Help? (from Image 3) ## */}
        <div className="need-help-section">
          <h3>Need Help?</h3>
          <p>Your performance in Chemistry needs attention. Click below to get help.</p>
          <button className="action-btn connect-mentor">Connect with Chemistry Mentor</button>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;