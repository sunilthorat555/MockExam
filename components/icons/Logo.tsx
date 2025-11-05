
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 200 60" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ONE SHOT IT Logo"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#6366f1', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#818cf8', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="60" fill="none" />
      <text 
        x="100" 
        y="35" 
        fontFamily="Arial, sans-serif" 
        fontSize="30" 
        fontWeight="bold" 
        fill="url(#logoGradient)" 
        textAnchor="middle"
      >
        ONE SHOT IT
      </text>
    </svg>
  );
};

export default Logo;
