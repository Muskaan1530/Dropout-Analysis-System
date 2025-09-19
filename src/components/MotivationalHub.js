import React from 'react';

// यह कंपोनेंट प्रेरणादायक सामग्री दिखाता है।
function MotivationalHub() {
  return (
    <div className="motivational-hub">
      <div className="modal-header">
        <h2>Motivational Hub</h2>
      </div>
      <div className="modal-body">
        <p>Feeling low? Here are some resources to get you back on track and boost your motivation!</p>

        <div className="resource-list">
          <a href="#" className="resource-card">
            <div className="resource-icon">🎓</div>
            <div className="resource-text">
              <strong>Top 10 Study Tips</strong>
              <p>Learn effective strategies to improve your grades.</p>
            </div>
          </a>
          <a href="#" className="resource-card">
            <div className="resource-icon">🧘</div>
            <div className="resource-text">
              <strong>Mindfulness for Students</strong>
              <p>Watch a 5-minute video to calm your mind.</p>
            </div>
          </a>
          <a href="#" className="resource-card">
            <div className="resource-icon">💡</div>
            <div className="resource-text">
              <strong>Success Stories</strong>
              <p>Read inspiring stories from our alumni.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default MotivationalHub;