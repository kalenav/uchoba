import ExprLexer from "../lab3/compiled_grammar/ExprLexer.js";;
import ExprParserListener from "../lab3/compiled_grammar/ExprParserListener.js";

class Scope {
    definedVariables = [];
    subscopes = [];
    superscopes = [];

    constructor(params = {}) {
        if (params.parentScope) {
            this.superscopes = [
                params.parentScope,
                ...params.parentScope.superscopes
            ];
            this.superscopes.forEach(superscope => superscope.addSubscope(this));
        }
    }

    hasVariableDefinition(name) {
        return !!this.definedVariables.find(variable => variable.getName() === name)
            || this.superscopes.some(superscope => superscope.hasVariableDefinition(name));
    }

    addVariable(name) {
        this.definedVariables.push(new VariableDefinition(name));
    }

    addSubscope(scope) {
        this.subscopes.push(scope);
    }

    getParentScope() {
        return this.superscopes[0];
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
            this.addError(`Compound assignment operator misuse: LHS contains ${ids.length} argument(s) while RHS contains ${exprs.length} argument(s)`);
            return;
        }

        this.checkAllAssignedValues(ctx);
        this.checkAllFunctionCalls(ctx);

        this.addVariablesToCurrScope(ids);
    }

    enterStatement(ctx) {
        if (ctx.parentCtx.constructor.name === "FunctionContext") {
            this.addVariablesToCurrScope(this.getFunctionArgs(ctx.parentCtx));
        }
    }

    enterFunction(ctx) {
        this.createNewScopeAndSetAsCurr();
    }

    exitFunction(ctx) {
        const functionName = this.getFunctionName(ctx);

        this.definedFunctions.push(new FunctionDefinition(
            functionName,
            this.getFunctionArgs(ctx).length
        ));

        this.currScope = this.currScope.getParentScope();
    }

    enterCycle(ctx) {
        this.createNewScopeAndSetAsCurr();
    }

    exitCycle(ctx) {
        const iteratedObjectName = ctx.ID()[0].getText();
        if (!this.variableAlreadyDefined(iteratedObjectName)) {
            this.addError(`${iteratedObjectName} is not defined`);
            return;
        }

        this.currScope = this.currScope.getParentScope();
    }

    variableAlreadyDefined(name) {
        return this.currScope.hasVariableDefinition(name);
    }

    checkAllAssignedValues(ctx) {
        ctx.expr()
            .map(expr => expr.operand()?.ID())
            .filter(variable => !!variable)
            .every(variable => {
                const variableName = variable.getText();
                if (!this.variableAlreadyDefined(variableName)) {
                    this.addError(`${variableName} is not defined in the current scope or any of its superscopes`);
                    return false;
                }
                return true;
            })
    }

    addVariablesToCurrScope(variables) {
        variables.forEach(variable => {
            const variableName = variable.getText();
            if (!this.currScope.hasVariableDefinition(variableName)) {
                this.currScope.addVariable(variableName);
            }
        });
    }

    getFunctionName(ctx) {
        return ctx.ID().getText();
    }

    getFunctionArgs(ctx) {
        const lparenIndex = ctx.LPAREN().symbol.tokenIndex;
        const rparenIndex = ctx.RPAREN().symbol.tokenIndex;
        return ctx.expr().filter(expr => expr.start.tokenIndex > lparenIndex && expr.stop.tokenIndex < rparenIndex);
    }

    functionAlreadyDefined(name) {
        return !!this._predefinedFunctionNames.find(predefinedFunctionName => predefinedFunctionName === name)
            || !!this.definedFunctions.find(definedFunction => definedFunction.getName() === name);
    }

    checkAllFunctionCalls(ctx) {
        ctx.expr()
            .map(expr => expr.call())
            .filter(call => !!call)
            .every(functionCall => {
                const functionName = this.getFunctionName(functionCall);
                if (!this.functionAlreadyDefined(functionName)) {
                    this.addError(`Function ${functionName} is not defined`);
                    return false;
                }
                return true;
            });
    }

    createNewScopeAndSetAsCurr() {
        this.currScope = new Scope({ parentScope: this.currScope });
    }

    areSemanticsCorrect() {
        return this.errors.length === 0;
    }

    addError(error) {
        this.errors.push(error);
    }

    getErrors() {
        return [...this.errors];
    }
}