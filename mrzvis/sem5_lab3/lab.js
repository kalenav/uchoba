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

    function dotProduct(vector1, vector2) {
        return vector1.reduce((acc, el, index) => acc + el * vector2[index], 0);
    }

    function addMatrices(matrix1, matrix2) {
        return subtractMatrices(matrix1, multiplyMatrixByNumber(matrix2, -1));
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
        calcDeterminant,
        dotProduct,
        addMatrices
    }
})();

const jordanNetworkModule = (() => {
    const contextNeuronActivationFunction = Math.asinh;
    const hiddenNeuronActivationFunction = (arg) => arg;
    const outputNeuronActivationFunction = (arg) => arg;
    const hiddenNeuronActivationFunctionDerivative = (arg) => 1;
    const inputNeuronsQuantity = 5;
    const hiddenNeuronsQuantity = 1;
    const outputNeuronsQuantity = 1;
    const contextNeuronsQuantity = outputNeuronsQuantity;
    const weights = {};
    let learningParams = {}
    let currContextNeuronsValues;

    let initialized = false;
    let predictedOnce = false;

    function init() {
        weights.inputToHidden = matrixModule.getRandomMatrix(inputNeuronsQuantity, hiddenNeuronsQuantity, false);
        weights.hiddenToOutput = matrixModule.getRandomMatrix(hiddenNeuronsQuantity, outputNeuronsQuantity, false);
        weights.contextToHidden = matrixModule.getRandomMatrix(contextNeuronsQuantity, hiddenNeuronsQuantity, false);
        learningParams = {
            currError: 0,
            hiddenLayerBiases: new Array(hiddenNeuronsQuantity).fill(0),
            maxError: Number(prompt('Input max error:')),
            learningCoef: Number(prompt('Input learning coefficient'))
        }
        currContextNeuronsValues = [new Array(contextNeuronsQuantity).fill(0)];
        initialized = true;
    }

    function calcNetworkOutput(inputValues, ethaloneValue) {
        const input = inputValues ?? [prompt('Input sequence (5 numbers, delimit by space)').trim().split(' ').map(el => Number(el))];
        const ethalone = ethaloneValue ?? Number(prompt('Input ethalone (1 number)'));
        learningParams.currInput = input;
        learningParams.currEthalone = ethalone;

        const hiddenNeuronValues =  matrixModule.addMatrices(
            matrixModule.multiplyMatrices(input, weights.inputToHidden),
            matrixModule.multiplyMatrices(currContextNeuronsValues, weights.contextToHidden)
        ).map((row, rowIndex) => row.map(el => hiddenNeuronActivationFunction(el, learningParams.hiddenLayerBiases[rowIndex])));
        const outputNeuronValues = matrixModule.applyFunctionToMatrixElements(
            matrixModule.multiplyMatrices(
                hiddenNeuronValues,
                weights.hiddenToOutput
            ),
            outputNeuronActivationFunction
        );
        currContextNeuronsValues = matrixModule.applyFunctionToMatrixElements(
            outputNeuronValues,
            contextNeuronActivationFunction
        );

        learningParams.hiddenNeuronValues = hiddenNeuronValues;
        learningParams.outputNeuronValues = outputNeuronValues;
        learningParams.currError = outputNeuronValues[0][0] - ethalone;
        predictedOnce = true;
        console.log(outputNeuronValues[0][0]);
    }

    function learn() {
        while (Math.abs(learningParams.currError) > learningParams.maxError) {
            tuneWeights();
            tuneBiases(learningParams.subtractingCoefs);
            calcNetworkOutput(learningParams.currInput, learningParams.currEthalone);
        };
    }

    function tuneWeights() {
        weights.hiddenToOutput = weights.hiddenToOutput.map((row, rowIndex) => {
            const subtracting = learningParams.learningCoef * learningParams.currError * learningParams.hiddenNeuronValues[rowIndex][0];
            return row.map(el => el - subtracting);
        });

        learningParams.subtractingCoefs = learningParams.hiddenNeuronValues.map((row, rowIndex) => 
            learningParams.learningCoef
            * ithGamma(learningParams.currError, rowIndex)
            * hiddenNeuronActivationFunctionDerivative(row[0])
        );

        const subtractingCoefs = learningParams.subtractingCoefs;

        for (let k = 0; k < weights.inputToHidden.length; k++) {
            for (let i = 0; i < subtractingCoefs.length; i++) {
                weights.inputToHidden[k][i] -= subtractingCoefs[i] * learningParams.currInput[0][k];
            }
        }

        for (let l = 0; l < weights.contextToHidden.length; l++) {
            for (let i = 0; i < subtractingCoefs.length; i++) {
                weights.contextToHidden[l][i] -= subtractingCoefs[i] * learningParams.hiddenNeuronValues[i][0];
            }
        }
    }

    function tuneBiases(subtractingCoefs) {
        learningParams.hiddenLayerBiases = learningParams.hiddenLayerBiases.map((bias, index) => bias + subtractingCoefs[index])
    }

    function ithGamma(currError, index) {
        return currError * weights.hiddenToOutput[index][0];
    }

    function isInitialized() {
        return initialized;
    }

    function predicted() {
        return predictedOnce;
    }

    return {
        init,
        calcNetworkOutput,
        learn,
        isInitialized,
        predicted
    }
})();

document.getElementById('init-reset').addEventListener('click', () => {
    jordanNetworkModule.init();
});

document.getElementById('predict').addEventListener('click', () => {
    if (!jordanNetworkModule.isInitialized()) {
        alert('network not yet initialized');
        return;
    }
    jordanNetworkModule.calcNetworkOutput();
});

document.getElementById('learn').addEventListener('click', () => {
    if (!jordanNetworkModule.isInitialized()) {
        alert('network not yet initialized');
        return;
    }
    if (!jordanNetworkModule.predicted()) {
        alert('you need to predict at least once before learning');
        return;
    }
    jordanNetworkModule.learn();
});