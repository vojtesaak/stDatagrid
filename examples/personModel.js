/**
 * Created by Václav Oborník on 15/09/15.
 */
'use strict';
var can = require('can');
var PartialModel = require('../src/js/utils/partialModel');
require('can/construct/super');

var Person = PartialModel.extend({

    id: 'personId',

    resource: '/api/persons',

    update: function(id, attrs) {
        return this._super(id, attrs);
    }

}, {
    init: function () {
        PartialModel.prototype.init.apply(this, arguments);
        this.attr('groups', this.groups || new can.List());
    }
});

module.exports = Person;