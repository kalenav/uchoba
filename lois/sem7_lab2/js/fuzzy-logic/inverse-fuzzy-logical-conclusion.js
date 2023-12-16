function inverseFuzzyLogicalConclusion(predicate, consequence) {
    const maxEquations = [];

    const variables = [...predicate.preimage];
    for (const consequenceElement of consequence) {
        const currMaxEquationVariableToCoefficientMap = new Map();
        for (const variable of variables) {
            for (const pair of predicate) {
                if ((pair[0][0] === variable) && (pair[0][1] === consequenceElement[0])) {
                    currMaxEquationVariableToCoefficientMap.set(variable, pair[1].value);
                    break;
                }
            }
        }

        maxEquations.push(new MaxEquation({
            variableToCoefficientMap: currMaxEquationVariableToCoefficientMap,
            mustBeEqualTo: consequenceElement[1].value
        }));
    }

    return new MaxEquationSystem(maxEquations).solve();
}