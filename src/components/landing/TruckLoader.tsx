
import React from 'react';

const TruckLoader = () => {
  return (
    <div className="loader">
      <div className="truckWrapper">
        <svg className="truckBody" viewBox="0 0 130 75" xmlns="http://www.w3.org/2000/svg">
          {/* Chassis */}
          <rect x="10" y="60" width="115" height="5" fill="#4B5563" />
          {/* Trailer */}
          <rect x="40" y="10" width="85" height="50" fill="#E5E7EB" stroke="#1F2937" strokeWidth="1.5" />
          {/* Cabin */}
          <path d="M45 25 V60 H15 L10 55 V35 L20 25 H45 Z" fill="#ef4444" stroke="#1F2937" strokeWidth="1.5" />
          {/* Window */}
          <path d="M42 28 V42 H25 L23 40 V30 L25 28 H42 Z" fill="#BFDBFE" stroke="#1F2937" strokeWidth="1" />
          {/* Headlight */}
          <rect x="11" y="50" width="4" height="3" fill="yellow" />
           {/* Back door handle */}
          <rect x="120" y="32" width="2" height="10" fill="#4B5563" />
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
          viewBox="0 0 40 90"
          className="lampPost"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Post */}
          <path d="M10 90 V 20 C 10 5, 25 5, 25 20" stroke="#282828" strokeWidth="3" fill="none"/>
          {/* Lamp */}
          <path d="M25 20 V 23" stroke="#282828" strokeWidth="2" />
          <path d="M20 23 A 5 5 0 1 1 30 23 Z" fill="#282828" />
          <circle cx="25" cy="26" r="2" fill="yellow" />
        </svg>
      </div>
    </div>
  );
};

export default TruckLoader;
