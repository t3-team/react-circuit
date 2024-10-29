import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Diode: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <line x1="-20" y1="0" x2="20" y2="0" stroke="black" strokeWidth="2" />
      <polygon
        points="-5,-10 -5,10 10,0"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <line x1="10" y1="-10" x2="10" y2="10" stroke="black" strokeWidth="2" />
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="20" cy="0" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};