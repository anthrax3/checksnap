require.config({
    paths : {
        jquery : 'libs/jquery'
    },
    waitSeconds: 180
});
require([ 'jquery' ], function( $ ){
    'use strict';

    console.dir( $ );
});
