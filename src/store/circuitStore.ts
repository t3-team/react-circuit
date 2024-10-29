import { create } from 'zustand';
import { CircuitComponent, Wire, Point, ValidationError } from '../types/Circuit';

interface CircuitState {
  currentDesign: {
    components: CircuitComponent[];
    wires: Wire[];
  };
  selectedComponent: string | null;
  draggingWire: {
    from?: {
      componentId: string;
      terminal: Point;
    };
    to?: Point;
  } | null;
  showGrid: boolean;
  validationErrors: ValidationError[];
  
  // Actions
  selectComponent: (id: string | null) => void;
  addComponent: (type: string, defaultValue?: string) => void;
  updateComponent: (id: string, updates: Partial<CircuitComponent>) => void;
  deleteComponent: (id: string) => void;
  rotateComponent: (id: string) => void;
  startWire: (componentId: string, terminal: Point) => void;
  updateWire: (point: Point) => void;
  completeWire: (componentId: string, terminal: Point) => void;
  cancelWire: () => void;
  toggleGrid: () => void;
  saveDesign: () => void;
  loadDesign: () => void;
  clearDesign: () => void;
  validateCircuit: () => void;
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  currentDesign: {
    components: [],
    wires: [],
  },
  selectedComponent: null,
  draggingWire: null,
  showGrid: true,
  validationErrors: [],

  selectComponent: (id) => set({ selectedComponent: id }),
  
  addComponent: (type, defaultValue) => {
    const newComponent: CircuitComponent = {
      id: `${type}-${Date.now()}`,
      type: type as CircuitComponent['type'],
      position: { x: 400, y: 300 },
      rotation: 0,
      value: defaultValue,
    };

    set((state) => ({
      currentDesign: {
        ...state.currentDesign,
        components: [...state.currentDesign.components, newComponent],
      },
      selectedComponent: newComponent.id,
    }));
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      currentDesign: {
        ...state.currentDesign,
        components: state.currentDesign.components.map((component) =>
          component.id === id
            ? {
                ...component,
                ...updates,
                // Ensure position updates maintain grid alignment
                position: updates.position
                  ? {
                      x: Math.round(updates.position.x / 20) * 20,
                      y: Math.round(updates.position.y / 20) * 20,
                    }
                  : component.position,
              }
            : component
        ),
      },
    }));
  },

  deleteComponent: (id) => {
    set((state) => ({
      currentDesign: {
        components: state.currentDesign.components.filter((c) => c.id !== id),
        wires: state.currentDesign.wires.filter(
          (w) => w.from.componentId !== id && w.to.componentId !== id
        ),
      },
      selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
    }));
  },

  rotateComponent: (id) => {
    set((state) => ({
      currentDesign: {
        ...state.currentDesign,
        components: state.currentDesign.components.map((component) =>
          component.id === id
            ? { ...component, rotation: (component.rotation + 90) % 360 }
            : component
        ),
      },
    }));
  },

  startWire: (componentId, terminal) => {
    set({
      draggingWire: {
        from: { componentId, terminal },
        to: terminal,
      },
    });
  },

  updateWire: (point) => {
    set((state) => ({
      draggingWire: state.draggingWire
        ? { ...state.draggingWire, to: point }
        : null,
    }));
  },

  completeWire: (componentId, terminal) => {
    const state = get();
    if (!state.draggingWire?.from) return;

    // Prevent self-connection
    if (state.draggingWire.from.componentId === componentId) {
      set({ draggingWire: null });
      return;
    }

    const newWire: Wire = {
      id: `wire-${Date.now()}`,
      from: state.draggingWire.from,
      to: { componentId, terminal },
    };

    set((state) => ({
      currentDesign: {
        ...state.currentDesign,
        wires: [...state.currentDesign.wires, newWire],
      },
      draggingWire: null,
    }));
  },

  cancelWire: () => set({ draggingWire: null }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  saveDesign: () => {
    const state = get();
    const design = JSON.stringify(state.currentDesign);
    localStorage.setItem('circuit-design', design);
  },

  loadDesign: () => {
    const design = localStorage.getItem('circuit-design');
    if (design) {
      set({ 
        currentDesign: JSON.parse(design),
        selectedComponent: null,
        draggingWire: null,
      });
    }
  },

  clearDesign: () => set({
    currentDesign: { components: [], wires: [] },
    selectedComponent: null,
    draggingWire: null,
  }),

  validateCircuit: () => {
    const state = get();
    const errors: ValidationError[] = [];
    
    if (state.currentDesign.components.length === 0) {
      errors.push({
        type: 'warning',
        message: 'Circuit is empty',
      });
    }

    // Check for floating components
    state.currentDesign.components.forEach(component => {
      const connectedWires = state.currentDesign.wires.filter(
        wire => wire.from.componentId === component.id || wire.to.componentId === component.id
      );

      if (connectedWires.length === 0) {
        errors.push({
          type: 'warning',
          message: `${component.type} is not connected to any other component`,
          componentId: component.id,
        });
      }
    });

    set({ validationErrors: errors });
  },
}));