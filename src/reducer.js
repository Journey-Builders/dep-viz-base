import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import api from './api';
import { getLongestPath, getRootCount } from './utils/graph-methods';

const FETCH_PROJECTS_DONE = 'fetch-projects-done';
const PROJECT_SELECTED = 'project-selected';
const STATS_LOADING_START = 'stats-loading-start';

const initialState = {
  projects: [],
  tasksLength: null,
  depsLength: null,
  rootCount: null,
  longestPath: null,
  statsLoading: false,
  selectedProjectId: null,
};

function reducer(state=initialState, action) {
  switch (action.type) {

    case FETCH_PROJECTS_DONE:
      return {
        ...state,
        projects: action.payload.data,
      }

    case STATS_LOADING_START:
      return {
        ...state,
        statsLoading: true,
      }

    case PROJECT_SELECTED: {
      const { tasksLength, depsLength, rootCount, longestPath, selectedProjectId } = action.payload.data;

      return {
        ...state,
        tasksLength,
        depsLength,
        rootCount,
        longestPath,
        selectedProjectId,
        statsLoading: false,
      };
    }

    default:
      return state;
  }
}

const middlewares = [
  thunk,
];

export const store = createStore(reducer, applyMiddleware(...middlewares));

export function fetchProjects() {
  return async dispatch => {
    const projects = await api.fetchProjects();

    dispatch({
      type: FETCH_PROJECTS_DONE,
      payload: {
        data: projects,
      }
    });
  }
}


export function selectProject(projectId) {
  return async dispatch => {
    dispatch({
      type: STATS_LOADING_START,
    });

    const tasks = await api.fetchTasks(projectId);
    const deps = await api.fetchDependencies(projectId);

    const rootCount = getRootCount(tasks, deps);
    const longestPath = getLongestPath(tasks, deps);

    dispatch({
      type: PROJECT_SELECTED,
      payload: {
        data: {
          tasksLength: tasks.length,
          depsLength: deps.length,
          rootCount,
          longestPath,
          selectedProjectId: projectId,
        },
      }
    });
  }
}
