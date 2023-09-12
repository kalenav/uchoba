class HintController {
    _defaultHintText = 'Фигура не выбрана';

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