/**
 * Created by davidmenger on 15/07/15.
 */
'use strict';

var can = require('can');
var ColBaseText = require('./colBaseText');
var EntityTranslator = require('../utils/entityTranslator');

var ColEnum = ColBaseText.extend({}, {

    /**
     * @type {string|null}
     */
    defaultValue: null,

    /**
     * @type {EntityTranslator}
     */
    translator: null,

    /**
     * @type {object}
     * @param config
     */
    staticDictionary: null,

    init: function(config) {
        this.attr('defaultValue', '-');
        this._super(config);

        this._getStaticOptions(config);

    },

    _getStaticOptions: function (config) {

        var configOptions = config['static-option'];

        if (typeof configOptions !== 'undefined') {

            if (!can.isArray(configOptions)) {
                configOptions = [configOptions];
            }

            var options = {};
            for (var i = 0; i < configOptions.length; i++) {
                var option = configOptions[i];
                options[option.attr('value')] = option.value();
            }

            this.staticDictionary = options;
        }

    },

    /**
     *
     * @returns {string}
     */
    getCellTemplateContent : function() {

        var left = this.unEscape ? '{{{' : '{{';
        var right = this.unEscape ? '}}}' : '}}';
        var template = left + 'col "' + this.name + '" ' + this.name + right;

        return this.resolveTemplate(template);
    },


    /**
     *
     * @param {string} name
     * @param {can.compute} value
     * @returns {string}
     */
    colHelper: function (name, value) {

        var val = value();

        if(this.staticDictionary && typeof this.staticDictionary[val] !== 'undefined') {
            return this.staticDictionary[val];
        }

        if (this.translator) {
            return this.translator.translate(val);
        }

        return this.defaultValue;
    },

    /**
     *
     * @param {typeof can.Model} entity
     * @param {{}} options
     * @param {string} [defaultValue]
     */
    setOptions: function (entity, options, defaultValue) {

        this.translator = new EntityTranslator(entity, options);

        if (typeof defaultValue !== 'undefined') {
            this.defaultValue = defaultValue;
        }

        return this;
    }


});

module.exports = ColEnum;