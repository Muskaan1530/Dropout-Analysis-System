import React, { useState } from 'react';
import Modal from './Modal';
import CounselingServices from './CounselingServices'; 
import MotivationalHub from './MotivationalHub';   
import SpecificMentorForm from './SpecificMentorForm';  

function StudentDashboard({ onLogout }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('idle');
   const [specificSubject, setSpecificSubject] = useState(null);

  const myStatus = {
    courses: 6,
    assignmentsDue: 3,
    overallGrade: "A",
    status: "ON TRACK",
    attendance: 78,
    averageScore: 65,
    subjects: [
      { name: "Physics", score: 85, status: "Excellent" },
      { name: "Maths", score: 60, status: "On Track" },
      { name: "Chemistry", score: 45, status: "Needs Attention" },
    ]
  };

  const subjectNeedingHelp = myStatus.subjects.find(
    subject => subject.status === "Needs Attention"
  );


  const getStatusInfo = (status) => {
    if (status === "Needs Attention") return { label: "Needs Attention 🔴", color: "red" };
    if (status === "On Track") return { label: "On Track 🟡", color: "yellow" };
    return { label: "Excellent 🟢", color: "green" };
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

   const openSpecificMentorModal = (subjectName) => {
    setSpecificSubject(subjectName);
    openModal('specific_mentor');
  };



  const closeModal = () => {
    setIsModalOpen(false);
    setSubmissionStatus('idle');
     setSpecificSubject(null);
  };

  const handleRequestSubmit = (event) => {
    event.preventDefault();
    setSubmissionStatus('sending');
    setTimeout(() => {
      setSubmissionStatus('success');
    }, 2000);
  };

  // ========== बदला हुआ हिस्सा: renderModalContent ==========
  const renderModalContent = () => {
    switch (modalType) {
      case 'mentor':
        if (submissionStatus === 'success') {
          return (
            <div className="modal-feedback success">
              <div className="icon">✓</div>
              <h2>Request Sent!</h2>
              <p>Your request has been sent to the mentor. They will get in touch with you soon.</p>
              <button onClick={closeModal} className="action-btn connect-mentor">Close</button>
            </div>
          );
        }
        return (
          <>
            <div className="modal-header"><h2>Connect with a Mentor</h2></div>
            <div className="modal-body">
              <form onSubmit={handleRequestSubmit}>
                <div className="form-group">
                  <label htmlFor="subject">Select Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="chemistry">Chemistry</option>
                    <option value="maths">Maths</option>
                    <option value="physics">Physics</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" rows="4" placeholder="Please describe your problem..." required></textarea>
                </div>
                <button type="submit" className="action-btn connect-mentor" disabled={submissionStatus === 'sending'}>
                  {submissionStatus === 'sending' ? 'Sending...' : 'Send Request'}
                </button>
              </form>
            </div>
          </>
        );
      
      case 'counseling': // नया केस
        return <CounselingServices />;
      
      case 'motivational': // नया केस
        return <MotivationalHub />;

      // ========== नया केस: specific_mentor ==========
      case 'specific_mentor':
        // यह नया SpecificMentorForm कंपोनेंट दिखाएगा और उसे subject और onClose props पास करेगा
        return <SpecificMentorForm subject={specificSubject} onClose={closeModal} />;
        
 
        
      default:
        return null;
    }
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


      <div className="support-grid">
        <div className="section-card">
            <h2>Support & Resources</h2>
            <ul className="support-list">
                {/* ========== बदला हुआ हिस्सा: Buttons ========== */}
                <li><button className="tool-btn" onClick={() => openModal('mentor')}>Connect with a Mentor</button></li>
                <li><button className="tool-btn" onClick={() => openModal('counseling')}>Counseling Services</button></li>
                <li><button className="tool-btn" onClick={() => openModal('motivational')}>Motivational Hub</button></li>
            </ul>
        </div>

            {/* ========== बदला हुआ डायनामिक 'Need Help' सेक्शन ========== */}
        {/* यह सेक्शन केवल तभी दिखाई देगा जब subjectNeedingHelp में कोई विषय होगा */}
        {subjectNeedingHelp && (
          <div className="need-help-section">
            <h3>Need Help?</h3>
            <p>Your performance in <strong>{subjectNeedingHelp.name}</strong> needs attention. Click below to get help.</p>
            <button 
              className="action-btn connect-mentor" 
              onClick={() => openSpecificMentorModal(subjectNeedingHelp.name)}
            >
              Connect with {subjectNeedingHelp.name} Mentor
            </button>
          </div>
        )}
      </div>


      {isModalOpen && (
        <Modal onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}
    </div>
  );
}

export default StudentDashboard;