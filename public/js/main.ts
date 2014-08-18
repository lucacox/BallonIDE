/// <reference path="../../ts/codemirror.d.ts" />
/// <reference path="../../ts/jquery.d.ts" />
/// <reference path="./utils/menu.ts" />
/// <reference path="./code_engine/engine.ts" />
/// <reference path="./editor/editor.ts" />

var _the_editor = null;
var _code_engine = null;
var _menu = null;
var _file = null;
var _edit = null;
var _view = null;
var _help = null;

$(function () {
    var eb = $('#editor');
    _the_editor = new Editor('editor-body');
    _code_engine = new engine.CodeModel();

    _menu = new menu.Menu($('#editor-menu'));
    _file = _menu.addEntry('File');
    _file.addEntry("New File", function () {
        console.log("new file");
    });
    _file.addEntry("---");
    _file.addEntry("Open File...", function () {
        console.log("Open the file!");
    });
    _file.addEntry("Open Folder...", function () {
        console.log("Open the folder!");
    });
    _file.addEntry("---");
    _file.addEntry("Close", function () {
        console.log("Close the file!");
    });

    _edit = _menu.addEntry('Edit');
    _view = _menu.addEntry('View');
    _help = _menu.addEntry('Help');
});