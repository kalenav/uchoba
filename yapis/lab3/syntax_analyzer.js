const syntaxAnalyzerModule = (function() {
    const syntax = {
        NOT: '!',
        ASSIGN: '=',
        COMMA: ',',
        SEMI: ';',
        COLON: ':',
        LPAREN: '(',
        RPAREN: ')',
        LCURLY: '{',
        RCURLY: '}',
        LSQUARE: '[',
        RSQUARE: ']',
        SINGLE_QUOTE: '\'',
        DOUBLE_QUOTE: '"',
        DEF: 'function',
        RETURN: 'return',
        ITERATE: 'iterate',
        TRACK: 'track',
        EL: 'EL',
        AS: 'as',
        EQ: '==',
        GREATER: '>',
        LESS: '<',
        NOEQ: '!=',
        IF: 'if',
        THEN: 'then',
        ELSE: 'else',
        END: 'end;',

        logicBinaryLinks: {
            AND: '&&',
            OR: '||',
        },

        binaryOperators: {
            ADD: '+',
            SUB: '-',
            MUL: '*',
            DIV: '/',
        },

        digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        symbols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map(symbol => [symbol, symbol.toLowerCase()]).flat()
    }

    function extractRegExp(regexp) {
        const str = `${regexp}`;
        return `${str.slice(1, str.length - 1)}`;
    }

    function combineRegExps_sequential(regexps) {
        return new RegExp(`${regexps.map(re => `(${extractRegExp(re)})`).join('')}`);
    }

    function combineRegExps_alternating(regexps) {
        return new RegExp(`${regexps.map(re => `(${extractRegExp(re)})`).join('|')}`);
    }

    const re_ID = new RegExp(/[a-zA-Z_][a-zA-Z_0-9]*/);
    const re_INT = new RegExp(/[0-9]+/);
    const re_char = new RegExp(`${syntax.SINGLE_QUOTE}[\\w ]${syntax.SINGLE_QUOTE}`);
    const re_string = new RegExp(`${syntax.DOUBLE_QUOTE}[\\w ]*${syntax.DOUBLE_QUOTE}`);
    const re_strarray = new RegExp(`${syntax.LSQUARE}${extractRegExp(re_string)}(,${extractRegExp(re_string)})]*${syntax.RSQUARE}`);

    const re_operand = new RegExp(combineRegExps_alternating([
        re_ID,
        re_INT,
        re_char,
        re_string,
        re_strarray
    ]));

    function isCorrectFile(string) {
        
    }

    function createTestObjArray(correctStrings, incorrectStrings, regexp) {
        const testObjArray = [];
        correctStrings.forEach(string => testObjArray.push({
            string,
            re: regexp,
            expected: true
        }));
        incorrectStrings.forEach(string => testObjArray.push({
            string,
            re: regexp,
            expected: false
        }));
        return testObjArray;
    }

    const testParams = {
        correctIDs: [`a`, `var`, `b123`, `symbolsQuantity`],
        incorrectIDs: [`1`, `2bbb`, ` `, `[]`, `a123(`],

        correctINTs: [`1`, `2`, `123`, `555`, `12412`],
        incorrectINTs: [`a`, `a1`, `1a`, `()`],

        correctCharConstants: [`'a'`, `'b'`, `'0'`, `'Z'`, `' '`],
        incorrectCharConstants: [`''`, `'aa'`, `'a '`, `' b'`],

        correctStringConstants: [`"a"`, `"ddd"`, `"1aaa1"`, `"asdasd222_ hi"`, `""`],
        incorrectStringConstants: [`'a'`, `f()`],

        correctStrarrayConstants: [`["a"]`, `["a", "bc", "def"]`, `[]`],
        incorrectStrarrayConstants: [`['a']`, `["bc", "def", 'g']`],
    }

    function tests() {
        const tests = [
            ...createTestObjArray(testParams.correctIDs, testParams.incorrectIDs, re_ID),
            ...createTestObjArray(testParams.correctINTs, testParams.incorrectINTs, re_INT),
            ...createTestObjArray(testParams.correctCharConstants, testParams.incorrectCharConstants, re_char),
            ...createTestObjArray(testParams.correctStringConstants, testParams.incorrectStringConstants, re_string),
            ...createTestObjArray(testParams.correctStrarrayConstants, testParams.incorrectStrarrayConstants, re_strarray),
            ...createTestObjArray([
                ...testParams.correctIDs,
                ...testParams.correctINTs,
                ...testParams.correctCharConstants,
                ...testParams.correctStringConstants,
                ...testParams.correctStrarrayConstants
            ], [

            ], re_operand)
        ];

        let testsPassed = 0;
        tests.forEach(test => {
            if (test.re.test(test.string) === test.expected) testsPassed++;
            else {
                console.log(`====================
                TEST FAIL
                string: ${test.string}
                regular expression: ${test.re}
                expected: ${test.expected}
                ====================`);
            }
        });

        console.log(`\n\nTests passed: ${testsPassed}/${tests.length}`);
    }
    
    return {
        tests,
        isCorrectFile,
        extractRegExp,
        combineRegExps_alternating
    }
})();

const re1 = new RegExp('a');
const re2 = new RegExp('b');
console.log(syntaxAnalyzerModule.extractRegExp(re1));
console.log(syntaxAnalyzerModule.extractRegExp(re2));
console.log(syntaxAnalyzerModule.combineRegExps_alternating([re1, re2]));
syntaxAnalyzerModule.tests();