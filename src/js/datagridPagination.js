/**
 * Created by lukas on 21.5.15.
 */
'use strict';

var can = require('can');

can.Component.extend({

    tag: 'datagrid-pagination',

    template: function (data, options) {
        var html = '';
        html += '{{#if config.isShown}}';
        html +=     '<ul class="pager">';
        html +=         '<li class="{{#unless config.hasPrevPage}}disabled{{/unless}}"><a href="javascript:void(0)" title="Na začátek" can-click="config.firstPage"><i class="icon-first"></i></a></li>';
        html +=         '<li class="{{#unless config.hasPrevPage}}disabled{{/unless}}"><a href="javascript:void(0)" title="Předchozí" can-click="config.prevPage"><i class="icon-prev"></i></a></li>';
        html +=         '<li class="{{#unless config.hasNextPage}}disabled{{/unless}}"><a href="javascript:void(0)" title="Další" can-click="config.nextPage"><i class="icon-next"></i></a></li>';
        html +=         '<li class="{{#unless config.hasNextPage}}disabled{{/unless}}"><a href="javascript:void(0)" title="Na konec" can-click="config.lastPage"><i class="icon-last"></i></a></li>';
        html +=     '</ul>';
        html += '{{/if}}';
        return can.stache(html)(data, options);
    },

    viewModel: {

        config: null

    }
});