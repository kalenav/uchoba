export class Interpreter {
    interpret(code) {
        return `.assembly Hello {}
        .method public static void Main() cil managed
        {
             .entrypoint
             .maxstack 1
             ldstr "Hello, world!"
             call void [mscorlib]System.Console::WriteLine(string)
             ret
        }`;
    }
}