import antlr4 from 'antlr4';
import ExprLexer from './compiled_grammar/ExprLexer.js';
import ExprParser from './compiled_grammar/ExprParser.js';

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

const input = `
function abc():
    a, b = c, d;
    return a + b - c * d;

abc(3, 5, hi);
`
const parser = initParser(input);
parser.program();

function initParser(inputStr) {
    const chars = new antlr4.InputStream(inputStr);
    const lexer = new ExprLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new ExprParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(new ErrorListener());
    return parser;
}