const fileReaderModule = (function () {
    async function readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    }

    return {
        readTextFile
    }
})();

document.getElementById('sentence-input').addEventListener('change', async function () {
    const sentence = await fileReaderModule.readTextFile(this.files[0]);
    const decomposed_sentence = await fetch(`http://localhost:5000/decompose`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence })
    })
    .then(response => response.json())
    .then(response => response.result)
    .catch(err => console.error(err));
    console.log(sentence);
    console.log(decomposed_sentence);
});