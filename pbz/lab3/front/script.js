const apiServiceModule = (function() {
    const serverAddress = `http://localhost:4000`;

    async function requestClasses() {
        return fetch(`${serverAddress}/classes`, {
            method: 'get'
        })
        .then(response => response.json());
    }

    async function requestFirearms(params = {}) {
        let searchString = new URLSearchParams(params).toString();
        if (!!searchString.length) searchString = `&${searchString}`;

        return fetch(`${serverAddress}/firearms${searchString}`, {
            method: 'get'
        })
        .then(response => response.json())
    }

    async function newClass(params) {
        const searchString = new URLSearchParams(params).toString();

        return fetch(`${serverAddress}/newClass&${searchString}`, {
            method: 'put'
        })
        .then(response => response.json());
    }

    async function newIndividual(params) {
        const searchString = new URLSearchParams(params).toString();

        return fetch(`${serverAddress}/newIndividual&${searchString}`, {
            method: 'put'
        })
        .then(response => response.json());
    }

    async function changeClass(params) {
        const searchString = new URLSearchParams(params).toString();

        return fetch(`${serverAddress}/updateClass&${searchString}`, {
            method: 'put'
        })
        .then(response => response.json());
    }

    async function changeIndividual(params) {
        const searchString = new URLSearchParams(params).toString();

        return fetch(`${serverAddress}/updateIndividual&${searchString}`, {
            method: 'put'
        })
        .then(response => response.json());
    }

    async function deleteEntity(params) {
        const searchString = new URLSearchParams(params).toString();

        return fetch(`${serverAddress}/deleteEntity&${searchString}`, {
            method: 'put'
        })
        .then(response => response.json());
    }

    return {
        requestClasses,
        requestFirearms,
        newClass,
        newIndividual,
        changeClass,
        changeIndividual,
        deleteEntity
    }
})();

const tableModule = (function () {
    const individualTable = document.getElementById('individual-table');

    function getHeaderRow() {
        const headerRow = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.append('Name');
        headerRow.append(nameCell);

        const caliberCell = document.createElement('th');
        caliberCell.append('Caliber (in millimeters)');
        headerRow.append(caliberCell);

        const rangeCell = document.createElement('th');
        rangeCell.append('Effective range (in meters)');
        headerRow.append(rangeCell);

        return headerRow;
    }

    function getRow(individual) {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.append(individual.name);
        row.append(nameCell);

        const caliberCell = document.createElement('td');
        caliberCell.append(individual.caliber);
        row.append(caliberCell);

        const rangeCell = document.createElement('td');
        rangeCell.append(individual.effectiveRange);
        row.append(rangeCell);

        return row;
    }

    function redrawTable(individuals) {
        individualTable.innerHTML = '';
        individualTable.appendChild(getHeaderRow());
        individuals.forEach(individual => {
            individualTable.appendChild(getRow(individual));
        });
    }

    return {
        redrawTable
    }
})();

const filterModule = (function() {
    const classSelect = document.getElementById('firearm-class-select');

    const caliberToggleCheckbox = document.getElementById('caliber-toggle-checkbox');
    const caliberFilter = document.getElementById('caliber');
    const caliberMinFilter = document.getElementById('caliber-min');
    const caliberMaxFilter = document.getElementById('caliber-max');
    let caliberFiltersToggled = false;
    caliberToggleCheckbox.addEventListener('click', toggleCaliberFilters);

    const rangeToggleCheckbox = document.getElementById('range-toggle-checkbox');
    const rangeFilter = document.getElementById('range');
    const rangeMinFilter = document.getElementById('range-min');
    const rangeMaxFilter = document.getElementById('range-max');
    let rangeFiltersToggled = false;
    rangeToggleCheckbox.addEventListener('click', toggleRangeFilters);

    async function setClassSelectOptions() {
        const classNames = (await apiServiceModule.requestClasses()).sort();
        classNames.forEach(name => {
            const option = document.createElement('option');
            option.setAttribute('value', name);
            option.append(name);
            if (name === 'Firearm') {
                option.setAttribute('selected', '');
            }
            classSelect.appendChild(option);
        })
    }

    function toggleCaliberFilters() {
        caliberFiltersToggled = !caliberFiltersToggled;
        const toLock = [];
        const toUnlock = [];
        if (caliberFiltersToggled) {
            toLock.push(caliberFilter);
            toUnlock.push(caliberMinFilter);
            toUnlock.push(caliberMaxFilter);
        }
        else {
            toLock.push(caliberMinFilter);
            toLock.push(caliberMaxFilter);
            toUnlock.push(caliberFilter);
        }
        toLock.forEach(input => input.setAttribute('disabled', ''));
        toUnlock.forEach(input => input.removeAttribute('disabled'));
    }

    function toggleRangeFilters() {
        rangeFiltersToggled = !rangeFiltersToggled;
        const toLock = [];
        const toUnlock = [];
        if (rangeFiltersToggled) {
            toLock.push(rangeFilter);
            toUnlock.push(rangeMinFilter);
            toUnlock.push(rangeMaxFilter);
        }
        else {
            toLock.push(rangeMinFilter);
            toLock.push(rangeMaxFilter);
            toUnlock.push(rangeFilter);
        }
        toLock.forEach(input => input.setAttribute('disabled', ''));
        toUnlock.forEach(input => input.removeAttribute('disabled'));
    }

    function addNonEmptyValue(valueObj, input, fieldName, mustBeNumber = true) {
        const value = input.value;
        if (mustBeNumber && isNaN(value)) return;
        if (!!value) valueObj[fieldName] = isNaN(value) ? value : +value;
    }

    function getFilterValues() {
        const filterValues = {};

        addNonEmptyValue(filterValues, classSelect, 'class', false);
        if (caliberFiltersToggled) {
            addNonEmptyValue(filterValues, caliberMinFilter, 'caliberMin');
            addNonEmptyValue(filterValues, caliberMaxFilter, 'caliberMax');
        }
        else {
            addNonEmptyValue(filterValues, caliberFilter, 'caliber');
        }
        if (rangeFiltersToggled) {
            addNonEmptyValue(filterValues, rangeMinFilter, 'effectiveRangeMin');
            addNonEmptyValue(filterValues, rangeMaxFilter, 'effectiveRangeMax');
        }
        else {
            addNonEmptyValue(filterValues, rangeFilter, 'effectiveRange');
        }

        return filterValues;
    }

    return {
        setClassSelectOptions,
        getFilterValues
    }
})();

const modalModule = (function() {
    let currModalType;

    const modal = document.getElementById('modal');
    const modalHeader = document.getElementById('modal-header');
    const modalContent = document.getElementById('modal-content');

    const modalAssemblerMap = {
        'new-class': assembleNewClassModal,
        'new-individual': assembleNewIndividualModal,
        'edit-class': assembleEditClassModal,
        'edit-individual': assembleEditIndividualModal,
        'delete': assembleDeleteModal
    }

    document.getElementById('modal-confirm').addEventListener('click', async () => {
        switch (currModalType) {
            case 'new-class':
                await apiServiceModule.newClass({
                    className: getInputValue('new-class-name'),
                    subClassOf: getInputValue('new-class-subclass-of')
                });
                break;
            case 'new-individual':
                await apiServiceModule.newIndividual({
                    name: getInputValue('new-individual-name'),
                    caliber: getInputValue('new-individual-caliber'),
                    range: getInputValue('new-individual-range'),
                    elementOf: getInputValue('new-individual-element-of')
                });
                break;
            case 'edit-class':
                await apiServiceModule.changeClass({
                    currName: getInputValue('edited-class'),
                    newName: getInputValue('new-class-name')
                });
                break;
            case 'edit-individual':
                const params = {};

                const currName = getInputValue('edited-individual');
                const newName = getInputValue('new-individual-name');
                const newCaliber = getInputValue('new-caliber');
                const newRange = getInputValue('new-range');

                params.currName = currName;
                if (!!newName) params.newName = newName;
                if (!!newCaliber) params.newCaliber = newCaliber;
                if (!!newRange) params.newRange = newRange;
                await apiServiceModule.changeIndividual(params);
                break;
            case 'delete':
                await apiServiceModule.deleteEntity({
                    name: getInputValue('deleted-entity-name')
                });
                break;
            default:
                break;
        }
        
        toggleModalVisibility();
        window.location.reload();
    });

    document.getElementById('modal-cancel').addEventListener('click', () => {
        toggleModalVisibility();
    });

    async function assembleNewClassModal() {
        modalHeader.innerHTML = 'New class';
        
        const nameInput = getTextInput('new-class-name', 'new class name');
        const selectLabel = getSelectLabel('new-class-subclass-of', 'Immediate superclass:');
        const superclassSelect = await getClassSelect('new-class-subclass-of');

        modalContent.appendChild(selectLabel);
        modalContent.appendChild(superclassSelect);
        modalContent.appendChild(nameInput);
    }

    async function assembleNewIndividualModal() {
        modalHeader.innerHTML = 'New individual';

        const nameInput = getTextInput('new-individual-name', 'new individual name');
        const caliberInput = getTextInput('new-individual-caliber', 'caliber (in mm)');
        const rangeInput = getTextInput('new-individual-range', 'effective range (in m)');
        const selectLabel = getSelectLabel('new-individual-element-of', 'Element of:');
        const classSelect = await getClassSelect('new-individual-element-of');

        modalContent.appendChild(selectLabel);
        modalContent.appendChild(classSelect);
        modalContent.appendChild(nameInput);
        modalContent.appendChild(caliberInput);
        modalContent.appendChild(rangeInput);
    }

    async function assembleEditClassModal() {
        modalHeader.innerHTML = 'Edit class';

        const selectLabel = getSelectLabel('edited-class', 'Edited class:');
        const editedClassSelect = await getClassSelect('edited-class');
        const nameInput = getTextInput('new-class-name', 'new class name');

        modalContent.appendChild(selectLabel);
        modalContent.appendChild(editedClassSelect);
        modalContent.appendChild(nameInput);
    }

    async function assembleEditIndividualModal() {
        modalHeader.innerHTML = 'Edit individual';

        const selectLabel = getSelectLabel('edited-individual', 'Edited individual:');
        const individualSelect = await getIndividualSelect('edited-individual');
        const newCaliber = getTextInput('new-caliber', 'new caliber (leave empty to keep)');
        const newRange = getTextInput('new-range', 'new range (leave empty to keep)');
        const newName = getTextInput('new-individual-name', 'new name (leave empty to keep)');

        modalContent.appendChild(selectLabel);
        modalContent.appendChild(individualSelect);
        modalContent.appendChild(newCaliber);
        modalContent.appendChild(newRange);
        modalContent.appendChild(newName);
    }

    async function assembleDeleteModal() {
        modalHeader.innerHTML = 'Delete entity';

        const selectLabel = getSelectLabel('deleted-entity-name', 'Deleted entity:');
        
        const select = document.createElement('select');
        select.setAttribute('id', 'deleted-entity-name');

        (await apiServiceModule.requestFirearms())
            .sort((ind1, ind2) => ind1.name > ind2.name ? 1 : -1)
            .map(ind => ind.name)
            .forEach(name => {
                const option = document.createElement('option');
                option.setAttribute('value', name);
                option.append(name);
                select.appendChild(option);
            });

        (await apiServiceModule.requestClasses())
            .sort()
            .forEach(name => {
                const option = document.createElement('option');
                option.setAttribute('value', name);
                option.append(name);
                select.appendChild(option);
            });

        modalContent.appendChild(select);
    }

    async function getClassSelect(id) {
        const classSelect = document.createElement('select');
        classSelect.setAttribute('id', id);
        (await apiServiceModule.requestClasses()).sort().forEach(name => {
            const option = document.createElement('option');
            option.setAttribute('value', name);
            option.append(name);
            if (name === 'Firearm') {
                option.setAttribute('selected', '');
            }
            classSelect.appendChild(option);
        });
        return classSelect;
    }

    function getSelectLabel(id, label) {
        const selectLabel = document.createElement('label');
        selectLabel.setAttribute('for', id);
        selectLabel.append(label);
        return selectLabel;
    }

    async function getIndividualSelect(id) {
        const select = document.createElement('select');
        select.setAttribute('id', id);
        (await apiServiceModule.requestFirearms())
            .sort((ind1, ind2) => ind1.name > ind2.name ? 1 : -1)
            .map(ind => ind.name)
            .forEach(name => {
                const option = document.createElement('option');
                option.setAttribute('value', name);
                option.append(name);
                select.appendChild(option);
            });
        return select;
    }

    function getTextInput(id, placeholder = '') {
        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', id);
        input.setAttribute('placeholder', placeholder);
        return input;
    }

    function getInputValue(id) {
        return document.getElementById(id).value;
    }

    async function displayModal(params) {
        modalContent.innerHTML = '';
        currModalType = params.type;
        await modalAssemblerMap[params.type](params);
        toggleModalVisibility();
    }

    function toggleModalVisibility() {
        modal.classList.toggle('visible');
    }

    return {
        displayModal
    }
})();

const mainModule = (function() {
    const debounceTime = 200;
    let debounceTimeoutID;

    async function init() {
        document.getElementById('filter-block').addEventListener('input', () => {
            if (!!debounceTimeoutID) {
                clearTimeout(debounceTimeoutID);
            }
            debounceTimeoutID = setTimeout(() => {
                displayIndividuals();
                debounceTimeoutID = 0;
            }, debounceTime);
        });
        
        document.getElementById('new-class').addEventListener('click', () => {
            displayModal('new-class');
        });
    
        document.getElementById('new-individual').addEventListener('click', () => {
            displayModal('new-individual')
        });
    
        document.getElementById('edit-class').addEventListener('click', () => {
            displayModal('edit-class');
        });
    
        document.getElementById('edit-individual').addEventListener('click', () => {
            displayModal('edit-individual');
        });
    
        document.getElementById('delete-entity').addEventListener('click', () => {
            displayModal('delete');
        });

        resetMain();
    }

    async function displayModal(type) {
        const existingClasses = await apiServiceModule.requestClasses();
        modalModule.displayModal({
            type,
            existingClasses
        });
    }

    function resetMain() {
        filterModule.setClassSelectOptions();
        displayIndividuals();
    }

    async function displayIndividuals() {
        const filterValues = filterModule.getFilterValues();
        const individuals = (await apiServiceModule.requestFirearms(filterValues))
            .sort((ind1, ind2) => ind1.name > ind2.name ? 1 : -1);
        tableModule.redrawTable(individuals);
    }

    return {
        init,
        resetMain
    }
})();

mainModule.init();