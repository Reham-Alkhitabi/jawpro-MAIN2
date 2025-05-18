import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div style={{ margin: '1.5rem 0' }}>
      <div
        style={{
          backgroundColor: '#e5e7eb',
          height: '12px',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '12px',
            backgroundColor: '#2563eb',
          }}
        />
      </div>
      <p style={{ fontSize: '0.9rem', color: '#374151', marginTop: '0.5rem' }}>
        {progress}% completed
      </p>
    </div>
  );
};

export default ProgressBar;
