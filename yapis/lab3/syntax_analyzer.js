import antlr4 from 'antlr4';
import ExprLexer from './compiled_grammar/ExprLexer.js';
import ExprParser from './compiled_grammar/ExprParser.js';

class ErrorListener extends antlr4.error.ErrorListener {
    syntaxError(recognizer, offendingSymbol, line, column, message, e) {
        let errorStr = `Error while parsing ${recognizer.ruleNames[recognizer._ctx.ruleIndex]}`;
        console.error(errorStr);
    }
}

const input = "function abc(): return 'a';"
const chars = new antlr4.InputStream(input);
const lexer = new ExprLexer(chars);
const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new ExprParser(tokens);
parser.buildParseTrees = true;
parser.removeErrorListeners();
parser.addErrorListener(new ErrorListener());
parser.program();