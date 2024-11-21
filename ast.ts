import { Token } from "./token.ts";

export interface AST {
  token: Token;
  toString: () => string;
}

export class SelectStatementNode implements AST {
  name: string;
  token: Token;
  tableName: IdentifierNode;
  cols: Array<ColNode>;
  conditionExpression: object | undefined;

  constructor({
    token,
    name,
    cols,
    tableName,
    conditionExpression,
  }: {
    token: Token;
    name: string;
    cols: Array<ColNode>;
    tableName: IdentifierNode;
    conditionExpression: object | undefined;
  }) {
    this.token = token;
    this.name = name;
    this.cols = cols;
    this.tableName = tableName;
    this.conditionExpression = conditionExpression;
  }

  toString() {
    let stringRepr = "SELECT";
    this.cols.forEach((col, i) => {
      stringRepr += ` ${col.toString()}`;
      if (i != this.cols.length - 1) {
        stringRepr += ",";
      }
    });
    stringRepr += ` FROM ${this.tableName.toString()}`;
    if (this.conditionExpression) {
      stringRepr += " WHERE ";
      stringRepr += this.conditionExpression.toString();
    }
    return stringRepr;
  }
}

export class ColNode implements AST {
  token: Token;
  alternate: IdentifierNode | undefined;
  colName: IdentifierNode;

  constructor({ token, colName, alternate }: {
    token: Token;
    colName: IdentifierNode;
    alternate?: IdentifierNode;
  }) {
    this.token = token;
    this.colName = colName;
    this.alternate = alternate;
  }

  toString() {
    let str = this.colName.toString();
    if (this.alternate) {
      str += ` AS ${this.alternate.toString()}`;
    }
    return str;
  }
}

export class IdentifierNode implements AST {
  value: string;
  token: Token;

  constructor({
    token,
  }: {
    token: Token;
  }) {
    this.token = token;
    this.value = this.token.value;
  }

  toString() {
    return this.value;
  }
}

export class NumberNode implements AST {
  value: string;
  token: Token;

  constructor({
    token,
  }: {
    token: Token;
  }) {
    this.token = token;
    this.value = this.token.value;
  }

  toString() {
    return this.value;
  }
}

export class StringNode implements AST {
  value: string;
  token: Token;

  constructor({
    token,
  }: {
    token: Token;
  }) {
    this.token = token;
    this.value = this.token.value.slice(1, this.token.value.length - 1);
  }

  toString() {
    return `"${this.value}"`;
  }
}

export class ConditionNode implements AST {
  left: object;
  right: object;
  token: Token;

  constructor({
    left,
    right,
    token,
  }: { left: object; right: object; token: Token }) {
    this.right = right;
    this.left = left;
    this.token = token;
  }

  toString() {
    const leftString = this.left.toString();
    const rightString = this.right.toString();

    return `${leftString} ${this.token.value} ${rightString}`;
  }
}

export class CompareNode implements AST {
  left: object;
  right: object;
  token: Token;

  constructor({
    left,
    right,
    token,
  }: { left: object; right: object; token: Token }) {
    this.right = right;
    this.left = left;
    this.token = token;
  }

  toString() {
    const leftString = this.left.toString();
    const rightString = this.right.toString();

    return `${leftString} ${this.token.value} ${rightString}`;
  }
}

export class OperandNode implements AST {
  token: Token;
  operand: object;

  constructor({ token, operand }: { token: Token; operand: object }) {
    this.token = token;
    this.operand = operand;
  }

  toString() {
    return this.operand.toString();
  }
}
