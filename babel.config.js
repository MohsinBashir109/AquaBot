module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      // Remove console logs in production builds (reduces bundle size)
      plugins: [
        ['transform-remove-console', { exclude: ['error', 'warn'] }],
        'react-native-reanimated/plugin',
      ],
    },
  },
};
