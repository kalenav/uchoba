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

function randomIntegerFromRange(from: number, to: number): number {
    return Math.round(Math.random() * (to - from)) + from;
}

function diffieHelman(p: number, alpha: number): {
    public1: number,
    public2: number,
    private1: number,
    private2: number,
    common1: number,
    common2: number
} {
    const private1: number = randomIntegerFromRange(1, p - 1);
    const private2: number = randomIntegerFromRange(1, p - 1);
    const public1: number = exponentiateModulo(alpha, private1, p);
    const public2: number = exponentiateModulo(alpha, private2, p);

    return {
        public1,
        public2,
        private1,
        private2,
        common1: exponentiateModulo(public2, private1, p),
        common2: exponentiateModulo(public1, private2, p)
    };
}

console.log(diffieHelman(134041249, 7));