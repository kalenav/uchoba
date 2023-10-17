/////////////////////////////////////////////////////////
// Лабораторная работа №1 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентами группы 021702 БГУИР Локтевым Константином Алексеевичем, Макаревич Кариной Сергеевной, Мохаммади Арианой
// Файл с описанием:
// - структур данных, описывающих нечёткие величины, нечёткие сущности и нечёткие множества;
// - нечётких операций;
// - алгоритма вычисления матрицы импликации на основании двух нечётких множеств;
// - алгоритма вычисления результатов нечёткого логического вывода на основании посылки и матрицы импликации.
// 17.10.2023

class FuzzyValue {
    public readonly value: number;

    constructor(value: number) {
        this.value = Math.min(1, Math.max(0, value)); // нечёткая величина должна быть в промежутке от 0 до 1
    }
}

class FuzzyEntity {
    public readonly data: unknown;
    public readonly fuzzyValue: FuzzyValue;

    constructor(data: unknown, fuzzyValue: FuzzyValue) {
        this.data = data;
        this.fuzzyValue = fuzzyValue;
    }
}

class FuzzySet extends Set<FuzzyEntity> {
    public find(predicate: (element: FuzzyEntity) => boolean): FuzzyEntity | null {
        for (const item of this) {
            if (predicate(item)) {
                return item;
            }
        }

        return null;
    }
}

class FuzzyOperations {
    public static tNorm(val1: FuzzyValue, val2: FuzzyValue): FuzzyValue {
        return new FuzzyValue(val1.value * val2.value);
    }

    public static implication(val1: FuzzyValue, val2: FuzzyValue): FuzzyValue { // импликация Гогена
        return new FuzzyValue(val1.value === 0 ? 1 : Math.min(1, val2.value / val1.value));
    }
}

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////

interface ImplicationMatrixElement {
    fuzzyValue: FuzzyValue,
    entityFromSet1: FuzzyEntity,
    entityFromSet2: FuzzyEntity
};
type ImplicationMatrix = Array<Array<ImplicationMatrixElement>>;

function getImplicationMatrix(set1: FuzzySet, set2: FuzzySet): ImplicationMatrix {
    const implicationMatrix: ImplicationMatrix = [];

    const firstSetAsArray: Array<FuzzyEntity> = [...set1]; // нечёткие множества удобно приводить к списковому виду, так как...
    const secondSetAsArray: Array<FuzzyEntity> = [...set2]; // ...строки и столбцы матрицы импликации должны соответствовать одним и тем же нечётким сущностям
    firstSetAsArray.forEach((entityFromSet1: FuzzyEntity, index1: number) => {
        implicationMatrix[index1] = [];
        secondSetAsArray.forEach((entityFromSet2: FuzzyEntity, index2: number) => {
            implicationMatrix[index1][index2] = {
                fuzzyValue: FuzzyOperations.implication(entityFromSet1.fuzzyValue, entityFromSet2.fuzzyValue),
                entityFromSet1, // следует запоминать, какой именно комбинации элементов посылки и консеквента соответствует текущий элемент матрицы импликации,...
                entityFromSet2 // ...так как в общем случае порядок элементов посылки будет отличаться от того, который был в посылке при вычислении матрицы импликации 
            }
        });
    });

    return implicationMatrix;
}

function directFuzzyLogicalConclusion(premise: FuzzySet, implicationMatrix: ImplicationMatrix): FuzzySet {
    const consequence: FuzzySet = new FuzzySet();

    for (let columnIndex = 0; columnIndex < implicationMatrix[0].length; columnIndex++) {
        const currConsequenceFuzzyEntityData: unknown = implicationMatrix[0][columnIndex].entityFromSet2.data; // весь столбец соответствует одному элементу консеквента
        let maxInCurrColumn = 0;
        for (let rowIndex = 0; rowIndex < implicationMatrix.length; rowIndex++) {
            const currImplicationMatrixElement: ImplicationMatrixElement = implicationMatrix[rowIndex][columnIndex];
            const conjunctionResult: FuzzyValue = FuzzyOperations.tNorm(
                currImplicationMatrixElement.fuzzyValue,
                (premise.find((element: FuzzyEntity) => element.data === currImplicationMatrixElement.entityFromSet1.data))?.fuzzyValue ?? new FuzzyValue(0)
                // ^^^ если в посылке есть элементы, которых не было в посылке при вычислении матрицы импликации,...
                // ...на соответствующих им позициях результирующей матрицы будет стоять нуль. таким образом,...
                // ...такие элементы не влияют на результат вывода
            );
            maxInCurrColumn = Math.max(maxInCurrColumn, conjunctionResult.value);
        }
        consequence.add(new FuzzyEntity(currConsequenceFuzzyEntityData, new FuzzyValue(maxInCurrColumn)));
    }

    return consequence;
}

const set1: FuzzySet = new FuzzySet();
set1.add(new FuzzyEntity('x1', new FuzzyValue(0.3)));
set1.add(new FuzzyEntity('x2', new FuzzyValue(0.3)));
set1.add(new FuzzyEntity('x3', new FuzzyValue(0.6)));
set1.add(new FuzzyEntity('x4', new FuzzyValue(1)));

const set2: FuzzySet = new FuzzySet();
set2.add(new FuzzyEntity('y1', new FuzzyValue(0.1)));
set2.add(new FuzzyEntity('y2', new FuzzyValue(0.2)));
set2.add(new FuzzyEntity('y3', new FuzzyValue(0.3)));
set2.add(new FuzzyEntity('y4', new FuzzyValue(0.5)));

const set3: FuzzySet = new FuzzySet();
set3.add(new FuzzyEntity('x1', new FuzzyValue(0.5)));
set3.add(new FuzzyEntity('x2', new FuzzyValue(0.5)));
set3.add(new FuzzyEntity('x3', new FuzzyValue(0.5)));
set3.add(new FuzzyEntity('x4', new FuzzyValue(0.5)));

const implicationMatrix: ImplicationMatrix = getImplicationMatrix(set1, set2);
console.log(directFuzzyLogicalConclusion(set3, implicationMatrix));