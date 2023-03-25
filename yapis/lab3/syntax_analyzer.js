import antlr4 from 'antlr4';
import ExprLexer from './compiled_grammar/ExprLexer.js';
import ExprParser from './compiled_grammar/ExprParser.js';

const input = "your text to parse here"
const chars = new antlr4.InputStream(input);
const lexer = new ExprLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ExprParser(tokens);
parser.buildParseTrees = true;
const tree = parser.program();
console.log(tree);