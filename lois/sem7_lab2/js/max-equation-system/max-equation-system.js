class MaxEquationSystem {
    _maxEquations;

    constructor(maxEquations) {
        this._maxEquations = maxEquations.slice();
    }

    solve() {
        const solutionVariableToIntervalMaps = [];

        this._getAllEquationSolutionCombinations()
            .forEach(solutionCombination => solutionVariableToIntervalMaps.push(this._intersectIntervalMaps(solutionCombination)));

        return solutionVariableToIntervalMaps.filter(variableToIntervalMap => {
            return [...variableToIntervalMap.values()].every(interval => !interval.isEmpty);
        });
    }

    _intersectIntervalMaps(maps) {
        const intersection = new Map();

        maps.forEach(currMap => currMap.forEach((interval, variable) => {
            intersection.set(
                variable,
                intersection.has(variable) ? intersection.get(variable).intersection(interval) : interval
            );
        }));

        return intersection;
    }

    _getAllEquationSolutionCombinations() {
        const equationWiseSolutions = this._maxEquations.map(equation => equation.solve());
        if (equationWiseSolutions.some(solution => solution.length === 0)) {
            return [];
        }

        return get2dArrayRowElementCombinations(equationWiseSolutions);
    }
    // предполагается, что все уравнения имеют одни и те же переменные в одном и том же порядке
    get _variables() {
        return this._maxEquations[0].variables;
    }

    get _equationsQuantity() {
        return this._maxEquations.length;
    }
}