/*global define: false, require: false */
define([ 'jquery', 'mods/camera' ], function ( $, Camera ) {
    'use strict';

    var ChkSnp = function( options ){
        if ( ! ( this instanceof ChkSnp ) ) {
            return new ChkSnp( options );
        }

        this.options = $.extend( {}, this.options, options );

        this.cam = new Camera();
        this.cam.on( 'mediaavailable', this.displayStream.bind( this ) );
        this.cam.on( 'error', this.displayError.bind( this ) );

        this.$el = $( this.options.container );
        this.$video = this.$el.find( 'video' );
        this.$img = $( '<img width="' + this.options.width + '" height="' + this.options.height + '" />' );
        this.$canvas = $( '<canvas width="' + this.options.width + '" height="' + this.options.height + '" />' );
        this.$canvas.ctx = this.$canvas[ 0 ].getContext( '2d' );
    };

    ChkSnp.prototype.options = {
        width: 640,
        height: 480,
        container: '#js-checksnap',
        errorMsg: '#js-checksnap-error',
        loadingClass: 'is-loading',
        streamingClass: 'is-streaming',
        errorClass: 'has-error'
    };

    ChkSnp.prototype.setup = function(){
        this.$el.addClass( this.options.loadingClass );
        this.cam.setup();
        return this;
    };

    ChkSnp.prototype.listen = function(){
        this.$video.one( 'click', this.setup.bind( this ) );
        this.$video.on( 'loadedmetadata', this.toggleLoadingIndicator.bind( this ) );
        $( document ).on( 'keydown.checksnap', this.onSnapshot.bind( this ) );
        return this;
    };

    ChkSnp.prototype.onSnapshot = function( event ){
        if ( event.which === 32 ){
            this.snapshot();
        }
    };

    ChkSnp.prototype.snapshot = function(){
        if ( this.cam.mediaStream ){
            this.$canvas.ctx.drawImage( this.$video[ 0 ], 0, 0 );
            this.$img.attr( 'src', this.$canvas[ 0 ].toDataURL( 'image/webp' ) );
            this.$video.replaceWith( this.$img );
            this.$el.removeClass( this.options.streamingClass );
        }
        return this;
    };

    ChkSnp.prototype.toggleLoadingIndicator = function(){
        this.$el.toggleClass( this.options.loadingClass + ' ' + this.options.streamingClass );
        return this;
    };

    ChkSnp.prototype.displayStream = function( media ){
        this.$video.attr( 'src', media.URL );
        this.$video[ 0 ].play();
        return this;
    };

    ChkSnp.prototype.displayError = function(){
        this.$el.addClass( this.options.errorClass );
    };

    return ChkSnp;
});
