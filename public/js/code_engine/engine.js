/// <reference path="../../../ts/jquery.d.ts" />
/// <reference path="../../../Scripts/typings/esprima/esprima.d.ts" />
/// <reference path="../editor/editor.ts" />
var engine;
(function (engine) {
    var CodeSnippet = (function () {
        function CodeSnippet(name, type, file, line, lines) {
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
        CodeSnippet.prototype.name = function () {
            return this._name;
        };

        CodeSnippet.prototype.type = function () {
            return this._type;
        };

        CodeSnippet.prototype.file = function () {
            return this._file;
        };

        CodeSnippet.prototype.line = function () {
            return this._line;
        };

        CodeSnippet.prototype.lines = function () {
            return this._lines;
        };

        CodeSnippet.prototype.arguments = function () {
            return this._arguments;
        };

        CodeSnippet.prototype.setArguments = function (args) {
            this._arguments = args;
        };

        CodeSnippet.prototype.addReference = function (line, col) {
            console.log("adding reference for " + this._name + " -> l: " + line + " c: " + col);
            this._references.push({ line: line, column: col });
        };

        CodeSnippet.prototype.references = function () {
            return this._references;
        };
        return CodeSnippet;
    })();
    engine.CodeSnippet = CodeSnippet;
    ;

    ;

    var CodeEngine = (function () {
        function CodeEngine() {
            this._snippets = [];
            this._parsers = [];
            this._files = [];
            this._editor = _the_editor;
        }
        CodeEngine.prototype.addParser = function (parser) {
            this._parsers.push(parser);
        };

        CodeEngine.prototype.find = function (name, filename) {
            var snippets = [];
            for (var i = 0; i < this._snippets.length; ++i) {
                if (this._snippets[i].name() == name) {
                    if (filename == undefined || (filename != undefined && this._snippets[i].file() == filename))
                        snippets.push(this._snippets[i]);
                }
            }
            return snippets;
        };

        CodeEngine.prototype.enqueue = function (filename) {
            if (this._files.indexOf(filename) == -1) {
                this._files.push(filename);
            }
            if (this._files.length == 1)
                this.addFile(filename);
        };

        CodeEngine.prototype.addFile = function (filename, parserName) {
            var me = this;
            $.ajax({
                url: '/api/v1/file',
                type: 'GET',
                data: {
                    filename: filename
                }
            }).done(function (data) {
                if (data.status) {
                    try  {
                        console.log("PARSING FILE:", filename);
                        var p = esprima.parse(data.body, { loc: true });
                        me.parseBody(p.body, filename);
                    } catch (e) {
                        console.error(e);
                    }
                    me._files = me._files.slice(1);
                }
            });
        };

        CodeEngine.prototype.parseBody = function (body, filename) {
            for (var i in body) {
                var block = body[i];

                this.parse(block.type, block, filename);
            }
        };

        CodeEngine.prototype.parse = function (type, block, filename) {
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
        };

        CodeEngine.prototype.parseProperty = function (block, filename) {
            console.log("Parsing Property:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.key.type, block.key, filename);
            this.parse(block.value.type, block.value, filename);
        };

        CodeEngine.prototype.parseObjectExpr = function (block, filename) {
            console.log("Parsing Object:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            for (var i = 0; i < block.properties.length; i++) {
                this.parse(block.properties[i].type, block.properties[i], filename);
            }
        };

        CodeEngine.prototype.parseFORIN = function (block, filename) {
            console.log("Parsing ForIn:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.left.type, block.left, filename);
            this.parse(block.right.type, block.right, filename);
            this.parse(block.body.type, block.body, filename);
        };

        CodeEngine.prototype.parseIF = function (block, filename) {
            console.log("Parsing If:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.test.type, block.test, filename);
            this.parse(block.consequent.type, block.consequent, filename);
            if (block.alternate) {
                this.parse(block.alternate.type, block.alternate, filename);
            }
        };

        CodeEngine.prototype.parseFunctionExpression = function (block, filename) {
        };

        CodeEngine.prototype.parseBinary = function (block, filename) {
            console.log("Parsing Binary:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.left.type, block.left, filename);
            this.parse(block.right.type, block.right, filename);
        };

        CodeEngine.prototype.parseIdentifier = function (block, filename) {
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
        };

        CodeEngine.prototype.parseMember = function (block, filename) {
            console.log("Parsing Member", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));

            this.parse(block.object.type, block.object, filename);
            this.parse(block.property.type, block.property, filename);
        };

        CodeEngine.prototype.parseAssignement = function (block, filename) {
            console.log("Parsing Assignment:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.left.type, block.left, filename);
            this.parse(block.right.type, block.right, filename);
        };

        CodeEngine.prototype.parseVariable = function (block, filename) {
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
        };

        CodeEngine.prototype.parseFunction = function (block, filename) {
            console.log("Parsing Function:", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            if (block.id) {
                this.parse(block.id.type, block.id, filename);
            }

            for (var j in block.params) {
                this.parse(block.params[j].type, block.params[j], filename);
            }

            this.parseBody(block.body.body, filename);
        };

        CodeEngine.prototype.parseExpression = function (block, filename) {
            console.log("Parsing Expression", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));
            this.parse(block.type, block, filename);
        };

        CodeEngine.prototype.parseCallExpression = function (block, filename) {
            console.log("Parsing CallExpression", this._editor.getLinePart(block.loc.start.line, block.loc.start.column, block.loc.end.column + 1));

            this.parse(block.callee.type, block.callee, filename);

            for (var a in block.arguments) {
                this.parse(block.arguments[a].type, block.arguments[a], filename);
            }
        };
        return CodeEngine;
    })();
    engine.CodeEngine = CodeEngine;
})(engine || (engine = {}));
//# sourceMappingURL=engine.js.map
