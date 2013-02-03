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
        this.cam.on( 'error', function(){ console.log( 'errrrrrrr!' ); } );

        this.$video = $( this.options.display );
        this.$img = $( '<img width="640" height="480" />' );
        this.$canvas = $( '<canvas width="640" height="480" />' );
        this.$canvas.ctx = this.$canvas[ 0 ].getContext( '2d' );
    };

    ChkSnp.prototype.options = {
        display: '#js-cam-display',
        isLoadingClass: 'is-loading'
    };

    ChkSnp.prototype.setup = function(){
        this.$video.addClass( this.options.isLoadingClass );
        this.cam.setup();
        return this.listen();
    };

    ChkSnp.prototype.listen = function(){
        this.$video.on( 'loadedmetadata', this.toggleLoadingIndicator.bind( this ) );
        this.$video.on( 'click', this.snapshot.bind( this ) );
        return this;
    };

    ChkSnp.prototype.snapshot = function(){
        if ( this.cam.mediaStream ){
            this.$canvas.ctx.drawImage( this.$video[ 0 ], 0, 0 );
            this.$img.attr( 'src', this.$canvas[ 0 ].toDataURL( 'image/webp' ) );
            this.$video.after( this.$img );
        }
        return this;
    };

    ChkSnp.prototype.toggleLoadingIndicator = function(){
        this.$video.toggleClass( this.options.isLoadingClass );
        return this;
    };

    ChkSnp.prototype.displayStream = function( media ){
        this.$video.attr( 'src', media.URL );
        this.$video[ 0 ].play();
        return this;
    };

    return ChkSnp;
});
