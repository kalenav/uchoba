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
