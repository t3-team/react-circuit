import { create } from 'zustand';
import { CircuitComponent, Wire, Point, ValidationError } from '../types/Circuit';

const GRID_SIZE = 20; // Match the grid size used throughout the app

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
  wireMode: boolean;
  wirePoints: Point[];
  selectedWire: string | null;
  isDrawing: boolean;
  history: {
    past: Array<{
      components: CircuitComponent[];
      wires: Wire[];
    }>;
    future: Array<{
      components: CircuitComponent[];
      wires: Wire[];
    }>;
  };

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
  toggleWireMode: () => void;
  addWirePoint: (point: Point) => void;
  toggleWireSelect: (wireId: string | null) => void;
  completeWirePath: () => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
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
  wireMode: false,
  wirePoints: [],
  selectedWire: null,
  isDrawing: false,
  history: {
    past: [],
    future: []
  },

  selectComponent: (id) => set({ selectedComponent: id }),
  
  addComponent: (type, defaultValue) => {
    get().saveToHistory();
    const position = {
      x: Math.round(400 / 20) * 20, // Default position, snapped to grid
      y: Math.round(300 / 20) * 20
    };

    const newComponent: CircuitComponent = {
      id: `${type}-${Date.now()}`,
      type: type as CircuitComponent['type'],
      position,
      rotation: 0,
      value: defaultValue || (type === 'inductor' ? '1mH' : ''),
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
                // Use GRID_SIZE constant instead of magic number
                position: updates.position
                  ? {
                      x: Math.round(updates.position.x / GRID_SIZE) * GRID_SIZE,
                      y: Math.round(updates.position.y / GRID_SIZE) * GRID_SIZE,
                    }
                  : component.position,
              }
            : component
        ),
      },
    }));
  },

  deleteComponent: (id) => {
    get().saveToHistory();
    set((state) => ({
      currentDesign: {
        components: state.currentDesign.components.filter((c) => c.id !== id),
        wires: state.currentDesign.wires.filter(
          (w) => !w.points.some(p => p.componentId === id)
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

  updateWire: (point: Point) => {
    set((state) => {
      if (!state.draggingWire) return state;
      
      return {
        ...state,
        draggingWire: {
          ...state.draggingWire,
          to: point
        }
      };
    });
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
      points: [
        state.draggingWire.from.terminal,
        terminal
      ]
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
        wire => wire.points.some(p => p.componentId === component.id)
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

  toggleWireMode: () => set(state => ({ 
    wireMode: !state.wireMode,
    wirePoints: [],
    isDrawing: false,
    draggingWire: null,
  })),

  addWirePoint: (point: Point) => {
    const state = get();
    if (!state.wireMode) return;

    if (state.isDrawing) {
      get().saveToHistory();
    }

    const snappedPoint = {
      x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(point.y / GRID_SIZE) * GRID_SIZE
    };

    if (!state.isDrawing) {
      // Start drawing
      set({
        wirePoints: [snappedPoint],
        isDrawing: true
      });
    } else {
      // Complete the wire
      const newWire: Wire = {
        id: `wire-${Date.now()}`,
        points: [...state.wirePoints, snappedPoint],
        isFreePath: true
      };

      set({
        currentDesign: {
          ...state.currentDesign,
          wires: [...state.currentDesign.wires, newWire],
        },
        wirePoints: [],
        isDrawing: false,
      });
    }
  },

  toggleWireSelect: (wireId: string | null) => set(state => ({
    selectedWire: state.selectedWire === wireId ? null : wireId
  })),

  completeWirePath: () => {
    const state = get();
    if (state.wirePoints.length < 2) return;

    const newWire: Wire = {
      id: `wire-${Date.now()}`,
      points: [...state.wirePoints],
      isFreePath: true
    };

    set(state => ({
      currentDesign: {
        ...state.currentDesign,
        wires: [...state.currentDesign.wires, newWire],
      },
      wirePoints: [],
      isDrawing: false,
    }));
  },

  saveToHistory: () => {
    const currentState = get();
    set({
      history: {
        past: [...currentState.history.past, { ...currentState.currentDesign }],
        future: []
      }
    });
  },

  undo: () => {
    const state = get();
    if (state.history.past.length === 0) return;

    const previous = state.history.past[state.history.past.length - 1];
    const newPast = state.history.past.slice(0, -1);

    set(state => ({
      currentDesign: previous,
      history: {
        past: newPast,
        future: [state.currentDesign, ...state.history.future]
      }
    }));
  },

  redo: () => {
    const state = get();
    if (state.history.future.length === 0) return;

    const next = state.history.future[0];
    const newFuture = state.history.future.slice(1);

    set(state => ({
      currentDesign: next,
      history: {
        past: [...state.history.past, state.currentDesign],
        future: newFuture
      }
    }));
  },
}));