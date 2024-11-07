import React from 'react';
import { Point } from '../../types/Circuit';

interface WireProps {
  points: Point[];
  isSelected: boolean;
  onSelect: () => void;
}

export const Wire: React.FC<WireProps> = ({ points, isSelected, onSelect }) => {
  if (points.length < 2) return null;

  const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

  return (
    <g>
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="10"
        fill="none"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        style={{ cursor: 'pointer' }}
      />
      <path
        d={pathData}
        stroke={isSelected ? '#2563eb' : '#000'}
        strokeWidth="2"
        fill="none"
        className={`transition-colors duration-150 ${
          isSelected ? 'stroke-blue-500' : 'hover:stroke-blue-300'
        }`}
      />
    </g>
  );
};