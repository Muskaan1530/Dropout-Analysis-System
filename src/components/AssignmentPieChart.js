// AttendancePieChart.js (Updated to Doughnut Chart)
import React from 'react';
// Pie की जगह Doughnut इम्पोर्ट करें
import { Doughnut } from 'react-chartjs-2'; 
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AssignmentPieChart = ({ assignmentData }) => {
  const data = {
    labels: ['Submitted','Due','Missed'],
    datasets: [
      {
        label: 'Assignments',
        data: [assignmentData.submitted, assignmentData.due, assignmentData.missed],
        backgroundColor: [ // <-- नए, बेहतर कलर्स
          '#0b670fff', // Teal
          '#e8b213ff',
          '#bd0b08ff', // Deep Orange
        ],
         borderColor: [
            '#123105ff',
            '#998607ff',
            '#520b04ff',
            
        ],
        borderColor: ['#ffffff'], // <-- बॉर्डर का रंग
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%', // <-- यह लाइन पाई को डोनट बनाती है
    plugins: {
      legend: { 
        position: 'right', // <-- लेजेंड की पोजीशन बदली गई
        labels: {
          boxWidth: 20,
          padding: 20,
        }
      },
      title: {
        display: true,
        text: 'Assignment Status',
        font: { size: 16 },
        color:'#424242',
        padding:{
          top: 10,
          bottom: 30
      
        }
      },
    },
    
  };

  // Pie की जगह Doughnut कॉम्पोनेंट का इस्तेमाल करें
  return <Doughnut data={data} options={options} />;
};

export default AssignmentPieChart;