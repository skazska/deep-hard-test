/**
 * кастомный эмиттер событий
 */
class EventEmitter {
    /**
     * @param {string[]} events event names
     */
    constructor (events) {
        this.initEvents(events);
    }

    /**
     * inits event handlers storage
     * @param {string[]} events
     */
    initEvents (events) {
        this._events = {};
        for (let event in events) {
            this._events[event] = new Set();
        }
    }

    /**
     * registers event handler
     * @param {string} event
     * @param {function} handler
     */
    on (event, handler) {
        if (typeof handler !== "function") throw new Error('handler is not executable');
        if (this._events[event]) {
            this._events[event].add(handler);
        }
    }

    /**
     * unregisters event handler
     * @param {string} event
     * @param {function} handler
     * @return boolean
     */
    off (event, handler) {
        if (this._events[event]) {
            return this._events[event].delete(handler);
        }
        return false;
    }

    /**
     * runs handlers for event
     * @param {string} event
     * @param {*[]} [args]
     */
    fire (event, args) {
        if (this._events[event]) {
            for (let handler in this._events[event]) {
                handler.apply(this, args || []);
            }
        }
    }
}
