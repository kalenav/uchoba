const neuralNetworkModule = (() => {
    function matrixMultiply(matrix1, matrix2) {
        try {
            if (matrix1[0].length !== matrix2.length) {
                throw `Invalid multiplied matrix size; matrix1 length = ${matrix1[0].length}, matrix2 height = ${matrix2.length}`;
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

    function calcResult(input, weights) {
        let activeLayerValues = input;
        weights.forEach(weightMatrix => {
            activeLayerValues = matrixMultiply(activeLayerValues, weightMatrix);
        })
        return activeLayerValues;
    }

    return {
        matrixMultiply,
        calcResult,
    }
})();

const subImageWidth = 2;
const subImageHeight = 2;
const pixelsInSubImage = subImageWidth * subImageHeight;
const imageWidth = 256;
const imageHeight = 256;
const pixelsInImage = imageWidth * imageHeight;
const subImagesInOneRow = imageWidth / subImageWidth;
const subImagesInOneColumn = imageHeight / subImageHeight;
const valuesInAPixel = 3;
const learningParams = {};

const canvas = document.getElementById("image-container");
const ctx = canvas.getContext("2d");
const imageInput = document.getElementById("image-input");
imageInput.addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const uploadedImage = new Image();
        uploadedImage.addEventListener("load", () => {
            ctx.drawImage(uploadedImage, 0, 0);
            ctx.createImageData(256, 256);
        });
        uploadedImage.src = reader.result;
    });
    reader.readAsDataURL(this.files[0]);
});

function getNeuralNetworkSubImageInput(subImageInColumnIndex, subImageInRowIndex) {
    const origin = getOrigin(subImageInColumnIndex, subImageInRowIndex);
    return [getColorValuesAtOrigin(origin.x, origin.y)];
}

function getColorValuesAtOrigin(originX, originY, width = subImageWidth, height = subImageHeight) {
    const colorValues = [];
    for(let j = originY; j < originY + height; j++) {
        for(let i = originX; i < originX + width; i++) {
            const currPixelData = ctx.getImageData(i, j, 1, 1).data;
            colorValues.push(colorValueMapper(currPixelData[0]));
            colorValues.push(colorValueMapper(currPixelData[1]));
            colorValues.push(colorValueMapper(currPixelData[2]));
        }
    }
    return colorValues;
}

function getOrigin(subImageInColumnIndex, subImageInRowIndex, width = subImageWidth, height = subImageHeight) {
    return {
        x: subImageInRowIndex * width,
        y: subImageInColumnIndex * height
    };
}

function colorValueMapper(value) {
    return (2 * value / 255) - 1;
}

function valueColorMapper(value) {
    if (value > 1) return 255;
    if (value < -1) return 0;
    return (value + 1) * 255 / 2;
}

const compressedImageCtx = document.getElementById('compressed-image-container').getContext("2d");

document.getElementById('compress-button').addEventListener('click', () => {
    try {
        compressAndDecompress(learningParams);
    }
    catch(err) {
        console.error(err);
        return;
    }
});

document.getElementById('reset-button').addEventListener('click', () => {
    const neuronsOnSecondLayer = +prompt('Neurons on the second layer:');
    if (!neuronsOnSecondLayer || isNaN(neuronsOnSecondLayer) || neuronsOnSecondLayer % 1 !== 0) return;
    const error = +prompt('Maximum error:');
    if (!error || isNaN(error)) return;

    const weights = setRandomWeights(neuronsOnSecondLayer);
    learningParams.currWeights = weights;
    learningParams.maxError = error;
});

document.getElementById('next-learning-step-button').addEventListener('click', () => {
    nextLearningStep();
    alert('finished!');
});

document.getElementById('next-n-learning-steps-button').addEventListener('click', () => {
    const steps = +prompt("Learning steps:");
    if (!steps || isNaN(steps) || steps <= 0 || steps % 1 !== 0) return;
    for(let iter = 0; iter < steps; iter++) {
        nextLearningStep();
    }
    alert('finished!');
});

function setRandomWeights(neuronsOnSecondLayer) {
    const firstWeights = [];
    for(let i = 0; i < pixelsInSubImage * valuesInAPixel; i++) {
        const newRow = [];
        for(let j = 0; j < neuronsOnSecondLayer; j++) {
            newRow.push(Math.random() * (Math.random() > 0.5 ? 1 : -1));
        }
        firstWeights.push(newRow);
    }
    const secondWeights = transposeMatrix(firstWeights);
    return [firstWeights, secondWeights];
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

function tuneWeights(weights, maxError, params) {
    if (!weights || !params || !params.currInput || !params.secondLayerValues || !params.currOutput) return;
    const X = params.currInput;
    let Y = params.secondLayerValues;
    let Xtick = params.currOutput;
    let diff = subtractMatrices(Xtick, X);
    let currError;
    do {
        tuneSecondWeights(weights, Y, diff);
        tuneFirstWeights(weights, X, diff);
        normalizeByRow(weights[1]);
        normalizeByColumn(weights[0]);
        Y = neuralNetworkModule.matrixMultiply(X, weights[0]);
        Xtick = neuralNetworkModule.matrixMultiply(Y, weights[1]);
        diff = subtractMatrices(Xtick, X);
        currError = vectorSquare(diff[0]);
    }
    while(currError > maxError);
}

function tuneFirstWeights(weights, X, diff) {
    const inputTransposed = transposeMatrix(X);
    const a = neuralNetworkModule.matrixMultiply(inputTransposed, diff);
    const b = neuralNetworkModule.matrixMultiply(a, transposeMatrix(weights[1]));
    const learningCoef = 1 / vectorSquare(transposeMatrix(inputTransposed)[0]);
    if(!isFinite(learningCoef)) return;
    multiplyMatrixByNumber(b, learningCoef);
    weights[0] = subtractMatrices(weights[0], b);
}

function tuneSecondWeights(weights, Y, diff) {
    const secondLayerValuesTransposed = transposeMatrix(Y);
    const a = neuralNetworkModule.matrixMultiply(secondLayerValuesTransposed, diff);
    const learningCoef = 1 / vectorSquare(transposeMatrix(secondLayerValuesTransposed)[0]);
    if(!isFinite(learningCoef)) return;
    multiplyMatrixByNumber(a, learningCoef);
    weights[1] = subtractMatrices(weights[1], a);
}

function normalizeByRow(weightMatrix) {
    weightMatrix.forEach((row, index) => normalizeRow(weightMatrix, index));
}

function normalizeRow(matrix, rowIndex) {
    const modulus = Math.sqrt(matrix[rowIndex].map(el => el * el).reduce((r, v) => r + v, 0));
    for(let j = 0; j < matrix[rowIndex].length; j++) {
        matrix[rowIndex][j] /= modulus;
    }
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
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            matrix[i][j] *= number;
        }
    }
}

function drawSubImage(colorValues, ctx, originX, originY, width = subImageWidth, height = subImageHeight) {
    const subImageData = ctx.createImageData(width, height);
    for(let currColorValueIndex = 0, imageDataIndex = 0;
        currColorValueIndex < colorValues.length;
        currColorValueIndex += 3, imageDataIndex += 4)
    {
        subImageData.data[imageDataIndex] = colorValues[currColorValueIndex];
        subImageData.data[imageDataIndex + 1] = colorValues[currColorValueIndex + 1];
        subImageData.data[imageDataIndex + 2] = colorValues[currColorValueIndex + 2];
        subImageData.data[imageDataIndex + 3] = 255;
    }
    ctx.putImageData(subImageData, originX, originY);
}

function compressAndDecompress(learningParams) {
    learningParams.params = [];
    const weights = learningParams.currWeights;
    for(let subImageInColumnIndex = 0; subImageInColumnIndex < subImagesInOneColumn; subImageInColumnIndex++) {
        for(let subImageInRowIndex = 0; subImageInRowIndex < subImagesInOneRow; subImageInRowIndex++) {
            const origin = getOrigin(subImageInColumnIndex, subImageInRowIndex);
            const currInput = getNeuralNetworkSubImageInput(subImageInColumnIndex, subImageInRowIndex);
            const secondLayerValues = neuralNetworkModule.matrixMultiply(currInput, weights[0]);
            const currOutput = neuralNetworkModule.matrixMultiply(secondLayerValues, weights[1]);
            drawSubImage(
                currOutput[0].map(valueColorMapper),
                compressedImageCtx,
                origin.x,
                origin.y
            )
            learningParams.params.push({
                currInput,
                secondLayerValues,
                currOutput,
            });
        }
    }
}

function nextLearningStep() {
    //for(let i = 0; i < learningParams.currWeights.length; i++) {
        for(let i = 0; i < learningParams.params.length; i++) {
            tuneWeights(learningParams.currWeights, learningParams.maxError, learningParams.params[i]);
        }
        compressAndDecompress(learningParams);
    //}
}

function vectorSquare(vector) {
    return vector.reduce((r, v) => r + v*v, 0);
}