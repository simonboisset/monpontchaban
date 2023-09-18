/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ['**/.*'],
  serverDependenciesToBundle: ['@lezo-alert/chaban-core', '@lezo-alert/db', '@lezo-alert/api'],
  serverModuleFormat: 'cjs',
  tailwind: true,
  postcss: true,
};
