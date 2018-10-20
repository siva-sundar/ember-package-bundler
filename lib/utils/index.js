/* eslint-env node */
const j = require('jscodeshift');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const decamelize = require('decamelize');

function isRoute(fileName) {
  return fileName.includes('/routes/');
}

function isFileExists({ allFiles, fileName }) {
  let underScoreFileName = decamelize(fileName);
  let hyphenatedFileName = decamelize(fileName, '-');
  return allFiles.includes(fileName) || allFiles.includes(underScoreFileName) || allFiles.includes(hyphenatedFileName);
}

function isController(fileName) {
  return fileName.includes('/controllers/');
}

function isComponentJS(fileName) {
  return fileName.includes('/components/') && !fileName.includes('/templates/components/');
}

function isTemplate(fileName) {
  return fileName.includes('/templates/');
}

function buildSpecifiers(importVariable) {
  if (importVariable) {
    return [
      j.importDefaultSpecifier(j.identifier(importVariable))
    ];
  }
  return [];
}

function constructImportDeclaration({
  importVariable,
  importPath = ''
}) {
  importPath = importPath.replace(/\./g, '/');
  return j(j.importDeclaration(buildSpecifiers(importVariable), j.literal(importPath))).paths()[0];
}

function constructIIFE({ block, args = [], functionNanme = null }) {
  return j.expressionStatement(
    j.callExpression(
      j.functionExpression(
        functionNanme,
        args,
        j.blockStatement(block)
      ),
      args
    )
  );
}

function writeToFile({ filePath, content }) {
  let dirName = path.dirname(path.resolve(filePath));
  mkdirp.sync(dirName);
  fs.writeFileSync(filePath, content);
}

function normalizeFileName(fileName = '') {
  return fileName.replace(/_/g, '-');
}

function getAllFileNames(ast) {
  let allFiles = [];

  ast.find(j.CallExpression, {
    callee: {
      type: 'Identifier',
      name: 'define',
    },
  }).forEach((nodePath) => {
    let fileNamePath = nodePath.getValueProperty('arguments')[0];
    let fileName = fileNamePath.value;

    allFiles.push({
      originalPath: fileName,
      normalizedPath: normalizeFileName(fileName)
    });
  });

  return allFiles;
}

function getIntersectionByFileName(args) {
  return args.reduce((arr1, arr2) => {
    return arr1.filter(i => {
      let { originalPath } = i;

      return arr2.find((j) => j.originalPath === originalPath);
    });
  });
}

module.exports = {
  isRoute,
  isController,
  isTemplate,
  isComponentJS,
  isFileExists,
  writeToFile,
  constructImportDeclaration,
  getAllFileNames,
  constructIIFE,
  getIntersectionByFileName
}
