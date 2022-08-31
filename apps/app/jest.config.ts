export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
