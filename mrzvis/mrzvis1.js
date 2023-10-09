function addBinary(num1, num2) {
    debugger;
    const num1Longer = num1.length > num2.length;
    const longer = num1Longer ? num1.slice() : num2.slice();
    const shorter = num1Longer ? num2.slice() : num1.slice();
    while(shorter.length < longer.length) shorter.unshift(0);
    const sum = [];
    let carrying = 0;
    for(let i = longer.length - 1; i >= 0; i--) {
        const ithSum = shorter[i] + longer[i] + carrying;
        sum.unshift(ithSum % 2);
        carrying = ithSum >= 2 ? 1 : 0;
    }
    if(carrying === 1) sum.unshift(1);
    return sum;
}

async function multiply(num1, num2) {
    let partialSum = [];
    for(let i = 0; i < num1.length; i++) {
        if(num1[i] === 1)  partialSum = addBinary(partialSum, num2);
        if(i !== num1.length - 1) partialSum.push(0);
    }
    while(partialSum[0] === 0) partialSum.shift();
    return Promise.resolve(partialSum);
}

async function vectorMultiply(vect1, vect2) {
  return await Promise.all([
    multiply(vect1[0], vect2[0]),
    multiply(vect1[1], vect2[1]),
    multiply(vect1[2], vect2[2]),
  ]);
};

function intToBinary(num) {
    const result = [];
    while(num > 0) {
        result.unshift(num % 2);
        num = Math.floor(num / 2);
    }
    return result;
}

function binaryToInt(num) {
    return num.slice().reverse().reduce((r, v, i) => r + v * Math.pow(2, i), 0);
}

async function test1() {
    const vector1 = [intToBinary(5), intToBinary(10), intToBinary(2)];
    const vector2 = [intToBinary(2), intToBinary(79), intToBinary(100)];
    const result = await vectorMultiply(vector1, vector2);
    console.log(result);
    const expecting = [10, 790, 200];
    if(result.map(v => binaryToInt(v)).every((v, i, a) => a[i] === expecting[i])) console.log('test 1 passed');
    else console.log('test 1 failed')
}

async function test2() {
    const vector1 = [intToBinary(8), intToBinary(100), intToBinary(2)];
    const vector2 = [intToBinary(15), intToBinary(79), intToBinary(153)];
    const result = await vectorMultiply(vector1, vector2);
    const expecting = [120, 7900, 306];
    if(result.map(v => binaryToInt(v)).every((v, i, a) => a[i] === expecting[i])) console.log('test 2 passed');
    else console.log('test 2 failed')
}

async function test3() {
    const vector1 = [intToBinary(500), intToBinary(102), intToBinary(222)];
    const vector2 = [intToBinary(1532), intToBinary(71), intToBinary(0)];
    const result = await vectorMultiply(vector1, vector2);
    const expecting = [766000, 7242, 0];
    if(result.map(v => binaryToInt(v)).every((v, i, a) => a[i] === expecting[i])) console.log('test 3 passed');
    else console.log('test 3 failed')
}

async function tests() {
    await test1();
    await test2();
    await test3();
}