class ViewUtils {
    static tag({
        name,
        attributes = {},
        child = null,
        children = [],
        eventListeners = {},
        text = ""
    }) {
        const tag = document.createElement(name);
        for (let attribute in attributes) {
            tag.setAttribute(attribute, attributes[attribute]);
        }
        for (let eventName in eventListeners) {
            tag.addEventListener(eventName, eventListeners[eventName]);
        }
        if (child) tag.appendChild(child);
        children.forEach(child => tag.appendChild(child));
        if (text) {
            tag.append(text);
        }
        return tag;
    }
}