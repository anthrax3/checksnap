require.config({
    paths : {
        jquery : 'lib/jquery'
    },
    waitSeconds: 180
});
require([ 'jquery' ], function( $ ){
    'use strict';

    console.dir( $ );
});
