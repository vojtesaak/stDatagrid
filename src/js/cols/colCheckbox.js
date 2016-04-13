/**
 * Created by lukas on 26.5.15.
 */

    'use strict';

    var Col = require('./col');

    var ColCheckbox = Col.extend({}, {

        init: function(config) {
            this._super(config);
        },
        /**
         *
         * @returns {string}
         */
        getCellTemplate : function()
        {
            return '<td can-click="colClick" class="col-checkbox userchange">'
            + '<input type="checkbox" class="small" {{#if '+this.name+'}}checked="checked"{{/if}} /><label></label>'
            + '</td>';
        },

        onClick : function(entity, $element)
        {
            if (!$element.hasClass('info')) {
                $element.addClass('info');
                var oldValue = entity.attr(this.name);
                entity.attr(this.name, !oldValue);
                entity.save()
                    .fail(function() {
                        entity.attr(this.name, oldValue);
                        $element.removeClass('info').addClass('cb-danger');
                        setTimeout(function() {
                            $element.removeClass('cb-danger');
                        }, 1000);
                    })
                    .done(function() {
                        $element.removeClass('info').addClass('cb-success');
                        setTimeout(function() {
                            $element.removeClass('cb-success');
                        }, 1000);
                    });
            }
        }
    });

module.exports = ColCheckbox;