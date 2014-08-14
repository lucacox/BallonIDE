/// <reference path="../../../ts/codemirror.d.ts" />
var Editor = (function () {
    function Editor(element) {
        this._code_mirror = CodeMirror(element);
    }
    Editor.prototype.setSize = function (width, height) {
        this._code_mirror.setSize(width, height);
    };

    Editor.prototype.setText = function (text) {
        this._code_mirror.getDoc().setValue(text);
    };

    Editor.prototype.setNumberVisible = function (visible) {
        this._code_mirror.setOption('lineNumbers', visible);
    };

    Editor.prototype.setMode = function (mode) {
        this._code_mirror.setOption("mode", mode);
    };

    // return code line at num
    // num is 1-based
    Editor.prototype.getLine = function (num) {
        if (num > 0)
            return this._code_mirror.getDoc().getLine(num - 1);
        else
            return "";
    };

    Editor.prototype.getLinePart = function (line, start, end) {
        var linestr = this.getLine(line);
        if (linestr != "") {
            return linestr.substring(start, end);
        }
        return "";
    };
    return Editor;
})();
//# sourceMappingURL=editor.js.map
