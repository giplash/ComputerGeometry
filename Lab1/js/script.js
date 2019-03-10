const canvas1 = document.getElementById('task1');
const ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('task2');
const ctx2 = canvas2.getContext('2d');
const canvas3 = document.getElementById('task3');
const ctx3 = canvas3.getContext('2d');
const canvas4 = document.getElementById('task4');
const ctx4 = canvas4.getContext('2d');

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


function checkLocation(point, beginLine, endLine) {
    const det = math.det(formMatrix(point, beginLine, endLine));
    if (det > 0) {
        return 'to the right';
    }
    else if (det < 0) {
        return 'to the left';
    }
    else {
        return 'belong the line'
    }
}

function writeMessage(content, container) {
    const div = document.createElement('div');
    div.textContent = content;
    div.classList.add('message');
    container.appendChild(div);
}

function drawPolygon(ctx, points) {
    for (let i = 0; i < points.length; i++) {
        if (i === points.length - 1) drawLine(ctx, points[i], points[0], `p${i+1}`, 'p1');
        else drawLine(ctx, points[i], points[i+1], `p${i+1}`, `p${i+2}`);
    }
}

function isSimple(points) {
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

function getPosition(point, beginLine, endLine) {
    const det = math.det(formMatrix(point, beginLine, endLine));
    if (det > 0) return 1;
    return -1;
}

function isIntersect(p1, p2, p3, p4) {
    const d1 =  math.det(formMatrix(p1, p3, p4));
    const d2 =  math.det(formMatrix(p2, p3, p4));
    const d3 =  math.det(formMatrix(p3, p1, p2));
    const d4 =  math.det(formMatrix(p4, p1, p2));
    if (d1 * d2 <= 0 && d3 * d4 <= 0) return true;
    return false;
}


function isConvex(points) {
    if (!isSimple(points)) return false;
    const p1 = points[points.length - 1];   
    const p2 = points[0];
    const sign = getPosition(points[1], p1, p2);
    for (let i = 0; i < points.length - 1; i++) {
        let point1 = points[i];
        let point2 = points[i + 1];
        let point = i == points.length - 2 ? points[0] : points[i + 2];
        let currentSign = getPosition(point, point1, point2);
        if (sign != currentSign) return false;
    }
    return true;
}

function solveTask1() {
    const p1 = randomPoint(canvas1.width, canvas1.height);
    const p2 = randomPoint(canvas1.width, canvas1.height);
    const p0 = randomPoint(canvas1.width, canvas1.height);
    drawPoint(ctx1, p0);
    drawLine(ctx1, p1, p2, 'p1', 'p2');
    const pointLocation = checkLocation(p0, p1, p2);
    writeMessage(`point p0 ${pointLocation} according the vector p1 p2`, document.querySelector('.container1'));
}

function solveTask2() {
    const p1 = randomPoint(canvas2.width, canvas2.height);
    const p2 = randomPoint(canvas2.width, canvas2.height);
    const p3 = randomPoint(canvas2.width, canvas2.height);
    const p4 = randomPoint(canvas2.width, canvas2.height);
    drawLine(ctx2, p1, p2, 'p1', 'p2');
    drawLine(ctx2, p3, p4, 'p3', 'p4');
    const d1 =  math.det(formMatrix(p1, p3, p4));
    const d2 =  math.det(formMatrix(p2, p3, p4));
    const d3 =  math.det(formMatrix(p3, p1, p2));
    const d4 =  math.det(formMatrix(p4, p1, p2));
    let  message = "This segments are not intersect";
    if (d1 * d2 <= 0 && d3 * d4 <= 0) message = "The segments are intersect";
    else if (d1 == d2 && d2 == d3 && d3 == d4) message = "The segments are match up";
    writeMessage(message, document.querySelector('.container2'));
}

function solveTask3() {
    let points = [];
    for (let i = 0; i < 5; i++) {
        points.push(randomPoint(canvas3.width, canvas3.height));
    }
    drawPolygon(ctx3, points);
    let message = 'This polygon is not simple';
    if (isSimple(points)) {
        message = 'This polygon is simple';
    }
    writeMessage(message, document.querySelector('.container3'));
}

function solveTask4() {
    let points = [];
    for (let i = 0; i < 6; i++) {
        points.push(randomPoint(canvas3.width, canvas3.height));
    }
    drawPolygon(ctx4, points);
    let message = "This polygon is not convex";
    if (isConvex(points)) {
        message = "This polygon is convex";
    }
    writeMessage(message, document.querySelector('.container4'));
}

solveTask1();
solveTask2();
solveTask3();
solveTask4();