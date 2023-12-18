import React from 'react';
import { DependencyVisualization } from './dependency_viz';

require('./data');

function App() {
  return (
    <div className="depVizContainer">
      <h1>Project</h1>
      <DependencyVisualization />
    </div>
  );
}

export default App;
