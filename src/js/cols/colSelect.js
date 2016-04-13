/**
 * Created by lukas on 26.5.15.
 */
    'use strict';

    var can = require('can');


    var ColInput = require('./colInput');

    var ColSelect = ColInput.extend({}, {

        options: null,

        init: function(config) {

            this._super(config);
            this.options = new can.List();
            this._getStaticOptions(config);
        },

        _getStaticOptions: function (config) {
            var configOptions = config['static-option'];
            if(typeof configOptions !== 'undefined') {

                if (!can.isArray(configOptions)) {
                    configOptions = [configOptions];
                }

                var options = [];
                for (var i = 0; i < configOptions.length; i++) {
                    options.push({value: configOptions[i].attr('value'), title: configOptions[i].value()});
                }
                this.options.replace(options);
            }
        },



        /**
         *
         * @returns {string}
         */
        getCellTemplate : function()
        {
            return '<td can-click="colClick" class=""><span>{{col "' + this.name + '" .}}</span></td>';
        },


        colHelper : function(name, entity)
        {
            var objValue = entity.attr(this.name);
            var ret = '-';
            this.options.each(function(val) {
                if (val.value == objValue) { // jshint ignore:line
                    ret = val.title;
                }
            });

            return ret;
        },

        _appendOptionsToInput: function ($input) {
            this.options.each(function(val) {
                $input.append('<option value="'+val.value+'">'+val.title+'</option>');
            });
        },

        onClick : function(entity, $element)
        {
            var self = this;
            var currentValue = entity.attr(this.name);

            var $input = this.edit($element, entity, function(finishFunction){
                var $input = $('<select class="selectpicker" data-width="60px"></select>');

                if (self.initialized === null) {
                    self._appendOptionsToInput($input);
                } else {
                    self.initialized.done(function() {
                        self._appendOptionsToInput($input);
                    });
                }

                $input.val(currentValue);


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

        }
    });

module.exports = ColSelect;