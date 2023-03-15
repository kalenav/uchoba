const sentenceDecompositionModule = (function () {
    const serverAddress = 'http://127.0.0.1:5000';

    const sentenceContainer = document.getElementById('sentence');
    const lexemsContainer = document.getElementById('decomposition');
    document.getElementById('sentence-input').addEventListener('change', function () {
        fileReaderModule.readTextFile(this.files[0]);
    });

    const wordInput = document.getElementById('word-input');
    const genderSelect = document.getElementById('gend');
    const countSelect = document.getElementById('count');
    const caseSelect = document.getElementById('case');
    const morphedWordContainer = document.getElementById('morphed-word');
    document.getElementById('morph-word').addEventListener('click', async () => {
        const morphed = (await applyMorphologicalTraitsToWord(wordInput.value)).result;
        updateMorphedWordContainer(wordInput.value, morphed);
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
        return fetch(`${serverAddress}/morph`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word, traits })
        })
        .then(response => response.json())
        .catch(error => console.error(error));
    }

    function updateMorphedWordContainer(word, morphedWord) {
        morphedWordContainer.innerHTML = `${word} -> ${morphedWord}`;
    }

    function clearMorphedWordContainer() {
        morphedWordContainer.innerHTML = '';
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
        displayDecomposedSentenceAnalysis,
        clearMorphedWordContainer,
        wordInput
    }
})();

const dictionaryModule = (function () {
    const serverAddress = 'http://127.0.0.1:5000';
    const wordInput = sentenceDecompositionModule.wordInput;
    const searchInput = document.getElementById('search');

    document.getElementById('add-dictionary').addEventListener('click', async () => {
        const lexem = prompt('Введите лексему или словоформу');
        if (lexem in currDictionary) {
            alert('Такая лексема уже есть в словаре');
            return;
        }
        const entry = await getDictionaryEntryObj(lexem);
        currDictionary[lexem] = entry;
        buildDictionaryTag();
        updateDictionaryOnServer();
    });
    searchInput.addEventListener('keyup', (event) => {
        if (event.target !== searchInput) return;
        buildDictionaryTag(searchInput.value);
    });
    document.getElementById('morph-word-and-update-dictionary').addEventListener('click', async () => {
        const wordToMorph = wordInput.value;
        if (!wordToMorph || currEditedEntryId === -1) {
            return;
        }
        const morphed = (await sentenceDecompositionModule.applyMorphologicalTraitsToWord(wordToMorph)).result;

        currDictionary[morphed] = await getDictionaryEntryObj(morphed);
        buildDictionaryTag();
        deleteEntry(currEditedEntryId);
        updateDictionaryOnServer();
    });

    let currEditedEntryId = -1;
    let currMaxEntryId = 0;
    let currDictionary = {
        "программа": {
            "основа": "программ",
            "окончание": "а",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "женский род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "тест": {
            "основа": "тест",
            "окончание": "нулевое",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "мужской род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "задача": {
            "основа": "задач",
            "окончание": "а",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "женский род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "навык": {
            "основа": "навык",
            "окончание": "нулевое",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "мужской род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "тея": {
            "основа": "те",
            "окончание": "я",
            "Признаки": [
                "существительное",
                "одушевлённое",
                "женский род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "программирование": {
            "основа": "программирован",
            "окончание": "ие",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "средний род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "автоматический": {
            "основа": "автоматическ",
            "окончание": "ий",
            "Признаки": [
                "прилагательное",
                "мужской род",
                "единственное число",
                "именительный падеж"
            ]
        },
        "обработка": {
            "основа": "обработ",
            "окончание": "ка",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "женский род",
                "единственное число",
                "именительный падеж"
            ]
        },
        ".": {
            "основа": null,
            "окончание": null,
            "Признаки": [
                "знак препинания"
            ]
        },
        "при": {
            "основа": null,
            "окончание": null,
            "Признаки": [
                "предлог"
            ]
        },
        "закрепить": {
            "основа": "закреп",
            "окончание": "нулевое",
            "Признаки": [
                "инфинитив",
                "совершенный вид",
                "переходный"
            ]
        },
        "решение": {
            "основа": "решен",
            "окончание": "ие",
            "Признаки": [
                "существительное",
                "неодушевлённое",
                "средний род",
                "единственное число",
                "винительный падеж"
            ]
        }
    };

    async function getDictionary() {
        // currDictionary = await fetch(`${serverAddress}/dict`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        // .then(response => response.json())
        // .then(response => response.result);
        this.buildDictionaryTag();
    }

    function getWordTraits(word) {
        return fetch(`${serverAddress}/wordinfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ word })
        })
        .then(response => response.json());
    }

    async function getDictionaryEntryObj(word) {
        const traits = (await getWordTraits(word)).result;
        const base = traits[0].split('основа: ')[1];
        const ending = traits[1].split('окончание: ')[1];
        const dictionaryEntry = {
            'основа': base,
            'окончание': ending,
            'Признаки': traits.slice(2)
        };
        return dictionaryEntry;
    }

    function updateDictionaryOnServer() {
        fetch(`${serverAddress}/updatedict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newDictionary: currDictionary })
        });
    }

    function buildDictionaryTag(filter = "") {
        const dictionaryContainer = document.getElementById('dictionary');
        dictionaryContainer.innerHTML = '';
        const entries = [];
        for (const lexem in currDictionary) {
            if (!lexem.includes(filter)) continue;
            entries.push(newDictionaryEntryTag(lexem, currDictionary[lexem]));
            currMaxEntryId++;
        }
        entries.sort((entry1, entry2) => {
            const lexem1 = entry1.children[0].innerHTML;
            const lexem2 = entry2.children[0].innerHTML;
            return lexem1 > lexem2 ? 1 : -1;
        }).forEach(entry => dictionaryContainer.appendChild(entry));
    }

    function newDictionaryEntryTag(name, traitObj) {
        const entry = document.createElement('div');
        entry.classList.toggle('dictionary-entry');
        entry.setAttribute('id', `lexem${currMaxEntryId}`);

        const lexem = document.createElement('span');
        lexem.classList.toggle('lexem');
        lexem.append(`${name}`);
        entry.appendChild(lexem);

        const rightBlock = document.createElement('div');

        const traitsStr = [ ...traitObj['Признаки'] ];
        if (traitObj['основа']) {
            traitsStr.unshift(`основа: ${traitObj['основа']}`);
            traitsStr.unshift(`окончание: ${traitObj['окончание']}`);
        }
        rightBlock.append(traitsStr.join(', '));

        getEditAndDeleteButtons(currMaxEntryId).forEach(button => rightBlock.appendChild(button));

        entry.appendChild(rightBlock);
        return entry;
    }

    function getEditAndDeleteButtons(id) {
        const editButton = document.createElement('button');
        editButton.append('edit');
        editButton.classList.toggle('edit-button');
        editButton.setAttribute('onclick', `dictionaryModule.editEntry(${id})`);

        const deleteButton = document.createElement('button');
        deleteButton.append('delete');
        deleteButton.classList.toggle('delete-button');
        deleteButton.setAttribute('onclick', `dictionaryModule.deleteEntry(${id})`);

        return [editButton, deleteButton];
    }

    function editEntry(id) {
        const lexem = document.getElementById(`lexem${id}`).children[0].innerHTML;
        wordInput.value = lexem;
        wordInput.classList.toggle('focused');
        setTimeout(() => {
            wordInput.classList.toggle('focused');
        }, 1000);
        currEditedEntryId = id;
    }

    function deleteEntry(id) {
        const newDictionary = {};
        const toIgnore = document.getElementById(`lexem${id}`).children[0].innerHTML;
        for (const lexem in currDictionary) {
            if (lexem !== toIgnore) {
                newDictionary[lexem] = currDictionary[lexem];
            }
        }
        currDictionary = newDictionary;
        buildDictionaryTag();
        updateDictionaryOnServer();
    }

    return {
        getDictionary,
        buildDictionaryTag,
        editEntry,
        deleteEntry
    }
})();

const fileReaderModule = (function () {
    function readTextFile(file) {
        const reader = new FileReader();
        reader.onload = function () {
            sentenceDecompositionModule.displayDecomposedSentenceAnalysis(reader.result);
        };
        reader.readAsText(file);
    }


    return {
        readTextFile
    }
})();

dictionaryModule.getDictionary();