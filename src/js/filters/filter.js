/**
 * Created by lukas on 22.6.15.
 */

'use strict';

var can = require('can');

var Filter = can.Map.extend({
    counter: 0
},{
    id: null,
    name: null,
    type: null,
    title: null,

    /**
     * @type {string|null}
     */
    _placeHolder: null,

    /**
     * @type {DatagridFiltersConfig}
     */
    filterConfig: null,

    float: 'left',

    /**
     * @type {can.Map}
     */
    viewState: null,

    /**
     * @param {object} config
     * @param {DatagridFiltersConfig} filterConfig
     */
    init: function(config, filterConfig) {

        this._placeHolder = config.attr('placeholder');
        this.attr('filterConfig', filterConfig);
        this.attr('viewState', filterConfig.viewState);

        this.attr('name', config.attr('name'));
        this.type = config.attr('type');
        this.attr('title', config.attr('title'));
        this.attr('id', 'Filter' + Filter.counter++);
    },

    /**
     *
     * @returns {string}
     */
    getTemplateAttr: function(attr) {
        return this.filterConfig.getFilterPath() + this.name + '.' + attr;
    },

    getLabelTemplate: function() {
        if (this.title) {
            return '<label>' + this.title +'</label>';
        } else {
            return '';
        }

    }
});

module.exports = Filter;