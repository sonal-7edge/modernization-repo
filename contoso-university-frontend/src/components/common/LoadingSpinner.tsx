import React from 'react';
import { Spinner } from 'react-bootstrap';

interface LoadingSpinnerProps {
  size?: 'sm' | 'lg';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'lg', 
  text = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`d-flex flex-column align-items-center justify-content-center py-5 ${className}`}>
      <Spinner animation="border" variant="primary" size={size} />
      {text && (
        <p className="mt-3 mb-0 text-muted">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;