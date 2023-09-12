const linearAlgebraModule = (function () {
    class Vector {
        constructor(array) {
            this._vector = [...array];
        }

        dotProduct(vector) {
            return this._vector
                .map((el, index) => el * vector.getElementAt(index))
                .reduce((acc, el) => acc + el, 0);
        }

        getElementAt(index) {
            return this._vector[index];
        }
    }

    class Matrix {
        constructor(height, width, fillWith = 0) {
            this._height = height;
            this._width = width;
            this._matrix = [];
            for (let row = 0; row < height; row++) {
                this._matrix.push(new Array(width).fill(fillWith));
            }
        }

        getElementAt(i, j) {
            return this._matrix[i - 1][j - 1];
        }

        setElementAt(i, j, value) {
            this._matrix[i - 1][j - 1] = value;
        }

        setElements(arrayOfArrays) {
            this._height = arrayOfArrays.length;
            this._width = arrayOfArrays[0].length;
            this._matrix = arrayOfArrays.map(row => row.slice());
        }

        getRowAt(i) {
            return [...this._matrix[i - 1]];
        }

        getColumnAt(j) {
            return this._matrix.map((row, rowIndex) => this.getElementAt(rowIndex + 1, j));
        }

        add(matrix) {
            const sum = new Matrix(this._height, this._width, 0);

            for (let i = 1; i <= this._height; i++) {
                for (let j = 1; j <= this._width; j++) {
                    sum.setElementAt(i, j, this.getElementAt(i, j) + matrix.getElementAt(i, j));
                }
            }

            return sum;
        }

        multiply(secondMatrix) {
            const product = new Matrix(this._height, secondMatrix.width);

            for (let rowIndex = 1; rowIndex <= this._height; rowIndex++) {
                for (let columnIndex = 1; columnIndex <= secondMatrix._width; columnIndex++) {
                    const currFirstMatrixRow = this.getRowAt(rowIndex);
                    const currSecondMatrixColumn = secondMatrix.getColumnAt(columnIndex);
                    product.setElementAt(
                        rowIndex,
                        columnIndex,
                        new Vector(currFirstMatrixRow).dotProduct(new Vector(currSecondMatrixColumn))
                    );
                }
            }

            return product;
        }

        get height() { return this._height; }

        get width() { return this._width; }
    }

    return {
        Matrix
    }
})();
const Matrix = linearAlgebraModule.Matrix;

const ReusableEntities = (function () {
    const hermiteMatrix = new Matrix(4, 4);
    hermiteMatrix.setElements([
        [2, -2, 1, 1],
        [-3, 3, -2, -1],
        [0, 0, 1, 0],
        [1, 0, 0, 0]
    ]);

    const bezierMatrix = new Matrix(4, 4);
    bezierMatrix.setElements([
        [-1, 3, -3, 1],
        [3, -6, 3, 0],
        [-3, 3, 0, 0],
        [1, 0, 0, 0]
    ]);

    const vSplineMatrix = new Matrix(4, 4);
    vSplineMatrix.setElements([
        [-1/6, 1/2, -1/2, 1/6],
        [1/2, -1, 1/2, 0],
        [-1/2, 0, 1/2, 0],
        [1/6, 2/3, 1/6, 0]
    ]);

    return {
        hermiteMatrix,
        bezierMatrix,
        vSplineMatrix
    }
})();