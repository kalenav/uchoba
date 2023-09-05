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
            let angleOffset = 0;
            const modulus = this.modulus;
            if (this._x / modulus < 0) {
                angleOffset = 180;
            }

            return Math.round(GeometryUtils.radiansToDegrees(Math.asin(this._y / modulus))) + angleOffset;
        }

        get octant() {
            const angle = this.angleToXAxis;

            if (angle >= 0 && angle < 45) {
                return 1;
            }
            if (angle >= 45 && angle < 90) {
                return 2;
            }
            if (angle >= 90 && angle < 135) {
                return 3;
            }
            if (angle >= 135 && angle < 180) {
                return 4;
            }
            if (angle >= 180 && angle < 225) {
                return 5;
            }
            if (angle >= 225 && angle < 270)  {
                return 6;
            }
            if (angle >= 270 && angle < 315) {
                return 7;
            }
            if (angle >= 315 && angle < 360) {
                return 8;
            }
        }

        // getAPerpendicularVector() {
        //     return new Vector(new Point(0, 0), new Point(this._y, -this.x, this.z));
        // }
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
            const singleSegmentXAxisHorizontalOffset = 2;
            const singleSegmentXAxisBoundary = this._width / 2;
            for (let currSingleSegment = -1 * singleSegmentXAxisBoundary; currSingleSegment <= singleSegmentXAxisBoundary; currSingleSegment += singleSegmentSize) {
                if (currSingleSegment === 0) continue;
                this._ctx.strokeText(
                    `${currSingleSegment}`,
                    this._origin.x + currSingleSegment + singleSegmentXAxisHorizontalOffset,
                    this._origin.y + singleSegmentXAxisVerticalOffset
                );
            };

            // y axis single segments
            const singleSegmentYAxisVerticalOffset = 10;
            const singleSegmentYAxisHorizontalOffset = 2;
            const singleSegmentYAxisBoundary = this._height / 2;
            for (let currSingleSegment = -1 * singleSegmentYAxisBoundary; currSingleSegment <= singleSegmentYAxisBoundary; currSingleSegment += singleSegmentSize) {
                if (currSingleSegment === 0) continue;
                this._ctx.strokeText(
                    `${currSingleSegment}`,
                    this._origin.x + singleSegmentYAxisHorizontalOffset,
                    this._origin.y - currSingleSegment - singleSegmentYAxisVerticalOffset
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



const canvas = new CanvasController();