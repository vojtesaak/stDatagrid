/**
 * Created by Václav Oborník on 15/09/15.
 */
'use strict';

var PartialModel = require('../src/js/utils/partialModel');
require('can/construct/super');

var Person = PartialModel.extend({
    id: 'invoiceId',

    resource: '/api/persons',

    update: function(id, attrs) {
        return this._super(id, attrs);
    }

}, {
    init: function () {
        PartialModel.prototype.init.apply(this, arguments);
    }
});

module.exports = Person;