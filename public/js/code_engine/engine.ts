/// <reference path="../../../ts/ace.d.ts" />

module engine {

    export enum Type {
        variable,
        func,
        enumeration,
        object
    }

    export interface Inspector {
        name(): string;
        supportMode(mode: string): boolean;
        inspect(session: AceAjax.IEditSession): CodeObject[];
    }

    export class JavaScriptInspector implements Inspector {
        name(): string {
            return "JavaScriptInspector";
        }
        supportMode(mode: string): boolean {
            return (mode == "ace/mode/javascript");
        }

        inspect(session: AceAjax.IEditSession): CodeObject[] {
            var objs = [];
            var lines = session.getLines(0, session.getLength() - 1);
            var obj = new JavaScriptObj();
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i];
                console.log("Parsing line:", line);
                var tk: AceAjax.TokenInfo[] = session.getTokens(i);
                for (var j = 0; j < tk.length; ++j) {
                    console.log(tk[j]);
                    var type = tk[j].type;
                    switch (type) {
                        case "comment":
                            continue;

                        case "storage.type":
                            break;
                        case "text":
                            break;
                        case "identifier":
                            break;
                        case "punctuation.operator": // . , ; 
                            break;
                        case "keyword.operator":     // =
                            break;
                        case "keyword":              // for, if, while, etc...
                            break;
                        case "paren.lparen":
                            break;
                        case "paren.rparen":
                            break;
                        case "support.function":
                            break;
                        case "entity.name.function":
                            break;
                    }
                }
            }
            return objs;
        }
    }

    export interface CodeObject {
        type: Type;
    }

    export class JavaScriptObj implements CodeObject {
        type: Type;

        constructor() {

        }
    }

    export class CodeModel {
        _session: AceAjax.IEditSession;
        _inspectors: Inspector[] = [];

        constructor() {
            this._inspectors.push(new JavaScriptInspector());
        }

        inspect(session: AceAjax.IEditSession): CodeObject[]{
            var mode = session.getMode().$id;
            console.log("Session mode: " + mode);
            for (var i = 0; i < this._inspectors.length; ++i) {
                console.log(" checking inspector: " + this._inspectors[i].name());
                if (this._inspectors[i].supportMode(mode)) {
                    return this._inspectors[i].inspect(session);
                }
            }
            return [];
        }
    }
}