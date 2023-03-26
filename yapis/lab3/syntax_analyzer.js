import antlr4 from 'antlr4';

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

export class ErrorListener extends antlr4.error.ErrorListener {
    _error = "";
    syntaxError(recognizer, offendingSymbol, line, column, message, e) {
        this.error = `
    Syntax Error
    While parsing ${ruleNameMap[recognizer.ruleNames[recognizer._ctx.ruleIndex]]}
    unexpected token: '${offendingSymbol.text}' at line ${line}, column ${column}
    Please verify syntax
    `;
    }

    isSyntaxCorrect() {
        return this._error.length === 0;
    }

    getError() {
        return this._error;
    }
};