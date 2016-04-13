/**
 * Created by davidmenger on 19/02/15.
 */

'use strict';

var can = require('can');
require('./datagridTable');
//require('stform');

can.Component.extend({

    tag: 'datagrid',

    title: 'DG',

    template: function (data, options) {


        // fetch a subtemplate content from datagrid tag
        var fragment = document.createDocumentFragment();
        var element = document.createElement('div');
        fragment.appendChild(element);

        options.attr('tags').content(element, {
            scope: data,
            options: options
        });

        if (data.attr('embedded') === 'true' ) {
            data.attr('config.embedded', true);
        }

        data.attr('config').processControlDocumentFragment(fragment);

        var classes = 'datagrid-layout';
        classes += ' {{#if config.visibleForm}}collapsed{{/if}}';
        classes += ' {{#if config.embedded}}embedded{{/if}}';
        classes += ' {{#if config.formConfig}}has-form{{/if}}';

        var html = '<div class="' + classes + '">';

        html +=    '<div class="datagrid-header"><h4>{{title}}</h4>';
        html += '{{#if config.allowInsert}}<button can-click="showInsertForm" class="btn small right primary insert">Insert</button>{{/if}}';

        data.attr('config').actions.each(function(action) {

            html += action.getTopTemplate();

        });


        html += '</div>';

        html += '<div class="datagrid">';
        html += '<loader data-name="datagrid-loader"></loader>';
        html += '<div class="datagrid-table">';
        html += '<datagrid-filters config="{config.filtersConfig}"></datagrid-filters>';
        html += '<datagrid-pagination config="{config.pagination}"></datagrid-pagination>';
        html += '<datagrid-table config="{config}"></datagrid-table>';
        html += '<datagrid-pagination config="{config.pagination}"></datagrid-pagination>';
        html += '</div>';
        html += '</div>';

        html += '{{#if config.visibleForm}}<div class="datagrid-edit-form">';
        html += '<div class="overlay"></div>';
        html += '<div class="edit-form-window"><st-form config="{config.formConfig}" visible-form="{config.visibleForm}"></st-form></div>';
        html += '</div>{{/if}}';

        html += '</div>';


        return can.stache(html)(data, options);
    },

    viewModel : {


        /**
         * @type {DatagridConfig}
         */
        config: null,

        showInsertForm: function() {
            this.config.showForm();
        }
    },

    events: {

        /*'> flashMessage': function($element, event, messageText) {
            console.log($element, event, messageText);
            //x$.processFlashes([{type: 'info', message: messageText}])
        },*/

        '> callAction': function($element, event, action) {
            this.viewModel.config.callAction(action);
        },

        'div.datagrid-edit-form close': function () {
            this.viewModel.config.hideForm();
        },

        destroy: function () {
            this.viewModel.config.destroy()
        },

        inserted: function () {
            this.viewModel.config.componentInserted.resolve();
        }

    }
});