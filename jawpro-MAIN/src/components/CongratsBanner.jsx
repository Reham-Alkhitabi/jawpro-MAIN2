import React from 'react';

const CongratsBanner = () => {
  return (
    <div style={{
      backgroundColor: '#22c55e',
      color: 'white',
      padding: '1rem 1.5rem',
      fontWeight: '600',
      marginTop: '2rem',
      borderRadius: '6px',
      textAlign: 'center'
    }}>
      Congratulations! You have completed the course.
    </div>
  );
};

export default CongratsBanner;
