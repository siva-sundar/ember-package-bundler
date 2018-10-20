const isFileResolvedAlready = function({ dependents, fileName }) {
  return dependents.find((fileInfo) => fileInfo.originalPath === fileName);
}

function getDepedents({ imports, dependents, util }) {
  imports.forEach((fileName) => {
    let fileInfo = util.findFile(fileName);

    if (!isFileResolvedAlready({ dependents, fileName })) {
      dependents.push(fileInfo);
      getDepedents({ imports: fileInfo.imports, dependents, util });
    }

  });
  return dependents;
}

module.exports = function resolveDepedents({ bundle,  util }) {
  let dependents = [];
  let { entryFiles } = bundle;
  entryFiles.forEach((fileName) => {
    let fileInfo = util.findFile(fileName);

    dependents.push(fileInfo);
    getDepedents({ imports: fileInfo.imports, dependents, util });
  });
  return dependents;
}
