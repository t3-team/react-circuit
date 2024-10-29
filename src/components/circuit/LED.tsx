import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const LED: React.FC<BaseComponentProps> = (props) => {
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
      <path
        d="M-2,-15 L5,-8 M5,-15 L12,-8"
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
      <polygon
        points="2,-11 8,-8 5,-14"
        fill="black"
      />
      <polygon
        points="9,-11 15,-8 12,-14"
        fill="black"
      />
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="20" cy="0" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};