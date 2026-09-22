module.exports = {
  dependency: {
    platforms: {
      ios: null,
      android: null,
      // Windows consumers manually compile the shared bridge with their app's
      // React Native Windows project and register it with AddAttributedModules.
      windows: null,
      macos: {
        podspecPath: __dirname + '/building-blocks-rn-macos.podspec',
      },
    },
  },
};
