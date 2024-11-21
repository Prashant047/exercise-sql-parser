export type TokenType = "SELECT" 
| "AND"
| "AS"
| "COMMA"
| "EOF"
| "EQUAL"
| "FROM"
| "GT"
| "GT_EQUAL"
| "IDENTIFIER"
| "L_PAREN"
| "LT"
| "LT_EQUAL"
| "MULT"
| "NOT"
| "NOT_EQUAL"
| "NUMBER"
| "OR"
| "R_PAREN"
| "SEMICOLON"
| "STRING"
| "WHERE"

class Token {

  tokenType: TokenType;
  value: string;
  start: number;
  end: number;

  constructor(tokenType: TokenType, value: string, startPos: number) {
    this.tokenType = tokenType;
    this.value = value;
    this.start = startPos
    this.end = this.start + this.value.length;
  }

  toString(): string {
    return `Token(${this.tokenType}, ${this.value})[${this.start},${this.end}]`;
  }
}

const KEYWORDS = new Map<string, Token>([
  ["AND", new Token("AND", "AND", 0)],
  ["AS", new Token("AS", "AS", 0)],
  ["FROM", new Token("FROM", "FROM", 0)],
  ["NOT", new Token("NOT", "NOT", 0)],
  ["OR", new Token("OR", "OR", 0)],
  ["SELECT", new Token("SELECT", "SELECT", 0)],
  ["WHERE", new Token("WHERE", "WHERE", 0)],
]);

export { Token, KEYWORDS }


