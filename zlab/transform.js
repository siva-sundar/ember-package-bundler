const j = require('jscodeshift');
const { get}

const getExpressionsFromRouterMap =  function(nodePath) {
  let blockStatement  = j(nodePath).find(j.BlockStatement).paths()[0];

  if (blockStatement) {
    return blockStatement.getValueProperty('body');
  }
}

let blocks = [];

i.forEach((routeMapNodePath) => {
  blocks.push(getExpressionsFromRouterMap(routeMapNodePath));
});


const iterateBlock = function(blockStatements) {
  let routes = [];
  blockStatements.forEach((blockNode) => {
    if (j.match(blockNode, routeDefinition)) { // match this.route('some-route-nmae');
      let routeName;
      let [routeDefinitionNodePath] = j(blockNode).find(j.CallExpression, routeCallStatement).paths();
      let args = routeDefinitionNodePath.getValueProperty('arguments');
      let [routeNamePath] = args;

      routeName = routeNamePath.value;
      routes.push(routeName);

      if (args.length > 1) {
        let childRoutesBlock = getExpressionsFromRouterMap(args);

        if (childRoutesBlock) {
          let childRoutes = iterateBlock(childRoutesBlock) || [];

          childRoutes = childRoutes.map((row) => {
            return `${routeName}.${row}`;
          });
          routes = routes.concat(...childRoutes);
        }
      }
    } else { // other statements like if (specificEdition) {.....}
      let childRoutesBlock = getExpressionsFromRouterMap(blockNode);
      if (childRoutesBlock) {
        let childRoutes = iterateBlock(childRoutesBlock);
        routes = routes.concat(...childRoutes);
      }
    }
  });
  return routes;
}
let routeHash = [];
i.paths().forEach((nodePath) => {
  routeHash.push(...iterateBlock(getExpressionsFromRouterMap(nodePath)));
});

console.log(routeHash);
