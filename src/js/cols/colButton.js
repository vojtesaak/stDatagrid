/**
 * Created by lukas on 24.8.15.
 */
'use strict';

var Col = require('./col');

var ColButton = Col.extend({}, {

    placeholder: null,

    init: function(config) {

        this._super(config);
        this.placeholder = config.attr('placeholder');
    },

    /**
     * @returns {string}
     */
    getCellTemplate : function()
    {
        var classAttribute = this._getClassAttribute();
        return '<td ' + classAttribute + '><button class="btn small primary" can-click="colClick">' + this.placeholder + '</button></td>';
    },

    onClick: function (entity, $element, event) {
        $element.trigger('callAction', {
            callback: this.name,
            parameters: [
                entity,
                $element,
                event
            ]
        });
        return false;
    }
});

module.exports = ColButton;