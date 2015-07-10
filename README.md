![object-transmute](/transmute.png?raw=true)

object-transmute
=========

object-transmute allows you to run objects through a series of transmutations.

## Installation

```
npm install --save object-transmute
```

## Usage

The module exports a single function: transmute

```javascript
var transmute = require( 'object-transmute' );

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
    } ]
};

var transmuted = transmute( object, [ {
    filter: {
        obj: true,
        array: true,
        otherArray: [ true, true ]
    }
}, {
    remove: {
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

console.log( JSON.stringify( transmuted, null, 4 ) );
```

Will result in an object that has been run through the following transmutations in order:

1) filter - only allow through the specified fields
2) remove - remove only the specified fields
3) process - process the specified fields using the given processors

```JSON
{
    "obj": {
        "YAK": true,
        "DEEPER": {
            "sloth": true
        }
    },
    "array": [
        {
            "one": true
        },
        {
            "two": true
        },
        {
            "three": true
        }
    ],
    "otherArray": [
        {
            "one": true
        },
        {
            "two": true
        }
    ]
}
```

## Contributing

Pull requests are very welcome! Just make sure your code:

1) Passes jshint given the included .jshintrc

2) Is beautified using jsbeautifier and the included .jsbeautifyrc

## Why?

I wanted a simple, reusable way to filter objects.

# CHANGELOG

v0.1.0
------
- Initial release.

# ATTRIBUTION
