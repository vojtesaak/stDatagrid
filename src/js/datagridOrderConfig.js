/**
 * Created by lukas on 22.5.15.
 */

'use strict';

var can = require('can');
var some = require('lodash/collection/some');

var DatagridOrderConfig = can.Map.extend({
    // static

}, {
    colOrder: null,

    viewState: null,

    multiple: false,

    columns: null,

    init: function (viewState, columns, multiple) {


        this.attr('viewState', viewState);

        // todo - if we want to support multiple ordering, we need to handle this:
        //      - default ordering should be propagate to the url or in url should be recorded "not-ordered-with-this-default-column" state
        //      - remove 'false' from the next line :)
        this.attr('multiple', false && !!multiple);
        this.attr('columns', columns);

        var order = viewState.attr('order') || [];
        var self = this;

        if(!order.length) {
            columns.each(function (col) {
                var colOrder = col.order();
                if (typeof colOrder !== 'undefined' && colOrder !== 'default' && !self._isColumnInViewState(col.name)) {
                    order.push({
                        name: col.name,
                        order: col.order()
                    });
                }
            });
        }

        this.attr('colOrder', new can.List(order));

        this._updateColumnsByState();
    },

    _isColumnInViewState: function (name) {
        return some(this.viewState.attr('order'), function (viewStateCol) {
            return viewStateCol.name === name;
        });
    },

    getColOrders: function () {
        return this.colOrder.attr()
    },

    _updateColumnsByState: function () {
        var self = this;
        this.columns.each(function (col) {

            if(col.attr('canBeOrdered')) {
                return;
            }

            var newValue;
            self.colOrder.each(function (item) {
                if(item.name === col.name) {
                    newValue = item.order;
                    return false;
                }
            });
            col.order(newValue || 'default');
        });
    },

    updateColOrder: function (col) {

        var colName = col.name;
        var order = col.setNextOrder();

        if(!this.multiple) {
            this.colOrder.splice(0);
        }

        var spliceKey = -1;
        this.colOrder.each(function (val, key) {
            if (val.name === colName) {
                spliceKey = key;
            }
        });

        if (spliceKey > -1) {
            this.colOrder.splice(spliceKey, 1);
        }

        if (order && order !== 'default') {
            this.colOrder.push({
                name: colName,
                order: order
            });
        }

        this.viewState.attr('order', this.colOrder);
        this._updateColumnsByState();

        can.trigger(this, 'updateOrder');
    }
});

module.exports = DatagridOrderConfig;