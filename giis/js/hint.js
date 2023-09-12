class HintController {
    _defaultHintText = 'Режим не выбран';

    constructor(hintElemId = 'hint') {
        this._hintElem = document.getElementById(hintElemId);
        this.resetHint();
    }

    setHintText(text) {
        this._hintElem.innerHTML = text;
    }

    resetHint() {
        this.setHintText(this._defaultHintText);
    }
}