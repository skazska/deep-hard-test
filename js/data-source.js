/**
 * @abstract
 * provides DataSource interface
 * to work with list data
 */
class DataSource {
    /**
     * @param {Object} [args] query arguments
     * @param {number} [count] items count to return
     * @param {number} [from] result's starting position
     */
    constructor (args, count, from) {
        this._arguments = args || {};
        this._from = from || 0;
        this._count = count || 10;
    }

    /**
     * @abstract
     * @protected
     * resolves to items list
     * @param {Object} [args] query arguments
     * @param {number} [count] items count to return
     * @param {number} [from] result's starting position
     * @return {Promise<string>}
     */
    query (args, count, from) {
        throw new Error('not implemented');
    }

    /**
     * returns true if there is more data
     * @return {boolean}
     */
    hasMore () {
        throw new Error('not implemented');
    }

    /**
     * resolves next count items
     * @param {number} [count] - count
     * @return {Promise<*[]>}
     */
    async next(count) {
        if (!count) count = this._count;
        const result = await this.query(this._arguments, this._from, count);
        this._from += count;
        return result;
    }
}
