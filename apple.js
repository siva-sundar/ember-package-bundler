let index = require('./lib/');
let projectRoot = __dirname + '/tests/dummy';
let filePath = `../../dist/assets/dummy.js`;
let projectNameSpace = 'dummy';

index({
  projectRoot,
  filePath,
  projectNameSpace
})
