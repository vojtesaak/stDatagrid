/**
 * Created by lukas on 22.5.15.
 */

    'use strict';

    var can = require('can');

    var DatagridPaginationConfig = can.Map.extend({
        // static

    },{
        hasNextPage: false,

        hasPrevPage: false,

        pageCount: 0,

        realPage: null,

        /**
         * @type {can.Map}
         */
        state: null,

        isShown: false,

        init: function(state) {
            this.attr('state', state);
        },

        /**
         *
         * @returns {number}
         * @private
         */
        _getViewPage: function () {
            return parseInt(this.state.attr('page'), 10) || 0;
        },

        update: function(updateConfig) {
            this.attr('hasNextPage', updateConfig.hasNextPage);

            if (this._getViewPage() === 0) {
                this.attr('hasPrevPage', false);
            } else {
                this.attr('hasPrevPage', true);
            }

            this.attr('pageCount', updateConfig.pageCount);

            this.attr('isShown', this.attr('hasNextPage') || this.attr('hasPrevPage') ? true : false );

            this.realPage = updateConfig.page;
        },
        nextPage: function() {
            if (this.hasNextPage) {
                this.state.attr('page', this._getViewPage() + 1);
            }
        },
        prevPage: function() {
            if (this.hasPrevPage) {
                var page = this.realPage - 1;
                if (page < 0) {
                    page = 0;
                }

                this.state.attr('page', page);
            }
        },

        firstPage: function() {
            if (this.hasPrevPage) {
                this.state.attr('page', 0);
            }
        },

        lastPage: function() {
            if (this.hasNextPage) {
                this.state.attr('page', -1);
            }
        }


    });

module.exports = DatagridPaginationConfig;