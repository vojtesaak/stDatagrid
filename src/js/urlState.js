/**
 * Created by lukas on 1.7.15.
 */
'use strict';
var can = require('can');

var UrlState = {
    getValue: function(state, defaultState) {
        var encodedState = can.route.attr(state);
        var stateValue = defaultState;
        if (typeof(encodedState) !== 'undefined') {
            stateValue = encodedState;
        }

        return stateValue;
    },
    setValue: function(state, value) {
        //var encodedState = this.encodeState(value);
        can.route.attr(state, value);
    },
    decodeState: function(encodedState) {
        var state = decodeURIComponent(encodedState);
        return JSON.parse(state);
    },
    encodeState: function(state) {
        var str = JSON.stringify(state);
        return encodeURIComponent( str );
    }
}

module.exports = UrlState;