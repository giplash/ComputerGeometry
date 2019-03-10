const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

function drawLine(ctx, point1, point2) {
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
}

function drawPoint(ctx, point){
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, 0.1 * Math.PI, true);
    ctx.fill();
}

function drawPolygon(ctx, points) {
    for (let i = 0; i < points.length; i++) {
        if (i === points.length - 1) drawLine(ctx, points[i], points[0]);
        else drawLine(ctx, points[i], points[i+1]);
    }
}

function setRandomDirectionVector(point, polygon) {
    const randomSide = getRandomPolygonSide(polygon);
    const randomPointAtTheSide = getRandomPointAtTheSide(randomSide);
}

function getRandomPointAtTheSide(side) {
    
}

function getRandomPolygonSide(polygon) {
    let index1 = Math.ceil(Math.random() * polygon.length) - 1;
    let index2 = index1 == polygon.length - 1 ? index1 - 1 : index1 + 1;
    return [polygon[index1], polygon[index2]];
}

function isIntersect(p1, p2, p3, p4) {
    const d1 =  math.det(formMatrix(p1, p3, p4));
    const d2 =  math.det(formMatrix(p2, p3, p4));
    const d3 =  math.det(formMatrix(p3, p1, p2));
    const d4 =  math.det(formMatrix(p4, p1, p2));
    if (d1 * d2 <= 0 && d3 * d4 <= 0) return true;
    return false;
}

function formMatrix(p1, p2, p3) {
    return [
        [p3.x - p2.x, p3.y - p2.y],
        [p1.x - p2.x, p1.y - p2.y]
    ];
}

function getSegment(point) {
    return [point, {x:canvas.width - 10, y: point.y }];
}

function isPointInsidePolygon(point, polygon) {
    const segmentPoints = getSegment(point);
    let res = 0;
    if (isIntersect(polygon[polygon.length - 1], polygon[0], segmentPoints[0], segmentPoints[1])) res++;
    for (let i = 0; i < polygon.length - 1; i++) {
        const p1 = polygon[i];
        const p2 = polygon[i + 1];
        if (isIntersect(p1, p2, segmentPoints[0], segmentPoints[1])) {
            res++;
        }
    }
    return res % 2 === 1;
}

function createPoint(x, y) {
    return { x, y };
}

function getRandomPoint(width, height) {
    return createPoint(Math.ceil(Math.random() * width),Math.ceil(Math.random() * height));
}

function getRandomPointInsidePolygon(mainPolygon, innerPolygon) {
    const point = getRandomPoint(canvas.width, canvas.height);
    if (isPointInsidePolygon(point, mainPolygon) && !isPointInsidePolygon(point, innerPolygon)) {
        return point;
    }
    return getRandomPointInsidePolygon(mainPolygon, innerPolygon);
}

function getRandomPointsInsidePolygon(size, mainPolygon, innerPolygon) {
    const res = [];
    for (let i = 0; i < size; i++) {
         const point = getRandomPointInsidePolygon(mainPolygon, innerPolygon);
         setRandomDirectionVector(point, mainPolygon);
         res.push(point);
    }
    return res;
}

function updatePoints(points) {
    points.forEach(point => {
        
    });
}

function createSimplePolygon() {
    return [
        createPoint(612, 181),
        createPoint(480, 100),
        createPoint(400, 200),
        createPoint(583, 300),
        createPoint(565, 263)
    ]
}

function createConvexPolygon() {
    return [
        createPoint(315, 387),
        createPoint(130, 226),
        createPoint(165, 106),
        createPoint(540, 13),
        createPoint(726, 209),
        createPoint(652, 367)
    ]
}

function task() {
    const mainPolygon = createConvexPolygon();
    drawPolygon(ctx, mainPolygon);
    const innerPolygon = createSimplePolygon();
    drawPolygon(ctx, innerPolygon);
    const points = getRandomPointsInsidePolygon(10, mainPolygon, innerPolygon);
    points.forEach(point => drawPoint(ctx, point));
    // setInterval(() => {
    //     updatePoints(points);
    // }, 40);
}

task();