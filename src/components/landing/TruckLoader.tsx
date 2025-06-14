
import React from 'react';

const TruckLoader = () => {
  return (
    <div className="loader">
      <div className="truckWrapper">
        <svg className="truckBody" viewBox="0 0 130 70" fill="#282828" xmlns="http://www.w3.org/2000/svg">
          <path d="M125.7,35.8h-15.4v-4.5c0-2.3-1.9-4.2-4.2-4.2H84.3c-2.3,0-4.2,1.9-4.2,4.2v4.5H23.5c-2.3,0-4.2,1.9-4.2,4.2v19.4 c0,2.3,1.9,4.2,4.2,4.2h102.2c2.3,0,4.2-1.9,4.2-4.2V40C129.9,37.7,128.1,35.8,125.7,35.8z M84.3,31.3h21.8v4.5H84.3V31.3z" />
          <path d="M18.6,35.8H4.2C1.9,35.8,0,37.7,0,40v15.2c0,2.3,1.9,4.2,4.2,4.2h14.3V35.8z" />
          <path d="M75.9,20.1H23.5c-2.3,0-4.2,1.9-4.2,4.2v11.5h56.6V24.3C79.9,22,78.1,20.1,75.9,20.1z" />
        </svg>

        <div className="truckTires">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#282828">
            <circle cx="12" cy="12" r="11" fill="#282828" />
            <circle cx="12" cy="12" r="5" fill="white" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#282828">
            <circle cx="12" cy="12" r="11" fill="#282828" />
            <circle cx="12" cy="12" r="5" fill="white" />
          </svg>
        </div>
        <div className="road"></div>
        <svg
          height="90"
          viewBox="0 0 20 90"
          className="lampPost"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 5,90 V 10" stroke="#282828" strokeWidth="4" />
          <path d="M 5,15 h 10" stroke="#282828" strokeWidth="2" />
          <rect x="12" y="8" width="8" height="8" fill="#282828" />
          <rect x="14" y="10" width="4" height="4" fill="yellow" />
        </svg>
      </div>
    </div>
  );
};

export default TruckLoader;
