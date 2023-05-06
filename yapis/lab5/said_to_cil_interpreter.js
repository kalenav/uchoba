import antlr4 from 'antlr4';
import ExprParserListener from "../lab3/compiled_grammar/ExprParserListener.js";
import { TYPES } from '../lab4/semantics_analyzer.js';

const dotnetCILtypes = {
    char: 'char',
    string: 'string',
    strarray: 'string[]',
    int8: 'int8',
    int16: 'int16',
    int32: 'int32',
    int: 'int32',
    void: 'void',
    object: 'object'
};

const typeMap = {
    [TYPES.char]: dotnetCILtypes.char,
    [TYPES.string]: dotnetCILtypes.string,
    [TYPES.strarray]: dotnetCILtypes.strarray,
    [TYPES.int]: dotnetCILtypes.int32
}

const conditionToInstructionMap = {
    areEqual: 'beq',
    firstLessThanSecond: 'blt',
    firstGreaterThanSecond: 'bgt',
    areEqual_strings: 'ceq brtrue',
    notEqual: 'bne.un'
};

class Variable {
    name = "";
    type = "";

    constructor (name, type){
        this.name = name;
        this.type = type;
    }

    setType(newType) {
        this.type = newType;
    }
};

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
        }
        if (params.addStrarrayPlaceholder) {
            this.localVariables.push(new Variable('STRARRAY_PLACEHOLDER', dotnetCILtypes.strarray));
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
        if (this.localVariables.length) {
            this.linesOfCode.unshift(`.locals init (${this.getLocalVariablesCode()})`);
        }
        return `.method public static ${this.returnType} ${this.name}(${this.getArgsCode()}) cil managed
{
    ${this.linesOfCode.join('\n    ')}
    ret
}`
    }

    updateMaxStackSize(newStackSize) {
        this.maxStackSize = newStackSize;
    }

    hasLocalVariable(name) {
        return !!this.localVariables.find(variable => variable.name === name);
    }

    addLocalVariable(name, type) {
        this.localVariables.push(new Variable(name, type));
    }

    getArgIndex(name) {
        return this.arguments.findIndex(arg => arg.name === name);
    }

    getLocalVariableType(name) {
        return this.localVariables.find(variable => variable.name === name)?.type;
    }

    getArgumentType(name) {
        return this.arguments.find(arg => arg.name === name)?.type;
    }
};

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

    static loadStrarrayConstantIntoStack(strarray, name) {
        return [
            CodeUtils.loadNumericConstantIntoStack(strarray.length),
            `newarr string`,
            CodeUtils.setVarValue(name),
            ...strarray.map((string, index) => [
                CodeUtils.getVarValue(name),
                CodeUtils.loadNumericConstantIntoStack(index),
                CodeUtils.loadStringConstantIntoStack(string),
                CodeUtils.addElemToStrarray()
            ]).flat(),
            CodeUtils.getVarValue(name)
        ]
    }

    static initEmptyStrarray(name) { // int32 length value must already be in the stack
        return [
            `newarr string`,
            CodeUtils.setVarValue(name)
        ]
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

    static iterate(params) {
        params.branchID = `${CodeUtils.hex(params.branchID)}`;
        return [
            ...CodeUtils.iterate_initINDEX(params),
            `${params.branchID}:`,
            ...CodeUtils.iterate_setEL(params),
            ...params.linesOfCode,
            ...CodeUtils.iterate_updateINDEX(params),
            ...CodeUtils.iterate_checkOutOfBounds(params)
        ];
    }

    static iterate_initINDEX(params) {
        return [
            CodeUtils.loadNumericConstantIntoStack(0),
            CodeUtils.setVarValue(params.indexAlias)
        ];
    }

    static iterate_updateINDEX(params) {
        return [
            CodeUtils.loadNumericConstantIntoStack(1),
            CodeUtils.getVarValue(params.indexAlias),
            `add`,
            CodeUtils.setVarValue(params.indexAlias),
        ]
    }

    static iterate_checkOutOfBounds(params) {
        return [
            CodeUtils.getVarValue(params.indexAlias),
            (params.iteratedObjInArgsIndex >= 0) ? CodeUtils.loadArgIntoStack(params.iteratedObjInArgsIndex) : CodeUtils.getVarValue(params.iteratedObjName),
            CodeUtils.methodCall(params.getLengthMethod),
            `blt ${params.branchID}`
        ]
    }

    static iterate_setEL(params) {
        return [
            (params.iteratedObjInArgsIndex >= 0) ? CodeUtils.loadArgIntoStack(params.iteratedObjInArgsIndex) : CodeUtils.getVarValue(params.iteratedObjName),
            CodeUtils.getVarValue(params.indexAlias),
            CodeUtils.methodCall(params.indexAccessorMethod),
            CodeUtils.setVarValue(params.elAlias)
        ]
    }

    static condition(params) {
        const branchInstruction = conditionToInstructionMap[params.condition];
        const hexOnTrue = CodeUtils.hex(params.branchIDs[0]);
        const hexOnFalse = CodeUtils.hex(params.branchIDs[1]);
        return [
            `${branchInstruction} ${hexOnTrue}`,
            ...params.linesOfCodeOnFalse,
            `br ${hexOnFalse}`,
            `${hexOnTrue}:`,
            ...params.linesOfCodeOnTrue,
            `${hexOnFalse}:`
        ]
    }

    static hex(number) {
        let hexNum = new Number(number).toString(16);
        while (hexNum.length < 4) hexNum = `0${hexNum}`;
        return `IL_${hexNum}`;
    }

    static addElemToStrarray() { // stack must be: ... array, index, elem
        return `stelem.ref`;
    }

    static getElemFromStrarray() {
        return `ldelem.ref`;
    }

    static getArrayLength() {
        return `ldlen`;
    }

    static return() {
        return `ret`;
    }

    static iterateInNumberRange(params) { // stack must be: ... from, to
        return [
            ...CodeUtils.iterateInNumberRange_init(params),
            ...params.linesOfCode,
            ...CodeUtils.iterateInNumberRange_updateCounter(params),
            ...CodeUtils.iterateInNumberRange_checkOutOfBounds(params)
        ]
    }

    static iterateInNumberRange_init(params) {
        params.branchID = `${CodeUtils.hex(params.branchID)}`;
        return [
            CodeUtils.setVarValue(params.rightBoundAlias),
            CodeUtils.setVarValue(params.counterAlias),
            `${params.branchID}:`,
        ]
    }

    static iterateInNumberRange_updateCounter(params) {
        return [
            CodeUtils.getVarValue(params.counterAlias),
            CodeUtils.loadNumericConstantIntoStack(1),
            `add`,
            CodeUtils.setVarValue(params.counterAlias)
        ]
    }

    static iterateInNumberRange_checkOutOfBounds(params) {
        return [
            CodeUtils.getVarValue(params.counterAlias),
            CodeUtils.getVarValue(params.rightBoundAlias),
            CodeUtils.loadNumericConstantIntoStack(1),
            `add`,
            `blt ${params.branchID}`
        ]
    }

    static deriveValueType(value) {

    }
};

export class Interpreter extends ExprParserListener {
    methods = {};
    overloadedMethods = {};
    currBranchID = 31;
    defaultAssemblyName = 'Program';
    semanticsAnalyzer;
    currMethod;
    mainScope;
    functionDefinitions;

    constructor(params) {
        super();
        this.initPredefinedMethods();
        this.currMethod = this.methods.main;
        this.semanticsAnalyzer = params.semanticsAnalyzer;
        this.mainScope = params.semanticsAnalyzer.mainScope;
        this.functionDefinitions = params.semanticsAnalyzer.definedFunctions;
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(this, params.tree);
    }

    interpretation() {
        return `.assembly extern mscorlib {}
.assembly ${this.defaultAssemblyName} {}
${Object.values(this.methods).map(method => method.getCode()).join('\n')}`;
    }

    initPredefinedMethods() {
        const printNumber = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [
                new Variable('printedValue', dotnetCILtypes.int32)
            ],
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `call void [mscorlib]System.Console::WriteLine(int32)`
            ]
        });
        const printChar = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [
                new Variable('printedValue', dotnetCILtypes.char)
            ],
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `call void [mscorlib]System.Console::Write(char)`
            ]
        });
        const printString = new Method({
            name: 'print',
            maxStackSize: 1,
            arguments: [
                new Variable('printedValue', dotnetCILtypes.string)
            ],
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `call void [mscorlib]System.Console::WriteLine(string)`
            ]
        });
        const strToChar = new Method({
            name: 'strToChar',
            maxStackSize: 2,
            arguments: [
                new Variable('str', dotnetCILtypes.string)
            ],
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
            arguments: [
                new Variable('chr', dotnetCILtypes.char)
            ],
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
            arguments: [
                new Variable('chr1', dotnetCILtypes.char),
                new Variable('chr2', dotnetCILtypes.char)
            ],
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
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('chr', dotnetCILtypes.char)
            ],
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
            arguments: [
                new Variable('chr', dotnetCILtypes.char),
                new Variable('str', dotnetCILtypes.string)
            ],
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
            arguments: [
                new Variable('str1', dotnetCILtypes.string),
                new Variable('str2', dotnetCILtypes.string)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                `call string System.String::Concat(string, string)`
            ]
        });
        const getCharAtIndex = new Method({
            name: 'getCharAtIndex',
            maxStackSize: 2,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('index', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.char,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                `callvirt instance char string::get_Chars(int32)`
            ]
        });
        const getStringAtIndex = new Method({
            name: 'getStringAtIndex',
            maxStackSize: 2,
            arguments: [
                new Variable('strarray', dotnetCILtypes.strarray),
                new Variable('index', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.getElemFromStrarray()
            ]
        });
        const getStringLength = new Method({
            name: 'getStringLength',
            maxStackSize: 1,
            arguments: [
                new Variable('str', dotnetCILtypes.string)
            ],
            returnType: dotnetCILtypes.int32,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                `callvirt instance int32 string::get_Length()`,
            ]
        });
        const subtractCharFromStr = new Method({
            name: 'subtractCharFromStr',
            maxStackSize: 2,
            arguments: [
                new Variable('chr', dotnetCILtypes.char),
                new Variable('str', dotnetCILtypes.string),
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.char),
                new Variable('resultStr', dotnetCILtypes.string),
                new Variable('charFound', dotnetCILtypes.int8)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack(""),
                CodeUtils.setVarValue('resultStr'),
                CodeUtils.loadNumericConstantIntoStack(0),
                CodeUtils.setVarValue('charFound'),
                ...CodeUtils.iterate({
                    branchID: 0,
                    iteratedObjInArgsIndex: 1,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getCharAtIndex,
                    getLengthMethod: getStringLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('charFound'),
                        CodeUtils.loadNumericConstantIntoStack(1),
                        ...CodeUtils.condition({
                            branchIDs: [1, 2],
                            condition: 'areEqual',
                            linesOfCodeOnTrue: [
                                CodeUtils.getVarValue('resultStr'),
                                CodeUtils.getVarValue('el'),
                                CodeUtils.methodCall(addStringAndChar),
                                CodeUtils.setVarValue('resultStr')
                            ],
                            linesOfCodeOnFalse: [
                                CodeUtils.getVarValue('el'),
                                CodeUtils.loadArgIntoStack(0),
                                ...CodeUtils.condition({
                                    branchIDs: [3, 4],
                                    condition: 'areEqual',
                                    linesOfCodeOnTrue: [
                                        CodeUtils.loadNumericConstantIntoStack(1),
                                        CodeUtils.setVarValue('charFound'),
                                    ],
                                    linesOfCodeOnFalse: [
                                        CodeUtils.getVarValue('resultStr'),
                                        CodeUtils.getVarValue('el'),
                                        CodeUtils.methodCall(addStringAndChar),
                                        CodeUtils.setVarValue('resultStr')
                                    ],
                                })                                
                            ]
                        }),
                    ],
                }),
                CodeUtils.getVarValue('resultStr'),
            ]
        });
        const getStrarrayLength = new Method({
            name: 'getStrarrayLength',
            maxStackSize: 1,
            arguments: [
                new Variable('strarray', dotnetCILtypes.strarray)
            ],
            returnType: dotnetCILtypes.int32,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.getArrayLength()
            ]
        });
        const printStrarray = new Method({
            name: 'print',
            maxStackSize: 3,
            arguments: [
                new Variable('strarray', dotnetCILtypes.strarray)
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.string),
                new Variable('resultStr', dotnetCILtypes.string)
            ],
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack("["),
                CodeUtils.setVarValue('resultStr'),
                ...CodeUtils.iterate({
                    branchID: 5,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStr'),
                        CodeUtils.getVarValue('el'),
                        CodeUtils.methodCall(addStrings),
                        CodeUtils.setVarValue('resultStr'),
                        CodeUtils.getVarValue('ind'),
                        CodeUtils.loadArgIntoStack(0),
                        CodeUtils.methodCall(getStrarrayLength),
                        CodeUtils.loadNumericConstantIntoStack(1),
                        `sub`,
                        ...CodeUtils.condition({
                            branchIDs: [6, 7],
                            condition: 'firstLessThanSecond',
                            linesOfCodeOnTrue: [
                                CodeUtils.getVarValue('resultStr'),
                                CodeUtils.loadStringConstantIntoStack(", "),
                                CodeUtils.methodCall(addStrings),
                                CodeUtils.setVarValue('resultStr')
                            ],
                            linesOfCodeOnFalse: []
                        }),
                    ]
                }),
                CodeUtils.getVarValue('resultStr'),
                CodeUtils.loadStringConstantIntoStack("]"),
                CodeUtils.methodCall(addStrings),
                CodeUtils.methodCall(printString)
            ]
        });
        const strarraySlice = new Method({
            name: 'strarraySlice',
            maxStackSize: 3,
            arguments: [
                new Variable('strarray', dotnetCILtypes.strarray),
                new Variable('fromInd', dotnetCILtypes.int32),
                new Variable('toInd', dotnetCILtypes.int32),
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.string),
                new Variable('resultArray', dotnetCILtypes.strarray),
                new Variable('currResultArrayIndex', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.strarray,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(2),
                CodeUtils.loadArgIntoStack(1),
                `sub`,
                ...CodeUtils.initEmptyStrarray('resultArray'),
                CodeUtils.loadNumericConstantIntoStack(0),
                CodeUtils.setVarValue('currResultArrayIndex'),
                ...CodeUtils.iterate({
                    branchID: 6,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('ind'),
                        CodeUtils.loadArgIntoStack(1),
                        CodeUtils.loadNumericConstantIntoStack(1),
                        `sub`,
                        ...CodeUtils.condition({
                            branchIDs: [7, 8],
                            condition: 'firstGreaterThanSecond',
                            linesOfCodeOnTrue: [
                                CodeUtils.getVarValue('ind'),
                                CodeUtils.loadArgIntoStack(2),
                                ...CodeUtils.condition({
                                    branchIDs: [9, 10],
                                    condition: 'firstLessThanSecond',
                                    linesOfCodeOnTrue: [
                                        CodeUtils.getVarValue('resultArray'),
                                        CodeUtils.getVarValue('currResultArrayIndex'),
                                        CodeUtils.getVarValue('el'),
                                        CodeUtils.addElemToStrarray(),
                                        CodeUtils.loadNumericConstantIntoStack(1),
                                        CodeUtils.getVarValue('currResultArrayIndex'),
                                        `add`,
                                        CodeUtils.setVarValue('currResultArrayIndex'),
                                    ],
                                    linesOfCodeOnFalse: []
                                }),
                            ],
                            linesOfCodeOnFalse: []
                        }),
                    ]
                }),
                CodeUtils.getVarValue('resultArray'),
            ]
        });
        const strarrayConcat = new Method({
            name: 'strarrayConcat',
            maxStackSize: 3,
            arguments: [
                new Variable('strarr1', dotnetCILtypes.strarray),
                new Variable('strarr2', dotnetCILtypes.strarray)
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.string),
                new Variable('resultStrarr', dotnetCILtypes.strarray),
                new Variable('currResultStrarrIndex', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.strarray,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.methodCall(getStrarrayLength),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.methodCall(getStrarrayLength),
                `add`,
                ...CodeUtils.initEmptyStrarray('resultStrarr'),
                CodeUtils.loadNumericConstantIntoStack(0),
                CodeUtils.setVarValue('currResultStrarrIndex'),
                ...CodeUtils.iterate({
                    branchID: 11,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStrarr'),
                        CodeUtils.getVarValue('currResultStrarrIndex'),
                        CodeUtils.getVarValue('el'),
                        CodeUtils.addElemToStrarray(),
                        CodeUtils.getVarValue('currResultStrarrIndex'),
                        CodeUtils.loadNumericConstantIntoStack(1),
                        `add`,
                        CodeUtils.setVarValue('currResultStrarrIndex')
                    ],
                }),
                ...CodeUtils.iterate({
                    branchID: 12,
                    iteratedObjInArgsIndex: 1,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStrarr'),
                        CodeUtils.getVarValue('currResultStrarrIndex'),
                        CodeUtils.getVarValue('el'),
                        CodeUtils.addElemToStrarray(),
                        CodeUtils.getVarValue('currResultStrarrIndex'),
                        CodeUtils.loadNumericConstantIntoStack(1),
                        `add`,
                        CodeUtils.setVarValue('currResultStrarrIndex')
                    ],
                }),
                CodeUtils.getVarValue('resultStrarr')
            ]
        });
        const subtractStrFromStrarray = new Method({
            name: 'subtractStrFromStrarray',
            maxStackSize: 4,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('strarray', dotnetCILtypes.strarray)
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.string),
                new Variable('resultArr', dotnetCILtypes.strarray),
                new Variable('strFound', dotnetCILtypes.int8)
            ],
            returnType: dotnetCILtypes.strarray,
            linesOfCode: [
                CodeUtils.loadNumericConstantIntoStack(0),
                CodeUtils.setVarValue('strFound'),
                ...CodeUtils.iterate({
                    branchID: 13,
                    iteratedObjInArgsIndex: 1,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('strFound'),
                        CodeUtils.loadNumericConstantIntoStack(1),
                        ...CodeUtils.condition({
                            branchIDs: [14, 15],
                            condition: 'areEqual',
                            linesOfCodeOnTrue: [
                            ],
                            linesOfCodeOnFalse: [
                                CodeUtils.loadArgIntoStack(0),
                                CodeUtils.getVarValue('el'),
                                ...CodeUtils.condition({
                                    branchIDs: [16, 17],
                                    condition: 'areEqual',
                                    linesOfCodeOnTrue: [
                                        CodeUtils.loadArgIntoStack(1),
                                        CodeUtils.loadNumericConstantIntoStack(0),
                                        CodeUtils.getVarValue('ind'),
                                        CodeUtils.methodCall(strarraySlice),

                                        CodeUtils.loadArgIntoStack(1),
                                        CodeUtils.getVarValue('ind'),
                                        CodeUtils.loadNumericConstantIntoStack(1),
                                        `add`,
                                        CodeUtils.loadArgIntoStack(1),
                                        CodeUtils.methodCall(getStrarrayLength),
                                        CodeUtils.methodCall(strarraySlice),

                                        CodeUtils.methodCall(strarrayConcat),
                                        CodeUtils.setVarValue('resultArr'),

                                        CodeUtils.loadNumericConstantIntoStack(1),
                                        CodeUtils.setVarValue('strFound')
                                    ],
                                    linesOfCodeOnFalse: []
                                }),
                            ]
                        }),
                    ]
                }),
                CodeUtils.getVarValue('strFound'),
                CodeUtils.loadNumericConstantIntoStack(1),
                ...CodeUtils.condition({
                    branchIDs: [18, 19],
                    condition: 'areEqual',
                    linesOfCodeOnTrue: [
                        CodeUtils.getVarValue('resultArr'),
                    ],
                    linesOfCodeOnFalse: [
                        CodeUtils.loadArgIntoStack(1)
                    ]
                }),
            ]
        });
        const multiplyCharByNumber =  new Method({
            name: 'multiplyCharByNumber',
            maxStackSize: 3,
            arguments: [
                new Variable('chr', dotnetCILtypes.char),
                new Variable('multiplier', dotnetCILtypes.int32),
            ],
            localVariables: [
                new Variable('resultStr', dotnetCILtypes.string),
                new Variable('cnt', dotnetCILtypes.int32),
                new Variable('rb', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack(""),
                CodeUtils.setVarValue('resultStr'),
                CodeUtils.loadNumericConstantIntoStack(1),
                CodeUtils.loadArgIntoStack(1),
                ...CodeUtils.iterateInNumberRange({
                    branchID: 20,
                    counterAlias: 'cnt',
                    rightBoundAlias: 'rb',
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStr'),
                        CodeUtils.loadArgIntoStack(0),
                        CodeUtils.methodCall(addStringAndChar),
                        CodeUtils.setVarValue('resultStr')
                    ]
                }),
                CodeUtils.getVarValue('resultStr')
            ]
        });
        const multiplyStringByNumber =  new Method({
            name: 'multiplyStringByNumber',
            maxStackSize: 3,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('multiplier', dotnetCILtypes.int32),
            ],
            localVariables: [
                new Variable('resultStr', dotnetCILtypes.string),
                new Variable('cnt', dotnetCILtypes.int32),
                new Variable('rb', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack(""),
                CodeUtils.setVarValue('resultStr'),
                CodeUtils.loadNumericConstantIntoStack(1),
                CodeUtils.loadArgIntoStack(1),
                ...CodeUtils.iterateInNumberRange({
                    branchID: 21,
                    counterAlias: 'cnt',
                    rightBoundAlias: 'rb',
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStr'),
                        CodeUtils.loadArgIntoStack(0),
                        CodeUtils.methodCall(addStrings),
                        CodeUtils.setVarValue('resultStr')
                    ]
                }),
                CodeUtils.getVarValue('resultStr')
            ]
        });
        const multiplyStrarrayByNumber =  new Method({
            name: 'multiplyStrarrayByNumber',
            maxStackSize: 3,
            arguments: [
                new Variable('strarr', dotnetCILtypes.strarray),
                new Variable('multiplier', dotnetCILtypes.int32),
            ],
            localVariables: [
                new Variable('resultStrarr', dotnetCILtypes.strarray),
                new Variable('cnt', dotnetCILtypes.int32),
                new Variable('rb', dotnetCILtypes.int32)
            ],
            returnType: dotnetCILtypes.strarray,
            linesOfCode: [
                CodeUtils.loadNumericConstantIntoStack(1),
                ...CodeUtils.initEmptyStrarray('resultStrarr'),
                CodeUtils.loadNumericConstantIntoStack(1),
                CodeUtils.loadArgIntoStack(1),
                ...CodeUtils.iterateInNumberRange({
                    branchID: 22,
                    counterAlias: 'cnt',
                    rightBoundAlias: 'rb',
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStrarr'),
                        CodeUtils.loadArgIntoStack(0),
                        CodeUtils.methodCall(strarrayConcat),
                        CodeUtils.setVarValue('resultStrarr')
                    ]
                }),
                CodeUtils.getVarValue('resultStrarr'),
                CodeUtils.loadNumericConstantIntoStack(1),
                CodeUtils.getVarValue('resultStrarr'),
                CodeUtils.methodCall(getStrarrayLength),
                CodeUtils.methodCall(strarraySlice)
            ]
        });
        const divideStrByChar = new Method({
            name: 'divideStrByChar',
            maxStackSize: 2,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('chr', dotnetCILtypes.char),
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.char),
                new Variable('resultStr', dotnetCILtypes.string)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack(""),
                CodeUtils.setVarValue('resultStr'),
                ...CodeUtils.iterate({
                    branchID: 23,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getCharAtIndex,
                    getLengthMethod: getStringLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('el'),
                        CodeUtils.loadArgIntoStack(1),
                        ...CodeUtils.condition({
                            branchIDs: [24, 25],
                            condition: 'areEqual',
                            linesOfCodeOnTrue: [],
                            linesOfCodeOnFalse: [
                                CodeUtils.getVarValue('resultStr'),
                                CodeUtils.getVarValue('el'),
                                CodeUtils.methodCall(addStringAndChar),
                                CodeUtils.setVarValue('resultStr')
                            ]
                        })
                    ]
                }),
                CodeUtils.getVarValue('resultStr'),
            ]
        });
        const divideStrarrayByStr = new Method({
            name: 'divideStrarrayByStr',
            maxStackSize: 3,
            arguments: [
                new Variable('strarr', dotnetCILtypes.strarray),
                new Variable('str', dotnetCILtypes.string)
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.string),
                new Variable('resultStrarr', dotnetCILtypes.strarray),
                new Variable('tempStrarr', dotnetCILtypes.strarray)
            ],
            returnType: dotnetCILtypes.strarray,
            linesOfCode: [
                CodeUtils.loadNumericConstantIntoStack(1),
                ...CodeUtils.initEmptyStrarray('resultStrarr'),
                ...CodeUtils.iterate({
                    branchID: 26,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.loadArgIntoStack(1),
                        CodeUtils.getVarValue('el'),
                        ...CodeUtils.condition({
                            branchIDs: [27, 28],
                            condition: 'areEqual',
                            linesOfCodeOnTrue: [],
                            linesOfCodeOnFalse: [
                                CodeUtils.loadNumericConstantIntoStack(1),
                                ...CodeUtils.initEmptyStrarray('tempStrarr'),
                                CodeUtils.getVarValue('tempStrarr'),
                                CodeUtils.loadNumericConstantIntoStack(0),
                                CodeUtils.getVarValue('el'),
                                CodeUtils.addElemToStrarray(),
                                CodeUtils.getVarValue('resultStrarr'),
                                CodeUtils.getVarValue('tempStrarr'),
                                CodeUtils.methodCall(strarrayConcat),
                                CodeUtils.setVarValue('resultStrarr')
                            ]
                        }),
                    ]
                }),
                CodeUtils.getVarValue('resultStrarr'),
                CodeUtils.loadNumericConstantIntoStack(1),
                CodeUtils.getVarValue('resultStrarr'),
                CodeUtils.methodCall(getStrarrayLength),
                CodeUtils.methodCall(strarraySlice)
            ]
        });
        const slice = new Method({
            name: 'slice',
            maxStackSize: 3,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('fromInd', dotnetCILtypes.int32),
                new Variable('toInd', dotnetCILtypes.int32),
            ],
            localVariables: [
                new Variable('cnt', dotnetCILtypes.int32),
                new Variable('rb', dotnetCILtypes.int32),
                new Variable('resultStr', dotnetCILtypes.string)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadStringConstantIntoStack(""),
                CodeUtils.setVarValue('resultStr'),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.loadArgIntoStack(2),
                CodeUtils.loadNumericConstantIntoStack(1),
                `sub`,
                ...CodeUtils.iterateInNumberRange({
                    branchID: 29,
                    counterAlias: 'cnt',
                    rightBoundAlias: 'rb',
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStr'),
                        CodeUtils.loadArgIntoStack(0),
                        CodeUtils.getVarValue('cnt'),
                        CodeUtils.methodCall(getCharAtIndex),
                        CodeUtils.methodCall(addStringAndChar),
                        CodeUtils.setVarValue('resultStr'),
                    ]
                }),
                CodeUtils.getVarValue('resultStr'),
                CodeUtils.loadStringConstantIntoStack("\\0"),
                CodeUtils.methodCall(addStrings)
            ]
        })
        const substr = new Method({
            name: 'substr',
            maxStackSize: 2,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('substr', dotnetCILtypes.string)
            ],
            returnType: dotnetCILtypes.int32,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                `callvirt instance int32 string::IndexOf(string)`
            ]
        });
        const split = new Method({
            name: 'split',
            maxStackSize: 3,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('chr', dotnetCILtypes.char)
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.char),
                new Variable('resultStrarr', dotnetCILtypes.strarray),
                new Variable('tempStrarr', dotnetCILtypes.strarray),
                new Variable('currTempStrarrElement', dotnetCILtypes.string),
            ],
            returnType: dotnetCILtypes.strarray,
            linesOfCode: [
                CodeUtils.loadNumericConstantIntoStack(1),
                ...CodeUtils.initEmptyStrarray('resultStrarr'),
                CodeUtils.loadStringConstantIntoStack(""),
                CodeUtils.setVarValue('currTempStrarrElement'),
                CodeUtils.loadNumericConstantIntoStack(1),
                ...CodeUtils.initEmptyStrarray('tempStrarr'),
                ...CodeUtils.iterate({
                    branchID: 30,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getCharAtIndex,
                    getLengthMethod: getStringLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('el'),
                        CodeUtils.loadArgIntoStack(1),
                        ...CodeUtils.condition({
                            branchIDs: [31, 32],
                            condition: 'areEqual',
                            linesOfCodeOnTrue: [
                                CodeUtils.getVarValue('tempStrarr'),
                                CodeUtils.loadNumericConstantIntoStack(0),
                                CodeUtils.getVarValue('currTempStrarrElement'),
                                CodeUtils.addElemToStrarray(),
                                CodeUtils.getVarValue('resultStrarr'),
                                CodeUtils.getVarValue('tempStrarr'),
                                CodeUtils.methodCall(strarrayConcat),
                                CodeUtils.setVarValue('resultStrarr'),
                                CodeUtils.loadStringConstantIntoStack(""),
                                CodeUtils.setVarValue('currTempStrarrElement'),
                                CodeUtils.loadNumericConstantIntoStack(1),
                                ...CodeUtils.initEmptyStrarray('tempStrarr'),
                            ],
                            linesOfCodeOnFalse: [
                                CodeUtils.getVarValue('currTempStrarrElement'),
                                CodeUtils.getVarValue('el'),
                                CodeUtils.methodCall(addStringAndChar),
                                CodeUtils.setVarValue('currTempStrarrElement')
                            ]
                        }),
                    ]
                }),
                CodeUtils.getVarValue('tempStrarr'),
                CodeUtils.loadNumericConstantIntoStack(0),
                CodeUtils.getVarValue('currTempStrarrElement'),
                CodeUtils.addElemToStrarray(),
                CodeUtils.getVarValue('resultStrarr'),
                CodeUtils.getVarValue('tempStrarr'),
                CodeUtils.methodCall(strarrayConcat),
                ...CodeUtils.setVar_keepStack('resultStrarr'),
                CodeUtils.loadNumericConstantIntoStack(1),
                CodeUtils.getVarValue('resultStrarr'),
                CodeUtils.methodCall(getStrarrayLength),
                CodeUtils.methodCall(strarraySlice)
            ]
        });
        const replace = new Method({
            name: 'replace',
            maxStackSize: 3,
            arguments: [
                new Variable('str', dotnetCILtypes.string),
                new Variable('replacing', dotnetCILtypes.string),
                new Variable('replacement', dotnetCILtypes.string)
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                CodeUtils.loadArgIntoStack(0),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.loadArgIntoStack(2),
                `call instance string string::Replace(string, string)`
            ]
        });
        const join = new Method({
            name: 'join',
            maxStackSize: 4,
            arguments: [
                new Variable('strarr', dotnetCILtypes.strarray),
                new Variable('str', dotnetCILtypes.string),
            ],
            localVariables: [
                new Variable('ind', dotnetCILtypes.int32),
                new Variable('el', dotnetCILtypes.string),
                new Variable('resultStr', dotnetCILtypes.string),
            ],
            returnType: dotnetCILtypes.string,
            linesOfCode: [
                ...CodeUtils.iterate({
                    branchID: 31,
                    iteratedObjInArgsIndex: 0,
                    indexAlias: 'ind',
                    elAlias: 'el',
                    indexAccessorMethod: getStringAtIndex,
                    getLengthMethod: getStrarrayLength,
                    linesOfCode: [
                        CodeUtils.getVarValue('resultStr'),
                        CodeUtils.getVarValue('el'),
                        CodeUtils.methodCall(addStrings),
                        CodeUtils.loadArgIntoStack(1),
                        CodeUtils.methodCall(addStrings),
                        CodeUtils.setVarValue('resultStr'),
                    ]
                }),
                CodeUtils.getVarValue('resultStr'),
                CodeUtils.loadNumericConstantIntoStack(0),
                CodeUtils.getVarValue('resultStr'),
                CodeUtils.methodCall(getStringLength),
                CodeUtils.loadArgIntoStack(1),
                CodeUtils.methodCall(getStringLength),
                `sub`,
                CodeUtils.methodCall(slice)
            ]
        });
        const main = new Method({
            name: 'Main',
            isEntryPoint: true,
            addStrarrayPlaceholder: true,
            localVariables: [],
            linesOfCode: [
            ]
        });

        this.methods = {
            main,
            printNumber,
            printChar,
            printString,
            printStrarray,
            strToChar,
            charToStr,
            addChars,
            addStringAndChar,
            addCharAndString,
            addStrings,
            getCharAtIndex,
            getStringLength,
            subtractCharFromStr,
            getStringAtIndex,
            getStrarrayLength,
            strarraySlice,
            strarrayConcat,
            subtractStrFromStrarray,
            multiplyCharByNumber,
            multiplyStringByNumber,
            multiplyStrarrayByNumber,
            divideStrByChar,
            divideStrarrayByStr,
            slice,
            substr,
            split,
            replace,
            join
        };

        this.overloadedMethods = {
            'print': {
                'printNumber': [dotnetCILtypes.int32],
                'printChar': [dotnetCILtypes.char],
                'printString': [dotnetCILtypes.string],
                'printStrarray': [dotnetCILtypes.strarray]
            },
            '+': {
                'addChars': [dotnetCILtypes.char, dotnetCILtypes.char],
                'addStringAndChar': [dotnetCILtypes.string, dotnetCILtypes.char],
                'addCharAndString': [dotnetCILtypes.char, dotnetCILtypes.string],
                'addStrings': [dotnetCILtypes.string, dotnetCILtypes.string],
                'strarrayConcat': [dotnetCILtypes.strarray, dotnetCILtypes.strarray]
            },
            '-': {
                'subtractCharFromStr': [dotnetCILtypes.string, dotnetCILtypes.char],
                'subtractStrFromStrarray': [dotnetCILtypes.strarray, dotnetCILtypes.string]
            },
            '*': {
                'multiplyCharByNumber': [dotnetCILtypes.char, dotnetCILtypes.int],
                'multiplyStringByNumber': [dotnetCILtypes.string, dotnetCILtypes.int],
                'multiplyStrarrayByNumber': [dotnetCILtypes.strarray, dotnetCILtypes.int]
            },
            '/': {
                'divideStrByChar': [dotnetCILtypes.string, dotnetCILtypes.char],
                'divideStrarrayByStr': [dotnetCILtypes.strarray, dotnetCILtypes.string]
            }
        }
    }

    updateBranchID() {
        this.currBranchID++;
    }

    ///////////////////////////////
    ///////////////////////////////
    ///////////////////////////////
    
    getStringWithSpaces(stringCtx) {
        const substrings = stringCtx.children;
        return substrings.slice(1, substrings.length - 1).join(' ')
    }

    getConditionType(conditionCtx) {
        if (!!conditionCtx.EQ()) {
            if (this.deriveExprType(conditionCtx.expr()[0]) === TYPES.string) {
                return 'areEqual_string';
            }
            else return 'areEqual';
        }
        if (!!conditionCtx.GREATER()) {
            return 'firstGreaterThanSecond';
        }
        if (!!conditionCtx.LESS()) {
            return 'firstLessThanSecond';
        }
        if (!!conditionCtx.NOEQ()) {
            return 'notEqual'
        }
    }

    findVar(name) {
        return [
            ...this.currMethod.localVariables,
            ...this.currMethod.arguments
        ].find(variable => variable.name === name);
    }

    getVarType(name) {
        return this.findVar(name).type;
    }

    getElAndIndexAliases(cycleCtx) {
        const ctx = cycleCtx;
        const trackingEL = !!ctx.EL();
        const trackingINDEX = !!ctx.INDEX();
        const indexAliasIDIndex = (trackingEL && trackingINDEX) ? 2 : 1;

        const elAlias = trackingEL ? ctx.ID()[1].getText() : `el`;
        const indexAlias = trackingINDEX ? ctx.ID()[indexAliasIDIndex].getText() : `index`;
        return [elAlias, indexAlias];
    }

    getStatementLinesOfCode(statementCtx) {
        if (!!statementCtx.expr()) {
            return [
                ...this.loadExprValueIntoStack(statementCtx.expr())
            ];
        }
        if (!!statementCtx.assignment()) {
            const ctx = statementCtx.assignment();
            const variableNames = ctx.ID().map(IDctx => IDctx.getText());
            const variableValues = ctx.expr();
            let linesOfCode = [];
            variableNames.forEach((name, index) => {
                const expr = variableValues[index];
                const type = this.deriveExprType(expr);
                linesOfCode = linesOfCode.concat([
                    ...this.loadExprValueIntoStack(expr),
                    CodeUtils.setVarValue(name)
                ]);
                if (!this.currMethod.hasLocalVariable(name)) {
                    this.currMethod.addLocalVariable(name, type);
                }
                else this.findVar(name).setType(type);
            });
            return linesOfCode;
        }
        let ctx = statementCtx.control();
        if (!!ctx.cycle()) {
            ctx = ctx.cycle();

            const iteratedObjIsStr = this.getVarType(ctx.ID()[0].getText()) === dotnetCILtypes.string;
            
            const branchID = ++this.currBranchID;
            const iteratedObjInArgsIndex = this.currMethod.getArgIndex(ctx.ID()[0]);
            const iteratedObjName = ctx.ID()[0];
            const [elAlias, indexAlias] = this.getElAndIndexAliases(ctx);
            const indexAccessorMethod = this.methods[iteratedObjIsStr ? 'getCharAtIndex' : 'getStringAtIndex'];
            const getLengthMethod = this.methods[iteratedObjIsStr ? 'getStringLength' : 'getStrarrayLength'];
            let linesOfCode = []
            ctx.statement().forEach(statement => {
                linesOfCode = linesOfCode.concat(this.getStatementLinesOfCode(statement));
            });

            return CodeUtils.iterate({
                branchID,
                iteratedObjInArgsIndex,
                iteratedObjName,
                indexAlias,
                elAlias,
                indexAccessorMethod,
                getLengthMethod,
                linesOfCode
            });
        }
        if (!!ctx.if_()) {
            ctx = ctx.if_();
            const conditionCtx = ctx.condition();
            const conditionExprs = conditionCtx.expr();
            let condition;

            if (!!conditionCtx.EQ()) {
                const conditionExprsAreStrings = conditionExprs
                    .every(exprCtx => this.deriveExprType(exprCtx) === dotnetCILtypes.string);
                if (conditionExprsAreStrings) {
                    condition = 'areEqual_strings';
                }
                else {
                    condition = 'areEqual';
                }
            }
            if (!!conditionCtx.GREATER()) {
                condition = 'firstGreaterThanSecond';
            }
            if (!!conditionCtx.LESS()) {
                condition = 'firstLessThanSecond';
            }
            if (!!conditionCtx.NOEQ()) {
                condition = 'notEqual';
            }

            const elseIndex = ctx.ELSE()?.symbol.tokenIndex || Infinity;
            const statements = ctx.statement();
            const statementsOnTrue = statements
                .filter(statementCtx => statementCtx.stop.tokenIndex < elseIndex);
            const statementsOnFalse = statements
                .filter(statementCtx => statementCtx.start.tokenIndex > elseIndex);
            
            const linesOfCodeOnTrue = statementsOnTrue
                .map(statementCtx => this.getStatementLinesOfCode(statementCtx))
                .flat();
            const linesOfCodeOnFalse = statementsOnFalse
                .map(statementCtx => this.getStatementLinesOfCode(statementCtx))
                .flat();
            return [
                ...this.loadExprValueIntoStack(conditionExprs[0]),
                ...this.loadExprValueIntoStack(conditionExprs[1]),
                ...CodeUtils.condition({
                    branchIDs: [++this.currBranchID, ++this.currBranchID],
                    condition,
                    linesOfCodeOnTrue,
                    linesOfCodeOnFalse
                })
            ];
        }
    }

    loadExprValueIntoStack(ctx) {
        if (!!ctx.operand()?.ID()) {
            const argIndex = this.currMethod.getArgIndex(ctx.getText());
            if (argIndex > -1) {
                return [
                    CodeUtils.loadArgIntoStack(argIndex)
                ];
            }
            return [
                CodeUtils.getVarValue(ctx.getText())
            ];
        }
        if (!!ctx.operand()?.INT()) {
            return [
                CodeUtils.loadNumericConstantIntoStack(ctx.getText())
            ];
        }
        if (!!ctx.operand()?.char_()) {
            return [
                CodeUtils.loadStringConstantIntoStack(ctx.getText()[1]),
                CodeUtils.methodCall(this.methods.strToChar)
            ]
        }
        if (!!ctx.operand()?.string()) {
            return [
                CodeUtils.loadStringConstantIntoStack(this.getStringWithSpaces(ctx.operand().string()))
            ];
        }
        if (!!ctx.operand()?.strarray()) {
            return [
                ...CodeUtils.loadStrarrayConstantIntoStack(
                    ctx.operand().strarray().string().map(str => this.getStringWithSpaces(str)),
                    'STRARRAY_PLACEHOLDER'
                )
            ]
        }
        if (!!ctx.call()) {
            ctx = ctx.call();
            const args = ctx.expr();
            let linesOfCode = [];
            args.forEach(arg => {
                linesOfCode = linesOfCode.concat(this.loadExprValueIntoStack(arg));
            });
            const argTypes = args.map(arg => this.deriveExprType(arg));
            const calledFunctionName = ctx.ID().getText();
            if (!calledFunctionName in this.overloadedMethods) {
                return linesOfCode.concat([
                    CodeUtils.methodCall(this.methods[calledFunctionName])
                ]);
            }
            const overloadedMethodObj = this.overloadedMethods[calledFunctionName];
            for (const methodName in overloadedMethodObj) {
                if (overloadedMethodObj[methodName].every((type, index) => type === argTypes[index])) {
                    return linesOfCode.concat([
                        CodeUtils.methodCall(this.methods[methodName])
                    ]);
                }
            }
        }

        if (!!ctx.LSQUARE()) {
            const arr = ctx.expr()[0];
            const index = ctx.expr()[1];
            const arrType = this.deriveExprType(arr);
            return [
                ...this.loadExprValueIntoStack(arr),
                ...this.loadExprValueIntoStack(index),
                CodeUtils.methodCall(arrType === TYPES.strarray
                    ? this.methods.getStringAtIndex
                    : this.methods.getCharAtIndex 
                )
            ]
        }

        if (!!ctx.ADD()) {
            const firstSummand = ctx.expr()[0];
            const secondSummand = ctx.expr()[1];
            const types = [firstSummand, secondSummand].map(expr => this.deriveExprType(expr));
            const sumMethods = this.overloadedMethods['+'];
            for (const methodName in sumMethods) {
                if (types.every((type, index) => type === sumMethods[methodName][index])) {
                    return [
                        ...this.loadExprValueIntoStack(firstSummand),
                        ...this.loadExprValueIntoStack(secondSummand),
                        CodeUtils.methodCall(this.methods[methodName])
                    ]
                }
            }
        }

        if (!!ctx.SUB()) {
            const minuend = ctx.expr()[0];
            const subtrahend = ctx.expr()[1];
            const types = [minuend, subtrahend].map(expr => this.deriveExprType(expr));
            const diffMethods = this.overloadedMethods['-'];
            for (const methodName in diffMethods) {
                if (types.every((type, index) => type === diffMethods[methodName][index])) {
                    return [
                        ...this.loadExprValueIntoStack(subtrahend),
                        ...this.loadExprValueIntoStack(minuend),
                        CodeUtils.methodCall(this.methods[methodName])
                    ]
                }
            }
        }

        if (!!ctx.MUL()) {
            const multiplied = ctx.expr()[0];
            const multiplier = ctx.expr()[1];
            const types = [multiplied, multiplier].map(expr => this.deriveExprType(expr));
            const mulMethods = this.overloadedMethods['*'];
            for (const methodName in mulMethods) {
                if (types.every((type, index) => type === mulMethods[methodName][index])) {
                    return [
                        ...this.loadExprValueIntoStack(multiplied),
                        ...this.loadExprValueIntoStack(multiplier),
                        CodeUtils.methodCall(this.methods[methodName])
                    ]
                }
            }
        }

        if (!!ctx.DIV()) {
            const divided = ctx.expr()[0];
            const divisor = ctx.expr()[1];
            const types = [divided, divisor].map(expr => this.deriveExprType(expr));
            const divMethods = this.overloadedMethods['/'];
            for (const methodName in divMethods) {
                if (types.every((type, index) => type === divMethods[methodName][index])) {
                    return [
                        ...this.loadExprValueIntoStack(divided),
                        ...this.loadExprValueIntoStack(divisor),
                        CodeUtils.methodCall(this.methods[methodName])
                    ]
                }
            }
        }

        if (!!ctx.NOT()) {
            const negated = ctx.expr()[0];
            return [
                ...this.loadExprValueIntoStack(negated),
                CodeUtils.loadNumericConstantIntoStack(0),
                ...CodeUtils.condition({
                    branchIDs: [++this.currBranchID, ++this.currBranchID],
                    condition: 'areEqual',
                    linesOfCodeOnTrue: [
                        CodeUtils.loadNumericConstantIntoStack(1),
                    ],
                    linesOfCodeOnFalse: [
                        CodeUtils.loadNumericConstantIntoStack(0)
                    ]
                })
            ]
        }
    }

    deriveExprType(ctx) {
        const patheticAttempt = typeMap[this.semanticsAnalyzer.deriveExprType(ctx)];
        if (patheticAttempt) return patheticAttempt;

        if (!!ctx.operand()?.ID()) {
            return this.getVarType(ctx.operand().ID().getText());
        }

        if (!!ctx.call()) {
            const calledFunctionName = ctx.call().ID().getText();
            return this.methods[calledFunctionName].returnType;
        }

        if (!!ctx.NOT()) {
            return dotnetCILtypes.int32;
        }

        const leftExprType = this.deriveExprType(ctx.expr()[0]);
        const rightExprType = this.deriveExprType(ctx.expr()[1]);

        if (!!ctx.LSQUARE()) {
            return leftExprType === dotnetCILtypes.string ? dotnetCILtypes.char : dotnetCILtypes.string;
        }

        let requiredMethods = [];

        if (!!ctx.ADD()) {
            requiredMethods = this.overloadedMethods['+'];
        }

        if (!!ctx.SUB()) {
            requiredMethods = this.overloadedMethods['-'];
        }

        if (!!ctx.MUL()) {
            requiredMethods = this.overloadedMethods['*'];
        }

        if (!!ctx.DIV()) {
            requiredMethods = this.overloadedMethods['/'];
        }

        for (const methodName in requiredMethods) {
            const method = this.methods[methodName];
            const argumentTypes = method.arguments.map(arg => arg.type);
            if (argumentTypes[0] === leftExprType && argumentTypes[1] === rightExprType) {
                return method.returnType;
            }
        }
    }

    exitStatement(ctx) {
        if (ctx.parentCtx.constructor.name === 'CycleContext' || ctx.parentCtx.constructor.name === 'IfContext') return;
        this.currMethod.addLinesOfCode(this.getStatementLinesOfCode(ctx));
    }

    enterCycle(ctx) {
        const iteratedObjName = ctx.ID()[0].getText();
        const iteratedObjIsStr = this.getVarType(iteratedObjName) === dotnetCILtypes.string;

        const [elAlias, indexAlias] = this.getElAndIndexAliases(ctx);

        if (!this.currMethod.hasLocalVariable(elAlias)) {
            this.currMethod.addLocalVariable(elAlias, iteratedObjIsStr ? dotnetCILtypes.char : dotnetCILtypes.string);
        }
        if (!this.currMethod.hasLocalVariable(indexAlias)) {
            this.currMethod.addLocalVariable(indexAlias, dotnetCILtypes.int32);
        }
    }
}