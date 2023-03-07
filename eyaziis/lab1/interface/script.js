const sentenceDecompositionModule = (function() {
    const serverAddress = 'http://127.0.0.1:5000';

    async function applyMorphologicalTraitsToWord(word, traits) {
        return fetch(`${serverAddress}/morph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word, traits })
        })
        .then(response => response.json())
        .catch(error => console.error(error))
    }

    async function decompose(sentence) {
        return fetch(`${serverAddress}/decompose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sentence })
        })
        .then(response => response.json())
        .catch(error => console.error(error))
    }

    return {
        decompose,
        applyMorphologicalTraitsToWord
    }
})();

const fileReaderModule = (function() {
    function readTextFile(file) {
        const reader = new FileReader();
        reader.onload = async function() {
            sentenceContainer.innerHTML = reader.result;
            lexemsContainer.innerHTML = '';
            const lexemsList = document.createElement('ul');
            lexemsContainer.appendChild(lexemsList);

            const decomposition = (await sentenceDecompositionModule.decompose(reader.result)).result;
            for (const lexem in decomposition) {
                const lexemsListEntry = document.createElement('li');
                lexemsListEntry.innerHTML = `"${lexem}": ${decomposition[lexem]}`;
                lexemsList.append(lexemsListEntry);
            }
        };
        reader.readAsText(file);
    }


    return {
        readTextFile
    }
})();

const sentenceContainer = this.document.getElementById('sentence');
const lexemsContainer = this.document.getElementById('decomposition');

document.getElementById('sentence-input').addEventListener('change', function() {
    fileReaderModule.readTextFile(this.files[0]);
})