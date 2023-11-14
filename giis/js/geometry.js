class GeometryUtils {
    static radiansToDegrees(radians) {
        return Math.round(radians * 180 / Math.PI);
    }

    static degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    static getLineSegmentSetIntersectionPoints(lineSegments) {
        const intersectionPoints = [];

        for (let lineSegmentIndex = 0; lineSegmentIndex < lineSegments.length; lineSegmentIndex++) {
            const lineSegment = lineSegments[lineSegmentIndex];
            for (let otherLineSegmentIndex = lineSegmentIndex + 1; otherLineSegmentIndex < lineSegments.length; otherLineSegmentIndex++) {
                const otherLineSegment = lineSegments[otherLineSegmentIndex];
                const currIntersectionPoint = lineSegment.intersectionPoint(otherLineSegment);
                if (currIntersectionPoint !== null) {
                    intersectionPoints.push(currIntersectionPoint);
                }
            }
        }

        return intersectionPoints;
    }
    
    static lineSegmentSetIsConnectedAndClosed(lineSegments) {
        return lineSegments.every(lineSegment => {
            let intersectionsWithOtherLineSegments = 0;
            lineSegments.forEach((otherLineSegment) => {
                if (lineSegment === otherLineSegment) {
                    return;
                }
                if (lineSegment.intersects(otherLineSegment)) {
                    intersectionsWithOtherLineSegments++;
                }
            });
            return intersectionsWithOtherLineSegments === 2;
        });
    }

    static lineSegmentSetGraphIsConnected(lineSegments) {
        const intersectionPoints = GeometryUtils.getLineSegmentSetIntersectionPoints(lineSegments);
        const graphNodes = intersectionPoints.map(point => new Node(point));
        const graphArcs = [];
        for (const lineSegment of lineSegments) {
            for (let intersectionPointIndex = 0; intersectionPointIndex < intersectionPoints.length; intersectionPointIndex++) {
                const intersectionPoint = intersectionPoints[intersectionPointIndex];
                for (let otherIntersectionPointIndex = intersectionPointIndex + 1; otherIntersectionPointIndex < intersectionPoints.length; otherIntersectionPointIndex++) {
                    const otherIntersectionPoint = intersectionPoints[otherIntersectionPointIndex];
                    if (lineSegment.containsPoint(intersectionPoint) && lineSegment.containsPoint(otherIntersectionPoint)) {
                        graphArcs.push(new Arc(graphNodes[intersectionPointIndex], graphNodes[otherIntersectionPointIndex], false));
                    }
                }
            }
        }
        return (new Graph(graphNodes, graphArcs)).isConnected();
    }

    static lineSegmentSetIsAPolygon(lineSegments) {
        return GeometryUtils.lineSegmentSetIsConnectedAndClosed(lineSegments) && GeometryUtils.lineSegmentSetGraphIsConnected(lineSegments);
    }

    static getPolygons(lineSegments) {
        const polygons = [];

        const allLineSegmentSets = Utils.arrayOfSubarrays(lineSegments);
        const polygonCandidates = allLineSegmentSets.filter((lineSegmentSet) => lineSegmentSet.length >= 3);
        polygonCandidates.forEach((lineSegmentSet) => {
            if (GeometryUtils.lineSegmentSetIsAPolygon(lineSegmentSet)) {
                polygons.push(new geometryModule.Polygon(GeometryUtils.getLineSegmentSetIntersectionPoints(lineSegmentSet)));
            }
        })

        return polygons;
    }
}

const geometryModule = (function () {
    class Point {
        constructor(x, y, z = 0, w = 1, truncCoordinates = true) {
            [this._x, this._y, this._z, this._w] = [x, y, z, w].map(coord => truncCoordinates ? Math.trunc(coord) : coord);
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

        applyMatrix(matrix) { // matrix has to be 4x4!
            return new Point(
                this._x * matrix.getElementAt(1, 1) + this._y * matrix.getElementAt(1, 2) + this._z * matrix.getElementAt(1, 3) + this._w * matrix.getElementAt(1, 4),
                this._x * matrix.getElementAt(2, 1) + this._y * matrix.getElementAt(2, 2) + this._z * matrix.getElementAt(2, 3) + this._w * matrix.getElementAt(2, 4),
                this._x * matrix.getElementAt(3, 1) + this._y * matrix.getElementAt(3, 2) + this._z * matrix.getElementAt(3, 3) + this._w * matrix.getElementAt(3, 4),
                this._x * matrix.getElementAt(4, 1) + this._y * matrix.getElementAt(4, 2) + this._z * matrix.getElementAt(4, 3) + this._w * matrix.getElementAt(4, 4)
            );
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
                    this._z / this.modulus,
                    1,
                    false
                )
            );
        }

        orthogonalVector() { // z stays the same
            return new Vector(
                new Point(0, 0, 0),
                new Point(
                    this._y,
                    -this._x,
                    this._z
                )
            );
        }
    }

    class Line {
        _pointContainmentError = 1;

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

        intersectionPoint(line) {
            const [ a1, b1, c1 ] = [this.coefficients_2d.a, this.coefficients_2d.b, this.coefficients_2d.c];
            const [ a2, b2, c2 ] = [line.coefficients_2d.a, line.coefficients_2d.b, line.coefficients_2d.c];
            return new Point(
                (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1),
                (c1 * a2 - c2 * a1) / (a1 * b2 - a2 * b1)
            );
        }

        get normalVector() { // z = 0
            return new Vector(new Point(0, 0), new Point(-this._directionVector.y, this._directionVector.x));
        }

        get coefficients_2d() {
            return {
                a: this.normalVector.x,
                b: this.normalVector.y,
                c: -(this._point.x * this.normalVector.x + this._point.y * this.normalVector.y)
            };
        }

        containsPoint(point) {
            return this.distanceToPoint(point) <= this._pointContainmentError;
        }
    }

    class LineSegment {
        constructor(point1, point2) {
            this._point1 = new Point(point1.x, point1.y, point1.z);
            this._point2 = new Point(point2.x, point2.y, point2.z);
        }

        get P1() { return new Point(this._point1.x, this._point1.y, this._point1.z); }
        get P2() { return new Point(this._point2.x, this._point2.y, this._point2.z); }

        intersectionPoint(lineSegment) {
            const lineIntersectionPoint = (new Line(this.P1, this.P2)).intersectionPoint(new Line(lineSegment.P1, lineSegment.P2));
            return this.containsPoint(lineIntersectionPoint) && lineSegment.containsPoint(lineIntersectionPoint) ? lineIntersectionPoint : null;
        }

        containsPoint(point) {
            return this.pointInLineSegmentBounds(point) && (new Line(this.P1, this.P2)).containsPoint(point);
        }

        intersects(lineSegment) {
            return this.intersectionPoint(lineSegment) !== null;
        }

        pointInLineSegmentBounds(point) {
            return point.x >= this.minX
                && point.x <= this.maxX
                && point.y >= this.minY
                && point.y <= this.maxY
                && point.z >= this.minZ
                && point.z <= this.maxZ
        }

        get minX() {
            return this.P1.x < this.P2.x ? this.P1.x : this.P2.x;
        }

        get maxX() {
            return this.P1.x > this.P2.x ? this.P1.x : this.P2.x;
        }

        get minY() {
            return this.P1.y < this.P2.y ? this.P1.y : this.P2.y;
        }

        get maxY() {
            return this.P1.y > this.P2.y ? this.P1.y : this.P2.y;
        }

        get minZ() {
            return this.P1.z < this.P2.z ? this.P1.z : this.P2.z;
        }

        get maxZ() {
            return this.P1.z > this.P2.z ? this.P1.z : this.P2.z;
        }

        get isHorizontal() {
            return this.P1.y === this.P2.y;
        }

        get length() {
            return new Vector(this.P1, this.P2).modulus;
        }
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

    class Polygon {
        _filledIn = false;
        _fillMethodId = 0;
        _filledFromPoint = null;

        constructor(vertices) {
            this._vertices = vertices.map(vertex => new Point(vertex.x, vertex.y, vertex.z));
        }

        get vertices() { return this._vertices; }
        get filledIn() { return this._filledIn; }
        get fillMethodId() { return this._fillMethodId; }
        get filledFromPoint() { return this._filledFromPoint; }
        get constituentLineSegments() {
            const constituentLineSegments = [];

            const sortedVertices = this._vertices.toSorted((p1, p2) => (p1.y - p2.y) || (p1.x - p2.x));
            const [extremeVertex, otherVertices] = [sortedVertices[0], sortedVertices.slice(1)];
            otherVertices.sort((p1, p2) => {
                const vectorToP1 = new Vector(extremeVertex, p1);
                const vectorToP2 = new Vector(extremeVertex, p2);
                return (vectorToP1.angleToXAxis - vectorToP2.angleToXAxis) || (vectorToP1.modulus - vectorToP2.modulus);
            });

            const verticesStack = new Stack();
            verticesStack.push(extremeVertex);
            verticesStack.push(otherVertices[0]);
            otherVertices.forEach((vertex, index) => {
                if (index === 0) { // already in stack
                    return;
                }
                const lastPoint = verticesStack.get(1);
                const secondToLastPoint = verticesStack.get(2);
                verticesStack.push(vertex);
                const vector1 = new Vector(secondToLastPoint, lastPoint);
                const vector2 = new Vector(lastPoint, vertex);
                if (vector1.angleToXAxis > vector2.angleToXAxis) {
                    verticesStack.pop();
                }
            });

            const verticesArray = [];
            while (!verticesStack.empty) verticesArray.push(verticesStack.pop());
            verticesArray.forEach((vertex, index) => {
                if (index === verticesArray.length - 1) {
                    constituentLineSegments.push(new geometryModule.LineSegment(vertex, verticesArray[0]));
                } else {
                    constituentLineSegments.push(new geometryModule.LineSegment(vertex, verticesArray[index + 1]));
                }
            });

            return constituentLineSegments;
        }

        fill(methodId, point = null) {
            this._filledIn = true;
            this._fillMethodId = methodId;
            this._filledFromPoint = point;
        }

        containsPoint(point) {
            const helperLineSegment = new LineSegment(new Point(0, 10000), point);
            return GeometryUtils.getLineSegmentSetIntersectionPoints([
                helperLineSegment,
                ...this.constituentLineSegments
            ]).length % 2 === 1; 
        }

        get highestY() {
            return this.vertices.reduce((highestY, vertex) => vertex.y > highestY ? vertex.y : highestY, -Infinity);
        }

        get lowestY() {
            return this.vertices.reduce((lowestY, vertex) => vertex.y < lowestY ? vertex.y : lowestY, Infinity);
        }

        get leftmostX() {
            return this.vertices.reduce((leftmostX, vertex) => vertex.x < leftmostX ? vertex.x : leftmostX, Infinity);
        }

        get rightmostX() {
            return this.vertices.reduce((rightmostX, vertex) => vertex.x > rightmostX ? vertex.x : rightmostX, -Infinity);
        }
    }

    class Cube {
        constructor(sideLength, rotX = 0, rotY = 0, rotZ = 0) {
            this._sideLength = sideLength;
            this._rotX = rotX;
            this._rotY = rotY;
            this._rotZ = rotZ;
        }

        _getXRotationMatrix(negatedSine = false) {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(-this._rotX);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            const sineCoef = negatedSine ? -1 : 1;
            rotationMatrix.setElements([
                [1, 0, 0, 0],
                [0, cos, sin * sineCoef, 0],
                [0, -sin * sineCoef, cos, 0],
                [0, 0, 0, 1]
            ]);
            return rotationMatrix;
        }

        _getYRotationMatrix(negatedSine = false) {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(-this._rotY);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            const sineCoef = negatedSine ? -1 : 1;
            rotationMatrix.setElements([
                [cos, 0, sin * sineCoef, 0],
                [0, 1, 0, 0],
                [-sin * sineCoef, 0, cos, 0],
                [0, 0, 0, 1]
            ]);
            return rotationMatrix;
        }

        _getZRotationMatrix(negatedSine = false) {
            const rotationMatrix = new linearAlgebraModule.Matrix(4, 4);
            const rotationInRadians = GeometryUtils.degreesToRadians(-this._rotZ);
            const sin = Math.sin(rotationInRadians);
            const cos = Math.cos(rotationInRadians);
            const sineCoef = negatedSine ? -1 : 1;
            rotationMatrix.setElements([
                [cos, sin * sineCoef, 0, 0],
                [-sin * sineCoef, cos, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]);
            return rotationMatrix;
        }

        _getCombinedRotationMatrix(negated = false) {
            return this._getXRotationMatrix(negated)
                .multiply(this._getYRotationMatrix(negated))
                .multiply(this._getZRotationMatrix(negated));
        }

        get _bodyMatrix() {
            const rawBodyMatrix = new linearAlgebraModule.Matrix(6, 4);
            const neg = -1 * this._sideLength / 2;
            rawBodyMatrix.setElements([
                [-1, 0, 0, -neg],
                [1, 0, 0, -neg],
                [0, -1, 0, -neg],
                [0, 1, 0, -neg],
                [0, 0, -1, -neg],
                [0, 0, 1, -neg]
            ]);
            return rawBodyMatrix.multiply(this._getCombinedRotationMatrix());
        }

        get _rawVertices() {
            const originOffset = this._sideLength / 2;
            return [
                new Point(originOffset, originOffset, originOffset),
                new Point(originOffset, originOffset, -originOffset),
                new Point(originOffset, -originOffset, originOffset),
                new Point(originOffset, -originOffset, -originOffset),
                new Point(-originOffset, originOffset, originOffset),
                new Point(-originOffset, originOffset, -originOffset),
                new Point(-originOffset, -originOffset, originOffset),
                new Point(-originOffset, -originOffset, -originOffset)
            ]
        }

        get _faces() {
            const rawVertices = this._rawVertices;
            return [
                new Polygon(rawVertices.filter(vertex => vertex.x > 0).map(point => point.applyMatrix(this._getCombinedRotationMatrix(true)))),
                new Polygon(rawVertices.filter(vertex => vertex.x < 0).map(point => point.applyMatrix(this._getCombinedRotationMatrix(true)))),
                new Polygon(rawVertices.filter(vertex => vertex.y > 0).map(point => point.applyMatrix(this._getCombinedRotationMatrix(true)))),
                new Polygon(rawVertices.filter(vertex => vertex.y < 0).map(point => point.applyMatrix(this._getCombinedRotationMatrix(true)))),
                new Polygon(rawVertices.filter(vertex => vertex.z > 0).map(point => point.applyMatrix(this._getCombinedRotationMatrix(true)))),
                new Polygon(rawVertices.filter(vertex => vertex.z < 0).map(point => point.applyMatrix(this._getCombinedRotationMatrix(true))))
            ];
        }

        getFaces(hideInvisible = false, spectatorViewDirection = new Vector(new Point(0, 0, 0), new Point(0, 0, -1))) {
            if (!hideInvisible) {
                return this._faces;
            }
            return this._faces
                .filter((face, index) => {
                    const currFace = this._bodyMatrix.getRowAt(index + 1);
                    const currFaceNormalVector = new Vector(
                        new Point(0, 0, 0),
                        new Point(
                            currFace[0],
                            currFace[1],
                            currFace[2],
                            1,
                            false
                        ));
                    return currFaceNormalVector.dotProduct(spectatorViewDirection) > 0;
                });
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
        VSpline,
        Polygon,
        Cube
    }
})();
const Point = geometryModule.Point;
const Vector = geometryModule.Vector;
const Line = geometryModule.Line;
