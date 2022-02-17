using System;

public static class Imports
{

    /* It would ideal to use a helper function to generate the string literals here
       given the library name, but Script.Literal requires a constant string.
       It's not possible to create a constant string via interpolation until C# 10.
    */
    static Imports()
    {
        Script.Literal("let pako");
        Script.Literal("if (typeof window !== \"undefined\" && \"pako\" in window) {");
        Script.Literal("  pako = window[\"pako\"]");
        Script.Literal("} else {");
        Script.Literal("  import('pako').then(function(result) { pako = result; })");
        Script.Literal("}");
    }
}
