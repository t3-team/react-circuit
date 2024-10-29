import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Switch: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <circle cx="-15" cy="0" r="3" fill="black" />
      <path
        d="M-15,0 L15,-10"
        stroke="black"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="15" cy="0" r="3" fill="black" />
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="20" cy="0" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};