/**
 * Created by lukas on 22.5.15.
 */

'use strict';

var can = require('can');
var FilterFactory = require('./filters/filterFactory');

var DatagridFiltersConfig = can.Map.extend({
    // static

},{

    /**
     * @type {can.Map}
     */
    filters: null,

    viewState: null,

    _unbindViewState: null,

    init: function(filters, viewState) {
        this.attr('filters', new can.Map({}));
        this.attr('viewState', viewState);
        this.attr('_destroyCallbacks', []);


        filters.forEach(function (filterDefinition) {

            var filterName = filterDefinition.attr('name');

            var filter = FilterFactory.createFilter(filterDefinition, this);
            this.filters.attr(filterName, filter);

        }, this);


        var self = this;
        var onViewStateChange = function (event, attrName) {
            if(self.filter(attrName) && viewState.attr('page')) {
                viewState.removeAttr('page');
            }
        };
        viewState.bind('change', onViewStateChange);
        this._unbindViewState = function () {
            viewState.unbind('change', onViewStateChange);
        };
    },

    clearFilters: function () {
        var self = this;
        can.each(this.attr('filters'), function (filter, name) {
            self.viewState.removeAttr(name);
        });
    },

    getFilterPath: function() {
        return 'config.filters.';
    },

    /**
     *
     * @returns {can.Map}
     */
    getState: function() {
        var state = {};
        var viewState = this.viewState;

        can.each(this.filters, function(filter, name) {
            var val = viewState.attr(name);
            if (val) {
                state[name] = val;
            }
        });

        return new can.Map(state);
    },

    initFilters : function(element) {
        this.filters.each(function(filter) {
            if (typeof(filter.initFilter) === 'function') {
                filter.initFilter(element);
            }
        });
    },

    filter : function(name) {
        return this.filters.attr(name);
    },

    /**
     *
     * @param {Array} intoArray
     */
    collectInitializationPromises: function (intoArray) {
        this.filters.each(function (filter) {
            if (filter.initialized !== null) {
                intoArray.push(filter.initialized);
            }
        });
    },

    destroy: function () {
        this._unbindViewState();
    }
});

module.exports = DatagridFiltersConfig;