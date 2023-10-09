const matrixModule = (() => {
    function multiplyMatrices(matrix1, matrix2) {
        try {
            if (matrix1[0].length !== matrix2.length) {
                throw `Invalid multiplied matrix size; matrix1 width = ${matrix1[0].length}, matrix2 height = ${matrix2.length}`;
            }
        }
        catch(err) {
            throw err;
        }

        const product = [];
        const rows = matrix1.length;
        const columns = matrix2[0].length;
        for(let i = 0; i < rows; i++) {
            product.push(new Array(columns));
            for(let j = 0; j < columns; j++) {
                product[i][j] = multiplyIthRowAndJthColumn(matrix1, matrix2, i, j);
            }
        }

        return product;
    }

    function multiplyIthRowAndJthColumn(matrix1, matrix2, i, j) {
        let sum = 0;
        for(let index = 0; index < matrix1[i].length; index++) {
            sum += matrix1[i][index] * matrix2[index][j];
        }
        return sum;
    }

    function transposeMatrix(matrix) {
        const transposed = [];
        for(let j = 0; j < matrix[0].length; j++) {
            transposed.push(new Array(matrix.length));
            for(let i = 0; i < matrix.length; i++) {
                transposed[j][i] = matrix[i][j];
            }
        }
        return transposed;
    }
    
    function subtractMatrices(matrix1, matrix2) {
        const result = [];
        const height = matrix1.length;
        const width = matrix1[0].length;
        for (let i = 0; i < height; i++) {
            result.push(new Array(width));
            for(let j = 0; j < width; j++) {
                result[i][j] = matrix1[i][j] - matrix2[i][j];
            }
        }
        return result;
    }

    function normalizeByRow(weightMatrix) {
        weightMatrix.forEach((row, index) => normalizeRow(weightMatrix, index));
    }

    function normalizeByColumn(weightMatrix) {
        for(let j = 0; j < weightMatrix[0].length; j++) {
            let columnSum = 0;
            for(let i = 0; i < weightMatrix.length; i++) {
                columnSum += Math.pow(weightMatrix[i][j], 2);
            }
            const modulus = Math.sqrt(columnSum);
            for(let i = 0; i < weightMatrix.length; i++) {
                weightMatrix[i][j] /= modulus;
            }
        }
    }

    function multiplyMatrixByNumber(matrix, number) {
        const newMatrix = new Array(matrix.length).fill().map(el => new Array(matrix[0].length));
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                newMatrix[i][j] = matrix[i][j] * number;
            }
        }
        return newMatrix;
    }
    
    function normalizeRow(matrix, rowIndex) {
        const modulus = Math.sqrt(matrix[rowIndex].map(el => el * el).reduce((r, v) => r + v, 0));
        for(let j = 0; j < matrix[rowIndex].length; j++) {
            matrix[rowIndex][j] /= modulus;
        }
    }

    function getMatrixInverse(matrix) {
        const determinant = calcDeterminant(matrix); 
        const transposed = transposeMatrix(matrix);
        const inverseHeight = matrix[0].length;
        const inverseWidth = matrix.length;
        for (let i = 0; i < inverseHeight; i++) {
            for (let j = 0; j < inverseWidth; j++) {
                if ((i + j) % 2 === 0) {
                    transposed[i][j] = -transposed[i][j];
                }
            }
        }
        return multiplyMatrixByNumber(transposed, 1 / determinant);
    }
    
    function calcDeterminant(matrix) {
        try {
            if (matrix.length !== matrix[0].length) {
                throw "Non-square matrix passed to the calcDeterminant function";
            }
            if (matrix.length === 1) {
                return matrix[0][0];
            }
            else {
                let determinant = 0;
                for (let column = 0; column < matrix[0].length; column++) {
                    const currMultiplier = matrix[0][column];
                    const sign = column % 2 === 0 ? 1 : -1;
                    determinant += calcDeterminant(ignoreIthRowAndJthColumn(matrix, 0, column)) * currMultiplier * sign;
                }
                return determinant;
            }
        }
        catch(err) {
            console.error(err);
        }
    }

    function ignoreIthRowAndJthColumn(matrix, i, j) {
        const newMatrix = [];
        let skippedRow = false;
        for (let row = 0; row < matrix.length; row++) {
            if (row === i) {
                skippedRow = true;
                continue;
            }
            newMatrix.push([]);
            for (let column = 0; column < matrix[0].length; column++) {
                if (column == j) {
                    continue;
                }
                newMatrix[row - skippedRow].push(matrix[row][column]);
            }
        }
        return newMatrix;
    }

    function areVectorsLinearlyIndependent(vectors) {
        for (let i = 0; i < vectors.length; i++) {
            const currFirstComparedVector = vectors[i];
            for (let j = i + 1; j < vectors.length; j++) {
                const currSecondComparedVector = vectors[j];
                const currRatio = currFirstComparedVector[0] / currSecondComparedVector[0];
                if (currFirstComparedVector.some((el, index) => el / currSecondComparedVector[index] !== currRatio)) return true;
            }
        }
        return false;
    }

    function getRandomMatrix(height, width, zeroedMainDiagonal = true, bottomClamp = -1, topClamp = 1) {
        const matrix = new Array(height).fill().map(el => new Array(width));
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (zeroedMainDiagonal && i === j) {
                    matrix[i][j] = 0;
                    continue;
                }
                matrix[i][j] = randomNumberFromRange(bottomClamp, topClamp);
            }
        }
        return matrix;
    }

    function randomNumberFromRange(leftBound, rightBound) {
        return (rightBound - leftBound) * Math.random() + leftBound;
    }

    function applyFunctionToMatrixElements(matrix, func) {
        return matrix.map(row => row.map(el => func(el)));
    }

    return {
        multiplyMatrices,
        transposeMatrix,
        subtractMatrices,
        normalizeByRow,
        normalizeByColumn,
        multiplyMatrixByNumber,
        getMatrixInverse,
        areVectorsLinearlyIndependent,
        getRandomMatrix,
        applyFunctionToMatrixElements,
        calcDeterminant
    }
})();

const inputVectorSize = 900;

const canvasModule = (function() {
    const alphaPixelsInDimension = Math.floor(Math.sqrt(inputVectorSize));
    const alphaPixelSize = 8;
    const canvasSize = alphaPixelSize * alphaPixelsInDimension;

    const inputCanvas = document.getElementById('input');
    const outputCanvas = document.getElementById('output');
    inputCanvas.setAttribute('width', canvasSize);
    inputCanvas.setAttribute('height', canvasSize);
    outputCanvas.setAttribute('width', canvasSize);
    outputCanvas.setAttribute('height', canvasSize);

    const inputContext = inputCanvas.getContext('2d');
    const outputContext = outputCanvas.getContext('2d');

    function drawBipolarVector(vector, isInput = true) {
        if (vector.length !== Math.pow(alphaPixelsInDimension, 2)) return;
        vector.forEach((el, index) => drawAlphaPixel(index, el === 1, isInput));
    }

    function getAlphaPixelOrigin(index, size = alphaPixelSize) {
        const alphaPixelInColumnIndex = index % alphaPixelsInDimension;
        const alphaPixelInRowIndex = Math.floor(index / alphaPixelsInDimension);
        return {
            x: alphaPixelInColumnIndex * size,
            y: alphaPixelInRowIndex * size
        };
    }

    function drawAlphaPixel(index, isWhite, isInput = true) {
        const ctx = (isInput ? inputContext : outputContext);
        const imageData = ctx.createImageData(alphaPixelSize, alphaPixelSize);
        for (let i = 0; i < Math.pow(alphaPixelSize, 2); i++) {
            const colorValue = isWhite ? 255 : 0;
            imageData.data[i * 4] = colorValue;
            imageData.data[i * 4 + 1] = colorValue;
            imageData.data[i * 4 + 2] = colorValue;
            imageData.data[i * 4 + 3] = 255;
        }
        const origin = getAlphaPixelOrigin(index);
        ctx.putImageData(imageData, origin.x, origin.y);
    }

    return {
        drawBipolarVector
    }
})();

const hopfieldNetworkModule = (function() {
    const activationFunction = Math.tanh;
    const inputElementsQuantity = inputVectorSize;
    const weightMatrixDimension = inputElementsQuantity;

    let rememberedVectors;
    let weightMatrix;

    function init() {
        rememberedVectors = [];
        weightMatrix = matrixModule.getRandomMatrix(weightMatrixDimension, weightMatrixDimension);
    }

    function getNetworkOutput(inputVector) {
        const output = matrixModule.multiplyMatrices(inputVector, weightMatrix);
        const outputActivationFunctionApplied = matrixModule.applyFunctionToMatrixElements(output, activationFunction);
        const outputReducerApplied = matrixModule.applyFunctionToMatrixElements(outputActivationFunctionApplied, valueReducer);
        return outputReducerApplied;
    }

    function addVectorToMemory(vector) {
        rememberedVectors.push(vector);
    }

    function learningStep() {
        if (!rememberedVectors.length) return;
        const X = matrixModule.transposeMatrix(rememberedVectors);
        const Xtransposed = matrixModule.transposeMatrix(X);
        const middleTerm = matrixModule.getMatrixInverse(matrixModule.multiplyMatrices(Xtransposed, X));
        weightMatrix = matrixModule.multiplyMatrices(matrixModule.multiplyMatrices(X, middleTerm), Xtransposed);
        console.log(rememberedVectors);
        console.log(weightMatrix);
    }

    function valueReducer(value) {
        return value >= 0 ? -1 : 1;
    }

    function checkIfVectorAlreadyRemembered(vector) {
        return rememberedVectors.some(rememberedVector => rememberedVector.every((el, index) => el === vector[index]));
    }

    return {
        init,
        getNetworkOutput,
        addVectorToMemory,
        learningStep,
        checkIfVectorAlreadyRemembered
    }
})();

const fileReaderModule = (function() {
    let currVector;

    document.getElementById('text-file-input').addEventListener('change', function() {
        try {
            const reader = new FileReader();
            reader.onload = () => {
                currVector = convertStringToVector(reader.result);
                if (currVector.length !== inputVectorSize) {
                    throw `Invalid input vector size: wanted ${inputVectorSize}, got ${currVector.length}`;
                }
                canvasModule.drawBipolarVector(currVector);
            }
            reader.readAsText(this.files[0]);
        }
        catch(err) {
            console.error(err);
        }
    });

    function getCurrVector() {
        return currVector;
    }

    function convertStringToVector(string) {
        return string.split('\n').join(' ').split(' ').filter(el => !!el).map(Number);
    }

    return {
        getCurrVector
    }
})();

document.getElementById('convert').addEventListener('click', () => {
    canvasModule.drawBipolarVector(hopfieldNetworkModule.getNetworkOutput([fileReaderModule.getCurrVector()])[0], false);
});

document.getElementById('save-for-learning').addEventListener('click', () => {
    const currVector = fileReaderModule.getCurrVector();
    if (!currVector) return;
    if (hopfieldNetworkModule.checkIfVectorAlreadyRemembered(currVector)) {
        alert("this vector is already saved for learning");
        return;
    }
    hopfieldNetworkModule.addVectorToMemory(currVector);
    alert('saved!');
});

document.getElementById('learning-step').addEventListener('click', () => {
    hopfieldNetworkModule.learningStep();
    alert('finished!');
});

document.getElementById('reset').addEventListener('click', () => {
    hopfieldNetworkModule.init();
});

hopfieldNetworkModule.init();