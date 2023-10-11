function areCoprime(n1, n2) {
    const larger = n1 > n2 ? n1 : n2;
    for(let i = 2; i <= Math.sqrt(larger); i += i > 2 ? 2 : 1) {
        if(n1 % i == 0 && n2 % i == 0
            || n1 % (larger / i) == 0 && n2 % (larger / i) == 0) return false;
    }
    return true;
}

function modularInverse(num, modulo) {
    t = 0;
    newt = 1;
    r = modulo;
    newr = num;
    while(newr != 0) {
        quotient = Math.floor(r / newr);
        oldt = t;
        t = newt;
        newt = oldt - quotient * newt;
        oldr = r;
        r = newr;
        newr = oldr - quotient * newr;
    }
    if(r > 1) return -1;
    if(t < 0) t += modulo;
    return t;
}

function getKeys(p, q) {
    const product = p * q;
    const e = areCoprime(product, 17) ? 17 : areCoprime(product, 255) ? 255 : areCoprime(product, 65537) ? 65537 : 2;
    const d = modularInverse(e, product);
    return {
        public: {e, n: product},
        private: {d, n: product}
    }
}

function encrypt(num, pk) {
    return Math.pow(num, pk.e) % pk.n;
}

function decrypt(num, sk) {
    return Math.pow(num, sk.d) % sk.n;
}