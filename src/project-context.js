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
  // set up a map indexed by our task id that lists its dependent tasks
  // { 1: [2, 3], 3: [4], 2: [5], 4: [5] }
  const taskSuccessorsMap = new Map();
  dependencies.forEach(({ predecessor_id, successor_id }) => {
    if (!taskSuccessorsMap.has(predecessor_id)) {
      taskSuccessorsMap.set(predecessor_id, []);
    }
    taskSuccessorsMap.get(predecessor_id).push(successor_id);
  });

  const maxDepthMap = new Map();
  const tasksWithDepth = tasks.map((task) => ({ task, depth: 0 }));

  while (tasksWithDepth.length > 0) {
    const { task, depth } = tasksWithDepth.pop();

    const isNewTask = !maxDepthMap.has(task.id);
    const isIncreasedDepth = depth > maxDepthMap.get(task.id);
    if (isNewTask || isIncreasedDepth) {
      maxDepthMap.set(task.id, depth);

      const successors = taskSuccessorsMap.get(task.id) || [];
      tasksWithDepth.push(
        // increment our depth for each successor for this task
        ...successors.map((successor) => ({
          task: tasks.find((t) => t.id === successor),
          depth: depth + 1
        }))
      );
    }
  }

  const maxDepth = Math.max(...Array.from(maxDepthMap.values()));
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
