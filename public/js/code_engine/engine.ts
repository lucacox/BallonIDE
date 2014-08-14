/// <reference path="../../../ts/jquery.d.ts" />
/// <reference path="../../../Scripts/typings/esprima/esprima.d.ts" />
/// <reference path="../editor/editor.ts" />

module engine {
    export interface Reference {
        line: number;
        column: number;
    }
    
    export class CodeSnippet {
        _type: string;      // fn, class, var
        _file: string;
        _line: number;
        _lines: number;
        _name: string;
        _arguments: any;
        _references: Reference[];

        constructor(name, type, file, line, lines) {
            this._name = name;
            this._type = type;
            this._file = file;
            this._line = line;
            this._lines = 1;
            if (lines != undefined) {
                this._lines = lines;
            }
            this._references = [];
        }

        name(): string {
            return this._name;
        }

        type(): string {
            return this._type
        }

        file(): string {
            return this._file;
        }

        line(): number {
            return this._line;
        }

        lines(): number {
            return this._lines;
        }

        arguments(): any {
            return this._arguments
        }

        setArguments(args: any): void {
            this._arguments = args;
        }

        addReference(line: number, col: number): void {
            console.log("adding reference for " + this._name + " -> l: " + line + " c: " + col);
            this._references.push({ line: line, column: col });
        }

        references(): Reference[] {
            return this._references;
        }
    };

    export interface Parser {
        name: string;
        extensions: string[];
        parse(file: string): CodeSnippet[];
        parseBody(text: string, filename: string): CodeSnippet[];
    };

    export class CodeEngine {
        _snippets: CodeSnippet[];
        _parsers: Parser[];
        _files: string[];
        _editor: Editor;

        constructor() {
            this._snippets = [];
            this._parsers = [];
            this._files = [];
            this._editor = _the_editor;
        }

        addParser(parser) {
            this._parsers.push(parser);
        }

        find(name: string, filename?: string): CodeSnippet[] {
            var snippets = [];
            for (var i = 0; i < this._snippets.length; ++i) {
                if (this._snippets[i].name() == name) {
                    if (filename == undefined || (filename != undefined && this._snippets[i].file() == filename))
                        snippets.push(this._snippets[i]);
                }
            }
            return snippets;
        }

        enqueue(filename: string): void {
            if (this._files.indexOf(filename) == -1) {
                this._files.push(filename);
            }
            if (this._files.length == 1)
                this.addFile(filename);
        }

        addFile(filename: string, parserName?: string): void {
            var me = this;
            $.ajax({
                url: '/api/v1/file',
                type: 'GET',
                data: {
                    filename: filename
                },
            }).done(function (data) {
                if (data.status) {
                    try {
                        console.log("PARSING FILE:", filename);
                        var p = esprima.parse(data.body, { loc: true });
                        me.parseBody(p.body, filename);
                    } catch (e) {
                        console.error(e);
                    }
                    me._files = me._files.slice(1);              
                }
            });
        }

        parseBody(body: any, filename: string): void {

            for (var i in body) {
                var block = body[i];

                this.parse(block.type, block, filename);
            }
        }

        parse(type: string, block: any, filename: string): void {
            var expr = block.expression;
            switch (type) {
                case "CallExpression":
                    this.parseCallExpression(block, filename);
                    break;

                case "AssignmentExpression":
                    this.parseAssignement(block, filename);
                    break;

                case "MemberExpression":
                    this.parseMember(block, filename);
                    break;

                case "BinaryExpression":
                    this.parseBinary(block, filename);
                    break;

                case "FunctionExpression":
                    this.parseFunction(block, filename);
                    break;

                case "ObjectExpression":
                    this.parseObjectExpr(block, filename);
                    break;

                case "ExpressionStatement":
                    this.parseExpression(expr, filename);
                    break;

                case "BlockStatement":
                    this.parseBody(block.body, filename);
                    break;

                case "FunctionDeclaration":
                    this.parseFunction(block, filename);
                    break;

                case "VariableDeclaration":
                    this.parseVariable(block, filename);
                    break;       
                
                case "Property":
                    this.parseProperty(block, filename);
                    break;         

                case "Identifier":
                    this.parseIdentifier(block, filename);
                    break;

                case "IfStatement":
                    this.parseIF(block, filename);
                    break;

                case "ForInStatement":
                    this.parseFORIN(block, filename);
                    break;

            }
        }

        parseProperty(block: any, filename: string): void {
            console.log("Parsing Property:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.key.type, block.key, filename);
            this.parse(block.value.type, block.value, filename);
        }

        parseObjectExpr(block: any, filename: string): void {
            console.log("Parsing Object:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            for (var i = 0; i < block.properties.length; i++) {
                this.parse(block.properties[i].type, block.properties[i], filename);
            }
        }

        parseFORIN(block: any, filename: string): void {
            console.log("Parsing ForIn:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.left.type, block.left, filename);
            this.parse(block.right.type, block.right, filename);
            this.parse(block.body.type, block.body, filename);
        }

        parseIF(block: any, filename: string): void {
            console.log("Parsing If:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.test.type, block.test, filename);
            this.parse(block.consequent.type, block.consequent, filename);
            if (block.alternate) {
                this.parse(block.alternate.type, block.alternate, filename);
            }
        }

        parseFunctionExpression(block: any, filename: string): void {

        }

        parseBinary(block: any, filename: string): void {
            console.log("Parsing Binary:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.left.type, block.left, filename);
            this.parse(block.right.type, block.right, filename);
        }

        parseIdentifier(block: any, filename: string): void {
            console.log("Parsing Identifier:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            var name = block.name;
            var line = block.loc.start.line;
            var col = block.loc.start.column;
            var s = this.find(name, filename);
            for (var i in s) {
                s[i].addReference(line, col);
            }
            if (s.length == 0) {
                this._snippets.push(new CodeSnippet(name, "var", filename, line, 1));
            }
        }

        parseMember(block: any, filename: string): void {
            console.log("Parsing Member", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));

            this.parse(block.object.type, block.object, filename);
            this.parse(block.property.type, block.property, filename);
        }

        parseAssignement(block: any, filename: string): void {
            console.log("Parsing Assignment:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.left.type, block.left, filename);
            this.parse(block.right.type, block.right, filename);
        }

        parseVariable(block: any, filename: string): void {
            console.log("Parsing Variable:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            for (var j in block.declarations) {
                // left operand
                var name = block.declarations[j].id.name;
                var l = block.declarations[j].id.loc.start.line;
                this._snippets.push(new CodeSnippet(name, "var", filename, l, 1));

                // rvalue
                if (block.declarations[j].init) {
                    var init = block.declarations[j].init;
                    this.parse(init.type, init, filename);
                }
            }
        }

        parseFunction(block: any, filename: string): void {
            console.log("Parsing Function:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            if (block.id) {
                this.parse(block.id.type, block.id, filename);
            }

            for (var j in block.params) {
                this.parse(block.params[j].type, block.params[j], filename);
            }

            this.parseBody(block.body.body, filename);
        }

        parseExpression(block: any, filename: string): void {
            console.log("Parsing Expression", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.type, block, filename);
        }

        parseCallExpression(block: any, filename: string): void {
            console.log("Parsing CallExpression", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));

            this.parse(block.callee.type, block.callee, filename);

            for (var a in block.arguments) {
                this.parse(block.arguments[a].type, block.arguments[a], filename);
            }
        }
    }
}

