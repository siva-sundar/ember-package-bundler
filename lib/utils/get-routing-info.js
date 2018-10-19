const j = require('jscodeshift');
const { getRouteExpressionStatementMatcher, getRouteCallStatementMatcher, getRouterMapStatementMatcher } = require('./ast-matcher');

const routerExpressionStatementMatcher = getRouteExpressionStatementMatcher();
const routeCallStatementMatcher = getRouteCallStatementMatcher();
const routerMapStatementMatcher = getRouterMapStatementMatcher()

const getExpressionsFromRouterMap =  function(nodePath) {
  let blockStatement  = j(nodePath).find(j.BlockStatement).paths()[0];

  if (blockStatement) {
    return blockStatement.getValueProperty('body');
  }
}

const iterateBlock = function(blockStatements) {
  let routes = [];
  blockStatements.forEach((blockNode) => {
    if (j.match(blockNode, routerExpressionStatementMatcher)) { // match this.route('some-route-nmae');
      let routeName;
      let [routeDefinitionNodePath] = j(blockNode).find(j.CallExpression, routeCallStatementMatcher).paths();
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

module.exports = function getRoutingInfo(ast) {
  let routeHash = [];
  let routerMapNodePaths = ast.find(j.CallExpression, routerMapStatementMatcher); // Router.map(function() { .... });

  routerMapNodePaths.paths().forEach((nodePath) => {
    let routeExpressionStatements = getExpressionsFromRouterMap(nodePath) // this.route('contact');
    routeHash.push(...iterateBlock(routeExpressionStatements));
  });

  return routeHash;
}
