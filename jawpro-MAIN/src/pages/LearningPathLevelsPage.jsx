import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { majorsConfig } from '../config/majorsConfig';
import './LearningPathLevelsPage.css';

const LearningPathLevelsPage = () => {
  const { majorId } = useParams();
  const navigate = useNavigate();

  if (!majorId) {
    return <p>❌ Major not specified.</p>;
  }

  const major = majorsConfig[majorId];

  if (!major) {
    return <p>❌ Invalid major selected.</p>;
  }

  const levels = major.levels;
  const ratedLevels = JSON.parse(localStorage.getItem(`rated-feedback-${majorId}`)) || [];

  const handleQuit = () => {
    localStorage.removeItem(`rated-feedback-${majorId}`);
    navigate('/recommendations');
  };

  const handleLevelClick = (level) => {
    navigate(`/major/${majorId}/level/${level.level}`);
  };

  return (
    <div className="path-container">
      <h1>{major.title} Learning Path</h1>

      <div className="progress-bar-container">
        {levels.map((level) => (
          <div
            key={level.level}
            className={`step ${ratedLevels.includes(level.level) ? 'completed' : ''}`}
            onClick={() => handleLevelClick(level)}
            style={{ cursor: 'pointer' }}
          >
            <div className="circle">
              {ratedLevels.includes(level.level) ? '✓' : level.level}
            </div>
            <div className="label">{level.title}</div>
          </div>
        ))}
      </div>

      <button className="quit-button" onClick={handleQuit}>Quit This Path</button>
    </div>
  );
};

export default LearningPathLevelsPage;
