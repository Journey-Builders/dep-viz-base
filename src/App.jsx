import React from 'react';
import { DependencyVisualization } from './dependency_viz';

require('./data');

function App() {
  return (
    <>
      <DependencyVisualization />
    </>
  );
}

export default App;
