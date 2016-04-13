/**
 * Created by lukas on 29.6.15.
 */

'use strict';

var FilterText = require('./filterText');
var FilterSelect = require('./filterSelect');

var FilterFactory = {

    /**
     *
     * @param {object} config
     * @param {DatagridFiltersConfig} filtersConfig
     * @returns {Filter}
     */
    createFilter: function(config, filtersConfig) {
        var type = config.attr('type');
        switch (type) {
            case 'Text':
                return new FilterText(config, filtersConfig);
            case 'Select':
                return new FilterSelect(config, filtersConfig);
        }
        return new FilterText(config, parent);
    }
};

module.exports = FilterFactory;