/////////////////////////////////////////////////////////
// Лабораторная работа №2 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентами группы 021702 БГУИР Локтевым Константином Алексеевичем, Мохаммади Арианой, Макаревич Кариной Сергеевной
// Файл с описанием функционала графического интерфейса
// 17.12.2023

const setListContainer = document.getElementById('set-list');
const predicateListContainer = document.getElementById('predicate-list');
const addSetButton = document.getElementById('add-set');
const addPredicateButton = document.getElementById('add-predicate');
const conclusionButton = document.getElementById('conclusion');
const resultBlock = document.getElementById('prev-result');

class ViewUtils {
    static tag({
        name,
        attributes = {},
        child = null,
        children = [],
        eventListeners = {},
        text = ""
    }) {
        const tag = document.createElement(name);
        for (let attribute in attributes) {
            tag.setAttribute(attribute, attributes[attribute]);
        }
        for (let eventName in eventListeners) {
            tag.addEventListener(eventName, eventListeners[eventName]);
        }
        if (child) tag.appendChild(child);
        children.forEach(child => tag.appendChild(child));
        if (text) {
            tag.append(text);
        }
        return tag;
    }
}

class FuzzyEntityToTextUtils {
    static getTextOfFuzzyElement(fuzzyElement) {
        return `<${fuzzyElement[0]}, ${fuzzyElement[1].value}>`
    }

    static getTextOfFuzzyPair(fuzzyPair) {
        return `<<${fuzzyPair[0][0]}, ${fuzzyPair[0][1]}>, ${fuzzyPair[1].value}>`;
    }

    static getTextOfFuzzySet(fuzzySet, inline = false) {
        const separator = inline ? " " : "\n";
        return "{"
            + separator
            + [...fuzzySet].map(element => FuzzyEntityToTextUtils.getTextOfFuzzyElement(element)).join(`,${separator}`)
            + separator
            + "}";
    }

    static getTextOfFuzzyPredicate(fuzzyPredicate, inline = false) {
        const separator = inline ? " " : "\n";
        return "{"
            + separator
            + [...fuzzyPredicate].map(element => FuzzyEntityToTextUtils.getTextOfFuzzyPair(element)).join(`,${separator}`)
            + separator
            + "}";
    }
}

const sets = new Map();
const predicates = new Map();

function redisplayLists() {
    setListContainer.innerHTML = "";
    [...sets.entries()].forEach(nameSetPair => {
        setListContainer.appendChild(ViewUtils.tag({
            name: "li",
            text: `${nameSetPair[0]}: ${FuzzyEntityToTextUtils.getTextOfFuzzySet(nameSetPair[1], true)}`
        }));
    });

    predicateListContainer.innerHTML = "";
    [...predicates.entries()].forEach(namePredicatePair => {
        predicateListContainer.appendChild(ViewUtils.tag({
            name: "li",
            text: `${namePredicatePair[0]}: ${FuzzyEntityToTextUtils.getTextOfFuzzyPredicate(namePredicatePair[1], true)}`
        }));
    });
}

function setResultText(text) {
    resultBlock.innerText = text;
}

addSetButton.addEventListener('click', () => {
    const newSet = new FuzzySet();

    const name = prompt("Введите наименование множества");
    while(true) {
        const data = prompt('Введите сущность');
        if (data === null) {
            break;
        }
        const fuzzyValue = prompt('Введите значение соответствующей нечеткой величины');
        if (isNaN(fuzzyValue)) {
            continue;
        }
        newSet.add(data, fuzzyValue);
    }

    sets.set(name, newSet);
    redisplayLists();
});

addPredicateButton.addEventListener('click', () => {
    const predicate = new FuzzySet();

    const name = prompt("Введите наименование предиката");
    while (true) {
        const el1Name = prompt("Введите наименование первого элемента пары");
        const el2Name = prompt("Введите наименование второго элемента пары");
        const fuzzyValue = prompt('Введите значение соответствующей нечеткой величины');
        if (isNaN(fuzzyValue)) {
            continue;
        }
        predicate.add([el1Name, el2Name], fuzzyValue);
        if (!confirm('Добавить ещё одну сущность?')) {
            break;
        }
    }

    predicates.set(name, predicate);
    redisplayLists();
});

conclusionButton.addEventListener('click', () => {
    let predicateName;
    while (![...predicates.keys()].includes(predicateName)) {
        predicateName = prompt("Введите наименование предиката-правила");
    }
    let consequenceName;
    while (![...sets.keys()].includes(consequenceName)) {
        consequenceName = prompt("Введите наименование множества-следствия");
    }

    setResultText(equationSystemSolutionStringRepresentation(inverseFuzzyLogicalConclusion(predicates.get(predicateName), sets.get(consequenceName))));
});

///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////

function initMockSets() {
    const set1 = new FuzzySet();
    set1.add('x1', 0.3);
    set1.add('x2', 0.5);
    set1.add('x3', 0.2);
    set1.add('x4', 1);

    const set2 = new FuzzySet();
    set2.add('y1', 0.5);
    set2.add('y2', 0.8);
    set2.add('y3', 0.4);

    const set3 = new FuzzySet();
    set3.add('x1', 1);
    set3.add('x2', 0);
    set3.add('x4', 0.5);
    set3.add('x5', 0.8);

    const set4 = new FuzzySet();
    set4.add('x1', 0.5);
    set4.add('x2', 0.4);

    const set5 = new FuzzySet();
    set5.add('y', 0.2);

    const set6 = new FuzzySet();
    set6.add('y', 0.5);

    const set7 = new FuzzySet();
    set7.add('y', 0.8);

    const set8 = new FuzzySet();
    set8.add('y1', 0.4);
    set8.add('y2', 0.2);
    set8.add('y3', 0.3);
    set8.add('y4', 0.1);

    const rule1 = new FuzzySet();
    rule1.add(['x1', 'y'], 0.4);
    rule1.add(['x2', 'y'], 0.5);

    const rule2 = new FuzzySet();
    rule2.add(['x1', 'y1'], 0.1);
    rule2.add(['x2', 'y1'], 0.8);
    rule2.add(['x3', 'y1'], 0.8);
    rule2.add(['x4', 'y1'], 0.8);
    rule2.add(['x1', 'y2'], 0.4);
    rule2.add(['x2', 'y2'], 0.1);
    rule2.add(['x3', 'y2'], 0.4);
    rule2.add(['x4', 'y2'], 0.4);
    rule2.add(['x1', 'y3'], 0.6);
    rule2.add(['x2', 'y3'], 0.6);
    rule2.add(['x3', 'y3'], 0.1);
    rule2.add(['x4', 'y3'], 0.6);
    rule2.add(['x1', 'y4'], 0.2);
    rule2.add(['x2', 'y4'], 0.2);
    rule2.add(['x3', 'y4'], 0.2);
    rule2.add(['x4', 'y4'], 0.1);

    sets.set("A", set1);
    sets.set("B", set2);
    sets.set("C", set3);
    sets.set("X", set4);
    sets.set("Y", set5);
    sets.set("Y2", set6);
    sets.set("Y3", set7);
    sets.set("Y4", set8);

    predicates.set("P1", rule1);
    predicates.set("P2", rule2);
}

initMockSets();
redisplayLists();