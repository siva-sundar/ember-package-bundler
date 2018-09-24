/* eslint-env node */

const j = require('jscodeshift');
const fs = require('fs');
const stripBom = require('strip-bom');


function transformToFile(file, distFolder, outputFolder = 'webpack-build') {
  let fileContent = stripBom(fs.readFileSync(file, { encoding: 'utf8' }));
  let ast = j(fileContent);

  ast.find(j.CallExpression, {
    callee: {
      type: 'Identifier',
      name: 'define',
    },
  }).forEach((nodePath) => {
    let { value: { arguments: [ fileNode, importPaths, exportFunction ] } } = nodePath

    if (fileNode.type === 'Literal') {
      let filePath = `${distFolder}/${outputFolder}/${fileNode.value}.js`;
      let dirName = path.dirname(path.resolve(filePath));
      mkdirp.sync(dirName);
      let imports = [];
      importPaths = importPaths.elements;
      let importVariables = exportFunction.params;
      let importVariable;
      let importPath;
      for (let i = 1; i < importPaths.length; i++) {
        importVariable = importVariables[i];
        importPath = importPaths[i];
        // imports.push(j(`import ${importVariable.name} from '${importPath.value};'`));
      }
      let newContent = j.file(j.program(exportFunction.body.body))
      newContent.program.body.unshift(...imports);
      fs.writeFileSync(filePath, j(newContent).toSource());
    } else {
      console.log('something phissy')
    }

  });
}

module.exports = transformToFile;
