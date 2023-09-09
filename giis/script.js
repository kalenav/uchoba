const canvasModule = (function () {
    class CanvasModel {
        _lineSegments = [];
        _ellipses = [];
        _parabolas = [];
        _hyperbolas = [];

        addLineSegment(lineSegment) {
            this._lineSegments.push(new LineSegment(lineSegment.startpoint, lineSegment.endpoint));
        }

        get lineSegments() {
            return [...this._lineSegments];
        }

        addEllipse(ellipse) {
            this._ellipses.push(new Ellipse(ellipse.origin, ellipse.a, ellipse.b));
        }
        
        get ellipses() {
            return [...this._ellipses];
        }

        addParabola(parabola) {
            this._parabolas.push(new Parabola(parabola.vertex, parabola.p, parabola.isHorizontal));
        }

        get parabolas() {
            return [...this._parabolas];
        }

        addHyperbola(hyperbola) {
            this._hyperbolas.push(new Hyperbola(hyperbola.origin, hyperbola.a, hyperbola.b, hyperbola.isHorizontal));
        }

        get hyperbolas() {
            return [...this._hyperbolas];
        }
    }

    class CanvasView {
        _DEFAULT_COLOR = {
            red: 0,
            green: 0,
            blue: 0
        }

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
                    this._ctx.moveTo(currSingleElementXCoordinate, this._origin.y + singleSegmentTickSize / 2);
                    this._ctx.lineTo(currSingleElementXCoordinate, this._origin.y - singleSegmentTickSize / 2);
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
                    this._ctx.moveTo(this._origin.x + singleSegmentTickSize / 2, currSingleElementYCoordinate);
                    this._ctx.lineTo(this._origin.x - singleSegmentTickSize / 2, currSingleElementYCoordinate);
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

        get width() { return this._width; }

        get height() { return this._height; }
    }

    class CanvasController {
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

        ////////////////////////////////////////
        ///////////////// lab2 /////////////////
        ////////////////////////////////////////

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
            } while (currY > 0);

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
    }

    class Canvas {
        _drawingFinishedEvent = new Event('drawing-finished');

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
            this._controller = new CanvasController();

            this._canvasHtmlElem = document.getElementById(canvasHtmlElemId);
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

        enterDdaDrawingMode() {
            this._enterPointSelection(2, this._exitDdaDrawingMode.bind(this));
        }

        _exitDdaDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            const pointsToDraw = this._controller.ddaLine({
                start: startPoint,
                end: endPoint
            });
            this._view.drawPoints(pointsToDraw);

            this._model.addLineSegment(new LineSegment(startPoint, endPoint));
        }

        enterBresenhamDrawingMode() {
            this._enterPointSelection(2, this._exitBresenhamDrawingMode.bind(this));
        }

        _exitBresenhamDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            const pointsToDraw = this._controller.bresenhamsLine({
                start: startPoint,
                end: endPoint
            });
            this._view.drawPoints(pointsToDraw);

            this._model.addLineSegment(new LineSegment(startPoint, endPoint));
        }

        enterWuDrawingMode() {
            this._enterPointSelection(2, this._exitWuDrawingMode.bind(this));
        }

        _exitWuDrawingMode(selectedPoints) {
            const startPoint = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const endPoint = new Point(selectedPoints[1].x, selectedPoints[1].y);

            const pointsToDraw = this._controller.wuLine({
                start: startPoint,
                end: endPoint
            });
            this._view.drawPoints(pointsToDraw);

            this._model.addLineSegment(new LineSegment(startPoint, endPoint));
        }

        enterEllipseDrawingMode() {
            this._enterPointSelection(1, this._exitEllipseDrawingMode.bind(this));
        }

        _exitEllipseDrawingMode(selectedPoints) {
            const origin = new Point(selectedPoints[0].x, selectedPoints[0].y);
            const a = +prompt('Введите значение "a"');
            const b = +prompt('Введите значение "b"');

            const horizontalEllipseAxis = new Line(origin, new Point(origin.x, origin.y + b));
            const verticalEllipseAxis = new Line(origin, new Point(origin.x + a, origin.y));
            const pointsToDraw_quadrant1 = this._controller.ellipse(origin, a, b);
            const pointsToDraw_quadrant2 = pointsToDraw_quadrant1.map(point => point.reflectAlongLine(verticalEllipseAxis));
            const pointsToDraw_quadrant3 = pointsToDraw_quadrant2.map(point => point.reflectAlongLine(horizontalEllipseAxis));
            const pointsToDraw_quadrant4 = pointsToDraw_quadrant1.map(point => point.reflectAlongLine(horizontalEllipseAxis));

            this._view.drawPoints([
                ...pointsToDraw_quadrant1,
                ...pointsToDraw_quadrant2,
                ...pointsToDraw_quadrant3,
                ...pointsToDraw_quadrant4
            ]);

            this._model.addEllipse(new Ellipse(origin, a, b));
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
            const parabolaUpperHalfPoints = this._controller.horizontalParabola(vertex, p, xLimit, yLimit);
            const parabolaLowerHalfPoints = parabolaUpperHalfPoints.map(point => point.reflectAlongLine(parabolaAxis));
            this._view.drawPoints([
                ...parabolaUpperHalfPoints,
                ...parabolaLowerHalfPoints
            ]);

            this._model.addParabola(new Parabola(vertex, p, true));
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
            const parabolaRightHalfPoints = this._controller.verticalParabola(vertex, p, xLimit, yLimit);
            const parabolaLeftHalfPoints = parabolaRightHalfPoints.map(point => point.reflectAlongLine(parabolaAxis));
            this._view.drawPoints([
                ...parabolaRightHalfPoints,
                ...parabolaLeftHalfPoints
            ]);

            this._model.addParabola(new Parabola(vertex, p, false));
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
            const hyperbolaPoints_quadrant1 = this._controller.horizontalHyperbola(origin, a, b, Xlimit, Ylimit);
            const hyperbolaPoints_quadrant2 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(verticalHyperbolaAxis));
            const hyperbolaPoints_quadrant3 = hyperbolaPoints_quadrant2.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));
            const hyperbolaPoints_quadrant4 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));

            this._view.drawPoints([
                ...hyperbolaPoints_quadrant1,
                ...hyperbolaPoints_quadrant2,
                ...hyperbolaPoints_quadrant3,
                ...hyperbolaPoints_quadrant4
            ]);

            this._model.addHyperbola(new Hyperbola(origin, a, b, true));
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
            const hyperbolaPoints_quadrant1 = this._controller.verticalHyperbola(origin, a, b, Xlimit, Ylimit);
            const hyperbolaPoints_quadrant2 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(verticalHyperbolaAxis));
            const hyperbolaPoints_quadrant3 = hyperbolaPoints_quadrant2.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));
            const hyperbolaPoints_quadrant4 = hyperbolaPoints_quadrant1.map(point => point.reflectAlongLine(horizontalHyperbolaAxis));

            this._view.drawPoints([
                ...hyperbolaPoints_quadrant1,
                ...hyperbolaPoints_quadrant2,
                ...hyperbolaPoints_quadrant3,
                ...hyperbolaPoints_quadrant4
            ]);

            this._model.addHyperbola(new Hyperbola(origin, a, b, false));
        }
    }

    return {
        Canvas
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
const ToolbarController = toolbarModule.ToolbarController;

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
        constructor(startpoint, endpoint) {
            this._startpoint = new Point(startpoint.x, startpoint.y, startpoint.z);
            this._endpoint = new Point(endpoint.x, endpoint.y, endpoint.z);
        }

        get startpoint() { return this._startpoint; }

        get endpoint() { return this._endpoint; }
    }
    
    class Ellipse {
        constructor(origin, a, b) {
            this._origin = new Point(origin.x, origin.y, origin.z);
            this._a = a;
            this._b = b;
        }

        get origin() {
            return new Point(this._origin.x, this._origin.y, this._origin.z); 
        }

        get a() { return this._a; }

        get b() { return this._b; }
    }

    class Parabola {
        constructor(vertex, p, isHorizontal) {
            this._vertex = new Point(vertex.x, vertex.y, vertex.z);
            this._p = p;
            this._isHorizontal = isHorizontal;
        }

        get vertex() {
            return new Point(this._vertex.x, this._vertex.y, this._vertex.z);
        }

        get p() { return this._p; }

        get isHorizontal() { return this._isHorizontal; }
    }
    
    class Hyperbola {
        constructor(origin, a, b, isHorizontal) {
            this._origin = new Point(origin.x, origin.y, origin.z);
            this._a = a;
            this._b = b;
            this._isHorizontal = isHorizontal;
        }

        get origin() {
            return new Point(this._origin.x, this._origin.y, this._origin.z); 
        }

        get a() { return this._a; }

        get b() { return this._b; }

        get isHorizontal() { return this._isHorizontal; }
    }

    return {
        Point,
        Vector,
        Line,
        LineSegment,
        Ellipse,
        Parabola,
        Hyperbola
    }
})();
const Point = geometryModule.Point;
const Vector = geometryModule.Vector;
const Line = geometryModule.Line;
const LineSegment = geometryModule.LineSegment;
const Ellipse = geometryModule.Ellipse;
const Parabola = geometryModule.Parabola;
const Hyperbola = geometryModule.Hyperbola;

/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

const canvas = new canvasModule.Canvas();
const hint = new HintController();
const toolbar = new ToolbarController([
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
    ])
]);

document.addEventListener('drawing-finished', () => {
    hint.resetHint();
});