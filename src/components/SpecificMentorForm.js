import React, { useState } from 'react';

// यह कंपोनेंट एक विशेष विषय के लिए मेंटर रिक्वेस्ट फॉर्म दिखाता है।
// 'subject' और 'onClose' props के रूप में पास किए जाते हैं।
function SpecificMentorForm({ subject, onClose }) {
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'sending', 'success'

  // फॉर्म सबमिट होने पर यह फंक्शन चलता है
  const handleRequestSubmit = (event) => {
    event.preventDefault();
    setSubmissionStatus('sending');
    
    // 2 सेकंड बाद सफलता का संदेश दिखाते हैं (असली ऐप में यहाँ API कॉल होगी)
    setTimeout(() => {
      setSubmissionStatus('success');
    }, 2000);
  };

  // यदि फॉर्म सफलतापूर्वक सबमिट हो गया है, तो यह फीडबैक दिखाएं
  if (submissionStatus === 'success') {
    return (
        <div className="modal-feedback success">
            <div className="icon">✓</div>
            <h2>Request Sent!</h2>
            <p>Your request for a <strong>{subject}</strong> mentor has been sent. They will contact you soon.</p>
            {/* 'Close' बटन पर क्लिक करने पर Modal बंद हो जाएगा */}
            <button onClick={onClose} className="action-btn connect-mentor">Close</button>
        </div>
    );
  }

  // नहीं तो, फॉर्म दिखाएं
  return (
    <>
      <div className="modal-header">
        <h2>Connect with {subject} Mentor</h2>
      </div>
      <div className="modal-body">
        <form onSubmit={handleRequestSubmit}>
          <div className="form-group">
            
            <label>Subject</label>
            {/* ड्रॉपडाउन की जगह अब यह सादा टेक्स्ट है */}
            <div className="subject-display">{subject}</div>
          </div>

         <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea id="message" name="message" rows="4" placeholder={`Please describe your problem in ${subject}...`} required></textarea>
          </div>
          <button type="submit" className="action-btn connect-mentor" disabled={submissionStatus === 'sending'}>
            {submissionStatus === 'sending' ? 'Sending...' : 'Send Request'}
          </button>
        </form>
      </div>
    </>
  );
}

export default SpecificMentorForm;