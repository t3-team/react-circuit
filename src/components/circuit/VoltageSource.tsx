import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

interface VoltageSourceProps extends BaseComponentProps {}

export const VoltageSource: React.FC<VoltageSourceProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <circle cx="0" cy="0" r="15" stroke="black" fill="none" strokeWidth="2" />
      <text 
        x="0" 
        y="0" 
        textAnchor="middle" 
        dominantBaseline="middle" 
        fontSize="12"
        className="select-none"
      >
        {props.value || "5V"}
      </text>
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="black" strokeWidth="2" />
      <line x1="15" y1="0" x2="25" y2="0" stroke="black" strokeWidth="2" />
      <circle 
        cx="-25" 
        cy="0" 
        r="3" 
        fill="#666" 
        className="terminal hover:fill-blue-500 transition-colors"
        onMouseDown={() => props.onStartWire({ x: props.x - 25, y: props.y })}
        onMouseUp={() => props.onCompleteWire({ x: props.x - 25, y: props.y })}
      />
      <circle 
        cx="25" 
        cy="0" 
        r="3" 
        fill="#666" 
        className="terminal hover:fill-blue-500 transition-colors"
        onMouseDown={() => props.onStartWire({ x: props.x + 25, y: props.y })}
        onMouseUp={() => props.onCompleteWire({ x: props.x + 25, y: props.y })}
      />
    </BaseComponent>
  );
};