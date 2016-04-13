/**
 * Created by vojtechmalek on 13.1.16.
 */

'use strict';

var Col = require('./col');
//var Modal = require('stmodal');

var ColBaseText = Col.extend({}, {

    linkWrapper : null,

    init: function(config) {
        this._super(config);
        this.truncate = config.attr('truncate');
        this.link = config.attr('link');
        this.linkText = config.attr('link-text');
        this.linkClass = config.attr('link-class');
        this.target = config.attr('target');

        if ( this.link  ) {
            this._linkWrapper = this._createLink();
        }

    },



    /**
     *
     * @returns {string}
     */
    getCellTemplate : function() {
        if ( this.truncate ) {
            this.style = 'width: ' + this.truncate;
        }
        return this._super();
    },

    /**
     *
     * @param {string} content
     */
    resolveTemplate: function(content) {

        if ( this.truncate ) {
            return this._truncateText(content);
        }


        if ( this._linkWrapper ) {
            var text = this.linkText ? this.linkText : content;
            content = this._linkWrapper.before + text + this._linkWrapper.after;
        }

        return content;
    },



    /**
     * @returns {{
     *  before: String
     *  after: String
     * }}
     */
    _createLink: function() {

        var target = this.target ? 'target="' + this.target + '"' : '';
        var classes = this.linkClass ? 'class="' + this.linkClass + '"' : '';
        return  {
            before: '<a href="' + this._getLink( this.link ) + '" ' + target + ' ' + classes +'>',
            after: '</a>'
        }
    },

    /**
     *
     * @param {string} link
     * @returns {*}
     * @private
     */
    _getLink: function(link) {
        return link
            .replace(/\[/g, '{{')
            .replace(/]/g, '}}');
    },



    /**
     * @param {string} text
     * @returns {string}
     */
    _truncateText : function( text ) {
        return '<div class="text-wrapper" can-click="colClick" data-truncated="false" style="width:'+ this.truncate +'">' + text  + '</div>';
    },


    onClick: function(entity, $element) {
        var $el= $element.find('[data-truncated="true"]');
        if ( $el.length > 0 ) {
            var modal = new Modal('is/components/datagridColTruncatedModal', {
                message: $el.text()
            });
            modal.open();
        }
    }




});

module.exports = ColBaseText;