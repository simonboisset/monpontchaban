module.exports = {
  root: true,
  extends: ['prettier'],
  rules: {
    'react/jsx-key': 'off',
  },
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
};
