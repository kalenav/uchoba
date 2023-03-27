import yargs from 'yargs';
import fs from 'fs';
import { exec } from 'child_process';
import { analyzeSyntaxAndSemantics, getFileContents } from './sourceCodeAnalyzer.js';
import { Interpreter } from './lab5/said_to_cil_interpreter.js';

const options = yargs
    .usage("Usage: -f <source path>")
    .option("f", { alias: "filename", describe: "path to file to compile", type: "string", demandOption: true })
    .argv;

if (analyzeSyntaxAndSemantics(options.filename)) {
    console.log('syntax and semantics OK');
    try {
        console.log('interpreting...');
        fs.writeFileSync(
            'assembly.cil',
            new Interpreter().interpret(getFileContents(options.filename))
        );

        console.log('interpreted successfully, compiling...');
        exec('compile.bat', (err, stdout, stderr) => {
            if (err) {
                throw err;
            }
            console.log('compiled successfully to file "assembly.exe"!');
            fs.unlink('assembly.cil', (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    }
    catch (err) {
        console.error(err);
    }
}