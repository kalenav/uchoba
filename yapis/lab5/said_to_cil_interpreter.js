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
    isEntryPoint = false;
    maxStackSize = 8;
    returnType = dotnetCILtypes.void;
    arguments = [];
    localVariables = [];
    linesOfCode = [];

    constructor(params) {
        this.name = params.name;
        if (params.arguments) this.arguments = params.arguments.slice();
        if (params.isEntryPoint) {
            this.addLineOfCode('.entrypoint');
            this.isEntryPoint = true;
        }
        if (params.maxStackSize) this.maxStackSize = params.maxStackSize;
        if (params.returnType) this.returnType = params.returnType;
        this.addLineOfCode(`.maxstack ${this.maxStackSize}`);
        if (params.localVariables) {
            this.localVariables = params.localVariables.slice();
            this.addLineOfCode(`.locals init (${this.localVariables.map(CodeUtils.variableMapper).join(', ')})`);
        }
    }

    addLineOfCode(line) {
        this.linesOfCode.push(line);
    }

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

    static box() {
        return `box`;
    }

    static convertToInt32() {
        return `conv.i4`;
    }

    static variableMapper(variable) {
        return `${variable.type} ${variable.name}`;
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
            arguments: [new Variable('printedValue', dotnetCILtypes.int32)]
        });
        printNumber.addLineOfCode(CodeUtils.loadArgIntoStack(0));
        printNumber.addLineOfCode(`call void [mscorlib]System.Console::WriteLine(int32)`);
        const printChar = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [new Variable('printedValue', dotnetCILtypes.char)]
        });
        printChar.addLineOfCode(CodeUtils.loadArgIntoStack(0));
        printChar.addLineOfCode(`call void [mscorlib]System.Console::Write(char)`);
        const printString = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [new Variable('printedValue', dotnetCILtypes.object)]
        });
        printString.addLineOfCode(CodeUtils.loadArgIntoStack(0));
        printString.addLineOfCode(`call void [mscorlib]System.Console::WriteLine(object)`);

        const strToChar = new Method({
            name: 'strToChar',
            maxStackSize: 2,
            arguments: [new Variable('str', dotnetCILtypes.string)],
            returnType: dotnetCILtypes.char
        });
        strToChar.addLineOfCode(CodeUtils.loadArgIntoStack(0));
        strToChar.addLineOfCode(CodeUtils.loadNumericConstantIntoStack(0));
        strToChar.addLineOfCode(`callvirt instance char string::get_Chars(int32)`);

        const main = new Method({
            name: 'Main',
            isEntryPoint: true,
            arguments: [new Variable('args', `${dotnetCILtypes.string}[]`)]
        });
        main.addLineOfCode(CodeUtils.loadStringConstantIntoStack("hello"));
        main.addLineOfCode(CodeUtils.methodCall(strToChar));
        main.addLineOfCode(CodeUtils.methodCall(printChar));

        [main, printString, printNumber, printChar, strToChar].forEach(method => this.methods.push(method));
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////


}