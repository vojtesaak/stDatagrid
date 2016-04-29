/**
 * Created by lukas on 4.6.15.
 */

'use strict';

var Filter = require('./filter');

require('bootstrap-js/dropdown');
require('bootstrap-select-js');
//require('bootstrap-select-less/bootstrap-select.less!');

var can = require('can');
var Select = require('../utils/select');

var FilterSelect = Filter.extend({
    select: null,
    config: null,
    selectReady: null,

    data: null,
    modelParams: null,
    defaultValue: null,

    init : function(config, parent)
    {
        this._super(config, parent);

        this.attr('config', config);
        this.attr('selectReady', new can.Deferred());
    },

    /**
     *
     * @returns {string}
     */
    getTemplate: function() {

        var isSelected = this.getTemplateAttr('viewState') + '.' + this.name;
        var wrapperSelectedClass = '{{#if '+ isSelected + '}} items-selected{{/if}}';

        var html = '';
        html +=         '<div class="select-wrapper ' + wrapperSelectedClass + '">';
        html +=             '<select id="{{config.filters.' + this.name + '.id}}" multiple class="form-control"' + '></select>';
        html +=             '{{#if '+ isSelected + '}}';
        html +=                 '<span class="select-remove-filter icon-cross-thick" can-click="config.filters.' + this.name + '.reset"></span>';
        html +=             '{{/if}}';
        html +=         '</div>';

        return html;
    },

    reset: function () {
        this.viewState.removeAttr(this.name);
        this.resetOptions();
    },

    /**
     *
     * @param {element} el
     */
    initFilter: function(el) {
        var self = this;
        var $input = can.$(el).find('#'+this.id);

        if ($input.length > 0) {
            var compute = this.createComputedValue();

            compute.bind('change', function () {
                self.select.setValue(compute);
            });

            this.selectReady.then(function () {
                self.resetOptions();
                self.select.setValue(compute);
            });

            if (!this.select) {
                var select = new Select(this.config, {
                    noneSelectedText: this._placeHolder
                });
                select.setForElement($input);
                this.attr('select', select);
                this.selectReady.resolve();
            }
        }
    },

    /**
     * @param {Promise|object|Model} data
     * @param {object} [modelParams]
     * @param {string} [defaultValue]
     */
    setOptions: function (data, modelParams, defaultValue) {
        this.data = data;
        this.modelParams = modelParams;
        this.defaultValue = defaultValue;
    },

    createComputedValue: function () {
        return new can.compute(function (newValue) {

            var setting = arguments.length > 0;
            if(setting) {
                if(newValue) {
                    this.viewState.attr(this.name, newValue);
                } else {
                    this.viewState.removeAttr(this.name);
                }

            } else {
                return this.viewState.attr(this.name);
            }

        }, this);
    },

    refresh: function () {
        var compute = this.createComputedValue();
        this.select.setValue(compute);
    },

    resetOptions: function () {
        if (this.modelParams) {
            this.modelParams.dataValueField = this.name;
        }

        this.select.setOptions(this.data, this.modelParams, this.defaultValue);
    }

});

module.exports = FilterSelect;