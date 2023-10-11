function getPrimitive(prime, degree) {
    for(let num = 2; num < prime; num++) {
        if(Math.pow(num, degree) % prime === 1) return num;
    }
    return -1;
}

function generateMutualSecret(powerA, powerB, g) {
    return Math.pow(g, powerA * powerB);
}