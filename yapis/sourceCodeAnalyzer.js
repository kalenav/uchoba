import antlr4 from 'antlr4';
import fs from 'fs';
import ExprLexer from './lab3/compiled_grammar/ExprLexer.js';
import ExprParser from './lab3/compiled_grammar/ExprParser.js';
import { ErrorListener } from './lab3/syntax_analyzer.js';
import { TreeListener } from './lab4/semantics_analyzer.js';

const syntaxAnalyzer = new ErrorListener();
const semanticsAnalyzer = new TreeListener();

function initParser(filename) {
    const inputStr = fs.readFileSync(filename, 'utf-8');
    const chars = new antlr4.InputStream(inputStr);
    const lexer = new ExprLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ExprParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(syntaxAnalyzer);
    return parser;
}

function analyzeSyntaxAndSemantics(filename) {
    const parser = initParser(filename);
    const tree = parser.program();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(semanticsAnalyzer, tree);
}

analyzeSyntaxAndSemantics('./lab1/example3.said');

if (!syntaxAnalyzer.isSyntaxCorrect()) {
    console.log(syntaxAnalyzer.getError());
} else if (!semanticsAnalyzer.areSemanticsCorrect()) {
    console.log(semanticsAnalyzer.getErrors().map(error => {
        return `Semantics Error\n${error.message}\nAt line ${error.line}, column ${error.column}`
    }).join('\n=====================\n'));
} else {
    console.log('compile-ready!');
}