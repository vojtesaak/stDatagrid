/**
 * Created by Václav Oborník on 23. 9. 2015.
 */
'use strict';

var Col = require('./col');
var templateHelpers = require('../utils/templateHelpers');

var ColLink = Col.extend({}, {

    placeholder: null,

    format: null,

    init: function(config) {

        this._super(config);
        this.placeholder = config.attr('placeholder');
        this.format = config.attr('format');
    },

    /**
     *
     * @returns {string}
     */
    getCellTemplate : function()
    {
        return '<td>{{{col \'' + this.name + '\' . \'' + this.format + '\'}}}</td>';
    },

    colHelper : function(name, entity, format)
    {
        var date = entity.attr(name);
        return templateHelpers.dateFormatter(date, format);
    }
});

module.exports = ColLink;