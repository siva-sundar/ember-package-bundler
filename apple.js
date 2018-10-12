let index = require('./lib/transform-to-files');
let projectRoot = __dirname + '/tests/dummy';
let filePath = `../../dist/assets/dummy.js`;
let projectNameSpace = 'dummy';

let transformFiles = new index({
  projectRoot,
  inputFilePath: filePath,
  projectNameSpace
});

transformFiles.run();

console.log(transformFiles.getExternalModules());
