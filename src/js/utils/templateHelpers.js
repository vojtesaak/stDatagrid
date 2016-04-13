/**
 * Created by vojtechmalek on 29.10.15.
 */
'use strict';

var padLeft = require('lodash/string/padLeft');

function getValue(param) {
    return typeof param === 'function' ? param() : param;
}

module.exports = {

    /**
     * @callback canDataCallback
     * @param {*}
     */

    /**
     *
     * @param {canDataCallback|Date} date
     * @param {'date'|'dateYYYY'|'dateYY'|'time'|'dateTime'} [dateType='dateTime']
     * @param {*} [defaultValue]
     * @returns {*}
     */
    dateFormatter: function (date, dateType, defaultValue) {

        date = getValue(date);

        if (date == null) { // jshint ignore:line
            return arguments.length === 4 ? getValue(defaultValue) : '';
        }

        var d = new Date(date);
        var month = d.getMonth() + 1;
        var result = '';

        if (d instanceof Date) {
            switch (dateType) {

                case 'date' :
                case 'dateYYYY' :
                    result = d.getDate() + '.' + month + '.' + d.getFullYear();
                    break;

                case 'dateYY' :
                    result = d.getDate() + '.' + month + '.' + d.getFullYear().toString().substr(2, 3);
                    break;

                case 'time' :
                    result = padLeft(d.getHours(), 2, '0') + ':' + padLeft(d.getMinutes(), 2, '0');
                    break;

                default:
                case 'dateTime':
                    var time = padLeft(d.getHours(), 2, '0') + ':' + padLeft(d.getMinutes(), 2, '0');
                    result = d.getDate() + '.' + month + '.' + d.getFullYear() + ' ' + time;
                    break;
            }
        }

        return result;
    },

    currencyFormatter: function (value, format) {
        value = Number(getValue(value)) || 0;

        var ret = value.toFixed(2).replace('.00', '').replace('-', '-&nbsp;');

        if (format === 'diff') {
            if (value > 0) {
                ret = '+&nbsp;' + ret;
            }
        }

        return ret.replace(/\B(?=(\d{3})+(?!\d))/g, '&nbsp;');
    },

    numberSign: function (value) {
        var ret = 'none';
        value = getValue(value) || 0;
        if (value > 0) {
            ret = 'plus';
        }

        if (value < 0) {
            ret = 'minus';
        }

        return ret;
    },

    ifIsEven: function(index, options) {
        index = getValue(index);
        if((index % 2) === 0) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
};