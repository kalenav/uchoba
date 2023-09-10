const canvasModule = (function () {
    class CanvasModel {
        _points = [];

        constructor(view) {
            this._view = view;
        }

        addPoint(point) {
            this._points.push(point);
        }

        addPoints(points) {
            points.forEach(point => this.addPoint(point));
            this._redrawCanvas();
        }

        _redrawCanvas() {
            this._view.redrawCanvas();
            this._view.drawPoints(this.points);
        }

        get points() { return [...this._points]; }   
    }

    class CanvasView {
        _DEFAULT_COLOR = {
            red: 0,
            green: 0,
            blue: 0
        }
        _minScale = 1;
        _maxScale = 64;
        _currScale = 1;
        _currTranslationStep = 0;

        constructor({
            width,
            height,
            canvasHtmlElemId,
            drawGridlines,
            gridLineSpacing_X,
            gridLineSpacing_Y,
            drawCoordinateSystem,
            singleSegmentSize,
            singleSegmentTickSize,
            axisArrowLength,
            axisArrowHeight,
            labelAxes
        }) {
            this._width = width;
            this._height = height;
            this._origin = new Point(this._width / 2, this._height / 2);

            this._canvasHtmlElem = document.getElementById(canvasHtmlElemId);
            this._canvasHtmlElem.setAttribute('width', `${this._width}`);
            this._canvasHtmlElem.setAttribute('height', `${this._height}`);

            this._ctx = this._canvasHtmlElem.getContext('2d');
            this._singlePixelImageData = this._ctx.createImageData(1, 1);

            this._drawGridlines_bool = drawGridlines;
            if (drawGridlines) {
                this._gridLineSpacing_X = gridLineSpacing_X;
                this._gridLineSpacing_Y = gridLineSpacing_Y;
            }

            this._drawCoordinateSystem_bool = drawCoordinateSystem;
            if (drawCoordinateSystem) {
                this._singleSegmentSize = singleSegmentSize;
                this._singleSegmentTickSize = singleSegmentTickSize;
                this._axisArrowLength = axisArrowLength;
                this._axisArrowHeight = axisArrowHeight;
                this._labelAxes = labelAxes;
            }

            this.redrawCanvas();
            this._addScalingEventListener();
            this._addTranslationEventListener();
        }

        drawPoint(x, y, opacity = 1, color = { red: 0, green: 0, blue: 0 }) {
            [
                this._singlePixelImageData.data[0],
                this._singlePixelImageData.data[1],
                this._singlePixelImageData.data[2],
                this._singlePixelImageData.data[3]
            ] = [
                color.red,
                color.green,
                color.blue,
                opacity * 255
            ];

            this._ctx.putImageData(this._singlePixelImageData, Math.round(this._origin.x + x), Math.round(this._origin.y - y));
        }

        drawPoints(points) {
            points.forEach(point => {
                this.drawPoint(point.x, point.y, point.opacity ?? 1, point.color ?? this._DEFAULT_COLOR);
            });
        }

        _addScalingEventListener() {
            this._canvasHtmlElem.addEventListener('wheel', (event) => {
                event.preventDefault();

                const scaling = event.deltaY * -0.01;
                if (scaling === 1 && this._currScale < this._maxScale) {
                    this._currScale *= 2;
                    this._scaleUp();
                    this._updateTranslationStep();
                }
                if (scaling === -1 && this._currScale > this._minScale) {
                    this._currScale /= 2;
                    this._scaleDown();
                    this._updateTranslationStep();
                    if (this._currScale === 1) {
                        this._resetTranslation();
                    }
                }
            });
        }

        _addTranslationEventListener() {
            document.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowUp') {
                    this._shiftCanvas(0, this._currTranslationStep);
                } else if (event.key === 'ArrowDown') {
                    this._shiftCanvas(0, -this._currTranslationStep);
                } else if (event.key === 'ArrowLeft') {
                    this._shiftCanvas(this._currTranslationStep, 0);
                } else if (event.key === 'ArrowRight') {
                    this._shiftCanvas(-this._currTranslationStep, 0);
                } else {
                    return;
                }
            });
        }

        _scaleUp() {
            this._ctx.scale(2, 2);
            this._redrawCanvas();
        }

        _scaleDown() {
            this._ctx.scale(1/2, 1/2);
            this._redrawCanvas();
        }

        _clearCanvas() {
            this._canvasHtmlElem.getContext('2d').clearRect(0, 0, this._width, this._height);
        }

        _drawGridlines() {
            this._ctx.lineWidth = 0.125;
            this._ctx.beginPath();

            const verticalGridLinesQuantity = Math.floor(this._width / this._gridLineSpacing_X);
            for (let verticalGridlinesDrawn = 0; verticalGridlinesDrawn <= verticalGridLinesQuantity; verticalGridlinesDrawn++) {
                const x = verticalGridlinesDrawn * this._gridLineSpacing_X;
                this._ctx.moveTo(x, 0);
                this._ctx.lineTo(x, this._height);
            }

            const horizontalGridLinesQuantity = Math.floor(this._height / this._gridLineSpacing_Y);
            for (let horizontalGridlinesDrawn = 0; horizontalGridlinesDrawn <= horizontalGridLinesQuantity; horizontalGridlinesDrawn++) {
                const y = horizontalGridlinesDrawn * this._gridLineSpacing_Y;
                this._ctx.moveTo(0, y);
                this._ctx.lineTo(this._width, y);
            }

            this._ctx.stroke();
        }

        _drawCoordinateSystem() {
            this._ctx.beginPath();
            this._ctx.lineWidth = 0.5;

            // x axis
            this._ctx.moveTo(0, this._origin.y);
            this._ctx.lineTo(this._width, this._origin.y);

            // x axis arrow
            this._ctx.lineTo(this._width - this._axisArrowLength, this._origin.y + this._axisArrowHeight);
            this._ctx.moveTo(this._width, this._origin.y);
            this._ctx.lineTo(this._width - this._axisArrowLength, this._origin.y - this._axisArrowHeight);

            // y axis
            this._ctx.moveTo(this._origin.x, this._height);
            this._ctx.lineTo(this._origin.x, 0);

            // y axis arrow
            this._ctx.lineTo(this._origin.x - this._axisArrowHeight, this._axisArrowLength);
            this._ctx.moveTo(this._origin.x, 0);
            this._ctx.lineTo(this._origin.x + this._axisArrowHeight, this._axisArrowLength);

            if (this._labelAxes) {
                this._ctx.strokeText('x', this._width - 15, this._origin.y + 15);
                this._ctx.strokeText('y', this._origin.x + 8, 15);
            }

            // x axis single segments
            const singleSegmentXAxisVerticalOffset = 10;
            const singleSegmentXAxisBoundary = this._width / 2;
            for (let currSingleSegment = -1 * singleSegmentXAxisBoundary; currSingleSegment <= singleSegmentXAxisBoundary; currSingleSegment += this._singleSegmentSize) {
                if (currSingleSegment === 0) continue;

                const currSingleElementXCoordinate = this._origin.x + currSingleSegment
                this._ctx.moveTo(currSingleElementXCoordinate, this._origin.y + this._singleSegmentTickSize / 2);
                this._ctx.lineTo(currSingleElementXCoordinate, this._origin.y - this._singleSegmentTickSize / 2);
                this._ctx.strokeText(
                    `${currSingleSegment}`,
                    currSingleElementXCoordinate,
                    this._origin.y + singleSegmentXAxisVerticalOffset
                );
            };

            // y axis single segments
            const singleSegmentYAxisHorizontalOffset = 2;
            const singleSegmentYAxisBoundary = this._height / 2;
            for (let currSingleSegment = -1 * singleSegmentYAxisBoundary; currSingleSegment <= singleSegmentYAxisBoundary; currSingleSegment += this._singleSegmentSize) {
                if (currSingleSegment === 0) continue;

                const currSingleElementYCoordinate = this._origin.y - currSingleSegment
                this._ctx.moveTo(this._origin.x + this._singleSegmentTickSize / 2, currSingleElementYCoordinate);
                this._ctx.lineTo(this._origin.x - this._singleSegmentTickSize / 2, currSingleElementYCoordinate);
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

        redrawCanvas() {
            this._clearCanvas();
            if (this._drawGridlines_bool) {
                this._drawGridlines();
            }
            if (this._drawCoordinateSystem_bool) {
                this._drawCoordinateSystem();
            }
        }

        _shiftCanvas(x, y) {
            this._ctx.translate(x, y);
            this._redrawCanvas();
        }

        _updateTranslationStep() {
            this._currTranslationStep = (50 / this._currScale**2) * (this._currScale - 1);
        }

        _resetTranslation() {
            this._ctx.setTransform(1, 0, 0, 1, 0, 0);
            this._redrawCanvas();
        }

        get width() { return this._width; }

        get height() { return this._height; }
    }

    class CanvasController {
        _drawingFinishedEvent = new Event('drawing-finished');
        _debuggingModeEnabled = false;
        _pointsToDrawQueue = [];

        constructor({
            width = 1000,
            height = 800,
            canvasHtmlElemId = 'canvas',
            drawGridlines = true,
            gridLineSpacing_X = 10,
            gridLineSpacing_Y = 10,
            drawCoordinateSystem = true,
            singleSegmentSize = 50,
            singleSegmentTickSize = 20,
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
            singleSegmentTickSize: 20,
            axisArrowLength: 10,
            axisArrowHeight: 5,
            labelAxes: true
        }) {
            this._view = new CanvasView({
                width,
                height,
                canvasHtmlElemId,
                drawGridlines,
                gridLineSpacing_X,
                gridLineSpacing_Y,
                drawCoordinateSystem,
                singleSegmentSize,
                singleSegmentTickSize,
                axisArrowLength,
                axisArrowHeight,
                labelAxes
            });
            this._model = new CanvasModel(this._view);

            this._canvasHtmlElem = document.getElementById(canvasHtmlElemId);
            this._drawNextPointEventListener = this._drawNextPointEventListener.bind(this);
        }

        _enterPointSelection(pointsRequired, exitPointSelectionCallback) {
            const selectedPoints = [];
    
            const clickListener = (event) => {
                const x = event.offsetX - this._view.width / 2;
                const y = -1 * event.offsetY + this._view.height / 2;
                selectedPoints.push(new Point(x, y));
                if (selectedPoints.length === pointsRequired) {
                    this._canvasHtmlElem.removeEventListener('click', clickListener);
                    exitPointSelectionCallback(selectedPoints);
                    document.dispatchEvent(this._drawingFinishedEvent);
                }
            };
            this._canvasHtmlElem.addEventListener('click', clickListener);
        }

        ////////////////////////////////////////
        ///////////////// lab1 /////////////////
        ////////////////////////////////////////

        _mapEndpoints(endpoints) {
            return [endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y].map(Math.round);
        }
    
        ddaLine(endpoints) {
            const points = [];

            const [x_start, y_start, x_end, y_end] = this._mapEndpoints(endpoints);
    
            const rasterizationSteps = Math.max(
                Math.abs(x_end - x_start),
                Math.abs(y_end - y_start)
            ) + 1;
            const xGrowth = (x_end - x_start) / rasterizationSteps;
            const yGrowth = (y_end - y_start) / rasterizationSteps;
    
            let currX = x_start;
            let currY = y_start;
            for (let stepsElapsed = 1; stepsElapsed <= rasterizationSteps; stepsElapsed++) {
                points.push({
                    x: Math.round(currX),
                    y: Math.round(currY)
                });
    
                currX += xGrowth;
                currY += yGrowth;
            }

            return points;
        }
    
        _swapEndpoints(endpoints) {
            const startEndpointSnapshot = new Point(endpoints.start.x, endpoints.start.y);
            endpoints.start = new Point(endpoints.end.x, endpoints.end.y);
            endpoints.end = startEndpointSnapshot;
        }
    
        _getDependentAndIndependentVariableInfo(endpoints, swapVariables) {
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
    
        bresenhamsLine(endpoints) {
            const points = [];

            // алгоритм Брезенхема по умолчанию успешно рисует отрезки, направляющие вектора которых проходят в 1 октанте.
            // возможность перестановки точек начала и конца отрезка позволяет рисовать отрезки, направляющие вектора
            // которых проходят в 5 октанте.
            if (endpoints.start.x > endpoints.end.x) {
                this._swapEndpoints(endpoints);
            }
            const [x_start, y_start, x_end, y_end] = this._mapEndpoints(endpoints);
    
            const deltaX_raw = Math.abs(x_end - x_start);
            const deltaY_raw = Math.abs(y_end - y_start);
    
            // если абсолютное значение тангенса угла наклона прямой к оси X больше 1,
            // то следует поменять переменные местами: сделать Y независимой переменной,
            // а X - зависимой. возможность менять переменные местами позволяет алгоритму
            // рисовать отрезки, направляющие векторы которых проходят в 2 и 6 октантах.
            const swapVariables = Math.abs(deltaY_raw / deltaX_raw) > 1;
            const variableInfo = this._getDependentAndIndependentVariableInfo(endpoints, swapVariables);
    
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
                points.push(new Point(x, y));
    
                error += deltaErr;
                if (error >= 0.5) {
                    currDependentVariableValue += variableInfo.dependentStep;
                    error -= 1;
                }
            }

            return points;
        }
    
        wuLine(endpoints) {
            const idealLine = new Line(endpoints.start, endpoints.end);
            if (idealLine.angleToXAxis % 45 === 0) {
                // значит, линия горизонтальная, вертикальная или диагональная
                return this._ddaLine(endpoints);
            }

            const points = [];
    
            if (endpoints.start.x > endpoints.end.x) {
                this._swapEndpoints(endpoints);
            }
            const [x_start, y_start, x_end, y_end] = this._mapEndpoints(endpoints);
    
            const deltaX_raw = Math.abs(x_end - x_start);
            const deltaY_raw = Math.abs(y_end - y_start);
    
            const swapVariables = Math.abs(deltaY_raw / deltaX_raw) > 1;
            const variableInfo = this._getDependentAndIndependentVariableInfo(endpoints, swapVariables);
    
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
                points.push({
                    x: firstPointToDraw.x,
                    y: firstPointToDraw.y,
                    opacity: intensity1
                });
                points.push({
                    x: secondPointToDraw.x,
                    y: secondPointToDraw.y,
                    opacity: intensity2
                });
    
                error += deltaErr;
                // порог значения ошибки 1 нужен, так как в этом случае переход к следующему значению
                // зависимой переменной должен осуществляться после того, как значение выражения
                // currDependentVariableValue + error выходит за пределы следующего значения зависимой
                // переменной (т.к. алгоритм рисует блоками высотой 2 пикселя)
                if (error >= 1.5) {
                    currDependentVariableValue += variableInfo.dependentStep;
                    error -= 1;
                }
            }

            return points;
        }

        enterDdaDrawingMode() {
            this._enterPointSelection(2, this._exitDdaDrawingMode.bind(this));
        }

        _exitDdaDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            const pointsToDraw = this.ddaLine({
                start: startPoint,
                end: endPoint
            });
            this._model.addPoints(pointsToDraw);
        }

        enterBresenhamDrawingMode() {
            this._enterPointSelection(2, this._exitBresenhamDrawingMode.bind(this));
        }

        _exitBresenhamDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            const pointsToDraw = this.bresenhamsLine({
                start: startPoint,
                end: endPoint
            });
            this._model.addPoints(pointsToDraw);
        }

        enterWuDrawingMode() {
            this._enterPointSelection(2, this._exitWuDrawingMode.bind(this));
        }

        _exitWuDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            const pointsToDraw = this.wuLine({
                start: startPoint,
                end: endPoint
            });
            this._model.addPoints(pointsToDraw);
        }

        ////////////////////////////////////////
        ///////////////// lab2 /////////////////
        ////////////////////////////////////////

        enterEllipseDrawingMode() {
            this._enterPointSelection(1, this._exitEllipseDrawingMode.bind(this));
        }

        _exitEllipseDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');

            const horizontalEllipseAxis = new Line(origin, new Point(origin.x + a, origin.y));
            const verticalEllipseAxis = new Line(origin, new Point(origin.x, origin.y + b));
            const pointsToDraw_quadrant1 = this.ellipse(origin, a, b);
            const pointsToDraw_quadrant2 = pointsToDraw_quadrant1.map(point => point.reflectAlongLine(verticalEllipseAxis));
            const pointsToDraw_quadrant3 = pointsToDraw_quadrant2.map(point => point.reflectAlongLine(horizontalEllipseAxis));
            const pointsToDraw_quadrant4 = pointsToDraw_quadrant1.map(point => point.reflectAlongLine(horizontalEllipseAxis));

            const pointsToDraw = [
                ...pointsToDraw_quadrant1,
                ...pointsToDraw_quadrant2,
                ...pointsToDraw_quadrant3,
                ...pointsToDraw_quadrant4
            ];
            this._drawPointsOrStartDebugging(pointsToDraw);
        }

        enterHorizontalParabolaDrawingMode() {
            this._enterPointSelection(1, this._exitHorizontalParabolaDrawingMode.bind(this));
        }

        _exitHorizontalParabolaDrawingMode(selectedPoints) {
            const vertex = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const p = +prompt('Введите значение "p"');
            const xLimit = this._view.width / 2 - vertex.x;
            const yLimit = this._view.height / 2 - vertex.y;

            const parabolaAxis = new Line(vertex, new Point(vertex.x + 1, vertex.y));
            const parabolaUpperHalfPoints = this.horizontalParabola(vertex, p, xLimit, yLimit);
            const parabolaLowerHalfPoints = parabolaUpperHalfPoints.map(point => point.reflectAlongLine(parabolaAxis));
            const pointsToDraw = [
                ...parabolaUpperHalfPoints,
                ...parabolaLowerHalfPoints
            ];
            this._drawPointsOrStartDebugging(pointsToDraw);
        }

        enterVerticalParabolaDrawingMode() {
            this._enterPointSelection(1, this._exitVerticalParabolaDrawingMode.bind(this));
        }

        _exitVerticalParabolaDrawingMode(selectedPoints) {
            const vertex = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const p = +prompt('Введите значение "p"');
            const xLimit = this._view.width / 2 - vertex.x;
            const yLimit = this._view.height / 2 - vertex.y;

            const parabolaAxis = new Line(vertex, new Point(vertex.x, vertex.y + 1));
            const parabolaRightHalfPoints = this.verticalParabola(vertex, p, xLimit, yLimit);
            const parabolaLeftHalfPoints = parabolaRightHalfPoints.map(point => point.reflectAlongLine(parabolaAxis));
            const pointsToDraw = [
                ...parabolaRightHalfPoints,
                ...parabolaLeftHalfPoints
            ];
            this._drawPointsOrStartDebugging(pointsToDraw);
        }

        enterHorizontalHyperbolaDrawingMode() {
            this._enterPointSelection(1, this._exitHorizontalHyperbolaDrawingMode.bind(this));
        }

        _exitHorizontalHyperbolaDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');
            const Xlimit = this._view.width;
            const Ylimit = this._view.height;

            const horizontalHyperbolaAxis = new Line(origin, new Point(origin.x + 1, origin.y));
            const verticalHyperbolaAxis = new Line(origin, new Point(origin.x, origin.y + 1));
            const hyperbolaPoints_quadrant1 = this.horizontalHyperbola(origin, a, b, Xlimit, Ylimit);
            const hyperbolaPoints_quadrant2 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(verticalHyperbolaAxis));
            const hyperbolaPoints_quadrant3 = hyperbolaPoints_quadrant2.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));
            const hyperbolaPoints_quadrant4 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));

            const pointsToDraw = [
                ...hyperbolaPoints_quadrant1,
                ...hyperbolaPoints_quadrant2,
                ...hyperbolaPoints_quadrant3,
                ...hyperbolaPoints_quadrant4
            ];
            this._drawPointsOrStartDebugging(pointsToDraw);
        }

        enterVerticalHyperbolaDrawingMode() {
            this._enterPointSelection(1, this._exitVerticalHyperbolaDrawingMode.bind(this));
        }

        _exitVerticalHyperbolaDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');
            const Xlimit = this._view.width;
            const Ylimit = this._view.height;

            const horizontalHyperbolaAxis = new Line(origin, new Point(origin.x + 1, origin.y));
            const verticalHyperbolaAxis = new Line(origin, new Point(origin.x, origin.y + 1));
            const hyperbolaPoints_quadrant1 = this.verticalHyperbola(origin, a, b, Xlimit, Ylimit);
            const hyperbolaPoints_quadrant2 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(verticalHyperbolaAxis));
            const hyperbolaPoints_quadrant3 = hyperbolaPoints_quadrant2.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));
            const hyperbolaPoints_quadrant4 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));

            const pointsToDraw = [
                ...hyperbolaPoints_quadrant1,
                ...hyperbolaPoints_quadrant2,
                ...hyperbolaPoints_quadrant3,
                ...hyperbolaPoints_quadrant4
            ];
            this._drawPointsOrStartDebugging(pointsToDraw);
        }

        toggleDebuggingMode() {
            this._debuggingModeEnabled = !this._debuggingModeEnabled;
            return this._debuggingModeEnabled;
        }

        _setPointsToDrawQueue(points) {
            this._pointsToDrawQueue = [...points];
        }

        _addEnterPressEventListener() {
            document.addEventListener('keydown', this._drawNextPointEventListener);
        }

        _drawNextPoint() {
            this._model.addPoint(this._pointsToDrawQueue.shift());
        }

        _drawAllRemainingPoints() {
            while(this._pointsToDrawQueue.length > 0) {
                this._drawNextPoint();
            }
        }

        _drawNextPointEventListener(event) {
            if (event.key !== 'Enter') return;
            if (!event.shiftKey) {
                this._drawNextPoint();
            } else {
                this._drawAllRemainingPoints();
            }
            if (this._pointsToDrawQueue.length === 0) {
                document.removeEventListener('keydown', this._drawNextPointEventListener);
            }
        }

        _drawPointsOrStartDebugging(pointsToDraw) {
            if (this._debuggingModeEnabled) {
                this._setPointsToDrawQueue(pointsToDraw);
                this._addEnterPressEventListener();
            } else {
                this._model.addPoints(pointsToDraw);
            }
        }

        _ellipsePointError(x, y, a, b) {
            return Math.abs((x**2 / a**2) + (y**2 / b**2) - 1);
        }

        ellipse(origin, a, b) {
            const points = [];

            let currX = 0;
            let currY = b;
            do {
                points.push(new Point(currX + origin.x, currY + origin.y));

                const horizontalPixelError = this._ellipsePointError(currX + 1, currY, a, b);
                const verticalPixelError = this._ellipsePointError(currX, currY - 1, a, b);
                const diagonalPixelError = this._ellipsePointError(currX + 1, currY - 1, a, b);
                const minimalError = Math.min(horizontalPixelError, verticalPixelError, diagonalPixelError);

                if (minimalError === horizontalPixelError) {
                    currX++;
                } else if (minimalError === verticalPixelError) {
                    currY--;
                } else {
                    currX++;
                    currY--;
                }
            } while (currY >= 0);

            return points;
        }

        _horizontalParabolaPointError(x, y, p) {
            return Math.abs((y**2 / x) - 2*p);
        }

        horizontalParabola(vertex, p, Xlimit, Ylimit) {
            const points = [];

            let currX = 0;
            let currY = 0;
            do {
                points.push(new Point(currX + vertex.x, currY + vertex.y));

                const horizontalPixelError = this._horizontalParabolaPointError(currX + 1, currY, p);
                const verticalPixelError = this._horizontalParabolaPointError(currX, currY + 1, p);
                const diagonalPixelError = this._horizontalParabolaPointError(currX + 1, currY + 1, p);
                const minimalError = Math.min(horizontalPixelError, verticalPixelError, diagonalPixelError);

                if (minimalError === horizontalPixelError) {
                    currX++;
                } else if (minimalError === verticalPixelError) {
                    currY++;
                } else {
                    currX++;
                    currY++;
                }
            } while(currX < Xlimit && currY < Ylimit);

            return points;
        }

        _verticalParabolaPointError(x, y, p) {
            return Math.abs((x**2 / y) - 2*p);
        }

        verticalParabola(vertex, p, Xlimit, Ylimit) {
            const points = [];

            let currX = 0;
            let currY = 0;
            do {
                points.push(new Point(currX + vertex.x, currY + vertex.y));

                const horizontalPixelError = this._verticalParabolaPointError(currX + 1, currY, p);
                const verticalPixelError = this._verticalParabolaPointError(currX, currY + 1, p);
                const diagonalPixelError = this._verticalParabolaPointError(currX + 1, currY + 1, p);
                const minimalError = Math.min(horizontalPixelError, verticalPixelError, diagonalPixelError);

                if (minimalError === horizontalPixelError) {
                    currX++;
                } else if (minimalError === verticalPixelError) {
                    currY++;
                } else {
                    currX++;
                    currY++;
                }
            } while(currX < Xlimit && currY < Ylimit);

            return points;
        }

        _horizontalHyperbolaPointError(x, y, a, b) {
            return Math.abs((x**2 / a**2) - (y**2 / b**2) - 1);
        }

        horizontalHyperbola(origin, a, b, Xlimit, Ylimit) {
            const points = [];

            let currX = a;
            let currY = 0;
            do {
                points.push(new Point(currX + origin.x, currY + origin.y));

                const horizontalPixelError = this._horizontalHyperbolaPointError(currX + 1, currY, a, b);
                const verticalPixelError = this._horizontalHyperbolaPointError(currX, currY + 1, a, b);
                const diagonalPixelError = this._horizontalHyperbolaPointError(currX + 1, currY + 1, a, b);
                const minimalError = Math.min(horizontalPixelError, verticalPixelError, diagonalPixelError);

                if (minimalError === horizontalPixelError) {
                    currX++;
                } else if (minimalError === verticalPixelError) {
                    currY++;
                } else {
                    currX++;
                    currY++;
                }
            } while(currX < Xlimit && currY < Ylimit);

            return points;
        }

        _verticalHyperbolaPointError(x, y, a, b) {
            return Math.abs((y**2 / b**2) - (x**2 / a**2) - 1);
        }

        verticalHyperbola(origin, a, b, Xlimit, Ylimit) {
            const points = [];

            let currX = 0;
            let currY = b;
            do {
                points.push(new Point(currX + origin.x, currY + origin.y));

                const horizontalPixelError = this._verticalHyperbolaPointError(currX + 1, currY, a, b);
                const verticalPixelError = this._verticalHyperbolaPointError(currX, currY + 1, a, b);
                const diagonalPixelError = this._verticalHyperbolaPointError(currX + 1, currY + 1, a, b);
                const minimalError = Math.min(horizontalPixelError, verticalPixelError, diagonalPixelError);

                if (minimalError === horizontalPixelError) {
                    currX++;
                } else if (minimalError === verticalPixelError) {
                    currY++;
                } else {
                    currX++;
                    currY++;
                }
            } while(currX < Xlimit && currY < Ylimit);

            return points;
        }

        ////////////////////////////////////////
        ///////////////// lab3 /////////////////
        ////////////////////////////////////////

        _getHermiteFormParameterizedFunctions(coefficients) {
            function x_t(t) {
                return (t**3 * coefficients.getElementAt(1, 1))
                    + (t**2 * coefficients.getElementAt(2, 1))
                    + (t * coefficients.getElementAt(3, 1))
                    + coefficients.getElementAt(4, 1);
            }

            function y_t(t) {
                return (t**3 * coefficients.getElementAt(1, 1))
                    + (t**2 * coefficients.getElementAt(1, 2))
                    + (t * coefficients.getElementAt(1, 3))
                    + coefficients.getElementAt(1, 4);
            }

            return [x_t, y_t];
        }

        hermiteForm(P1, P4, R1, R4) {
            const points = [];

            const coordinateMatrix = new Matrix(4, 2);
            coordinateMatrix.setElements([
                [P1.x, P1.y],
                [P4.x, P4.y],
                [R1.x, R1.y],
                [R4.x, R4.y]
            ]);
            const coefficients = ReusableEntities.hermiteMatrix.multiply(coordinateMatrix);
            const [x_t, y_t] = this._getHermiteFormParameterizedFunctions(coefficients);

            return points;
        }
    }

    return {
        CanvasController
    }
})();

class HintController {
    _defaultHintText = 'Режим не выбран';

    constructor(hintElemId = 'hint') {
        this._hintElem = document.getElementById(hintElemId);
        this.resetHint();
    }

    setHintText(text) {
        this._hintElem.innerHTML = text;
    }

    resetHint() {
        this.setHintText(this._defaultHintText);
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

class GeometryUtils {
    static radiansToDegrees(radians) {
        return Math.round(radians * 180 / Math.PI);
    }
}

const geometryModule = (function () {
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

        moveAlongVector(vector, scale = 1) {
            return new Point(
                this._x + vector.x * scale,
                this._y + vector.y * scale,
                this._z + vector.z * scale
            );
        }

        reflectAroundPoint(point) {
            return this.moveAlongVector(new Vector(this, point), 2);
        }

        reflectAlongLine(line) {
            return this.reflectAroundPoint(line.closestOwnPointToPoint(this));
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
            return (this._x * vector.x + this._y * vector.y + this._z * vector._z);
        }

        crossProduct(vector) {
            return new Vector(
                new Point(this._y * vector.z, this._z * vector.x, this._x * vector.y),
                new Point(this._z * vector.y, this._z * vector.y, this._y * vector.x)
            )
        }

        toNormalized() {
            return new Vector(
                new Point(0, 0, 0),
                new Point(
                    this._x / this.modulus,
                    this._y / this.modulus,
                    this._z / this.modulus
                )
            );
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

        closestOwnPointToPoint(point) {
            const normalizedDirectionVector = this._directionVector.toNormalized();
            const helperVector = new Vector(this._point, point);
            const dotProduct = helperVector.dotProduct(normalizedDirectionVector);
            return new Point(
                this._point.x + normalizedDirectionVector.x * dotProduct,
                this._point.y + normalizedDirectionVector.y * dotProduct,
                this._point.z + normalizedDirectionVector.z * dotProduct
            )
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

const linearAlgebraModule = (function () {
    class Vector {
        constructor(array) {
            this._vector = [...array];
        }

        dotProduct(vector) {
            return this._vector
                .map((el, index) => el + vector.getElementAt(index))
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

    return {
        hermiteMatrix
    }
})();

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

const canvas = new canvasModule.CanvasController();
const hint = new HintController();
const toolbar = new toolbarModule.ToolbarController([
    new Section('Отрезки', [
        new Button('ЦДА', () => {
            canvas.enterDdaDrawingMode();
            hint.setHintText('Режим рисования отрезка (ЦДА)');
        }),
        new Button('Брезенхейм', () => {
            canvas.enterBresenhamDrawingMode();
            hint.setHintText('Режим рисования отрезка (алгоритм Брезенхейма)');
        }),
        new Button('Ву', () => {
            canvas.enterWuDrawingMode();
            hint.setHintText('Режим рисования отрезка (алгоритм Ву)');
        })
    ]),
    new Section('Линии второго порядка', [
        new Button('*ОТЛАДОЧНЫЙ РЕЖИМ*', () => {
            const debugging = canvas.toggleDebuggingMode();
            alert(`Отладочный режим ${debugging ? 'включен' : 'отключен'}`);
        }),
        new Button('Эллипс', () => {
            canvas.enterEllipseDrawingMode();
            hint.setHintText('Режим рисования эллипса');
        }),
        new Button('Парабола (горизонтальная)', () => {
            canvas.enterHorizontalParabolaDrawingMode();
            hint.setHintText('Режим рисования горизонтальной параболы');
        }),
        new Button('Парабола (вертикальная)', () => {
            canvas.enterVerticalParabolaDrawingMode();
            hint.setHintText('Режим рисования вертикальной параболы');
        }),
        new Button('Гипербола (горизонтальная)', () => {
            canvas.enterHorizontalHyperbolaDrawingMode();
            hint.setHintText('Режим рисования горизонтальной гиперболы');
        }),
        new Button('Гипербола (вертикальная)', () => {
            canvas.enterVerticalHyperbolaDrawingMode();
            hint.setHintText('Режим рисования вертикальной гиперболы');
        })
    ])
]);

document.addEventListener('drawing-finished', () => {
    hint.resetHint();
});