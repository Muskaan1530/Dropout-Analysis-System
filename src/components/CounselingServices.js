import React from 'react';

// यह कंपोनेंट काउंसलिंग सेवाओं की जानकारी दिखाता है।
function CounselingServices() {
  return (
    <div className="counseling-info">
      <div className="modal-header">
        <h2>Counseling Services</h2>
      </div>
      <div className="modal-body">
        <p>We provide confidential and professional counseling to help you with academic stress, personal issues, or any other challenges you may be facing.</p>
        
        <h4>Our Counselors Can Help With:</h4>
        <ul>
          <li>✔ Stress and Anxiety Management</li>
          <li>✔ Time Management & Study Skills</li>
          <li>✔ Personal Growth & Confidence</li>
          <li>✔ Career Guidance</li>
        </ul>

        <div className="counselor-contact">
          <h4>Contact a Professional</h4>
          <p><strong>Dr. Anjali Sharma</strong></p>
          <p>📧 <a href="mailto:anjali.sharma@college.edu">anjali.sharma@college.edu</a></p>
          <p>📞 <a href="tel:+911234567890">+91 12345 67890</a></p>
          <p><small>Available Monday - Friday, 10 AM to 4 PM</small></p>
        </div>
      </div>
    </div>
  );
}

export default CounselingServices;