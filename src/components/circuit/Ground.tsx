import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Ground: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <line x1="0" y1="-10" x2="0" y2="0" stroke="black" strokeWidth="2" />
      <line x1="-15" y1="0" x2="15" y2="0" stroke="black" strokeWidth="2" />
      <line x1="-10" y1="5" x2="10" y2="5" stroke="black" strokeWidth="2" />
      <line x1="-5" y1="10" x2="5" y2="10" stroke="black" strokeWidth="2" />
      <circle cx="0" cy="-10" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};