// SubjectBarChart.js (Updated with Grids)
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SubjectBarChart = ({ subjectsData }) => {
  const data = {
    labels: subjectsData.map(subject => subject.name),
    datasets: [
      {
        label: 'Subject Scores (%)',
        data: subjectsData.map(subject => subject.score),
        backgroundColor: [
          '#124671ff',
          '#821211ff',
          '#d1a00dff',
        ],
         borderColor: [
            '#052a3cff',
            '#551515ff',
            '#684504ff',
            
        ],
        borderWidth: 1,
        borderRadius: 4,
        barPercentage:0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Subject-wise Performance',
        font: { size: 16 }
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // X-axis पर ग्रिड नहीं चाहिए
        },
      },
      y: {
        grid: {
          display: true, // Y-axis पर ग्रिड चाहिए
          color: '#eef2f7', // <<-- ग्रिड का रंग बहुत हल्का किया
        },
        border: {
          display: false, // <<-- मुख्य Y-axis लाइन हटाई
        },
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default SubjectBarChart;