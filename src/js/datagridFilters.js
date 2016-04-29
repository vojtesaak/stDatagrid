/**
 * Created by lukas on 21.5.15.
 */
'use strict';

var can = require('can');

can.Component.extend({

    template: function(data, helpers) {
        var filters = data.attr('config').filters;
        if (!can.isEmptyObject(filters.attr())) { //There are some filters to render
            var html = '<div class="datagrid-filters">';
            filters.each(function(filter){
                html += '<div class="form-group filter-'+filter.name+'" data-filter-type="' + filter.type + '">' + filter.getLabelTemplate() + filter.getTemplate();
                if (filter.name === 'search') {
                    html += '<button class="icon-search search-input-toggle"></button>';
                }
                html += '</div>'; //end of .form-group
            });
            html += '</div>'; //end of .datagrid-filters
            return can.stache(html)(data, helpers);
        } else {
            return ''; //No filters -> nothing to render
        }
    },

    tag: 'datagrid-filters',

    viewModel: {

        $element: null,

        config: null
    },

    events: {
        init: function(element) {
            this.viewModel.attr('element', can.$(element));
        },

        inserted: function() {
            this.viewModel.config.initFilters(this.viewModel.element);
        },

        '.search-input-toggle click': function() {

            var wrap = $(this.element).find('.filter-search');
            var input = wrap.addClass('open').find('input');

            if (input.is(':visible')) {
                input.focus();
                var val = input.val();
                input.val('').val(val); //We have to clear it first and fill again to move the caret to the end
            }

        }
    },

    helpers: {

        selected: function (fieldName, optionKey) {
            var field = this.config.viewState.attr(fieldName);

            if (field &&
                ((typeof field !== 'object' && field === optionKey)
                    || (typeof field === 'object' && field.indexOf(optionKey) !== -1))) {

                return 'selected';
            } else {
                return '';
            }
        }

    }
});