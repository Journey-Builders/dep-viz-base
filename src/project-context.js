/* eslint-disable react/prop-types */
import React, { createContext, useContext, useReducer } from 'react';

const ParserContext = createContext(undefined);

function generateStats(selectedProjectID, state) {
  const selected = {
    id: selectedProjectID,
    project: state.projects.find(({ id }) => id === selectedProjectID),
    tasks: state.tasks?.[selectedProjectID] ?? [],
    dependencies: state.dependencies?.[selectedProjectID] ?? []
  };

  return {
    taskCount: getTaskCount(selected),
    dependencyCount: getDependencyCount(selected),
    rootCount: getRootCount(selected),
    maxDepth: getMaxDepth(selected)
  };
}

function ruleReducer(state, action) {
  switch (action.type) {
    case 'SET_SELECTED_PROJECT_ID':
      if (!action.payload) {
        return {
          ...state,
          selectedProjectID: null,
          stats: {
            taskCount: 0,
            dependencyCount: 0,
            rootCount: 0,
            maxDepth: 0
          }
        };
      }

      console.log('*', {
        ...state,
        selectedProjectID: action.payload,
        ...generateStats(action.payload, state)
      });
      return {
        ...state,
        selectedProjectID: action.payload,
        stats: {
          ...generateStats(action.payload, state)
        }
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function getTaskCount({ tasks = [] }) {
  return tasks.length;
}

function getDependencyCount({ dependencies = [] }) {
  return dependencies.length;
}

function getRootCount({ tasks = [], dependencies = [] }) {
  const taskIDs = [...new Set(tasks.map((task) => task.id))];
  const successorTaskIDs = [
    ...new Set(dependencies.map((dep) => dep.successor_id))
  ];

  const rootTasks = taskIDs.filter(
    (taskId) => !successorTaskIDs.includes(taskId)
  );

  return rootTasks.length;
}

function getMaxDepth({ dependencies = [], tasks = [] }) {
  // TODO temp...
  if (tasks.length > 50 || dependencies.length > 50) {
    return 0;
  }
  const adjacencyList = new Map();

  // Build adjacency list from dependencies
  dependencies.forEach((dep) => {
    const { predecessor_id, successor_id } = dep;
    if (!adjacencyList.has(predecessor_id)) {
      adjacencyList.set(predecessor_id, []);
    }
    adjacencyList.get(predecessor_id).push(successor_id);
  });

  // recurse to find the depth of a task
  // TODO how scary is this perf wise for bigger graphs? ...lmao scary
  function findDepth(taskId) {
    if (!adjacencyList.has(taskId)) {
      return 0;
    }

    const successors = adjacencyList.get(taskId);
    const depths = successors.map(findDepth);
    return 1 + Math.max(...depths);
  }

  // Calculate the depth for each task and find the maximum
  const depths = tasks.map((task) => findDepth(task.id));
  const maxDepth = Math.max(...depths);

  return maxDepth;
}

export function ProjectProvider({
  children,
  projects = [],
  tasks = {},
  dependencies = {}
}) {
  const [state, dispatch] = useReducer(ruleReducer, {
    selectedProjectID: null,
    projects,
    tasks,
    dependencies,
    stats: {
      taskCount: 0,
      dependencyCount: 0,
      rootCount: 0,
      maxDepth: 0
    }
  });

  return (
    <ParserContext.Provider value={{ state, dispatch }}>
      {children}
    </ParserContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ParserContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
}
