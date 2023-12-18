import React from "react";

import "./dependency_viz.css";
import useDependencyViz from "./hooks/use-dependency-viz";

export const DependencyVisualization = () => {
  const { state } = useDependencyViz();
  console.log('[render]', { state });

  return (
    <div className="depVizContainer">
      <h1>Project</h1>
      <select>
        <option/>
        <option value="pid1">Placeholder Project Name 1</option>
        <option value="pid2">Placeholder Project Name 2</option>
      </select>

      <h2>Graph Stats</h2>
        <table>
          <tbody>
            <tr>
              <td>Task Count</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Dependency Count</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Root Count</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Max Depth</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

      <h2>Graph Visualization</h2>
      <div>Graph Viz Component</div>
    </div>
  );
};

DependencyVisualization.whyDidYouRender = true;