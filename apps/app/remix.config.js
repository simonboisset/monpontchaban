const { defineFeatureRoutes } = require('@remix-routes/feature');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: 'netlify',
  server: './server.js',
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => {
    return defineFeatureRoutes('app', 'routes', 'routes', defineRoutes);
  },
  future: {
    unstable_tailwind: true,
  },
};
