const canvasModule = (function () {
    class CanvasModel {
        _modelSnapshot = null;

        _ddaLineSegments = [];
        _bresenhamLineSegments = [];
        _wuLineSegments = [];
        _ellipses = [];
        _parabolas = [];
        _hyperbolas = [];
        _hermiteCurves = [];
        _bezierCurves = [];
        _vSplines = [];

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
            this._addFigure(this._hyperbolas, new geometryModule.Hyperbola(hyperbola.origin, hyperbola.a, hyperbola.b, hyperbola.isHorizontal));
        }

        addHermiteCurve(hermiteCurve) {
            this._addFigure(this._hermiteCurves, new geometryModule.HermiteCurve([hermiteCurve.P1, hermiteCurve.P4], hermiteCurve.R1, hermiteCurve.R4));
        }

        addBezierCurve(bezierCurve) {
            this._addFigure(this._bezierCurves, new geometryModule.BezierCurve([bezierCurve.P1, bezierCurve.P2, bezierCurve.P3, bezierCurve.P4]));
        }

        addVSpline(vSpline) {
            this._addFigure(this._vSplines, new geometryModule.VSpline(vSpline.referencePoints));
        }

        getClosestReferencePointToPoint(point, includeVSplines = true) {
            let closestCurve = null;
            let currMinDistance = Infinity;
            let referencePointInCurveIndex = null;

            const curves = [
                ...this.hermiteCurves,
                ...this.bezierCurves,
                ...(includeVSplines ? this.vSplines : [])
            ];

            for (const curve of curves) {
                const distancesToPoint = curve.referencePoints.map(referencePoint => referencePoint.distanceToPoint(point));
                const minDistance = Math.min(...distancesToPoint);
                if (minDistance < currMinDistance) {
                    closestCurve = curve;
                    currMinDistance = minDistance;
                    referencePointInCurveIndex = curve.referencePoints.findIndex(referencePoint => referencePoint.distanceToPoint(point) === minDistance);
                }
            }

            return {
                closestCurve,
                referencePointInCurveIndex
            }
        }

        save() {
            this._modelSnapshot = new CanvasModel();
            this.ddaLineSegments.forEach(figure => this._modelSnapshot.addDdaLineSegment(figure));
            this.bresenhamLineSegments.forEach(figure => this._modelSnapshot.addBresenhamLineSegment(figure));
            this.wuLineSegments.forEach(figure => this._modelSnapshot.addWuLineSegment(figure));
            this.ellipses.forEach(figure => this._modelSnapshot.addEllipse(figure));
            this.parabolas.forEach(figure => this._modelSnapshot.addParabola(figure));
            this.hyperbolas.forEach(figure => this._modelSnapshot.addHyperbola(figure));
            this.hermiteCurves.forEach(figure => this._modelSnapshot.addHermiteCurve(figure));
            this.bezierCurves.forEach(figure => this._modelSnapshot.addBezierCurve(figure));
            this.vSplines.forEach(figure => this._modelSnapshot.addVSpline(figure));
        }

        restore() {
            if (this._modelSnapshot === null) {
                return;
            }
            this._ddaLineSegments = this._modelSnapshot.ddaLineSegments;
            this._bresenhamLineSegments = this._modelSnapshot.bresenhamLineSegments;
            this._wuLineSegments = this._modelSnapshot.wuLineSegments;
            this._ellipses = this._modelSnapshot.ellipses;
            this._parabolas = this._modelSnapshot.parabolas;
            this._hyperbolas = this._modelSnapshot.hyperbolas;
            this._hermiteCurves = this._modelSnapshot.hermiteCurves;
            this._bezierCurves = this._modelSnapshot.bezierCurves;
            this._vSplines = this._modelSnapshot.vSplines;
            this._modelSnapshot = null;
        }

        dropSavedState() {
            this._modelSnapshot = null;
        }

        getAllCurveEndpoints(exceptFor) {
            return [
                ...this._hermiteCurves.filter(curve => curve !== exceptFor).map(curve => curve.endpoints).flat(),
                ...this._bezierCurves.filter(curve => curve !== exceptFor).map(curve => curve.endpoints).flat(),
            ];
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
        get curves() {
            return [
                ...this.hermiteCurves,
                ...this.bezierCurves,
                ...this.vSplines
            ];
        }
    }

    class CanvasView {
        _DEFAULT_COLOR = {
            red: 0,
            green: 0,
            blue: 0
        }
        _DEFAULT_HIGHLIGHT_COLOR = {
            red: 0,
            green: 255,
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

            this._drawNextPointEventListener = this._drawNextPointEventListener.bind(this);

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

        _drawPoint(x, y, opacity = 1, color = this._DEFAULT_COLOR) {
            this._ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;
            this._ctx.fillRect(Math.trunc(this._origin.x + x), Math.trunc(this._origin.y - y), 1, 1);
        }

        _drawPoints(points) {
            points.forEach(point => {
                this._drawPoint(point.x, point.y, point.opacity ?? 1, point.color ?? this._DEFAULT_COLOR);
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
            const pointToDraw = this._pointsToDrawQueue.shift();
            this._drawPoint(pointToDraw.x, pointToDraw.y, pointToDraw.opacity);
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

        drawPointsOrStartDebugging(pointsToDraw) {
            if (this._debuggingModeEnabled) {
                this._setPointsToDrawQueue(pointsToDraw);
                this._addEnterPressEventListener();
            } else {
                this._drawPoints(pointsToDraw);
            }
        }

        _highlightPoint(x, y) {
            this._ctx.beginPath();
            this._ctx.arc(this._origin.x + x, this._origin.y - y, 5, 0, 2 * Math.PI);
            this._ctx.stroke();
        }

        highlightPoints(points, color = this._DEFAULT_HIGHLIGHT_COLOR) {
            this._ctx.strokeStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
            points.forEach(point => this._highlightPoint(point.x, point.y));
            this._ctx.strokeStyle = `rgb(0, 0, 0)`;
        }

        get width() { return this._width; }

        get height() { return this._height; }
    }

    class CanvasController {
        _drawingFinishedEvent = new Event('drawing-finished');
        _debuggingModeEnabled = false;
        _pointCorrectionModeEnabled = false;
        _currPointSelectionListener = null;
        _segmentConnectingModeEnabled = false;
        _segmentConnectingSnapDistance = 20;
        _segmentConnectingMouseForceUnsnapDistance = 100;

        constructor({
            width = 1000,
            height = 700,
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
            height: 700,
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
            this._model = new CanvasModel();
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
        
            this._canvasHtmlElem = document.getElementById(canvasHtmlElemId);
            this._addScalingEventListener();
            this._addTranslationEventListener();
        }

        _addScalingEventListener() {
            this._canvasHtmlElem.addEventListener('wheel', (event) => {
                event.preventDefault();

                const scaling = event.deltaY * -1;
                if (scaling > 1) {
                    this._view.scaleUp();
                }
                if (scaling < -1) {
                    this._view.scaleDown();
                }
                this._redrawCanvas();
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

                this._redrawCanvas();
            });
        }

        _getCanvasCoordsFromMouseEvent(event) {
            return {
                x: event.offsetX - this._view.width / 2,
                y: -1 * event.offsetY + this._view.height / 2
            };
        }

        _enterPointSelection(pointsRequired, exitPointSelectionCallback) {
            this._exitPointSelection();
            const selectedPoints = [];
    
            this._currPointSelectionListener = (event) => {
                const { x, y } = this._getCanvasCoordsFromMouseEvent(event);
                selectedPoints.push(new Point(x, y));
                if (selectedPoints.length === pointsRequired) {
                    this._exitPointSelection();
                    exitPointSelectionCallback(selectedPoints);
                    this._redrawCanvas();
                    document.dispatchEvent(this._drawingFinishedEvent);
                }
            };
            this._canvasHtmlElem.addEventListener('click', this._currPointSelectionListener);
        }

        _exitPointSelection() {
            this._canvasHtmlElem.removeEventListener('click', this._currPointSelectionListener);
            this._currPointSelectionListener = null;
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

            const ellipses = this._model.ellipses.map(ellipse => this._ellipse(ellipse.origin, ellipse.a, ellipse.b));

            const rawParabolas = this._model.parabolas;
            const horizontalParabolas = rawParabolas
                .filter(parabola => parabola.isHorizontal)
                .map(parabola => this._horizontalParabola(parabola.vertex, parabola.p));
            const verticalParabolas = rawParabolas
                .filter(parabola => !parabola.isHorizontal)
                .map(parabola => this._verticalParabola(parabola.vertex, parabola.p));

            const rawHyperbolas = this._model.hyperbolas;
            const horizontalHypebrolas = rawHyperbolas
                .filter(hyperbola => hyperbola.isHorizontal)
                .map(hyperbola => this._horizontalHyperbola(hyperbola.origin, hyperbola.a, hyperbola.b));
            const verticalHypebrolas = rawHyperbolas
                .filter(hyperbola => !hyperbola.isHorizontal)
                .map(hyperbola => this._verticalHyperbola(hyperbola.origin, hyperbola.a, hyperbola.b));

            const hermiteCurves = this._model.hermiteCurves.map(curve => this._hermiteForm(curve.P1, curve.P4, curve.R1, curve.R4));
            const bezierCurves = this._model.bezierCurves.map(curve => this._bezierForm(curve.P1, curve.P2, curve.P3, curve.P4));
            const vSplines = this._model.vSplines.map(vSpline => this._vSpline(vSpline.referencePoints));

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
            if (this._pointCorrectionModeEnabled) {
                this._highlightAllCurveReferencePoints();
            }
            this._view.drawPointsOrStartDebugging(pointsToDraw);
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

        _ellipse(origin, a, b) {
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
            const verticalEllipseAxis = new Line(origin, new Point(origin.x, origin.y + 1));
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

        _horizontalParabola(vertex, p, Xlimit = this._view.width / 2 - vertex.x, Ylimit = this._view.height / 2 - vertex.y) {
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

        _verticalParabola(vertex, p, Xlimit = this._view.width / 2 - vertex.x, Ylimit = this._view.height / 2 - vertex.y) {
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

        _horizontalHyperbola(origin, a, b, Xlimit = this._view.width, Ylimit = this._view.height) {
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

        _verticalHyperbola(origin, a, b, Xlimit = this._view.width, Ylimit = this._view.height) {
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

        _hermiteForm(P1, P4, R1, R4, tStep = 0.001) {
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

        _bezierForm(P1, P2, P3, P4, tStep = 0.001) {
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

        _vSplineSegment(P1, P2, P3, P4, tStep = 0.001) {
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

        _vSpline(referencePoints) {
            referencePoints = [
                ...referencePoints,
                referencePoints[0],
                referencePoints[1],
                referencePoints[2]
            ];
            
            const points = [];
            for (let pointIndex = 0; pointIndex < referencePoints.length - 3; pointIndex++) {
                points.push(...this._vSplineSegment(
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

            this._model.addHermiteCurve(new geometryModule.HermiteCurve([P1, P4], R1, R4));
        }

        enterBezierFormDrawingMode() {
            this._enterPointSelection(4, this._exitBezierFormDrawingMode.bind(this));
        }

        _exitBezierFormDrawingMode(selectedPoints) {
            this._model.addBezierCurve(new geometryModule.BezierCurve([selectedPoints[0], selectedPoints[1], selectedPoints[2], selectedPoints[3]]));
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
            if (this._pointCorrectionModeEnabled) {
                this._highlightAllCurveReferencePoints();
                this._enterReferencePointSelectionMode();
            } else {
                this._exitPointSelection();
                this._redrawCanvas();
            }
            return this._pointCorrectionModeEnabled;
        }

        _highlightAllCurveReferencePoints() {
            this._model.curves.forEach(curve => this._view.highlightPoints(curve.referencePoints));
        }

        _enterReferencePointSelectionMode() {
            this._enterPointSelection(1, this._referencePointSelectedCallback.bind(this));
        }

        _referencePointSelectedCallback(selectedPoints) {
            const { closestCurve, referencePointInCurveIndex } = this._model.getClosestReferencePointToPoint(new Point(selectedPoints[0].x, selectedPoints[0].y));

            const mouseMoveEventListener = (event) => {
                const { x, y } = this._getCanvasCoordsFromMouseEvent(event);
                const newReferencePoint = new Point(x, y);
                closestCurve.setReferencePoint(newReferencePoint, referencePointInCurveIndex);
                this._redrawCanvas();
            }
            const moveEndEventListener = () => {
                this._canvasHtmlElem.removeEventListener('mousemove', mouseMoveEventListener);
                this._canvasHtmlElem.removeEventListener('click', moveEndEventListener);
                this._enterReferencePointSelectionMode();
            }
            this._canvasHtmlElem.addEventListener('mousemove', mouseMoveEventListener);
            this._canvasHtmlElem.addEventListener('click', moveEndEventListener);
        }

        toggleSegmentConnectingMode() {
            this._segmentConnectingModeEnabled = !this._segmentConnectingModeEnabled;
            if (this._segmentConnectingModeEnabled) {
                this.enterSegmentConnectingMode();
            } else {
                this._model.restore();
            }
            return this._segmentConnectingModeEnabled;
        }

        enterSegmentConnectingMode() {
            this._enterPointSelection(1, this._lookForSegmentToConnect.bind(this));
        }

        _lookForSegmentToConnect(selectedPoints) {
            const {
                closestCurve,
                referencePointInCurveIndex
            } = this._model.getClosestReferencePointToPoint(new Point(selectedPoints[0].x, selectedPoints[0].y), false);

            this._model.save();
            const allEndpoints = this._model.getAllCurveEndpoints(closestCurve);
            const mouseMoveEventListener = (event) => {
                const { x, y } = this._getCanvasCoordsFromMouseEvent(event);
                const mousePosition = new Point(x, y);

                for (const currCurveEndpoint of closestCurve.endpoints) {
                    for (const otherCurveEndpoint of allEndpoints) {
                        if (
                            currCurveEndpoint.distanceToPoint(otherCurveEndpoint) <= this._segmentConnectingSnapDistance
                            && mousePosition.distanceToPoint(otherCurveEndpoint) <= this._segmentConnectingMouseForceUnsnapDistance
                        ) {
                            const diffX = otherCurveEndpoint.x - currCurveEndpoint.x;
                            const diffY = otherCurveEndpoint.y - currCurveEndpoint.y;
                            closestCurve.referencePoints.forEach((point, index) => {
                                closestCurve.setReferencePoint(new Point(
                                    point.x + diffX,
                                    point.y + diffY
                                ), index);
                            });
                            this._redrawCanvas();
                            return;
                        }
                    }
                }

                const closestPoint = closestCurve.referencePoints[referencePointInCurveIndex];
                const diffX = x - closestPoint.x;
                const diffY = y - closestPoint.y;
                closestCurve.referencePoints.forEach((point, index) => {
                    closestCurve.setReferencePoint(new Point(
                        point.x + diffX,
                        point.y + diffY
                    ), index);
                });
                this._redrawCanvas();
            }
            const moveEndEventListener = () => {
                this._canvasHtmlElem.removeEventListener('mousemove', mouseMoveEventListener);
                this._canvasHtmlElem.removeEventListener('click', moveEndEventListener);
                this._model.dropSavedState();
                this.enterSegmentConnectingMode();
            }
            this._canvasHtmlElem.addEventListener('mousemove', mouseMoveEventListener);
            this._canvasHtmlElem.addEventListener('click', moveEndEventListener);
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////

        __TEST__() {
            
        }
    }

    return {
        CanvasController
    }
})();