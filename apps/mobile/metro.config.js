const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');
const metro = require('metro-cache');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;
config.cacheStores = [new metro.FileStore({ root: path.resolve(projectRoot, 'metro-cache') })];
module.exports = config;
