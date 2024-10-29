import React from 'react';
import { Point, Wire as WireType } from '../../types/Circuit';

interface WireProps {
  wire: WireType;
  isSelected: boolean;
  onSelect: () => void;
}

export const Wire: React.FC<WireProps> = ({ wire, isSelected, onSelect }) => {
  const { from, to } = wire;

  // Calculate midpoint for orthogonal routing
  const midX = (from.terminal.x + to.terminal.x) / 2;

  // Create an orthogonal path with right angles
  const path = `M ${from.terminal.x} ${from.terminal.y} 
                L ${midX} ${from.terminal.y} 
                L ${midX} ${to.terminal.y} 
                L ${to.terminal.x} ${to.terminal.y}`;

  return (
    <path
      d={path}
      stroke={isSelected ? '#2196f3' : 'black'}
      strokeWidth={2}
      fill="none"
      onClick={onSelect}
      className="transition-colors duration-200 hover:stroke-blue-500 cursor-pointer"
    />
  );
};