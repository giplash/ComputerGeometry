const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const SIZE = 20;

function drawLine(ctx, point1, point2) {
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
}

function drawPoint(ctx, point){
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.0, 0, 2 * Math.PI, true);
    ctx.fill();
}

function drawPolygon(ctx, points) {
    for (let i = 0; i < points.length; i++) {
        if (i === points.length - 1) drawLine(ctx, points[i], points[0]);
        else drawLine(ctx, points[i], points[i+1]);
    }
}

function drawPoints(points) {
    points.forEach(point => drawPoint(ctx, point))
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

function findTopPoint(points) {
    return points.reduce((acc, cur) => {
        return acc.y > cur.y ? cur : acc;
    }, points[0]);
}

function sort(p0, points) {
    let res = points.slice().sort((point1, point2) => {
        return math.det(formMatrix(p0, point1, point2)) - math.det(formMatrix(p0, point2, point1));
    });
    return res;
}

function getPosition(point, beginLine, endLine) {
    const det = math.det(formMatrix(point, beginLine, endLine));
    if (det > 0) return 1;
    return -1;
}

function task() {
    let points = getRandomPoints(SIZE);
    drawPoints(points);
    let topPoint = findTopPoint(points);
    let tempPoints = points.filter(point => point !== topPoint);
    let P = [topPoint, ...sort(topPoint, tempPoints)];
    let S = [P[0], P[1]];
    for (let i = 2; i < P.length; i++) {
        while (getPosition(S[S.length - 1], S[S.length - 2], P[i]) == -1) {
            S.pop();
        }
        S.push(P[i]);
    }
    drawPolygon(ctx, S);
}

task();