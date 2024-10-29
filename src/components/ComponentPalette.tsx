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
  Lightbulb
} from 'lucide-react';

const ComponentPalette: React.FC = () => {
  const addComponent = useCircuitStore(state => state.addComponent);

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
      </div>
    </div>
  );
};

export default ComponentPalette;