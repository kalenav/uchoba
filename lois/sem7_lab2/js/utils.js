// Лабораторная работа №2 по дисциплине "Логические основы интеллектуальных систем"
// Выполнена студентами группы 021702 БГУИР Локтевым Константином Алексеевичем, Мохаммади Арианой, Макаревич Кариной Сергеевной
// Файл с описанием вспомогательных функций
// 17.12.2023

/**
 * @description Gets all possible row element combinations of a 2D array.
 * @param {T[]} array - the array to get the combinations of.
 * @param {} currRow - a recursion parameter.
 * @param {} result - a recursion parameter.
 * @param {} currentCombination - a recursion parameter.
 * @returns {T[][]} all possible arrays in which each element is in the corresponding row of a 2D array.
 * @example
 * const arr = [[1, 2], [3], [4, 5, 6]];
 * get2dArrayRowElementCombinations(arr) // [[1, 3, 4], [1, 3, 5], [1, 3, 6], [2, 3, 4], [2, 3, 5], [2, 3, 6]]
 */
function get2dArrayRowElementCombinations(array, currRow = 0, result = [], currentCombination = []) {
    if (currRow === array.length) {
        result.push(currentCombination);
        return;
    }

    array[currRow].forEach(item => {
        get2dArrayRowElementCombinations(array, currRow + 1, result, currentCombination.concat(item));
    });

    return result;
}

function equationSolutionStringRepresentation(solution) {
    return [...solution.values()]
        .map(interval => `${interval}`)
        .join('×');
}

function equationSystemSolutionStringRepresentation(solutions) {
    if (solutions.length === 0) {
        return 'обратный вывод невозможен';
    }
    const variables = [...solutions[0].keys()];
    return `<${
        variables.map(variable => `X(${variable})`).join(', ')
    }> ∊ \n\n${
        solutions.map(solution => `(${equationSolutionStringRepresentation(solution)})`).join('\n∪')
    }`
}