import React from 'react';
import { BaseComponent, BaseComponentProps } from './BaseComponent';

export const Capacitor: React.FC<BaseComponentProps> = (props) => {
  return (
    <BaseComponent {...props}>
      <line x1="-20" y1="0" x2="-5" y2="0" stroke="black" strokeWidth="2" />
      <line x1="-5" y1="-15" x2="-5" y2="15" stroke="black" strokeWidth="2" />
      <line x1="5" y1="-15" x2="5" y2="15" stroke="black" strokeWidth="2" />
      <line x1="5" y1="0" x2="20" y2="0" stroke="black" strokeWidth="2" />
      <text x="0" y="25" textAnchor="middle" fontSize="12">
        {props.value || "1µF"}
      </text>
      <circle cx="-20" cy="0" r="3" fill="#666" className="terminal" />
      <circle cx="20" cy="0" r="3" fill="#666" className="terminal" />
    </BaseComponent>
  );
};