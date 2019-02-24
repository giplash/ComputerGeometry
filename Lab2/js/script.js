const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function drawLine(ctx, point1, point2, point1Name, point2Name) {
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.strokeText(point1Name, point1.x - 3, point1.y - 3);
    ctx.strokeText(point2Name, point2.x - 3, point2.y - 3);
    ctx.stroke();
}

function drawPoint(ctx, point){
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1, 0, 2 * Math.PI, true);
    ctx.strokeText('p0', point.x - 5, point.y - 5);
    ctx.fill();
}

function randomPoint(width, height) {
    return {
        x: Math.ceil(Math.random() * width),
        y: Math.ceil(Math.random() * height)
    };
}

function createPoint(x, y) {
    return { x, y };
}

function formMatrix(p1, p2, p3) {
    return [
        [p3.x - p2.x, p3.y - p2.y],
        [p1.x - p2.x, p1.y - p2.y]
    ];
}

function isSimplePolygon(points) {
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            let p1 = points[i];
            let p2 = i === points.length - 1 ? points[0] : points[i + 1];
            let p3 = points[j];
            let p4 = j === points.length - 1 ? points[0] : points[j + 1];
            if (p1 === p3 || p2 === p4 || p1 === p4 || p2 === p3) continue;
            if (isIntersect(p1, p2, p3, p4)) return false;        }
    }
    return true;
}

function getRandomSimplePolygon(size) {
    const points = Array(size)
                        .fill(null)
                        .map(element => createPoint(Math.random() * (canvas.width - 10), Math.random() * (canvas.height- 10)));
    return isSimplePolygon(points) ? points : getRandomSimplePolygon(size);
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

function drawPolygon(ctx, points) {
    for (let i = 0; i < points.length; i++) {
        if (i === points.length - 1) drawLine(ctx, points[i], points[0], `p${i+1}`, 'p1');
        else drawLine(ctx, points[i], points[i+1], `p${i+1}`, `p${i+2}`);
    }
}

function writeMessage(content, container) {
    const div = document.createElement('div');
    div.textContent = content;
    div.classList.add('message');
    container.appendChild(div);
}

function isIntersect(p1, p2, p3, p4) {
    const d1 =  math.det(formMatrix(p1, p3, p4));
    const d2 =  math.det(formMatrix(p2, p3, p4));
    const d3 =  math.det(formMatrix(p3, p1, p2));
    const d4 =  math.det(formMatrix(p4, p1, p2));
    if (d1 * d2 <= 0 && d3 * d4 <= 0) return true;
    return false;
}

function getSegment(point) {
    return [point, {x:canvas.width - 10, y: point.y }];
}

function task() {
    const points = getRandomSimplePolygon(5);
    const point = randomPoint(canvas.width - 10, canvas.height - 10);
    drawPolygon(ctx, points);
    drawPoint(ctx, point);
    let message = isPointInsidePolygon(point, points) ? "Point inside polygon" : "Point outside polygon";
    writeMessage(message, document.querySelector('div'));
}

task();