'use strict';

var Delver = require( 'delver' );
var extend = require( 'extend' );
var traverse = require( 'traverse' );

module.exports = transmute;

function transmute( _object, transmutations ) {
    // ensure object has all fields from model
    var object = extend( true, Array.isArray( _object ) ? [] : {}, _object );

    transmutations.forEach( function( transmutation ) {
        var operation = Object.keys( transmutation )[ 0 ];
        transmute.operations[ operation ]( object, transmutation[ operation ] );
    } );

    return object;
}

transmute.operations = {};

transmute.operations.filter = function( object, filter ) {
    traverse( object ).forEach( function() {
        var element = this;

        if ( element.isRoot ) {
            return;
        }

        var path = null;

        for ( var i = 0; i < element.path.length; ++i ) {
            path = element.path.slice( 0, i + 1 ).join( '.' ).replace( /\.(\d+)(\.?)/g, '[$1]$2' );
            if ( Delver.get( filter, path ) === true ) {
                return;
            }

            if ( /\[\d+\]$/.test( path ) ) {
                var arrayPath = path.replace( /\[\d+\]$/, '' );
                var filteredArray = Delver.get( filter, arrayPath );
                if ( Array.isArray( filteredArray ) && filteredArray.length === 0 ) {
                    return;
                }
            }
        }

        if ( Delver.get( filter, path ) !== undefined ) {
            return;
        }

        element.remove( true );
    } );
};

transmute.operations.remove = function( object, filter ) {
    traverse( object ).forEach( function() {
        var element = this;

        if ( element.isRoot ) {
            return;
        }

        var path = null;

        for ( var i = 0; i < element.path.length; ++i ) {
            path = element.path.slice( 0, i + 1 ).join( '.' ).replace( /\.(\d+)(\.?)/g, '[$1]$2' );
            if ( Delver.get( filter, path ) === true ) {
                element.remove( true );
                return;
            }
        }
    } );
};

transmute.operations.process = function( object, filter ) {
    traverse( object ).forEach( function( value ) {
        var element = this;

        if ( element.isRoot ) {
            return;
        }

        var path = element.path.join( '.' ).replace( /\.(\d+)(\.?)/g, '[$1]$2' );

        var processor = Delver.get( filter, path );
        if ( !processor ) {
            return;
        }

        this.update( processor( value ), true );
    } );
};
