/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect, SVGProps } from 'react';
import { Point, GRID_SIZE } from '../../types/Circuit';
import { useCircuitStore } from '../../store/circuitStore';
import { Trash2, RotateCw, RotateCcw } from 'lucide-react';

export interface BaseComponentProps {
  id: string;
  x: number;
  y: number;
  rotation: number;
  value?: string;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onDelete: () => void;
  onRotate: () => void;
  onStartWire: (terminal: Point) => void;
  onCompleteWire: (terminal: Point) => void;
}

interface TerminalElementProps extends SVGProps<SVGCircleElement> {
  cx?: number;
  cy?: number;
  className?: string;
  onMouseDown?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
  onMouseUp?: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => void;
}

export const BaseComponent: React.FC<BaseComponentProps & { children: React.ReactNode }> = ({
  id,
  x,
  y,
  rotation,
  isSelected,
  onSelect,
  onDoubleClick,
  onDelete,
  onRotate,
  onStartWire,
  onCompleteWire,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const updateComponent = useCircuitStore(state => state.updateComponent);
  const draggingWire = useCircuitStore(state => state.draggingWire);

  // Add cursor styles
  const cursorStyle = isDragging 
    ? 'cursor-grabbing' 
    : isSelected 
    ? 'cursor-grab' 
    : 'cursor-move';

  // Add hover effect class
  const hoverClass = !isDragging ? 'hover:opacity-80' : '';

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const svg = document.querySelector('svg');
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        // Directly use cursor position for component position, 
        // but maintain grid snapping
        const newPosition = {
          x: Math.round(svgP.x / GRID_SIZE) * GRID_SIZE,
          y: Math.round(svgP.y / GRID_SIZE) * GRID_SIZE
        };

        updateComponent(id, { position: newPosition });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'grabbing';
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, id, updateComponent]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsDragging(true);
    onSelect();
  };

  const handleTerminalMouseDown = (e: React.MouseEvent<SVGCircleElement, MouseEvent>, terminal: Point) => {
    e.stopPropagation();
    if (!draggingWire) {
      const adjustedTerminal = {
        x: x + terminal.x,
        y: y + terminal.y
      };
      onStartWire(adjustedTerminal);
    }
  };

  const handleTerminalMouseUp = (e: React.MouseEvent<SVGCircleElement, MouseEvent>, terminal: Point) => {
    e.stopPropagation();
    if (draggingWire && draggingWire.from) {
      const adjustedTerminal = {
        x: x + terminal.x,
        y: y + terminal.y
      };
      onCompleteWire(adjustedTerminal);
    }
  };

  // First, let's modify the transform calculation to separate translation and rotation
  const transformValue = `translate(${x}, ${y})`;

  return (
    <g
      transform={transformValue}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e: React.MouseEvent<SVGGElement>) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      className={`${cursorStyle} transition-transform duration-150 ease-out ${hoverClass}`}
    >
      <g transform={`rotate(${rotation})`} className="component-body">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.props.className?.includes('terminal')) {
            return React.cloneElement(child as React.ReactElement<TerminalElementProps>, {
              onMouseDown: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => handleTerminalMouseDown(e, { 
                x: Number(child.props.cx) || 0, 
                y: Number(child.props.cy) || 0 
              }),
              onMouseUp: (e: React.MouseEvent<SVGCircleElement, MouseEvent>) => handleTerminalMouseUp(e, { 
                x: Number(child.props.cx) || 0, 
                y: Number(child.props.cy) || 0 
              }),
              className: `terminal ${draggingWire ? 'cursor-crosshair' : ''} hover:fill-blue-500 transition-colors duration-150`,
              style: { pointerEvents: 'all' }
            });
          } 
          return child;
        })}
      </g>
      {isSelected && (
        <g className="component-controls">
          <g
            onClick={(e: React.MouseEvent<SVGGElement>) => {
              e.stopPropagation();
              updateComponent(id, { 
                rotation: rotation - 90,
                position: { x, y }
              });
            }}
            className="cursor-pointer"
          >
            <circle
              cx="-30"
              cy="-30"
              r="10"
              fill="white"
              stroke="#2563eb"
              strokeWidth="2"
              className="hover:stroke-blue-400 transition-colors duration-150"
            />
            <g transform="translate(-36, -36) scale(0.6)">
              <RotateCcw color="#2563eb" />
            </g>
          </g>
          <g
            onClick={(e: React.MouseEvent<SVGGElement>) => {
              e.stopPropagation();
              updateComponent(id, { 
                rotation: rotation + 90,
                position: { x, y }
              });
            }}
            className="cursor-pointer"
          >
            <circle
              cx="0"
              cy="-30"
              r="10"
              fill="white"
              stroke="#2563eb"
              strokeWidth="2"
              className="hover:stroke-blue-400 transition-colors duration-150"
            />
            <g transform="translate(-6, -36) scale(0.6)">
              <RotateCw color="#2563eb" />
            </g>
          </g>
          <g
            onClick={(e: React.MouseEvent<SVGGElement>) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer"
          >
            <circle
              cx="30"
              cy="0"
              r="10"
              fill="white"
              stroke="#ef4444"
              strokeWidth="2"
              className="hover:stroke-red-400 transition-colors duration-150"
            />
            <g transform="translate(24, -6) scale(0.6)">
              <Trash2 color="#ef4444" />
            </g>
          </g>
        </g>
      )}
    </g>
  );
};