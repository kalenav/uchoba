import ExprParserListener from "../lab3/compiled_grammar/ExprParserListener.js";

const typeIDToStringMap = {
    '1': 'char',
    '2': 'string',
    '3': 'strarray',
    '4': 'int',
    '5': 'undefined',
    '6': 'any'
}

const TYPES = {
    [typeIDToStringMap[1]]: 1,
    [typeIDToStringMap[2]]: 2,
    [typeIDToStringMap[3]]: 3,
    [typeIDToStringMap[4]]: 4,
    [typeIDToStringMap[5]]: 5,
    [typeIDToStringMap[6]]: 6,
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

    findVariable(name) {
        return [this, ...this.superscopes]
            .map(scope => scope.definedVariables)
            .flat()
            .find(variable => variable.getName() === name);
    }

    hasVariableDefinition(name) {
        return !!this.findVariable(name)
            || this.superscopes.some(superscope => superscope.hasVariableDefinition(name));
    }

    addVariable(name, type) {
        this.definedVariables.push(new VariableDefinition(name, type));
    }

    updateVariable(name, newType) {
        this.findVariable(name).setType(newType);
    }

    addSubscope(scope) {
        this.subscopes.push(scope);
    }

    getParentScope() {
        return this.superscopes[0];
    }
}

class VariableDefinition {
    constructor(name, type) {
        this._name = name;
        this._type = type;
    }

    getName() {
        return this._name;
    }

    setType(newType) {
        this._type = newType;
    }

    isIterable() {
        return this._type === TYPES.string || this._type === TYPES.strarray || this._type === TYPES.any;
    }

    getType() {
        return this._type;
    }
}

class FunctionDefinition {
    constructor(name, argc, returnedType) {
        this._name = name;
        this._argsQuantity = argc;
        this._returnedType = returnedType;
    }

    getName() {
        return this._name;
    }

    getArgsQuantity() {
        return this._argsQuantity;
    }

    getReturnedType() {
        return this._returnedType;
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
            return;
        }

        const args = ctx.expr();
        const expectedArgsQuantity = this.definedFunctions
            .find(functionDef => functionDef.getName() === functionName)
            .getArgsQuantity();
        if (expectedArgsQuantity !== args.length) {
            this.addError(
                `Function '${functionName}' accepts ${expectedArgsQuantity} argument(s), but ${args.length} argument(s) were passed`,
                ctx
            );
        }
        this.checkAllExprVariables(args);
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

        const assignedExprTypes = exprs.map(expr => this.deriveExprType(expr));
        this.addVariablesToCurrScope(ids, assignedExprTypes);
        this.updateVariableTypesInCurrScope(ids, assignedExprTypes);
        this.checkAllExprVariables(ctx.expr());
    }

    enterStatement(ctx) {
        const parentCtx = ctx.parentCtx;
        if (parentCtx.constructor.name === "FunctionContext") {
            const args = this.getFunctionArgs(parentCtx);
            this.addVariablesToCurrScope(args, new Array(args.length).fill(TYPES.any));
        }
        if (parentCtx.constructor.name === "CycleContext") {
            const cycleHeaderIDs = parentCtx.ID();
            this.checkIfVariableIsDefined(cycleHeaderIDs[0], parentCtx);
            const iteratedObjectName = cycleHeaderIDs[0].getText();
            if (this.variableNotIterable(iteratedObjectName)) {
                this.addError(
                    `Variable '${iteratedObjectName}' is not iterable`,
                    parentCtx
                );
            }
            const iteratedObjectType = this.deriveVariableType(cycleHeaderIDs[0]);
            const elType = iteratedObjectType === TYPES.strarray ? TYPES.string : TYPES.char;
            const idsQuantity = cycleHeaderIDs.length;
            if (idsQuantity === 3) {
                this.addVariablesToCurrScope([
                    cycleHeaderIDs[idsQuantity - 2],
                    cycleHeaderIDs[idsQuantity - 1]
                ], [
                    elType,
                    TYPES.int
                ]);
            }
            else {
                this.addVariablesToCurrScope([cycleHeaderIDs[idsQuantity - 1]], [elType]);
            }
        }
    }

    enterFunction(ctx) {
        this.createNewScopeAndSetAsCurr();
    }

    exitFunction(ctx) {
        this.definedFunctions.push(new FunctionDefinition(
            this.getFunctionName(ctx),
            this.getFunctionArgs(ctx).length
        ));

        this.checkAllExprVariables(ctx.expr());
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
        const exprs = ctx.expr();
        this.checkAllExprVariables(exprs);
        const leftSideExprType = this.deriveExprType(exprs[0]);
        const rightSideExprType = this.deriveExprType(exprs[1]);
        if (leftSideExprType !== rightSideExprType && leftSideExprType !== TYPES.any && rightSideExprType !== TYPES.any) {
            this.addError(
                `Cannot compare values of different types`,
                ctx
            );
        }
    }

    exitExpr(ctx) {
        this.checkExprTypes([ctx]);
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////

    variableAlreadyDefined(name) {
        return this.currScope.hasVariableDefinition(name);
    }

    variableNotIterable(name) {
        return !this.currScope.findVariable(name).isIterable();
    }

    addVariablesToCurrScope(variables, types) {
        variables.forEach((variable, index) => {
            const variableName = variable.getText();
            if (!this.currScope.hasVariableDefinition(variableName)) {
                this.currScope.addVariable(variableName, types[index]);
            }
        });
    }

    updateVariableTypesInCurrScope(variables, types) {
        variables.forEach((variable, index) => {
            this.currScope.updateVariable(variable.getText(), types[index]);
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

    checkIfVariableIsDefined(variable) {
        const variableName = variable.getText();
        if (!this.variableAlreadyDefined(variableName)) {
            this.addError(`Variable '${variableName}' is not defined in this scope or any of its superscopes`, variable);
        }
    }

    checkAllVariables(variables) {
        variables.forEach(variable => this.checkIfVariableIsDefined(variable)); 
    }

    checkAllExprVariables(exprs) {
        this.checkAllVariables(exprs.filter(expr => this.exprIsVar(expr)));
    }

    deriveVariableType(variable) {
        return this.currScope.findVariable(variable.getText())?.getType() || TYPES.undefined;
    }

    deriveExprType(expr) {
        if (!!expr.operand()) {
            const operandCtx = expr.operand();
            if (!!operandCtx.ID()) {
                return this.deriveVariableType(operandCtx.ID());
            }
            if (!!operandCtx.INT()) {
                return TYPES.int;
            }
            if (!!operandCtx.char_()) { // ??????????????
                return TYPES.char;
            }
            if (!!operandCtx.string()) {
                return TYPES.string;
            }
            if (!!operandCtx.strarray()) {
                return TYPES.strarray;
            }
        }

        if (!!expr.call()) {
            return this.definedFunctions
                .find(functionDef => functionDef.getName() === this.getFunctionName(expr.call()))?.getReturnedType()
                || TYPES.undefined;
        }

        if (!!expr.NOT()) {
            const negatedExpr = expr.expr()[0];
            const negatedExprType = this.deriveExprType(negatedExpr);
            if (negatedExprType !== TYPES.int && negatedExprType !== TYPES.any) {
                this.addError(
                    `Cannot negate non-int variable/constant`,
                    negatedExpr
                );
                return TYPES.undefined;
            }
            return TYPES.int;
        }

        // at this point it's definitely a binary expression or an index access expression

        const leftSideExpr = expr.expr()[0];
        const rightSideExpr = expr.expr()[1];
        const leftSideExprType = this.deriveExprType(leftSideExpr);
        const rightSideExprType = this.deriveExprType(rightSideExpr);
        const leftSideExprTypeStr = typeIDToStringMap[leftSideExprType];
        const rightSideExprTypeStr = typeIDToStringMap[rightSideExprType];

        if (leftSideExprType === TYPES.undefined) {
            this.addError(
                `Variables of type 'undefined' cannot be used in expressions`,
                leftSideExpr
            );
            return TYPES.undefined;
        }
        if (rightSideExprType === TYPES.undefined) {
            this.addError(
                `Variables of type 'undefined' cannot be used in expressions`,
                rightSideExpr
            );
            return TYPES.undefined;
        }

        const leftSideIsInt = leftSideExprType === TYPES.int;
        const leftSideIsChar = leftSideExprType === TYPES.char;
        const leftSideIsString = leftSideExprType === TYPES.string;
        const leftSideIsStrarray = leftSideExprType === TYPES.strarray;
        const leftSideIsAny = leftSideExprType === TYPES.any;

        const rightSideIsInt = rightSideExprType === TYPES.int;
        const rightSideIsChar = rightSideExprType === TYPES.char;
        const rightSideIsString = rightSideExprType === TYPES.string;
        const rightSideIsStrarray = rightSideExprType === TYPES.strarray;
        const rightSideIsAny = rightSideExprType === TYPES.any;

        if (!!expr.LSQUARE()) {
            if (!leftSideIsString && !leftSideIsStrarray && !leftSideIsAny) {
                this.addError(
                    `Cannot index a non-iterable variable/constant`,
                    leftSideExpr
                );
                return TYPES.undefined;
            }
            if (!rightSideIsInt && !rightSideIsAny) {
                this.addError(
                    `Index accessor must be an integer`,
                    rightSideExpr
                );
                return TYPES.undefined;
            }
            return leftSideIsString ? TYPES.char : TYPES.string;
        }

        if (!!expr.AND() || !!expr.OR()) {
            if (!leftSideIsInt && !leftSideIsAny) {
                this.addError(
                    `Left side of a logic binary operator must be an integer`,
                    leftSideExpr
                );
                return TYPES.undefined;
            }
            if (!rightSideIsInt && !rightSideIsAny) {
                this.addError(
                    `Right side of a logic binary operator must be an integer`,
                    rightSideExpr
                );
                return TYPES.undefined;
            }
            return TYPES.int;
        }

        if (leftSideIsAny || rightSideIsAny) {
            return TYPES.any;
        }

        if (!!expr.ADD()) {
            if (leftSideIsInt && rightSideIsInt) {
                return TYPES.int
            }
            if (leftSideIsChar && rightSideIsChar
                || leftSideIsString && rightSideIsChar
                || leftSideIsChar && rightSideIsString
                || leftSideIsString && rightSideIsString) {
                return TYPES.string;
            }
            if (leftSideIsStrarray && rightSideIsStrarray) {
                return TYPES.strarray;
            }
            this.addError(
                `Cannot add variable/constant of type '${rightSideExprTypeStr}' to variable/constant of type '${leftSideExprTypeStr}'`,
                leftSideExpr.parentCtx
            );
            return TYPES.undefined;
        }

        if (!!expr.SUB()) {
            if (leftSideIsInt && rightSideIsInt) {
                return TYPES.int;
            }
            if (leftSideIsString && rightSideIsChar) {
                return TYPES.string;
            }
            if (leftSideIsStrarray && rightSideIsString) {
                return TYPES.strarray;
            }
            this.addError(
                `Cannot subtract variable/constant of type '${rightSideExprTypeStr}' from variable/constant of type '${leftSideExprTypeStr}'`,
                leftSideExpr
            );
            return TYPES.undefined;
        }

        if (!!expr.MUL()) {
            if (leftSideIsInt && rightSideIsInt) {
                return TYPES.int;
            }
            if (leftSideIsChar && rightSideIsInt
                || leftSideIsString && rightSideIsInt) {
                return TYPES.string;
            }
            if (leftSideIsStrarray && rightSideIsInt) {
                return TYPES.strarray;
            }
            this.addError(
                `Cannot multiply variable/constant of type '${leftSideExprTypeStr}' by variable/constant of type '${rightSideExprTypeStr}'`,
                leftSideExpr
            );
            return TYPES.undefined;
        }

        if (!!expr.DIV()) {
            if (leftSideIsInt && rightSideIsInt) {
                return TYPES.int;
            }
            if (leftSideIsString && rightSideIsChar) {
                return TYPES.string;
            }
            if (leftSideIsStrarray && rightSideIsString) {
                return TYPES.strarray;
            }
            this.addError(
                `Cannot divide variable/constant of type '${leftSideExprTypeStr}' by variable/constant of type '${rightSideExprTypeStr}'`,
                leftSideExpr
            );
            return TYPES.undefined;
        }

        return TYPES.undefined;
    }

    checkExprTypes(exprs) {
        exprs.forEach(expr => this.deriveExprType(expr));
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