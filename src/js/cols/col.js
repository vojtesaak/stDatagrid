/**
 * Created by davidmenger on 19/02/15.
 */

    'use strict';

    var can = require('can');
    require('can/construct/super');

    var CELL_CLASS_MATCH = /^<(td|th)\s([^>]*)class=("|')([^"']*)("|')/i;
    var START_TD_REPLACE = /^<(td|th)([^>]*)/i;

    var Col = can.Map.extend({
        name: null,
        helper: null,
        header: null,
        unEscape: null,
        order: null,
        orders: ['asc', 'desc' /*, 'default'*/],
        canBeOrdered: null,
        className: null,
        style: null,

        /**
         * @type {can.Deferred}
         */
        initialized: null,
        alwaysVisible: false,

        init: function(config) {
            this.name = config.attr('name');
            this.helper = config.attr('helper');
            this.header = config.attr('title');
            this.unEscape = config.attr('unescape');
            this.canBeOrdered = !!config.attr('order');
            this.order = can.compute(config.attr('order'));
            this.className = config.attr('class');
            this.target = config.attr('target');

            if (typeof(config.attr('always-visible')) !== 'undefined' && config.attr('always-visible') === 'true') {
                this.attr('alwaysVisible', true);
            }
        },
        /**
         *
         * @returns {string}
         */
        getHeaderTemplate : function()
        {
            var classAttribute = this._getClassAttribute();

            if (this.canBeOrdered) {
                return '<th ' + classAttribute + '><a can-click="orderClick">' + this.header + '</a>{{{order "' + this.name + '"}}}</th>';
            } else {
                return '<th ' + classAttribute + '>' + this.header + '</th>'
            }
        },

        _getClassAttribute: function () {
            return this.className ? 'class="' + this.className + '" ' : '';
        },

        _getStyleAttribute: function () {
            return  this.style  ? 'style="' + this.style + '" ' : '';
        },

        getCellTemplateContent: function() {

            var contentTpl = '';
            var left = this.unEscape ? '{{{' : '{{';
            var right = this.unEscape ? '}}}' : '}}';

            if (this.helper){
                contentTpl = left + this.helper + ' ' + this.name + ' "' + this.name + '" .' + right;
            } else {
                contentTpl = left + this.name + right;
            }
            return contentTpl;
        },


        /**
         *
         * @returns {string}
         */
        getCellTemplate : function() {
            var classAttribute = this._getClassAttribute();
            var styleAttribute = this._getStyleAttribute();
            return '<td can-click="colClick" ' + classAttribute + ' ' + styleAttribute +'>' + this.getCellTemplateContent() + '</td>';
        },


        setNextOrder : function()
        {
            if (this.order()) {
                var orderIndex = this.orders.indexOf(this.order());
                this.order(this.orders[(orderIndex + 1) % this.orders.length]);
            }

            return this.order();
        },

        setOrder : function(order)
        {
            this.order(order);
        },

        wrapVisibilityHelper : function(cellCode)
        {
            if (this.alwaysVisible && cellCode.match(CELL_CLASS_MATCH)) {
                return cellCode.replace(CELL_CLASS_MATCH, '<$1 $2class="$4 alws"');
            } else if (this.alwaysVisible) {
                return cellCode.replace(START_TD_REPLACE, '<$1$2 class="alws"');
            } else {
                var prefix = '{{#unless config.visibleForm}}';
                var postfix = '{{/unless}}';
                return prefix + cellCode + postfix;
            }
        }
    });

module.exports = Col;