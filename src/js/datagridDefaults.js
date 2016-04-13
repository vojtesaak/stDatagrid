/**
 * Created by lukas on 15.7.15.
 */
'use strict';

var datagridDefaults = {

    saveCallback: function(entity) {
        return entity.save();
    },

    getDataCallback: function(params) {
        return this.resource.findAll(params);
    },

    deleteCallback: function(entity) {
        return this.showPrompt('Really delete?')
            .then(function(yes) {
                if(yes) {
                    return entity.destroy();
                } else {
                    return null;
                }
            });
    }
};

module.exports = datagridDefaults;
