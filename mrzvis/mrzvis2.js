async function calcC(A, B, E, G, Fijk, Dijk, compositionValue) {
    const height = G.length;
    const width = G[0].length;
    const C = new Array(height);
    for(let i = 0; i < height; i++) {
        C[i] = new Array(width).fill(0);
    }
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            C[i][j] = await calcCij(A, B, E, G, i, j, Fijk, Dijk, compositionValue);
        }
    }
    printMatrix(C);
}

async function calcCij(A, B, E, G, i, j, Fijk, Dijk, compositionValue) {
    return await calcCij_first(Fijk, G, i, j) + await calcCij_second_level0(Dijk, G, i, j, compositionValue);
}

async function calcCij_first(Fijk, G, i, j) {
    const fijk = Promise.resolve(Fijk);
    const Gij = Promise.resolve(G[i][j]);
    const vals = await Promise.all([
        fijk,
        Gij,
    ]);
    return Promise.resolve(vals[0] * (3 * vals[1] - 2) * vals[1]);
}

async function calcCij_second_level0(Dijk, G, i, j, compositionValue) {
    const dijk = Promise.resolve(Dijk);
    const Gij = Promise.resolve(G[i][j]);
    const vals = await Promise.all([
        dijk,
        Gij,
    ]);
    const second_second = Promise.resolve(1 - vals[0]);
    return Promise.resolve((vals[0] + await calcCij_second_level1(compositionValue, Dijk) * vals[1]) * await second_second);
}

async function calcCij_second_level1(compositionValue, Dijk) {
    const dijk = await Promise.resolve(Dijk);
    return Promise.resolve(4 * await calcCij_second_level2(compositionValue) - 3 * dijk);
}

async function calcCij_second_level2(compositionValue) {
    return Promise.resolve(compositionValue);
}

function printMatrix(matrix) {
    matrix.forEach(row => { console.log(row.join(' ')); });
}