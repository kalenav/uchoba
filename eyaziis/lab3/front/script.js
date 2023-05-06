const fileInput = document.getElementById('sentence-input');
const inputSentenceContainer = document.getElementById('input-sentence');
const decompositionResultTable = document.getElementById('decomposition-result');

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

const helpWindowModule = (function() {
    const helpButton = document.getElementById('help-button');
    const helpWindow = document.getElementById('help-window');
    const closeHelpButton = document.getElementById('close-help');

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
})();

const saveModule = (function() {
    const saveButton = document.getElementById('save-button');
    const savedFilenameByDefault = 'decomposition.txt';

    function getDataToSave() {
        data = [];

        const rawRows = [...decompositionResultTable.getElementsByTagName('tr')];
        const rowValues = rawRows.map(row => [...row.children].map(cell => cell.innerHTML));
        const [headerRow, ...rows] = rowValues;
        rows.forEach(row => {
            const currWordObj = {};
            row.forEach((value, index) => {
                if (value === '-') return;
                currWordObj[headerRow[index]] = value;
            });
            data.push(currWordObj);
        });

        return data;
    }

    function saveResult() {
        fileModule.download(
            JSON.stringify(getDataToSave()),
            savedFilenameByDefault
        )
    }

    function toggleSaveButtonVisiblity() {
        saveButton.classList.toggle('visible');
    }

    saveButton.addEventListener('click', () => {
        saveResult();
    });

    return {
        toggleSaveButtonVisiblity
    }
})();

const tableModule = (function() {
    headerColumns = [];

    function getHeaderRow(wordObjects) {
        const functionColumnsSet = new Set(wordObjects.map(Object.keys).flat());
        functionColumnsSet.delete('word');
        const columns = ['word', ...functionColumnsSet];
        
        const headerRow = document.createElement('tr');
        columns.forEach(columnName => {
            const th = document.createElement('th');
            th.append(columnName);
            headerRow.appendChild(th);
        });

        headerColumns = [...columns];

        return headerRow;
    }

    function getRows(wordObjects) {
        const rows = [];

        wordObjects.forEach((wordObj, rowIndex) => {
            const row = document.createElement('tr');
            headerColumns.forEach((columnName, columnIndex) => {
                const td = document.createElement('td');
                td.append(wordObj[columnName] ?? '-');
                td.addEventListener('click', () => { editModule.enterEditMode(td) });
                row.appendChild(td);
            });
            rows.push(row);
        });

        return rows;
    }

    function clearTable() {
        decompositionResultTable.innerHTML = '';
    }

    function displayTable(decompositionResult) {
        clearTable();
        const rows = [
            getHeaderRow(decompositionResult),
            ...getRows(decompositionResult)
        ];
        rows.forEach(row => decompositionResultTable.appendChild(row));
    }

    return {
        displayTable
    }
})();

const editModule = (function() {
    function enterEditMode(element) {
        const oldValue = element.innerHTML;
        const newValue = prompt('Введите новое значение', oldValue);
        if (!!newValue) element.innerHTML = newValue;
    }

    return {
        enterEditMode
    }
})();

fileInput.addEventListener('change', async function () {
    const sentence = await fileModule.readTextFile(this.files[0]);
    const result = await fetch(`http://localhost:5000/decompose`, {
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
    tableModule.displayTable(result)
    saveModule.toggleSaveButtonVisiblity();
});