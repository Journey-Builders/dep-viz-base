const formattedAttrs = {
  dependUnique: ['depend_unique_id', 'task_unique_id'],
  predSuc: ['predecessor_id', 'successor_id'],
};

function getDepDataFormat(deps) {
  return deps[0] && deps[0].hasOwnProperty('task_unique_id') ? 'dependUnique' : 'predSuc'; // eslint-disable-line
}

export function getRootCount(tasks, deps) {
  const depDataFormat = getDepDataFormat(deps)
  const [_, nextNode] = formattedAttrs[depDataFormat]; // eslint-disable-line
  const roots = {};
  tasks.forEach(t => roots[t.id] = true);
  deps.forEach(d => {
    delete roots[d[nextNode]];
  });
  return Object.keys(roots).length;
}


// Copied from https://www.geeksforgeeks.org/longest-path-in-a-directed-acyclic-graph-dynamic-programming/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// JavaScript program to find the longest
// path in the DAG

// Function to traverse the DAG
// and apply Dynamic Programming
// to find the longest path
function dfs(node, adj, dp, vis)
{
  // Mark as visited
  vis[node] = true;

  // Traverse for all its children
  for (let i = 0; i < adj[node].length; i++) {

    // If not visited
    if (!vis[adj[node][i]])
      dfs(adj[node][i], adj, dp, vis);

    // Store the max of the paths
    dp[node] = Math.max(dp[node], 1 + dp[adj[node][i]]);
  }
}

// Function to add an edge
function addEdge(adj, u, v)
{
  adj[u].push(v);
}

// Function that returns the longest path
function findLongestPath(adj, n)
{
  // Dp array
  let dp = Array(n+1).fill(0);

  // Visited array to know if the node
  // has been visited previously or not
  let vis = Array(n+1).fill(false);

  // Call DFS for every unvisited vertex
  for (let i = 1; i <= n; i++) {
    if (!vis[i])
      dfs(i, adj, dp, vis);
  }

  let ans = 0;

  // Traverse and find the maximum of all dp[i]
  for (let i = 1; i <= n; i++) {
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export function getLongestPath(tasks, deps) {
  const depDataFormat = getDepDataFormat(deps)
  const [prevNode, nextNode] = formattedAttrs[depDataFormat];

  let n = tasks.length;
  let adj = Array.from(Array(n+1), ()=>Array());

  const taskIdxs = {};
  tasks.forEach((t, idx) => taskIdxs[t.id] = idx);

  deps.forEach(dep => {
    const idxOfPre = taskIdxs[dep[prevNode]];
    const idxOfSuc = taskIdxs[dep[nextNode]];
    addEdge(adj, idxOfPre+1, idxOfSuc+1);
  });

  return findLongestPath(adj, n);
}
