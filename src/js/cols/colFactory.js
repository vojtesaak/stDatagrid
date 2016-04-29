/**
 * Created by lukas on 26.6.15.
 */

'use strict';

var Col = require('./col');
var ColInput = require('./colInput');
var ColText = require('./colText');
var ColSelect = require('./colSelect');
var ColCheckbox = require('./colCheckbox');
var ColColor = require('./colColor');
var ColEnum = require('./colEnum');
var ColButton = require('./colButton');
var ColDate = require('./colDate');

var ColFactory = {

    createCol: function(config) {
        var type = config.attr('type');
        switch (type) {
            case 'Text':
                return new ColText(config);
            case 'Input':
                return new ColInput(config);
            case 'Select':
                return new ColSelect(config);
            case 'Checkbox':
                return new ColCheckbox(config);
            case 'Color':
                return new ColColor(config);
            case 'Enum':
                return new ColEnum(config);
            case 'Button':
                return new ColButton(config);
            case 'Date':
                return new ColDate(config);
        }
        return new Col(config);
    }

};

module.exports = ColFactory;