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
const labelToIRIMap = {
    'Firearm': 'OWLClass_d4e6352d_2e30_4826_be37_6dd536c0d1b3',
    'effectiveRange_m': 'OWLDataProperty_1b13e99f_abba_4dca_a9a0_fcf03aa1a7ac',
    'caliber_mm': 'OWLDataProperty_ce3e3690_c9e9_4292_8197_5c5705549968',
    'Horizontal shotgun': 'OWLClass_00291114_1650_45dd_b700_f2d6367bde78',
    'Automatic pistol': 'OWLClass_039fea87_7f75_44a6_bb02_328cdb22e069',
    'Revolver': 'OWLClass_05395909_967e_4dad_a25e_67687021f2ff',
    'Single-shot shotgun': 'OWLClass_08703212_05c1_4bdd_a1c9_ce30fbce7028',
    'SMG': 'OWLClass_08a105e0_50a4_4d15_919e_acf7c8e3f1c0',
    'Bolt-action rifle': 'OWLClass_0deb86b4_b90f_43a7_a5b0_2443019d9f6c',
    'MMG': 'OWLClass_136932ad_9c6a_4891_ac56_e060f8f75741',
    'Assault rifle': 'OWLClass_28e087f5_3161_4582_9834_273111b9ea4e',
    'Double-tube shotgun': 'OWLClass_2cbf0f44_0c33_4bce_ba4d_0bf8ee3f71f3',
    'Smokeless powder firearm': 'OWLClass_3573cabb_ceaa_435d_9b7b_bbb8c48885b9',
    'Black powder firearm': 'OWLClass_3196b83b_fd17_4f1d_a5b5_c3cc78dde2a0',
    'Musket': 'OWLClass_0b55a61c_ed1f_466e_bfbf_ad48d01b8a3e',
    'Semi-automatic shotgun': 'OWLClass_3ae0c562_0220_4383_b9c3_54b24fc3d0d6',
    'Elongated pistol carbine': 'OWLClass_3b6885d2_ff55_46e1_b1ce_c8664798d0e1',
    'HMG': 'OWLClass_48360c73_b616_4c3a_a9be_93e849344749',
    'Lever-action shotgun': 'OWLClass_4c8c95da_e66f_4bbe_8e5a_453755c78796',
    'Musketon': 'OWLClass_4e5de6c8_787a_44d3_8f4b_04d6b863a3df',
    'Pistol': 'OWLClass_50489c1f_95fb_4182_89a3_2d06a55acaa1',
    'Double-barrel shotgun': 'OWLClass_566138a1_7726_4e1f_a37f_06c744a95cfc',
    'PDW': 'OWLClass_69848ff3_9d9e_4ff4_8bb1_b0848b3f73c4',
    'Magazine-fed assault rifle': 'OWLClass_6a6804fc_a44d_4bb8_86b9_b9142bd0994f',
    'Double-action revolver': 'OWLClass_7168fffd_749f_457e_902a_72b6119850a2',
    'Magazine-fed pistol': 'OWLClass_744c4a56_2ff1_466f_bbe7_5f6461dad2f9',
    'Bolt-action rifle with manual bolt rotation': 'OWLClass_7d20502b_cda4_4214_b110_fa150a779a53',
    'Straight-pull bolt-action rifle': 'OWLClass_83bdaad9_74b4_4a1e_b69d_5127152219a0',
    'Carbine': 'OWLClass_8a42b6d8_0a6c_4d3f_9b6d_7f7bf7fb9221',
    'Pistole': 'OWLClass_8a5f99a1_a95f_48f7_939a_fd2895f5d747',
    'Double-barrel rifle': 'OWLClass_a82690b7_000f_4703_8667_453d7b47b7e3',
    'Single-tube shotgun': 'OWLClass_a98cd715_fd45_48f1_8c03_ea83e098fb85',
    'Over-under shotgun': 'OWLClass_acccfa71_3a8d_443a_8418_7fec9e8b9b2f',
    'Pump-action shotgun': 'OWLClass_cc162c49_8991_47e6_b8b2_4c442308437e',
    'Semi-automatic pistol': 'OWLClass_cc71b06b_486f_4738_9494_075940296f7d',
    'Shortened rifle carbine': 'OWLClass_cd6faa01_694b_41cb_855e_23714b7058a6',
    'Shotgun': 'OWLClass_d201cafd_8aa7_4724_9d7b_71da6b601dba',
    'Rifle': 'OWLClass_d6022946_332f_4b49_9e72_5214a2a86a71',
    'Single-shot rifle': 'OWLClass_dddd859b_12c5_46dc_b4d0_a267df8f787e',
    'Magazine-fed shotgun': 'OWLClass_ebca139b_ff9b_45e9_9006_57f848fcfc4e',
    'Machine gun': 'OWLClass_ef1e35cc_2db6_4509_a79c_fc3048011237',
    'Anti-materiel rifle': 'OWLClass_efa89e6a_a9a1_4a0f_b337_29932ce5ea10',
    'Lever-action rifle': 'OWLClass_efb170a1_cb27_4048_908e_9f247ad8d3e4',
    'Clip-fed assault rifle': 'OWLClass_f0e9e124_21cc_4a23_9914_7995f46267f9',
    'LMG': 'OWLClass_f2c8bdfc_aa41_4133_8f3b_3b8b8528b3c6',
    'Automatic shotgun': 'OWLClass_f7d6b9a7_68e3_4a04_b143_8c8b9e9a3a48'
}

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
    })
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

async function firearmRequest(params) {
    const response = [];

    if (!params.caliberMin) params.caliberMin = 0;
    if (!params.caliberMax) params.caliberMax = 100;
    if (!params.effectiveRangeMin) params.effectiveRangeMin = 0;
    if (!params.effectiveRangeMax) params.effectiveRangeMax = 10000;
    if (!params.class) params.class = "Firearm";

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

function illegalClassName(className) {
    return false;
}

async function createNewClass(params) {
    if (!params.subClassOf) params.subClassOf = 'Firearm';
    if (illegalClassName(params.className) || classAlreadyExists(params.className)) {
        params.res.send(false);
        return;
    }
    else {
        const query = `
        ${PREFIX}

        INSERT {
            lab2:${params.className} rdf:type owl:Class ;
                rdfs:subClassOf ?superclass ;
                rdfs:label "${params.className}"@en .
        }
        WHERE {
            ?superclass rdfs:label "${params.subClassOf}"@en .
        }
        `;

        queryEngine.queryVoid(query, {
            sources: [store],
            destination: store
        })
        .then(async (response) => {
            // const classes = [];
            // const bindingsStream = await queryEngine.queryBindings(`
            // ${PREFIX}

            // SELECT ?className
            // WHERE {
            //     ?class rdfs:subClassOf lab2:${labelToIRIMap['Firearm']} .
            //     ?class rdfs:label ?className .
            // }
            // `, {
            //     sources: [store]
            // });
        
            // bindingsStream.on('data', (binding) => {
            //     classes.push(binding.entries);
            // });
        
            // bindingsStream.on('error', (error) => {
            //     console.error(error);
            // });
        
            // bindingsStream.on('end', () => {
            //     console.log(classes.map(cl => cl.get('className').value));
            // });
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
.then(() => {
    const connection = server.listen(4000, () => {
        console.log(`Server listening on port 4000`)
    });
    process.on('SIGINT', () => {
        connection.close(async () => {
            console.log('saving store into local ontology...');
            await saveStoreIntoOntology(store);
            console.log('saved successfully');
        });
    });
});

//////////////////////////////////////

async function saveStoreIntoOntology(store) {
    const writer = new n3.Writer({ format: 'RDF/XML' });
    writer.addQuads(store.getQuads(null, null, null, null));
    writer.end((error, result) => {
        if (error) {
            console.error(error);
        } else {
            fs.writeFileSync('../../lab2/ontology.rdf', result);
        }
    });
}