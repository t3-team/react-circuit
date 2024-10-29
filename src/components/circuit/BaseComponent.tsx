import React, { useState, useEffect } from 'react';
import { Point } from '../../types/Circuit';
import { useCircuitStore } from '../../store/circuitStore';

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
  const [dragOffset, setDragOffset] = useState<Point | null>(null);
  const updateComponent = useCircuitStore(state => state.updateComponent);
  const draggingWire = useCircuitStore(state => state.draggingWire);

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!dragOffset) return;

        const svg = document.querySelector('svg');
        if (!svg) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

        const newX = Math.round((svgP.x - dragOffset.x) / 20) * 20;
        const newY = Math.round((svgP.y - dragOffset.y) / 20) * 20;

        updateComponent(id, { position: { x: newX, y: newY } });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
        setDragOffset(null);
      };

      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove);
        window.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragOffset, id, updateComponent]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    
    const svg = (e.currentTarget as SVGGElement).ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    setIsDragging(true);
    setDragOffset({
      x: svgP.x - x,
      y: svgP.y - y
    });
    onSelect();
  };

  const handleTerminalMouseDown = (e: React.MouseEvent, terminal: Point) => {
    e.stopPropagation();
    if (!draggingWire) {
      onStartWire(terminal);
    }
  };

  const handleTerminalMouseUp = (e: React.MouseEvent, terminal: Point) => {
    e.stopPropagation();
    if (draggingWire) {
      onCompleteWire(terminal);
    }
  };

  const transformValue = `translate(${x}, ${y}) rotate(${rotation})`;

  return (
    <g
      transform={transformValue}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      className={`cursor-move transition-transform duration-150 ease-out ${isDragging ? 'cursor-grabbing' : ''}`}
    >
      <g className="component-body">
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === 'circle' && child.props.className?.includes('terminal')) {
            return React.cloneElement(child, {
              onMouseDown: (e: React.MouseEvent) => handleTerminalMouseDown(e, { 
                x: x + (child.props.cx || 0), 
                y: y + (child.props.cy || 0) 
              }),
              onMouseUp: (e: React.MouseEvent) => handleTerminalMouseUp(e, { 
                x: x + (child.props.cx || 0), 
                y: y + (child.props.cy || 0)
              }),
              className: `terminal ${draggingWire ? 'cursor-crosshair' : ''} hover:fill-blue-500 transition-colors duration-150`
            });
          }
          return child;
        })}
      </g>
      {isSelected && (
        <g className="component-controls">
          <circle
            cx="0"
            cy="-30"
            r="10"
            fill="white"
            stroke="#2563eb"
            strokeWidth="2"
            onClick={(e) => {
              e.stopPropagation();
              onRotate();
            }}
            className="cursor-pointer hover:stroke-blue-400 transition-colors duration-150"
          />
          <circle
            cx="30"
            cy="0"
            r="10"
            fill="white"
            stroke="#ef4444"
            strokeWidth="2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="cursor-pointer hover:stroke-red-400 transition-colors duration-150"
          />
        </g>
      )}
    </g>
  );
};