import React, { useState, useEffect } from "react";

const ServiceCard = ({ service, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="service-card" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.5s ease-in, transform 0.5s ease-in' }}>
      <div className="service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
    </div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Consolidated Data Dashboard",
      description: "We merge student data—including attendance, test scores, and fee payments—into a single, unified dashboard. This consolidated view provides a complete picture of a learner's engagement and performance, eliminating the need to cross-reference multiple spreadsheets.",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm14 2c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm-4 4h-4c-.6 0-1 .4-1 1s.4 1 1 1h4c.6 0 1-.4 1-1s-.4-1-1-1zM4 14h16v-4h-4c-.6 0-1-.4-1-1s.4-1 1-1h4V6H4v8zm0 2v4h16v-4H4zm14 2c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" />
        </svg>
      ),
    },
    {
      title: "Automated Risk Flagging",
      description: "Our system applies clear, configurable logic to identify at-risk students. By setting thresholds for attendance percentages, reducing test scores, or exhausted attempts, the platform signals when a student is struggling in multiple areas simultaneously.",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    },
    {
      title: "Performance Trends Analysis",
      description: "We go beyond single snapshots to show you long-term trends in student performance. Our analytics help you visualize academic trajectories, identify patterns of disengagement, and pinpoint specific subjects where students may be falling behind.",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M16 11h-2V6h2v5zm-4 9h-2v-5h2v5zm-4-4H6v-9h2v9zM19 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      ),
    },
    {
      title: "Proactive Mentor Notifications",
      description: "Our system dispatches regular, automated notifications to mentors and guardians. This proactive approach ensures early, data-driven intervention, helping educators act before disengagement becomes irreversible and improving student retention rates.",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2zM12 23c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5z" />
        </svg>
      ),
    },
    {
      title: "Multi-Factor Risk Analysis",
      description: "Our platform synthesizes data from multiple indicators—failing attendance, low test scores, and exhausted attempts—to provide a comprehensive risk score. This holistic view ensures that no single data point is misleading and that interventions are targeted and effective.",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
    },
    {
      title: "Secure & Transparent Data Management",
      description: "We prioritize data integrity and transparency. All student information is managed securely, and the logic used for risk detection is transparent and easy to configure. This empowers educators to make informed decisions without relying on complex, black-box algorithms.",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-12 h-12">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99c-2.45 0-4.45-2-4.45-4.45S9.55 3.1 12 3.1s4.45 2 4.45 4.45-2 4.44-4.45 4.44z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="services-container">
      <div className="text-center mb-16">
        <center><h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-400 mb-6">Our Services</h1></center>
        <p style={{ fontSize: '1.125rem', color: 'white' }}>
          We provide educators and students with the tools they need for a seamless, data-driven learning experience. Our approach focuses on simplicity, transparency, and early intervention.
        </p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Services;
