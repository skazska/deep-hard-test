/**
 * implements rendering of data
 */


/**
 * creates and attach HTMLElement to parent Node
 * @param {string} tag
 * @param {Object} attrs
 * @param {HTMLElement} container
 * @param {function} [config] element configurator function to do additional config before append
 * @return {HTMLElement}
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

/**
 * creates and attach HTMLElement with text to parent Node
 * @param {string} tag
 * @param {Object} attrs
 * @param {string} text
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
const addText = (tag, attrs, text, container) => {
    return addElement(tag, attrs, container, function (elt) {
        elt.textContent = text;
    });
};

/**
 * creates and attach img HTMLElement to parent Node
 * @param {Object} attrs
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
const addImg = (attrs, container) => {
    return addElement('img', attrs, container);
};

/**
 * creates and attach <a> HTMLElement with content to parent Node
 * @param attrs
 * @param content
 * @param container
 * @return {HTMLElement}
 */
const addLink = (attrs, content, container) => {
    return addElement('a', attrs, container, function (elt) {
        if (typeof content === 'string') {
            elt.textContent = content;
        } else if (content) {
            elt.append(content)
        }
    });
};

const threshold = (func, delay) => {
    let tm = null;
    return () => {
        if (tm) {
            clearTimeout(tm);
        }
        tm = setTimeout(() => {
            tm = null;
            func();
        }, delay);
    }
};

/**
 * controls output rendering
 */
class OutputController {
    constructor (container) {
        this._container = null;
        this._service = null;
        this._loadIndicator = null;
        this._itemsContainer = null;
        this._avatarsToLoad = [];
        this._itemCounter = 0;
        this._lazyLoad = null;
    }

    init (container) {
        this._container = container;
        this._loadIndicator = container.querySelector('.load-indicator');
        this._itemsContainer = container.querySelector('.items-container');
    }

    /**
     * binds to data service
     * @param service
     */
    bind (service) {
        this._service = service;
        service.on('data', this.render.bind(this));
    }

    /**
     * renders 1 item
     * @param item
     */
    renderItem (item) {
        const itemContainer = addElement(
            'div',
            {class: 'item-container', 'data-img': item['photo']},
            this._itemsContainer
        );
        const cell1 = addElement('div', {class: 'item-cell-1 lazy'}, itemContainer);
        const img = addImg({}, cell1);

        const cell2 = addElement('div', {class: 'item-cell-2'}, itemContainer);
        addText('h4',{}, item['last_name'] + ' ' + item['first_name'], cell2);
        const link = 'https://vk.com/id' + item['id'];
        addLink({href: link}, link, cell2);


        // collect items to be processed by lazy image loader
        this._avatarsToLoad.push({
            position: this._itemCounter,
            src: item.photo,
            element: img,
            container: itemContainer,
            loaded: false
        });
        this._itemCounter += 1;
    }

    render (items) {
        for (let item of items) {
            this.renderItem(item);
        }

        // turn on scroll/resize monitor for lazy load
        if (!this._lazyLoad) {
            this.lazyLoadOn();
            // lazy load first page images
            this._lazyLoad();
        }
    }

    /**
     * turns on scroll/resize monitor
     */
    lazyLoadOn() {
        this._lazyLoad = threshold(this.checkLoadAvatars.bind(this), 500);

        this._container.addEventListener("scroll", this._lazyLoad);
        window.addEventListener("resize", this._lazyLoad);
        window.addEventListener("orientationchange", this._lazyLoad);
    }

    /**
     * turns off scroll/resize monitor
     */
    lazyLoadOff() {
        this._container.removeEventListener("scroll", this._lazyLoad);
        window.removeEventListener("resize", this._lazyLoad);
        window.removeEventListener("orientationchange", this._lazyLoad);
        this._lazyLoad = null;
    }

    /**
     * does load avatars, in current view
     */
    checkLoadAvatars () {
        if (this._avatarsToLoad.length === 0) return this.lazyLoadOff();

        // items rect
        const itemView = this._avatarsToLoad[0].container.getBoundingClientRect();
        // view rect
        const view = this._container.getBoundingClientRect();
        // scrolled rect
        const itemsView = this._itemsContainer.getBoundingClientRect();

        // define avatars to load by evaluating visibility of item based on item's height an serial
        const itemHeight = itemView.bottom - itemView.top;
        const toLoad = this._avatarsToLoad.filter((avatar) => {
            const itemTop = itemsView.top + avatar.position * itemHeight;
            return itemTop < view.bottom && (itemTop + itemHeight) > view.top;
        });

        // set scr's (init loading)
        toLoad.forEach((avatar) => {
            avatar.element.src = avatar.src;
            avatar.container.classList.remove("lazy");
            avatar.loaded = true;
        });

        if (toLoad.length === this._avatarsToLoad.length) {
            // if processed count equal all unloaded (before) - it's done
            this._avatarsToLoad = [];
            this.lazyLoadOff();
        } else {
            // filter out loaded avatars
            this._avatarsToLoad = this._avatarsToLoad.filter(avatar => !avatar.loaded);
        }
    }
}
