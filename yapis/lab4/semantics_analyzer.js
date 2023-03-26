import ExprLexer from "../lab3/compiled_grammar/ExprLexer.js";;
import ExprParserListener from "../lab3/compiled_grammar/ExprParserListener.js";

class Scope {
    definedVariables = [];
    subscopes = [];
    superscopes = [];
    definedBy = "";

    constructor(definedBy) {
        this.definedBy = definedBy;
    }

    hasVariableDefinition(name) {
        return !!this.definedVariables.find(variable => variable.getName() === name);
    }
}

class VariableDefinition {
    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }
}

class FunctionDefinition {
    constructor(name, argc) {
        this._name = name;
        this._argsQuantity = argc;
    }

    getName() {
        return this._name;
    }

    getArgsQuantity() {
        return this._argsQuantity;
    }
}

export class TreeListener extends ExprParserListener {
    mainScope = new Scope();
    currScope = this.mainScope;
    definedFunctions = [];
    errors = [];
    _semanticsAreCorrect = true;
    _predefinedFunctionNames = [
        'char',
    ];

    constructor() {
        super();
    }

    exitAssignment(ctx) {
        const ids = ctx.ID();
        const exprs = ctx.expr();

        if (ids.length !== exprs.length) {
            this.errors.push(`Compound assignment operator misuse: LHS contains ${ids.length} argument(s) while RHS contains ${exprs.length} argument(s)`);
            this._semanticsAreCorrect = false;
            return;
        }

        this.checkThatAllFunctionCallsAreDefined(ctx);
    }

    exitFunction(ctx) {
        const functionName = this.getFunctionName(ctx);

        if (this.functionAlreadyDefined(functionName)) {
            this.errors.push(`Duplicate function definition: ${functionName}`);
            this._semanticsAreCorrect = false;
            return;
        }

        const lparenIndex = ctx.LPAREN().symbol.tokenIndex;
        const rparenIndex = ctx.RPAREN().symbol.tokenIndex;
        this.definedFunctions.push(new FunctionDefinition(
            functionName,
            ctx.expr().filter(expr => expr.start.tokenIndex > lparenIndex && expr.stop.tokenIndex < rparenIndex).length
        ));
    }

    getFunctionName(ctx) {
        return ctx.ID().getText();
    }

    functionAlreadyDefined(name) {
        return !!this._predefinedFunctionNames.find(predefinedFunctionName => predefinedFunctionName === name)
            || !!this.definedFunctions.find(definedFunction => definedFunction._name === name);
    }

    checkThatAllFunctionCallsAreDefined(ctx) {
        ctx.expr()
            .map(expr => expr.call())
            .filter(call => !!call)
            .every(functionCall => {
                const functionName = this.getFunctionName(functionCall);
                if (!this.functionAlreadyDefined(functionName)) {
                    this.errors.push(`Function ${functionName} is not defined`);
                    this._semanticsAreCorrect = false;
                    return false;
                }
                return true;
            });
    }

    areSemanticsCorrect() {
        return this._semanticsAreCorrect;
    }

    getErrors() {
        return [...this.errors];
    }
}