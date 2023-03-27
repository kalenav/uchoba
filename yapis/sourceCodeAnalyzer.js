import antlr4 from 'antlr4';
import fs from 'fs';
import ExprLexer from './lab3/compiled_grammar/ExprLexer.js';
import ExprParser from './lab3/compiled_grammar/ExprParser.js';
import { ErrorListener } from './lab3/syntax_analyzer.js';
import { TreeListener } from './lab4/semantics_analyzer.js';

function initParser(filename) {
    const inputStr = fs.readFileSync(filename, 'utf-8');
    const chars = new antlr4.InputStream(inputStr);
    const lexer = new ExprLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ExprParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    return parser;
}

function analyzeSyntaxAndSemantics(filename) {
    const syntaxAnalyzer = new ErrorListener();
    const semanticsAnalyzer = new TreeListener();

    const parser = initParser(filename);
    parser.addErrorListener(syntaxAnalyzer);

    console.log(`----------------------------------------------------------------------------------------------\nAnalyzing file: ${filename}`)

    const tree = parser.program();
    if (!syntaxAnalyzer.isSyntaxCorrect()) {
        console.log(syntaxAnalyzer.getError());
        return;
    }

    antlr4.tree.ParseTreeWalker.DEFAULT.walk(semanticsAnalyzer, tree);
    if (!semanticsAnalyzer.areSemanticsCorrect()) {
        console.log(semanticsAnalyzer.getErrors().map(error => {
            return `Semantics Error\n${error.message}\nAt line ${error.line}, column ${error.column}`
        }).join('\n=====================\n'));
        return;
    }

    console.log('ready to compile');
}

function tests() {
    [
        './lab1/example1.said',
        './lab1/example2.said',
        './lab1/example3.said',
        './test_code_examples/semantic_analyzer_tests/1.said',
        './test_code_examples/semantic_analyzer_tests/2.said',
        './test_code_examples/semantic_analyzer_tests/3.said',
        './test_code_examples/semantic_analyzer_tests/4.said',
        './test_code_examples/semantic_analyzer_tests/5.said',
    ].forEach(filename => analyzeSyntaxAndSemantics(filename));
}

tests();