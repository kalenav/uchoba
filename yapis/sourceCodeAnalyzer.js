import antlr4 from 'antlr4';
import fs from 'fs';
import ExprLexer from './lab3/compiled_grammar/ExprLexer.js';
import ExprParser from './lab3/compiled_grammar/ExprParser.js';
import { ErrorListener } from './lab3/syntax_analyzer.js';
import { TreeListener } from './lab4/semantics_analyzer.js';

function getFileContents(filename) {
    return fs.readFileSync(filename, 'utf-8');
}

export function initParser(filename) {
    const inputStr = getFileContents(filename);
    const chars = new antlr4.InputStream(inputStr);
    const lexer = new ExprLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ExprParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    return parser;
}

export function analyzeSyntaxAndSemantics(parser) {
    const syntaxAnalyzer = new ErrorListener();
    const semanticsAnalyzer = new TreeListener();

    parser.addErrorListener(syntaxAnalyzer);

    const tree = parser.program();
    if (!syntaxAnalyzer.isSyntaxCorrect()) {
        console.log(syntaxAnalyzer.getError());
        return false;
    }

    antlr4.tree.ParseTreeWalker.DEFAULT.walk(semanticsAnalyzer, tree);
    if (!semanticsAnalyzer.areSemanticsCorrect()) {
        console.log(semanticsAnalyzer.getErrors().map(error => {
            return `   Semantics Error\n   ${error.message}\n   At line ${error.line}, column ${error.column}`
        }).join('\n=====================\n'));
        return false;
    }

    return tree;
}

function tests() {
    [
        './lab1/example1.said',
        './lab1/example2.said',
        './lab1/example3.said',
        './test_code_examples/syntax_analyzer_tests/1.said',
        './test_code_examples/syntax_analyzer_tests/2.said',
        './test_code_examples/syntax_analyzer_tests/3.said',
        './test_code_examples/syntax_analyzer_tests/4.said',
        './test_code_examples/semantic_analyzer_tests/1.said',
        './test_code_examples/semantic_analyzer_tests/2.said',
        './test_code_examples/semantic_analyzer_tests/3.said',
        './test_code_examples/semantic_analyzer_tests/4.said',
        './test_code_examples/semantic_analyzer_tests/5.said',
        './test_code_examples/semantic_analyzer_tests/6.said',
        './test_code_examples/semantic_analyzer_tests/7.said',
        './test_code_examples/semantic_analyzer_tests/8.said',
        './test_code_examples/semantic_analyzer_tests/9.said',
        './test_code_examples/semantic_analyzer_tests/10.said',
        './test_code_examples/semantic_analyzer_tests/11.said',
        './test_code_examples/semantic_analyzer_tests/12.said',
        './test_code_examples/semantic_analyzer_tests/13.said',
        './test_code_examples/semantic_analyzer_tests/14.said',
        './test_code_examples/semantic_analyzer_tests/15.said'
    ].forEach(filename => {
        console.log(`-----------------------------------------------Analyzing ${filename}`)
        const parser = initParser(filename);
        analyzeSyntaxAndSemantics(parser);
    });
}

tests();