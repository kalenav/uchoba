function extendedGCD(a: number, b: number): { gcd: number, x: number, y: number } {
    if (a === 0) {
        return { gcd: b, x: 0, y: 1 };
    } else {
        const { gcd, x, y } = extendedGCD(b % a, a);
        return { gcd, x: y - Math.floor(b / a) * x, y: x };
    }
}

function modularInverse(n: number, mod: number): number | null {
    const { gcd, x, y } = extendedGCD(n, mod);
    return gcd !== 1 ? null : (x + mod) % mod;
}

function exponentiateModulo(base: number, exponent: number, modulo: number): number {
    let result: number = 1;
    base %= modulo;

    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulo;
        }

        exponent /= 2;
        base = (base ** 2) % modulo;
    }

    return result;
}

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function elGamal_decipher(privateKey: number, params: { sh: number, osk: number, p: number }): number | null {
    const { sh, osk, p } = params;
    const inverse: number = modularInverse(exponentiateModulo(osk, privateKey, p), p)!;
    return (inverse % p) * sh;
}

console.log(elGamal_decipher(7, {
    sh: 102541510,
    osk: 4532899,
    p: 221151019
}));

////////////////////////////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////

function chineseRemainderTheorem(params: { sh: number, e: number, p: number, q: number }): number {
    const {sh, e, p, q} = params;
    const [m1, m2] = [q, p];
    const [y1, y2] = [modularInverse(m1, m2)!, modularInverse(m2, m1)!];

    return (exponentiateModulo(sh, e, p) * y1 * m1 + exponentiateModulo(sh, e, q) * y2 * m2) % (p * q);
}

console.log(chineseRemainderTheorem({
    sh: 3324571526634502112,
    e: 2038074793,
    p: 2038074803,
    q: 1299709
}));