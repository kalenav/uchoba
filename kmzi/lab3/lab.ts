function largestCommonFactor_euclidean(a: number, b: number): number {
    if (a <= b) {
        return -1;
    }

    let r_prev: number = a % b;
    let r: number = b % r_prev;
    while (r > 0) {
        const old_r: number = r;
        r = r_prev % r;
        r_prev = old_r;
    }
    return r_prev;
}

function largestCommonFactor_euclideanExtended(a: number, b: number): { lcf: number, a_coef: number, b_coef: number } {
    if (a <= b) {
        return { lcf: -1, a_coef: -1, b_coef: -1 };
    }

    let [r_prev, r] = [a, b];
    let [s_prev, s] = [1, 0];
    let [t_prev, t] = [0, 1];

    while (r > 0) {
        const q: number = Math.floor(r_prev / r);
        const [old_r, old_s, old_t] = [r, s, t];
        r = r_prev - q*r;
        s = s_prev - q*s;
        t = t_prev - q*t;
        [r_prev, s_prev, t_prev] = [old_r, old_s, old_t];
    }

    return {
        lcf: r_prev,
        a_coef: s_prev,
        b_coef: t_prev
    }
}