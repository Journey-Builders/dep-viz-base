import { React, useEffect } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import "./dependency_viz.css";

import { fetchProjects, selectProject } from './reducer';

const DependencyVisualization = ({
  fetchProjects,
  selectProject,
  projects,
  tasksLength,
  depsLength,
  rootCount,
  longestPath,
  statsLoading,
  selectedProjectId,
}) => {

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Box className='container'>
      <h1>Project</h1>
      <FormControl className='project-selector'>
        <InputLabel id="project-select-label">Project</InputLabel>
        <Select
          labelId="project-select-label"
          id="project-select"
          label="Project"
          onChange={e => {
            selectProject(e.target.value);
          }}
        >
          {projects.map(proj => (
            <MenuItem key={proj.id} value={proj.id}>{proj.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <h2>Graph Stats</h2>
        {statsLoading ? 'Calculating...' : (
          <table className="stats-table">
            {selectedProjectId ? (
              <tbody>
                <tr>
                  <td>Task Count</td>
                  <td>{tasksLength.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Dependency Count</td>
                  <td>{depsLength.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Root Count</td>
                  <td>{rootCount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Max Depth</td>
                  <td>{longestPath.toLocaleString()}</td>
                </tr>
              </tbody>
            ) : <em>Choose a project to start</em>}
          </table>
        )}

    </Box>
  );
};

DependencyVisualization.propTypes = {
  projects: PropTypes.array,
  tasksLength: PropTypes.number,
  depsLength: PropTypes.number,
  rootCount: PropTypes.number,
  longestPath: PropTypes.number,
  fetchProjects: PropTypes.func,
  selectProject: PropTypes.func,
  statsLoading: PropTypes.bool,
  selectedProjectId: PropTypes.any,
}

const mapStateToProps = state => {
  return {
    projects: state.projects,
    tasksLength: state.tasksLength,
    depsLength: state.depsLength,
    rootCount: state.rootCount,
    longestPath: state.longestPath,
    statsLoading: state.statsLoading,
    selectedProjectId: state.selectedProjectId,
  };
};

const mapDispatchToProps = {
  fetchProjects,
  selectProject,
};

export default connect(mapStateToProps, mapDispatchToProps)(DependencyVisualization);
