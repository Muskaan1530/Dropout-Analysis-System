import React from 'react';

function AboutUs() {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>Our Mission: A New Era of Student Support</h1>
        <p style={{ color: 'white' }}>Empowering educators and students with data-driven insights to foster academic success and well-being.</p>
      </header>

      <section className="about-us-story section-dark">
        <div className="story-content">
          <h2>The Story Behind Our System</h2>
          <p style={{ color: 'white' }}>
            The idea for this system was born from a simple yet critical observation: student success is not just about grades. It's about well-being, attendance, and financial stability. These key indicators are often hidden in disconnected data silos, making it impossible for educators to see the full picture. Our solution was to build a unified platform that automatically ingests and merges this disparate data, providing a single, consolidated view that signals when a learner is struggling in multiple areas simultaneously.
          </p>
          <p style={{ color: 'white' }}>
            This project is our response to a real-world problem, proving that with clever integration and a clear purpose, technology can create a meaningful impact without a massive budget.
          </p>
        </div>
      </section>
      
      <section className="about-us-values">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Empowerment</h3>
            <p style={{ color: 'white' }}>We empower educators with data-driven insights to enhance their judgment, not replace it.</p>
          </div>
          <div className="value-card">
            <h3>Transparency</h3>
            <p style={{ color: 'white' }}>Our system operates on clear, rule-based logic, so everyone understands how risk is assessed and why.</p>
          </div>
          <div className="value-card">
            <h3>Early Intervention</h3>
            <p style={{ color: 'white' }}>We aim to catch problems when they are small, making it possible for institutions to provide timely and effective support.</p>
          </div>
        </div>
      </section>

      <section className="about-us-impact section-dark">
        <div className="impact-content">
          <h2>Our Impact</h2>
          <p style={{ color: 'white' }}>
            Our focus on data fusion and timely alerts empowers institutions to act proactively, significantly reducing drop-out rates and fostering a more supportive learning environment. This approach is not only cost-effective but also highly impactful, ensuring that students get the help they need precisely when they need it most.
          </p>
          <p style={{ color: 'white' }}>
            The system is designed to be easy to configure and requires minimal training, making it accessible to public institutions that lack the budget for expensive commercial analytics platforms.
          </p>
        </div>
      </section>

      <section className="about-us-cta">
        <div className="cta-content">
          <h2>Join Us in Making a Difference</h2>
          <p>
            Our system is more than just a tool, it's a commitment to student success. We invite you to explore how our platform can transform your institution and empower your educators.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;