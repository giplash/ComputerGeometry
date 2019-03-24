const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SIZE = 10;
const UPDATE_TIME = 16.66667;
const SPEED = 4;
const MAX_PERIMETER = 1200;

function drawLine(point1, point2) {
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
}

function drawPoint(point){
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.0, 0, 2 * Math.PI, true);
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function drawPolygon(points) {
    for (let i = 0; i < points.length; i++) {
        if (i === points.length - 1) drawLine(points[i], points[0]);
        else drawLine(points[i], points[i+1]);
    }
}

function drawPoints(points) {
    points.forEach(point => drawPoint(point))
}


function createPoint(x, y) {
    return { x, y };
}

function getRandomPoint(width, height) {
    return createPoint(
        Math.ceil(Math.random() * width),
        Math.ceil(Math.random() * height)
    );
}

function getRandomPoints(size) {
    const points = [];
    for (let i = 0; i < size; i++) {
        points.push(getRandomPoint(WIDTH, HEIGHT))
    }
    return points;
}

function formMatrix(p1, p2, p3) {
    return [
        [p3.x - p2.x, p3.y - p2.y],
        [p1.x - p2.x, p1.y - p2.y]
    ];
}

function length(point1, point2) {
    return ((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2) ** 0.5;
}

function triangleArea(p1, p2, p3) {
    return 0.5 * ((p1.x - p3.x) * (p2.y - p3.y) - (p1.y - p3.y) * (p2.x - p3.x));
}

function getPosition(point, beginLine, endLine) {
    const det = math.det(formMatrix(point, beginLine, endLine));
    if (det > 0) return 1;
    return -1;
}

function isPointInsideConvexPolygon(point, polygonPoints) {
    const firstEdge = [ polygonPoints[0], polygonPoints[1] ];
    const lastEdge = [ polygonPoints[polygonPoints.length - 1], polygonPoints[0] ];
    if (getPosition(point, firstEdge[0], firstEdge[1]) > 0
      || getPosition(point, lastEdge[0], lastEdge[1]) > 0) {
        return false;
    }
    const [ p1, p2 ] = getSectorIndexes(point, polygonPoints);
    return !isIntersect(point, polygonPoints[0], polygonPoints[p1], polygonPoints[p2]);
}

// получить индексы точек полигона, между которыми внутри сектора находиться переданная точка (относительно первой точки)
function getSectorIndexes(point, polygonPoints) {
    const points = [ ...polygonPoints, polygonPoints[0] ];
    let p = 0;
    let r = points.length - 1;
    let q;
    while (r - p > 1) {
        q = Math.ceil((p + r) / 2);
        if (getPosition(point, points[0], points[q]) < 0) {
            p = q;
        } else {
            r = q;
        }
    }
    return [ p, r === points.length - 1 ? 0 : r ];
}

function isIntersect(p1, p2, p3, p4) {
    const d1 =  math.det(formMatrix(p1, p3, p4));
    const d2 =  math.det(formMatrix(p2, p3, p4));
    const d3 =  math.det(formMatrix(p3, p1, p2));
    const d4 =  math.det(formMatrix(p4, p1, p2));

    return d1 * d2 <= 0 && d3 * d4 <= 0;
}

function getConvexHull(points) {

    function getMinMax(points) {
        return points.reduce((acc, item) => {
            const newMin = item.x < acc[0].x ? item : acc[0];
            const newMax = item.x > acc[1].x ? item : acc[1];
            return [ newMin, newMax ];
        }, [points[0], points[0]])
    }

    function quickhull(points, min, max) {
        const leftPoints = getPointsLeftOfLine(min, max, points);
        const maxPoint = getMaxPointFromLine(min, max, leftPoints);

        if (!maxPoint) {
            return [ max ];
        }

        return [...quickhull(leftPoints, min, maxPoint), ...quickhull(leftPoints, maxPoint, max)]
    }

    function getPointsLeftOfLine(start, end, points) {
        return points.filter(point => (getPosition(point, start, end) < 0));
    }

    function getMaxPointFromLine(start, end, points)  {
        let maxArea = 0;
        let maxPoint;

        for (const point of points) {
            if (point !== start && point !== end) {
                const area = triangleArea(start, point, end);
                if (area > maxArea) {
                    maxArea = area;
                    maxPoint = point;
                }
            }
        }
        return maxPoint
    }

    const [ min, max ] = getMinMax(points);
    return [ ...quickhull(points, min, max), ...quickhull(points, max, min) ];
}

function getPerimeter(points) {
    let res = 0;
    for (let i = 0; i < points.length - 1; i++) {
        res += length(points[i], points[i + 1]);
    }
    return res;
}

function task() {
    const mainPolygon = [
        {x: 0, y: 0},
        {x: 0, y: HEIGHT},
        {x: WIDTH, y: HEIGHT},
        {x: WIDTH, y: 0}
    ];
    const points = getRandomPoints(SIZE);
    const convexHullPoints = getConvexHull(points);
    if (getPerimeter(convexHullPoints) > MAX_PERIMETER) {
        return task();
    }
    const pointsWithVectors = points.map(point => {
        const angle = Math.random() * Math.PI * 2;
        const vector = [ SPEED * Math.cos(angle), SPEED * Math.sin(angle) ];
        return { ...point, vector, angle };
    });
    main(pointsWithVectors, mainPolygon);
}

function main(points, polygon) {
    clear();
    drawPoints(points);
    const convexHullPoints = getConvexHull(points);
    drawPolygon(convexHullPoints);
    const perimeter = getPerimeter(convexHullPoints);
    document.querySelector('.value').innerHTML = Math.round(perimeter);
    document.querySelector('.max-value').innerHTML = MAX_PERIMETER;
    const shouldTurnPoints = perimeter >= MAX_PERIMETER;
    const newPoints = getUpdatedPoints(points, polygon, shouldTurnPoints);
    setTimeout(() => main(newPoints, polygon), UPDATE_TIME);
}

function getUpdatedPoints(points, polygon, turn = false) {
    return points.map(point => {
        const { vector, angle } = point;
        if (!isPointInsideConvexPolygon(point, polygon)) {
            const [ p1, p2 ] = getSectorIndexes(point, polygon);
            const boundVector = [
                polygon[p2].x - polygon[p1].x, polygon[p2].y - polygon[p1].y
            ];
            const factor = 2 * (vector[0] * boundVector[0] + vector[1] * boundVector[1])
              / (boundVector[0] * boundVector[0] + boundVector[1] * boundVector[1]);
            const newVector = [ boundVector[0] * factor - vector[0], boundVector[1] * factor - vector[1] ];
            return {
                ...point,
                vector: newVector,
                angle: Math.acos((newVector[0] / SPEED)),
                x: point.x + newVector[0],
                y: point.y + newVector[1]
            }
        }
        if (turn) {
            const newAngle = angle + Math.PI;
            const newVector =  [ SPEED * Math.cos(newAngle), SPEED * Math.sin(newAngle) ];
            return {
                ...point,
                angle: newAngle,
                vector: newVector,
                x: point.x + newVector[0],
                y: point.y + newVector[1]
            }
        }
        return {
            ...point,
            x: point.x + vector[0],
            y: point.y + vector[1]
        }
    })
}

task();