import React from "react";
import image3 from "../assets/image3.jpg";

function Hero() {
  return (
    <section id="home">
      <div className="hero-text">
        <h2>
          Welcome to <span className="highlight">EduDropX</span>
        </h2>
        <p>
          A platform to predict and prevent student dropouts!
        </p>
        <button>Get Started</button>
      </div>

      <div className="image">
        <img src={image3} alt="image" />
      </div>

      
      
    </section>
  );
}

export default Hero;

//https://github.com/Muskaan1530/Dropout-Analysis-System.git
