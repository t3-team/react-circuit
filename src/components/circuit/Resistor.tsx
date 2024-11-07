import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Resistor: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <path
        d="M-20,0 L-10,0 L-7,-5 L-1,5 L5,-5 L11,5 L17,-5 L20,0 L30,0"
        stroke="black"
        fill="none"
        strokeWidth="2"
      />
      <text x="0" y="20" textAnchor="middle" fontSize="12">
        {props.value || "1kΩ"}
      </text>
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="30" cy="0" r="3" fill="#666" className="terminal" />
    </BaseComponent> 
  );
};