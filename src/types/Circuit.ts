export interface Point {
  x: number;
  y: number;
}

export interface CircuitComponent {
  id: string;
  type: 'resistor' | 'capacitor' | 'voltage_source';
  position: Point;
  rotation: number;
  value?: string;
}

export interface Wire {
  id: string;
  from: {
    componentId: string;
    terminal: Point;
  };
  to: {
    componentId: string;
    terminal: Point;
  };
}

export const GRID_SIZE = 20;