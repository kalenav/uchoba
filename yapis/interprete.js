import yargs from 'yargs';
import fs from 'fs';
import { analyzeSyntaxAndSemantics, getFileContents } from './sourceCodeAnalyzer.js';
import { Interpreter } from './lab5/said_to_cil_interpreter.js';

const options = yargs
    .usage("Usage: -f <source path> -t <target path>")
    .option("f", { alias: "filename", describe: "path to file to compile", type: "string", demandOption: true })
    .option("t", { alias: "target", describe: "path to target file", type: "string", demandOption: true })
    .argv;

if (analyzeSyntaxAndSemantics(options.filename)) {
    try {
        console.log('interpreting...');
        fs.writeFileSync(
            options.target,
            new Interpreter().interprete(getFileContents(options.filename))
        );
        console.log('interpreted successfully');
    }
    catch (err) {
        console.error(err);
    }
}