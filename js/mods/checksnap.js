/*global define: false, require: false */
define([ 'jquery', 'mods/camera' ], function ( $, Camera ) {
    'use strict';

    var ChkSnp = function( options ){
        if ( ! ( this instanceof ChkSnp ) ) {
            return new ChkSnp( options );
        }

        this.options = $.extend( {}, this.options, options );

        this.$el = $( this.options.container );
        this.$video = this.$el.find( 'video' );
        this.$img = $( '<img width="' + this.options.width + '" height="' + this.options.height + '" />' );
        this.$canvas = $( '<canvas width="' + this.options.width + '" height="' + this.options.height + '" />' );
        this.$canvas.ctx = this.$canvas[ 0 ].getContext( '2d' );

        this.cam = new Camera();
    };

    ChkSnp.prototype.options = {
        width: 640,
        height: 480,
        container: '#js-checksnap',
        errorMsg: '#js-checksnap-error',
        loadingClass: 'is-loading',
        streamingClass: 'is-streaming',
        errorClass: 'has-error',
        screenshotClass: 'has-screenshot'
    };

    ChkSnp.prototype.setup = function(){
        this.$el.addClass( this.options.loadingClass );
        this.cam.setup();
        return this;
    };

    ChkSnp.prototype.listen = function(){
        this.$video.one( 'click', $.proxy( this.setup, this ) );
        this.$video.one( 'loadedmetadata', $.proxy( this.toggleLoadingIndicator, this ) );
        this.cam.once( 'mediaavailable', this.startStream.bind( this ) );
        this.cam.once( 'error', this.displayError.bind( this ) );
        $( document ).on( 'keydown.checksnap', $.proxy( this.routeAction, this ) );
        this.$el.on( 'click.checksnap', 'a', $.proxy( this.routeAction, this ) );
        return this;
    };

    ChkSnp.prototype.routeAction = function( event ){
        var name, action;

        if ( event.type === 'click' ){
            name = event.currentTarget.hash.replace( '#', '' );
        } else if ( event.type === 'keydown' && event.which === 32 ){
            name = 'snapshot';
        }

        action = this.actions[ name ];

        if ( action ){
            event.preventDefault();
            action.call( this );
        }
    };

    ChkSnp.prototype.actions = {
        snapshot: function(){
            this.takeSnapshot();
        },
        save: function(){
            this.saveSnapshot();
        },
        retry: function(){
            this.displayStream();
        }
    };

    ChkSnp.prototype.takeSnapshot = function(){
        if ( this.cam.mediaStream ){
            this.$canvas.ctx.drawImage( this.$video[ 0 ], 0, 0 );
            this.$img.attr( 'src', this.$canvas[ 0 ].toDataURL( 'image/png' ) );
            this.$video.replaceWith( this.$img );
            this.$el.removeClass( this.options.streamingClass );
            this.$el.addClass( this.options.screenshotClass );
        }
        return this;
    };

    ChkSnp.prototype.getFilename = function(){
        var d = new Date(),
            filename = d.toDateString().replace( /\s/gi, '-' );
        return filename + '-deposit';
    };

    ChkSnp.prototype.saveSnapshot = function(){
        var filename = this.getFilename(),
            img = this.$img.attr( 'src' ),
            $a = $('<a />');

        $a.attr({ href: img, download: filename });
        $a[ 0 ].click();
        $a.remove();
    };

    ChkSnp.prototype.toggleLoadingIndicator = function( classes ){
        this.$el.toggleClass( this.options.loadingClass + ' ' + this.options.streamingClass );
        return this;
    };

    ChkSnp.prototype.startStream = function( media ){
        this.$video.attr( 'src', media.URL );
        this.$video[ 0 ].play();
        return this;
    };

    ChkSnp.prototype.displayStream = function(){
        this.$img.replaceWith( this.$video );
        this.$video[ 0 ].play();
        this.$el.removeClass( this.options.screenshotClass );
        this.$el.addClass( this.options.streamingClass );
        return this;
    };

    ChkSnp.prototype.displayError = function(){
        this.$el.addClass( this.options.errorClass );
    };

    return ChkSnp;
});
