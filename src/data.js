import { Response, Server } from 'miragejs';

import projects from './data/projects';
import tasks from './data/tasks';
import dependencies from './data/dependencies';

new Server({
  routes() {
    this.namespace = 'api';

    this.get(
      '/projects/',
      () => {
        return projects;
      },
      { timing: 1000 }
    );

    this.get(
      '/projects/:projectid/tasks/',
      (schema, request) => {
        return (
          tasks[request.params.projectid].map((t) => {
            return { ...t };
          }) || []
        );
      },
      { timing: 2000 }
    );

    this.get(
      '/projects/:projectid/dependencies',
      (schema, request) => {
        if (
          Object.prototype.hasOwnProperty.call(
            dependencies,
            request.params.projectid
          )
        ) {
          return dependencies[request.params.projectid];
        } else {
          return new Response(404, { errors: ['Project not found'] });
        }
      },
      { timing: 2000 }
    );
  }
});
