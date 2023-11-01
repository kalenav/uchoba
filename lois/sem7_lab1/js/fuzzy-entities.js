/////////////////////////////////////////////////////////
// Лабораторная работа №1 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентами группы 021702 БГУИР Локтевым Константином Алексеевичем, Мохаммади Арианой, Макаревич Кариной Сергеевной
// Файл с описанием структур данных, описывающих: нечеткую величину, нечеткое множество, предикат прямого логического вывода
// 01.11.2023

class FuzzyValue {
    constructor(value) {
        this.value = Math.min(1, Math.max(0, value)); // значение нечеткой величины должно быть в закрытом интервале от 0 до 1
    }
}

class FuzzySet extends Set {
    add(element, fuzzyValue) {
        for (const item of this) {
            if (item[0] === element) {
                return;
            }
        }
        super.add([element, new FuzzyValue(fuzzyValue)]);
    }
}

class ImplicationPredicate extends FuzzySet {
    constructor({ set1, set2, implication }) {
        super();

        for (const elementFromSet1 of set1) {
            for (const elementFromSet2 of set2) {
                // для каждой пары элемента из первого множества и элемента из второго множества...
                // ...следует добавить в предикат пару, первый элемент которой - ...
                this.add(
                    [elementFromSet1[0], elementFromSet2[0]], // ...это собственно пара элементов, а второй элемент которой - ...
                    implication(elementFromSet1[1], elementFromSet2[1]).value // ...значение импликации соответствующих этим элементам нечетких величин
                );
            }
        }
    }

    // множество всех вторых элементов пар предиката
    get image() {
        const image = new Set();

        for (const item of this) {
            image.add(item[0][1]);
        }

        return image;
    }
}