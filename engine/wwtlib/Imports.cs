using System;

public static class Imports
{

    static Imports()
    {
        Script.Literal("let pako = null");
        Script.Literal("import('pako').then(result => { pako = result; })");
    }
}
