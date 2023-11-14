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

    static randomIntegerFromInterval(from, to) {
        return Math.round(Math.random() * (to - from)) + from;
    }
}

class StackElem {
    _data;
    _nextElem;

    constructor(data, nextElem = null) {
        this._data = data;
        this._nextElem = nextElem;
    }

    get data() {
        return this._data;
    }

    get next() {
        return this._nextElem;
    }
}

class Stack {
    _head;

    constructor(head = null) {
        this._head = head;
    }

    push(data) {
        if (this._head === null) {
            this._head = new StackElem(data);
        } else {
            this._head = new StackElem(data, this._head);
        }
    }

    pop() {
        if (this._head === null) {
            return null;
        }
        const dataToReturn = this._head.data;
        this._head = this._head.next;
        return dataToReturn;
    }

    get(positionFromTop) { // counting from 1
        let nodeToGetDataFrom = this._head;

        for (let i = 1; i < positionFromTop; i++) {
            if (nodeToGetDataFrom === null) {
                return null;
            }
            nodeToGetDataFrom = nodeToGetDataFrom.next;
        }

        return nodeToGetDataFrom.data;
    }

    get empty() {
        return this._head === null;
    }
}