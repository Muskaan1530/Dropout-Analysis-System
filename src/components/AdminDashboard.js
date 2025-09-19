import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family = "'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', sans-serif";
ChartJS.defaults.color = '#555';


function AdminDashboard({ onLogout }) {
  // Stats Data
  const totalStudents = 1500;
  const atRiskStudents = 250;
  const criticalAlerts = 15;

  // --- बार चार्ट का डेटा (अब अलग-अलग रंगों के साथ) ---
  const barChartData = {
    labels: ['Engineering', 'Arts & Sciences', 'Business', 'Medical', 'IT'],
    datasets: [
      {
        label: 'At-Risk Students',
        data: [40, 65, 30, 22, 35],
        // हर बार के लिए अलग रंग
        backgroundColor: [
            'rgba(38, 131, 182, 0.8)',  // Blue
            'rgba(214, 68, 68, 0.8)', // Red
            'rgba(237, 175, 59, 0.8)', // Yellow
            'rgba(109, 204, 141, 0.8)', // Green
            'rgba(132, 98, 225, 0.8)'  // Purple
        ],
        borderColor: [
            '#093f5cff',
            '#542020ff',
            '#684504ff',
            '#144825ff',
            '#3c315bff'
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };
  const barChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'At-Risk Students by Department', font: { size: 16 } },
    },
    scales: {
      y: { grid: { color: '#eef2f7' } },
      x: { grid: { display: false } }
    }
  };

  // --- पाई चार्ट का डेटा ---
  const pieChartData = {
    labels: ['Academic', 'Attendance', 'Behavioral', 'Financial'],
    datasets: [{
      data: [40, 25, 15, 20],
      backgroundColor: ['#1c5471ff', '#8d2828ff', '#cd9630ff', '#37704aff'],
      borderColor: '#ffffff',
      borderWidth: 4,
      hoverOffset: 8,
    }]
  };
  const pieChartOptions = {
    responsive: true, maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 15, padding: 15 } },
      title: { display: true, text: 'Risk Factor Breakdown', font: { size: 16 } },
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
          <h1>Student Success System</h1>
          <div className="user-info">
            <span>Welcome, Admin!</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
      </header>
      
      <div className="stat-cards-container">
        <div className="stat-card">
          <h2>Total Students</h2>
          <p className="stat-value">{totalStudents}</p>
        </div>
        <div className="stat-card">
          <h2>Students at Risk</h2>
          <p className="stat-value">{atRiskStudents}</p>
        </div>
        <div className="stat-card critical-alerts-card">
          <h2>Critical Alerts</h2>
          <p className="stat-value">{criticalAlerts}</p>
        </div>
      </div>

      <div className="main-content-grid">
        <div className="section-card bar-chart-card">
          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        <div className="section-card pie-chart-card">
          <div className="chart-container">
            <Doughnut data={pieChartData} options={pieChartOptions} />
          </div>
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