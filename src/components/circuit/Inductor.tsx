import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Inductor: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <path
        d="M-20,0 L-15,0 C-10,0 -10,-10 -5,-10 C0,-10 0,10 5,10 C10,10 10,-10 15,-10 C20,-10 20,0 25,0 L30,0"
        stroke="black"
        fill="none"
        strokeWidth="2"
      />
      <text x="0" y="20" textAnchor="middle" fontSize="12">
        {props.value || "1mH"}
      </text>
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="30" cy="0" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};