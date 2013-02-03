require.config({
    paths : {
        jquery : 'lib/jquery'
    },
    waitSeconds: 180
});
require([ 'jquery', 'mods/checksnap' ], function( $, CheckSnap ){
    'use strict';

    var chksnp = new CheckSnap();
    chksnp.setup();
});
