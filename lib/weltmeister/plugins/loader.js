// THIS FILE IS DEPRECATED SEE README.

ig.module(
    'weltmeister.plugins.loader'
).requires(
    'weltmeister.weltmeister', 
    /*'weltmeister.plugins.save-extra', 'weltmeister.plugins.floodfill', */ 'weltmeister.plugins.entity-select',
    'weltmeister.plugins.labeltoggle', 'weltmeister.plugins.level-properties'
    // plugins here
).defines( function ( ) {
    'use strict';

    var loader = new wm.Loader( wm.Weltmeister, ig.resources );
    loader.load( );

} );
