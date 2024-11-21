import { Lexer } from "./lexer.ts";
import { Token } from "./token.ts";
import {
  ColNode,
  CompareNode,
  ConditionNode,
  IdentifierNode,
  NumberNode,
  OperandNode,
  SelectStatementNode,
  StringNode,
} from "./ast.ts";
import type { TokenType } from "./token.ts";

export class Parser {
  #lexer: Lexer;
  #currentToken: Token;

  constructor(lexer: Lexer) {
    this.#lexer = lexer;
    this.#currentToken = this.#lexer.getNextToken();
  }

  error(message: string) {
    console.log(message);
    throw new Error(message);
  }

  eat(tokenType: TokenType) {
    if (this.#currentToken.tokenType === tokenType) {
      this.#currentToken = this.#lexer.getNextToken();
    } else {
      const message =
        `PARSER ERROR: Invalid Syntax: Expected TokenType: ${tokenType} received ${this.#currentToken.tokenType}`;
      this.error(message);
    }
  }

  identifier(): IdentifierNode {
    const token = this.#currentToken;
    this.eat("IDENTIFIER");

    return new IdentifierNode({ token });
  }

  operand() {
    const token = this.#currentToken;
    switch (token.tokenType) {
      case "NUMBER":
        this.eat("NUMBER");

        return new OperandNode({
          token: token,
          operand: new NumberNode({ token }),
        });
      case "IDENTIFIER":
        this.eat("IDENTIFIER");

        return new OperandNode({
          token: token,
          operand: new IdentifierNode({ token }),
        });
      case "STRING":
        this.eat("STRING");

        return new OperandNode({
          token: token,
          operand: new StringNode({ token }),
        });
      default:
        this.error("PARSER ERROR:Unrecognized operand");
    }
  }

  colAlias(): IdentifierNode {
    return this.identifier();
  }

  colSelect(): ColNode {
    const token = this.#currentToken;
    const col = this.identifier();
    let alternate = undefined;
    if (this.#currentToken.tokenType === "AS") {
      this.eat("AS");
      alternate = this.colAlias();
    }

    return new ColNode({
      token,
      alternate,
      colName: col,
    });
  }

  selectExpression(): Array<ColNode> {
    const cols: Array<ColNode> = [];
    const token = this.#currentToken;

    if (token.tokenType === "MULT") {
      cols.push(
        new ColNode({
          token: this.#currentToken,
          colName: new IdentifierNode({ token: this.#currentToken }),
        }),
      );
      this.eat("MULT");
      return cols;
    } else {
      cols.push(this.colSelect());
      while (this.#currentToken.tokenType === "COMMA") {
        this.eat("COMMA");
        cols.push(this.colSelect());
      }
      return cols;
    }
  }

  compare() {
    const token = this.#currentToken;
    switch (token.tokenType) {
      case "GT_EQUAL":
        this.eat("GT_EQUAL");
        return token;
      case "LT_EQUAL":
        this.eat("LT_EQUAL");
        return token;
      case "NOT_EQUAL":
        this.eat("NOT_EQUAL");
        return token;
      case "GT":
        this.eat("GT");
        return token;
      case "LT":
        this.eat("LT");
        return token;
      case "EQUAL":
        this.eat("EQUAL");
        return token;
      default:
        this.error(
          `conditional operator not found: ${this.#currentToken.toString()}`,
        );
    }
  }

  condition(): object {
    const token = this.#currentToken;
    if (["IDENTIFIER", "NUMBER", "STRING"].includes(token.tokenType)) {
      const left = this.operand();
      const token = this.compare();
      const right = this.operand();
      return new CompareNode({
        left,
        right,
        token,
      });
    } else if (token.tokenType === "L_PAREN") {
      this.eat("L_PAREN");
      const node = this.expression();
      this.eat("R_PAREN");
      return node;
    } else if (token.tokenType === "NOT") {
      this.eat("NOT");
      return this.expression();
    }
    this.error(`PARSER ERROR: unrecognized condition`);
  }

  andCondition() {
    let node = this.condition();

    const token = this.#currentToken;
    while (this.#currentToken.tokenType === "AND") {
      this.eat("AND");
      node = new ConditionNode({
        token,
        left: node,
        right: this.condition(),
      });
    }
    return node;
  }

  expression() {
    let node = this.andCondition();

    const token = this.#currentToken;
    while (this.#currentToken.tokenType === "OR") {
      this.eat("OR");
      node = new ConditionNode({
        token,
        left: node,
        right: this.andCondition(),
      });
    }

    return node;
  }

  statement(): SelectStatementNode | undefined {
    const token = this.#currentToken;
    let conditionExpression = undefined;
    if (token.tokenType === "SELECT") {
      this.eat("SELECT");
      const cols = this.selectExpression();
      this.eat("FROM");
      const tableName = this.identifier();

      // if conditions are present -> parse conditions
      if (this.#currentToken.tokenType === "WHERE") {
        this.eat("WHERE");
        conditionExpression = this.expression();
      }

      this.eat("SEMICOLON");

      return new SelectStatementNode({
        token,
        cols,
        tableName,
        conditionExpression,
        name: "SELECT",
      });
    }

    this.error("PARSER ERROR: INVALID Statement");
  }

  parse() {
    return this.statement();
  }
}
