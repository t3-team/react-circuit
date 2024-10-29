import { CircuitDesign, ValidationError } from '../types/Circuit';

export const validateCircuit = (design: CircuitDesign): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check for floating components
  design.components.forEach(component => {
    const connectedWires = design.wires.filter(
      wire => wire.from.componentId === component.id || wire.to.componentId === component.id
    );

    if (connectedWires.length === 0 && component.type !== 'ground') {
      errors.push({
        type: 'warning',
        message: `${component.type} is not connected to any other component`,
        componentId: component.id
      });
    }
  });

  // Check for ground connection
  const hasGround = design.components.some(c => c.type === 'ground');
  if (!hasGround) {
    errors.push({
      type: 'error',
      message: 'Circuit needs at least one ground connection'
    });
  }

  // Check for voltage source
  const hasVoltageSource = design.components.some(c => c.type === 'voltage_source');
  if (!hasVoltageSource) {
    errors.push({
      type: 'error',
      message: 'Circuit needs at least one voltage source'
    });
  }

  // Check for short circuits
  design.wires.forEach(wire => {
    const fromComponent = design.components.find(c => c.id === wire.from.componentId);
    const toComponent = design.components.find(c => c.id === wire.to.componentId);

    if (fromComponent?.type === 'voltage_source' && toComponent?.type === 'voltage_source') {
      errors.push({
        type: 'error',
        message: 'Direct connection between voltage sources detected',
        wireId: wire.id
      });
    }
  });

  return errors;
};