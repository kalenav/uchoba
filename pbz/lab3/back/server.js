const express = require('express');
const cors = require('cors');
const QueryEngine = require('@comunica/query-sparql').QueryEngine;

const queryEngine = new QueryEngine();
const server = express();
server.use(cors());

function getSelectLine(extractedFields) {
    return `SELECT ${extractedFields.map(field => `?${field}`).join(' ')}`;
}

function getEntryValue(entries, key) {
    return entries.get(key).id;
}

async function firearmRequest(params) {
    const response = [];

    if (!params.caliberMin) params.caliberMin = 0;
    if (!params.caliberMax) params.caliberMax = 100;
    if (!params.effectiveRangeMin) params.effectiveRangeMin = 0;
    if (!params.effectiveRangeMax) params.effectiveRangeMax = 10000;
    if (!params.class) params.class = "Firearm";

    const caliberFilter = params.caliber
        ? `FILTER (?caliber = ${params.caliber})`
        : `FILTER (?caliber >= ${params.caliberMin} && ?caliber <= ${params.caliberMax})`;

    const effectiveRangeFilter = params.effectiveRange
        ? `FILTER (?effectiveRange = ${params.effectiveRange})`
        : `FILTER (?effectiveRange >= ${params.effectiveRangeMin} && ?effectiveRange <= ${params.effectiveRangeMax})`;

    const query = `
    ${getSelectLine(params.extractedFields)}
    WHERE {
        ?class rdfs:label "${params.class}"@en .
        ?firearm rdf:type/rdfs:subClassOf* ?class .
        ?firearm rdfs:label ?name .

        ?caliberProperty rdfs:label "caliber_mm"@en .
        ?firearm ?caliberProperty ?caliber .
        ${caliberFilter}

        ?effectiveRangeProperty rdfs:label "effectiveRange_m"@en .
        ?firearm ?effectiveRangeProperty ?effectiveRange .
        ${effectiveRangeFilter}
    }
    `;

    const bindingsStream = await queryEngine.queryBindings(query, {
        sources: ['http://kalenav.github.io/ontology.rdf'],
    });

    bindingsStream.on('data', (binding) => {
        response.push(binding.entries);
    });

    bindingsStream.on('error', (error) => {
        console.error(error);
    });

    bindingsStream.on('end', () => {
        params.res.send(response.map(entries => Object.fromEntries(
            params.extractedFields.map(field => [field, getEntryValue(entries, field)])
        )));
    })
}

const firearmsRequest = '/firearms';
const classQuery = 'class=:class';

const caliberQuery = 'caliber=:caliber';
const minCaliberQuery = 'caliberMin=:caliberMin';
const maxCaliberQuery = 'caliberMax=:caliberMax';
const fullCaliberQuery = `(${caliberQuery})|(${minCaliberQuery})|(${maxCaliberQuery})|(${minCaliberQuery}&${maxCaliberQuery})`;

const effectiveRangeQuery = 'effectiveRange=:effectiveRange';
const minEffectiveRangeQuery = 'effectiveRangeMin=:effectiveRangeMin';
const maxEffectiveRangeQuery = 'effectiveRangeMax=:effectiveRangeMax';
const fullEffectiveRangeQuery = `(${effectiveRangeQuery})|(${minEffectiveRangeQuery})|(${maxEffectiveRangeQuery})|(${minEffectiveRangeQuery}&${maxEffectiveRangeQuery})`;

const optionalQueries = [classQuery, fullCaliberQuery, fullEffectiveRangeQuery];

const getFirearmsURL = `${firearmsRequest}${optionalQueries.map(query => `(&(${query}))?`).join('')}`;
console.log(getFirearmsURL);

server.get(getFirearmsURL, (req, res) => {
    console.log(req.params);
    firearmRequest({
        res,
        extractedFields: ['name'],
        class: req.params.class,
        caliber: req.params.caliber,
        caliberMin: req.params.caliberMin,
        caliberMax: req.params.caliberMax,
        effectiveRange: req.params.effectiveRange,
        effectiveRangeMin: req.params.effectiveRangeMin,
        effectiveRangeMax: req.params.effectiveRangeMax
    });
});

server.listen(3000, () => {
    console.log(`Server listening on port 3000`)
});