/**
 * 生成曲线点
 * @param {Function} curveFunc 曲线函数
 * @param {Array<Number>} range 取值范围
 * @param {Number} number 曲线的点
 * @param {Number} xLength x 的长度
 * @returns 
 */
function getCurvePoints(curveFunc, range, number, xLength) {
    if (number < 1) {
        return [];
    }
    if (number === 1) {
        return [0];
    }
    const piece = (range[1] - range[0]) / (number - 1);
    const result = [];
    const scale = xLength / (range[1] - range[0]);
    for (let i = 0; i < number; i++) {
        result.push(-curveFunc(i * piece + range[0]) * scale);
    }
    return result;
}

const container = document.querySelector('.container');
container.innerHTML = container.textContent
    .split('')
    .map((l) => `<span>${l}</span>`)
    .join('');

function createCurve(func, range) {
    const points = getCurvePoints(
        func,
        range,
        container.children.length,
        container.clientWidth
    );
    for (let i = 0; i < points.length; i++) { 
        container.children[i].style.transform = `translateY(${points[i]}px)`;
    }
}

let offset = 0

createCurve(
    x => Math.sin(x),
    [offset, offset + 2 * Math.PI]
);

setInterval(() => {
    offset += 0.1;
    createCurve((x) => Math.sin(x), [offset, offset + 2 * Math.PI]);
}, 16);