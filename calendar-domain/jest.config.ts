export default {
  displayName: 'calendar-domain',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  forceExit: true,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../coverage/calendar-domain',
};
