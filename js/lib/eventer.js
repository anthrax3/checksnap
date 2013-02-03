/*global define: false, require: false */
define(function () {
    'use strict';

    var Eventer = function () {
        if ( !( this instanceof Eventer ) ) {
            return new Eventer();
        }
        this.__handlers = {};
    };

    Eventer.prototype.on = function ( eventName, callback ) {
        var names = eventName.split( ' ' ),
            name;

        for ( var i = 0, l = names.length; i < l; i += 1){
            name = names[ i ];
            if ( !this.__handlers[ name ] ) {
                this.__handlers[ name ] = [];
            }
            this.__handlers[ name ].push( callback );
        }

        return this;
    };

    Eventer.prototype.off = function ( eventName, callback ) {
        var names = eventName.split( ' ' ),
            handlers,
            name;

        for ( var i = 0, l = names.length; i < l; i += 1){
            name = names[ i ];
            handlers = this.__handlers[ name ];

            if ( !handlers ) { return this; }

            for ( var j = 0, k = handlers.length; j < k; j += 1 ) {
                if ( handlers[ j ] === callback || typeof callback !== 'function' ) {
                    handlers.splice( j, 1 );
                }
            }

            if ( handlers.length === 0 ) {
                delete this.__handlers[ name ];
            }
        }
        return this;
    };

    Eventer.prototype.emit = function ( eventName, data ) {
        var handlers = this.__handlers[ eventName ];

        if ( !handlers ) { return this; }

        for ( var i = 0, l = handlers.length; i < l; i = i + 1 ) {
            handlers[ i ].call( this, data );
        }
        return this;
    };

    Eventer.prototype.once = function ( eventName, callback ) {
        var self = this,
            names = eventName.split( ' ' ),
            makeHandler = function( name ){
                return function handler(){
                    self.off( name, handler );
                    callback.apply( this, arguments );
                };
            },
            name;

        for ( var i = 0, l = names.length; i < l; i += 1 ){
            name = names[ i ];
            this.on( name, makeHandler( name ) );
        }

        return this;
    };

    Eventer.prototype.getEventHandlers = function () {
        return this.__handlers;
    };

    return Eventer;
});
