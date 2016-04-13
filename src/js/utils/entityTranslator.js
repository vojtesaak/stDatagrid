/**
 * Created by Václav Oborník on 11. 12. 2015.
 */

'use strict';


var can = require('can');
var indexBy = require('lodash/collection/indexBy');
var omit = require('lodash/object/omit');
var assign = require('lodash/object/assign');

var EntityTranslator = can.Map.extend({

}, {

    _collecting: false,

    /**
     * @type {can.Model|Object}
     */
    _provider: null,

    /**
     * @type {null|{
     *      textPicker: Function
     *      fields: string
     * }}
     */
    _options: null,

    _dictionary: null,

    _bufferedValues: null,

    init: function (provider, options) {
        this.attr('_dictionary', new can.Map());
        this.attr('_bufferedValues', new can.Map());
        this._setProvider(provider, options);
    },

    /**
     * @param {typeof can.Model} provider
     * @param {{
     *      textPicker?: Function
     *      fields?: string|string[]
     * }} [options]
     */
    _setProvider: function (provider, options) {
        this._provider = provider;
        this._options = options || null;
    },

    startCollecting: function () {
        this.attr('_collecting', true);
    },

    startTranslating: function () {
        this._translateCollectedValues();
        this.attr('_collecting', false);
    },

    /**
     *
     * @param {function|*} value
     * @returns {*} - the evaluated value
     */
    _getOrEval: function (value) {
        if(typeof value === 'function') {
            return value();
        }
        return value;
    },

    /**
     * @param {string|can.Compute} value
     * @returns {string|can.Compute}
     */
    translate: function (value) {

        value = this._getOrEval(value);

        if(value === '') {
            return '';
        }

        if(value === null) {
            value = 'null';
        }

        var translation = this.attr('_dictionary.' + value);
        if(translation === null) { // translations had failed, we don't want to try it again
            return value;
        }

        if(typeof translation !== 'undefined') {
            return this._getOrEval(translation);
        }

        if(this._collecting) { // NOTE we don't want to access _collecting via attr()!
            this.attr('_bufferedValues.' + value, true);

        } else if(this._provider) {
            this._translateWithModel([value]);
        }

        return value;
    },

    _translateCollectedValues: function () {

        if(!this._provider) {
            return;
        }

        var values = can.Map.keys(this.attr('_bufferedValues'));
        if (values.length > 0) {
            this._translateWithModel(values);
            this.attr('_bufferedValues', {});
        }
    },

    /**
     * @param values
     */
    _translateWithModel: function (values) {

        if(!this._provider) {
            return;
        }

        var query = assign({ limit: 0 }, omit(this._options, ['textPicker']));
        query[this._provider.id] = values;

        var self = this;

        this._provider.findAll(query).then(function (entities) {
            var translations = {};

            var entityMap = indexBy(entities.attr(''), self._provider.id);

            can.each(values, function (value) {

                var entity = entityMap[value];

                var translation = null; // note we need to also register not translated values
                if(typeof entity !== 'undefined') {
                    translation = self._makeTranslation(entity);
                }

                translations[value] = translation;
            });
            self._dictionary.attr(translations, false);
        });
    },

    /**
     * @param {can.Map|string} translatedValue
     * @returns {string|Function} - translation can be text or can.compute getter which returns text
     */
    _makeTranslation: function (translatedValue) {

        if(typeof translatedValue === 'string') {
            return translatedValue;

        } else if(typeof this._options.textPicker === 'function') {
            return can.compute(function () {
                return this._options.textPicker(translatedValue);
            }, this);

        } else if(typeof this._options.fields === 'string') {
            return translatedValue.compute(this._options.fields);

        } else {
            return can.compute(function () {
                var ret = [];
                if(this._options.fields.length) {
                    for (var i = 0; i < this._options.fields.length; i++) {
                        var fieldName = this._options.fields[i];
                        ret.push(translatedValue.attr(fieldName));
                    }
                }
                return ret.join(' ');
            }, this);
        }
    }


});

module.exports = EntityTranslator;
