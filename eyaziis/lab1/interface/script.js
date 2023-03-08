const sentenceDecompositionModule = (function() {
    const serverAddress = 'http://127.0.0.1:5000';

    const sentenceContainer = document.getElementById('sentence');
    const lexemsContainer = document.getElementById('decomposition');
    document.getElementById('sentence-input').addEventListener('change', function() {
        fileReaderModule.readTextFile(this.files[0]);
    });

    const wordInput = document.getElementById('word-input');
    const genderSelect = document.getElementById('gend');
    const countSelect = document.getElementById('count');
    const caseSelect = document.getElementById('case');
    const morphedWordContainer = document.getElementById('morphed-word');
    document.getElementById('morph-word').addEventListener('click', () => {
        applyMorphologicalTraitsToWord(wordInput.value);
    });
    const traitToPymorphy2TraitMap = {
        'Мужской': 'masc',
        'Женский': 'femn',
        'Средний': 'neut',

        'Единственное': 'sing',
        'Множественное': 'plur',

        'Именительный': 'nomn',
        'Родительный': 'gent',
        'Дательный': 'datv',
        'Винительный': 'accs',
        'Творительный': 'ablt',
        'Предложный': 'loct'
    }

    async function displayDecomposedSentenceAnalysis(sentence) {
        const decomposition = (await this.decompose(sentence)).result
        sentenceContainer.innerHTML = sentence;
        lexemsContainer.innerHTML = '';
        const lexemsList = document.createElement('ul');
        lexemsContainer.appendChild(lexemsList);
        for (const lexem in decomposition) {
            const lexemsListEntry = document.createElement('li');
            lexemsListEntry.innerHTML = `"${lexem}": ${decomposition[lexem]}`;
            lexemsList.append(lexemsListEntry);
        }
    }

    async function applyMorphologicalTraitsToWord(word) {
        const traits = gatherSelectedTraits();
        const response = await fetch(`${serverAddress}/morph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word, traits })
        })
        .then(response => response.json())
        .catch(error => console.error(error));
        morphedWordContainer.innerHTML = `${word} -> ${response.result}`;
    }

    function decompose(sentence) {
        return fetch(`${serverAddress}/decompose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sentence })
        })
        .then(response => response.json())
        .catch(error => console.error(error));
    }

    function gatherSelectedTraits() {
        return [
            traitToPymorphy2TraitMap[genderSelect.value],
            traitToPymorphy2TraitMap[countSelect.value],
            traitToPymorphy2TraitMap[caseSelect.value]
        ]
    }

    return {
        decompose,
        applyMorphologicalTraitsToWord,
        displayDecomposedSentenceAnalysis
    }
})();

const fileReaderModule = (function() {
    function readTextFile(file) {
        const reader = new FileReader();
        reader.onload = function() {
            sentenceDecompositionModule.displayDecomposedSentenceAnalysis(reader.result);
        };
        reader.readAsText(file);
    }


    return {
        readTextFile
    }
})();