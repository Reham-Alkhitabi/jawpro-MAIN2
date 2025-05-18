import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { saveRiasecResultsToFirestore } from '../utils/firebase.utils'; // adjust path accordingly
import "./results-page.css";

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { scores } = location.state || {};

  useEffect(() => {
    if (scores) {
      localStorage.setItem('riasecScores', JSON.stringify(scores));

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        saveRiasecResultsToFirestore(user, scores);
      }
    }
  }, [scores]);

  if (!scores) return <p>No scores found. Please complete the test.</p>;

  const handleViewRecommendations = () => {
    navigate('/recommendations', { state: { scores } });
  };

  return (
    <div className="results-page-container">
      <h1 className="results-page-h1">Your RIASEC Results</h1>
      <ul className="results-page-ul">
        {Object.entries(scores).map(([category, score]) => (
          <li className="results-page-li" key={category}>
            <strong>{category}:</strong> {score}
          </li>
        ))}
      </ul>
      <button className="results-page-button" onClick={handleViewRecommendations}>
        View Top 3 Career Recommendations
      </button>
                <button className="intro-course-button" onClick={() => navigate(-1)}>
            Back
          </button>
    </div>
  );
}

export default ResultsPage;