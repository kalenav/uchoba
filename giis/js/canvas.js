const canvasModule = (function () {
    class CanvasModel {
        _currRotationX = 0;
        _currRotationY = 0;
        _currRotationZ = 0;
        _currScaleX = 1;
        _currScaleY = 1;
        _currScaleZ = 1;
        _currTranslationX = 0;
        _currTranslationY = 0;
        _currTranslationZ = 0;
        _tX = 0;
        _tY = 0;
        _reflectedX = false;
        _reflectedY = false;

        _ddaLineSegments = [];
        _bresenhamLineSegments = [];
        _wuLineSegments = [];
        _ellipses = [];
        _parabolas = [];
        _hyperbolas = [];
        _hermiteCurves = [];
        _bezierCurves = [];
        _vSplines = [];
        _vertexPolygons = [];
        _lineSegmentPolygons = [];
        _clippingWindow = null;

        _addFigure(list, figure) {
            list.push(figure);
        }

        addDdaLineSegment(lineSegment) {
            this._addFigure(this._ddaLineSegments, new geometryModule.LineSegment(lineSegment.P1, lineSegment.P2));
            this._updatePolygons();
        }

        addBresenhamLineSegment(lineSegment) {
            this._addFigure(this._bresenhamLineSegments, new geometryModule.LineSegment(lineSegment.P1, lineSegment.P2));
            this._updatePolygons();
        }
        
        addWuLineSegment(lineSegment) {
            this._addFigure(this._wuLineSegments, new geometryModule.LineSegment(lineSegment.P1, lineSegment.P2));
            this._updatePolygons();
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

        getAllCurveEndpoints(exceptFor) {
            return [
                ...this._hermiteCurves.filter(curve => curve !== exceptFor).map(curve => curve.endpoints).flat(),
                ...this._bezierCurves.filter(curve => curve !== exceptFor).map(curve => curve.endpoints).flat(),
            ];
        }

        addPolygon(polygon) {
            this._addFigure(this._vertexPolygons, new geometryModule.Polygon(polygon.vertices));
        }

        _updatePolygons() {
            const lineSegments = [
                ...this.ddaLineSegments,
                ...this.bresenhamLineSegments,
                ...this.wuLineSegments
            ];

            this._lineSegmentPolygons = GeometryUtils.getPolygons(lineSegments).slice();
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
        get polygons() {
            return [
                ...this._vertexPolygons,
                ...this._lineSegmentPolygons
            ];
        }

        rotateBy(degreesX, degreesY, degreesZ) {
            this._currRotationX += degreesX;
            this._currRotationY += degreesY;
            this._currRotationZ += degreesZ;
        }

        scaleBy(scaleX, scaleY, scaleZ) {
            this._currScaleX *= scaleX;
            this._currScaleY *= scaleY;
            this._currScaleZ *= scaleZ;
        }

        translateBy(dX, dY, dZ) {
            this._currTranslationX += dX;
            this._currTranslationY += dY;
            this._currTranslationZ += dZ;
        }

        adjustTxUp() {
            this._tX += 0.01;
        }

        adjustTxDown() {
            this._tX -= 0.01;
        }

        adjustTyUp() {
            this._tY += 0.01;
        }
        
        adjustTyDown() {
            this._tY -= 0.01;
        }

        get _translationMatrix() {
            const translationMatrix = new linearAlgebraModule.Matrix(4, 4);
            translationMatrix.setElements([
                [1, 0, 0, this._currTranslationX],
                [0, 1, 0, this._currTranslationY],
                [0, 0, 1, this._currTranslationZ],
                [0, 0, 0, 1]
            ]);
            return translationMatrix;
        }

        get _scalingMatrix() {
            const scalingMatrix = new linearAlgebraModule.Matrix(4, 4);
            scalingMatrix.setElements([
                [this._currScaleX, 0, 0, 0],
                [0, this._currScaleY, 0, 0],
                [0, 0, this._currScaleZ, 0],
                [0, 0, 0, 1] 
            ]);
            return scalingMatrix;
        }

        get _xRotationMatrix() {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(this._currRotationX);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            rotationMatrix.setElements([
                [1, 0, 0, 0],
                [0, cos, sin, 0],
                [0, -sin, cos, 0],
                [0, 0, 0, 1]
            ]);
            return rotationMatrix;
        }

        get _yRotationMatrix() {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(this._currRotationY);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            rotationMatrix.setElements([
                [cos, 0, sin, 0],
                [0, 1, 0, 0],
                [-sin, 0, cos, 0],
                [0, 0, 0, 1]
            ]);
            return rotationMatrix;
        }

        get _zRotationMatrix() {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(this._currRotationZ);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            rotationMatrix.setElements([
                [cos, sin, 0, 0],
                [-sin, cos, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
            return rotationMatrix;
        }

        get _perspectiveMatrix() {
            const perspectiveMatrix = new linearAlgebraModule.Matrix(4, 4);

            perspectiveMatrix.setElements([
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [this._tX, this._tY, 0, 1]
            ]);

            return perspectiveMatrix;
        }

        getTransformationMatrix() {
            return this._translationMatrix
                .multiply(this._scalingMatrix)
                .multiply(this._xRotationMatrix)
                .multiply(this._yRotationMatrix)
                .multiply(this._zRotationMatrix)
                .multiply(this._perspectiveMatrix)
        }

        setClippingWindow(width, height, rotationDegrees = 0) {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(rotationDegrees);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            rotationMatrix.setElements([
                [cos, sin, 0, 0],
                [-sin, cos, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);

            this._clippingWindow = new geometryModule.Polygon([
                new Point(width / 2, height / 2),
                new Point(width / 2, -1 * height / 2),
                new Point(-1 * width / 2, height / 2),
                new Point(-1 * width / 2, -1 * height / 2)
            ]
                .map(point => point.applyMatrix(rotationMatrix))
            );
        }

        get clippingWindow() {
            return this._clippingWindow;
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

        _drawPoint({
            x,
            y,
            opacity = 1,
            color = this._DEFAULT_COLOR
        }) {
            this._ctx.fillStyle = `rgba(${color.red}, ${color.green}, ${color.blue}, ${opacity})`;
            this._ctx.fillRect(Math.trunc(this._origin.x + x), Math.trunc(this._origin.y - y), 1, 1);
        }

        _drawPoints(points) {
            points.forEach(point => {
                this._drawPoint(point);
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
            this._drawPoint(pointToDraw);
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
        _perspectiveChangeModeEnabled = false;
        _currPerspectiveChangeListener = null;
        _segmentConnectingModeEnabled = false;
        _segmentConnectingSnapDistance = 20;
        _segmentConnectingMouseForceUnsnapDistance = 100;
        _scanningLines = [];
        _polygonBoundaryDefaultColor = {
            red: 255,
            green: 0,
            blue: 0
        };
        _selectedClippingAlgorithmId = 0;

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
            this._initScanningLines();
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

        _initScanningLines() {
            const [topCap, bottomCap] = [this._view.height / 2, -this._view.height / 2].map(Math.trunc);
            const [leftCap, rightCap] = [-this._view.width / 2, this._view.width / 2].map(Math.trunc);
            for (let lineY = bottomCap; lineY <= topCap; lineY++) {
                this._scanningLines.push(new geometryModule.LineSegment(new Point(leftCap, lineY), new Point(rightCap, lineY)));
            }
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
                const selectedPoint = new Point(x, y);
                selectedPoints.push(selectedPoint);
                this._view.highlightPoints([selectedPoint])
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
            const lineSegments = [
                ...this._model.ddaLineSegments,
                ...this._model.bresenhamLineSegments,
                ...this._model.wuLineSegments
            ].map(lineSegment => {
                let clippedLineSegment = lineSegment;
                switch(this._selectedClippingAlgorithmId) {
                    case 1:
                        clippedLineSegment = this._clip_cohenSutherland(lineSegment);
                        break;
                    case 2:
                        clippedLineSegment = this._clip_cyrusBeck(lineSegment);
                        break;
                    default:
                        break;
                }
                return this._ddaLine({ start: clippedLineSegment.P1, end: clippedLineSegment.P2 });
            });

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

            const polygons = this._model.polygons.map(polygon => {
                const polygonPointsToDraw = [...this._convexPolygon(polygon)];
                if (polygon.filledIn) {
                    switch(polygon.fillMethodId) {
                        case 1:
                            polygonPointsToDraw.push(...this._rasterFill_orderedEdges(polygon));
                            break;
                        case 2:
                            polygonPointsToDraw.push(...this._seedFill(polygon, polygon.filledFromPoint));
                            break;
                    }
                }
                return polygonPointsToDraw;
            });

            const transformationMatrix = this._model.getTransformationMatrix();
            const pointsToDraw = [
                ...lineSegments.flat(),
                ...ellipses.flat(),
                ...horizontalParabolas.flat(),
                ...verticalParabolas.flat(),
                ...horizontalHypebrolas.flat(),
                ...verticalHypebrolas.flat(),
                ...hermiteCurves.flat(),
                ...bezierCurves.flat(),
                ...vSplines.flat(),
                ...polygons.flat()
            ]
                .map(point => {
                    const transformedPoint = (new Point(point.x, point.y, point.z)).applyMatrix(transformationMatrix);
                    return {
                        x: transformedPoint.x / transformedPoint.w,
                        y: transformedPoint.y / transformedPoint.w,
                        color: point.color ?? undefined
                    };
                });

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
                points.push(new Point(currX, currY));
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
                this.enterSegmentConnectingMode();
            }
            this._canvasHtmlElem.addEventListener('mousemove', mouseMoveEventListener);
            this._canvasHtmlElem.addEventListener('click', moveEndEventListener);
        }

        ////////////////////////////////////////
        ///////////////// lab4 /////////////////
        ////////////////////////////////////////

        askForRotationAmountAndRotate() {
            const degreesToRotateBy_X = +prompt('Вращение по оси X');
            const degreesToRotateBy_Y = +prompt('Вращение по оси Y');
            const degreesToRotateBy_Z = +prompt('Вращение по оси Z');
            this._model.rotateBy(degreesToRotateBy_X, degreesToRotateBy_Y, degreesToRotateBy_Z);
            this._redrawCanvas();
        }

        askForScalingAmountAndScale() {
            const scaleX = +prompt('Масштабирование по оси X');
            const scaleY = +prompt('Масштабирование по оси Y');
            const scaleZ = +prompt('Масштабирование по оси Z');
            this._model.scaleBy(scaleX, scaleY, scaleZ);
            this._redrawCanvas();
        }

        askForTranslationAmountAndTranslate() {
            const dX = +prompt('Смещение по оси X');
            const dY = +prompt('Смещение по оси Y');
            const dZ = +prompt('Смещение по оси Z');
            this._model.translateBy(dX, dY, dZ);
            this._redrawCanvas();
        }

        togglePerspectiveChangingMode() {
            this._perspectiveChangeModeEnabled = !this._perspectiveChangeModeEnabled;
            this._perspectiveChangeModeEnabled ? this._enterPerspectiveChangingMode() : this._exitPerspectiveChangingMode();
            return this._perspectiveChangeModeEnabled;
        }

        _enterPerspectiveChangingMode() {
            this._currPerspectiveChangeListener = (event) => {
                if (!event.shiftKey) return;
                if (event.key === 'ArrowUp') {
                    this._model.adjustTyUp();
                } else if (event.key === 'ArrowDown') {
                    this._model.adjustTyDown();
                } else if (event.key === 'ArrowLeft') {
                    this._model.adjustTxUp();
                } else if (event.key === 'ArrowRight') {
                    this._model.adjustTxDown();
                } else {
                    return;
                }

                this._redrawCanvas();
            };
            document.addEventListener('keydown', this._currPerspectiveChangeListener);
        }

        _exitPerspectiveChangingMode() {
            document.removeEventListener('keydown', this._currPerspectiveChangeListener);
            this._currPerspectiveChangeListener = null;
        }

        ////////////////////////////////////////
        ///////////////// lab5 /////////////////
        ////////////////////////////////////////

        _convexPolygon(polygon) {
            return polygon.constituentLineSegments
                .map(lineSegment => this._ddaLine({ start: lineSegment.P1, end: lineSegment.P2 }))
                .flat();
        }

        enterPolygonDrawingMode() {
            const vertices = +prompt('Введите количество вершин многоугольника');
            this._enterPointSelection(vertices, this._exitPolygonDrawingMode.bind(this));
        }

        _exitPolygonDrawingMode(selectedPoints) {
            this._model.addPolygon(new geometryModule.Polygon(selectedPoints));
        }

        _getFillIntervals(pointList) {
            const fillIntervals = [];

            if (pointList.length % 2 === 1) {
                pointList.pop();
            }
            for (let intersectionPointIndex = 0; intersectionPointIndex < pointList.length; intersectionPointIndex += 2) {
                fillIntervals.push([pointList[intersectionPointIndex], pointList[intersectionPointIndex + 1]]);
            }

            return fillIntervals;
        }

        _getPointsFromFillIntervals(fillIntervals) {
            const points = [];

            fillIntervals.forEach(fillInterval => {
                points.push(...this._ddaLine({ start: fillInterval[0], end: fillInterval[1] }));
            });

            return points;
        }

        _getScanningLinesInRange(from, to) {
            return this._scanningLines.filter(scanningLine => scanningLine.P1.y >= from && scanningLine.P1.y <= to)
        }

        _pointArrayHasPoint(pointArray, point) {
            return pointArray.some(p => p.x === point.x && p.y === point.y)
        }

        _rasterFill_orderedEdges(polygon) {
            const intersectionPoints = GeometryUtils.getLineSegmentSetIntersectionPoints([
                ...polygon.constituentLineSegments.filter(lineSegment => !lineSegment.isHorizontal),
                ...this._getScanningLinesInRange(polygon.lowestY, polygon.highestY)
            ]);
            intersectionPoints.sort((p1, p2) => (p1.y < p2.y || p1.y === p2.y && p1.x <= p2.x) ? 1 : -1);
            if (intersectionPoints[0].y !== intersectionPoints[1].y) {
                intersectionPoints.shift(); // single point at the top
            }
            if (intersectionPoints.at(-1).y !== intersectionPoints.at(-2).y) {
                intersectionPoints.pop(); // single point at the bottom
            }

            return this._getPointsFromFillIntervals(this._getFillIntervals(intersectionPoints));
        }

        _seedFill(polygon, point) {
            const pointsToDraw = [];

            const pointStack = new Stack();
            pointStack.push(point);
            while (!pointStack.empty) {
                const currSeed = pointStack.pop();
                pointsToDraw.push(currSeed);
                const possibleNewSeeds = [
                    new Point(currSeed.x, currSeed.y + 1),
                    new Point(currSeed.x + 1, currSeed.y),
                    new Point(currSeed.x, currSeed.y - 1),
                    new Point(currSeed.x - 1, currSeed.y)
                ];
                possibleNewSeeds.forEach(possibleSeed => {
                    if (
                        polygon.containsPoint(possibleSeed) &&
                        !this._pointArrayHasPoint(pointsToDraw, possibleSeed)
                    ) {
                        pointStack.push(possibleSeed);
                    }
                });
            }

            return pointsToDraw;
        }

        enterPolygonFillMode(methodId) {
            this._enterPointSelection(1, this._exitPolygonFillMode.bind({ 
                ...this,
                _METHOD_ID: methodId
            }));
        }

        _exitPolygonFillMode(selectedPoints) {
            const selectedPoint = selectedPoints[0];
            const polygonToFill = this._model.polygons.find(polygon => polygon.containsPoint(selectedPoint));
            polygonToFill.fill(this._METHOD_ID, selectedPoint);
        }

        ////////////////////////////////////////
        ///////////////// lab6 /////////////////
        ////////////////////////////////////////

        askForClippingWindowDimensionsAndSet(clippingAlgorithmId, askForRotation = false) {
            const width = +prompt('Введите ширину окна отсечения');
            const height = +prompt('Введите высоту окна отсечения');
            const rotation = askForRotation ? +prompt('Введите поворот окна отсечения в градусах') : 0;
            this._selectedClippingAlgorithmId = clippingAlgorithmId;
            this._model.setClippingWindow(width, height, rotation);
            this._redrawCanvas();
        }

        _getBitwisePointInfo(point, clippingWindow) {
            return [
                +(point.y > clippingWindow.highestY),
                +(point.y < clippingWindow.lowestY),
                +(point.x > clippingWindow.rightmostX),
                +(point.x < clippingWindow.leftmostX)
            ];
        }

        _clip_cohenSutherland(lineSegment) {
            const bitwiseP1Info = this._getBitwisePointInfo(lineSegment.P1, this._model.clippingWindow);
            const bitwiseP2Info = this._getBitwisePointInfo(lineSegment.P2, this._model.clippingWindow);
            const emptyLineSegment = new geometryModule.LineSegment(new Point(0, 0), new Point(0, 0));

            if (bitwiseP1Info.every(bit => bit === 0) && bitwiseP2Info.every(bit => bit === 0)) {
                return lineSegment;
            }

            for (let i = 0; i < 4; i++) {
                if (bitwiseP1Info[i] === 1 && bitwiseP2Info[i] === 1) {
                    return emptyLineSegment;
                }
            }

            const intersectionPoints = [];
            this._model.clippingWindow.constituentLineSegments.forEach(constituentLineSegment => {
                if (lineSegment.intersects(constituentLineSegment)) {
                    intersectionPoints.push(lineSegment.intersectionPoint(constituentLineSegment));
                }
            });
            if (intersectionPoints.length < 2) {
                return emptyLineSegment;
            }
            return new geometryModule.LineSegment(intersectionPoints[0], intersectionPoints[1]);
        }

        _clip_cyrusBeck(lineSegment) {
        }

        clearClipping() {
            this._selectedClippingAlgorithmId = 0;
            this._redrawCanvas();
        }

        //////////////////////////////////////////////////////////////////////////////////////////////////////

        __TEST__() {
            
        }
    }

    return {
        CanvasController
    }
})();