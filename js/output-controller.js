/**
 * implements rendering of data
 */


const addElement = (tag, attrs, container, config) => {
    const elt = document.createElement(tag);
    if (attrs) {
        for (let attr in attrs) {
            elt.setAttribute(attr, attrs[attr]);
        }
    }
    if (config) config(elt);
    container.append(elt);
    return elt;
};

const addText = (tag, attrs, text, container) => {
    return addElement(tag, attrs, container, function (elt) {
        elt.textContent = text;
    });
};

/**
 *
 * @param className
 * @param attrs
 * @param {string} src - if provided, will be used to do lazy loading
 * @param container
 * @return {HTMLElement}
 */
const addImg = (src, attrs, container) => {
    return addElement('img', attrs, container, function (elt) {
        // TODO src
    });
};

const addLink = (attrs, content, container) => {
    return addElement('a', attrs, container, function (elt) {
        if (typeof content === 'string') {
            elt.textContent = content;
        } else if (content) {
            elt.append(content)
        }
    });
};

class OutputController {
    constructor (container) {
        this._container = null;
        this._service = null;
    }

    init (container) {
        this._container = container;
        this._loadIndicator = container.querySelector('.load-indicator');
        this._itemsContainer = container.querySelector('.items-container');
    }

    bind (service) {
        this._service = service;
        service.on('data', this.render.bind(this));
    }

    renderItem (item) {
        const itemContainer = addElement(this._itemsContainer, 'item-container', 'div');
        addImg(itemContainer, 'item-cell', item.photo, true);
        const cell = addElement(itemContainer, 'item-cell', 'div');
        addText(cell, '', 'h4', item['last_name'] + ' ' + item['first_name']);
        addLink({href: ''}, '', 'h4', item['last_name'] + ' ' + item['first_name']);
    }

    render (items) {
        var parent = document.createElement("div");
        var p = document.createElement("p");
        parent.append(p);
    }
}
