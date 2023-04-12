const inputSentenceContainer = document.getElementById('input-sentence');
const decomposedSentenceContainer = document.getElementById('decomposed-sentence');
const buttonBlock = document.getElementById('button-block');

const fileModule = (function () {
    async function readTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function () {
                resolve(reader.result);
            };
            reader.readAsText(file);
        });
    }

    function download(text, filename) {
        const file = new Blob([text]);
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0); 
    }

    return {
        readTextFile,
        download
    }
})();

document.getElementById('sentence-input').addEventListener('change', async function () {
    const sentence = await fileModule.readTextFile(this.files[0]);
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
    inputSentenceContainer.innerHTML = sentence;
    decomposedSentenceContainer.innerHTML = decomposed_sentence;
    buttonBlock.style.opacity = 1;
});

document.getElementById('save').addEventListener('click', () => {
    fileModule.download(
        decomposedSentenceContainer.innerHTML,
        'decomposition.txt'
    )
});