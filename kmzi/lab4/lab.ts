function permute<T = unknown>(array: Array<T>): Array<T> {
    const permutation: Array<T> = array.slice();
    permutation.sort((el: T) => Math.random() - 0.5);
    return permutation;
}

class Permutation<T> {
    public readonly upperRow: Array<T>;
    public readonly lowerRow: Array<T>;

    constructor(upperRow: Array<T>, lowerRow: Array<T>) {
        this.upperRow = upperRow;
        this.lowerRow = lowerRow;
    }

    public toString(): string {
        let stringified: string = "";

        stringified += this.upperRow.map((el: T) => `${el}`).join(' ');
        stringified += '\n';
        stringified += new Array(this.length).fill('|').join(' ');
        stringified += '\n';
        stringified += this.lowerRow.map((el: T) => `${el}`).join(' ');

        return stringified;
    }

    private get length(): number {
        return this.upperRow.length;
    }
}

const seed: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(`${new Permutation<number>(seed, permute(seed))}`);