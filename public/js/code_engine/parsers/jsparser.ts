/// <reference path="../engine.ts" />

class JSParser implements Parser {

    name: string;
    extensions: string[];

    constructor() {
        this.name = "JSParser";
        this.extensions = ['js'];
    }

    parse(file: string) : CodeSnippet[]
    {

    }

    parseBody(text: string, filename: string) : CodeSnippet[]
    {
        var snippets = [];
        console.log("JSParser: parsing text...");
        var lines = text.split("\n");
        for (var i=0; i<lines.length; ++i) {
            var line = lines[i];
            // console.log("line " + (i+1) + ": " + line);

            var tmp = this.parseVar(line, i, text);
            console.log(tmp);
            for (var j=0; j<tmp.length; ++j) {
                tmp[j]._line = i+1;
                tmp[j]._file = filename;
                snippets.push(tmp[j]);
            }

            if (tmp.length == 0) {
                tmp = this.parseFunction(line, text);
                if (tmp != null) {
                    tmp._line = i+1;
                    tmp._file = filename;
                    tmp._lines = this.countFunctionLines(i, text);
                    snippets.push(tmp);
                    i += tmp._lines;
                }
            }
        }

        return snippets;
    }

    parseVar(line: string, num: number, text: string) : CodeSnippet[]
    {
        var snippets = [];
        line = line.trim();
        if (line.indexOf("var") == 0) {
            console.log(line);
            var v = line.substring(3, line.length-1).trim();
            var vars = v.split(",");
            console.log(vars);
            for (var i=0; i<vars.length; ++i) {
                var name = vars[i].trim().split(" ")[0].trim();
                if (name.length > 0)
                    snippets.push(new CodeSnippet(name, 'var'));
            }
            while (line.indexOf(";") == -length-1) {
                line = text.split('\n')[num+1];
                num += 1;
                console.log(line);
                var vars = line.trim().split(",");
                console.log(vars);
                for (var i=0; i<vars.length; ++i) {
                    var name = vars[i].trim().split(" ")[0].trim();
                    if (name.length > 0)
                        snippets.push(new CodeSnippet(name, 'var'));
                }
            }
        }

        return snippets;
    }

    parseFunction(line: string, text: string) : CodeSnippet
    {
        var snippet = null;
        var idx = line.indexOf("function");
        if (idx != -1) {
            // match: function test(arg)
            var t = line.indexOf('(', idx);
            name = line.substring(idx+9, t).trim();
            if (name.length > 0) {
                snippet = new CodeSnippet(name, 'fn');
            
            } else {
                // match: ... test = function()
                var t = line.indexOf("=");
                console.log("t", t);
                if (t != -1) {
                    var name = line.substring(0, t);
                    console.log(name);
                    name = name.split(".");
                    console.log(name);
                    name = name[name.length-1].trim();
                    console.log(name);
                    snippet = new CodeSnippet(name, 'fn');
                }
            }
        }

        console.log(snippet);
        return snippet;
    }

    countFunctionLines(start: number, text: string) : number
    {
        var count = 0;
        var lines = text.split('\n');
        var opened = 0;
        for (var i=start; i<text.length; ++i) {
            count += 1;
            var line = lines[i];
            var idx = line.indexOf("{", 0);
            while (idx != -1) {
                opened += 1;
                idx = line.indexOf("{", idx+1);
            }
            idx = line.indexOf("}", 0);
            while (idx != -1) {
                opened -= 1;
                idx = line.indexOf("}", idx+1);
            }
            if (i > start && opened == 0)
                break;
        }
        return count;
    }
};