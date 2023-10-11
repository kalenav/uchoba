const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.lineWidth = 5;
const canvasContainer = document.getElementById('canvas-container');
const hintText = document.getElementById('hint-text');

let drawing = 'none';

let drawingArc = false;
let calculatingDistance = false;
let idsToggled = false;
let currArcSource;

let currSelectedNode = null;

class Node {
    _adjacent = [];

    constructor(type, id, x, y, color, name) {
        this._type = type;
        this._id = id;
        this._x = x;
        this._y = y;
        this._color = color;
        this._name = name;
    }

    addAdjacent(node) {
        this._adjacent.push(node);
    }

    removeAdjacent(node) {
        this._adjacent.splice(this._adjacent.findIndex(v => v === node), 1);
    }

    isAdjacentTo(node) {
        return this._adjacent.includes(node);
    }

    setPos(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get adjacent() {
        return this._adjacent;
    }

    get color() {
        return this._color;
    }

    get name() {
        return this._name;
    }
}

class Arc {
    constructor(source, target, type, id, color) {
        this._source = source;
        this._target = target;
        this._type = type;
        this._id = id;
        this._color = color;
    }

    get source() {
        return this._source;
    }

    get target() {
        return this._target;
    }

    get type() {
        return this._type;
    }

    get id() {
        return this._id;
    }

    get color() {
        return this._color;
    }
}

const nodes = localStorage.lab5nodes ? JSON.parse(localStorage.lab5nodes).map(node => new Node(node._type, node._id, node._x, node._y, node._color, node._name)) : [];
const adjacent = localStorage.lab5nodes ? JSON.parse(localStorage.lab5nodes).map(node => node._adjacent) : [];
nodes.forEach((node, i) => {
    adjacent[i].forEach(adj => {
        node.addAdjacent(nodes.find(n => n.id === adj));
    });
});
let arcs = localStorage.lab5arcs ? JSON.parse(localStorage.lab5arcs).map(arc => new Arc(nodes.find(node => node.id === arc.source), nodes.find(node => node.id === arc.target), arc.type, arc.id, arc.color)) : [];

redrawCanvas(nodes, arcs);

document.getElementById('new-node').addEventListener('click', () => {
    drawing = 'nodes';
    hintText.innerHTML = 'Узел';
    displaySettings(1);
});

document.getElementById('arc').addEventListener('click', () => {
    drawing = 'arcs';
    hintText.innerHTML = 'Дуга';
    displaySettings(2);
});

document.getElementById('select').addEventListener('click', () => {
    drawing = 'none';
    hintText.innerHTML = 'Режим выбора';
    displaySettings(3);
});

document.getElementById('info').addEventListener('click', () => {
    let toalert = "";
    const adjMatrixString = getAdjacencyMatrixString(nodes);
    toalert += adjMatrixString + '\n';
    adjMatrix = adjMatrixString.split('\n');
    adjMatrix.forEach(row => { row = row.split(' ').join('') });
    let full = true;
    for(let i = 0; i < nodes.length; i++) {
        for(let j = 0; j < nodes.length; j++) {
            if(i == j) continue;
            if(adjMatrix[i][j] == '0') {
                full = false;
                break;
            }
        }
    }
    toalert += full ? 'Граф полный' : 'Граф неполный'
    toalert += '\n';
    alert(toalert);
});

document.getElementById('distance').addEventListener('click', () => {
    if(calculatingDistance) {
        calculatingDistance = false;
        hintText.innerHTML = ''
    }
    else {
        calculatingDistance = true;
        hintText.innerHTML = 'расстояние'
    }
});

document.getElementById('cycles').addEventListener('click', () => {
    alert(cycles().map(cycle => cycle.map(node => node.id).join('-')).join('\n'));
});

document.getElementById('toggle').addEventListener('click', () => {
    if(!idsToggled) redrawCanvas(nodes.map(node => new Node(node.type, node.id, node.x, node.y, node.color, node.id)), arcs);
    else redrawCanvas(nodes, arcs);
    idsToggled = !idsToggled;
});

function getAdjacencyMatrixString(nodes) {
    return nodes.map(node => nodes.map(currAdjNode => node.isAdjacentTo(currAdjNode) ? 1 : 0).join(' ')).join('\n');
}

function newNode(x, y, id, name, shape, color) {
    const node = document.createElement('div');
    node.className = `node ${shape}-node`;
    node.style.left = x;
    node.style.top = y;
    node.style.border = `solid ${color} 5px`
    node.dataset.id = id;
    const nameContainer = document.createElement('p');
    nameContainer.innerHTML = name;
    nameContainer.className = 'node-name';
    node.appendChild(nameContainer);
    return node;
}

function drawArc(x1, y1, x2, y2, color, directed) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    ctx.beginPath();
    tempEndX = x2 + 10 - 15 * cos;
    tempEndY = y2 + 10 - 15 * sin;
    ctx.moveTo(x1 + 10 + 10 * cos, y1 + 10 + 10 * sin);
    ctx.lineTo(tempEndX, tempEndY);
    if(directed) {
        ctx.arc(tempEndX, tempEndY, 5, 0, 2 * Math.PI);
    }
    ctx.lineTo(x2 + 10 - 10 * cos, y2 + 10 - 10 * sin);
    ctx.strokeStyle = color;
    ctx.stroke();
}

canvasContainer.addEventListener('click', e => {
    const target = e.target;
    if(e.ctrlKey) {
        if(target.classList.contains('node')) {
            const node = nodes.find(v => v.id === Number(target.dataset.id));
            nodes.splice(nodes.findIndex(v => v === node), 1);
            nodes.forEach(currAdjNode => {
                if(node.isAdjacentTo(currAdjNode)) node.removeAdjacent(currAdjNode);
                if(currAdjNode.isAdjacentTo(node)) currAdjNode.removeAdjacent(node);
            })
            arcs = arcs.filter(arc => arc.source !== node && arc.target !== node);
            saveNodes();
            localStorage.lab5arcs = JSON.stringify(arcs.map(arc => { return {
                source: arc.source.id,
                target: arc.target.id,
                type: arc.type,
                id: arc.id,
            }}));
            redrawCanvas(nodes, arcs);
            return;
        }
    }
    if(calculatingDistance) {
        if(!target.classList.contains('node')) return;
        let currEndingNode;
        if(!currSelectedNode) {
            currSelectedNode = target;
        }
        else {
            currEndingNode = target;
            const node1 = nodes.find(v => v.id === Number(currSelectedNode.dataset.id))
            const node2 = nodes.find(v => v.id === Number(currEndingNode.dataset.id));
            alert(node1 !== node2 ? distance(node1, node2) : 0);
            currSelectedNode = null;
            currEndingNode = null;
            calculatingDistance = false;
        }
        return;
    }
    if(drawing === 'none') {
        if(!target.classList.contains('node')) {
            currSelectedNode.classList.toggle('selected-node');
            currSelectedNode = null;
        }
        if(currSelectedNode) currSelectedNode.classList.toggle('selected-node');
        currSelectedNode = target;
        currSelectedNode.classList.toggle('selected-node');
    }
    if(drawing === 'arcs') {
        if(!target.classList.contains('node')) return;
        if(!drawingArc) {
            drawingArc = true;
            currArcSource = nodes.find(v => v.id === Number(target.dataset.id));
        }
        else {
            const currArcTarget = nodes.find(v => v.id === Number(target.dataset.id));
            if(currArcTarget === currArcSource) {
                drawingArc = false;
                return;
            }
            const typeChoice = document.getElementById('type');
            const directed = typeChoice.options[typeChoice.selectedIndex].value === 'Ориент.';
            drawArc(currArcSource.x, currArcSource.y, currArcTarget.x, currArcTarget.y, document.getElementById('arc-color').value, directed);
            drawingArc = false;
            arcs.push(new Arc(currArcSource, currArcTarget, directed ? 0 : 1, 0, document.getElementById('arc-color').value));
            currArcSource.addAdjacent(currArcTarget);
            if(!directed) currArcTarget.addAdjacent(currArcSource);
            saveNodes();
            localStorage.lab5arcs = JSON.stringify(arcs.map(arc => { return {
                source: arc.source.id,
                target: arc.target.id,
                type: arc.type,
                id: arc.id,
                color: arc.color,
            }}));
        }
    }
});

function calcNodePos(e) {
    return { x: e.clientX - 20 - (window.innerWidth - 1000) / 2 - 100, y: e.clientY - 20 - 50};
}

function toEng(str) {
    if(str === 'Круглый') return 'round';
    else return 'square';
}

canvas.addEventListener('dblclick', e => {
    if(drawing !== 'nodes') return;
    const newNodeId = nodes.reduce((r, v) => v.id > r ? v.id : r, 0) + 1;
    const pos = calcNodePos(e);
    const x = pos.x;
    const y = pos.y;
    const shapeList = document.getElementById('shape');
    const nodeShape = toEng(shapeList.options[shapeList.selectedIndex].value);
    const nodeColor = document.getElementById('node-color').value;
    const nodeName = document.getElementById('node-name').value;
    canvasContainer.appendChild(newNode(`${x}px`, `${y}px`, newNodeId, nodeName, nodeShape, nodeColor));
    nodes.push(new Node(nodeShape === 'round' ? 0 : 1, newNodeId, x, y, nodeColor, nodeName));
    saveNodes();
});

canvasContainer.addEventListener('mousemove', e => {
    if(!e.shiftKey || !currSelectedNode || !currSelectedNode.classList.contains('node')) return;
    const pos = calcNodePos(e);
    const movingNodeIndex = nodes.findIndex(node => node.id === Number(currSelectedNode.dataset.id));
    nodes[movingNodeIndex].setPos(pos.x, pos.y);
    saveNodes()
    redrawCanvas(nodes, arcs);
});

function displaySettings(choice) {
    const container = document.getElementById('settings');
    switch(choice) {
        case 1:
            container.innerHTML = `
            <select id='shape'>
                <option>Круглый</option>
                <option>Квадратный</option>
            </select>
            <input id='node-color' type='color'>
            <input id='node-name' type='text'>
            `;
            break;
        case 2:
            container.innerHTML = `
            <select id='type'>
                <option>Ориент.</option>
                <option>Неориент.</option>
            </select>
            <input id='arc-color' type='color'>
            `;
            break;
        case 3:
            container.innerHTML = `
            `;
            break;
    }
}

function redrawCanvas(nodes, arcs) {
    [...document.querySelectorAll('.node')].forEach(node => node.parentElement.removeChild(node));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => {
        canvasContainer.appendChild(newNode(`${node.x}px`, `${node.y}px`, node.id, node.name, node.type === 0 ? 'round' : 'square', node.color));
    })
    arcs.forEach(arc => {
        drawArc(arc.source.x, arc.source.y, arc.target.x, arc.target.y, arc.color, arc.type === 0);
    })
}

function saveNodes() {
    localStorage.lab5nodes = JSON.stringify(nodes.map(node => { return {
        _type: node.type,
        _id: node.id,
        _x: node.x,
        _y: node.y,
        _color: node.color,
        _adjacent: node.adjacent.map(adj => adj.id),
        _name: node.name,
    }}));
}

class NodeStack {
    _nodes;

    constructor(nodes) {
        this._nodes = nodes;
    }

    push(node) {
        this._nodes.push(node);
    }

    pop() {
        return this._nodes.pop()
    }

    has(node) {
        return this._nodes.includes(node);
    }

    clear() {
        this._nodes = [];
    }

    get head() {
        return this._nodes[this._nodes.length - 1];
    }

    get length() {
        return this._nodes.length;
    }
}

function traverse(result, currNode, targetNode, beginning, currPath, visited) {
    if(beginning) {
        currPath = new NodeStack([]);
        visited = new Array(nodes.length).fill(false);
    }
    currPath.push(currNode);
    const currNodeIndex = nodes.findIndex(node => node === currNode);
    visited[currNodeIndex] = !(beginning && currNode === targetNode);
    if(!beginning && currNode === targetNode && !result.some(path => path.every((v, index) => path[index] === currPath._nodes[index]))) {
        result.push(currPath._nodes.slice());
    }
    if(!beginning && currNode === targetNode || currPath.head.adjacent.every(node => visited[nodes.findIndex(n => n === node)])) {
        visited[nodes.findIndex(v => v === currNode)] = false;
        currPath.head.adjacent.forEach(node => {
            if(!currPath.has(node)) visited[nodes.findIndex(v => v === node)] = false;
        });
        currPath.pop();
        return;
    }
    currNode.adjacent.forEach(adjacent => {
        if(adjacent === targetNode || (!visited[nodes.findIndex(node => node === adjacent)] && !currPath.has(adjacent))) {
            traverse(result, adjacent, targetNode, false, currPath, visited);
        }
    });
    visited[nodes.findIndex(v => v === currNode)] = false;
    currPath.head.adjacent.forEach(node => {
        if(!currPath.has(node)) visited[nodes.findIndex(v => v === node)] = false;
    });
    currPath.pop();
}

function findPaths(start, end) {
    const result = [];
    traverse(result, start, end, true);
    return result;
}

function distance(node1, node2) {
    const paths = findPaths(node1, node2)
    return paths.length === 0 ? -1 : paths.reduce((r, path) => path.length < r ? path.length : r, paths[0].length) - 1;
}

function cycles() {
    let cycles = [];
    nodes.forEach(node => {
        cycles = cycles.concat(findPaths(node, node));
    });
    return cycles.filter(cycle => cycle.length > 3);
}