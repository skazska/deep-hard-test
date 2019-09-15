// es5 style

/**
 * @abstract
 * provides DataSource interface
 * to work with list data
 */
var DataSource = extendKlass(
    Klass,
    /**
     * @param {Object} [args] query arguments
     * @param {number} [from] result's starting position
     */
    function (args, from) {
        this._arguments = args || {};
        this._from = from || 0;
    },
    {
        /**
         * @abstract
         * @protected
         * resolves to items list
         * @param {Object} args query arguments
         * @param {number} count result items count
         * @param {number} from result's starting position
         * @param {function} callback
         * @return {Promise<string>}
         */
        query: function (args, count, from, callback) {
            throw new Error('not implemented');
        },

        /**
         * returns true if there is more data
         * @return {boolean}
         */
        hasMore: function () {
            throw new Error('not implemented');
        },

        /**
         * resolves next count items
         * @param {number} count - count
         * @param {function} callback
         */
        next: function (count, callback) {
            const result = this.query(this._arguments, count, this._from, callback);
            this._from += count;
            return result;
        }
    }
);
