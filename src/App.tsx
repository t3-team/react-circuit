import React from 'react';
import ComponentPalette from './components/ComponentPalette';
import CircuitCanvas from './components/CircuitCanvas';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <ComponentPalette />
      <div className="flex-1">
        <CircuitCanvas />
      </div>
    </div>
  );
}

export default App;