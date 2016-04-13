/**
 * Created by lukas on 4.6.15.
 */
'use strict';

var can = require('can');
var Filter = require('./filter');

require('can/construct/super');


var FilterText = Filter.extend({
    float: 'right',

    value: null,

    /**
     * @param {object} config
     * @param {DatagridFiltersConfig} filterConfig
     */
    init: function(config, filterConfig) {

        this._super(config, filterConfig);

        this.attr('value', can.compute(function (newVal) {

            var setting = arguments.length > 0;

            if(setting) {
                if(newVal) {
                    this.viewState.attr(this.name, newVal);

                } else {
                    this.viewState.removeAttr(this.name);
                }

            } else {
                return this.viewState.attr(this.name) || '';
            }

        }, this));

    },

    /**
     *
     * @returns {string}
     */
    getTemplate : function()
    {
        var placeHolder = '';

        if (this._placeHolder) {
            placeHolder = ' placeholder="' + this._placeHolder + '"';
        }

        return  '<input type="text" class="form-control" can-enter="config.closeSearch @element" can-value="config.filtersConfig.filters.' + this.name + '.value"' + placeHolder + ' />' +
                '{{#if config.viewState.' + this.name + '}}' +
                    '<div class="search-clear current-search" can-click="config.clearSearch @element">{{config.filtersConfig.filters.' + this.name + '.value}}<i class="icon-cross-thick"></i></div>' +
                '{{/if}}' +
                '<div class="search-clear" can-click="config.clearSearch @element"><i class="icon-cross"></i></div>';
    }
});

module.exports = FilterText;