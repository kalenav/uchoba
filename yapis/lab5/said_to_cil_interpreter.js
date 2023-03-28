import antlr4 from 'antlr4';
import ExprParserListener from "../lab3/compiled_grammar/ExprParserListener.js";

const dotnetCILtypes = {
    char: 'char',
    string: 'string',
    int4: 'int4',
    int8: 'int8',
    int16: 'int16',
    int32: 'int32',
    void: 'void',
    object: 'object'
};

class Variable {
    name = "";
    type = "";

    constructor (name, type){
        this.name = name;
        this.type = type;
    }
}

class Method {
    name = "";
    returnType = dotnetCILtypes.void;
    arguments = [];
    localVariables = [];
    linesOfCode = [];

    constructor(params) {
        this.name = params.name;
        if (params.arguments) this.arguments = params.arguments.slice();
        if (params.returnType) this.returnType = params.returnType;
        this.addLineOfCode(`.maxstack ${params.maxStackSize ?? 8}`);
        if (params.isEntryPoint) {
            this.addLineOfCode('.entrypoint');
        }
        if (params.localVariables) {
            this.localVariables = params.localVariables.slice();
            this.addLineOfCode(`.locals init (${this.getLocalVariablesCode()})`);
        }
        if (params.linesOfCode) {
            this.linesOfCode = [
                ...this.linesOfCode,
                ...params.linesOfCode
            ]
        };
    }

    addLineOfCode(line) {
        this.linesOfCode.push(line);
    }

    addLinesOfCode(lines) {
        lines.forEach(line => this.linesOfCode.push(line));
    }

    getLocalVariablesCode() {
        return this.localVariables.map(CodeUtils.variableMapper).join(', ');
    };

    getArgsCode() {
        return this.arguments.map(CodeUtils.variableMapper).join(', ');
    }

    getArgTypesForCall() {
        return this.arguments.map(arg => `${arg.type}`).join(', ');
    }

    getCode() {
        return `.method public static ${this.returnType} ${this.name}(${this.getArgsCode()}) cil managed
{
    ${this.linesOfCode.join('\n    ')}
    ret
}`
    }

    updateMaxStackSize(newStackSize) {
        this.maxStackSize = newStackSize;
    }
}

class CodeUtils {
    static loadArgIntoStack(identifier) {
        return `ldarg.${identifier}`;
    }

    static loadNumericConstantIntoStack(number) {
        return `ldc.i4 ${number}`;
    }

    static loadStringConstantIntoStack(string) {
        return `ldstr "${string}"`;
    }

    static methodCall(method) {
        return `call ${method.returnType} ${method.name}(${method.getArgTypesForCall()})`
    }

    static box(type) {
        return `box ${type}`;
    }

    static convertToInt32() {
        return `conv.i4`;
    }

    static variableMapper(variable) {
        return `${variable.type} ${variable.name}`;
    }

    static setVarValue(index) {
        return `stloc ${index}`;
    }

    static getVarValue(index) {
        return `ldloc ${index}`;
    }

    static setVar_keepStack(index) {
        return [CodeUtils.setVarValue(index), CodeUtils.getVarValue(index)];
    }
}

export class Interpreter extends ExprParserListener {
    dummies = [`.assembly Hello {}
    .method public static void Main() cil managed
    {
         .entrypoint
         .maxstack 1
         ldstr "Hello, world!"
         call void [mscorlib]System.Console::WriteLine(string)
         ret
    }`, `
    .assembly ass {}
    .method public static void Main() cil managed
    {
        .entrypoint
        .maxstack 5
        .locals init (int8 NUM)

                    ldc.i4.1
                    stloc NUM
        IL_0004:    ldloc NUM
                    call            void [mscorlib]System.Console::WriteLine(int32)
                    ldloc NUM
                    ldc.i4.1
                    add
                    stloc NUM
                    ldloc NUM
                    ldc.i4 0xb
                    blt.s           IL_0004
                    ret
    }
    `]
    methods = [];
    static defaultAssemblyName = 'Program';

    constructor(tree) {
        super();
        this.initPredefinedMethods();
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(this, tree);
    }

    interpretation() {
        return `.assembly extern mscorlib {}
.assembly ${Interpreter.defaultAssemblyName} {}
${this.methods.map(method => method.getCode()).join('\n')}`;
    }

    initPredefinedMethods() {
        const printNumber = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [new Variable('printedValue', dotnetCILtypes.int32)],
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `call void [mscorlib]System.Console::WriteLine(int32)`
            ]
        });
        const printChar = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [new Variable('printedValue', dotnetCILtypes.char)],
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `call void [mscorlib]System.Console::Write(char)`
            ]
        });
        const printString = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [new Variable('printedValue', dotnetCILtypes.string)],
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `call void [mscorlib]System.Console::WriteLine(string)`
            ]
        });
        const strToChar = new Method({
            name: 'strToChar',
            maxStackSize: 2,
            arguments: [new Variable('str', dotnetCILtypes.string)],
            returnType: dotnetCILtypes.char,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadNumericConstantIntoStack(0),
                `callvirt instance char string::get_Chars(int32)`
            ]
        });
        const charToStr = new Method({
            name: 'charToStr',
            maxStackSize: 1,
            arguments: [new Variable('chr', dotnetCILtypes.char)],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.box(dotnetCILtypes.char),
                `callvirt instance string class [mscorlib]System.Object::ToString()`
            ]
        });
        const addChars = new Method({
            name: 'addChars',
            maxStackSize: 2,
            arguments: [new Variable('chr1', dotnetCILtypes.char), new Variable('chr2', dotnetCILtypes.char)],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.methodCall(charToStr),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.methodCall(charToStr),
                `call string System.String::Concat(string, string)`
            ]
        });
        const addStringAndChar = new Method({
            name: 'addStringAndChar',
            maxStackSize: 2,
            arguments: [new Variable('str', dotnetCILtypes.string), new Variable('chr', dotnetCILtypes.char)],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.methodCall(charToStr),
                `call string System.String::Concat(string, string)`
            ]
        });
        const addCharAndString = new Method({
            name: 'addStringAndChar',
            maxStackSize: 2,
            arguments: [new Variable('chr', dotnetCILtypes.char), new Variable('str', dotnetCILtypes.string)],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.methodCall(charToStr),
                CodeUtils.loadArgIntoStack(1),
                `call string System.String::Concat(string, string)`
            ]
        });
        const addStrings = new Method({
            name: 'addStrings',
            maxStackSize: 2,
            arguments: [new Variable('str1', dotnetCILtypes.string), new Variable('str2', dotnetCILtypes.string)],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                `call string System.String::Concat(string, string)`
            ]
        });
        const main = new Method({
            name: 'Main',
            isEntryPoint: true,
            arguments: [new Variable('args', `${dotnetCILtypes.string}[]`)],
            localVariables: [new Variable('temp', dotnetCILtypes.char)],
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack("a"),
                CodeUtils.loadStringConstantIntoStack("bcd"),
                CodeUtils.methodCall(addStrings),
                CodeUtils.methodCall(printString)
            ]
        });

        [
            main,
            printString,
            printNumber,
            printChar,
            strToChar,
            charToStr,
            addChars,
            addStringAndChar,
            addCharAndString,
            addStrings,
            // addStrarrays
        ].forEach(method => this.methods.push(method));
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////


}