/**
 * Created by lukas on 22.6.15.
 */
'use strict';

var can = require('can');

var DatagridAction = can.Map.extend({
    counter: 0
},{
    id: null,
    title: null,
    name: null,
    callback: null,
    form: null,
    disabled: false,
    hidden: false,
    spinning: false,

    /**
     * @type {StFormConfig|DatagridConfig}
     */
    parentConfig: null,

    _hidden: function () {

        var manuallyHidden = this.attr('hidden');
        var inputVisibleForForm = this.attr('form');
        var actualDisplayedForm = this.attr('parentConfig.visibleForm');

        return manuallyHidden || (!!inputVisibleForForm && inputVisibleForForm !== actualDisplayedForm);
    },

    _disabled: function () {
        return this.attr('disabled') || this.attr('spinning');
    },

    /**
     *
     * @param {object} config
     * @param {StFormConfig|DatagridConfig} parentConfig
     */
    init: function(config, parentConfig) {

        this.attr('parentConfig', parentConfig);
        this.attr('form', config.attr('form'));
        this.attr('title', config.attr('title'));
        this.attr('name', config.attr('name'));
        this.attr('callback', config.attr('callback'));
        this.attr('id', 'Action' + DatagridAction.counter++);
    },

    /**
     *
     * @returns {string}
     */
    getTemplate: function () {

        var spinningPath = this.getTemplateAttr('spinning');

        var btnClass = this.callback + ' btn small primary ';
        var icon = '';
        if (this.callback === 'cancel') {
            btnClass += 'secondary ';
        }

        if (this.callback === 'delete') {
            btnClass += 'trashIcon transparent scale';
            icon = '<i class="icon-trash"></i>';
        }

        var disabled = '{{#if ' + this.getTemplateAttr('_disabled') + '}} disabled="disabled" {{/if}} ';
        btnClass += '{{#if ' + spinningPath + '}} spinning {{/if}}';


        var html =  '{{#unless ' + this.getTemplateAttr('_hidden') + '}} ';
        html +=         '<button can-click="callAction \'' + this.callback + '\'" ' + disabled  + 'class="' + btnClass + '" >';
        html +=         '{{#if ' + spinningPath + '}}<i class="glyphicon glyphicon-refresh" aria-hidden="true"></i>{{/if}}';
        html +=             icon + ' '  + this.title;
        html +=          '</button>';
        html +=     '{{/unless}}';

        return html;
    },

    getTopTemplate: function () {

        var spinningPath = this.getTemplateAttr('spinning');
        var classes = 'btn small right primary insert';
        classes += '{{#if ' + spinningPath + '}} spinning{{/if}}';

        //
        // NOTE for spinner styling see http://jsfiddle.net/AndrewDryga/GY6LC/
        // PRO TIP: for easy styling set temporary "spinning" attribute to 'true' (top of the file) :)
        //

        return '' +
            '<button can-click="config.callAction \'' + this.callback + '\'" ' +
                '{{#if ' + this.getTemplateAttr('_disabled') + '}} disabled="disabled" {{/if}}' +
                'class="' + classes + '">' +
                    '{{#if ' + spinningPath + '}}<i class="glyphicon glyphicon-refresh" aria-hidden="true"></i>{{/if}}' +
                     this.title +
            '</button>';
    },

    /**
     *
     * @returns {string}
     */
    getTemplateAttr: function(attr) {
        return this.parentConfig.getActionsPath() + this.id + '.' + attr;
    }
});

module.exports = DatagridAction;