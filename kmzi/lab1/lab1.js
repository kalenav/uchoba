function generateAndDownloadFile(numberArray) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${numberArray}`));
    element.setAttribute('download', 'file.txt');
    element.click();
}

// generateAndDownloadFile(new Array(1024).fill(0).map(Math.random));
// generateAndDownloadFile(window.crypto.getRandomValues(new Uint8Array(1024)));

function cryptoSequenceGenerator(seed1, seed2, seed3, sequenceSize) {
    const sequence = [seed1, seed2, seed3];

    const modulo = Math.pow(2, 35) - 849;
    for (let index = 3; index < sequenceSize; index++) {
        sequence.push((1995 * sequence[index - 1] + 1998 * sequence[index - 2] + 2001 * sequence[index - 3]) % modulo);
    }

    return sequence;
}

// generateAndDownloadFile(cryptoSequenceGenerator(101, 999, 2350, 1024));