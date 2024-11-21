A simple exercise SQL Parser. Basic SQL parsing and AST generation

Following is an example SQL with the generated AST

SQL

```sql
SELECT 
  productId, 
  productType AS type, 
  sellerName AS seller 
FROM connections 
WHERE 
  saleCount > 1000 AND (totalViews > 10000 OR reviewCount > 100)
;
```

AST

```javascript
SelectStatementNode {
  name: "SELECT",
  token: Token { tokenType: "SELECT", value: "SELECT", start: 1, end: 7 },
  tableName: IdentifierNode {
    value: "connections",
    token: Token {
      tokenType: "IDENTIFIER",
      value: "connections",
      start: 76,
      end: 87
    }
  },
  cols: [
    ColNode {
      token: Token {
        tokenType: "IDENTIFIER",
        value: "productId",
        start: 11,
        end: 20
      },
      alternate: undefined,
      colName: IdentifierNode {
        value: "productId",
        token: Token {
          tokenType: "IDENTIFIER",
          value: "productId",
          start: 11,
          end: 20
        }
      }
    },
    ColNode {
      token: Token {
        tokenType: "IDENTIFIER",
        value: "productType",
        start: 25,
        end: 36
      },
      alternate: IdentifierNode {
        value: "type",
        token: Token {
          tokenType: "IDENTIFIER",
          value: "type",
          start: 40,
          end: 44
        }
      },
      colName: IdentifierNode {
        value: "productType",
        token: Token {
          tokenType: "IDENTIFIER",
          value: "productType",
          start: 25,
          end: 36
        }
      }
    },
    ColNode {
      token: Token {
        tokenType: "IDENTIFIER",
        value: "sellerName",
        start: 49,
        end: 59
      },
      alternate: IdentifierNode {
        value: "seller",
        token: Token {
          tokenType: "IDENTIFIER",
          value: "seller",
          start: 63,
          end: 69
        }
      },
      colName: IdentifierNode {
        value: "sellerName",
        token: Token {
          tokenType: "IDENTIFIER",
          value: "sellerName",
          start: 49,
          end: 59
        }
      }
    }
  ],
  conditionExpression: ConditionNode {
    left: CompareNode {
      left: OperandNode {
        token: Token {
          tokenType: "IDENTIFIER",
          value: "saleCount",
          start: 98,
          end: 107
        },
        operand: IdentifierNode {
          value: "saleCount",
          token: Token {
            tokenType: "IDENTIFIER",
            value: "saleCount",
            start: 98,
            end: 107
          }
        }
      },
      right: OperandNode {
        token: Token {
          tokenType: "NUMBER",
          value: "1000",
          start: 110,
          end: 114
        },
        operand: NumberNode {
          value: "1000",
          token: Token {
            tokenType: "NUMBER",
            value: "1000",
            start: 110,
            end: 114
          }
        }
      },
      token: Token { tokenType: "GT", value: ">", start: 108, end: 109 }
    },
    right: ConditionNode {
      left: CompareNode {
        left: OperandNode {
          token: Token {
            tokenType: "IDENTIFIER",
            value: "totalViews",
            start: 120,
            end: 130
          },
          operand: IdentifierNode {
            value: "totalViews",
            token: Token {
              tokenType: "IDENTIFIER",
              value: "totalViews",
              start: 120,
              end: 130
            }
          }
        },
        right: OperandNode {
          token: Token {
            tokenType: "NUMBER",
            value: "10000",
            start: 133,
            end: 138
          },
          operand: NumberNode {
            value: "10000",
            token: Token {
              tokenType: "NUMBER",
              value: "10000",
              start: 133,
              end: 138
            }
          }
        },
        token: Token { tokenType: "GT", value: ">", start: 131, end: 132 }
      },
      right: CompareNode {
        left: OperandNode {
          token: Token {
            tokenType: "IDENTIFIER",
            value: "reviewCount",
            start: 142,
            end: 153
          },
          operand: IdentifierNode {
            value: "reviewCount",
            token: Token {
              tokenType: "IDENTIFIER",
              value: "reviewCount",
              start: 142,
              end: 153
            }
          }
        },
        right: OperandNode {
          token: Token {
            tokenType: "NUMBER",
            value: "100",
            start: 156,
            end: 159
          },
          operand: NumberNode {
            value: "100",
            token: Token {
              tokenType: "NUMBER",
              value: "100",
              start: 156,
              end: 159
            }
          }
        },
        token: Token { tokenType: "GT", value: ">", start: 154, end: 155 }
      },
      token: Token { tokenType: "OR", value: "OR", start: 139, end: 141 }
    },
    token: Token { tokenType: "AND", value: "AND", start: 115, end: 118 }
  }
}
```

AST to code:
```javascript

const lexer = new Lexer(src);
const parser = new Parser(lexer);
const ast = parser.parse();

const code = ast.toString();
// SELECT productId, productType AS type, sellerName AS seller FROM connections WHERE saleCount > 1000 AND totalViews > 10000 OR reviewCount > 100

```

