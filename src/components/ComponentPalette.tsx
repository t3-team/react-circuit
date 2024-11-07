import React from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { 
  Battery, 
  Zap, 
  Circle, 
  Hash, 
  Codesandbox, 
  Radio, 
  ToggleLeft,
  Lightbulb,
  GitBranch
} from 'lucide-react';

const ComponentPalette: React.FC = () => {
  const { addComponent, toggleWireMode, wireMode } = useCircuitStore();

  const components = [
    { type: 'resistor', icon: Hash, label: 'Resistor', defaultValue: '1kΩ' },
    { type: 'capacitor', icon: Circle, label: 'Capacitor', defaultValue: '1µF' },
    { type: 'inductor', icon: Codesandbox, label: 'Inductor', defaultValue: '1mH' },
    { type: 'voltage_source', icon: Battery, label: 'Voltage Source', defaultValue: '5V' },
    { type: 'ground', icon: Zap, label: 'Ground' },
    { type: 'diode', icon: Radio, label: 'Diode' },
    { type: 'transistor', icon: Radio, label: 'Transistor', defaultValue: 'NPN' },
    { type: 'led', icon: Lightbulb, label: 'LED' },
    { type: 'switch', icon: ToggleLeft, label: 'Switch' },
  ];
 
  return (
    <div className="w-64 bg-white border-r p-4">
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      <div className="space-y-2">
        {/* Wire Tool button */}
        <button
          onClick={toggleWireMode}
          className={`w-full flex items-center gap-2 p-2 rounded transition-colors ${
            wireMode ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
        >
          <GitBranch size={20} />
          <span>Wire Tool</span>
        </button>

        {components.map((component) => (
          <button
            key={component.type}
            onClick={() => addComponent(component.type, component.defaultValue)}
            className="w-full flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <component.icon size={20} />
            <span>{component.label}</span>
          </button>
        ))}
        
        {/* Wire Instructions */}
        <div className="mt-6 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <GitBranch size={20} />
            <span className="font-semibold">Wire Tool Usage</span>
          </div>
          <p className="text-sm text-blue-600">
            To draw wires:
            <ol className="list-decimal ml-4 mt-1">
              <li>Click the Wire Tool button</li>
              <li>Click to start drawing</li>
              <li>Click to add corners</li>
              <li>Press Enter to complete</li>
            </ol>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;