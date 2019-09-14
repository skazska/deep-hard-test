class OutputController {
    constructor (container) {
        this._container = container;
        this._dataSource = null;
    }

    bind (dataSource) {
        this._dataSource = dataSource;
        dataSource.on('data', this.render.bind(this));
    }

    render (items) {

    }
}
