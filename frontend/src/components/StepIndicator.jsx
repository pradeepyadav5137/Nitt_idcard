import React from 'react';
import '../styles/steps.css';

const StepIndicator = ({ current = 1, total = 4 }) => {
  const steps = [
    { number: 1, label: 'Email Verify' },
    { number: 2, label: 'Fill Form' },
    { number: 3, label: 'Upload Docs' },
    { number: 4, label: 'Submit' }
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step ${step.number < current ? 'completed' : ''} ${step.number === current ? 'active' : ''}`}
        >
          <div className="step-number">
            {step.number < current ? '✓' : step.number}
          </div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
