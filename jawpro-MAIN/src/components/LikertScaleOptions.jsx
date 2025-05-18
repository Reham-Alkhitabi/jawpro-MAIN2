import React from 'react';
import './LikertScaleOptions.css';

function LikertScaleOptions({ selectedValue, onSelect }) {
  const options = [
    { value: 0, label: 'Strongly Disagree' },
    { value: 1, label: 'Disagree' },
    { value: 2, label: 'Neutral' },
    { value: 3, label: 'Agree' },
    { value: 4, label: 'Strongly Agree' },
  ];

  return (
    <div className="likert-scale-options">
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name="likert"
            value={option.value}
            checked={selectedValue === option.value}
            onChange={() => onSelect(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
}

export default LikertScaleOptions;
