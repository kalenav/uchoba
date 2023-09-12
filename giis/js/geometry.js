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
        constructor(referencePoints, R1, R4) {
            this._referencePoints = [...referencePoints];
            this._R1 = new Vector(new Point(0, 0, 0), new Point(R1.x, R1.y, R1.z));
            this._R4 = new Vector(new Point(0, 0, 0), new Point(R4.x, R4.y, R4.z));
        }

        get P1() { return this._referencePoints[0]; }
        get P4() { return this._referencePoints[1]; }
        get R1() { return new Vector(new Point(0, 0, 0), new Point(this._R1.x, this._R1.y, this._R1.z)); }
        get R4() { return new Vector(new Point(0, 0, 0), new Point(this._R4.x, this._R4.y, this._R4.z)); }
        get referencePoints() { return [...this._referencePoints]; }
        get endpoints() { return [this.referencePoints[0], this.referencePoints[1]]; }

        setReferencePoint(point, index) {
            this._referencePoints.splice(index, 1, new Point(point.x, point.y, point.z));
        }
    }

    class BezierCurve {
        constructor(referencePoints) {
            this._referencePoints = [...referencePoints];
        }

        get P1() { return this._referencePoints[0]; }
        get P2() { return this._referencePoints[1]; }
        get P3() { return this._referencePoints[2]; }
        get P4() { return this._referencePoints[3]; }
        get referencePoints() { return [...this._referencePoints]; }
        get endpoints() { return [this._referencePoints[0], this._referencePoints[3]]; }

        setReferencePoint(point, index) {
            this._referencePoints.splice(index, 1, new Point(point.x, point.y, point.z));
        }
    }

    class VSpline {
        constructor(points) {
            this._points = points.map(point => new Point(point.x, point.y, point.z));
        }

        get referencePoints() { return this._points; }

        setReferencePoint(point, index) {
            this._points.splice(index, 1, new Point(point.x, point.y, point.z));
        }
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
