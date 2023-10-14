class FuzzyValue {
    public readonly value: number;

    constructor(value: number) {
        this.value = Math.min(1, Math.max(0, value));
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

    public static implication(val1: FuzzyValue, val2: FuzzyValue): FuzzyValue {
        return new FuzzyValue(val1.value === 0 ? 1 : Math.max(1, val2.value / val1.value));
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

    const firstSetAsArray: Array<FuzzyEntity> = [...set1];
    const secondSetAsArray: Array<FuzzyEntity> = [...set2];
    firstSetAsArray.forEach((entityFromSet1: FuzzyEntity, index1: number) => {
        implicationMatrix[index1] = [];
        secondSetAsArray.forEach((entityFromSet2: FuzzyEntity, index2: number) => {
            implicationMatrix[index1][index2] = {
                fuzzyValue: FuzzyOperations.implication(entityFromSet1.fuzzyValue, entityFromSet2.fuzzyValue),
                entityFromSet1,
                entityFromSet2
            }
        });
    });

    return implicationMatrix;
}

function directFuzzyLogicalConclusion(premise: FuzzySet, implicationMatrix: ImplicationMatrix): FuzzySet {
    const consequence: FuzzySet = new FuzzySet();

    for (let columnIndex = 0; columnIndex < implicationMatrix[0].length; columnIndex++) {
        const currConsequenceFuzzyEntityData: unknown = implicationMatrix[0][columnIndex].entityFromSet2.data;
        let maxInCurrColumn = 0;
        for (let rowIndex = 0; rowIndex < implicationMatrix.length; rowIndex++) {
            const currImplicationMatrixElement: ImplicationMatrixElement = implicationMatrix[rowIndex][columnIndex];
            const conjunctionResult: FuzzyValue = FuzzyOperations.tNorm(
                currImplicationMatrixElement.fuzzyValue,
                (premise.find((element: FuzzyEntity) => element.data === currImplicationMatrixElement.entityFromSet1.data))?.fuzzyValue ?? new FuzzyValue(0)
            );
            if (conjunctionResult.value > maxInCurrColumn) {
                maxInCurrColumn = conjunctionResult.value;
            }
        }
        consequence.add(new FuzzyEntity(currConsequenceFuzzyEntityData, new FuzzyValue(maxInCurrColumn)));
    }

    return consequence;
}

const set1: FuzzySet = new FuzzySet();
set1.add(new FuzzyEntity('x1', new FuzzyValue(0)));
set1.add(new FuzzyEntity('x2', new FuzzyValue(0.3)));
set1.add(new FuzzyEntity('x3', new FuzzyValue(0.6)));
set1.add(new FuzzyEntity('x4', new FuzzyValue(1)));

const set2: FuzzySet = new FuzzySet();
set2.add(new FuzzyEntity('y1', new FuzzyValue(0)));
set2.add(new FuzzyEntity('y2', new FuzzyValue(0.5)));
set2.add(new FuzzyEntity('y3', new FuzzyValue(0.8)));
set2.add(new FuzzyEntity('y4', new FuzzyValue(1)));

const set3: FuzzySet = new FuzzySet();
set3.add(new FuzzyEntity('x1', new FuzzyValue(0.5)));
set3.add(new FuzzyEntity('x2', new FuzzyValue(0.3)));
set3.add(new FuzzyEntity('x3', new FuzzyValue(0.2)));
set3.add(new FuzzyEntity('x4', new FuzzyValue(0.5)));

const implicationMatrix: ImplicationMatrix = getImplicationMatrix(set1, set2);
console.log(directFuzzyLogicalConclusion(set1, implicationMatrix));