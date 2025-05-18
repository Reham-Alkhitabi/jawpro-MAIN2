import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { majorsConfig } from '../config/majorsConfig';
import MajorLevelProgressBar from '../components/MajorLevelProgressBar';
import AccordionTask from '../components/AccordionTask';
import AccordionQuiz from '../components/AccordionQuiz';
import CongratsBanner from '../components/CongratsBanner';
import StarRating from '../components/StarRating';
import FeedbackForm from '../components/FeedbackForm';
import { useSectionTracker } from '../components/useSectionTracker';
import './MajorLevelPage.css';

function MajorLevelPage() {
  const { majorId, levelId } = useParams();
  const navigate = useNavigate();

  if (!majorId || !levelId) {
    return <p>❌ Major or Level not specified in URL.</p>;
  }

  const major = majorsConfig[majorId];

  if (!major) {
    return <p>❌ Invalid major selected.</p>;
  }

  const parsedLevelId = Number(levelId);
  if (![1, 2, 3].includes(parsedLevelId)) {
    return <p>❌ Invalid level selected. Levels are 1 to 3 only.</p>;
  }

  const level = major.levels.find(lvl => lvl.level === parsedLevelId);

  if (!level) {
    return <p>❌ Level data not found.</p>;
  }

  const tasks = level.tasks || [];
  const totalSections = tasks.length + 1; // tasks + quiz
  const tracker = useSectionTracker(totalSections);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = () => {
    const ratedKey = `rated-feedback-${majorId}`;
    const prev = JSON.parse(localStorage.getItem(ratedKey) || '[]');

    if (!prev.includes(parsedLevelId)) {
      prev.push(parsedLevelId);
      localStorage.setItem(ratedKey, JSON.stringify(prev));
    }

    navigate(`/major/${majorId}`);
  };

  return (
    <div className="major-level-page" style={{ padding: '2rem' }}>
      <MajorLevelProgressBar currentLevel={parsedLevelId} totalLevels={major.levels.length} />

      <h1>{major.title} - Level {parsedLevelId}</h1>
      <h2>{level.title}</h2>

      <div className="progress-display">
        <strong>Progress:</strong> {tracker.getProgress()}%
      </div>

      <section>
        <h3>Learning Outcomes</h3>
        <ul>
          {level.learningOutcomes.map((outcome, idx) => <li key={idx}>{outcome}</li>)}
        </ul>
        <p><strong>Related Occupations:</strong> {level.relatedOccupations?.join(', ') || 'None listed'}</p>
      </section>

      <section>
        {tasks.map((task, i) => (
          <div key={i} style={{ marginBottom: '1.5rem' }}>
            <AccordionTask
              taskNumber={i + 1}
              title={task.title}
              description={task.content}
              questions={task.questions}
              passed={tracker.getSectionStatus(i) === 'passed'}
              onSubmit={passed =>
                passed ? tracker.markSectionPassed(i) : tracker.markSectionFailed(i)
              }
              relatedTopics={task.recommendedTopics}
            />
          </div>
        ))}
      </section>

      <section>
        <AccordionQuiz
          questions={level.quiz}
          passed={tracker.getSectionStatus(totalSections - 1) === 'passed'}
          onSubmit={passed =>
            passed ? tracker.markSectionPassed(totalSections - 1) : tracker.markSectionFailed(totalSections - 1)
          }
        />
      </section>

      {tracker.isComplete() && (
        <>
          <CongratsBanner />
          <div className="feedback-popup">
            <h3>Rate this Level</h3>
            <StarRating rating={rating} onRate={setRating} />

            <h3>Leave Feedback</h3>
            <FeedbackForm feedback={feedback} onFeedbackChange={setFeedback} />

            <button
              className="submit-feedback"
              onClick={handleSubmitFeedback}
              disabled={rating === 0 || feedback.trim() === ''}
            >
              Submit Rating & Feedback
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MajorLevelPage;
