// Learn more https://docs.expo.io/guides/customizing-metro
const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig(__dirname);
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'jsx', 'js', 'ts', 'tsx', 'cjs'],
      extraNodeModules: {
        stream: require.resolve('readable-stream')
      },
    }
  };
})();
