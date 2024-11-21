import { Lexer } from "./lexer.ts";
import { Parser } from "./parser.ts";

const src = `
SELECT 
  productId, 
  productType AS type, 
  sellerName AS seller 
FROM connections 
WHERE 
  saleCount > 1000 AND (totalViews > 10000 OR reviewCount > 100)
;
`;

const lexer = new Lexer(src);
//printTokens(lexer);

const parser = new Parser(lexer);
const ast = parser.parse();

if(!ast){
  console.log("Error generating ast");
  Deno.exit();
}

console.dir(ast, { depth: null });
console.log(ast.toString());

function printTokens(lexer: Lexer){
  let currToken = lexer.getNextToken();
  while(currToken.tokenType !== "EOF"){
    console.log(currToken.toString());
    currToken = lexer.getNextToken();
  }
}
