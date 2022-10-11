const { defineFeatureRoutes } = require('@remix-routes/feature');
module.exports = {
  serverBuildTarget: 'netlify',
  server: './server.js',
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => {
    return defineFeatureRoutes('app', 'routes', 'routes', defineRoutes);
  },
};
