/**
 * Created by davidmenger on 19/02/15.
 */

    'use strict';

    var can = require('can');
    var ColButton = require('./cols/colButton');
    var ColBaseText = require('./cols/colBaseText');

    can.Component.extend({

        template : function(data, helpers){

            var header = '',
                body = '',
                colCount = 0;

            data.attr('config')._columnList.each(function(col){
                header += col.wrapVisibilityHelper(col.getHeaderTemplate());
                body += col.wrapVisibilityHelper(col.getCellTemplate());
                colCount++;
            });
            var html = '';

            html += '{{#if config.dataRequested }}';
            html +=     '{{#unless config.data.length}}';
            html +=         '<div class="no-data">';
            html +=             '<div class="ico"><i class="icon-box"></i></div>';
            html +=             '<div class="text">{{messageText}}</div>';
            html +=             '<div class="button">';
            html +=                 '{{#filterNoDataButton}}';
            html +=                     '<button can-click="config.clearFilters @element" class="btn small primary ">{{buttonText}}</button>';
            html +=                 '{{else}}';
            html +=                     '<button can-click="showInsertForm" class="btn small primary insert">{{buttonText}}</button>';
            html +=                 '{{/filterNoDataButton}}';
            html +=             '</div>';
            html +=         '</div>';
            html +=     '{{/unless}}';
            html += '{{/if}}';

            html += '{{#if config.data.length}}';
            html += '<table class="table widthFull"><thead><tr>';
            html += header;

            html += '</tr></thead><tbody>';
            html += '{{#each config.data}}<tr can-click="rowClick" data-id="{{getId}}">';
            html += body;
            html += '</tr>{{/each}}';
            html += '</tbody>';

            html += '</tr></thead>{{#each config.groupData}}<tbody>';
            html += '{{#if title}}<tr class="group"><td colspan="' + colCount + '">{{title}}</td></tr>{{/if}}';
            html += '{{#each items}}<tr can-click="rowClick">';
            html += body;
            html += '</tr>{{/each}}';
            html += '</tbody>{{/each}}</table>';
            html += '{{/if}}';


            return can.stache(html)(data, helpers);
        },

        tag: 'datagrid-table',

        viewModel: {

            /**
             * @type {DatagridConfig}
             */
            config: null,

            offset: 0,

            isFiltered: function() {
                var config = this.config;
                var filters = config.attr('filtersConfig.filters');

                return filters && can.Map.keys(filters).some(function (filterName) {
                    if(config.attr('viewState.' + filterName)) {
                        return true;
                    }
                });

            },

            rowClick : function (entity, $element, event)
            {
                if(can.$(event.originalEvent.target).is('a')) {
                    return;
                }

                $element.siblings().removeClass('active');
                $element.addClass('active');

                this.config.getWindowPositionBeforeFormIsShown($element);

                this.config.showForm(entity, $element);
            },

            colClick : function (entity, $element, event)
            {
                if ($element.filter('td, th').length === 0) {
                    $element = $element.parent('td, th');
                }

                if( $element.hasClass('col-checkbox') && this.config.visibleForm === null ) {
                    event.stopPropagation();
                }

                var index = $element.index();
                var col = this.config.colByIndex(index);

                if (this.config.visibleForm === null || col instanceof ColButton || col instanceof ColBaseText )
                {
                    if (typeof col.onClick === 'function'
                            && col.onClick(entity, $element, event) === false) {

                        event.stopPropagation();
                    }

                }
            },

            orderClick: function (context, $element, event) {
                var index = $element.parents('th').index();
                var col = this.config.colByIndex(index);
                this.config.reorder(col);
                event.stopPropagation();
            }


        },



        helpers: {

            filterNoDataButton: function(opt) {

                var viewModel = opt.context;
                if (viewModel.isFiltered()) {
                    return opt.fn();
                } else {
                    if (viewModel.config.attr('allowInsert')) {
                        return opt.inverse() ;
                    }
                }

            },

            buttonText: function(opt) {
                var viewModel = opt.context;
                var config = viewModel.config;
                return viewModel.isFiltered() ? config.attr('noFilteredRows.buttonText') : config.attr('noRows.buttonText');
            },

            messageText: function(opt) {
                var viewModel = opt.context;
                var config = viewModel.config;
                return viewModel.isFiltered() ? config.attr('noFilteredRows.message') : config.attr('noRows.message');
            },

            col : function (colName)
            {
                var col = this.config.col(colName);
                return col.colHelper.apply(col, arguments);
            },

            order : function (colName) {
                var col = this.config.col(colName);
                if (col.order() === 'asc') {
                    return '<span class="arrow-up" aria-hidden="true"></span>';
                }

                if (col.order() === 'desc') {
                    return '<span class="arrow-down" aria-hidden="true"></span>';
                }

                return '';
            }

        },

        events: {
            inserted: function (el) {
                setTimeout(function () {
                    can.$(el).find('[data-truncated]').each(function () {
                        var $el = $(this);
                        var $clone = $el.clone().removeAttr('style');
                        $('body').append($clone);
                        $clone.css({
                            'font-size': $el.css('font-size'),
                            display: 'inline'
                        });
                        if ($el.width() < $clone.width()) {
                            $el.addClass('truncated');
                            $el.attr('data-truncated', true);
                        }
                        $clone.remove();
                    });
                }, 0);
            }
        }


    });