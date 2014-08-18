/// <reference path="../../../ts/ace.d.ts" />

class Editor {
    
    _editor: AceAjax.Editor;
    _session: AceAjax.IEditSession;

    constructor(element: string) {
        this._editor = ace.edit(element);
        this._session = this._editor.getSession();
    }

    setText(text: string): void {
        this._session.setValue(text);
    }

    setMode(mode: string): void {
        this._session.setMode('ace/mode/' + mode);
    }
}
