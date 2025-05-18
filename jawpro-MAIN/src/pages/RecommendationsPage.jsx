import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../utils/firebase.utils';     
import { saveRecommendationsToFirestore } from '../utils/firebase.utils'; 
import "./RecommendationsPage.css";

function RecommendationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const stateScores = location.state?.scores;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        fetchRecommendations(token);
      } else {
        console.warn('User is not authenticated');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [stateScores]);

  const fetchRecommendations = async (token) => {
    try {
      let scores = stateScores || JSON.parse(localStorage.getItem('riasecScores') || 'null');

      if (!scores) {
        console.warn('No RIASEC scores available');
        setLoading(false);
        return;
      }

      const numericArray = Array.isArray(scores)
        ? scores.map(Number)
        : ['R', 'I', 'A', 'S', 'E', 'C'].map((k) => Number(scores[k]));

      if (numericArray.some(isNaN)) {
        console.error('Invalid score data:', numericArray);
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/ai/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ scores: numericArray }),
      });

      const data = await res.json();

      if (res.ok && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations);

        const authUser = auth.currentUser;
        if (authUser) {
          await saveRecommendationsToFirestore(authUser, numericArray, data.recommendations);
        }
      } else {
        console.error('Recommendation error:', data.error || 'Unknown error');
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMajor = (majorId) => {
    if (majorId) navigate(`/major/${majorId}`);
  };

  return (
    <div className="recommendations-page-container">
      <h1 className="recommendations-page-h2">Top Career Recommendation</h1>
      {loading ? (
        <p className="recommendations-page-p">Loading...</p>
      ) : recommendations.length === 0 ? (
        <p className="recommendations-page-p">No recommendations found.</p>
      ) : (
        <ul className="recommendations-page-ul">
          {recommendations.map((rec, index) => (
            <li className="recommendations-page-li" key={index}>
              <h3 className="recommendations-page-h3">{rec.title}</h3>
              <p className="recommendations-page-p">{rec.description}</p>
              <button className="recommendations-page-button" onClick={() => handleSelectMajor(rec.id)}>
                View Learning Path
              </button>
            </li>
          ))}
        </ul>
      )}
      <button className="intro-course-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default RecommendationsPage;
