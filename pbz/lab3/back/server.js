const express = require('express');
const cors = require('cors');
const QueryEngine = require('@comunica/query-sparql').QueryEngine;
const n3 = require('n3');
const fs = require('fs');

const server = express();
server.use(cors());

const queryEngine = new QueryEngine();
const store = new n3.Store();

const ontologyIRI = 'http://www.semanticweb.org/konst/ontologies/2023/1/lab2';
const PREFIX = `PREFIX lab2: <${ontologyIRI}#>`;
const ontologyURL = `http://localhost:3000/sparql`;
const labelToIRIMap = {};

//////////////////////////////////////

function getSelectLine(extractedFields) {
    return `SELECT ${extractedFields.map(field => `?${field}`).join(' ')}`;
}

async function loadOntologyIntoStore(store, ontologyURL) {
    await queryEngine.queryVoid(`
    INSERT
    {
        ?s ?p ?o 
    }
    WHERE {
        ?s ?p ?o
    }
    `, {
        sources: [ontologyURL],
        destination: store
    });
}

async function setLabelToIRIMap() {
    const mapSet = new Promise(async (resolve, reject) => {
        const bindingsStream = await queryEngine.queryBindings(`
        ${PREFIX}
    
        SELECT ?entityLabel (URI(?entity) as ?iri)
        WHERE {
            { ?entity rdf:type owl:Class } UNION { ?entity rdf:type owl:DatatypeProperty }
            ?entity rdfs:label ?entityLabel .
        }
        `, {
            sources: [store]
        });
    
        bindingsStream.on('data', (binding) => {
            const label = getEntryValue(binding.entries, 'entityLabel');
            const IRI = getEntryValue(binding.entries, 'iri').split(`${ontologyIRI}#`)[1];
            labelToIRIMap[label] = IRI;
        });
    
        bindingsStream.on('error', (err) => {
            console.error(err);
            reject();
        });
    
        bindingsStream.on('end', () => {
            resolve();
        })
    });

    return mapSet;
}

//////////////////////////////////////
/// get firearms list with filters ///
//////////////////////////////////////

function getEntryValue(entries, key) {
    const raw = entries.get(key).value;
    switch (key) {
        default:
            return isNaN(raw) ? raw : Number(raw);
    }
}

function plusToSpaceMapper(string) {
    return string.split('+').join(' ');
}

async function firearmRequest(params) {
    const response = [];

    if (!params.caliberMin) params.caliberMin = 0;
    if (!params.caliberMax) params.caliberMax = 100;
    if (!params.effectiveRangeMin) params.effectiveRangeMin = 0;
    if (!params.effectiveRangeMax) params.effectiveRangeMax = 10000;
    if (!params.class) params.class = "Firearm";
    params.class = plusToSpaceMapper(params.class);

    const classIRI = labelToIRIMap[params.class];
    const caliberIRI = labelToIRIMap['caliber_mm'];
    const effectiveRangeIRI = labelToIRIMap['effectiveRange_m'];
    const caliberFilter = params.caliber
        ? `FILTER (?caliber = ${params.caliber})`
        : `FILTER (?caliber >= ${params.caliberMin} && ?caliber <= ${params.caliberMax})`;

    const effectiveRangeFilter = params.effectiveRange
        ? `FILTER (?effectiveRange = ${params.effectiveRange})`
        : `FILTER (?effectiveRange >= ${params.effectiveRangeMin} && ?effectiveRange <= ${params.effectiveRangeMax})`;

    const query = `
    ${PREFIX}

    ${getSelectLine(params.extractedFields)}
    WHERE {
        { ?firearm rdf:type/rdfs:subClassOf* lab2:${classIRI} }

        ?firearm rdfs:label ?name .

        ?firearm lab2:${caliberIRI} ?caliber .
        ${caliberFilter}

        ?firearm lab2:${effectiveRangeIRI} ?effectiveRange .
        ${effectiveRangeFilter}
    }
    `;

    const bindingsStream = await queryEngine.queryBindings(query, {
        sources: [store],
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

server.get(getFirearmsURL, (req, res) => {
    firearmRequest({
        res,
        extractedFields: ['name', 'caliber', 'effectiveRange'],
        class: req.params.class,
        caliber: req.params.caliber,
        caliberMin: req.params.caliberMin,
        caliberMax: req.params.caliberMax,
        effectiveRange: req.params.effectiveRange,
        effectiveRangeMin: req.params.effectiveRangeMin,
        effectiveRangeMax: req.params.effectiveRangeMax
    });
});

//////////////////////////////////////
///  create new class in ontology  ///
//////////////////////////////////////

function classAlreadyExists(className) {
    return !!labelToIRIMap[className];
}

async function createNewClass(params) {
    if (classAlreadyExists(params.className)) {
        params.res.send(false);
        return;
    }
    else {
        if (!params.subClassOf) params.subClassOf = 'Firearm';
        else params.subClassOf = plusToSpaceMapper(params.subClassOf);
        params.className = plusToSpaceMapper(params.className);

        const query = `
        ${PREFIX}

        INSERT DATA {
            <${ontologyIRI}#${params.className.split(' ').join('')}> rdf:type owl:Class ;
                rdfs:subClassOf <${ontologyIRI}#${labelToIRIMap[params.subClassOf]}> ;
                rdfs:label "${params.className}"@en .
        }
        `;

        queryEngine.queryVoid(query, {
            sources: [store],
            destination: store
        })
        .then(async () => {
            await setLabelToIRIMap();
            params.res.send(true);
        })
        .catch(err => {
            console.error(err);
            params.res.send(false);
        });
    }
}

server.put('/newClass(&className=:className)((&subClassOf=:subClassOf)?)', (req, res) => {
    createNewClass({
        res,
        className: req.params.className,
        subClassOf: req.params.subClassOf
    });
});

loadOntologyIntoStore(store, ontologyURL)
.then(setLabelToIRIMap)
.then(() => {
    const connection = server.listen(4000, () => {
        console.log(labelToIRIMap);
        console.log(`Server listening on port 4000`);
    });
    process.on('SIGINT', () => {
        connection.close(async () => {
            console.log('saving ontology...');
            await saveStoreIntoOntology(store);
            console.log('saved successfully');
        });
    });
});

async function saveStoreIntoOntology(store) {
    const writer = new n3.Writer({ format: 'text/turtle' });
    const serializedData = writer.quadsToString(store.getQuads());
    fs.writeFileSync('E:/Important/uchoba_rep/uchoba/pbz/lab2/ontology.ttl', serializedData);

    ////////////////////////////////////////
    //  !!! MUST RELOAD BOTH SERVERS !!!  //
    ////////////////////////////////////////
}