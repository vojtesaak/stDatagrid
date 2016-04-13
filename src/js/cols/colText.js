/**
 * Created by lukas on 26.5.15.
 */

'use strict';

var ColBaseText = require('./colBaseText');

var ColText = ColBaseText.extend({}, {

    init: function(config) {
        this._super(config);
    },
    /**
     *
     * @returns {string}
     */

    getCellTemplateContent : function() {

        var template = this._super();
        return this.resolveTemplate(template)
    }

});

module.exports = ColText;