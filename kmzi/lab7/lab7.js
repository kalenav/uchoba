class BinaryUtils {
    static binaryArrayToDecimal(binaryArray) {
        return binaryArray.reverse().reduce((acc, el, index) => acc + el * Math.pow(2, index), 0);
    }
}

class BinaryNumber {
    constructor(decimalNumber) {
        this._number = [];
        let numberRemainder = decimalNumber;
        while (numberRemainder > 0) {
            this._number.unshift(numberRemainder % 2);
            numberRemainder = Math.floor(numberRemainder / 2);
        }
    }

    binary() {
        return [...this._number];
    }

    decimal() {
        return BinaryUtils.binaryArrayToDecimal(this.binary());
    }
}

class RijndaelFieldElement {
    _definingPolynomialBinary = new BinaryNumber(282);

    constructor(binaryNumber) {
        this.binaryRepresentation = binaryNumber;
    }

    multiply(multiplier) {
        return new RijndaelFieldElement(new BinaryNumber(
            (this.binaryRepresentation.decimal() * multiplier.binaryRepresentation.decimal()) % this._definingPolynomialBinary.decimal()
        ));
    }

    stringRepr() {
        return this.binaryRepresentation
            .binary()
            .map((binaryDigit, index) => ({ index, include: binaryDigit === 1 }))
            .filter(obj => obj.include)
            .map(obj => `x^${7 - obj.index}`)
            .join(' + ');
    }
}

const r1 = new RijndaelFieldElement(new BinaryNumber(0xE4));
const r2 = new RijndaelFieldElement(new BinaryNumber(0x11));
console.log(r1.multiply(r2).stringRepr());