import { KEYWORDS, Token } from "./token.ts";
import { isAlpha, isDigit } from "./utils.ts";

export class Lexer {
  #text: string;
  #pos: number = 0;
  #currentChar: string | null;

  constructor(src: string) {
    this.#text = src;
    this.#pos = 0;
    this.#currentChar = this.#text[this.#pos];
  }

  advance(): void {
    this.#pos += 1;
    if (this.#pos >= this.#text.length) {
      this.#currentChar = null;
    } else {
      this.#currentChar = this.#text[this.#pos];
    }
  }

  peek(): string | null {
    const peekPos = this.#pos + 1;
    if (peekPos >= this.#text.length) {
      return null;
    }
    return this.#text[peekPos];
  }

  error() {
    const message = `LEXER Error: Unidentified character ${this.#currentChar}`;
    throw new Error(message);
  }

  skipWhitespace() {
    while (
      this.#currentChar !== null &&
      (this.#currentChar === " " || this.#currentChar === "\n")
    ) {
      this.advance();
    }
  }

  handleNumber(): string {
    let numberString = "";
    while (this.#currentChar !== null && isDigit(this.#currentChar)) {
      numberString += this.#currentChar;
      this.advance();
    }
    if (this.#currentChar !== null && isAlpha(this.#currentChar)) {
      const message = `LEXER Error: letter in number token at ${this.#pos}`;
      throw new Error(message);
    }

    return numberString;
  }

  handleString(): string {
    let str = '"';
    this.advance();
    while (this.#currentChar !== null && this.#currentChar !== '"') {
      str += this.#currentChar;
      this.advance();
    }
    str += '"';
    this.advance();

    return str;
  }

  handleIdentifier(): string {
    let identifier = "";
    while (
      this.#currentChar !== null &&
      (isAlpha(this.#currentChar) || isDigit(this.#currentChar))
    ) {
      identifier += this.#currentChar;
      this.advance();
    }

    return identifier;
  }

  getNextToken(): Token {
    while (this.#currentChar !== null) {
      const startPos = this.#pos;
      if (this.#currentChar === " ") {
        this.skipWhitespace();
      } else if (this.#currentChar === "\n") {
        this.advance();
      } else if (isDigit(this.#currentChar)) {
        return new Token("NUMBER", this.handleNumber(), startPos);
      } else if (this.#currentChar === '"') {
        return new Token("STRING", this.handleString(), startPos);
      } else if (isAlpha(this.#currentChar)) {
        const identifier = this.handleIdentifier();

        const keyword = KEYWORDS.get(identifier);
        if (keyword !== undefined) {
          keyword.start = startPos;
          keyword.end = startPos + keyword.value.length;
          return keyword;
        }

        return new Token("IDENTIFIER", identifier, startPos);
      } else if (this.#currentChar === ",") {
        this.advance();
        return new Token("COMMA", ",", startPos);
      } else if (this.#currentChar === "=") {
        this.advance();
        return new Token("EQUAL", "=", startPos);
      } else if (this.#currentChar === "*") {
        this.advance();
        return new Token("MULT", "*", startPos);
      } else if (this.#currentChar === "(") {
        this.advance();
        return new Token("L_PAREN", "(", startPos);
      } else if (this.#currentChar === ")") {
        this.advance();
        return new Token("R_PAREN", ")", startPos);
      } else if (this.#currentChar === ";") {
        this.advance();
        return new Token("SEMICOLON", ";", startPos);
      } else if (this.#currentChar === "<" && this.peek() === "=") {
        this.advance();
        this.advance();
        return new Token("LT_EQUAL", "<=", startPos);
      } else if (this.#currentChar === ">" && this.peek() === "=") {
        this.advance();
        this.advance();
        return new Token("GT_EQUAL", ">=", startPos);
      } else if (this.#currentChar === "!" && this.peek() === "=") {
        this.advance();
        this.advance();
        return new Token("NOT_EQUAL", "!=", startPos);
      } else if (this.#currentChar === ">") {
        this.advance();
        return new Token("GT", ">", startPos);
      } else if (this.#currentChar === "<") {
        this.advance();
        return new Token("LT", "<", startPos);
      } else {
        this.error();
      }
    }

    return new Token("EOF", "EOF", -1);
  }
}
