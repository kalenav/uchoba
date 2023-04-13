const fileInput = document.getElementById('sentence-input');
const inputSentenceContainer = document.getElementById('input-sentence');
const decomposedSentenceContainer = document.getElementById('decomposed-sentence');
const buttonBlock = document.getElementById('button-block');
const saveButton = document.getElementById('save');
const editButton = document.getElementById('edit');
const savedFilenameByDefault = 'decomposition.txt';
const editWindow = document.getElementById('edit-window');
const editTextarea = document.getElementById('edit-textarea');
const editConfirmButton = document.getElementById('edit-confirm');
const editCancelButton = document.getElementById('edit-cancel');
const helpButton = document.getElementById('help-button');
const helpWindow = document.getElementById('help-window');
const closeHelpButton = document.getElementById('close-help');

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

fileInput.addEventListener('change', async function () {
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

function displayEditWindow() {
    editTextarea.value = decomposedSentenceContainer.innerHTML;
    editWindow.style.opacity = 1;
    editWindow.style.zIndex = 5;
}

function hideEditWindow() {
    editWindow.style.opacity = 0;
    editWindow.style.zIndex = -5;
}

saveButton.addEventListener('click', () => {
    fileModule.download(
        decomposedSentenceContainer.innerHTML,
        savedFilenameByDefault
    )
});

editButton.addEventListener('click', () => {
    displayEditWindow();
});

editCancelButton.addEventListener('click', () => {
    hideEditWindow();
});

editConfirmButton.addEventListener('click', () => {
    decomposedSentenceContainer.innerHTML = editTextarea.value;
    hideEditWindow();
});

function displayHelpWindow() {
    helpWindow.style.opacity = 1;
    helpWindow.style.zIndex = 5;
}

function hideHelpWindow() {
    helpWindow.style.opacity = 0;
    helpWindow.style.zIndex = -5;
}

helpButton.addEventListener('click', () => {
    displayHelpWindow();
});

closeHelpButton.addEventListener('click', () => {
    hideHelpWindow();
});