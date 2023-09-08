class CanvasController {
    _drawing = false;
    _selectedPoints = null;
    _exitDrawingModeEvent = new CustomEvent('drawing-finished');

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

    drawPoint(x, y, color = { red: 0, green: 0, blue: 0, opacity: 1 }) {
        [
            this._singlePixelImageData.data[0],
            this._singlePixelImageData.data[1],
            this._singlePixelImageData.data[2],
            this._singlePixelImageData.data[3]
        ] = [
            color.red,
            color.green,
            color.blue,
            color.opacity * 255
        ];

        this._ctx.putImageData(this._singlePixelImageData, this._origin.x + x, this._origin.y - y);
    }

    enterDrawingMode(pointsRequired) {
        this._selectedPoints = [];

        const clickListener = (event) => {
            const x = event.offsetX - this._width / 2;
            const y = -1 * event.offsetY + this._height / 2;
            this._selectedPoints.push(new Point(x, y));
            if (this._selectedPoints.length === pointsRequired) {
                this._canvasHtmlElem.removeEventListener('click', clickListener);
                this.exitDrawingMode();
            }
        };
        this._canvasHtmlElem.addEventListener('click', clickListener);
    }

    exitDrawingMode() {
        this._canvasHtmlElem.dispatchEvent(this._exitDrawingModeEvent);
    }

    getSelectedPoints() {
        const snapshot = [...this._selectedPoints];
        this._selectedPoints = null;
        return snapshot;
    }
}

const toolbarModule = (function () {
    class Button {
        constructor(label, callback) {
            this._label = label;
            this._callback = callback;
        }

        get label() {
            return this._label;
        }

        get callback() {
            return this._callback;
        }
    }

    class Section {
        constructor(label, buttons) {
            this._label = label;
            this._buttons = [...buttons];
        }

        get label() { return this._label; }

        get buttons() { return [...this._buttons]; }

        getHtmlElem() {
            const sectionElem = document.createElement('section');
            sectionElem.classList.toggle('toolbar-section');

            const sectionHeader = document.createElement('header');
            sectionHeader.append(this._label);
            sectionElem.appendChild(sectionHeader);

            const sectionMain = document.createElement('main');
            this._buttons.forEach(button => {
                const buttonElem = document.createElement('button');
                buttonElem.innerHTML = button.label;
                buttonElem.onclick = button.callback;
                sectionMain.appendChild(buttonElem);
            });
            sectionElem.appendChild(sectionMain);

            return sectionElem;
        }
    }

    class ToolbarController {
        constructor(sections, toolbarElemId = 'toolbar') {
            this._toolbarRef = document.getElementById(toolbarElemId);
            this._sections = [...sections];
            this._render();
        }

        _render() {
            this._toolbarRef.innerHTML = '';
            this._sections.forEach(section => this._toolbarRef.appendChild(section.getHtmlElem()));
        }
    }

    return {
        Button,
        Section,
        ToolbarController
    }
})();
const Button = toolbarModule.Button;
const Section = toolbarModule.Section;
const ToolbarController = toolbarModule.ToolbarController;

class GeometryUtils {
    static radiansToDegrees(radians) {
        return Math.round(radians * 180 / Math.PI);
    }

}

const geometryModule = (function() {
    class Point {
        constructor(x, y, z = 0, w = 1) {
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

        distanceToPoint(point) {
            return new Vector(this, point).modulus;
        }
    }

    class Vector {
        constructor(startpoint, endpoint) {
            this._x = endpoint.x - startpoint.x;
            this._y = endpoint.y - startpoint.y;
            this._z = endpoint.z - startpoint.z;
            this._w = endpoint.w - startpoint.w;
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

        get modulus() {
            return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
        }

        get angleToXAxis() {
            const offsetAngleByPi = (this._x / this.modulus) < 0;

            const rawAngleInRadians = Math.atan(this._y / this._x);
            const actualAngleInRadians = rawAngleInRadians + (offsetAngleByPi ? Math.PI : 0);

            return Math.round(GeometryUtils.radiansToDegrees(actualAngleInRadians) + 360) % 360;
        }

        dotProduct(vector) {
            return (this._x * vector.x + this._y * vector.y + this._z * vector._z + this._w * vector.w);
        }

        crossProduct(vector) {
            return new Vector(
                new Point(this._y * vector.z, this._z * vector.x, this._x * vector.y),
                new Point(this._z * vector.y, this._z * vector.y, this._y * vector.x)
            )
        }
    }

    class Line {
        constructor(point1, point2) {
            this._point = new Point(point1.x, point1.y, point1.z, point1.w);
            this._directionVector = new Vector(point1, point2);
        }

        get angleToXAxis() {
            return this._directionVector.angleToXAxis;
        }

        distanceToPoint(point) {
            const helperVector = new Vector(this._point, point);
            return helperVector.crossProduct(this._directionVector).modulus / this._directionVector.modulus;
        }
    }

    return {
        Point,
        Vector,
        Line
    }
})();
const Point = geometryModule.Point;
const Vector = geometryModule.Vector;
const Line = geometryModule.Line;

const lab1Module = (function() {
    function mapEndpoints(endpoints) {
        return [endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y].map(Math.round);
    }

    function ddaLine(endpoints, drawPointCallback, color) {
        const [x_start, y_start, x_end, y_end] = mapEndpoints(endpoints);

        const rasterizationSteps = Math.max(
            Math.abs(x_end - x_start),
            Math.abs(y_end - y_start)
        ) + 1;
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
    function getDependentAndIndependentVariableInfo(endpoints, swapVariables) {
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
            // возможность использовать положительный либо отрицательный шаг независимой переменной
            // позволяет алгоритму Брезенхейма рисовать отрезки, направляющие векторы которых проходят
            // в октантах, являющимися отражениями уже покрываемых алгоритмом октантов относительно
            // оси зависимой переменной: для октанта 2 это октант 3, для октанта 6 это октант 7.
            independentStep: (independentEnd - independentStart > 0) ? 1 : -1,
            deltaIndependent,
            
            dependentStart,
            dependentEnd,
            // возможность использовать положительный либо отрицательный шаг зависимой переменной
            // позволяет алгоритму Брезенхейма рисовать отрезки, направляющие векторы которых проходят
            // в октантах, являющимися отражениями уже покрываемых алгоритмом октантов относительно
            // оси независимой переменной: для октанта 1 это октант 8, для октанта 5 это октант 4.
            dependentStep: (dependentEnd - dependentStart > 0) ? 1 : -1,
            deltaDependent,

            deltaErr
        }
    }
    function bresenhamsLine(endpoints, drawPointCallback, color) {
        // алгоритм Брезенхема по умолчанию успешно рисует отрезки, направляющие вектора которых проходят в 1 октанте.
        // возможность перестановки точек начала и конца отрезка позволяет рисовать отрезки, направляющие вектора
        // которых проходят в 5 октанте.
        if (endpoints.start.x > endpoints.end.x) {
            swapEndpoints(endpoints);
        }
        const [x_start, y_start, x_end, y_end] = mapEndpoints(endpoints);

        const deltaX_raw = Math.abs(x_end - x_start);
        const deltaY_raw = Math.abs(y_end - y_start);

        // если абсолютное значение тангенса угла наклона прямой к оси X больше 1,
        // то следует поменять переменные местами: сделать Y независимой переменной,
        // а X - зависимой. возможность менять переменные местами позволяет алгоритму
        // рисовать отрезки, направляющие векторы которых проходят в 2 и 6 октантах.
        const swapVariables = Math.abs(deltaY_raw / deltaX_raw) > 1;
        const variableInfo = getDependentAndIndependentVariableInfo(endpoints, swapVariables);

        let currIndependentVariableValue = variableInfo.independentStart;
        let currDependentVariableValue = variableInfo.dependentStart;
        let error = 0;
        const deltaErr = variableInfo.deltaDependent / variableInfo.deltaIndependent;
        for (
            ;
            currIndependentVariableValue != variableInfo.independentEnd;
            currIndependentVariableValue += variableInfo.independentStep
        ) {
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

    function wuLine(endpoints, drawPointCallback, color) {
        const idealLine = new Line(endpoints.start, endpoints.end);
        if (idealLine.angleToXAxis % 45 === 0) {
            // значит, линия горизонтальная, вертикальная или диагональная
            ddaLine(endpoints, drawPointCallback, color);
            return;
        }

        if (endpoints.start.x > endpoints.end.x) {
            swapEndpoints(endpoints);
        }
        const [x_start, y_start, x_end, y_end] = mapEndpoints(endpoints);

        const deltaX_raw = Math.abs(x_end - x_start);
        const deltaY_raw = Math.abs(y_end - y_start);

        const swapVariables = Math.abs(deltaY_raw / deltaX_raw) > 1;
        const variableInfo = getDependentAndIndependentVariableInfo(endpoints, swapVariables);

        let currIndependentVariableValue = variableInfo.independentStart;
        let currDependentVariableValue = variableInfo.dependentStart;
        let error = 0;
        const deltaErr = variableInfo.deltaDependent / variableInfo.deltaIndependent;
        for (
            ;
            currIndependentVariableValue != variableInfo.independentEnd;
            currIndependentVariableValue += variableInfo.independentStep
        ) {
            const x = swapVariables ? currDependentVariableValue : currIndependentVariableValue;
            const y = swapVariables ? currIndependentVariableValue : currDependentVariableValue;
            const firstPointToDraw = new Point(x, y);
            const secondPointToDraw = new Point(
                swapVariables ? x + variableInfo.dependentStep : x,
                swapVariables ? y : y + variableInfo.dependentStep
            );
            const intensity1 = Math.max(0, 1 - idealLine.distanceToPoint(firstPointToDraw));
            const intensity2 = 1 - intensity1;
            drawPointCallback(firstPointToDraw.x, firstPointToDraw.y, {
                ...color,
                opacity: intensity1
            });
            drawPointCallback(secondPointToDraw.x, secondPointToDraw.y, {
                ...color,
                opacity: intensity2
            })

            error += deltaErr;
            // порог значения ошибки 1 нужен, так как в этом случае переход к следующему значению
            // зависимой переменной должен осуществляться после того, как значение выражения
            // currDependentVariableValue + error выходит за пределы следующего значения зависимой
            // переменной (т.к. алгоритм рисует блоками высотой 2 пикселя)
            if (error >= 1) {
                currDependentVariableValue += variableInfo.dependentStep;
                error -= 1;
            }
        }
    }

    return {
        ddaLine,
        bresenhamsLine,
        wuLine
    }
})();

///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////

const canvas = new CanvasController();
const drawPointCallback = canvas.drawPoint.bind(canvas);

const ddaFinishedDrawingCallback = () => {
    const endpoints = canvas.getSelectedPoints();
    lab1Module.ddaLine({ start: endpoints[0], end: endpoints[1] }, drawPointCallback);
    canvas._canvasHtmlElem.removeEventListener('drawing-finished', ddaFinishedDrawingCallback);
}
const bresenhamsFinishedDrawingCallback = () => {
    const endpoints = canvas.getSelectedPoints();
    lab1Module.bresenhamsLine({ start: endpoints[0], end: endpoints[1] }, drawPointCallback);
    canvas._canvasHtmlElem.removeEventListener('drawing-finished', bresenhamsFinishedDrawingCallback);
}
const wuFinishedDrawingCallback = () => {
    const endpoints = canvas.getSelectedPoints();
    lab1Module.wuLine({ start: endpoints[0], end: endpoints[1] }, drawPointCallback);
    canvas._canvasHtmlElem.removeEventListener('drawing-finished', wuFinishedDrawingCallback);
}

const toolbar = new ToolbarController([
    new Section('Отрезки', [
        new Button('ЦДА', () => {
            canvas.enterDrawingMode(2);
            canvas._canvasHtmlElem.addEventListener('drawing-finished', ddaFinishedDrawingCallback);
        }),
        new Button('Брезенхейм', () => {
            canvas.enterDrawingMode(2);
            canvas._canvasHtmlElem.addEventListener('drawing-finished', bresenhamsFinishedDrawingCallback);
        }),
        new Button('Ву', () => {
            canvas.enterDrawingMode(2);
            canvas._canvasHtmlElem.addEventListener('drawing-finished', wuFinishedDrawingCallback);
        })
    ])
]);