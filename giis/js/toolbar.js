const toolbarModule = (function () {
    class Button {
        constructor(label, callback) {
            this._label = label;
            this._callback = callback;
        }

        get label() {
            return this._label;
        }

        get callback() {
            return this._callback;
        }
    }

    class Section {
        constructor(label, buttons) {
            this._label = label;
            this._buttons = [...buttons];
        }

        get label() { return this._label; }

        get buttons() { return [...this._buttons]; }

        getHtmlElem() {
            const sectionElem = document.createElement('section');
            sectionElem.classList.toggle('toolbar-section');

            const sectionHeader = document.createElement('header');
            sectionHeader.append(this._label);
            sectionElem.appendChild(sectionHeader);

            const sectionMain = document.createElement('main');
            this._buttons.forEach(button => {
                const buttonElem = document.createElement('button');
                buttonElem.innerHTML = button.label;
                buttonElem.onclick = button.callback;
                sectionMain.appendChild(buttonElem);
            });
            sectionElem.appendChild(sectionMain);

            return sectionElem;
        }
    }

    class ToolbarController {
        constructor(sections, toolbarElemId = 'toolbar') {
            this._toolbarRef = document.getElementById(toolbarElemId);
            this._sections = [...sections];
            this._render();
        }

        _render() {
            this._toolbarRef.innerHTML = '';
            this._sections.forEach(section => this._toolbarRef.appendChild(section.getHtmlElem()));
        }
    }

    return {
        Button,
        Section,
        ToolbarController
    }
})();

const Button = toolbarModule.Button;
const Section = toolbarModule.Section;