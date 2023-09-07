function generateAndDownloadFile(numberArray) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${numberArray}`));
    element.setAttribute('download', 'file.txt');
    element.click();
}

generateAndDownloadFile(new Array(1024).fill(0).map(Math.random));
generateAndDownloadFile(window.crypto.getRandomValues(new Uint8Array(1024)));