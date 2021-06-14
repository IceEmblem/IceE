/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

// const rootPath = __dirname.replace(/(\\|\/)packages(\\|\/)ice-rn-start$/, '');

// const moduleMap = {
//   'ice': path.resolve(projectRoot, '../ice'),
//   'ice-core': path.resolve(projectRoot, '../ice-core'),
// }

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // extraNodeModules: moduleMap,
    // resolveRequest: (context, realModuleName, platform, moduleName) => {
    //   // // Resolve file path logic...
    //   // if(moduleName == 'ice'){
    //   //   console.log(aaaaaaaaaa);
    //   //   return {
    //   //     filePath: 'E:\\FrontProjects\\NewIceE\\packages\\ice-rn-start\\node_modules\\ice\\index.js',
    //   //     type: 'sourceFile'
    //   //   };
    //   // }
    //   // console.log(aaaaaaaaaa);

    //   // return null;

    //   if (moduleMap[moduleName]) {
    //     return {
    //       filePath: moduleMap[moduleName],
    //       type: 'sourceFile'
    //     };
    //   }

    //   const { resolveRequest: removed, ...restContext } = context;
    //   return require("metro-resolver").resolve(restContext, realModuleName, platform);
    // }
  }
};
