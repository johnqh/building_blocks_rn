// `.cjs`, not `.js`: this package is `"type": "module"`, so a `.js` file here
// is loaded as ESM and its `module.exports` is never seen — the CLI read
// `{}`, and nothing in it was linked. Autolinking searches for the `.cjs`
// name too, and loads it with `require`.
module.exports = {
  dependency: {
    platforms: {
      // The device-layout module: interface orientation and size classes,
      // which iOS reports and nothing in JavaScript can read.
      ios: {
        podspecPath: __dirname + '/building_blocks_rn.podspec',
      },
      android: null,
      // Windows consumers manually compile the shared bridge with their app's
      // React Native Windows project and register it with AddAttributedModules.
      windows: null,
      macos: {
        podspecPath: __dirname + '/building_blocks_rn.podspec',
      },
    },
  },
};
