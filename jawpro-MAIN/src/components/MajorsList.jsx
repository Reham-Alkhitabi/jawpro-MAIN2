import React from 'react';
import { Link } from 'react-router-dom';
import { majorsConfig } from '../config/majorsConfig';
import './MajorsList.css';

const MajorsList = ({ recommendedSlugs = [] }) => {
  const majorsToShow = recommendedSlugs.length
    ? recommendedSlugs.map(slug => [slug, majorsConfig[slug]])
    : Object.entries(majorsConfig);

  return (
    <div className="majors-list">
      <h1>Recommended Majors</h1>
      <div className="majors-grid">
        {majorsToShow.map(([slug, major]) => (
          <div key={slug} className="major-card">
            <h2>{major.title}</h2>
            <p>{major.levels.length} Levels</p>
            <Link to={`/major/${slug}/level/1`}>Start Level 1</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MajorsList;
