import React, { useState, useEffect } from 'react';
import { useCircuitStore } from '../../store/circuitStore';

interface ValueEditorProps {
  componentId: string;
  value: string;
  onClose: () => void;
}

export const ValueEditor: React.FC<ValueEditorProps> = ({ componentId, value, onClose }) => {
  const [editValue, setEditValue] = useState(value);
  const { updateComponent } = useCircuitStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.value-editor')) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComponent(componentId, { value: editValue });
    onClose();
  };

  return (
    <div className="value-editor absolute bg-white shadow-lg rounded-lg p-2 z-50">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
};