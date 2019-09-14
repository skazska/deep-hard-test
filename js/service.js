/**
 * DataSource implementation to get bunch of vk users
 */
class UsersDataSource extends DataSource {
    /**
     * @param {Object} args filter
     * @param {number} [count] default limit
     * @param {number} [from] starting offset
     */
    constructor (args, count, from) {
        super(args, count, from);
        this._total = 0;
        this._loaded = 0;

    }
    /**
     * @abstract
     * @protected
     * resolves to items list
     * @param {Object} [params] query arguments
     * @param {number} [count] items count to return
     * @param {number} [from] result's starting position
     * @return {Promise<string>}
     */
    query (params, count, from) {
        return new Promise((resolve, reject) => {
            VK.Api.call('users.search', {
                birth_day: params.day,
                birth_month: params.month,
                birth_year: params.year,
                offset: from || 0,
                count: count,
                v:"5.73"
            }, function(r) {
                if(r.response) {
                    alert('Привет, ' + r.response[0].first_name);
                }
            });
        });

    }

    /**
     * returns true if there is more data
     * @return {boolean}
     */
    hasMore () {
        return this._from < this._total;
    }

}

/**
 * Service provides data
 */
class Service extends EventEmitter {
    constructor () {
        super(['ready', 'start', 'data', 'end']);
        this._dataSource = null;
        this._pending = null;
    }

    /**
     * returns dataSource
     * @param {Object} args data source arguments
     * @param {number} [count]
     * @param {number} [from]
     * @return {UsersDataSource}
     */
    dataSource (args, count, from) {
        return new UsersDataSource(args, count || 20)
    }

    /**
     * loads data page by page
     * @param {Object} args filter
     * @param {number} [count] amount
     * @param {number} [pack] limit
     */
    load (args, count, pack) {
        this.fire('start');
        this._dataSource = this.dataSource(args, pack || 50);

        const get = async () => {
            const result = await this._dataSource.next();
            this.fire('data', [result]);
            if (this._loaded < count && this._dataSource.hasMore()) {
                this._pending = get();
            } else {
                this.fire('end');
            }
        };

        this._pending = get();
        return this;
    }

}
