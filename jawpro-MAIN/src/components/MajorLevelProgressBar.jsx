import React from 'react';
import './MajorLevelProgressBar.css';

function MajorLevelProgressBar({ progress }) {
  return (
    <div className="major-progress-bar-wrapper">
      <div className="major-progress-bar-track">
        <div className="major-progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default MajorLevelProgressBar;
