/* eslint-disable no-unused-vars */
import * as d3 from 'd3';
import * as d3dag from 'd3-dag';
import React, { useEffect, useRef } from 'react';

import './dependency_viz.css';
import useDependencyViz from './hooks/use-dependency-viz';
import { ProjectProvider, useProjectContext } from './project-context';

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
  const {
    state: {
      stats: { taskCount, dependencyCount, rootCount, maxDepth }
    }
  } = useProjectContext();

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
      <GraphVisualizer />
    </>
  );
};

const drawGraph = (data = [], ref) => {
  const stratify = d3dag.graphStratify();
  const dag = stratify(data);

  const nodeRadius = 5;
  const nodeSize = [nodeRadius * 10, nodeRadius * 10];
  const layout = d3dag
    .sugiyama()
    .coord(d3dag.coordQuad())
    .nodeSize(nodeSize)
    .gap([nodeRadius, nodeRadius]);
  const { width, height } = layout(dag);
  const svg = d3.select(ref.current);

  // clear out any prior svg instances
  svg.selectAll('*').remove();

  const g = svg.append('g');
  svg.attr('width', width).attr('height', height);

  // draw some lines
  g.selectAll('.link')
    .data(dag.links())
    .join((enter) =>
      enter
        .append('path')
        .attr(
          'd',
          d3
            .linkHorizontal()
            .x((d) => d.x)
            .y((d) => d.y)
        )
        .attr('fill', 'none')
        .attr('stroke', 'tomato')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)')
    );

  // draw nodes and label
  g.selectAll('.node')
    .data(dag.nodes())
    .join((enter) =>
      enter
        .append('g')
        .attr('transform', ({ x, y }) => `translate(${x}, ${y})`)
        .call((enter) => {
          enter.append('circle').attr('r', 10).attr('fill', 'tomato');
          enter
            .append('text')
            .text((d) => d.data.id)
            .attr('font-weight', 'bold')
            .attr('font-family', 'sans-serif')
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('fill', 'white');
        })
    );

  // TODO arrows would be dope, but im kind of going over time at this point
};

const GraphVisualizer = () => {
  const {
    state: { selectedProjectID, tasks, dependencies }
  } = useProjectContext();
  const svgRef = useRef();
  const selectedProjectTasks = selectedProjectID
    ? tasks[selectedProjectID]
    : null;
  const selectedProjectDependencies = selectedProjectID
    ? dependencies[selectedProjectID]
    : null;

  function createDependencyArray(dependencies = [], tasks = []) {
    const taskMap = new Map();

    tasks.forEach((task) => {
      taskMap.set(task.id, {
        id: task.id,
        parentIds: []
      });
    });

    dependencies.forEach((dep, index) => {
      try {
        const successorTask = taskMap.get(dep.successor_id);
        if (successorTask) {
          successorTask.parentIds.push(dep.predecessor_id);
        }
      } catch (err) {
        console.log({ err });
      }
    });

    const result = Array.from(taskMap.values());
    console.log({ result: result });
    return result;
  }

  useEffect(() => {
    if (!selectedProjectTasks) {
      return;
    }

    const data = createDependencyArray(
      selectedProjectDependencies,
      selectedProjectTasks
    );
    // lol yeah this just can't handle the larger graphs
    if (data.length < 100) {
      drawGraph(data, svgRef);
    }
  }, [selectedProjectTasks, selectedProjectDependencies]);

  return <svg ref={svgRef} />;
};

export const DependencyVisualization = () => {
  const {
    state: { loading, projects, tasks, dependencies }
  } = useDependencyViz();

  if (loading) {
    return <span>Loading...</span>;
  }
  return (
    <ProjectProvider
      projects={projects}
      tasks={tasks}
      dependencies={dependencies}
    >
      <ProjectSelector />
      <GraphViewer />
    </ProjectProvider>
  );
};
