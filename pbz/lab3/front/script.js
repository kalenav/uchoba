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

    return {
        requestClasses,
        requestFirearms
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
        const classNames = await apiServiceModule.requestClasses();
        classNames.forEach(name => {
            const option = document.createElement('option');
            option.setAttribute('value', name);
            option.append(name);
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
})()

const mainModule = (function() {
    const debounceTime = 200;
    let debounceTimeoutID;

    function init() {
        displayIndividuals();
        filterModule.setClassSelectOptions();

        document.addEventListener('input', () => {
            if (!!debounceTimeoutID) {
                clearTimeout(debounceTimeoutID);
            }
            debounceTimeoutID = setTimeout(() => {
                displayIndividuals();
                debounceTimeoutID = 0;
            }, debounceTime);
        });
    }

    async function displayIndividuals() {
        const filterValues = filterModule.getFilterValues();
        console.log(filterValues);
        const individuals = await apiServiceModule.requestFirearms(filterValues);
        tableModule.redrawTable(individuals);
    }

    return {
        init
    }
})();

mainModule.init();