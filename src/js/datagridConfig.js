/**
 * Created by davidmenger on 19/02/15.
 */

'use strict';

var HtmlParser = require('./utils/htmlParser');
var ColFactory = require('./cols/colFactory');
var PaginationConfig = require('./datagridPaginationConfig');
var OrderConfig = require('./datagridOrderConfig');
var DatagridFiltersConfig = require('./datagridFiltersConfig');
var datagridDefaults = require('./datagridDefaults');
var DatagridAction = require('./datagridAction');
var StFormConfig = require('stform/src/stFormConfig');



var responsiveBootstrapToolkit = require('responsive-bootstrap-toolkit');

//var Modal = require('stmodal');

var can = require('can');

var DatagridConfig = can.Map.extend({
    // static

}, {
    // instance
    configuration: null,

    _columnList: null,

    /**
     * @type {boolean}
     */
    orderMultiple: null,

    /**
     * @type {Promise}
     */
    initialized: null,

    /**
     * @type {boolean}
     */
    dataRequested: null,

    $loader: null,


    data: null,

    groupData: null,

    pagination: null,

    orderConfig: null,

    allowInsert: true,

    /**
     * @type {StFormConfig}
     */
    formConfig: null,

    /**
     * Name of the form
     *
     * @type {string|null}
     */
    visibleForm: null,

    /**
     * @type {DatagridFiltersConfig}
     */
    filtersConfig: null,

    collapsed: false,

    /**
     * This is the table row holding data that is being edited
     * @type {jQuery}
     */
    $rowElement: null,

    controller: null,

    /**
     * @type {can.Model}
     */
    formEntity: null,

    /**
     * The Data from the URL
     *
     * @type {can.Map}
     */
    viewState: null,

    _localizedErrors: null,

    actions: null,

    isFiltered: null,

    namedActions: null,

    /**
     * @type {function}
     */
    _viewStateChangeHandler: null,

    /**
     * @type {Function}
     */
    _viewStateChangingHandler: null,

    noRows: {},

    noFilteredRows: {},

    _windowPositionBeforeFormIsShown: null,

    componentInserted: null,

    /**
     *
     * @param {object} configuration
     */
    init: function (configuration) {
        var self = this;

        configuration = can.extend(new can.Map(), datagridDefaults, configuration);

        this.attr('configuration', configuration);

        this.viewState = configuration.viewState;
        this.initialized = new can.Deferred();
        this.componentInserted = new can.Deferred();

        this._columnList = new can.Map();

        this.attr('pagination', new PaginationConfig(this.viewState));


        this.attr('data', new can.List());
        this.attr('groupData', new can.Map());


        this.initialized.promise().then(function(columns) {
            self.attr('orderConfig', new OrderConfig(self.viewState, columns, self.orderMultiple));
            self.callAction('getData');
        });

        this.attr('actions', new can.Map());
        this.attr('namedActions', new can.Map());

        this._viewStateChangeHandler = function (ev, attr, what) {
            if (attr === 'route' && what === 'set') {
                return;
            }
            self.initialized.promise().then(function () {
                self.callAction('getData');
            });
        };

        this.initialized.promise().then(function () {
            self.viewState.bind('change', self._viewStateChangeHandler);
        });

        this._viewStateChangingHandler = function (event) {

            var changingRoute = event.args[0] === 'set' && event.args[1] === 'route';

            if(changingRoute && self.formEntity && self.formEntity.isModified()) {

                event.pause(); //pause the route change

                //Add the current path to the browser history
                var path = can.route.param(can.route.data.serialize(), true);
                can.route._call('setURL', path, []);

                self.showPrompt('Really ?').then(function(yes) {
                    if(yes) {
                        event.resume();
                    } else {
                        event.cancel();
                    }
                });

            }

        };

        self.viewState.bind('changing', self._viewStateChangingHandler);

    },

    destroy: function () {
        this.viewState.unbind('changing', this._viewStateChangingHandler);
        if(this._viewStateChangeHandler) {
            this.viewState.unbind('change', this._viewStateChangeHandler);
        }
        if (this.formConfig !== null) {
            this.formConfig.unbind('change');
        }
        this.attr('filtersConfig').destroy();
    },

    /**
     *
     * @param name
     * @param parameters
     * @returns {Promise}
     * @private
     */
    _callConfigCallback: function (name, parameters) {
        var callbackName = name + 'Callback';
        var callback = this.configuration[callbackName];

        if (typeof callback === 'function') {
            var res = callback.apply(this, parameters);

            if (can.isDeferred(res)) {
                return res;
            } else {
                return can.Deferred().resolve(res);
            }
        } else {
            return can.Deferred().resolve();
        }
    },

    /**
     *
     * @param action
     * @param parameters
     * @returns {*|Promise}
     */
    callAction: function(action, parameters) {

        var self = this;

        if (typeof action === 'object') {
            parameters = action.parameters;
            action = action.callback;
        }


        var res = null;

        switch (action) {
            case 'save':
                res = this._save();
                break;

            case 'getData':
                res = this._getData();
                break;

            case 'delete':
                res = this._delete();
                break;

            case 'cancel':
                // can't be overrided
                if (this.formEntity.isModified()) {
                    this.showPrompt('Really ?').then(function(yes) {
                        if (yes) {
                            self.formEntity.revertSnapshot();
                            self.hideForm();
                        }
                    });
                } else {
                    this.hideForm();
                }

                return;

            default:
                res = this._callConfigCallback(action, parameters);
        }


        return this._fail(res);
    },

    /**
     *
     * @param {Promise} promise
     * @returns {Promise}
     * @private
     */
    _fail: function (promise) {
        var self = this;

        return promise.fail(function (error) {
            if(self.formConfig) {
                self.attr('formConfig.loading', null);
            }
            self.showError(error);
        });
    },

    getFilterPath: function(name) {
        return name;
    },

    getActionsPath: function () {
        return 'config.actions.';
    },

    /**
     *
     * @param name
     * @returns {Col}
     */
    col: function (name) {
        return this._columnList[this._normalizeName(name)];
    },

    /**
     *
     * @param {string} name
     * @returns {Field}
     */
    field: function (name) {
        return this.formConfig.field(name);
    },

    /**
     * @param {string} name
     * @returns {FieldGroup}
     */
    group: function (name) {
        return this.formConfig.group(name);
    },

    /**
     *
     * @param {string} name
     * @returns {DatagridAction}
     */
    action: function (name) {

        if(this.namedActions.attr(name)) {
            return this.namedActions.attr(name);
        }

        if(this.formConfig) {
            return this.formConfig.action(name);
        }
    },

    /**
     *
     * @param {string} name
     * @returns {Filter}
     */
    filter: function (name) {
        return this.filtersConfig.filter(name);
    },

    /**
     *
     * @param index
     * @returns {Col}
     */
    colByIndex: function (index) {
        var keys = can.Map.keys(this._columnList);
        if(this.visibleForm) {
            for(var i = 0; i <= index; i++) {
                if(!this._columnList[keys[i]].alwaysVisible) {
                    index++;
                }
            }
        }
        return this._columnList[keys[index]];
    },

    _initNoRowsMessages: function (noRows, noFilteredRows) {

        if (noRows) {
            if (noRows.message) {
                this.attr('noRows.message', noRows.message.value());
            }
            if (noRows['button-text']) {
                this.attr('noRows.buttonText', noRows['button-text'].value());
            }

        }

        if (noFilteredRows) {
            if (noFilteredRows.message) {
                this.attr('noFilteredRows.message', noFilteredRows.message.value());
            }

            if (noFilteredRows['button-text']) {
                this.attr('noFilteredRows.buttonText', noFilteredRows['button-text'].value());
            }
        }
    },

    /**
     *
     * @param fragment
     * @private
     */
    processControlDocumentFragment: function (fragment) {
        var configObject = HtmlParser.parse(fragment, ['custom-area']);

        this.attr('orderMultiple', configObject.config.columns.hasAttr('order-multiple'));

        // load columns
        this._initColumns(configObject.config.columns);

        //load actions
        this._initActions(configObject.config.action);

        // load form config
        if (typeof configObject.config['form-config'] !== 'undefined') {
            var self = this;
            var formConfig = new StFormConfig();
            formConfig.attr('areaModels', this.configuration.areaModels);
            formConfig.processConfig(configObject.config['form-config']);
            formConfig.bind('entity', function (ev, newValue) {
                self.attr('formEntity', newValue);
            });
            this.attr('formConfig', formConfig);
        }

        var filters = HtmlParser.makeArray(configObject.config.filters && configObject.config.filters.filter);
        this.attr('filtersConfig', new DatagridFiltersConfig(filters, this.viewState));

        this._initNoRowsMessages(configObject.config['no-rows'], configObject.config['no-filtered-rows']);

        this._initErrors(HtmlParser.makeArray(configObject.config['localized-error']));

        this._runDeferredInitialization();
    },

    _runDeferredInitialization: function () {

        var self = this;
        var deferredList = [this.componentInserted];

        if (typeof this.configuration.initCallback === 'function') {
            this.configuration.initCallback.call(this);
        }

        this._columnList.each(function (col) {
            if (col.initialized !== null) {
                deferredList.push(col.initialized);
            }
        });

        if (this.formConfig !== null) {
            this.formConfig.collectInitializationPromises(deferredList);
        }

        this.filtersConfig.collectInitializationPromises(deferredList);

        can.when.apply(can, deferredList).then(function() {
            self.initialized.resolve(self._columnList);
        });
    },

    _initColumns: function (columnsConfig) {
        if (typeof columnsConfig === 'undefined'
            || typeof columnsConfig.column === 'undefined') {

            throw new Error('Missing columns');
        }

        var columns = HtmlParser.makeArray(columnsConfig.column);
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];

            var normalized = this._normalizeName(col.attr('name'));
            var obj = ColFactory.createCol(col);

            this._columnList.attr(normalized, obj);
        }
    },

    _initActions: function (actionsConfig) {
        var actions = HtmlParser.makeArray(actionsConfig);

        for (var j = 0; j < actions.length; j++) {
            var action = new DatagridAction(actions[j], this);
            this.actions.attr(action.id, action);
            if(action.name) {
                this.namedActions.attr(action.name, action);
            }
        }
    },

    /**
     *
     * @returns {Promise}
     * @private
     */
    _getData: function() {
        var self = this;

        var $loader = $('loader[data-name="datagrid-loader"]');

        if( $loader.length > 0 ) {
            $loader.viewModel().showLoader('loading');
        }


        var searchParams = {
            page: this.viewState.attr('page'),
            order: self.orderConfig.getColOrders()
        };

        self.filtersConfig.getState().each(function(val, key) {
            if (typeof val === 'object') {
                searchParams[key] = val.join(',');
            } else {
                searchParams[key] = val;
            }
        });

        this._pauseColumnTranslators();

        return self._callConfigCallback('getData', [searchParams])
            .then(function (response) {
                self.attr('dataRequested', true);

                var $loader = $('loader[data-name="datagrid-loader"]');
                if ($loader.length > 0) {
                    $loader.viewModel().finishLoader();
                }

                self.pagination.update({
                    hasNextPage: response.nextPage > 0,
                    pageCount: typeof(response.pageCount) !== 'undefined' ? response.pageCount : 0,
                    page: response.page
                });

                self.attr('data', response);
                self.attr('groupData', response.groupData);

            })
            .always(function () {
                self._runColumnTranslators();
            });
    },

    _iterateTranslators: function (cb) {
        can.each(this._columnList, function (column) {
            if(column.translator) {
                cb(column.translator);
            }
        });
    },

    _pauseColumnTranslators: function () {
        this._iterateTranslators(function (translator) {
            translator.startCollecting();
        });
    },

    _runColumnTranslators: function () {
        this._iterateTranslators(function (translator) {
            translator.startTranslating();
        });
    },

    /**
     *
     * @private
     * @returns {Promise}
     */
    _save: function () {
        var isInsert = this.visibleForm === 'insert';
        var entity = this.formConfig.entity;
        var formConfig = this.formConfig;
        var self = this;

        var isPopupForm =  responsiveBootstrapToolkit.is('<=sm') || self.attr('embedded');

        var isModified =  typeof entity.isModified === 'function' && entity.isModified();


        return formConfig.validateForm()
            .then(function () {

                if ( isModified ) {
                    formConfig.attr('loading', 'start');
                }

                return self._callConfigCallback('save', [entity, formConfig, isInsert]);
            })
            .then(function () {

                formConfig.attr('loading', 'finish');

                if (isInsert) {

                    self.attr('formEntity', null);
                    self.showForm();

                    if ( isPopupForm ) {
                        self.hideForm();
                    }

                    return self.callAction('getData');
                } else {

                    if ( isModified && isPopupForm ) {
                        self.hideForm();
                    }

                    // there can be new fields after save!
                    entity.createSnapshot();
                }

            });


    },

    /**
     *
     * @returns {Promise}
     * @private
     */
    _delete: function () {
        var entity = this.formConfig.entity;
        var self = this;

        return self._callConfigCallback('delete', [entity, this.formConfig])
            .then(function (res) {
                if (res) {
                    self.hideForm();
                    return self.callAction('getData');
                } else {
                    return null;
                }
            });
    },

    reorder: function (col) {
        this.orderConfig.updateColOrder(col);
    },

    animateForm: function (deferred) {
        var self = this;
        can.$('html').addClass('modal-open');

        if(responsiveBootstrapToolkit.is('>sm') && !self.attr('embedded') ) {
            can.$('.datagrid-header')
                .slideUp(400)
                .promise()
                .then(function () {
                    return can.$('.datagrid-layout').addClass('transitioned')
                        .animationFinished();
                })
                .then(function () {
                    self.autofocus();
                    deferred.resolve(true);
                });
        } else {
            this.autofocus();
            deferred.resolve(true);
        }
    },

    /**
     * Without specified entity will open the New entity form
     *
     * @param {can.Model} [entityToEdit]
     * @param {jQuery} $rowElement
     * @returns {Promise}
     */

    showForm: function (entityToEdit, $rowElement) {
        var self = this;
        var deferred = new can.Deferred();

        var setData = function (entity) {
            var formType = 'insert';
            if (entity) {
                formType = 'update';
                self.$rowElement = $rowElement;
            } else {
                entity = new self.configuration.resource();
            }

            self.formConfig.setData(entity);
            self.formConfig.setDefaultValues();
            self.attr('visibleForm', formType);
            self.formConfig.initFields();
            self.formEntity.createSnapshot();
        };

        if (this.formConfig) {

            if (entityToEdit === this.formConfig.entity) {
                this.hideForm();
                deferred.resolve(false);
            } else if (this.formEntity && this.formEntity.isModified()) {
                this.showPrompt('Really ?')
                    .then(function(yes) {
                        if (yes) {
                            self.formEntity.revertSnapshot();
                            setData(entityToEdit);
                            self.animateForm(deferred);
                        } else {
                            deferred.resolve(false);
                        }
                    });
            } else {
                setData(entityToEdit);
                self.animateForm(deferred);
            }
        } else {
            deferred.resolve(false);
        }

        return deferred.promise();
    },

    setWindowPositionBeforeFormIsShown: function() {
        can.$('html, body').scrollTop( this.attr('_windowPositionBeforeFormIsShown') );
    },

    getWindowPositionBeforeFormIsShown: function($el) {
        this.attr('_windowPositionBeforeFormIsShown', $el.offset().top );
    },

    autofocus: function () {
        this.attr('formConfig').autofocus();
    },

    /**
     * Hide it
     */
    hideForm: function() {

        var self = this;
        var $dtHeader = can.$('.datagrid-header');


        if (this.visibleForm) {

            if (self.$rowElement !== null) {

                self.$rowElement
                    .removeClass('active')
                    .siblings()
                    .removeClass('active');

                self.$rowElement = null;
            }

            if(responsiveBootstrapToolkit.is('>sm') && !self.attr('embedded') ) {

                can.$('.datagrid-layout')
                    .removeClass('transitioned')
                    .animationFinished()
                    .done(function(){
                        self.formConfig.setData(null);
                        self.attr('visibleForm', null);
                        can.$('html').removeClass('modal-open');
                        $dtHeader.slideDown(400);
                    });

            }else {

                can.$('.datagrid-layout').removeClass('transitioned');
                self.formConfig.setData(null);
                self.attr('visibleForm', null);
                can.$('html').removeClass('modal-open');
                self.setWindowPositionBeforeFormIsShown();
                $dtHeader.show();
            }

        }


    },


    /**
     *
     * @param name
     * @returns {string}
     * @private
     */
    _normalizeName: function (name) {
        return name.replace(/[^a-z]+/ig, '_');
    },

    showError: function(error) {
        if (typeof error === 'string') {
            this.showModal(error);
        } else if (error && typeof error.status !== 'undefined') {
            switch (error.status) {
                case 0:
                    alert('NO Connection');
                    break;
                default:
                    var message;
                    if(error.responseJSON) {
                        var errorCode = error.responseJSON.code;
                        if (typeof this._localizedErrors.attr(errorCode) !== 'undefined') {
                            message = this._localizedErrors.attr(errorCode);
                        } else {
                            message = error.responseJSON.error;
                        }
                    } else {
                        message = error.responseText;
                    }
                    this.showModal(message);
            }
        }
    },

    showModal: function(message) {
        var modal = new Modal('components/modalMessage', {
            message: message
        });
        return modal.open();
    },

    showPrompt: function(message) {
        var modal = new Modal('components/modalPrompt', {
            message: message
        });
        return modal.open();
    },

    clearFilters: function () {
        this.filtersConfig.clearFilters();
    },

    clearSearch: function(elm) {
        this.viewState.removeAttr('search');
        this.closeSearch(elm);
    },

    closeSearch: function(elm) {
        elm.closest('.filter-search').removeClass('open');
    },

    /**
     * Initializes error messages from template - makes object where key is error code
     * and value is localized message
     * @param config
     */
    _initErrors: function (config) {
        this.attr('_localizedErrors', new can.Map());
        if (typeof config !== 'undefined') {
            for (var i = 0; i < config.length; i++) {
                this._localizedErrors.attr(config[i].attr('code'), config[i].value());
            }
        }
    }
});

module.exports = DatagridConfig;
