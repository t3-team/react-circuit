import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Transistor: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <circle cx="0" cy="0" r="15" stroke="black" fill="none" strokeWidth="2" />
      <line x1="-20" y1="0" x2="-15" y2="0" stroke="black" strokeWidth="2" />
      <line x1="-15" y1="-10" x2="-15" y2="10" stroke="black" strokeWidth="2" />
      <line x1="-15" y1="0" x2="5" y2="0" stroke="black" strokeWidth="2" />
      <line x1="5" y1="-10" x2="5" y2="10" stroke="black" strokeWidth="2" />
      <line x1="5" y1="-10" x2="20" y2="-20" stroke="black" strokeWidth="2" />
      <line x1="5" y1="10" x2="20" y2="20" stroke="black" strokeWidth="2" />
      <text x="25" y="0" textAnchor="start" fontSize="12">
        {props.value || "NPN"}
      </text>
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="20" cy="-20" r="3" fill="#666" className="terminal" />
      <circle cx="20" cy="20" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};