/* eslint-env node */
module.exports = {
  getDefinePropertyMatcher() {
    return {
      "expression": {
        "callee": {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier",
            "name": "Object",
          },
          "property": {
            "type": "Identifier",
            "name": "defineProperty",
          },
        },
        "arguments": [{
            "type": "Identifier",
            "name": "exports",
          },
          {
            "type": "Literal",
            "value": "__esModule",
          },
          {
            "type": "ObjectExpression",
            "properties": [{
              "type": "Property",
              "key": {
                "type": "Identifier",
                "name": "value",
              },
              "computed": false,
              "value": {
                "type": "Literal",
                "value": true,
              },
              "kind": "init",
              "method": false,
            }],
          }
        ]
      }
    }
  },

  getDefaultExportMatcher(name) {
    return {
      "callee": {
        "type": "SequenceExpression",
        "expressions": [{
          "type": "Literal",
          "value": 0
        }, {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier",
            "name": name
          },
          "property": {
            "type": "Identifier",
            "name": "default"
          },
          "computed": false
        }]
      }
    }
  },

  getTemplateNameMather() {
    return {
      "method": false,
      "shorthand": false,
      "computed": false,
      "key": {
        "type": "Identifier",
        "name": "templateName"
      },
      "kind": "init"
    };
  },

  getControllerNameMather() {
    return {
      "method": false,
      "shorthand": false,
      "computed": false,
      "key": {
        "type": "Identifier",
        "name": "controllerName"
      },
      "kind": "init"
    };
  },

  getInjectControllerMathcer() {
    return {
      "method": false,
      "shorthand": false,
      "computed": false,
      "value": {
        "type": "CallExpression",
        "callee": {
          "type": "Identifier",
          "name": "controller"
        },
      },
      "kind": "init"
    };
  },

  getShowModalMatcher() {
    return {
      "callee": {
        "type": "MemberExpression",
      },
      "arguments": [{
        "type": "Literal",
        "value": "show-modal"
      }]
    };
  },

  getControllerForMatcher() {
    return {
      "callee": {
        "type": "MemberExpression",
        "property": {
          "type": "Identifier",
          "name": "controllerFor"
        },
        "computed": false
      }
    };
  },

  getRenderMatcher() {
    return {
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "ThisExpression"
        },
        "property": {
          "type": "Identifier",
          "name": "render"
        },
        "computed": false
      }
    };
  },

  getLayoutNameMatcher() {
    return {
      "type": "Property",
      "method": false,
      "shorthand": false,
      "computed": false,
      "key": {
        "type": "Identifier",
        "name": "layoutName"
      },
      "kind": "init"
    }
  },

  getDefaultIdentifierMatcher(identifierName) {
    return {
      "type": "MemberExpression",
      "object": {
        "type": "Identifier",
        "name": identifierName
      },
      "property": {
        "type": "Identifier",
        "name": "default"
      },
      "computed": false
    }
  },

  getTemplateStringMatcher() {
    return {
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "MemberExpression",
          "object": {
            "type": "Identifier"
          },
          "property": {
            "type": "Identifier",
            "name": "HTMLBars"
          },
          "computed": false
        },
        "property": {
          "type": "Identifier",
          "name": "template"
        },
        "computed": false
      },
      "arguments": [{
        "type": "ObjectExpression",
        "properties": [{
          "type": "Property",
          "method": false,
          "shorthand": false,
          "computed": false,
          "key": {
            "type": "Literal",
            "value": "id"
          },
          "kind": "init"
        }, {
          "type": "Property",
          "method": false,
          "shorthand": false,
          "computed": false,
          "key": {
            "type": "Literal",
            "value": "block"
          },
          "kind": "init"
        }, {
          "type": "Property",
          "method": false,
          "shorthand": false,
          "computed": false,
          "key": {
            "type": "Literal",
            "value": "meta"
          },
          "value": {
            "type": "ObjectExpression",
            "properties": [{
              "type": "Property",
              "method": false,
              "shorthand": false,
              "computed": false,
              "key": {
                "type": "Literal",
                "value": "moduleName"
              },
              "kind": "init"
            }]
          },
          "kind": "init"
        }]
      }]
    }
  },

  getDefineStatementMatcher() {
    return {
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'define'
        }
      }
    };
  },

  getUseStrictStatementMatcher() {
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "Literal",
        "value": "use strict"
      }
    };
  },

  getRouteExpressionStatementMatcher() {
    return {
      type: 'ExpressionStatement',
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "MemberExpression",
          "object": {
            "type": "ThisExpression"
          },
          "property": {
            "type": "Identifier",
            "name": "route"
          },
          "computed": false
        }
      }
    };
  },

  getRouteCallStatementMatcher() {
    return {
      "callee": {
        "type": "MemberExpression",
        "object": {
          "type": "ThisExpression"
        },
        "property": {
          "type": "Identifier",
          "name": "route"
        }
      }
    }
  },

  getRouterMapStatementMatcher() {
    return {
      callee: {
        "type": "MemberExpression",
        "object": {
          "type": "Identifier"
        },
        "property": {
          "type": "Identifier",
          "name": "map"
        },
        "computed": false
      }
    };
  }


}
