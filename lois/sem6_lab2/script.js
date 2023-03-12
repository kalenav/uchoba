/////////////////////////////////////////////////////////
// Лабораторная работа №2 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентом группы 021702 БГУИР Локтевым Константином Алексеевичем
// Файл с сокращённым описанием модуля парсера сокращённого языка логики высказываний,
// а также с описанием модуля проверки равносильности двух формул
// 30.01.2023

const capitalLettersCharCodes = [];
const capitalACharCode = 65;
const lettersInEnglishAlphabet = 26;
for (let code = capitalACharCode; code <= capitalACharCode + lettersInEnglishAlphabet - 1; code++) {
    capitalLettersCharCodes.push(code);
}

const parserModule = (function() {
    const language = {
        logicConstantZero: '0',
        logicConstantOne: '1',
        atomicFormulae: Object.fromEntries(capitalLettersCharCodes.map(code => [String.fromCharCode(code), 1])),
        negation: '!',
        openingBracket: '(',
        closingBracket: ')',
        binaryLinks: {
            conjunction: '/\\',
            disjunction: '\\/',
            implication: '->',
            equivalence: '~'
        }
    };
    const binaryLinksIdentifiers = {
        [language.binaryLinks.conjunction]: '1',
        [language.binaryLinks.disjunction]: '2',
        [language.binaryLinks.implication]: '3',
        [language.binaryLinks.equivalence]: '4'
    }

    function isLogicConstant(string) {
        return string === language.logicConstantZero || string === language.logicConstantOne;
    }

    function isAtomicFormula(string) {
        return string in language.atomicFormulae;
    }
    
    function isUnaryComplexFormula(string) {
        const length = string.length;
        return string[0] === language.openingBracket
            && string[1] === language.negation
            && isFormula(string.slice(2, length - 1))
            && string[length - 1] === language.closingBracket;
    }

    function isBinaryComplexFormula(string) {
        const length = string.length;
        if (string[0] !== language.openingBracket || string[length - 1] !== language.closingBracket) return false;

        const binaryLinkIndex = getHighestLevelBinaryLinkIndex(string);
        const binaryLinkIdentifier = getBinaryComplexFormulaBinaryLinkIdentifier(string, binaryLinkIndex);
        if (binaryLinkIdentifier === -1) return false;
        const binaryLinkCharacterLength = getBinaryLinkCharacterLength(binaryLinkIdentifier);

        const subformulae = getComplexBinaryFormulaLevelOneSubformulae(string, binaryLinkIndex, binaryLinkCharacterLength);
        return isFormula(subformulae.left) && isFormula(subformulae.right);
    }

    function getBinaryComplexFormulaBinaryLinkIdentifier(string, index) {
        if (!index) {
            index = getHighestLevelBinaryLinkIndex(string);
        }
        for (let linkName in language.binaryLinks) {
            const currLink = language.binaryLinks[linkName];
            if (string.slice(index, index + currLink.length) === currLink) {
                return binaryLinksIdentifiers[currLink];
            }
        }
        return -1;
    }

    function getBinaryLinkCharacterLength(linkIdentifier) {
        for (let link in binaryLinksIdentifiers) {
            if (binaryLinksIdentifiers[link] === linkIdentifier) {
                return link.length;
            }
        }
    }

    function isComplexFormula(string) {
        return isUnaryComplexFormula(string) || isBinaryComplexFormula(string)
    }

    function isFormula(string) {
        return isLogicConstant(string) || isAtomicFormula(string) || isComplexFormula(string);
    }

    function getComplexBinaryFormulaLevelOneSubformulae(string, binaryLinkIndex, binaryLinkCharacterLength) {
        if (!binaryLinkIndex) {
            binaryLinkIndex = getHighestLevelBinaryLinkIndex(string);
        }
        if (!binaryLinkCharacterLength) {
            const binaryLinkIdentifier = getBinaryComplexFormulaBinaryLinkIdentifier(string, binaryLinkIndex);
            binaryLinkCharacterLength = getBinaryLinkCharacterLength(binaryLinkIdentifier);
        }
        return {
            left: string.slice(1, binaryLinkIndex),
            right: string.slice(binaryLinkIndex + binaryLinkCharacterLength, string.length - 1)
        }
    }

    function getHighestLevelBinaryLinkIndex(string) {
        let index = 1;
        let unclosedBrackets = 0;
        do {
            if (string[index] === language.openingBracket) unclosedBrackets++;
            if (string[index] === language.closingBracket) unclosedBrackets--;
            index++;
        }
        while (unclosedBrackets > 0);
        return index;
    }

    function getAllAtomicFormulae(string) {
        const formulae = [];
        for (let formula in language.atomicFormulae) {
            if(string.split(formula).length >= 2) {
                formulae.push(formula);
            }
        }
        return formulae.sort((atomic1, atomic2) => atomic1 >= atomic2 ? 1 : -1);
    }

    return {
        isFormula,
        getComplexBinaryFormulaLevelOneSubformulae,
        getBinaryComplexFormulaBinaryLinkIdentifier,
        isLogicConstant,
        isAtomicFormula,
        isUnaryComplexFormula,
        isBinaryComplexFormula,
        getAllAtomicFormulae,
        binaryLinksIdentifiers,
        binaryLinks: language.binaryLinks,
    }
})();

const logicCalculatorModule = (function() {
    const inputsIntervalByDefault = 1;
    let currArgValuesObj; // переменная для хранения текущего набора значений атомарных формул

    function conjunction(arg1, arg2) {
        return +arg1 && +arg2;
    }

    function disjunction(arg1, arg2) {
        return +arg1 || +arg2;
    }

    function implication(arg1, arg2) {
        return !(+arg1 === 1 && +arg2 === 0);
    }

    function equivalence(arg1, arg2) {
        return +arg1 === +arg2;
    }

    function negation(arg) {
        return !+arg;
    }

    const identifierToFunctionMap = {
        [parserModule.binaryLinksIdentifiers[parserModule.binaryLinks.disjunction]]: disjunction,
        [parserModule.binaryLinksIdentifiers[parserModule.binaryLinks.conjunction]]: conjunction,
        [parserModule.binaryLinksIdentifiers[parserModule.binaryLinks.implication]]: implication,
        [parserModule.binaryLinksIdentifiers[parserModule.binaryLinks.equivalence]]: equivalence
    };

    function evaluate(string, argValuesObj) {
        currArgValuesObj = argValuesObj;
        try {
            return calculate(string);
        }
        catch (err) {
            console.error('Incorrect formula or missing argument values in argValuesObj');
        }
    }

    function calculate(formula) {
        if (parserModule.isLogicConstant(formula)) return +formula;
        if (parserModule.isAtomicFormula(formula)) return +currArgValuesObj[formula];
        if (parserModule.isUnaryComplexFormula(formula)) {
            return +negation(calculate(formula.slice(2, formula.length - 1)));
        }
        if (parserModule.isBinaryComplexFormula(formula)) {
            const subformulae = parserModule.getComplexBinaryFormulaLevelOneSubformulae(formula);
            const linkIdentifier = parserModule.getBinaryComplexFormulaBinaryLinkIdentifier(formula);
            return +identifierToFunctionMap[linkIdentifier](calculate(subformulae.left), calculate(subformulae.right));
        }
    }

    function getBinaryNumberArrayRepresentation(numberInDecimal, decimalPlacesQuantity) {
        const binaryNumberArray = [];
        let currRemainingNumber = numberInDecimal;
        do {
            binaryNumberArray.unshift(currRemainingNumber % 2);
            currRemainingNumber = Math.floor(currRemainingNumber / 2);
        } while (currRemainingNumber !== 0);
        while (binaryNumberArray.length < decimalPlacesQuantity) binaryNumberArray.unshift(0);
        return binaryNumberArray;
    }

    function getAllPossibleBinaryInputs(atomicFormulae, from, to) {
        const inputs = [];
        const inputQuantity = Math.pow(2, atomicFormulae.length);
        for (let inputInDecimal = from ?? 0;
            to ? (inputInDecimal < to && inputInDecimal < inputQuantity) : inputInDecimal < inputQuantity;
            inputInDecimal++
        ) {
            inputs.push(getBinaryNumberArrayRepresentation(inputInDecimal, atomicFormulae.length));
        }
        return inputs
    }

    function getTruthTable(formula, atomicFormulae, inputsFrom, inputsTo) {
        if (!atomicFormulae) {
            atomicFormulae = parserModule.getAllAtomicFormulae(formula);
        }
        const inputs = getAllPossibleBinaryInputs(atomicFormulae, inputsFrom, inputsTo);
        return {
            inputs,
            outputs: inputs.map(input => evaluate(formula, getValuesObj(input, atomicFormulae)))
        }
    }

    function getValuesObj(values, atomicFormulae) {
        return Object.fromEntries(atomicFormulae.map((atomicFormula, index) => {
            return [atomicFormula, values[index]];
        }));
    }

    function combineAtomicFormulae(formula1, formula2) {
        return Object.keys(Object.fromEntries([
            ...parserModule.getAllAtomicFormulae(formula1).map(atomicFormula => [atomicFormula, 1]),
            ...parserModule.getAllAtomicFormulae(formula2).map(atomicFormula => [atomicFormula, 1]) 
        ])).sort();
    }

    function getTruthTables_CombineAtomicFormulae(formula1, formula2, inputsFrom, inputsTo) {
        const combinedAtomicFormulae = combineAtomicFormulae(formula1, formula2);
        return [
            getTruthTable(formula1, combinedAtomicFormulae, inputsFrom, inputsTo),
            getTruthTable(formula2, combinedAtomicFormulae, inputsFrom, inputsTo)
        ];
    }

    function compareTruthTables(firstTruthTable, secondTruthTable) {
        return firstTruthTable.outputs.every((output, index) => output === secondTruthTable.outputs[index]);
    }

    function areFormulasEquivalent(formula1, formula2, fragmentTruthTables = false) {
        if (!parserModule.isFormula(formula1) || !parserModule.isFormula(formula2)) return false;
        // по определению, формулы сокращённого языка логики высказываний равносильны,
        // если их значения при всех возможных значениях атомарных формул обеих формул равны
        const inputsQuantity = Math.pow(2, combineAtomicFormulae(formula1, formula2).length);
        if (fragmentTruthTables) {
            let currLeftBound = 0;
            do {
                const currRightBound = currLeftBound + inputsIntervalByDefault;
                const truthTables = getTruthTables_CombineAtomicFormulae(formula1, formula2, currLeftBound, currRightBound);
                const [firstTruthTable, secondTruthTable] = truthTables;
                if (!compareTruthTables(firstTruthTable, secondTruthTable)) return false;
                currLeftBound += inputsIntervalByDefault;
            }
            while (currLeftBound < inputsQuantity);
            return true;
        }
        else {
            const [firstTruthTable, secondTruthTable] = getTruthTables_CombineAtomicFormulae(formula1, formula2);
            return compareTruthTables(firstTruthTable, secondTruthTable);
        }
    }

    const testParams = {
        equivalentFormulae: [
            ['1', '1'],
            ['1', '(!0)'],
            ['C', '(!(!C))'],
            ['0', '(A/\\(!A))'],
            ['1', '((!Q)\\/Q)'],
            ['A', '(A/\\1)'],
            ['H', '(H\\/0)'],
            ['(!(A/\\H))', '((!A)\\/(!H))'],
            ['((!(B/\\K))/\\1)', '(0\\/((!B)\\/(!K)))'],
            ['(!C)', '((A\\/(!A))/\\((B/\\0)\\/((!C)/\\1)))'],
            ['(A~B)', '(B~A)'],
            ['(A\\/B)', '(B\\/A)'],
            ['1', '(A\\/(!A))'],
            ['(1~0)', '0'],
            ['(1~1)', '1'],
        ],
        nonequivalentFormulae: [
            ['1', '0'],
            ['1', '(!1)'],
            ['C', '(!(!(!C)))'],
            ['A', 'B'],
            ['(A/\\B)', '(!B)'],
            ['(Q\\/Z)', '(Q/\\0)'],
            ['(!(!(A/\\L)))', '((!A)\\/(!L))'],
            ['((!(F/\\N))/\\0)', '(0\\/((!N)\\/(!F)))'],
            ['(1\\/(!O))', '((V\\/(!O))/\\((V/\\1)\\/((!J)/\\M)))'],
            ['(A/\\(B/\\C))', '((A/\\B)\\/C)'],
            ['(A->B)', '(B->A)'],
            ['(A\\/B)', '(P\\/Q)']
        ],

        // Ограничения из-за неэффективности алгоритма
        // Максимальное время на проверку эквивалентности формул при большом общем количестве уникальных атомарных формул
        // Замеры были проведены при работе программы в браузере Google Chrome
        //
        // 14 атомарных формул: ~0.84с
        // 15 атомарных формул: ~1.8с
        // 16 атомарных формул: ~4.4с
        // 17 атомарных формул: ~9.5с
        // 18 атомарных формул: ~21.3с
        // 19 атомарных формул: ~48.2с
        // 20 атомарных формул: ~107.5с
        // 21 атомарная формула: 4мин
        // 22 атомарные формулы: 8.3мин
        // 23 атомарные формулы: 18.2мин
        // 24 атомарные формулы: 46.4мин
        // 25 атомарных формул: 1ч 40мин
        // 26 атомарных формул: 3ч 40мин
        //
        // В среднем одна дополнительная уникальная атомарная формула увеличивает максимальное время проверки в ~2.2 раза 
        longNonequivalentFormulae: [
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\N))))))))))))))'
            ],
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\O)))))))))))))))'
            ],
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\P))))))))))))))))'
            ],
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\Q)))))))))))))))))'
            ],
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\R))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\S)))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\T))))))))))))))))))))'
            ],
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\(T/\\U)))))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\(T/\\(U/\\V))))))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\(T/\\(U/\\(V/\\W)))))))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\(T/\\(U/\\(V/\\(W/\\X))))))))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\(T/\\(U/\\(V/\\(W/\\(X/\\Y)))))))))))))))))))))))))'
            ],    
            [
                '1',
                '(!(A/\\(B/\\(C/\\(D/\\(E/\\(F/\\(G/\\(H/\\(I/\\(J/\\(K/\\(L/\\(M/\\(N/\\(O/\\(P/\\(Q/\\(R/\\(S/\\(T/\\(U/\\(V/\\(W/\\(X/\\(Y/\\Z))))))))))))))))))))))))))'
            ],    
        ]
    }

    function tests(withLongTests = false) {
        const testFormulaPairs = [
            ...testParams.equivalentFormulae.map(formulaPair => [formulaPair, true]),
            ...testParams.nonequivalentFormulae.map(formulaPair => [formulaPair, false]),
        ];

        let testsPassed = 0;
        let overallTests = testParams.equivalentFormulae.length + testParams.nonequivalentFormulae.length;
        for (const formulaPair of testFormulaPairs) {
            const formula1 = formulaPair[0][0];
            const formula2 = formulaPair[0][1];
            const expected = formulaPair[1];
            const actual = areFormulasEquivalent(formula1, formula2);
            if (actual === expected) {
                testsPassed++;
            } else {
                console.log(`TEST FAIL
                formula 1: ${formula1}
                formula 2: ${formula2}
                expected: ${expected ? 'equivalent' : 'non-equivalent'}
                got: ${actual ? 'equivalent' : 'non-equivalent'}`);
            }
        }

        if (withLongTests) {
            overallTests += testParams.longNonequivalentFormulae.length;

            const longTestFormulaPairs = [
                ...testParams.longNonequivalentFormulae.map(formulaPair => [formulaPair, false]),
            ];

            longTestFormulaPairs.forEach((formulaPair, index) => {
                console.time(`${index + 14} symbols`);
                const formula1 = formulaPair[0][0];
                const formula2 = formulaPair[0][1];
                const expected = formulaPair[1];
                const actual = areFormulasEquivalent(formula1, formula2, true);
                if (actual === expected) {
                    testsPassed++;
                } else {
                    console.log(`TEST FAIL
                    formula 1: ${formula1}
                    formula 2: ${formula2}
                    expected: ${expected ? 'equivalent' : 'non-equivalent'}
                    got: ${actual ? 'equivalent' : 'non-equivalent'}`);
                }
                console.timeEnd(`${index + 14} symbols`);
            });
        }

        console.log(`\n\nTests passed: ${testsPassed}/${overallTests}`);
    }

    return {
        tests,
        areFormulasEquivalent,
        getTruthTable
    }
})();

document.getElementById('are-equivalent').addEventListener('click', () => {
    const formula1 = prompt('Введите первую формулу');
    const formula2 = prompt('Введите вторую формулу');
    if (!parserModule.isFormula(formula1)) alert('Первая формула некорректна');
    else if (!parserModule.isFormula(formula2)) alert('Вторая формула некорректна');
    else alert(logicCalculatorModule.areFormulasEquivalent(formula1, formula2) ? 'Формулы равносильны' : 'Формулы неравносильны');
});

document.getElementById('truth').addEventListener('click', () => {
    console.log(logicCalculatorModule.getTruthTable(prompt('formula')).outputs.reduce((r, v) => r + v, 0));
});