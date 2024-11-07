import React from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { AlertTriangle, XCircle } from 'lucide-react';

export const ValidationPanel: React.FC = () => {
  const { validationErrors } = useCircuitStore();

  if (!validationErrors.length) return null;
 
  return (
    <div className="absolute bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Circuit Validation</h3>
      <div className="space-y-2">
        {validationErrors.map((error, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-2 rounded ${
              error.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'
            }`}
          >
            {error.type === 'error' ? (
              <XCircle className="text-red-500 mt-1" size={16} />
            ) : (
              <AlertTriangle className="text-yellow-500 mt-1" size={16} />
            )}
            <span className={error.type === 'error' ? 'text-red-700' : 'text-yellow-700'}>
              {error.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};