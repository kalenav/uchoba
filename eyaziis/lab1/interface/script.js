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

const dictionaryModule = (function () {
    const serverAddress = 'http://127.0.0.1:5000';

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

    function updateDictionaryOnServer() {
        fetch(`${serverAddress}/updatedict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newDictionary: currDictionary })
        });
    }

    function buildDictionaryTag() {
        const dictionaryContainer = document.getElementById('dictionary');
        dictionaryContainer.innerHTML = '';
        for (const lexem in currDictionary) {
            dictionaryContainer.append(newDictionaryEntry(lexem, currDictionary[lexem]));
            currMaxEntryId++;
        }
    }

    function newDictionaryEntry(name, traitObj) {
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

    }

    function deleteEntry(id) {
        const newDictionary = {};
        for (const lexem in currDictionary) {
            if (lexem !== document.getElementById(`lexem${id}`).children[0].innerHTML) {
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