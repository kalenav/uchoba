class Utils {
    static arrayOfSubarrays(array) {
        const subarrays = [];

        const subarraysQuantity = 2 ** array.length;
        for (let currElementCombination_decimal = 0; currElementCombination_decimal < subarraysQuantity; currElementCombination_decimal++) {
            const currElementCombination_binaryString = currElementCombination_decimal.toString(2).padStart(array.length, '0');
            subarrays.push(array.filter((element, index) => currElementCombination_binaryString[index] === '1'));
        }

        return subarrays.sort((subarr1, subarr2) => subarr1.length - subarr2.length);
    }
}