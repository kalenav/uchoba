/////////////////////////////////////////////////////////
// Лабораторная работа №2 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентами группы 021702 БГУИР Локтевым Константином Алексеевичем, Мохаммади Арианой, Макаревич Кариной Сергеевной
// Файл с описанием структур данных, описывающих: нечеткую величину, нечеткое множество
// 19.12.2023

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

    get(element) {
        for (const item of this) {
            if (item[0] === element) {
                return item[1];
            }
        }
        return 0;
    }

    // множество всех первых элементов пар предиката
    get preimage() {
        const preimage = new Set();

        for (const item of this) {
            preimage.add(item[0][0]);
        }

        return preimage;
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