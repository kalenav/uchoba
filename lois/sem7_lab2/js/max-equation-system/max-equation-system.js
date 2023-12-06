class MaxEquationSystem {
    _maxEquations;

    constructor(maxEquations) {
        this._maxEquations = maxEquations.slice();
    }

    solve() {
        const solutionVariableToIntervalMaps = [];

        this._getAllEquationSolutionCombinations()
            .forEach(solutionCombination => solutionVariableToIntervalMaps.push(this._intersectIntervalMaps(solutionCombination)));

        return solutionVariableToIntervalMaps;
    }

    _intersectIntervalMaps(maps) {
        const intersection = new Map();

        maps.forEach(currMap => currMap.forEach((interval, variable) => {
            if (intersection.has(variable)) {
                intersection.set(variable, intersection.get(variable).intersection(interval));
            } else {
                intersection.set(variable, interval);
            }
        }));

        return intersection;
    }

    _getAllEquationSolutionCombinations() {
        const allSolutionCombinations = [];

        const equationWiseSolutions = this._maxEquations.map(equation => equation.solve());

        for (let currCombinationAsNumber = 0; currCombinationAsNumber < this._totalIndividualSolutions; currCombinationAsNumber++) {
            const currCombinationAsString = Number(currCombinationAsNumber).toString(this._solutionsPerEquation).padStart(this._equationsQuantity, '0');
            const currEquationSolutionCombination = equationWiseSolutions.map((equationSolution, index) => {
                const individualSolutionToTakeIndex = parseInt(currCombinationAsString[index], this._solutionsPerEquation);
                return equationSolution[individualSolutionToTakeIndex];
            });

            allSolutionCombinations.push(currEquationSolutionCombination);
        }

        return allSolutionCombinations;
    }

    // предполагается, что все уравнения имеют одни и те же переменные в одном и том же порядке
    get _variables() {
        return this._maxEquations[0].variables;
    }

    get _equationsQuantity() {
        return this._maxEquations.length;
    }

    get _solutionsPerEquation() {
        return this._variables.length;
    }

    get _totalIndividualSolutions() {
        return this._equationsQuantity * this._solutionsPerEquation;
    }
}