#!/usr/bin/env node

import antlr4 from 'antlr4';
import yargs from 'yargs';
import fs from 'fs';
import ExprLexer from './compiled_grammar/ExprLexer.js';
import ExprParser from './compiled_grammar/ExprParser.js';

const options = yargs
    .usage("Usage: -f <filename>")
    .option("f", { alias: "filename", describe: "path to file to analyze", type: "string", demandOption: true })
    .argv;

const ruleNameMap = {
    program: 'program',
    statement: 'statement',
    assignment: 'assignment',
    function: 'function declaration',
    call: 'function call',
    cycle: 'cycle structure',
    if: 'if structure',
    control: 'control',
    char: 'character constant',
    string: 'string constant',
    strarray: 'strarray constant',
    operand: 'number or variable name',
    condition: 'condition expression',
    expr: 'expression',
    comment: 'comment'
};

class ErrorListener extends antlr4.error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, message, e) {
        console.error(`
        SyntaxError
        While parsing ${ruleNameMap[recognizer.ruleNames[recognizer._ctx.ruleIndex]]}
        unexpected symbol: '${offendingSymbol.text}' at line ${line}, column ${column}
        Please verify syntax
        `)
    }
};

function initParser(filename) {
    const inputStr = fs.readFileSync(filename, 'utf-8');
    const chars = new antlr4.InputStream(inputStr);
    const lexer = new ExprLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ExprParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(new ErrorListener());
    return parser;
}

const parser = initParser(options.filename);
try {
    parser.program();
}
catch(err) {
    console.error(err);
}