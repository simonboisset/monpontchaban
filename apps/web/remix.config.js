/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: ['@chaban/core', '@chaban/db', '@chaban/api'],
  serverModuleFormat: 'cjs',
  tailwind: true,
  postcss: true,
};
