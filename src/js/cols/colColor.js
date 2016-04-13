/**
 * Created by lukas on 26.5.15.
 */

    'use strict';

    var ColInput = require('./colInput');

    var ColColor = ColInput.extend({}, {
        colors: [
            'd57229', 'e7bb12', '842c57', 'af5fb6', '19175b', '1e2c75', '2874aa', '2fa049', '2abb8b'
        ],
        init: function(config) {
            this._super(config);
        },
        /**
         *
         * @returns {string}
         */
        getCellTemplate : function()
        {
            return '<td class="col-color" can-click="colClick"><div class="grid-color-label" style="background-color: {{col \'' + this.name + '\' .}};"></div></td>';
        },

        colHelper : function(name, entity)
        {
            return '#' + entity.attr(this.name);
        },

        onClick : function(entity, $element)
        {
            var self = this;
            var currentValue = entity.attr(this.name);
            var $input = this.edit($element, entity, function(finishFunction){
                var $input = $('<select class="selectpicker" data-width="60px"></select>');
                var colors = self.colors.attr();
                for (var i in colors) {
                    if (colors.hasOwnProperty(i)) {
                        $input.append('<option value="' + colors[i] + '" data-content="<span class=\'select-color-label\' style=\'background-color: #' + colors[i] + '\'></span>">' + colors[i] + '</option>');
                    }
                }
                $input.val(currentValue)
                $input.change(function(){
                    $input.parents('td').find('.selectpicker').selectpicker('destroy');
                    finishFunction.call($input, $input.val());
                });

                $input.hideFunction = function(){
                    $input.parents('td').find('.selectpicker').selectpicker('destroy');
                    finishFunction.call($input);
                };

                return $input;
            });

            if ($input) {
                $input.selectpicker();

                setTimeout(function(){
                    $element.find('button').click();
                }, 0);

                $input.on('hidden.bs.select', function() {
                    $input.hideFunction();
                });
            }

            return false;
        }
    });

module.exports = ColColor;