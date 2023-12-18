import { useEffect, useReducer } from 'react';

import api from '../api';

const projectsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_INITIALIZED':
      return { ...state, loading: false, ...action.payload };
    default:
      return state;
  }
};

const getProjects = async () => {
  const tasks = [];
  const dependencies = [];

  // fetch our project information
  const projects = await api.fetchProjects();

  // then lookup the related tasks and dependencies
  await Promise.all(
    projects.map(async ({ id }) => {
      // since these don't depend on one another we can call them concurrently
      const [tasksPayload, depsPayload] = await Promise.all([
        api.fetchTasks(id),
        api.fetchDependencies(id)
      ]);
      tasks.push({ [id]: tasksPayload });
      dependencies.push({ [id]: depsPayload });
    })
  );

  return {
    projects,
    tasks,
    dependencies
  };
};

export const loadProjects = async (dispatch) => {
  try {
    const { projects, tasks, dependencies } = await getProjects();
    dispatch({
      type: 'SET_INITIALIZED',
      payload: {
        projects,
        tasks,
        dependencies
      }
    });
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error });
  }
};

const useDependencyViz = () => {
  const [state, dispatch] = useReducer(projectsReducer, {
    projects: [],
    tasks: [],
    dependencies: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    let isInitialized = false;

    const initialize = async () => {
      if (!isInitialized) {
        await loadProjects(dispatch);
        isInitialized = true;
      }
    };

    initialize();
  }, []);

  return { state, dispatch };
};

export default useDependencyViz;
