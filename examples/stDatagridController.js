
'use strict';

require('responsive-bootstrap-toolkit').init('development');

require('./personFixtures');
require('../src/js/datagrid');
require('../src/less/main.less!');

var can = require('can');
var stache = require('can/view/stache');
var Person = require('./personModel');
var DatagridConfig = require('../src/js/datagridConfig');
//var Modal = require('stmodal');

var  getTemplate = function (templateName) {


    return function(data, helpers) {

        var template = can.view({
            url: templateName,
            engine: 'stache'
        });

        if (typeof template === 'undefined') {
            window.reloadAlert(2);
            return can.view(can.view.stache('templateNotFound', 'Template not loaded'))();
        } else {
            return template(data, helpers);
        }
    };
};

module.exports = can.Component({

    tag: 'my-component',

    template: getTemplate('datagrid.handlebars'),

    viewModel: {

        config: null,

        personGroups: null,

        init: function() {

            var self = this;
            this.attr('personGroups', new can.Model.List());

            var datagridConfig = new DatagridConfig({

                resource: Person,

                viewState: can.route,

               // allowInsert: false,

                areaModels: {
                    'personGroupsArea': self
                },

                initCallback: function () {
                   /* this.filter('merchantId')
                        .setOptions(Merchant, {fields: 'company', limit: 5});**/
                    this.filter('favoriteLang')
                        .setOptions(Person, { fields: 'favoriteLang' });


                }

            }, this);

            this.attr('config', datagridConfig);

        }
    }
});


var template = stache('<my-component />');
can.$('body').append(template());


