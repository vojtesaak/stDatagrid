/**
 * Created by lukas on 26.5.15.
 */
    'use strict';

    var Col = require('./col');

    var ColInput = Col.extend({}, {

        init: function(config) {
            this._super(config);
        },
        /**
         *
         * @returns {string}
         */
        getCellTemplate : function()
        {
            return '<td class="col-select userchange"><span can-click="colClick" class="text-input-wrap">{{col "' + this.name + '" .}}</span></td>';
        },


        colHelper : function(name, entity)
        {
            return entity.attr(this.name);
        },

        onClick : function(entity, $element)
        {
            var currentValue = this.colHelper(this.name, entity);

            var $input = this.edit($element, entity, function(finishFunction){
                var $input = $('<input>');

                $input.addClass('text tableedit')
                .focusout(function(){
                        finishFunction.call($input, $input.val())
                    })
                .keyup(function (e) {
                    if (e.keyCode === 13) {
                        finishFunction.call($input, $input.val());
                    }

                    if (e.keyCode === 27) {
                        finishFunction.call($input);
                    }
                });

                return $input;
            });

            if ($input) {
                $input.focus().val(currentValue);
            }

            return false;
        },

        edit: function($element, entity, getInput) {
            if (!$element.hasClass('editing')) {
                $element.addClass('editing');

                var name = this.name;

                var finishFunction = function(val) {
                    var self = this;
                    var oldValue = entity.attr(name);

                    if (typeof(val) === 'undefined') {
                        self.unwrap().remove();
                        $element.removeClass('editing');
                    } else {
                        entity.attr(name, val);

                        entity.save().done(function(){
                            self.unwrap().remove();
                            $element.removeClass('editing').addClass('success');
                            setTimeout(function() {
                                $element.removeClass('success')
                            }, 1000);
                        }).fail(function(response){
                            self.unwrap().remove();
                            $element.removeClass('editing').addClass('danger');

                            setTimeout(function() {
                                $element.removeClass('danger');
                            }, 1000);
                            entity.attr(name, oldValue);
                            var messageText = (response.responseJSON && response.responseJSON.error ? ' ('+response.responseJSON.error+')' : response.statusText);
                            $element.trigger('flashMessage', [messageText]);
                        });
                    }
                };
                var $input = getInput(finishFunction);
                $element.append($input);
                $input.wrap('<div class="input-wrap"></div>');

                return $input;
            }

            return null;
        }
    });

module.exports = ColInput;