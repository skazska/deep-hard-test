/**
 * Service provides data
 */
class Service extends EventEmitter {
    constructor () {
        super(['ready', 'start', 'data', 'end']);
        this._dataSource = null;
        this._pending = null;
        this._loaded = 0;
    }

    /**
     * returns dataSource
     * @param {Object} args data source arguments
     * @param {number} [from]
     * @return {UsersDataSource}
     */
    dataSource (args, from) {
        if (typeof args === 'undefined') throw new Error('bad params');

        return new UserDataSource(args, from)
    }

    /**
     * loads data page by page
     * @param {Object} args filter
     * @param {number} count amount
     * @param {number} pack limit
     */
    load (args, count, pack) {
        if (typeof args === 'undefined') throw new Error('bad params');
        if (typeof count === 'undefined') throw new Error('bad params');
        if (typeof count === 'undefined') throw new Error('bad params');

        this.fire('start');
        this._loaded = 0;
        this._dataSource = this.dataSource(args);

        // sequentally query data
        const get = async () => {
            const result = await new Promise((resolve, reject) => {
                this._dataSource.next(pack, (e, items) => {
                    if (e) return reject(e);
                    this._loaded += items.length;
                    resolve(items);
                });
            });

            this.fire('data', [result]);
            if (this._loaded < count && this._dataSource.hasMore()) {
                setTimeout(() => {
                    this._pending = get();
                }, 334);
            } else {
                this.fire('end');
            }
        };

        this._pending = get();
        return this;
    }

}
