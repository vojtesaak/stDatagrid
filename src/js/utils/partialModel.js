/**
 * Created by lukas on 21.5.15.
 */

'use strict';

var can = require('can');
require('can/map/delegate');
require('can/construct/super');
var size = require('lodash/collection/size');

var PartialModel = can.Model.extend({

    _derivedClasses: [],

    apiReadonlyProperties: [],

    _skipPropertiesRegexps: null,

    modifications: {},

    extend: function () {
        var newClass = this._super.apply(this, arguments);
        this._derivedClasses.push(newClass);
        return newClass;
    },

    /**
     * New class initialization (not instance!)
     */
    init: function () {
        this._skipPropertiesRegexps = this.apiReadonlyProperties.map(function (property) {
            return new RegExp('^' + property + '(\..*)*');
        });
    },

    /**
     * @param {string} property
     * @returns {boolean}
     */
    _isPropertyApiReadonly: function (property) {
        return this._skipPropertiesRegexps.some(function (regexp) {
            return !!property.match(regexp);
        });
    },

    clearStores: function () {
        PartialModel._derivedClasses.forEach(function (derivedClass) {
            for (var id in derivedClass.store) {
                if(derivedClass.store.hasOwnProperty(id)) {
                    delete derivedClass.store[id];
                }
            }
        });
    },

    /**
     * Overrides standard can.js update method. Sends only modified data
     * and after successful request deletes modification info object for this entity.
     * Modifications are static object where key is id of entity and value is array of modified values.
     * @param id
     * @param attrs
     * @returns {can.Deferred}
     */
    update: function(id, attrs) {

        if (typeof this.modifications[id] !== 'undefined' && size(this.modifications[id]) > 0) {
            var modifications = this.modifications[id];
            var nestedModifications = {};

            can.each(modifications, function(val, key) {
                var fromArray = key.split('.');
                var temp = nestedModifications;

                can.each(fromArray, function(val2, key2) {
                    if (typeof (temp[val2]) === 'undefined') {
                        temp[val2] = {};
                    }

                    if (key2 === fromArray.length - 1) {
                        temp[val2] = (modifications[key] && typeof(modifications[key].attr) === 'function') ? modifications[key].attr() : modifications[key];
                    } else {
                        temp = temp[val2];
                    }
                })
            });

            var url = can.sub(this.resource, attrs, true) + '/' + id;

            return $.ajax({
                'url': url,
                'method': 'PUT',
                'data': nestedModifications
            });

        } else {
            return can.when(attrs);
        }
    },

    create: function(attrs) {
        delete attrs.loadingCounter;
        return this._super(attrs);
    }


},{
    _snapshot: {},

    loadingCounter: 0,

    init: function() {
        var self = this;

        ['created', 'updated'].forEach(function (eventName) {
            self.bind(eventName, function () {
                var id = self.attr(self.constructor.id);
                if (typeof id === 'undefined' || eventName === 'created') {
                    id = 0;
                }

                self.constructor.modifications[id] = {};
            });
        });

        this.delegate('**','set', function(ev, newVal, oldVal, property) {

            if(property === 'loadingCounter') {
                return;
            }

            if(self.constructor._isPropertyApiReadonly(property)) {
                return;
            }

            var id = self.attr(self.constructor.id);
            if (typeof id === 'undefined') {
                id = 0;
            }

            if (typeof(self.constructor.modifications[id]) === 'undefined') {
                self.constructor.modifications[id] = {};
            }
            self.constructor.modifications[id][property] = newVal;
        });
    },

    serialize: function () {
        var data = can.Model.prototype.serialize.apply(this);
        delete data._snapshot;
        return data;
    },

    /**
     * Returns if data in this model were modified from last save
     * @returns {boolean}
     */
    isModified: function () {
        var id = this.attr(this.constructor.id);

        if (typeof id === 'undefined') {
            id = 0;
        }

        var modifications = this.constructor.modifications[id];

        if (typeof modifications !== 'undefined') {
            for (var key in modifications) {
                if (modifications.hasOwnProperty(key)) {
                    return true;
                }
            }
        }

        return false;
    },

    /**
     * Creates snapshot of current values
     */
    createSnapshot: function () {
        this._snapshot = this.attr();
        var id = this.attr(this.constructor.id);
        if (typeof id === 'undefined') {
            id = 0;
        }
        this.constructor.modifications[id] = {};
    },

    /**
     * Reverts model's values to the saved snapshot and clears modifications
     */
    revertSnapshot: function () {
        this.attr(this._snapshot, true);
        var id = this.attr(this.constructor.id);
        if (typeof id === 'undefined') {
            id = 0;
        }
        this.constructor.modifications[id] = {};
    },


    save: function() {
        var self = this;

        this.attr('loadingCounter', this.loadingCounter + 1);

        return this._super()
            .always(function(){
                self.attr('loadingCounter', self.loadingCounter - 1);
            });
    },

    getId: function () {
        return this.attr(this.constructor.id);
    }


});

module.exports = PartialModel;