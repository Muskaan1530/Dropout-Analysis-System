// src/components/AdminDashboard.js
// src/components/AdminDashboard.js
// src/components/AdminDashboard.js
import React from 'react';

function AdminDashboard({ onLogout }) {
  // 10 छात्रों का विस्तृत डेटा
  const studentData = [
    { id: 1, enrollmentNo: "08501182024", name: "Rinki Kumari", risk: "High", attendance: 68, scoreTrend: -12, attempts: 3, feeStatus: "Due" },
    { id: 2, enrollmentNo: "1740872025", name: "Rahul Singh", risk: "Medium", attendance: 78, scoreTrend: -5, attempts: 2, feeStatus: "Paid" },
    { id: 3, enrollmentNo: "03214562024", name: "Sheweta Rani", risk: "High", attendance: 71, scoreTrend: -18, attempts: 4, feeStatus: "Due" },
    { id: 4, enrollmentNo: "9870442025", name: "Amit Sharma", risk: "Low", attendance: 92, scoreTrend: 8, attempts: 1, feeStatus: "Paid" },
    { id: 5, enrollmentNo: "11507892024", name: "Kavita Meena", risk: "Medium", attendance: 81, scoreTrend: -2, attempts: 1, feeStatus: "Due" },
    { id: 6, enrollmentNo: "4421882025", name: "Saloni Kumari", risk: "Low", attendance: 95, scoreTrend: 10, attempts: 1, feeStatus: "Paid" },
    { id: 7, enrollmentNo: "20101152024", name: "Muskaan Kumari", risk: "High", attendance: 65, scoreTrend: -25, attempts: 3, feeStatus: "Paid" },
    { id: 8, enrollmentNo: "75309512025", name: "Shikha Tiwari", risk: "Medium", attendance: 76, scoreTrend: 0, attempts: 2, feeStatus: "Paid" },
    { id: 9, enrollmentNo: "85205822024", name: "Shubhi Tiwari", risk: "Low", attendance: 98, scoreTrend: 12, attempts: 1, feeStatus: "Paid" },
    { id: 10, enrollmentNo: "36901472025", name: "Sandeep Yadav", risk: "High", attendance: 72, scoreTrend: -15, attempts: 2, feeStatus: "Due" },
  ];
  
  // Stats calculate karna
  const totalStudents = studentData.length;
  const atRiskCount = studentData.filter(s => s.risk === 'High' || s.risk === 'Medium').length;
  const pendingFeesCount = studentData.filter(s => s.feeStatus === 'Due').length;
  const pendingFeesAmount = (pendingFeesCount * 30000).toLocaleString('en-IN');
  const highRiskCount = studentData.filter(s => s.risk === 'High').length;
  const mediumRiskCount = studentData.filter(s => s.risk === 'Medium').length;
  const lowRiskCount = studentData.filter(s => s.risk === 'Low').length;

  return (
    <div className="dashboard-container merged-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Admin/Mentor Dashboard</h1>
          <div className="user-info">
            <span className="user-name">Welcome, Admin!</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>
      
      <div className="stat-cards-container">
        <div className="stat-card">
          <h2>Total Students</h2>
          <p className="highlight-text">{totalStudents} <span className="sub-info">({atRiskCount} at-risk)</span></p>
        </div>
        <div className="stat-card">
          <h2>Pending Fees</h2>
          <p className="highlight-text">₹ {pendingFeesAmount} <span className="sub-info">({pendingFeesCount} Students Due)</span></p>
        </div>
        <div className="stat-card">
          <h2>Upcoming Deadlines</h2>
          <p className="highlight-text">12 <span className="sub-info">(Assignments/Exams)</span></p>
        </div>
      </div>

      <div className="overview-section">
        <h2>Institute Overview</h2>
        <div className="overview-grid">
            <div className="overview-item">
                <span className="overview-label">High Risk 🔴</span>
                <span className="overview-value text-red">{highRiskCount}</span>
            </div>
            <div className="overview-item">
                <span className="overview-label">Medium Risk 🟡</span>
                <span className="overview-value text-yellow">{mediumRiskCount}</span>
            </div>
            <div className="overview-item">
                <span className="overview-label">Low Risk 🟢</span>
                <span className="overview-value text-green">{lowRiskCount}</span>
            </div>
        </div>
      </div>

      <div className="dashboard-main-content">
        <div className="section-card student-list-card">
          <h2>At-Risk Student List (Action Center)</h2>
          <ul className="detailed-list">
            {studentData.map(student => (
              <li key={student.id} className={'list-item-risk-${student.risk.toLowerCase()}'}>
                <div className="student-info">
                  <span className={'risk-indicator ${student.risk.toLowerCase()}'}></span>
                  <span className="enrollment-no">{student.enrollmentNo}</span>
                  <span className="student-name">{student.name}</span>
                </div>
                <div className="student-metrics">
                  <span>Attd: <b className={student.attendance < 75 ? 'text-red' : 'text-green'}>{student.attendance}%</b></span>
                  <span>Trend: <b className={student.scoreTrend < 0 ? 'text-red' : 'text-green'}>{student.scoreTrend}%</b></span>
                  <span>Attempts: <b>{student.attempts}</b></span>
                  <span>Fees: <b className={student.feeStatus === 'Due' ? 'text-red' : 'text-green'}>{student.feeStatus}</b></span>
                </div>
                <div className="student-actions">
                  <button className="action-btn view-profile">View Profile</button>
                  <button className="action-btn notify">Notify</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="section-card admin-tools-card">
            <h2>Administrative Tools</h2>
            <ul className="admin-tools-list">
                <li><button className="tool-btn">Manage Attendance</button></li>
                <li><button className="tool-btn">Fee Collection & Reports</button></li>
                <li><button className="tool-btn">Assignment Tracking</button></li>
                <li><button className="tool-btn">Communication Hub</button></li>
            </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;