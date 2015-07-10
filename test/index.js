/* global describe, it */
'use strict';

require('should');
var transmute = require( '../index.js' );

describe ( 'wishlist', function() {
	it( 'dreams big', function() {
		var now = new Date();
		var object = {
			foo: null,
			obj: {
				yak: true,
				emu: false,
				deeper: {
					sloth: true
				}
			},
			array: [ {
				one: true
			}, {
				two: true
			}, {
				three: true
			} ],
			otherArray: [ {
				one: true
			}, {
				two: true
			}, {
				three: true
			} ],
			date: now
		};

		var transmuted = transmute( object, [ {
			filter: {
				obj: true,
				array: true,
				date: true,
				otherArray: [ true, true ]
			}
		}, {
			remove: {
				date: true,
				obj: {
					emu: true
				}
			}
		}, {
			process: {
				obj: function( val ) {
					for ( var field in val ) {
						val[ field.toUpperCase() ] = val[ field ];
						delete val[ field ];
					}
					return val;
				}
			}
		} ] );

		transmuted.should.eql( {
			obj: {
				YAK: true,
				DEEPER: {
					sloth: true
				}
			},
			array: [ {
				one: true
			}, {
				two: true
			}, {
				three: true
			} ],
			otherArray: [ {
				one: true
			}, {
				two: true
			} ]
		} );
	} );
} );

describe( 'basic object', function() {
	var object = {
		foo: null,
		bar: 'string',
		baz: 10,
		yak: true
	};

	it( 'filters', function() {
		var transmuted = transmute( object, [ {
			filter: {
				foo: true
			}
		} ] );

		transmuted.should.have.property( 'foo' );
		transmuted.should.not.have.property( 'bar' );
		transmuted.should.not.have.property( 'baz' );
		transmuted.should.not.have.property( 'yak' );
	} );

	it( 'removes', function() {
		var transmuted = transmute( object, [ {
			remove: {
				foo: true
			}
		} ] );

		for ( var field in object ) {
			if ( !object.hasOwnProperty( field ) ) {
				continue;
			}

			if ( field === 'foo' ) {
				continue;
			}

			transmuted.should.have.property( field, object[ field ] );
		}

		transmuted.should.not.have.property( 'foo' );
	} );

	it( 'processes', function() {
		var transmuted = transmute( object, [ {
			process: {
				foo: function() {
					return false;
				}
			}
		} ] );

		transmuted.should.have.property( 'foo', false );
	} );
} );
