/////////////////////////////////////////////////////////
// Лабораторная работа №1 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентом группы 021702 БГУИР Локтевым Константином Алексеевичем
// Файл с описанием модуля парсера сокращённого языка логики высказываний
// 29.01.2023

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
        return string[0] === language.openingBracket            // сложная унарная формула начинается с символа открывающей скобки, ...
            && string[1] === language.negation                  // ...со следующим за ней символом отрицания,...
            && isFormula(string.slice(2, length - 1))           // ...с последующей формулой сокращённого языка высказываний,...
            && string[length - 1] === language.closingBracket;  // ...и заканчивается закрывающей скобкой.
    }

    function isBinaryComplexFormula(string) {
        const length = string.length;
        // сложная бинарная формула должна начинаться с символа открывающей скобки и заканчиваться символом закрывающей скобки
        if (string[0] !== language.openingBracket || string[length - 1] !== language.closingBracket) return false;

        const binaryLinkIndex = getHighestLevelBinaryLinkIndex(string);
        const binaryLinkIdentifier = getBinaryComplexFormulaBinaryLinkIdentifier(string, binaryLinkIndex);
        // если найденная бинарная связка отсутствует в сокращённом языке логики высказываний, то переданная строка не является сложной бинарной формулой
        if (binaryLinkIdentifier === -1) return false;
        const binaryLinkCharacterLength = getBinaryLinkCharacterLength(binaryLinkIdentifier);

        // получение строк, содержащих подформулы слева и справа от бинарной связки
        const subformulae = getComplexBinaryFormulaLevelOneSubformulae(string, binaryLinkIndex, binaryLinkCharacterLength);
        return isFormula(subformulae.left) && isFormula(subformulae.right);
    }

    function getBinaryComplexFormulaBinaryLinkIdentifier(string, index) {
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

    function isDisjunctiveNormalForm(string) {
        if (!isFormula(string)) return false;
        // любой конъюнктивный примитив по определению является формулой в ДНФ
        if (isConjunctivePrimitive(string)) return true;

        const primitiveDelimiterBinaryLink = language.binaryLinks.disjunction;
        const binaryLinkLength = primitiveDelimiterBinaryLink.length;
        const binaryLinkIndex = getHighestLevelBinaryLinkIndex(string);
        // если бинарная связка высшего уровня в формуле не является дизъюнкцией, то переданная строка не является формулой в ДНФ
        if (string.slice(binaryLinkIndex, binaryLinkIndex + binaryLinkLength) !== primitiveDelimiterBinaryLink) return false;

        const subformulae = getComplexBinaryFormulaLevelOneSubformulae(string, binaryLinkIndex, binaryLinkLength);
        // подформулы формулы в ДНФ также являются формулами в ДНФ
        return isDisjunctiveNormalForm(subformulae.left) && isDisjunctiveNormalForm(subformulae.right);
    }

    function isConjunctivePrimitive(string) {
        let multipleIdenticalAtomicFormulaeOccur = false;
        for (let atomicFormula in language.atomicFormulae) {
            if (string.split(atomicFormula).length > 2) {
                multipleIdenticalAtomicFormulaeOccur = true;
                break;
            }
        }
        // переданная строка является конъюнктивным примитивом, если выполняются все следующие условия:
        return (isFormula(string) // она является формулой сокращённого языка логики высказываний;
            && !string.includes(language.binaryLinks.implication) // она не содержит связки импликации;
            && !string.includes(language.binaryLinks.equivalence) // она не содержит связки эквиваленции;
            && !string.includes(language.binaryLinks.disjunction) // она не содержит связки дизъюнкции;
            && !string.includes(`${language.negation}${language.openingBracket}`) // она не содержит сложных унарных формул с аргументом в виде комплексной формулы;
            && !multipleIdenticalAtomicFormulaeOccur); // она не содержит одинаковых атомарных формул.
    }

    function getComplexBinaryFormulaLevelOneSubformulae(string, binaryLinkIndex, binaryLinkCharacterLength) {
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

    const testParams = {
        correctFormulae: [
            '1',
            '0',
            'A',
            '(!A)',
            '(A/\\A)',
            '(A\\/B)',
            '(A/\\1)',
            '((A/\\0)->B)',
            '(!((A/\\0)->B))',
            '((!((A/\\0)->B))~B)',
            '(((!((A/\\0)->B))~B)/\\(!A))',
            '(A~A)',
            '(A->A)',
            '(A->B)',
            '(((!((0/\\0)->0))~1)/\\(!1))',
            '(!(!A))',
            '(A~(A~A))'
        ],
        incorrectFormulae: [
            '((!!A))',
            '(!(!)B)',
            '((A~A~A))',
            '!A',
            '(!AA)',
            'A0',
            '2',
            '11',
            '(((A~A)(!B)))',
            '~A',
            'A~A',
            '((A~!A)(!B))',
            '(A)',
            '(0)',
            '~',
            '!',
            '->',
            '/\\',
            '\\/',
            '(((A/\\A)(!B)))',
            'A/\\A',
            'A\\/A',
            '((A/\\!A)(!B))',
            '((A/\\!A)~(!B))',
            '(!)',
            '(~)',
            '(~A)',
            '((!C)!B)'
        ],
        correctDisjunctiveNormalForms: [
            '(A\\/B)',
            '(A\\/(B\\/C))',
            '((A\\/B)\\/(B\\/A))',
            '((A\\/(B\\/C))\\/(B\\/(C\\/A)))',
            '(((((A\\/A)\\/A)\\/A)\\/A)\\/A)',
            '((A/\\B)\\/C)',
            '((A/\\1)\\/(0/\\A))',
            '(((1/\\0)/\\(Q/\\0))\\/(!B))',
            '(((1/\\0)/\\(Q/\\0))\\/((0/\\0)/\\((!D)/\\1)))',
            '(1\\/((A/\\(!B))\\/((!1)\\/(((!C)/\\((!B)/\\A))\\/(0\\/(!Q))))))'
        ],
        incorrectDisjunctiveNormalForms: [
            '(!(A\\/B))',
            '(A\\/(B//\\(C\\/D)))',
            '((A/\\A)\\/B)',
            '((A\\/B)/\\(B\\/A))',
            '((A/\\(B/\\C))\\/(A/\\(!A)))'
        ]
    }

    function tests() {
        const testFormulae = Object.fromEntries([
            ...testParams.correctFormulae.map(formula => [formula, true]),
            ...testParams.incorrectFormulae.map(formula => [formula, false])
        ]);

        const testDisjunctiveForms = Object.fromEntries([
            ...testParams.correctDisjunctiveNormalForms.map(formula => [formula, true]),
            ...testParams.incorrectDisjunctiveNormalForms.map(formula => [formula, false])
        ]);

        const overallTestsQuantity = Object.keys(testFormulae).length + Object.keys(testDisjunctiveForms).length;
        let testsPassed = 0;
        for (let formula in testFormulae) {
            const expected = testFormulae[formula];
            const actual = isFormula(formula);
            if (actual === expected) {
                testsPassed++;
            } else {
                console.log(`TEST FAIL\nformula: ${formula}\nexpected: ${expected}\ngot: ${actual}`);
            }
        }
        for (let formula in testDisjunctiveForms) {
            const expected = testDisjunctiveForms[formula];
            const actual = isDisjunctiveNormalForm(formula);
            if (actual === expected) {
                testsPassed++;
            } else {
                console.log(`TEST FAIL\nformula: ${formula}\nexpected: ${expected ? "is DNF" : "isn't DNF"}\ngot: ${actual ? "is DNF" : "isn't DNF"}`);
            }
        }

        console.log(`\nTests passed: ${testsPassed}/${overallTestsQuantity}`);
    }

    function userKnowledgeTest() {
        const maxGrade = 10;
        const testSections = [
            {
                question: 'Является ли предложенная строка формулой сокращённого языка логики высказываний?',
                tasks: shuffle([
                    ...testParams.correctFormulae.map(formula => [formula, true]),
                    ...testParams.incorrectFormulae.map(formula => [formula, false])
                ])
            },
            {
                question: 'Является ли предложенная формула сокращённого языка логики высказываний ДНФ?',
                tasks: shuffle([
                    ...testParams.correctDisjunctiveNormalForms.map(formula => [formula, true]),
                    ...testParams.incorrectDisjunctiveNormalForms.map(formula => [formula, false])
                ])
            }
        ];

        let questionsAnsweredCorrectly = 0;
        const overallTasks = testSections.reduce((acc, section) => acc + section.tasks.length, 0);
        testSections.forEach(section => {
            section.tasks.forEach(task => {
                const answer = confirm(`${section.question}\n\n${task[0]}`);
                if (answer === task[1]) questionsAnsweredCorrectly++;
            });
        });
        alert(`Вы ответили правильно на ${questionsAnsweredCorrectly} из ${overallTasks} вопросов
             \nВаша оценка: ${Math.round(maxGrade * questionsAnsweredCorrectly / overallTasks)}/${maxGrade}`);
    }

    function shuffle(array) {
        return array.sort(() => 0.5 - Math.random());
    }

    return {
        tests,
        userKnowledgeTest,
        isFormula,
        isDisjunctiveNormalForm
    }
})();

document.getElementById('is-formula').addEventListener('click', () => {
    alert(parserModule.isFormula(prompt('Введите строку')));
});

document.getElementById('is-dnf').addEventListener('click', () => {
    alert(parserModule.isDisjunctiveNormalForm(prompt('Введите формулу')));
});