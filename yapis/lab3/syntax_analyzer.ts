const syntaxAnalyzerModule = (function() {
    const syntax: { [key: string]:
        string
        | { [key: string]: string }
        | number[]
        | string[]
    } = {
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

    type regexpWithParams = {
        regexp: string | RegExp,
        optional?: boolean,
        zeroOrMore?: boolean,
        oneOrMore?: boolean
    };
    type rawSequentialRegexps = (string | RegExp | regexpWithParams)[];
    type sequentialRegexps = (RegExp | regexpWithParams)[];

    function extractRegExpStr(regexp: string | RegExp, keepBoundaryDelimiters: boolean = false): string {
        if (typeof regexp === 'string') return regexp;
        const str = `${regexp}`;
        const offset: number = +keepBoundaryDelimiters;
        const leftBound = 2 - offset;
        const rightBound = str.length - 2 + offset;
        return `${str.slice(leftBound, rightBound)}`;
    }

    function stringToRegexpMapper(string: string): RegExp {
        return new RegExp(string);
    }

    function startsWithBoundaryDelimiter(regexp: string | RegExp): boolean {
        return ((regexp instanceof RegExp) ? extractRegExpStr(regexp) : regexp)[0] === '^';
    }

    function endsWithBoundaryDelimiter(regexp: string | RegExp): boolean {
        const strToCheck = ((regexp instanceof RegExp) ? extractRegExpStr(regexp) : regexp);
        return strToCheck[strToCheck.length - 1] === '$';
    }

    function getRegexpStrForCombination(regexp: string | RegExp): boolean {
        return true;
    }

    function combineRegExps_sequential(regexps: sequentialRegexps, boolean = false): RegExp {
        return new RegExp(`${regexps.map((obj: RegExp | regexpWithParams) => {
            if (obj instanceof RegExp) return extractRegExpStr(obj);

            obj = obj as regexpWithParams;
            const baseStr = `(${extractRegExpStr(obj.regexp)})`;
            if (obj.optional) return baseStr + '?';
            if (obj.zeroOrMore) return baseStr + '*';
            if (obj.oneOrMore) return baseStr + '+';
            return baseStr;
        }).join('')}`);
    }

    function combineRegExps_alternating(regexps: RegExp[]): RegExp {
        return new RegExp(`${regexps.map((re: RegExp) => {

        }).join('|')}`);
    }

    const re_WS = new RegExp(/^[\t\n\r\f ]*$/);
    const re_ID = new RegExp(/^[a-zA-Z_][a-zA-Z_0-9]*$/);
    const re_INT = new RegExp(/^[0-9]+$/);
    const re_char = new RegExp(`^${syntax.SINGLE_QUOTE}[\\w ]${syntax.SINGLE_QUOTE}$`);
    const re_string = new RegExp(`^${syntax.DOUBLE_QUOTE}[\\w ]*${syntax.DOUBLE_QUOTE}$`);
    const re_strarray = combineRegExps_sequential([
        `^\\${syntax['LSQUARE']}`,
        re_WS,
        {
            regexp: combineRegExps_sequential([
                re_string,
                {
                    regexp: combineRegExps_sequential([
                        re_WS,
                        ',',
                        re_WS,
                        re_string,
                        re_WS
                    ]),
                    zeroOrMore: true
                }
            ], true),
            optional: true
        },
        re_WS,
        `\\${syntax['RSQUARE']}$`
    ], true);

    const re_operand = new RegExp(combineRegExps_alternating([
        '^',
        re_ID,
        re_INT,
        re_char,
        re_string,
        re_strarray,
        '$'
    ]));

    function isCorrectFile(string: string): boolean {
        return true;
    }

    //////////////////////////////
    //////////////////////////////
    //////////////////////////////

    type testObj = {
        string: string,
        testedRegexp: RegExp,
        expected: boolean
    };
    type testObjArray = testObj[];

    function createTestObjArray(correctStrings: string[], incorrectStrings: string[], regexp: RegExp): testObjArray {
        const testObjArray: testObjArray = [];
        correctStrings.forEach(string => testObjArray.push({
            string,
            testedRegexp: regexp,
            expected: true
        }));
        incorrectStrings.forEach(string => testObjArray.push({
            string,
            testedRegexp: regexp,
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
        const tests: testObjArray = [
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
            if (test.testedRegexp.test(test.string) === test.expected) testsPassed++;
            else {
                console.log(`====================
                TEST FAIL
                string: ${test.string}
                regular expression: ${test.testedRegexp}
                expected: ${test.expected}
                ====================`);
            }
        });

        console.log(`\n\nTests passed: ${testsPassed}/${tests.length}`);
    }
    
    return {
        tests,
        isCorrectFile,
        syntax
    }
})();

syntaxAnalyzerModule.tests();