// уравнение вида: max({ x1*c1, x2*c2, ..., xn*cn }) = m
class MaxEquation {
    _variableToCoefficientMap;
    _mustBeEqualTo;

    constructor({ variableToCoefficientMap, mustBeEqualTo }) {
        this._variableToCoefficientMap = variableToCoefficientMap;
        this._mustBeEqualTo = mustBeEqualTo;
    }

    solve() {
        return this.variables
            .map(variable => this._getVariableToIntervalMap(variable))
            .filter(map => map.size > 1);
    }

    _getVariableToIntervalMap(mainVariable) {
        const variableToIntervalMap = new Map();
        let unsolvable = false;

        this.variables.forEach((variable, index) => {
            const currVariableUpperBound = this._solveLinearEquation(this._coefficients[index]);
            if (variable === mainVariable && currVariableUpperBound > 1) {
                unsolvable = true;
            }

            if (variable === mainVariable) {
                variableToIntervalMap.set(mainVariable, new Interval({ from: currVariableUpperBound, to: 1, closed: true }));
            } else {
                variableToIntervalMap.set(variable, new Interval({ from: 0, to: currVariableUpperBound, includingTo: false }));
            }
        });

        return unsolvable ? new Map() : variableToIntervalMap;
    }

    _solveLinearEquation(a, b = -this._mustBeEqualTo) { // ax + b = 0
        return (-b) / a;
    }

    get variables() {
        return [...this._variableToCoefficientMap.keys()];
    }

    get _coefficients() {
        return [...this._variableToCoefficientMap.values()];
    }
}