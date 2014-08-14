/// <reference path="../../../ts/codemirror.d.ts" />

class Editor {
    _code_mirror: CodeMirror.Editor;

    constructor(element: HTMLElement) {
        this._code_mirror = CodeMirror(element);
    }

    setSize(width: number, height: number): void {
        this._code_mirror.setSize(width, height);
    }

    setText(text: string): void {
        this._code_mirror.getDoc().setValue(text);
    }

    setNumberVisible(visible: boolean): void {
        this._code_mirror.setOption('lineNumbers', visible);
    }

    setMode(mode: string): void {
        this._code_mirror.setOption("mode", mode);
    }

    // return code line at num
    // num is 1-based
    getLine(num: number): string {
        if (num > 0)
            return this._code_mirror.getDoc().getLine(num - 1);
        else
            return "";
    }

    getLinePart(line: number, start: number, end: number): string {
        var linestr = this.getLine(line);
        if (linestr != "") {
            return linestr.substring(start, end);
        }
        return "";
    }
}