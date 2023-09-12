const canvasModule = (function () {
    class CanvasModel {
        _ddaLineSegments = [];
        _bresenhamLineSegments = [];
        _wuLineSegments = [];
        _ellipses = [];
        _parabolas = [];
        _hyperbolas = [];
        _hermiteCurves = [];
        _bezierCurves = [];
        _vSplines = [];

        constructor(view) {
            this._view = view;
        }

        _addFigure(list, figure) {
            list.push(figure);
        }

        addDdaLineSegment(lineSegment) {
            this._addFigure(this._ddaLineSegments, new geometryModule.LineSegment(lineSegment.P1, lineSegment.P2));
        }

        addBresenhamLineSegment(lineSegment) {
            this._addFigure(this._bresenhamLineSegments, new geometryModule.LineSegment(lineSegment.P1, lineSegment.P2));
        }
        
        addWuLineSegment(lineSegment) {
            this._addFigure(this._wuLineSegments, new geometryModule.LineSegment(lineSegment.P1, lineSegment.P2));
        }

        addEllipse(ellipse) {
            this._addFigure(this._ellipses, new geometryModule.Ellipse(ellipse.origin, ellipse.a, ellipse.b));
        }

        addParabola(parabola) {
            this._addFigure(this._parabolas, new geometryModule.Parabola(parabola.vertex, parabola.p, parabola.isHorizontal));
        }

        addHyperbola(hyperbola) {
            this._addFigure(this._hyperbolas, new geometryModule.Hyperbola(hyperbola.origin, hyperbola.a, hyperbola.b));
        }

        addHermiteCurve(hermiteCurve) {
            this._addFigure(this._hermiteCurves, new geometryModule.HermiteCurve(hermiteCurve.P1, hermiteCurve.P4, hermiteCurve.R1, hermiteCurve.R4));
        }

        addBezierCurve(bezierCurve) {
            this._addFigure(this._bezierCurves, new geometryModule.BezierCurve(bezierCurve.P1, bezierCurve.P2, bezierCurve.P3, bezierCurve.P4));
        }

        addVSpline(vSpline) {
            this._addFigure(this._vSplines, new geometryModule.VSpline(vSpline.points));
        }

        get ddaLineSegments() { return this._ddaLineSegments; }
        get bresenhamLineSegments() { return this._bresenhamLineSegments; }
        get wuLineSegments() { return this._wuLineSegments; }
        get ellipses() { return this._ellipses; }
        get parabolas() { return this._parabolas; }
        get hyperbolas() { return this._hyperbolas; }
        get hermiteCurves() { return this._hermiteCurves; }
        get bezierCurves() { return this._bezierCurves; }
        get vSplines() { return this._vSplines; }
    }

    class CanvasView {
        _DEFAULT_COLOR = {
            red: 0,
            green: 0,
            blue: 0
        }
        _DEFAULT_HIGHLIGHT_COLOR = {
            red: 255,
            green: 0,
            blue: 0
        }
        _minScale = 1;
        _maxScale = 64;
        _currScale = 1;
        _currTranslationStep = 0;
        _debuggingModeEnabled = false;

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
        }

        drawPoint(x, y, opacity = 1, color = this._DEFAULT_COLOR) {
            this._ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;
            this._ctx.fillRect(Math.trunc(this._origin.x + x), Math.trunc(this._origin.y - y), 1, 1);
        }

        drawPoints(points) {
            points.forEach(point => {
                this.drawPoint(point.x, point.y, point.opacity ?? 1, point.color ?? this._DEFAULT_COLOR);
            });
        }

        scaleUp() {
            if (this._currScale === this._minScale) {
                this._ctx.save();
            }
            if (this._currScale === this._maxScale) {
                return;
            }
            this._currScale *= 2;
            this._ctx.scale(2, 2);
            this._updateTranslationStep();
        }

        scaleDown() {
            if (this._currScale === this._minScale) {
                return;
            }
            this._currScale = 1;
            this._updateTranslationStep();
            this._resetTranslation();
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
        }

        shiftCanvasUp() {
            this._shiftCanvas(0, this._currTranslationStep);
        }

        shiftCanvasDown() {
            this._shiftCanvas(0, -this._currTranslationStep);
        }

        shiftCanvasLeft() {
            this._shiftCanvas(this._currTranslationStep, 0);
        }

        shiftCanvasRight() {
            this._shiftCanvas(-this._currTranslationStep, 0);
        }

        _updateTranslationStep() {
            this._currTranslationStep = (50 / this._currScale**2) * (this._currScale - 1);
        }

        _resetTranslation() {
            this._ctx.restore();
            this.redrawCanvas();
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
                this.drawPoints(pointsToDraw);
            }
        }

        highlightPoint(x, y, color = this._DEFAULT_HIGHLIGHT_COLOR) {
            this._ctx.strokeStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            this._ctx.beginPath();
            this._ctx.arc(this._origin.x + x, this._origin.y - y, 5, 0, 2 * Math.PI);
            this._ctx.stroke();
        }

        highlightPoints(points, color) {
            points.forEach(point => this.highlightPoint(point.x, point.y, color));
        }

        get width() { return this._width; }

        get height() { return this._height; }
    }

    class CanvasController {
        _drawingFinishedEvent = new Event('drawing-finished');
        _debuggingModeEnabled = false;
        _pointsToDrawQueue = [];
        _pointCorrectionModeEnabled = false;

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
        }

        _addScalingEventListener() {
            this._canvasHtmlElem.addEventListener('wheel', (event) => {
                event.preventDefault();

                const scaling = event.deltaY * -0.01;
                if (scaling === 1) {
                    this._view.scaleUp();
                }
                if (scaling === -1) {
                    this._view.scaleDown();
                }
                this._model.redrawCanvas();
            });
        }

        _addTranslationEventListener() {
            document.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowUp') {
                    this._view.shiftCanvasUp();
                } else if (event.key === 'ArrowDown') {
                    this._view.shiftCanvasDown();
                } else if (event.key === 'ArrowLeft') {
                    this._view.shiftCanvasLeft();
                } else if (event.key === 'ArrowRight') {
                    this._view.shiftCanvasRight();
                } else {
                    return;
                }

                this._model.redrawCanvas();
            });
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
                    this._redrawCanvas();
                    document.dispatchEvent(this._drawingFinishedEvent);
                }
            };
            this._canvasHtmlElem.addEventListener('click', clickListener);
        }

        _redrawCanvas() {
            const ddaLineSegments = this._model.ddaLineSegments.map(lineSegment => this._ddaLine(
                {
                    start: lineSegment.P1,
                    end: lineSegment.P2
                }
            ));
            const bresenhamLineSegments = this._model.bresenhamLineSegments.map(lineSegment => this._bresenhamsLine(
                {
                    start: lineSegment.P1,
                    end: lineSegment.P2
                }
            ));
            const wuLineSegments = this._model.wuLineSegments.map(lineSegment => this._wuLine(
                {
                    start: lineSegment.P1,
                    end: lineSegment.P2
                }
            ));

            const ellipses = this._model.ellipses.map(ellipse => this.ellipse(ellipse.origin, ellipse.a, ellipse.b));

            const rawParabolas = this._model.parabolas;
            const horizontalParabolas = rawParabolas
                .filter(parabola => parabola.isHorizontal)
                .map(parabola => this.horizontalParabola(parabola.vertex, parabola.p));
            const verticalParabolas = rawParabolas
                .filter(parabola => !parabola.isHorizontal)
                .map(parabola => this.verticalParabola(parabola.vertex, parabola.p));

            const rawHyperbolas = this._model.hyperbolas;
            const horizontalHypebrolas = rawHyperbolas
                .filter(hyperbola => hyperbola.isHorizontal)
                .map(hyperbola => this.horizontalHyperbola(hyperbola.origin, hyperbola.a, hyperbola.b));
            const verticalHypebrolas = rawHyperbolas
                .filter(hyperbola => !hyperbola.isHorizontal)
                .map(hyperbola => this.verticalHyperbola(hyperbola.origin, hyperbola.a, hyperbola.b));

            const hermiteCurves = this._model.hermiteCurves.map(curve => this.hermiteForm(curve.P1, curve.P4, curve.R1, curve.R4));
            const bezierCurves = this._model.bezierCurves.map(curve => this.bezierForm(curve.P1, curve.P2, curve.P3, curve.P4));
            const vSplines = this._model.vSplines.map(vSpline => this.vSpline(vSpline.points));

            const pointsToDraw = [
                ...ddaLineSegments.flat(),
                ...bresenhamLineSegments.flat(),
                ...wuLineSegments.flat(),
                ...ellipses.flat(),
                ...horizontalParabolas.flat(),
                ...verticalParabolas.flat(),
                ...horizontalHypebrolas.flat(),
                ...verticalHypebrolas.flat(),
                ...hermiteCurves.flat(),
                ...bezierCurves.flat(),
                ...vSplines.flat()
            ];

            this._view.redrawCanvas();
            this._view.drawPoints(pointsToDraw);
        }

        ////////////////////////////////////////
        ///////////////// lab1 /////////////////
        ////////////////////////////////////////

        _mapEndpoints(endpoints) {
            return [endpoints.start.x, endpoints.start.y, endpoints.end.x, endpoints.end.y].map(Math.round);
        }
    
        _ddaLine(endpoints) {
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
                    x: currX,
                    y: currY
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
    
        _bresenhamsLine(endpoints) {
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
    
        _wuLine(endpoints) {
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

            this._model.addDdaLineSegment(new geometryModule.LineSegment(startPoint, endPoint));
        }

        enterBresenhamDrawingMode() {
            this._enterPointSelection(2, this._exitBresenhamDrawingMode.bind(this));
        }

        _exitBresenhamDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            this._model.addBresenhamLineSegment(new geometryModule.LineSegment(startPoint, endPoint));
        }

        enterWuDrawingMode() {
            this._enterPointSelection(2, this._exitWuDrawingMode.bind(this));
        }

        _exitWuDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            this._model.addWuLineSegment(new geometryModule.LineSegment(startPoint, endPoint));
        }

        ////////////////////////////////////////
        ///////////////// lab2 /////////////////
        ////////////////////////////////////////

        _ellipsePointError(x, y, a, b) {
            return Math.abs((x**2 / a**2) + (y**2 / b**2) - 1);
        }

        ellipse(origin, a, b) {
            const points_quadrant1 = [];

            let currX = 0;
            let currY = b;
            do {
                points_quadrant1.push(new Point(currX + origin.x, currY + origin.y));

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

            const horizontalEllipseAxis = new Line(origin, new Point(origin.x + 1, origin.y));
            const verticalEllipseAxis = new Line(origin, new Point(origin.x, origin.y + b));
            const points_quadrant2 = points_quadrant1.map(point => point.reflectAlongLine(verticalEllipseAxis));
            const points_quadrant3 = points_quadrant2.map(point => point.reflectAlongLine(horizontalEllipseAxis));
            const points_quadrant4 = points_quadrant1.map(point => point.reflectAlongLine(horizontalEllipseAxis));

            return [
                ...points_quadrant1,
                ...points_quadrant2,
                ...points_quadrant3,
                ...points_quadrant4
            ];
        }

        _horizontalParabolaPointError(x, y, p) {
            return Math.abs((y**2 / x) - p);
        }

        horizontalParabola(vertex, p, Xlimit = this._view.width / 2 - vertex.x, Ylimit = this._view.height / 2 - vertex.y) {
            const points_upperHalf = [];

            let currX = 0;
            let currY = 0;
            do {
                points_upperHalf.push(new Point(currX + vertex.x, currY + vertex.y));

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

            const parabolaAxis = new Line(vertex, new Point(vertex.x + 1, vertex.y));
            const points_lowerHalf = points_upperHalf.map(point => point.reflectAlongLine(parabolaAxis));

            return [
                ...points_upperHalf,
                ...points_lowerHalf
            ];
        }

        _verticalParabolaPointError(x, y, p) {
            return Math.abs((x**2 / y) - p);
        }

        verticalParabola(vertex, p, Xlimit = this._view.width / 2 - vertex.x, Ylimit = this._view.height / 2 - vertex.y) {
            const points_rightHalf = [];

            let currX = 0;
            let currY = 0;
            do {
                points_rightHalf.push(new Point(currX + vertex.x, currY + vertex.y));

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

            const parabolaAxis = new Line(vertex, new Point(vertex.x, vertex.y + 1));
            const points_leftHalf = points_rightHalf.map(point => point.reflectAlongLine(parabolaAxis));

            return [
                ...points_leftHalf,
                ...points_rightHalf
            ];
        }

        _horizontalHyperbolaPointError(x, y, a, b) {
            return Math.abs((x**2 / a**2) - (y**2 / b**2) - 1);
        }

        horizontalHyperbola(origin, a, b, Xlimit = this._view.width, Ylimit = this._view.height) {
            const points_quadrant1 = [];

            let currX = a;
            let currY = 0;
            do {
                points_quadrant1.push(new Point(currX + origin.x, currY + origin.y));

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

            const horizontalHyperbolaAxis = new Line(origin, new Point(origin.x + 1, origin.y));
            const verticalHyperbolaAxis = new Line(origin, new Point(origin.x, origin.y + 1));
            const points_quadrant2 = points_quadrant1.map(point => point.reflectAlongLine(verticalHyperbolaAxis));
            const points_quadrant3 = points_quadrant2.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));
            const points_quadrant4 = points_quadrant1.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));

            return [
                ...points_quadrant1,
                ...points_quadrant2,
                ...points_quadrant3,
                ...points_quadrant4
            ];
        }

        _verticalHyperbolaPointError(x, y, a, b) {
            return Math.abs((y**2 / b**2) - (x**2 / a**2) - 1);
        }

        verticalHyperbola(origin, a, b, Xlimit = this._view.width, Ylimit = this._view.height) {
            const points_quadrant1 = [];

            let currX = 0;
            let currY = b;
            do {
                points_quadrant1.push(new Point(currX + origin.x, currY + origin.y));

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

            const horizontalHyperbolaAxis = new Line(origin, new Point(origin.x + 1, origin.y));
            const verticalHyperbolaAxis = new Line(origin, new Point(origin.x, origin.y + 1));
            const points_quadrant2 = points_quadrant1.map(point => point.reflectAlongLine(verticalHyperbolaAxis));
            const points_quadrant3 = points_quadrant2.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));
            const points_quadrant4 = points_quadrant1.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));

            return [
                ...points_quadrant1,
                ...points_quadrant2,
                ...points_quadrant3,
                ...points_quadrant4
            ];
        }

        enterEllipseDrawingMode() {
            this._enterPointSelection(1, this._exitEllipseDrawingMode.bind(this));
        }

        _exitEllipseDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');

            this._model.addEllipse(new geometryModule.Ellipse(origin, a, b));
        }

        enterHorizontalParabolaDrawingMode() {
            this._enterPointSelection(1, this._exitHorizontalParabolaDrawingMode.bind(this));
        }

        _exitHorizontalParabolaDrawingMode(selectedPoints) {
            const vertex = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const p = +prompt('Введите значение "p"');

            this._model.addParabola(new geometryModule.Parabola(vertex, p, true));
        }

        enterVerticalParabolaDrawingMode() {
            this._enterPointSelection(1, this._exitVerticalParabolaDrawingMode.bind(this));
        }

        _exitVerticalParabolaDrawingMode(selectedPoints) {
            const vertex = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const p = +prompt('Введите значение "p"');

            this._model.addParabola(new geometryModule.Parabola(vertex, p, false));
        }

        enterHorizontalHyperbolaDrawingMode() {
            this._enterPointSelection(1, this._exitHorizontalHyperbolaDrawingMode.bind(this));
        }

        _exitHorizontalHyperbolaDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');

            this._model.addHyperbola(new geometryModule.Hyperbola(origin, a, b, true));
        }

        enterVerticalHyperbolaDrawingMode() {
            this._enterPointSelection(1, this._exitVerticalHyperbolaDrawingMode.bind(this));
        }

        _exitVerticalHyperbolaDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');

            this._model.addHyperbola(new geometryModule.Hyperbola(origin, a, b, false));
        }

        toggleDebuggingMode() {
            return this._view.toggleDebuggingMode();
        }

        ////////////////////////////////////////
        ///////////////// lab3 /////////////////
        ////////////////////////////////////////

        _getXtAndYtFromCoefficients(coefficients) {
            function x_t(t) {
                return (t**3 * coefficients.getElementAt(1, 1))
                    + (t**2 * coefficients.getElementAt(2, 1))
                    + (t * coefficients.getElementAt(3, 1))
                    + coefficients.getElementAt(4, 1);
            }

            function y_t(t) {
                return (t**3 * coefficients.getElementAt(1, 2))
                    + (t**2 * coefficients.getElementAt(2, 2))
                    + (t * coefficients.getElementAt(3, 2))
                    + coefficients.getElementAt(4, 2);
            }

            return [x_t, y_t];
        }

        hermiteForm(P1, P4, R1, R4, tStep = 0.001) {
            const points = [];

            const coordinateMatrix = new Matrix(4, 2);
            coordinateMatrix.setElements([
                [P1.x, P1.y],
                [P4.x, P4.y],
                [R1.x, R1.y],
                [R4.x, R4.y]
            ]);
            const coefficients = ReusableEntities.hermiteMatrix.multiply(coordinateMatrix);
            const [x, y] = this._getXtAndYtFromCoefficients(coefficients);

            for (let t = 0; t <= 1; t += tStep) {
                points.push(new Point(x(t), y(t)));
            }

            return points;
        }

        bezierForm(P1, P2, P3, P4, tStep = 0.001) {
            const points = [];

            const coordinateMatrix = new Matrix(4, 2);
            coordinateMatrix.setElements([
                [P1.x, P1.y],
                [P2.x, P2.y],
                [P3.x, P3.y],
                [P4.x, P4.y]
            ]);
            const coefficients = ReusableEntities.bezierMatrix.multiply(coordinateMatrix);
            const [x, y] = this._getXtAndYtFromCoefficients(coefficients);

            for (let t = 0; t <= 1; t += tStep) {
                points.push(new Point(x(t), y(t)));
            }

            return points;
        }

        vSplineSegment(P1, P2, P3, P4, tStep = 0.001) {
            const points = [];

            const coordinateMatrix = new Matrix(4, 2);
            coordinateMatrix.setElements([
                [P1.x, P1.y],
                [P2.x, P2.y],
                [P3.x, P3.y],
                [P4.x, P4.y]
            ]);
            const coefficients = ReusableEntities.vSplineMatrix.multiply(coordinateMatrix);
            const [x, y] = this._getXtAndYtFromCoefficients(coefficients);

            for (let t = 0; t <= 1; t += tStep) {
                points.push(new Point(x(t), y(t)));
            }

            return points;
        }

        vSpline(referencePoints) {
            referencePoints = [
                ...referencePoints,
                referencePoints[0],
                referencePoints[1],
                referencePoints[2]
            ];
            
            const points = [];
            for (let pointIndex = 0; pointIndex < referencePoints.length - 3; pointIndex++) {
                points.push(...this.vSplineSegment(
                    referencePoints[pointIndex],
                    referencePoints[pointIndex + 1],
                    referencePoints[pointIndex + 2],
                    referencePoints[pointIndex + 3]
                ));
            }
            return points;
        }

        enterHermiteFormDrawingMode() {
            this._enterPointSelection(2, this._exitHermiteFormDrawingMode.bind(this));
        }

        _getSlopeVector(userInput) {
            const coordinates = userInput.split(', ');
            return new Vector(new Point(0, 0), new Point(coordinates[0], coordinates[1]));
        }

        _exitHermiteFormDrawingMode(selectedPoints) {
            const P1 = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const P4 = new Point(selectedPoints[1].x, selectedPoints[1].y);
            const R1 = this._getSlopeVector(prompt('Введите: R1_x, R1_y'));
            const R4 = this._getSlopeVector(prompt('Введите: R4_x, R4_y'));

            this._model.addHermiteCurve(new geometryModule.HermiteCurve(P1, P4, R1, R4));
        }

        enterBezierFormDrawingMode() {
            this._enterPointSelection(4, this._exitBezierFormDrawingMode.bind(this));
        }

        _exitBezierFormDrawingMode(selectedPoints) {
            this._model.addBezierCurve(new geometryModule.BezierCurve(selectedPoints[0], selectedPoints[1], selectedPoints[2], selectedPoints[3]));
        }

        enterVsplineDrawingMode() {
            const segmentsQuantity = +prompt('Введите количество сегментов сплайна');
            this._enterPointSelection(segmentsQuantity + 1, this._exitVsplineDrawingMode.bind(this));
        }

        _exitVsplineDrawingMode(selectedPoints) {
            this._model.addVSpline(new geometryModule.VSpline(selectedPoints));
        }

        togglePointCorrectionMode() {
            this._pointCorrectionModeEnabled = !this._pointCorrectionModeEnabled;
            return this._pointCorrectionModeEnabled;
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////

        __TEST__() {
            this._view.highlightPoint(100, 100);
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

    class LineSegment {
        constructor(point1, point2) {
            this._point1 = new Point(point1.x, point1.y, point1.z);
            this._point2 = new Point(point2.x, point2.y, point2.z);
        }

        get P1() { return new Point(this._point1.x, this._point1.y, this._point1.z); }
        get P2() { return new Point(this._point2.x, this._point2.y, this._point2.z); }
    }

    class Ellipse {
        constructor(origin, a, b) {
            this._origin = new Point(origin.x, origin.y, origin.z);
            this._a = a;
            this._b = b;
        }

        get origin() { return new Point(this._origin.x, this._origin.y, this._origin.z); }
        get a() { return this._a; }
        get b() { return this._b; }
    }

    class Hyperbola {
        constructor(origin, a, b, isHorizontal) {
            this._origin = new Point(origin.x, origin.y, origin.z);
            this._a = a;
            this._b = b;
            this._isHorizontal = isHorizontal;
        }

        get origin() { return new Point(this._origin.x, this._origin.y, this._origin.z); }
        get a() { return this._a; }
        get b() { return this._b; }
        get isHorizontal() { return this._isHorizontal; }
    }

    class Parabola {
        constructor(vertex, p, isHorizontal) {
            this._vertex = new Point(vertex.x, vertex.y, vertex.z);
            this._p  = p;
            this._isHorizontal = isHorizontal;
        }

        get vertex() { return new Point(this._vertex.x, this._vertex.y, this._vertex.z); }
        get p() { return this._p; }
        get isHorizontal() { return this._isHorizontal; }
    }

    class HermiteCurve {
        constructor(P1, P4, R1, R4) {
            console.log(arguments);
            this._P1 = new Point(P1.x, P1.y, P1.z);
            this._P4 = new Point(P4.x, P4.y, P4.z);
            this._R1 = new Vector(new Point(0, 0, 0), new Point(R1.x, R1.y, R1.z));
            this._R4 = new Vector(new Point(0, 0, 0), new Point(R4.x, R4.y, R4.z));
        }

        get P1() { return new Point(this._P1.x, this._P1.y, this._P1.z); }
        get P4() { return new Point(this._P4.x, this._P4.y, this._P4.z); }
        get R1() { return new Vector(new Point(0, 0, 0), new Point(this._R1.x, this._R1.y, this._R1.z)); }
        get R4() { return new Vector(new Point(0, 0, 0), new Point(this._R4.x, this._R4.y, this._R4.z)); }
    }

    class BezierCurve {
        constructor(P1, P2, P3, P4) {
            this._P1 = new Point(P1.x, P1.y, P1.z);
            this._P2 = new Point(P2.x, P2.y, P2.z);
            this._P3 = new Point(P3.x, P3.y, P3.z);
            this._P4 = new Point(P4.x, P4.y, P4.z);
        }

        get P1() { return new Point(this._P1.x, this._P1.y, this._P1.z); }
        get P2() { return new Point(this._P2.x, this._P2.y, this._P2.z); }
        get P3() { return new Point(this._P3.x, this._P3.y, this._P3.z); }
        get P4() { return new Point(this._P4.x, this._P4.y, this._P4.z); }
    }

    class VSpline {
        constructor(points) {
            this._points = points.map(point => new Point(point.x, point.y, point.z));
        }

        get points() { return this._points.map(point => new Point(point.x, point.y, point.z)); }
    }

    return {
        Point,
        Vector,
        Line,
        LineSegment,
        Ellipse,
        Hyperbola,
        Parabola,
        HermiteCurve,
        BezierCurve,
        VSpline
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

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

const canvas = new canvasModule.CanvasController();
const hint = new HintController();
const toolbar = new toolbarModule.ToolbarController([
    new Section('Режимы', [
        new Button('Отладочный', () => {
            const debugging = canvas.toggleDebuggingMode();
            alert(`Отладочный режим ${debugging ? 'включен' : 'отключен'}`);
        }),
        new Button('Режим корректировки опорных точек', () => {
            const correcting = canvas.togglePointCorrectionMode();
            alert(`Режим корректировки опорных точек ${correcting ? 'включен' : 'отключен'}`);
        })
    ]),
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
    ]),
    new Section('Кривые', [
        new Button('Эрмитова форма', () => {
            canvas.enterHermiteFormDrawingMode();
            hint.setHintText('Режим рисования кривой (Эрмитова форма)');
        }),
        new Button('Форма Безье', () => {
            canvas.enterBezierFormDrawingMode();
            hint.setHintText('Режим рисования кривой (Форма Безье)');
        }),
        new Button('В-сплайн', () => {
            canvas.enterVsplineDrawingMode();
            hint.setHintText('Режим рисования кривой (В-сплайн)');
        }),
        new Button('test', () => {
            canvas.__TEST__();
        })
    ])
]);

document.addEventListener('drawing-finished', () => {
    hint.resetHint();
});