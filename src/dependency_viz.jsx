import React from "react";

import "./dependency_viz.css";
import useDependencyViz from "./hooks/use-dependency-viz";
import { ProjectProvider, useProjectContext } from "./project-context";

// normally i'd throw these in a new file, but we'll keep it all in one for simplicity
const ProjectSelector = () => {
  const { state, dispatch } = useProjectContext();

  function handleProjectSelect(event) {
    dispatch({ type: 'SET_SELECTED_PROJECT_ID', payload: event.target.value });
  } 

  return (
    <label htmlFor="projectSelect">
      Select a Project:&nbsp;
      <select id="projectSelect" onChange={handleProjectSelect}>
        <option value="">Select...</option>
        {(state?.projects ?? []).map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </label>
  );
};

const GraphViewer = () => {
  const { state: { stats: { taskCount, dependencyCount, rootCount, maxDepth } } } = useProjectContext();

  return (
    <>
      <h2>Graph Stats</h2>
        <table>
          <tbody>
            <tr>
              <td>Task Count</td>
              <td>{taskCount}</td>
            </tr>
            <tr>
              <td>Dependency Count</td>
              <td>{dependencyCount}</td>
            </tr>
            <tr>
              <td>Root Count</td>
              <td>{rootCount}</td>
            </tr>
            <tr>
              <td>Max Depth</td>
              <td>{maxDepth}</td>
            </tr>
          </tbody>
        </table>

      <h2>Graph Visualization</h2>
      {/* TODO */}
    </>
  );
};

export const DependencyVisualization = () => {
  const { state: { loading, projects, tasks, dependencies } } = useDependencyViz();

  if (loading) {
    return (<span>Loading...</span>);
  } 
  return (
    <ProjectProvider projects={projects} tasks={tasks} dependencies={dependencies}>
      <ProjectSelector />
      <GraphViewer />
    </ProjectProvider>
  );
};

DependencyVisualization.whyDidYouRender = true;