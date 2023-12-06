function inverseFuzzyLogicalConclusion(predicate, consequence) {
    const premise = new FuzzySet();

    for (const premiseElement of predicate.preimage) {
        let currMax = 0;

        for (const predicateElement of predicate) {
            if (predicateElement[0][0] === premiseElement) {
                currMax = Math.max(currMax, predicateElement[1].value * consequence.get(predicateElement[0][1]).value);
            }
        }

        premise.add(premiseElement, currMax);
    }

    return premise;
}