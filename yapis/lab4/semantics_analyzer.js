import ExprParserListener from "../lab3/compiled_grammar/ExprParserListener.js";

const typeIDToStringMap = {
    '1': 'char',
    '2': 'string',
    '3': 'strarray',
    '4': 'int'
}

const TYPES = {
    [typeIDToStringMap[1]]: 1,
    [typeIDToStringMap[2]]: 2,
    [typeIDToStringMap[3]]: 3,
    [typeIDToStringMap[4]]: 4,
}

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

    addVariable(name, value) {
        this.definedVariables.push(new VariableDefinition(name, value));
    }

    updateVariable(name, newType) {
        this.definedVariables.find(variable => variable.getName() === name).setType(newType);
    }

    addSubscope(scope) {
        this.subscopes.push(scope);
    }

    getParentScope() {
        return this.superscopes[0];
    }
}

class VariableDefinition {
    _type = "undefined";
    constructor(name, type) {
        this._name = name;
        this.setType(type);
    }

    getName() {
        return this._name;
    }

    setType(type) {
        this._type = typeIDToStringMap[type] || 'undefined';
    }

    getType() {
        return this._type;
    }
}

class FunctionDefinition {
    constructor(name, argc, returnedType) {
        this._name = name;
        this._argsQuantity = argc;
        this.returnedType = typeIDToStringMap[returnedType] || 'undefined';
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
    definedFunctions = [
        new FunctionDefinition('char', 1, TYPES.char),
        new FunctionDefinition('string', 1, TYPES.string),
        new FunctionDefinition('print', 1),
        new FunctionDefinition('substr', 2, TYPES.int),
        new FunctionDefinition('slice', 3, TYPES.string),
        new FunctionDefinition('split', 2, TYPES.strarray),
        new FunctionDefinition('replace', 3, TYPES.string),
        new FunctionDefinition('join', 2, TYPES.string),
    ];
    errors = [];

    constructor() {
        super();
    }

    exitCall(ctx) {
        const functionName = this.getFunctionName(ctx);
        if (!this.functionAlreadyDefined(functionName)) {
            this.addError(`Function '${functionName}' is not defined`, ctx);
        }

        this.checkAllExprVariables(ctx.expr(), ctx);
    }

    exitAssignment(ctx) {
        const ids = ctx.ID();
        const exprs = ctx.expr();
        if (ids.length !== exprs.length) {
            this.addError(
                `Compound assignment operator misuse: LHS contains ${ids.length} argument(s) while RHS contains ${exprs.length} argument(s)`,
                ctx
            );
            return;
        }

        this.addVariablesToCurrScope(ids);
        this.checkAllExprVariables(ctx.expr(), ctx);
    }

    enterStatement(ctx) {
        const parentCtx = ctx.parentCtx;
        if (parentCtx.constructor.name === "FunctionContext") {
            this.addVariablesToCurrScope(this.getFunctionArgs(parentCtx));
        }
        if (parentCtx.constructor.name === "CycleContext") {
            const cycleHeaderIDs = parentCtx.ID();
            this.checkIfVariableIsDefined(cycleHeaderIDs[0], parentCtx);
            this.addVariablesToCurrScope([cycleHeaderIDs[cycleHeaderIDs.length - 1]])
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

        this.checkAllExprVariables(ctx.expr(), ctx);
        this.exitScope();
    }

    enterCycle(ctx) {
        this.createNewScopeAndSetAsCurr();
    }

    exitCycle(ctx) {
        this.exitScope();
    }

    enterIf(ctx) {
        this.createNewScopeAndSetAsCurr();
    }

    exitIf(ctx) {
        this.exitScope();
    }

    exitCondition(ctx) {
        this.checkAllExprVariables(ctx.expr(), ctx);
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////

    variableAlreadyDefined(name) {
        return this.currScope.hasVariableDefinition(name);
    }

    addVariablesToCurrScope(variables) {
        variables.forEach(variable => {
            const variableName = variable.getText();
            if (!this.currScope.hasVariableDefinition(variableName)) {
                this.currScope.addVariable(variableName);
            }
        });
    }

    updateVariableTypesInCurrScope(variableObjArray) {
        variableObjArray.forEach(variableObj => this.currScope.updateVariable(variableObj.name, variableObj.newType));
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
        return !!this.definedFunctions.find(definedFunction => definedFunction.getName() === name);
    }

    createNewScopeAndSetAsCurr() {
        this.currScope = new Scope({ parentScope: this.currScope });
    }

    exitScope() {
        this.currScope = this.currScope.getParentScope();
    }
    
    exprIsVar(expr) {
        return !!expr.operand()?.ID();
    }

    checkIfVariableIsDefined(variable, ctx) {
        const variableName = variable.getText();
        if (!this.variableAlreadyDefined(variableName)) {
            this.addError(`Variable '${variableName}' is not defined in this scope or any of its superscopes`, ctx);
        }
    }

    checkAllVariables(variables, ctx) {
        variables.forEach(variable => this.checkIfVariableIsDefined(variable, ctx)); 
    }

    checkAllExprVariables(exprs, ctx) {
        this.checkAllVariables(exprs.filter(expr => this.exprIsVar(expr)), ctx);
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////

    areSemanticsCorrect() {
        return this.errors.length === 0;
    }

    addError(error, ctx) {
        this.errors.push({
            message: error,
            line: ctx.start.line,
            column: ctx.start.column
        });
    }

    getErrors() {
        return [...this.errors];
    }
}