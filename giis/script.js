class GeometryUtils {
    static radiansToDegrees(radians) {
        return Math.round(radians * 180 / Math.PI);
    }

}

const geometryModule = (function() {
    class Point {
        constructor(x, y, z = 0, w = 0) {
            [this._x, this._y, this._z, this._w] = [x, y, z, w];
        }

        get x() {
            return this._x;
        }

        get y() {
            return this._y;
        }

        get z() {
            return this._z;
        }

        get w() {
            return this._w;
        }

        reflectAroundPoint(pointToReflectAround = new Point(0, 0)) {
            const deltaX = this._x - pointToReflectAround.x;
            const deltaY = this._y - pointToReflectAround.y;
            const deltaZ = this._z - pointToReflectAround.z;
            
            this._x = pointToReflectAround.x - deltaX;
            this._y = pointToReflectAround.y - deltaY;
            this._z = pointToReflectAround.z - deltaZ;
        }
    }

    class Vector {
        constructor(startpoint, endpoint) {
            this._x = endpoint.x - startpoint.x;
            this._y = endpoint.y - startpoint.y;
            this._z = endpoint.z - startpoint.z;
        }

        get x() {
            return this._x;
        }

        get y() {
            return this._y;
        }

        get z() {
            return this._z;
        }

        get modulus() {
            return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
        }

        get angleToXAxis() {
            const offsetAngleByPi = (this._x / this.modulus) < 0;

            const rawAngleInRadians = Math.atan(this._y / this._x);
            const actualAngleInRadians = rawAngleInRadians + (offsetAngleByPi ? Math.PI : 0);

            return Math.round(GeometryUtils.radiansToDegrees(actualAngleInRadians) + 360) % 360;
        }

        get octant() {
            return Math.ceil(this.angleToXAxis / 45);
        }
    }

    return {
        Point,
        Vector
    }
})();
const Point = geometryModule.Point;
const Vector = geometryModule.Vector;

const COLOR_BLACK = {
    red: 0,
    green: 0,
    blue: 0,
    opacity: 255
}
class CanvasController {
    constructor({
        width = 1000,
        height = 800,
        canvasHtmlElemId = 'canvas',
        drawGridlines = true,
        gridLineSpacing_X = 10,
        gridLineSpacing_Y = 10,
        drawCoordinateSystem = true,
        singleSegmentSize = 50,
        singleElementTickSize = 10,
        axisArrowLength = 10,
        axisArrowHeight = 5,
        labelAxes = true
    } = {
        width: 1000,
        height: 800,
        canvasHtmlElemId: 'canvas',
        drawGridlines: true,
        gridLineSpacing_X: 10,
        gridLineSpacing_Y: 10,
        drawCoordinateSystem: true,
        singleSegmentSize: 50,
        singleElementTickSize: 10,
        axisArrowLength: 10,
        axisArrowHeight: 5,
        labelAxes: true
    }) {
        this._width = width;
        this._height = height;
        this._origin = new Point(this._width / 2, this._height / 2);

        this._canvasHtmlElem = document.getElementById(canvasHtmlElemId);
        this._canvasHtmlElem.setAttribute('width', `${this._width}`);
        this._canvasHtmlElem.setAttribute('height', `${this._height}`);

        this._ctx = this._canvasHtmlElem.getContext('2d');
        this._singlePixelImageData = this._ctx.createImageData(1, 1);

        if (drawGridlines) {
            this._ctx.lineWidth = 0.125;
            this._ctx.beginPath();

            const verticalGridLinesQuantity = Math.floor(this._width / gridLineSpacing_X);
            for (let verticalGridlinesDrawn = 0; verticalGridlinesDrawn <= verticalGridLinesQuantity; verticalGridlinesDrawn++) {
                const x = verticalGridlinesDrawn * gridLineSpacing_X;
                this._ctx.moveTo(x, 0);
                this._ctx.lineTo(x, this._height);
            }

            const horizontalGridLinesQuantity = Math.floor(this._height / gridLineSpacing_Y);
            for (let horizontalGridlinesDrawn = 0; horizontalGridlinesDrawn <= horizontalGridLinesQuantity; horizontalGridlinesDrawn++) {
                const y = horizontalGridlinesDrawn * gridLineSpacing_Y;
                this._ctx.moveTo(0, y);
                this._ctx.lineTo(this._width, y);
            }

            this._ctx.stroke();
        }

        if (drawCoordinateSystem) {
            this._ctx.beginPath();
            this._ctx.lineWidth = 0.5;

            // x axis
            this._ctx.moveTo(0, this._origin.y);
            this._ctx.lineTo(this._width, this._origin.y);

            // x axis arrow
            this._ctx.lineTo(this._width - axisArrowLength, this._origin.y + axisArrowHeight);
            this._ctx.moveTo(this._width, this._origin.y);
            this._ctx.lineTo(this._width - axisArrowLength, this._origin.y - axisArrowHeight);

            // y axis
            this._ctx.moveTo(this._origin.x, this._height);
            this._ctx.lineTo(this._origin.x, 0);

            // y axis arrow
            this._ctx.lineTo(this._origin.x - axisArrowHeight, axisArrowLength);
            this._ctx.moveTo(this._origin.x, 0);
            this._ctx.lineTo(this._origin.x + axisArrowHeight, axisArrowLength);

            if (labelAxes) {
                this._ctx.strokeText('x', this._width - 15, this._origin.y + 15);
                this._ctx.strokeText('y', this._origin.x + 8, 15);
            }

            // x axis single segments
            const singleSegmentXAxisVerticalOffset = 10;
            const singleSegmentXAxisBoundary = this._width / 2;
            for (let currSingleSegment = -1 * singleSegmentXAxisBoundary; currSingleSegment <= singleSegmentXAxisBoundary; currSingleSegment += singleSegmentSize) {
                if (currSingleSegment === 0) continue;

                const currSingleElementXCoordinate = this._origin.x + currSingleSegment
                this._ctx.moveTo(currSingleElementXCoordinate, this._origin.y + singleElementTickSize / 2);
                this._ctx.lineTo(currSingleElementXCoordinate, this._origin.y - singleElementTickSize / 2);
                this._ctx.strokeText(
                    `${currSingleSegment}`,
                    currSingleElementXCoordinate,
                    this._origin.y + singleSegmentXAxisVerticalOffset
                );
            };

            // y axis single segments
            const singleSegmentYAxisHorizontalOffset = 2;
            const singleSegmentYAxisBoundary = this._height / 2;
            for (let currSingleSegment = -1 * singleSegmentYAxisBoundary; currSingleSegment <= singleSegmentYAxisBoundary; currSingleSegment += singleSegmentSize) {
                if (currSingleSegment === 0) continue;

                const currSingleElementYCoordinate = this._origin.y - currSingleSegment
                this._ctx.moveTo(this._origin.x + singleElementTickSize / 2, currSingleElementYCoordinate);
                this._ctx.lineTo(this._origin.x - singleElementTickSize / 2, currSingleElementYCoordinate);
                this._ctx.strokeText(
                    `${currSingleSegment}`,
                    this._origin.x + singleSegmentYAxisHorizontalOffset,
                    currSingleElementYCoordinate
                );
            };

            // zeroth single segment
            const zerothSingleSegmentVerticalOffset = 10;
            const zerothSingleSegmentHorizontalOffset = 3;
            this._ctx.strokeText(
                `0`,
                this._origin.x + zerothSingleSegmentHorizontalOffset,
                this._origin.y + zerothSingleSegmentVerticalOffset
            );

            this._ctx.stroke();
        }
    }

    drawPoint(x, y, color = COLOR_BLACK) {
        [
            this._singlePixelImageData.data[0],
            this._singlePixelImageData.data[1],
            this._singlePixelImageData.data[2],
            this._singlePixelImageData.data[3]
        ] = [
            color.red,
            color.green,
            color.blue,
            color.opacity
        ];

        this._ctx.putImageData(this._singlePixelImageData, this._origin.x + x, this._origin.y - y);
    }
}

const lab1Module = (function() {
    function mapEndpoints(endpoints) {
        return [endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y].map(Math.round);
    }

    function ddaLine(endpoints, drawPointCallback, color = COLOR_BLACK) {
        const [x_start, y_start, x_end, y_end] = mapEndpoints(endpoints);

        const rasterizationSteps = Math.max(x_end - x_start, y_end - y_start) + 1;
        const xGrowth = (x_end - x_start) / rasterizationSteps;
        const yGrowth = (y_end - y_start) / rasterizationSteps;
        
        let currX = x_start;
        let currY = y_start;
        for (let stepsElapsed = 1; stepsElapsed <= rasterizationSteps; stepsElapsed++) {
            drawPointCallback(Math.round(currX), Math.round(currY), color);

            currX += xGrowth;
            currY += yGrowth;
        }
    }

    function swapEndpoints(endpoints) {
        const startEndpointSnapshot = new Point(endpoints.start.x, endpoints.start.y);
        endpoints.start = new Point(endpoints.end.x, endpoints.end.y);
        endpoints.end = startEndpointSnapshot;
    }
    function getDependentAndIndependentVariableBoundaries(endpoints, swapVariables) {
        const independentStart = swapVariables ? endpoints.start.y : endpoints.start.x;
        const independentEnd = swapVariables ? endpoints.end.y : endpoints.end.x;
        const deltaIndependent = Math.abs(independentEnd - independentStart);

        const dependentStart = swapVariables ? endpoints.start.x : endpoints.start.y;
        const dependentEnd = swapVariables ? endpoints.end.x : endpoints.end.y;
        const deltaDependent = Math.abs(dependentEnd - dependentStart);

        const deltaErr = deltaDependent / deltaIndependent;
        return {
            independentStart,
            independentEnd,
            deltaIndependent,
            dependentStart,
            dependentEnd,
            deltaDependent,
            // возможность использовать положительный либо отрицательный шаг
            // зависимой переменной позволяет алгоритму Брезенхейма рисовать отрезки,
            // направляющие векторы которых проходят в октантах, являющимися
            // отражениями уже покрываемых алгоритмом октантов относительно оси X:
            // для 1 октанта это октант 2, для 5 октант это октант 4.
            dependentStep: (dependentEnd - dependentStart > 0) ? 1 : -1,
            deltaErr
        }
    }
    // алгоритм Брезенхема по умолчанию успешно рисует отрезки,
    // направляющие вектора которых проходят в 1 октанте.
    function bresenhamsLine(endpoints, drawPointCallback, color = COLOR_BLACK) {
        // возможность перестановки точек начала и конца отрезка позволяет рисовать отрезки,
        // направляющие вектора которых проходят в 5 октанте.
        if (endpoints.start.x > endpoints.end.x) {
            swapEndpoints(endpoints);
        }
        const [x_start, y_start, x_end, y_end] = mapEndpoints(endpoints);

        const deltaX_raw = Math.abs(x_end - x_start);
        const deltaY_raw = Math.abs(y_end - y_start);

        // если абсолютное значение тангенса угла наклона прямой к оси X больше 1,
        // то следует поменять переменные местами: сделать Y независимой переменной,
        // а X - зависимой. возможность менять переменные местами позволяет алгоритму
        // рисовать отрезки, направляющие векторы которых проходят в 2, 3, 6 и 7 октантах.
        const swapVariables = Math.abs(deltaY_raw / deltaX_raw) > 1;

        const variableInfo = getDependentAndIndependentVariableBoundaries(endpoints, swapVariables);

        let currIndependentVariableValue = variableInfo.independentStart;
        let currDependentVariableValue = variableInfo.dependentStart;
        const deltaErr = variableInfo.deltaDependent / variableInfo.deltaIndependent;
        let error = 0;
        for (currIndependentVariableValue; currIndependentVariableValue <= variableInfo.independentEnd; currIndependentVariableValue++) {
            const x = swapVariables ? currDependentVariableValue : currIndependentVariableValue;
            const y = swapVariables ? currIndependentVariableValue : currDependentVariableValue;
            drawPointCallback(x, y, color);

            error += deltaErr;
            if (error >= 0.5) {
                currDependentVariableValue += variableInfo.dependentStep;
                error -= 1;
            }
        }
    }

    function bresenhamsAntialiasedLine(endpoints, drawPointCallback, availableIntensityLevels = 5, color = COLOR_BLACK) {
        const [x_start, y_start, x_end, y_end] = mapEndpoints(endpoints);

        const deltaX = Math.abs(x_end - x_start);
        const deltaY = Math.abs(y_end - y_start);
    }

    return {
        ddaLine,
        bresenhamsLine
    }
})();

const canvas = new CanvasController();
lab1Module.bresenhamsLine({ start: new Point(0, 0), end: new Point(500, -100) }, canvas.drawPoint.bind(canvas));