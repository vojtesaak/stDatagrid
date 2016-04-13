
'use strict';


var can = require('can');
var stache = can.view.stache;
var Person = require('./personModel');
var DatagridConfig = require('../src/js/datagridConfig');

require('bootstrap/less/bootstrap.less!');
require('../src/less/datagrid.less!');


module.exports = can.Component({

    tag: 'my-component',

    template: function (data, options) {

        var template = can.view({
            url: 'datagrid.handlebars'
        });

        var tpl = $('<div>').append(template(data, options)).html();
        return stache(tpl)(data, options);
    },

    viewModel: {

        config: null,

        init: function() {

            var datagridConfig = new DatagridConfig({

                resource: Person,

                viewState: can.route,

                allowInsert: false,

                initCallback: function () {

                },

                refreshCallback: function () {

                    var buttonField = datagridConfig.action('refresh-button');
                    buttonField.attr('spinning', true);

                    can.ajax({
                        url: '/api/invoices/refresh',
                        method: 'post',
                        success: function() {
                            datagridConfig.callAction('getData');
                        },
                        error: function (jqXHR, textStatus) {
                            var modal = new Modal('components/modalMessage', {
                                message: 'Something went wrong: ' + textStatus
                            });
                            modal.open();
                        }
                    }).always(function () {
                        buttonField.attr('spinning', false);
                    });
                }

            }, this);

            this.attr('config', datagridConfig);

        }
    }
});


var template = stache('<my-component />');
can.$('body').append(template());


