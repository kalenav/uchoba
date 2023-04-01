const QueryEngine = require('@comunica/query-sparql').QueryEngine;

(async () => {
    const engine = new QueryEngine();

    const bindingsStream = await engine.queryBindings(
    `
    SELECT ?entity
    WHERE {
      ?entity ?p ?o
    }
    LIMIT 10`, {
        sources: ['https://ontology.akrick.repl.co/ontology.rdf'],
    });

    bindingsStream.on('data', (binding) => {
        console.log(binding.toString()); // Quick way to print bindings for testing
    });
})();