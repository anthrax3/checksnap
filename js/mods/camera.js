/*global define: false, require: false */
define([ 'lib/inherits', 'lib/eventer', 'mods/url' ], function ( inherits, Eventer, url ) {
    'use strict';

    window.Modernizr = window.Modernizr || {};
    navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia;

    var Cam = function( mediaConstraints ){
        if ( ! ( this instanceof Cam ) ) {
            return new Cam( mediaConstraints );
        }
        Eventer.call( this );
        this.mediaConstraints = mediaConstraints || this.mediaConstraints;
    };

    inherits( Cam, Eventer );

    Cam.prototype.isSupported = !! ( navigator.getUserMedia && window.Modernizr.video && url.supportsObjectURL );
    Cam.prototype.mediaStream = null;
    Cam.prototype.mediaURL = null;

    Cam.prototype.mediaConstraints = {
        // http://tools.ietf.org/html/draft-alvestrand-constraints-resolution-00#page-4
        video: {
            mandatory: {
                minWidth: 640,
                minHeight: 480
            }
        },
        audio: false
    };

    Cam.prototype.setup = function(){
        if ( ! this.isSupported ){
            return this.emitError( { code: 2 } );
        }

        navigator.getUserMedia(
            this.mediaConstraints,
            this.emitStream.bind( this ),
            this.emitError.bind( this )
        );

        return this;
    };

    Cam.prototype.emitStream = function( mediaStream ){
        this.mediaStream = mediaStream;
        this.mediaURL = url.createObjectURL( mediaStream );
        this.emit( 'mediaavailable', { stream: this.mediaStream, URL: this.mediaURL } );
        return this;
    };

    Cam.prototype.errorTypes = {
        1: 'denied',
        2: 'notsupported',
        3: 'mediaunavailable',
        unknown: 'unknown'
    };

    Cam.prototype.getErrorType = function( code ){
        return this.errorTypes[ code ] || this.errorTypes.unknown;
    };

    Cam.prototype.emitError = function( error ){
        var type = this.getErrorType( error.code );
        this.emit( 'error', type );
        this.emit( 'error:' + type );
        return this;
    };

    return Cam;
});
