// es5 style
/**
 * DataSource implementation to get bunch of vk users
 *
 */
var UserDataSource = extendKlass(
    DataSource,
    /**
     * @param {Object} args filter
     * @param {number} [from] starting offset
     */
    function (args, from) {
        DataSource.call(this, args, from);
        this._total = 0;
    },
    {
        /**
         * @abstract
         * @protected
         * resolves to items list
         * @param {Object} params query arguments
         * @param {number} count items count to return
         * @param {number} from result's starting position
         * @param {function} callback
         */
        query: function (params, count, from, callback) {
            const processResponse = (r) => {
                this._total = r.response.count;
                callback(null, r.response.items);
            };

            return setTimeout(function() {
                processResponse({
                    response: {
                        count: 50,
                        items: [
                            {id: 138809483, first_name: "Сергей", last_name: "Клюкин", photo: "https://pp.vk.me/AkqsO4hmy0rfmrnx5UuCFVobz4RjfyNBpVJYrw/l2Ch8Yb-7ic.jpg"},
                            {id: 3769628, first_name: "Евгений", last_name: "Ерофеев", photo: "https://pp.vk.me/c633631/v633631936/2aaf3/Li17Zr1vR6I.jpg"},
                            {id: 110908486, first_name: "Аня", last_name: "Лебедева", photo: "https://pp.vk.me/c636529/v636529430/5b5c/OzC5gUYfGxE.jpg"},
                            {id: 138809483, first_name: "Сергей", last_name: "Клюкин", photo: "https://pp.vk.me/AkqsO4hmy0rfmrnx5UuCFVobz4RjfyNBpVJYrw/l2Ch8Yb-7ic.jpg"},
                        ]
                    }
                });
            }, 300);

            try {
                VK.Api.call('users.search', {
                    birth_day: params.day,
                    birth_month: params.month,
                    birth_year: params.year,
                    fields: 'photo,screen_name',
                    offset: from,
                    count: count,
                    v:"5.73"
                }, processResponse);
            } catch (e) {
                callback(e);
            }

        },

        /**
         * returns true if there is more data
         * @return {boolean}
         */
        hasMore: function () {
            return this._from < this._total;
        }
    }
);
