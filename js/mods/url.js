/*global define: false, require: false */
define(function () {
    'use strict';

    window.URL = window.URL || window.webkitURL;

    var url = {};

    url.supportsObjectURL = !! ( window.URL );

    url.createObjectURL = function( blob ){
        return window.URL.createObjectURL( blob );
    };

    url.revokeObjectURL = function( url ){
        window.URL.revokeObjectURL( url );
        return this;
    };

    return url;
});
