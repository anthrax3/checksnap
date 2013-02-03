/*global define: false, require: false */

define(function(){
    'use strict';

    return function(child, parent){
        var F = function(){};
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
    };
});
