import React from 'react';
import './ParentContactUsPage.css';

const ParentContactUsPage = () => {
  return (
    <div className="parent-contact-container">
      <h2 className="parent-contact-title">Contact Us</h2>
      <p className="parent-contact-intro">If you have any question or concern, feel free to reach out to us:</p>

      <div className="parent-contact-info">
        
        <div className="parent-contact-item">
          <strong>Phone:</strong>
          <a href="tel:+233591447342">+233 59 144 7342</a>
        </div>

        <div className="parent-contact-item">
          <strong>WhatsApp:</strong>
          <a href="https://wa.me/+233591447342" target="_blank" rel="noopener noreferrer">+233 59 144 7342</a>
        </div>

        <div className="parent-contact-item">
          <strong>Email:</strong>
          <a href="mailto:westsideschool2016@gmail.com">westsideschool2016@gmail.com</a>
        </div>


      </div>
    </div>
  );
};

export default ParentContactUsPage;
