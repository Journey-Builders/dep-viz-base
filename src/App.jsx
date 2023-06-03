import React from 'react';
import DependencyVisualization from './dependency_viz';
import { Provider } from 'react-redux';

import { store } from './reducer';

require('./data');

function App() {
  return (
    <Provider store={store}>
      <DependencyVisualization />
    </Provider>

  );
}

export default App;
