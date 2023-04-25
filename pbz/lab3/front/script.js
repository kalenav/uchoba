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

    return {
        requestClasses,
        requestFirearms,
        newClass
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

    function assembleNewClassModal(params) {
        modalHeader.innerHTML = 'New class';
        modalContent.innerHTML = '';
        
        const nameInput = document.createElement('input');
        nameInput.setAttribute('type', 'text');
        nameInput.setAttribute('placeholder', 'new class name');
        modalContent.appendChild(nameInput);

        const superclassSelect = document.createElement('select');
        params.existingClasses.sort().forEach(name => {
            const option = document.createElement('option');
            option.setAttribute('value', name);
            option.append(name);
            if (name === 'Firearm') {
                option.setAttribute('selected', '');
            }
            superclassSelect.appendChild(option);
        });
        modalContent.appendChild(superclassSelect);
    }

    function assembleNewIndividualModal(params) {
        modalHeader.innerHTML = 'New individual';
    }

    function assembleEditClassModal(params) {
        modalHeader.innerHTML = 'Edit class';
    }

    function assembleEditIndividualModal(params) {
        modalHeader.innerHTML = 'Edit individual';
    }

    function assembleDeleteModal(params) {
        modalHeader.innerHTML = 'Delete entry';
    }

    function displayModal(params) {
        modalAssemblerMap[params.type](params);
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
        document.addEventListener('input', () => {
            if (!!debounceTimeoutID) {
                clearTimeout(debounceTimeoutID);
            }
            debounceTimeoutID = setTimeout(() => {
                displayIndividuals();
                debounceTimeoutID = 0;
            }, debounceTime);
        });

        const existingClasses = await apiServiceModule.requestClasses();
        
        document.getElementById('new-class').addEventListener('click', () => {
            modalModule.displayModal({
                type: 'new-class',
                existingClasses
            });
        });
    
        document.getElementById('new-individual').addEventListener('click', () => {
            modalModule.displayModal({
                type: 'new-individual',
                existingClasses
            });
        });
    
        document.getElementById('edit-class').addEventListener('click', () => {
            modalModule.displayModal({
                type: 'edit-class',
                existingClasses
            });
        });
    
        document.getElementById('edit-individual').addEventListener('click', () => {
            modalModule.displayModal({
                type: 'edit-individual',
                existingClasses
            });
        });
    
        document.getElementById('delete-entity').addEventListener('click', () => {
            modalModule.displayModal({
                type: 'delete',
                existingClasses
            });
        });

        resetMain();
    }

    function resetMain() {
        filterModule.setClassSelectOptions();
        displayIndividuals();
    }

    async function displayIndividuals() {
        const filterValues = filterModule.getFilterValues();
        const individuals = await apiServiceModule.requestFirearms(filterValues);
        tableModule.redrawTable(individuals);
    }

    return {
        init
    }
})();

mainModule.init();