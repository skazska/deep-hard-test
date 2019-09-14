/**
 * implements rendering of data
 */
class OutputController {
    constructor (container) {
        this._container = null;
        this._service = null;
    }

    init (container) {
        this._container = container;
    }

    bind (service) {
        this._service = service;
        service.on('data', this.render.bind(this));
    }

    render (items) {

    }
}
