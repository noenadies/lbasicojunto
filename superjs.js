/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */
(function( window, undefined ) {

    // Can't do this because several apps including ASP.NET trace
    // the stack via arguments.caller.callee and Firefox dies if
    // you try to trace through "use strict" call chains. (#13335)
    // Support: Firefox 18+
    //"use strict";
    var
        // The deferred used on DOM ready
        readyList,
    
        // A central reference to the root jQuery(document)
        rootjQuery,
    
        // Support: IE<10
        // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
        core_strundefined = typeof undefined,
    
        // Use the correct document accordingly with window argument (sandbox)
        location = window.location,
        document = window.document,
        docElem = document.documentElement,
    
        // Map over jQuery in case of overwrite
        _jQuery = window.jQuery,
    
        // Map over the $ in case of overwrite
        _$ = window.$,
    
        // [[Class]] -> type pairs
        class2type = {},
    
        // List of deleted data cache ids, so we can reuse them
        core_deletedIds = [],
    
        core_version = "1.10.2",
    
        // Save a reference to some core methods
        core_concat = core_deletedIds.concat,
        core_push = core_deletedIds.push,
        core_slice = core_deletedIds.slice,
        core_indexOf = core_deletedIds.indexOf,
        core_toString = class2type.toString,
        core_hasOwn = class2type.hasOwnProperty,
        core_trim = core_version.trim,
    
        // Define a local copy of jQuery
        jQuery = function( selector, context ) {
            // The jQuery object is actually just the init constructor 'enhanced'
            return new jQuery.fn.init( selector, context, rootjQuery );
        },
    
        // Used for matching numbers
        core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    
        // Used for splitting on whitespace
        core_rnotwhite = /\S+/g,
    
        // Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    
        // A simple way to check for HTML strings
        // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
        // Strict HTML recognition (#11290: must start with <)
        rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    
        // Match a standalone tag
        rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    
        // JSON RegExp
        rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,
    
        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([\da-z])/gi,
    
        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        },
    
        // The ready event handler
        completed = function( event ) {
    
            // readyState === "complete" is good enough for us to call the dom ready in oldIE
            if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
                detach();
                jQuery.ready();
            }
        },
        // Clean-up method for dom ready events
        detach = function() {
            if ( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", completed, false );
                window.removeEventListener( "load", completed, false );
    
            } else {
                document.detachEvent( "onreadystatechange", completed );
                window.detachEvent( "onload", completed );
            }
        };
    
    jQuery.fn = jQuery.prototype = {
        // The current version of jQuery being used
        jquery: core_version,
    
        constructor: jQuery,
        init: function( selector, context, rootjQuery ) {
            var match, elem;
    
            // HANDLE: $(""), $(null), $(undefined), $(false)
            if ( !selector ) {
                return this;
            }
    
            // Handle HTML strings
            if ( typeof selector === "string" ) {
                if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                    // Assume that strings that start and end with <> are HTML and skip the regex check
                    match = [ null, selector, null ];
    
                } else {
                    match = rquickExpr.exec( selector );
                }
    
                // Match html or make sure no context is specified for #id
                if ( match && (match[1] || !context) ) {
    
                    // HANDLE: $(html) -> $(array)
                    if ( match[1] ) {
                        context = context instanceof jQuery ? context[0] : context;
    
                        // scripts is true for back-compat
                        jQuery.merge( this, jQuery.parseHTML(
                            match[1],
                            context && context.nodeType ? context.ownerDocument || context : document,
                            true
                        ) );
    
                        // HANDLE: $(html, props)
                        if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
                            for ( match in context ) {
                                // Properties of context are called as methods if possible
                                if ( jQuery.isFunction( this[ match ] ) ) {
                                    this[ match ]( context[ match ] );
    
                                // ...and otherwise set as attributes
                                } else {
                                    this.attr( match, context[ match ] );
                                }
                            }
                        }
    
                        return this;
    
                    // HANDLE: $(#id)
                    } else {
                        elem = document.getElementById( match[2] );
    
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id !== match[2] ) {
                                return rootjQuery.find( selector );
                            }
    
                            // Otherwise, we inject the element directly into the jQuery object
                            this.length = 1;
                            this[0] = elem;
                        }
    
                        this.context = document;
                        this.selector = selector;
                        return this;
                    }
    
                // HANDLE: $(expr, $(...))
                } else if ( !context || context.jquery ) {
                    return ( context || rootjQuery ).find( selector );
    
                // HANDLE: $(expr, context)
                // (which is just equivalent to: $(context).find(expr)
                } else {
                    return this.constructor( context ).find( selector );
                }
    
            // HANDLE: $(DOMElement)
            } else if ( selector.nodeType ) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
    
            // HANDLE: $(function)
            // Shortcut for document ready
            } else if ( jQuery.isFunction( selector ) ) {
                return rootjQuery.ready( selector );
            }
    
            if ( selector.selector !== undefined ) {
                this.selector = selector.selector;
                this.context = selector.context;
            }
    
            return jQuery.makeArray( selector, this );
        },
    
        // Start with an empty selector
        selector: "",
    
        // The default length of a jQuery object is 0
        length: 0,
    
        toArray: function() {
            return core_slice.call( this );
        },
    
        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function( num ) {
            return num == null ?
    
                // Return a 'clean' array
                this.toArray() :
    
                // Return just the object
                ( num < 0 ? this[ this.length + num ] : this[ num ] );
        },
    
        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function( elems ) {
    
            // Build a new jQuery matched element set
            var ret = jQuery.merge( this.constructor(), elems );
    
            // Add the old object onto the stack (as a reference)
            ret.prevObject = this;
            ret.context = this.context;
    
            // Return the newly-formed element set
            return ret;
        },
    
        // Execute a callback for every element in the matched set.
        // (You can seed the arguments with an array of args, but this is
        // only used internally.)
        each: function( callback, args ) {
            return jQuery.each( this, callback, args );
        },
    
        ready: function( fn ) {
            // Add the callback
            jQuery.ready.promise().done( fn );
    
            return this;
        },
    
        slice: function() {
            return this.pushStack( core_slice.apply( this, arguments ) );
        },
    
        first: function() {
            return this.eq( 0 );
        },
    
        last: function() {
            return this.eq( -1 );
        },
    
        eq: function( i ) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
        },
    
        map: function( callback ) {
            return this.pushStack( jQuery.map(this, function( elem, i ) {
                return callback.call( elem, i, elem );
            }));
        },
    
        end: function() {
            return this.prevObject || this.constructor(null);
        },
    
        // For internal use only.
        // Behaves like an Array's method, not like a jQuery method.
        push: core_push,
        sort: [].sort,
        splice: [].splice
    };
    
    // Give the init function the jQuery prototype for later instantiation
    jQuery.fn.init.prototype = jQuery.fn;
    
    jQuery.extend = jQuery.fn.extend = function() {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
    
        // Handle a deep copy situation
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
    
        // Handle case when target is a string or something (possible in deep copy)
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }
    
        // extend jQuery itself if only one argument is passed
        if ( length === i ) {
            target = this;
            --i;
        }
    
        for ( ; i < length; i++ ) {
            // Only deal with non-null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // Extend the base object
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
    
                    // Prevent never-ending loop
                    if ( target === copy ) {
                        continue;
                    }
    
                    // Recurse if we're merging plain objects or arrays
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
    
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
    
                        // Never move original objects, clone them
                        target[ name ] = jQuery.extend( deep, clone, copy );
    
                    // Don't bring in undefined values
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
    
        // Return the modified object
        return target;
    };
    
    jQuery.extend({
        // Unique for each copy of jQuery on the page
        // Non-digits removed to match rinlinejQuery
        expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),
    
        noConflict: function( deep ) {
            if ( window.$ === jQuery ) {
                window.$ = _$;
            }
    
            if ( deep && window.jQuery === jQuery ) {
                window.jQuery = _jQuery;
            }
    
            return jQuery;
        },
    
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
    
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
    
        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                jQuery.readyWait++;
            } else {
                jQuery.ready( true );
            }
        },
    
        // Handle when the DOM is ready
        ready: function( wait ) {
    
            // Abort if there are pending holds or we're already ready
            if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
                return;
            }
    
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready );
            }
    
            // Remember that the DOM is ready
            jQuery.isReady = true;
    
            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }
    
            // If there are functions bound, to execute
            readyList.resolveWith( document, [ jQuery ] );
    
            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger("ready").off("ready");
            }
        },
    
        // See test/unit/core.js for details concerning isFunction.
        // Since version 1.3, DOM methods and functions like alert
        // aren't supported. They return false on IE (#2968).
        isFunction: function( obj ) {
            return jQuery.type(obj) === "function";
        },
    
        isArray: Array.isArray || function( obj ) {
            return jQuery.type(obj) === "array";
        },
    
        isWindow: function( obj ) {
            /* jshint eqeqeq: false */
            return obj != null && obj == obj.window;
        },
    
        isNumeric: function( obj ) {
            return !isNaN( parseFloat(obj) ) && isFinite( obj );
        },
    
        type: function( obj ) {
            if ( obj == null ) {
                return String( obj );
            }
            return typeof obj === "object" || typeof obj === "function" ?
                class2type[ core_toString.call(obj) ] || "object" :
                typeof obj;
        },
    
        isPlainObject: function( obj ) {
            var key;
    
            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
                return false;
            }
    
            try {
                // Not own constructor property must be Object
                if ( obj.constructor &&
                    !core_hasOwn.call(obj, "constructor") &&
                    !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                    return false;
                }
            } catch ( e ) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }
    
            // Support: IE<9
            // Handle iteration over inherited properties before own properties.
            if ( jQuery.support.ownLast ) {
                for ( key in obj ) {
                    return core_hasOwn.call( obj, key );
                }
            }
    
            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for ( key in obj ) {}
    
            return key === undefined || core_hasOwn.call( obj, key );
        },
    
        isEmptyObject: function( obj ) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        },
    
        error: function( msg ) {
            throw new Error( msg );
        },
    
        // data: string of html
        // context (optional): If specified, the fragment will be created in this context, defaults to document
        // keepScripts (optional): If true, will include scripts passed in the html string
        parseHTML: function( data, context, keepScripts ) {
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            if ( typeof context === "boolean" ) {
                keepScripts = context;
                context = false;
            }
            context = context || document;
    
            var parsed = rsingleTag.exec( data ),
                scripts = !keepScripts && [];
    
            // Single tag
            if ( parsed ) {
                return [ context.createElement( parsed[1] ) ];
            }
    
            parsed = jQuery.buildFragment( [ data ], context, scripts );
            if ( scripts ) {
                jQuery( scripts ).remove();
            }
            return jQuery.merge( [], parsed.childNodes );
        },
    
        parseJSON: function( data ) {
            // Attempt to parse using the native JSON parser first
            if ( window.JSON && window.JSON.parse ) {
                return window.JSON.parse( data );
            }
    
            if ( data === null ) {
                return data;
            }
    
            if ( typeof data === "string" ) {
    
                // Make sure leading/trailing whitespace is removed (IE can't handle it)
                data = jQuery.trim( data );
    
                if ( data ) {
                    // Make sure the incoming data is actual JSON
                    // Logic borrowed from http://json.org/json2.js
                    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
                        .replace( rvalidtokens, "]" )
                        .replace( rvalidbraces, "")) ) {
    
                        return ( new Function( "return " + data ) )();
                    }
                }
            }
    
            jQuery.error( "Invalid JSON: " + data );
        },
    
        // Cross-browser xml parsing
        parseXML: function( data ) {
            var xml, tmp;
            if ( !data || typeof data !== "string" ) {
                return null;
            }
            try {
                if ( window.DOMParser ) { // Standard
                    tmp = new DOMParser();
                    xml = tmp.parseFromString( data , "text/xml" );
                } else { // IE
                    xml = new ActiveXObject( "Microsoft.XMLDOM" );
                    xml.async = "false";
                    xml.loadXML( data );
                }
            } catch( e ) {
                xml = undefined;
            }
            if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
                jQuery.error( "Invalid XML: " + data );
            }
            return xml;
        },
    
        noop: function() {},
    
        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function( data ) {
            if ( data && jQuery.trim( data ) ) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                ( window.execScript || function( data ) {
                    window[ "eval" ].call( window, data );
                } )( data );
            }
        },
    
        // Convert dashed to camelCase; used by the css and data modules
        // Microsoft forgot to hump their vendor prefix (#9572)
        camelCase: function( string ) {
            return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
        },
    
        nodeName: function( elem, name ) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
    
        // args is for internal usage only
        each: function( obj, callback, args ) {
            var value,
                i = 0,
                length = obj.length,
                isArray = isArraylike( obj );
    
            if ( args ) {
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback.apply( obj[ i ], args );
    
                        if ( value === false ) {
                            break;
                        }
                    }
                } else {
                    for ( i in obj ) {
                        value = callback.apply( obj[ i ], args );
    
                        if ( value === false ) {
                            break;
                        }
                    }
                }
    
            // A special, fast, case for the most common use of each
            } else {
                if ( isArray ) {
                    for ( ; i < length; i++ ) {
                        value = callback.call( obj[ i ], i, obj[ i ] );
    
                        if ( value === false ) {
                            break;
                        }
                    }
                } else {
                    for ( i in obj ) {
                        value = callback.call( obj[ i ], i, obj[ i ] );
    
                        if ( value === false ) {
                            break;
                        }
                    }
                }
            }
    
            return obj;
        },
    
        // Use native String.trim function wherever possible
        trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
            function( text ) {
                return text == null ?
                    "" :
                    core_trim.call( text );
            } :
    
            // Otherwise use our own trimming functionality
            function( text ) {
                return text == null ?
                    "" :
                    ( text + "" ).replace( rtrim, "" );
            },
    
        // results is for internal usage only
        makeArray: function( arr, results ) {
            var ret = results || [];
    
            if ( arr != null ) {
                if ( isArraylike( Object(arr) ) ) {
                    jQuery.merge( ret,
                        typeof arr === "string" ?
                        [ arr ] : arr
                    );
                } else {
                    core_push.call( ret, arr );
                }
            }
    
            return ret;
        },
    
        inArray: function( elem, arr, i ) {
            var len;
    
            if ( arr ) {
                if ( core_indexOf ) {
                    return core_indexOf.call( arr, elem, i );
                }
    
                len = arr.length;
                i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;
    
                for ( ; i < len; i++ ) {
                    // Skip accessing in sparse arrays
                    if ( i in arr && arr[ i ] === elem ) {
                        return i;
                    }
                }
            }
    
            return -1;
        },
    
        merge: function( first, second ) {
            var l = second.length,
                i = first.length,
                j = 0;
    
            if ( typeof l === "number" ) {
                for ( ; j < l; j++ ) {
                    first[ i++ ] = second[ j ];
                }
            } else {
                while ( second[j] !== undefined ) {
                    first[ i++ ] = second[ j++ ];
                }
            }
    
            first.length = i;
    
            return first;
        },
    
        grep: function( elems, callback, inv ) {
            var retVal,
                ret = [],
                i = 0,
                length = elems.length;
            inv = !!inv;
    
            // Go through the array, only saving the items
            // that pass the validator function
            for ( ; i < length; i++ ) {
                retVal = !!callback( elems[ i ], i );
                if ( inv !== retVal ) {
                    ret.push( elems[ i ] );
                }
            }
    
            return ret;
        },
    
        // arg is for internal usage only
        map: function( elems, callback, arg ) {
            var value,
                i = 0,
                length = elems.length,
                isArray = isArraylike( elems ),
                ret = [];
    
            // Go through the array, translating each of the items to their
            if ( isArray ) {
                for ( ; i < length; i++ ) {
                    value = callback( elems[ i ], i, arg );
    
                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }
    
            // Go through every key on the object,
            } else {
                for ( i in elems ) {
                    value = callback( elems[ i ], i, arg );
    
                    if ( value != null ) {
                        ret[ ret.length ] = value;
                    }
                }
            }
    
    
            // Flatten any nested arrays
            return core_concat.apply( [], ret );
        },
    
        // A global GUID counter for objects
        guid: 1,
    
        // Bind a function to a context, optionally partially applying any
        // arguments.
        proxy: function( fn, context ) {
            var args, proxy, tmp;
    
            if ( typeof context === "string" ) {
                tmp = fn[ context ];
                context = fn;
                fn = tmp;
            }
    
            // Quick check to determine if target is callable, in the spec
            // this throws a TypeError, but we will just return undefined.
            if ( !jQuery.isFunction( fn ) ) {
                return undefined;
            }
    
            // Simulated bind
            args = core_slice.call( arguments, 2 );
            proxy = function() {
                return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
            };
    
            // Set the guid of unique handler to the same of original handler, so it can be removed
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
    
            return proxy;
        },
    
        // Multifunctional method to get and set values of a collection
        // The value/s can optionally be executed if it's a function
        access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
            var i = 0,
                length = elems.length,
                bulk = key == null;
    
            // Sets many values
            if ( jQuery.type( key ) === "object" ) {
                chainable = true;
                for ( i in key ) {
                    jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
                }
    
            // Sets one value
            } else if ( value !== undefined ) {
                chainable = true;
    
                if ( !jQuery.isFunction( value ) ) {
                    raw = true;
                }
    
                if ( bulk ) {
                    // Bulk operations run against the entire set
                    if ( raw ) {
                        fn.call( elems, value );
                        fn = null;
    
                    // ...except when executing function values
                    } else {
                        bulk = fn;
                        fn = function( elem, key, value ) {
                            return bulk.call( jQuery( elem ), value );
                        };
                    }
                }
    
                if ( fn ) {
                    for ( ; i < length; i++ ) {
                        fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
                    }
                }
            }
    
            return chainable ?
                elems :
    
                // Gets
                bulk ?
                    fn.call( elems ) :
                    length ? fn( elems[0], key ) : emptyGet;
        },
    
        now: function() {
            return ( new Date() ).getTime();
        },
    
        // A method for quickly swapping in/out CSS properties to get correct calculations.
        // Note: this method belongs to the css module but it's needed here for the support module.
        // If support gets modularized, this method should be moved back to the css module.
        swap: function( elem, options, callback, args ) {
            var ret, name,
                old = {};
    
            // Remember the old values, and insert the new ones
            for ( name in options ) {
                old[ name ] = elem.style[ name ];
                elem.style[ name ] = options[ name ];
            }
    
            ret = callback.apply( elem, args || [] );
    
            // Revert the old values
            for ( name in options ) {
                elem.style[ name ] = old[ name ];
            }
    
            return ret;
        }
    });
    
    jQuery.ready.promise = function( obj ) {
        if ( !readyList ) {
    
            readyList = jQuery.Deferred();
    
            // Catch cases where $(document).ready() is called after the browser event has already occurred.
            // we once tried to use readyState "interactive" here, but it caused issues like the one
            // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                setTimeout( jQuery.ready );
    
            // Standards-based browsers support DOMContentLoaded
            } else if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", completed, false );
    
                // A fallback to window.onload, that will always work
                window.addEventListener( "load", completed, false );
    
            // If IE event model is used
            } else {
                // Ensure firing before onload, maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", completed );
    
                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", completed );
    
                // If IE and not a frame
                // continually check to see if the document is ready
                var top = false;
    
                try {
                    top = window.frameElement == null && document.documentElement;
                } catch(e) {}
    
                if ( top && top.doScroll ) {
                    (function doScrollCheck() {
                        if ( !jQuery.isReady ) {
    
                            try {
                                // Use the trick by Diego Perini
                                // http://javascript.nwbox.com/IEContentLoaded/
                                top.doScroll("left");
                            } catch(e) {
                                return setTimeout( doScrollCheck, 50 );
                            }
    
                            // detach all dom ready events
                            detach();
    
                            // and execute any waiting functions
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise( obj );
    };
    
    // Populate the class2type map
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type[ "[object " + name + "]" ] = name.toLowerCase();
    });
    
    function isArraylike( obj ) {
        var length = obj.length,
            type = jQuery.type( obj );
    
        if ( jQuery.isWindow( obj ) ) {
            return false;
        }
    
        if ( obj.nodeType === 1 && length ) {
            return true;
        }
    
        return type === "array" || type !== "function" &&
            ( length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj );
    }
    
    // All jQuery objects should point back to these
    rootjQuery = jQuery(document);
    /*!
     * Sizzle CSS Selector Engine v1.10.2
     * http://sizzlejs.com/
     *
     * Copyright 2013 jQuery Foundation, Inc. and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2013-07-03
     */
    (function( window, undefined ) {
    
    var i,
        support,
        cachedruns,
        Expr,
        getText,
        isXML,
        compile,
        outermostContext,
        sortInput,
    
        // Local document vars
        setDocument,
        document,
        docElem,
        documentIsHTML,
        rbuggyQSA,
        rbuggyMatches,
        matches,
        contains,
    
        // Instance-specific data
        expando = "sizzle" + -(new Date()),
        preferredDoc = window.document,
        dirruns = 0,
        done = 0,
        classCache = createCache(),
        tokenCache = createCache(),
        compilerCache = createCache(),
        hasDuplicate = false,
        sortOrder = function( a, b ) {
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
            }
            return 0;
        },
    
        // General-purpose constants
        strundefined = typeof undefined,
        MAX_NEGATIVE = 1 << 31,
    
        // Instance methods
        hasOwn = ({}).hasOwnProperty,
        arr = [],
        pop = arr.pop,
        push_native = arr.push,
        push = arr.push,
        slice = arr.slice,
        // Use a stripped-down indexOf if we can't use a native one
        indexOf = arr.indexOf || function( elem ) {
            var i = 0,
                len = this.length;
            for ( ; i < len; i++ ) {
                if ( this[i] === elem ) {
                    return i;
                }
            }
            return -1;
        },
    
        booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
    
        // Regular expressions
    
        // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/css3-syntax/#characters
        characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
    
        // Loosely modeled on CSS identifier characters
        // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
        // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
        identifier = characterEncoding.replace( "w", "w#" ),
    
        // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
        attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
            "*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
    
        // Prefer arguments quoted,
        //   then not containing pseudos/brackets,
        //   then attribute selectors/non-parenthetical expressions,
        //   then anything else
        // These preferences are here to reduce the number of selectors
        //   needing tokenize in the PSEUDO preFilter
        pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",
    
        // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
        rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
    
        rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
        rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
    
        rsibling = new RegExp( whitespace + "*[+~]" ),
        rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),
    
        rpseudo = new RegExp( pseudos ),
        ridentifier = new RegExp( "^" + identifier + "$" ),
    
        matchExpr = {
            "ID": new RegExp( "^#(" + characterEncoding + ")" ),
            "CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
            "TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
            "ATTR": new RegExp( "^" + attributes ),
            "PSEUDO": new RegExp( "^" + pseudos ),
            "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
                "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
                "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
            "bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
            // For use in libraries implementing .is()
            // We use this for POS matching in `select`
            "needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
        },
    
        rnative = /^[^{]+\{\s*\[native \w/,
    
        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    
        rinputs = /^(?:input|select|textarea|button)$/i,
        rheader = /^h\d$/i,
    
        rescape = /'|\\/g,
    
        // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
        funescape = function( _, escaped, escapedWhitespace ) {
            var high = "0x" + escaped - 0x10000;
            // NaN means non-codepoint
            // Support: Firefox
            // Workaround erroneous numeric interpretation of +"0x"
            return high !== high || escapedWhitespace ?
                escaped :
                // BMP codepoint
                high < 0 ?
                    String.fromCharCode( high + 0x10000 ) :
                    // Supplemental Plane codepoint (surrogate pair)
                    String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
        };
    
    // Optimize for push.apply( _, NodeList )
    try {
        push.apply(
            (arr = slice.call( preferredDoc.childNodes )),
            preferredDoc.childNodes
        );
        // Support: Android<4.0
        // Detect silently failing push.apply
        arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
        push = { apply: arr.length ?
    
            // Leverage slice if possible
            function( target, els ) {
                push_native.apply( target, slice.call(els) );
            } :
    
            // Support: IE<9
            // Otherwise append directly
            function( target, els ) {
                var j = target.length,
                    i = 0;
                // Can't trust NodeList.length
                while ( (target[j++] = els[i++]) ) {}
                target.length = j - 1;
            }
        };
    }
    
    function Sizzle( selector, context, results, seed ) {
        var match, elem, m, nodeType,
            // QSA vars
            i, groups, old, nid, newContext, newSelector;
    
        if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
            setDocument( context );
        }
    
        context = context || document;
        results = results || [];
    
        if ( !selector || typeof selector !== "string" ) {
            return results;
        }
    
        if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
            return [];
        }
    
        if ( documentIsHTML && !seed ) {
    
            // Shortcuts
            if ( (match = rquickExpr.exec( selector )) ) {
                // Speed-up: Sizzle("#ID")
                if ( (m = match[1]) ) {
                    if ( nodeType === 9 ) {
                        elem = context.getElementById( m );
                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE, Opera, and Webkit return items
                            // by name instead of ID
                            if ( elem.id === m ) {
                                results.push( elem );
                                return results;
                            }
                        } else {
                            return results;
                        }
                    } else {
                        // Context is not a document
                        if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
                            contains( context, elem ) && elem.id === m ) {
                            results.push( elem );
                            return results;
                        }
                    }
    
                // Speed-up: Sizzle("TAG")
                } else if ( match[2] ) {
                    push.apply( results, context.getElementsByTagName( selector ) );
                    return results;
    
                // Speed-up: Sizzle(".CLASS")
                } else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
                    push.apply( results, context.getElementsByClassName( m ) );
                    return results;
                }
            }
    
            // QSA path
            if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
                nid = old = expando;
                newContext = context;
                newSelector = nodeType === 9 && selector;
    
                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                // IE 8 doesn't work on object elements
                if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                    groups = tokenize( selector );
    
                    if ( (old = context.getAttribute("id")) ) {
                        nid = old.replace( rescape, "\\$&" );
                    } else {
                        context.setAttribute( "id", nid );
                    }
                    nid = "[id='" + nid + "'] ";
    
                    i = groups.length;
                    while ( i-- ) {
                        groups[i] = nid + toSelector( groups[i] );
                    }
                    newContext = rsibling.test( selector ) && context.parentNode || context;
                    newSelector = groups.join(",");
                }
    
                if ( newSelector ) {
                    try {
                        push.apply( results,
                            newContext.querySelectorAll( newSelector )
                        );
                        return results;
                    } catch(qsaError) {
                    } finally {
                        if ( !old ) {
                            context.removeAttribute("id");
                        }
                    }
                }
            }
        }
    
        // All others
        return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }
    
    /**
     * Create key-value caches of limited size
     * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
        var keys = [];
    
        function cache( key, value ) {
            // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
            if ( keys.push( key += " " ) > Expr.cacheLength ) {
                // Only keep the most recent entries
                delete cache[ keys.shift() ];
            }
            return (cache[ key ] = value);
        }
        return cache;
    }
    
    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
        fn[ expando ] = true;
        return fn;
    }
    
    /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */
    function assert( fn ) {
        var div = document.createElement("div");
    
        try {
            return !!fn( div );
        } catch (e) {
            return false;
        } finally {
            // Remove from its parent by default
            if ( div.parentNode ) {
                div.parentNode.removeChild( div );
            }
            // release memory in IE
            div = null;
        }
    }
    
    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
        var arr = attrs.split("|"),
            i = attrs.length;
    
        while ( i-- ) {
            Expr.attrHandle[ arr[i] ] = handler;
        }
    }
    
    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
        var cur = b && a,
            diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
                ( ~b.sourceIndex || MAX_NEGATIVE ) -
                ( ~a.sourceIndex || MAX_NEGATIVE );
    
        // Use IE sourceIndex if available on both nodes
        if ( diff ) {
            return diff;
        }
    
        // Check if b follows a
        if ( cur ) {
            while ( (cur = cur.nextSibling) ) {
                if ( cur === b ) {
                    return -1;
                }
            }
        }
    
        return a ? 1 : -1;
    }
    
    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
        return function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && elem.type === type;
        };
    }
    
    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
        return function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && elem.type === type;
        };
    }
    
    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
        return markFunction(function( argument ) {
            argument = +argument;
            return markFunction(function( seed, matches ) {
                var j,
                    matchIndexes = fn( [], seed.length, argument ),
                    i = matchIndexes.length;
    
                // Match elements found at the specified indexes
                while ( i-- ) {
                    if ( seed[ (j = matchIndexes[i]) ] ) {
                        seed[j] = !(matches[j] = seed[j]);
                    }
                }
            });
        });
    }
    
    /**
     * Detect xml
     * @param {Element|Object} elem An element or a document
     */
    isXML = Sizzle.isXML = function( elem ) {
        // documentElement is verified for cases where it doesn't yet exist
        // (such as loading iframes in IE - #4833)
        var documentElement = elem && (elem.ownerDocument || elem).documentElement;
        return documentElement ? documentElement.nodeName !== "HTML" : false;
    };
    
    // Expose support vars for convenience
    support = Sizzle.support = {};
    
    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
        var doc = node ? node.ownerDocument || node : preferredDoc,
            parent = doc.defaultView;
    
        // If no document and documentElement is available, return
        if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
            return document;
        }
    
        // Set our document
        document = doc;
        docElem = doc.documentElement;
    
        // Support tests
        documentIsHTML = !isXML( doc );
    
        // Support: IE>8
        // If iframe document is assigned to "document" variable and if iframe has been reloaded,
        // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
        // IE6-8 do not support the defaultView property so parent will be undefined
        if ( parent && parent.attachEvent && parent !== parent.top ) {
            parent.attachEvent( "onbeforeunload", function() {
                setDocument();
            });
        }
    
        /* Attributes
        ---------------------------------------------------------------------- */
    
        // Support: IE<8
        // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
        support.attributes = assert(function( div ) {
            div.className = "i";
            return !div.getAttribute("className");
        });
    
        /* getElement(s)By*
        ---------------------------------------------------------------------- */
    
        // Check if getElementsByTagName("*") returns only elements
        support.getElementsByTagName = assert(function( div ) {
            div.appendChild( doc.createComment("") );
            return !div.getElementsByTagName("*").length;
        });
    
        // Check if getElementsByClassName can be trusted
        support.getElementsByClassName = assert(function( div ) {
            div.innerHTML = "<div class='a'></div><div class='a i'></div>";
    
            // Support: Safari<4
            // Catch class over-caching
            div.firstChild.className = "i";
            // Support: Opera<10
            // Catch gEBCN failure to find non-leading classes
            return div.getElementsByClassName("i").length === 2;
        });
    
        // Support: IE<10
        // Check if getElementById returns elements by name
        // The broken getElementById methods don't pick up programatically-set names,
        // so use a roundabout getElementsByName test
        support.getById = assert(function( div ) {
            docElem.appendChild( div ).id = expando;
            return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
        });
    
        // ID find and filter
        if ( support.getById ) {
            Expr.find["ID"] = function( id, context ) {
                if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
                    var m = context.getElementById( id );
                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    return m && m.parentNode ? [m] : [];
                }
            };
            Expr.filter["ID"] = function( id ) {
                var attrId = id.replace( runescape, funescape );
                return function( elem ) {
                    return elem.getAttribute("id") === attrId;
                };
            };
        } else {
            // Support: IE6/7
            // getElementById is not reliable as a find shortcut
            delete Expr.find["ID"];
    
            Expr.filter["ID"] =  function( id ) {
                var attrId = id.replace( runescape, funescape );
                return function( elem ) {
                    var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                    return node && node.value === attrId;
                };
            };
        }
    
        // Tag
        Expr.find["TAG"] = support.getElementsByTagName ?
            function( tag, context ) {
                if ( typeof context.getElementsByTagName !== strundefined ) {
                    return context.getElementsByTagName( tag );
                }
            } :
            function( tag, context ) {
                var elem,
                    tmp = [],
                    i = 0,
                    results = context.getElementsByTagName( tag );
    
                // Filter out possible comments
                if ( tag === "*" ) {
                    while ( (elem = results[i++]) ) {
                        if ( elem.nodeType === 1 ) {
                            tmp.push( elem );
                        }
                    }
    
                    return tmp;
                }
                return results;
            };
    
        // Class
        Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
            if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
                return context.getElementsByClassName( className );
            }
        };
    
        /* QSA/matchesSelector
        ---------------------------------------------------------------------- */
    
        // QSA and matchesSelector support
    
        // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
        rbuggyMatches = [];
    
        // qSa(:focus) reports false when true (Chrome 21)
        // We allow this because of a bug in IE8/9 that throws an error
        // whenever `document.activeElement` is accessed on an iframe
        // So, we allow :focus to pass through QSA all the time to avoid the IE error
        // See http://bugs.jquery.com/ticket/13378
        rbuggyQSA = [];
    
        if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
            // Build QSA regex
            // Regex strategy adopted from Diego Perini
            assert(function( div ) {
                // Select is set to empty string on purpose
                // This is to test IE's treatment of not explicitly
                // setting a boolean content attribute,
                // since its presence should be enough
                // http://bugs.jquery.com/ticket/12359
                div.innerHTML = "<select><option selected=''></option></select>";
    
                // Support: IE8
                // Boolean attributes and "value" are not treated correctly
                if ( !div.querySelectorAll("[selected]").length ) {
                    rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
                }
    
                // Webkit/Opera - :checked should return selected option elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                // IE8 throws error here and will not see later tests
                if ( !div.querySelectorAll(":checked").length ) {
                    rbuggyQSA.push(":checked");
                }
            });
    
            assert(function( div ) {
    
                // Support: Opera 10-12/IE8
                // ^= $= *= and empty values
                // Should not select anything
                // Support: Windows 8 Native Apps
                // The type attribute is restricted during .innerHTML assignment
                var input = doc.createElement("input");
                input.setAttribute( "type", "hidden" );
                div.appendChild( input ).setAttribute( "t", "" );
    
                if ( div.querySelectorAll("[t^='']").length ) {
                    rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
                }
    
                // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
                // IE8 throws error here and will not see later tests
                if ( !div.querySelectorAll(":enabled").length ) {
                    rbuggyQSA.push( ":enabled", ":disabled" );
                }
    
                // Opera 10-11 does not throw on post-comma invalid pseudos
                div.querySelectorAll("*,:x");
                rbuggyQSA.push(",.*:");
            });
        }
    
        if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
            docElem.mozMatchesSelector ||
            docElem.oMatchesSelector ||
            docElem.msMatchesSelector) )) ) {
    
            assert(function( div ) {
                // Check to see if it's possible to do matchesSelector
                // on a disconnected node (IE 9)
                support.disconnectedMatch = matches.call( div, "div" );
    
                // This should fail with an exception
                // Gecko does not error, returns false instead
                matches.call( div, "[s!='']:x" );
                rbuggyMatches.push( "!=", pseudos );
            });
        }
    
        rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
        rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
    
        /* Contains
        ---------------------------------------------------------------------- */
    
        // Element contains another
        // Purposefully does not implement inclusive descendent
        // As in, an element does not contain itself
        contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
            function( a, b ) {
                var adown = a.nodeType === 9 ? a.documentElement : a,
                    bup = b && b.parentNode;
                return a === bup || !!( bup && bup.nodeType === 1 && (
                    adown.contains ?
                        adown.contains( bup ) :
                        a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
                ));
            } :
            function( a, b ) {
                if ( b ) {
                    while ( (b = b.parentNode) ) {
                        if ( b === a ) {
                            return true;
                        }
                    }
                }
                return false;
            };
    
        /* Sorting
        ---------------------------------------------------------------------- */
    
        // Document order sorting
        sortOrder = docElem.compareDocumentPosition ?
        function( a, b ) {
    
            // Flag for duplicate removal
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
            }
    
            var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );
    
            if ( compare ) {
                // Disconnected nodes
                if ( compare & 1 ||
                    (!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
    
                    // Choose the first element that is related to our preferred document
                    if ( a === doc || contains(preferredDoc, a) ) {
                        return -1;
                    }
                    if ( b === doc || contains(preferredDoc, b) ) {
                        return 1;
                    }
    
                    // Maintain original order
                    return sortInput ?
                        ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                        0;
                }
    
                return compare & 4 ? -1 : 1;
            }
    
            // Not directly comparable, sort on existence of method
            return a.compareDocumentPosition ? -1 : 1;
        } :
        function( a, b ) {
            var cur,
                i = 0,
                aup = a.parentNode,
                bup = b.parentNode,
                ap = [ a ],
                bp = [ b ];
    
            // Exit early if the nodes are identical
            if ( a === b ) {
                hasDuplicate = true;
                return 0;
    
            // Parentless nodes are either documents or disconnected
            } else if ( !aup || !bup ) {
                return a === doc ? -1 :
                    b === doc ? 1 :
                    aup ? -1 :
                    bup ? 1 :
                    sortInput ?
                    ( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
                    0;
    
            // If the nodes are siblings, we can do a quick check
            } else if ( aup === bup ) {
                return siblingCheck( a, b );
            }
    
            // Otherwise we need full lists of their ancestors for comparison
            cur = a;
            while ( (cur = cur.parentNode) ) {
                ap.unshift( cur );
            }
            cur = b;
            while ( (cur = cur.parentNode) ) {
                bp.unshift( cur );
            }
    
            // Walk down the tree looking for a discrepancy
            while ( ap[i] === bp[i] ) {
                i++;
            }
    
            return i ?
                // Do a sibling check if the nodes have a common ancestor
                siblingCheck( ap[i], bp[i] ) :
    
                // Otherwise nodes in our document sort first
                ap[i] === preferredDoc ? -1 :
                bp[i] === preferredDoc ? 1 :
                0;
        };
    
        return doc;
    };
    
    Sizzle.matches = function( expr, elements ) {
        return Sizzle( expr, null, null, elements );
    };
    
    Sizzle.matchesSelector = function( elem, expr ) {
        // Set document vars if needed
        if ( ( elem.ownerDocument || elem ) !== document ) {
            setDocument( elem );
        }
    
        // Make sure that attribute selectors are quoted
        expr = expr.replace( rattributeQuotes, "='$1']" );
    
        if ( support.matchesSelector && documentIsHTML &&
            ( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
            ( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
    
            try {
                var ret = matches.call( elem, expr );
    
                // IE 9's matchesSelector returns false on disconnected nodes
                if ( ret || support.disconnectedMatch ||
                        // As well, disconnected nodes are said to be in a document
                        // fragment in IE 9
                        elem.document && elem.document.nodeType !== 11 ) {
                    return ret;
                }
            } catch(e) {}
        }
    
        return Sizzle( expr, document, null, [elem] ).length > 0;
    };
    
    Sizzle.contains = function( context, elem ) {
        // Set document vars if needed
        if ( ( context.ownerDocument || context ) !== document ) {
            setDocument( context );
        }
        return contains( context, elem );
    };
    
    Sizzle.attr = function( elem, name ) {
        // Set document vars if needed
        if ( ( elem.ownerDocument || elem ) !== document ) {
            setDocument( elem );
        }
    
        var fn = Expr.attrHandle[ name.toLowerCase() ],
            // Don't get fooled by Object.prototype properties (jQuery #13807)
            val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
                fn( elem, name, !documentIsHTML ) :
                undefined;
    
        return val === undefined ?
            support.attributes || !documentIsHTML ?
                elem.getAttribute( name ) :
                (val = elem.getAttributeNode(name)) && val.specified ?
                    val.value :
                    null :
            val;
    };
    
    Sizzle.error = function( msg ) {
        throw new Error( "Syntax error, unrecognized expression: " + msg );
    };
    
    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
        var elem,
            duplicates = [],
            j = 0,
            i = 0;
    
        // Unless we *know* we can detect duplicates, assume their presence
        hasDuplicate = !support.detectDuplicates;
        sortInput = !support.sortStable && results.slice( 0 );
        results.sort( sortOrder );
    
        if ( hasDuplicate ) {
            while ( (elem = results[i++]) ) {
                if ( elem === results[ i ] ) {
                    j = duplicates.push( i );
                }
            }
            while ( j-- ) {
                results.splice( duplicates[ j ], 1 );
            }
        }
    
        return results;
    };
    
    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
        var node,
            ret = "",
            i = 0,
            nodeType = elem.nodeType;
    
        if ( !nodeType ) {
            // If no nodeType, this is expected to be an array
            for ( ; (node = elem[i]); i++ ) {
                // Do not traverse comment nodes
                ret += getText( node );
            }
        } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
            // Use textContent for elements
            // innerText usage removed for consistency of new lines (see #11153)
            if ( typeof elem.textContent === "string" ) {
                return elem.textContent;
            } else {
                // Traverse its children
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    ret += getText( elem );
                }
            }
        } else if ( nodeType === 3 || nodeType === 4 ) {
            return elem.nodeValue;
        }
        // Do not include comment or processing instruction nodes
    
        return ret;
    };
    
    Expr = Sizzle.selectors = {
    
        // Can be adjusted by the user
        cacheLength: 50,
    
        createPseudo: markFunction,
    
        match: matchExpr,
    
        attrHandle: {},
    
        find: {},
    
        relative: {
            ">": { dir: "parentNode", first: true },
            " ": { dir: "parentNode" },
            "+": { dir: "previousSibling", first: true },
            "~": { dir: "previousSibling" }
        },
    
        preFilter: {
            "ATTR": function( match ) {
                match[1] = match[1].replace( runescape, funescape );
    
                // Move the given value to match[3] whether quoted or unquoted
                match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );
    
                if ( match[2] === "~=" ) {
                    match[3] = " " + match[3] + " ";
                }
    
                return match.slice( 0, 4 );
            },
    
            "CHILD": function( match ) {
                /* matches from matchExpr["CHILD"]
                    1 type (only|nth|...)
                    2 what (child|of-type)
                    3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
                    4 xn-component of xn+y argument ([+-]?\d*n|)
                    5 sign of xn-component
                    6 x of xn-component
                    7 sign of y-component
                    8 y of y-component
                */
                match[1] = match[1].toLowerCase();
    
                if ( match[1].slice( 0, 3 ) === "nth" ) {
                    // nth-* requires argument
                    if ( !match[3] ) {
                        Sizzle.error( match[0] );
                    }
    
                    // numeric x and y parameters for Expr.filter.CHILD
                    // remember that false/true cast respectively to 0/1
                    match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
                    match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
    
                // other types prohibit arguments
                } else if ( match[3] ) {
                    Sizzle.error( match[0] );
                }
    
                return match;
            },
    
            "PSEUDO": function( match ) {
                var excess,
                    unquoted = !match[5] && match[2];
    
                if ( matchExpr["CHILD"].test( match[0] ) ) {
                    return null;
                }
    
                // Accept quoted arguments as-is
                if ( match[3] && match[4] !== undefined ) {
                    match[2] = match[4];
    
                // Strip excess characters from unquoted arguments
                } else if ( unquoted && rpseudo.test( unquoted ) &&
                    // Get excess from tokenize (recursively)
                    (excess = tokenize( unquoted, true )) &&
                    // advance to the next closing parenthesis
                    (excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
    
                    // excess is a negative index
                    match[0] = match[0].slice( 0, excess );
                    match[2] = unquoted.slice( 0, excess );
                }
    
                // Return only captures needed by the pseudo filter method (type and argument)
                return match.slice( 0, 3 );
            }
        },
    
        filter: {
    
            "TAG": function( nodeNameSelector ) {
                var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
                return nodeNameSelector === "*" ?
                    function() { return true; } :
                    function( elem ) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
            },
    
            "CLASS": function( className ) {
                var pattern = classCache[ className + " " ];
    
                return pattern ||
                    (pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
                    classCache( className, function( elem ) {
                        return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
                    });
            },
    
            "ATTR": function( name, operator, check ) {
                return function( elem ) {
                    var result = Sizzle.attr( elem, name );
    
                    if ( result == null ) {
                        return operator === "!=";
                    }
                    if ( !operator ) {
                        return true;
                    }
    
                    result += "";
    
                    return operator === "=" ? result === check :
                        operator === "!=" ? result !== check :
                        operator === "^=" ? check && result.indexOf( check ) === 0 :
                        operator === "*=" ? check && result.indexOf( check ) > -1 :
                        operator === "$=" ? check && result.slice( -check.length ) === check :
                        operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
                        operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
                        false;
                };
            },
    
            "CHILD": function( type, what, argument, first, last ) {
                var simple = type.slice( 0, 3 ) !== "nth",
                    forward = type.slice( -4 ) !== "last",
                    ofType = what === "of-type";
    
                return first === 1 && last === 0 ?
    
                    // Shortcut for :nth-*(n)
                    function( elem ) {
                        return !!elem.parentNode;
                    } :
    
                    function( elem, context, xml ) {
                        var cache, outerCache, node, diff, nodeIndex, start,
                            dir = simple !== forward ? "nextSibling" : "previousSibling",
                            parent = elem.parentNode,
                            name = ofType && elem.nodeName.toLowerCase(),
                            useCache = !xml && !ofType;
    
                        if ( parent ) {
    
                            // :(first|last|only)-(child|of-type)
                            if ( simple ) {
                                while ( dir ) {
                                    node = elem;
                                    while ( (node = node[ dir ]) ) {
                                        if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
                                            return false;
                                        }
                                    }
                                    // Reverse direction for :only-* (if we haven't yet done so)
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }
    
                            start = [ forward ? parent.firstChild : parent.lastChild ];
    
                            // non-xml :nth-child(...) stores cache data on `parent`
                            if ( forward && useCache ) {
                                // Seek `elem` from a previously-cached index
                                outerCache = parent[ expando ] || (parent[ expando ] = {});
                                cache = outerCache[ type ] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.childNodes[ nodeIndex ];
    
                                while ( (node = ++nodeIndex && node && node[ dir ] ||
    
                                    // Fallback to seeking `elem` from the start
                                    (diff = nodeIndex = 0) || start.pop()) ) {
    
                                    // When found, cache indexes on `parent` and break
                                    if ( node.nodeType === 1 && ++diff && node === elem ) {
                                        outerCache[ type ] = [ dirruns, nodeIndex, diff ];
                                        break;
                                    }
                                }
    
                            // Use previously-cached element index if available
                            } else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
                                diff = cache[1];
    
                            // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                            } else {
                                // Use the same loop as above to seek `elem` from the start
                                while ( (node = ++nodeIndex && node && node[ dir ] ||
                                    (diff = nodeIndex = 0) || start.pop()) ) {
    
                                    if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
                                        // Cache the index of each encountered element
                                        if ( useCache ) {
                                            (node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
                                        }
    
                                        if ( node === elem ) {
                                            break;
                                        }
                                    }
                                }
                            }
    
                            // Incorporate the offset, then check against cycle size
                            diff -= last;
                            return diff === first || ( diff % first === 0 && diff / first >= 0 );
                        }
                    };
            },
    
            "PSEUDO": function( pseudo, argument ) {
                // pseudo-class names are case-insensitive
                // http://www.w3.org/TR/selectors/#pseudo-classes
                // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
                // Remember that setFilters inherits from pseudos
                var args,
                    fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
                        Sizzle.error( "unsupported pseudo: " + pseudo );
    
                // The user may use createPseudo to indicate that
                // arguments are needed to create the filter function
                // just as Sizzle does
                if ( fn[ expando ] ) {
                    return fn( argument );
                }
    
                // But maintain support for old signatures
                if ( fn.length > 1 ) {
                    args = [ pseudo, pseudo, "", argument ];
                    return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
                        markFunction(function( seed, matches ) {
                            var idx,
                                matched = fn( seed, argument ),
                                i = matched.length;
                            while ( i-- ) {
                                idx = indexOf.call( seed, matched[i] );
                                seed[ idx ] = !( matches[ idx ] = matched[i] );
                            }
                        }) :
                        function( elem ) {
                            return fn( elem, 0, args );
                        };
                }
    
                return fn;
            }
        },
    
        pseudos: {
            // Potentially complex pseudos
            "not": markFunction(function( selector ) {
                // Trim the selector passed to compile
                // to avoid treating leading and trailing
                // spaces as combinators
                var input = [],
                    results = [],
                    matcher = compile( selector.replace( rtrim, "$1" ) );
    
                return matcher[ expando ] ?
                    markFunction(function( seed, matches, context, xml ) {
                        var elem,
                            unmatched = matcher( seed, null, xml, [] ),
                            i = seed.length;
    
                        // Match elements unmatched by `matcher`
                        while ( i-- ) {
                            if ( (elem = unmatched[i]) ) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) :
                    function( elem, context, xml ) {
                        input[0] = elem;
                        matcher( input, null, xml, results );
                        return !results.pop();
                    };
            }),
    
            "has": markFunction(function( selector ) {
                return function( elem ) {
                    return Sizzle( selector, elem ).length > 0;
                };
            }),
    
            "contains": markFunction(function( text ) {
                return function( elem ) {
                    return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
                };
            }),
    
            // "Whether an element is represented by a :lang() selector
            // is based solely on the element's language value
            // being equal to the identifier C,
            // or beginning with the identifier C immediately followed by "-".
            // The matching of C against the element's language value is performed case-insensitively.
            // The identifier C does not have to be a valid language name."
            // http://www.w3.org/TR/selectors/#lang-pseudo
            "lang": markFunction( function( lang ) {
                // lang value must be a valid identifier
                if ( !ridentifier.test(lang || "") ) {
                    Sizzle.error( "unsupported lang: " + lang );
                }
                lang = lang.replace( runescape, funescape ).toLowerCase();
                return function( elem ) {
                    var elemLang;
                    do {
                        if ( (elemLang = documentIsHTML ?
                            elem.lang :
                            elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
    
                            elemLang = elemLang.toLowerCase();
                            return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
                        }
                    } while ( (elem = elem.parentNode) && elem.nodeType === 1 );
                    return false;
                };
            }),
    
            // Miscellaneous
            "target": function( elem ) {
                var hash = window.location && window.location.hash;
                return hash && hash.slice( 1 ) === elem.id;
            },
    
            "root": function( elem ) {
                return elem === docElem;
            },
    
            "focus": function( elem ) {
                return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
            },
    
            // Boolean properties
            "enabled": function( elem ) {
                return elem.disabled === false;
            },
    
            "disabled": function( elem ) {
                return elem.disabled === true;
            },
    
            "checked": function( elem ) {
                // In CSS3, :checked should return both checked and selected elements
                // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
                var nodeName = elem.nodeName.toLowerCase();
                return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
            },
    
            "selected": function( elem ) {
                // Accessing this property makes selected-by-default
                // options in Safari work properly
                if ( elem.parentNode ) {
                    elem.parentNode.selectedIndex;
                }
    
                return elem.selected === true;
            },
    
            // Contents
            "empty": function( elem ) {
                // http://www.w3.org/TR/selectors/#empty-pseudo
                // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
                //   not comment, processing instructions, or others
                // Thanks to Diego Perini for the nodeName shortcut
                //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
                for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
                    if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
                        return false;
                    }
                }
                return true;
            },
    
            "parent": function( elem ) {
                return !Expr.pseudos["empty"]( elem );
            },
    
            // Element/input types
            "header": function( elem ) {
                return rheader.test( elem.nodeName );
            },
    
            "input": function( elem ) {
                return rinputs.test( elem.nodeName );
            },
    
            "button": function( elem ) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === "button" || name === "button";
            },
    
            "text": function( elem ) {
                var attr;
                // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
                // use getAttribute instead to test this case
                return elem.nodeName.toLowerCase() === "input" &&
                    elem.type === "text" &&
                    ( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
            },
    
            // Position-in-collection
            "first": createPositionalPseudo(function() {
                return [ 0 ];
            }),
    
            "last": createPositionalPseudo(function( matchIndexes, length ) {
                return [ length - 1 ];
            }),
    
            "eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
                return [ argument < 0 ? argument + length : argument ];
            }),
    
            "even": createPositionalPseudo(function( matchIndexes, length ) {
                var i = 0;
                for ( ; i < length; i += 2 ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),
    
            "odd": createPositionalPseudo(function( matchIndexes, length ) {
                var i = 1;
                for ( ; i < length; i += 2 ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),
    
            "lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                var i = argument < 0 ? argument + length : argument;
                for ( ; --i >= 0; ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            }),
    
            "gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
                var i = argument < 0 ? argument + length : argument;
                for ( ; ++i < length; ) {
                    matchIndexes.push( i );
                }
                return matchIndexes;
            })
        }
    };
    
    Expr.pseudos["nth"] = Expr.pseudos["eq"];
    
    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
        Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
        Expr.pseudos[ i ] = createButtonPseudo( i );
    }
    
    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();
    
    function tokenize( selector, parseOnly ) {
        var matched, match, tokens, type,
            soFar, groups, preFilters,
            cached = tokenCache[ selector + " " ];
    
        if ( cached ) {
            return parseOnly ? 0 : cached.slice( 0 );
        }
    
        soFar = selector;
        groups = [];
        preFilters = Expr.preFilter;
    
        while ( soFar ) {
    
            // Comma and first run
            if ( !matched || (match = rcomma.exec( soFar )) ) {
                if ( match ) {
                    // Don't consume trailing commas as valid
                    soFar = soFar.slice( match[0].length ) || soFar;
                }
                groups.push( tokens = [] );
            }
    
            matched = false;
    
            // Combinators
            if ( (match = rcombinators.exec( soFar )) ) {
                matched = match.shift();
                tokens.push({
                    value: matched,
                    // Cast descendant combinators to space
                    type: match[0].replace( rtrim, " " )
                });
                soFar = soFar.slice( matched.length );
            }
    
            // Filters
            for ( type in Expr.filter ) {
                if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
                    (match = preFilters[ type ]( match ))) ) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: type,
                        matches: match
                    });
                    soFar = soFar.slice( matched.length );
                }
            }
    
            if ( !matched ) {
                break;
            }
        }
    
        // Return the length of the invalid excess
        // if we're just parsing
        // Otherwise, throw an error or return tokens
        return parseOnly ?
            soFar.length :
            soFar ?
                Sizzle.error( selector ) :
                // Cache the tokens
                tokenCache( selector, groups ).slice( 0 );
    }
    
    function toSelector( tokens ) {
        var i = 0,
            len = tokens.length,
            selector = "";
        for ( ; i < len; i++ ) {
            selector += tokens[i].value;
        }
        return selector;
    }
    
    function addCombinator( matcher, combinator, base ) {
        var dir = combinator.dir,
            checkNonElements = base && dir === "parentNode",
            doneName = done++;
    
        return combinator.first ?
            // Check against closest ancestor/preceding element
            function( elem, context, xml ) {
                while ( (elem = elem[ dir ]) ) {
                    if ( elem.nodeType === 1 || checkNonElements ) {
                        return matcher( elem, context, xml );
                    }
                }
            } :
    
            // Check against all ancestor/preceding elements
            function( elem, context, xml ) {
                var data, cache, outerCache,
                    dirkey = dirruns + " " + doneName;
    
                // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
                if ( xml ) {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            if ( matcher( elem, context, xml ) ) {
                                return true;
                            }
                        }
                    }
                } else {
                    while ( (elem = elem[ dir ]) ) {
                        if ( elem.nodeType === 1 || checkNonElements ) {
                            outerCache = elem[ expando ] || (elem[ expando ] = {});
                            if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
                                if ( (data = cache[1]) === true || data === cachedruns ) {
                                    return data === true;
                                }
                            } else {
                                cache = outerCache[ dir ] = [ dirkey ];
                                cache[1] = matcher( elem, context, xml ) || cachedruns;
                                if ( cache[1] === true ) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
    }
    
    function elementMatcher( matchers ) {
        return matchers.length > 1 ?
            function( elem, context, xml ) {
                var i = matchers.length;
                while ( i-- ) {
                    if ( !matchers[i]( elem, context, xml ) ) {
                        return false;
                    }
                }
                return true;
            } :
            matchers[0];
    }
    
    function condense( unmatched, map, filter, context, xml ) {
        var elem,
            newUnmatched = [],
            i = 0,
            len = unmatched.length,
            mapped = map != null;
    
        for ( ; i < len; i++ ) {
            if ( (elem = unmatched[i]) ) {
                if ( !filter || filter( elem, context, xml ) ) {
                    newUnmatched.push( elem );
                    if ( mapped ) {
                        map.push( i );
                    }
                }
            }
        }
    
        return newUnmatched;
    }
    
    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
        if ( postFilter && !postFilter[ expando ] ) {
            postFilter = setMatcher( postFilter );
        }
        if ( postFinder && !postFinder[ expando ] ) {
            postFinder = setMatcher( postFinder, postSelector );
        }
        return markFunction(function( seed, results, context, xml ) {
            var temp, i, elem,
                preMap = [],
                postMap = [],
                preexisting = results.length,
    
                // Get initial elements from seed or context
                elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
    
                // Prefilter to get matcher input, preserving a map for seed-results synchronization
                matcherIn = preFilter && ( seed || !selector ) ?
                    condense( elems, preMap, preFilter, context, xml ) :
                    elems,
    
                matcherOut = matcher ?
                    // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
                    postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
    
                        // ...intermediate processing is necessary
                        [] :
    
                        // ...otherwise use results directly
                        results :
                    matcherIn;
    
            // Find primary matches
            if ( matcher ) {
                matcher( matcherIn, matcherOut, context, xml );
            }
    
            // Apply postFilter
            if ( postFilter ) {
                temp = condense( matcherOut, postMap );
                postFilter( temp, [], context, xml );
    
                // Un-match failing elements by moving them back to matcherIn
                i = temp.length;
                while ( i-- ) {
                    if ( (elem = temp[i]) ) {
                        matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
                    }
                }
            }
    
            if ( seed ) {
                if ( postFinder || preFilter ) {
                    if ( postFinder ) {
                        // Get the final matcherOut by condensing this intermediate into postFinder contexts
                        temp = [];
                        i = matcherOut.length;
                        while ( i-- ) {
                            if ( (elem = matcherOut[i]) ) {
                                // Restore matcherIn since elem is not yet a final match
                                temp.push( (matcherIn[i] = elem) );
                            }
                        }
                        postFinder( null, (matcherOut = []), temp, xml );
                    }
    
                    // Move matched elements from seed to results to keep them synchronized
                    i = matcherOut.length;
                    while ( i-- ) {
                        if ( (elem = matcherOut[i]) &&
                            (temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {
    
                            seed[temp] = !(results[temp] = elem);
                        }
                    }
                }
    
            // Add elements to results, through postFinder if defined
            } else {
                matcherOut = condense(
                    matcherOut === results ?
                        matcherOut.splice( preexisting, matcherOut.length ) :
                        matcherOut
                );
                if ( postFinder ) {
                    postFinder( null, results, matcherOut, xml );
                } else {
                    push.apply( results, matcherOut );
                }
            }
        });
    }
    
    function matcherFromTokens( tokens ) {
        var checkContext, matcher, j,
            len = tokens.length,
            leadingRelative = Expr.relative[ tokens[0].type ],
            implicitRelative = leadingRelative || Expr.relative[" "],
            i = leadingRelative ? 1 : 0,
    
            // The foundational matcher ensures that elements are reachable from top-level context(s)
            matchContext = addCombinator( function( elem ) {
                return elem === checkContext;
            }, implicitRelative, true ),
            matchAnyContext = addCombinator( function( elem ) {
                return indexOf.call( checkContext, elem ) > -1;
            }, implicitRelative, true ),
            matchers = [ function( elem, context, xml ) {
                return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
                    (checkContext = context).nodeType ?
                        matchContext( elem, context, xml ) :
                        matchAnyContext( elem, context, xml ) );
            } ];
    
        for ( ; i < len; i++ ) {
            if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
                matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
            } else {
                matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
    
                // Return special upon seeing a positional matcher
                if ( matcher[ expando ] ) {
                    // Find the next relative operator (if any) for proper handling
                    j = ++i;
                    for ( ; j < len; j++ ) {
                        if ( Expr.relative[ tokens[j].type ] ) {
                            break;
                        }
                    }
                    return setMatcher(
                        i > 1 && elementMatcher( matchers ),
                        i > 1 && toSelector(
                            // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                            tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
                        ).replace( rtrim, "$1" ),
                        matcher,
                        i < j && matcherFromTokens( tokens.slice( i, j ) ),
                        j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
                        j < len && toSelector( tokens )
                    );
                }
                matchers.push( matcher );
            }
        }
    
        return elementMatcher( matchers );
    }
    
    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
        // A counter to specify which element is currently being matched
        var matcherCachedRuns = 0,
            bySet = setMatchers.length > 0,
            byElement = elementMatchers.length > 0,
            superMatcher = function( seed, context, xml, results, expandContext ) {
                var elem, j, matcher,
                    setMatched = [],
                    matchedCount = 0,
                    i = "0",
                    unmatched = seed && [],
                    outermost = expandContext != null,
                    contextBackup = outermostContext,
                    // We must always have either seed elements or context
                    elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
                    // Use integer dirruns iff this is the outermost matcher
                    dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);
    
                if ( outermost ) {
                    outermostContext = context !== document && context;
                    cachedruns = matcherCachedRuns;
                }
    
                // Add elements passing elementMatchers directly to results
                // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
                for ( ; (elem = elems[i]) != null; i++ ) {
                    if ( byElement && elem ) {
                        j = 0;
                        while ( (matcher = elementMatchers[j++]) ) {
                            if ( matcher( elem, context, xml ) ) {
                                results.push( elem );
                                break;
                            }
                        }
                        if ( outermost ) {
                            dirruns = dirrunsUnique;
                            cachedruns = ++matcherCachedRuns;
                        }
                    }
    
                    // Track unmatched elements for set filters
                    if ( bySet ) {
                        // They will have gone through all possible matchers
                        if ( (elem = !matcher && elem) ) {
                            matchedCount--;
                        }
    
                        // Lengthen the array for every element, matched or not
                        if ( seed ) {
                            unmatched.push( elem );
                        }
                    }
                }
    
                // Apply set filters to unmatched elements
                matchedCount += i;
                if ( bySet && i !== matchedCount ) {
                    j = 0;
                    while ( (matcher = setMatchers[j++]) ) {
                        matcher( unmatched, setMatched, context, xml );
                    }
    
                    if ( seed ) {
                        // Reintegrate element matches to eliminate the need for sorting
                        if ( matchedCount > 0 ) {
                            while ( i-- ) {
                                if ( !(unmatched[i] || setMatched[i]) ) {
                                    setMatched[i] = pop.call( results );
                                }
                            }
                        }
    
                        // Discard index placeholder values to get only actual matches
                        setMatched = condense( setMatched );
                    }
    
                    // Add matches to results
                    push.apply( results, setMatched );
    
                    // Seedless set matches succeeding multiple successful matchers stipulate sorting
                    if ( outermost && !seed && setMatched.length > 0 &&
                        ( matchedCount + setMatchers.length ) > 1 ) {
    
                        Sizzle.uniqueSort( results );
                    }
                }
    
                // Override manipulation of globals by nested matchers
                if ( outermost ) {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }
    
                return unmatched;
            };
    
        return bySet ?
            markFunction( superMatcher ) :
            superMatcher;
    }
    
    compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
        var i,
            setMatchers = [],
            elementMatchers = [],
            cached = compilerCache[ selector + " " ];
    
        if ( !cached ) {
            // Generate a function of recursive functions that can be used to check each element
            if ( !group ) {
                group = tokenize( selector );
            }
            i = group.length;
            while ( i-- ) {
                cached = matcherFromTokens( group[i] );
                if ( cached[ expando ] ) {
                    setMatchers.push( cached );
                } else {
                    elementMatchers.push( cached );
                }
            }
    
            // Cache the compiled function
            cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
        }
        return cached;
    };
    
    function multipleContexts( selector, contexts, results ) {
        var i = 0,
            len = contexts.length;
        for ( ; i < len; i++ ) {
            Sizzle( selector, contexts[i], results );
        }
        return results;
    }
    
    function select( selector, context, results, seed ) {
        var i, tokens, token, type, find,
            match = tokenize( selector );
    
        if ( !seed ) {
            // Try to minimize operations if there is only one group
            if ( match.length === 1 ) {
    
                // Take a shortcut and set the context if the root selector is an ID
                tokens = match[0] = match[0].slice( 0 );
                if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                        support.getById && context.nodeType === 9 && documentIsHTML &&
                        Expr.relative[ tokens[1].type ] ) {
    
                    context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                    if ( !context ) {
                        return results;
                    }
                    selector = selector.slice( tokens.shift().value.length );
                }
    
                // Fetch a seed set for right-to-left matching
                i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
                while ( i-- ) {
                    token = tokens[i];
    
                    // Abort if we hit a combinator
                    if ( Expr.relative[ (type = token.type) ] ) {
                        break;
                    }
                    if ( (find = Expr.find[ type ]) ) {
                        // Search, expanding context for leading sibling combinators
                        if ( (seed = find(
                            token.matches[0].replace( runescape, funescape ),
                            rsibling.test( tokens[0].type ) && context.parentNode || context
                        )) ) {
    
                            // If seed is empty or no tokens remain, we can return early
                            tokens.splice( i, 1 );
                            selector = seed.length && toSelector( tokens );
                            if ( !selector ) {
                                push.apply( results, seed );
                                return results;
                            }
    
                            break;
                        }
                    }
                }
            }
        }
    
        // Compile and execute a filtering function
        // Provide `match` to avoid retokenization if we modified the selector above
        compile( selector, match )(
            seed,
            context,
            !documentIsHTML,
            results,
            rsibling.test( selector )
        );
        return results;
    }
    
    // One-time assignments
    
    // Sort stability
    support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
    
    // Support: Chrome<14
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = hasDuplicate;
    
    // Initialize against the default document
    setDocument();
    
    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert(function( div1 ) {
        // Should return 1, but returns 4 (following)
        return div1.compareDocumentPosition( document.createElement("div") ) & 1;
    });
    
    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert(function( div ) {
        div.innerHTML = "<a href='#'></a>";
        return div.firstChild.getAttribute("href") === "#" ;
    }) ) {
        addHandle( "type|href|height|width", function( elem, name, isXML ) {
            if ( !isXML ) {
                return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
            }
        });
    }
    
    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert(function( div ) {
        div.innerHTML = "<input/>";
        div.firstChild.setAttribute( "value", "" );
        return div.firstChild.getAttribute( "value" ) === "";
    }) ) {
        addHandle( "value", function( elem, name, isXML ) {
            if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
                return elem.defaultValue;
            }
        });
    }
    
    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert(function( div ) {
        return div.getAttribute("disabled") == null;
    }) ) {
        addHandle( booleans, function( elem, name, isXML ) {
            var val;
            if ( !isXML ) {
                return (val = elem.getAttributeNode( name )) && val.specified ?
                    val.value :
                    elem[ name ] === true ? name.toLowerCase() : null;
            }
        });
    }
    
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    
    
    })( window );
    // String to Object options format cache
    var optionsCache = {};
    
    // Convert String-formatted options into Object-formatted ones and store in cache
    function createOptions( options ) {
        var object = optionsCache[ options ] = {};
        jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
            object[ flag ] = true;
        });
        return object;
    }
    
    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {
    
        // Convert options from String-formatted to Object-formatted if needed
        // (we check in cache first)
        options = typeof options === "string" ?
            ( optionsCache[ options ] || createOptions( options ) ) :
            jQuery.extend( {}, options );
    
        var // Flag to know if list is currently firing
            firing,
            // Last fire value (for non-forgettable lists)
            memory,
            // Flag to know if list was already fired
            fired,
            // End of the loop when firing
            firingLength,
            // Index of currently firing callback (modified by remove if needed)
            firingIndex,
            // First callback to fire (used internally by add and fireWith)
            firingStart,
            // Actual callback list
            list = [],
            // Stack of fire calls for repeatable lists
            stack = !options.once && [],
            // Fire callbacks
            fire = function( data ) {
                memory = options.memory && data;
                fired = true;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true;
                for ( ; list && firingIndex < firingLength; firingIndex++ ) {
                    if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
                        memory = false; // To prevent further calls using add
                        break;
                    }
                }
                firing = false;
                if ( list ) {
                    if ( stack ) {
                        if ( stack.length ) {
                            fire( stack.shift() );
                        }
                    } else if ( memory ) {
                        list = [];
                    } else {
                        self.disable();
                    }
                }
            },
            // Actual Callbacks object
            self = {
                // Add a callback or a collection of callbacks to the list
                add: function() {
                    if ( list ) {
                        // First, we save the current length
                        var start = list.length;
                        (function add( args ) {
                            jQuery.each( args, function( _, arg ) {
                                var type = jQuery.type( arg );
                                if ( type === "function" ) {
                                    if ( !options.unique || !self.has( arg ) ) {
                                        list.push( arg );
                                    }
                                } else if ( arg && arg.length && type !== "string" ) {
                                    // Inspect recursively
                                    add( arg );
                                }
                            });
                        })( arguments );
                        // Do we need to add the callbacks to the
                        // current firing batch?
                        if ( firing ) {
                            firingLength = list.length;
                        // With memory, if we're not firing then
                        // we should call right away
                        } else if ( memory ) {
                            firingStart = start;
                            fire( memory );
                        }
                    }
                    return this;
                },
                // Remove a callback from the list
                remove: function() {
                    if ( list ) {
                        jQuery.each( arguments, function( _, arg ) {
                            var index;
                            while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
                                list.splice( index, 1 );
                                // Handle firing indexes
                                if ( firing ) {
                                    if ( index <= firingLength ) {
                                        firingLength--;
                                    }
                                    if ( index <= firingIndex ) {
                                        firingIndex--;
                                    }
                                }
                            }
                        });
                    }
                    return this;
                },
                // Check if a given callback is in the list.
                // If no argument is given, return whether or not list has callbacks attached.
                has: function( fn ) {
                    return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
                },
                // Remove all callbacks from the list
                empty: function() {
                    list = [];
                    firingLength = 0;
                    return this;
                },
                // Have the list do nothing anymore
                disable: function() {
                    list = stack = memory = undefined;
                    return this;
                },
                // Is it disabled?
                disabled: function() {
                    return !list;
                },
                // Lock the list in its current state
                lock: function() {
                    stack = undefined;
                    if ( !memory ) {
                        self.disable();
                    }
                    return this;
                },
                // Is it locked?
                locked: function() {
                    return !stack;
                },
                // Call all callbacks with the given context and arguments
                fireWith: function( context, args ) {
                    if ( list && ( !fired || stack ) ) {
                        args = args || [];
                        args = [ context, args.slice ? args.slice() : args ];
                        if ( firing ) {
                            stack.push( args );
                        } else {
                            fire( args );
                        }
                    }
                    return this;
                },
                // Call all the callbacks with the given arguments
                fire: function() {
                    self.fireWith( this, arguments );
                    return this;
                },
                // To know if the callbacks have already been called at least once
                fired: function() {
                    return !!fired;
                }
            };
    
        return self;
    };
    jQuery.extend({
    
        Deferred: function( func ) {
            var tuples = [
                    // action, add listener, listener list, final state
                    [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
                    [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
                    [ "notify", "progress", jQuery.Callbacks("memory") ]
                ],
                state = "pending",
                promise = {
                    state: function() {
                        return state;
                    },
                    always: function() {
                        deferred.done( arguments ).fail( arguments );
                        return this;
                    },
                    then: function( /* fnDone, fnFail, fnProgress */ ) {
                        var fns = arguments;
                        return jQuery.Deferred(function( newDefer ) {
                            jQuery.each( tuples, function( i, tuple ) {
                                var action = tuple[ 0 ],
                                    fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
                                // deferred[ done | fail | progress ] for forwarding actions to newDefer
                                deferred[ tuple[1] ](function() {
                                    var returned = fn && fn.apply( this, arguments );
                                    if ( returned && jQuery.isFunction( returned.promise ) ) {
                                        returned.promise()
                                            .done( newDefer.resolve )
                                            .fail( newDefer.reject )
                                            .progress( newDefer.notify );
                                    } else {
                                        newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
                                    }
                                });
                            });
                            fns = null;
                        }).promise();
                    },
                    // Get a promise for this deferred
                    // If obj is provided, the promise aspect is added to the object
                    promise: function( obj ) {
                        return obj != null ? jQuery.extend( obj, promise ) : promise;
                    }
                },
                deferred = {};
    
            // Keep pipe for back-compat
            promise.pipe = promise.then;
    
            // Add list-specific methods
            jQuery.each( tuples, function( i, tuple ) {
                var list = tuple[ 2 ],
                    stateString = tuple[ 3 ];
    
                // promise[ done | fail | progress ] = list.add
                promise[ tuple[1] ] = list.add;
    
                // Handle state
                if ( stateString ) {
                    list.add(function() {
                        // state = [ resolved | rejected ]
                        state = stateString;
    
                    // [ reject_list | resolve_list ].disable; progress_list.lock
                    }, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
                }
    
                // deferred[ resolve | reject | notify ]
                deferred[ tuple[0] ] = function() {
                    deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
                    return this;
                };
                deferred[ tuple[0] + "With" ] = list.fireWith;
            });
    
            // Make the deferred a promise
            promise.promise( deferred );
    
            // Call given func if any
            if ( func ) {
                func.call( deferred, deferred );
            }
    
            // All done!
            return deferred;
        },
    
        // Deferred helper
        when: function( subordinate /* , ..., subordinateN */ ) {
            var i = 0,
                resolveValues = core_slice.call( arguments ),
                length = resolveValues.length,
    
                // the count of uncompleted subordinates
                remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
    
                // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
                deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
    
                // Update function for both resolve and progress values
                updateFunc = function( i, contexts, values ) {
                    return function( value ) {
                        contexts[ i ] = this;
                        values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
                        if( values === progressValues ) {
                            deferred.notifyWith( contexts, values );
                        } else if ( !( --remaining ) ) {
                            deferred.resolveWith( contexts, values );
                        }
                    };
                },
    
                progressValues, progressContexts, resolveContexts;
    
            // add listeners to Deferred subordinates; treat others as resolved
            if ( length > 1 ) {
                progressValues = new Array( length );
                progressContexts = new Array( length );
                resolveContexts = new Array( length );
                for ( ; i < length; i++ ) {
                    if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
                        resolveValues[ i ].promise()
                            .done( updateFunc( i, resolveContexts, resolveValues ) )
                            .fail( deferred.reject )
                            .progress( updateFunc( i, progressContexts, progressValues ) );
                    } else {
                        --remaining;
                    }
                }
            }
    
            // if we're not waiting on anything, resolve the master
            if ( !remaining ) {
                deferred.resolveWith( resolveContexts, resolveValues );
            }
    
            return deferred.promise();
        }
    });
    jQuery.support = (function( support ) {
    
        var all, a, input, select, fragment, opt, eventName, isSupported, i,
            div = document.createElement("div");
    
        // Setup
        div.setAttribute( "className", "t" );
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
    
        // Finish early in limited (non-browser) environments
        all = div.getElementsByTagName("*") || [];
        a = div.getElementsByTagName("a")[ 0 ];
        if ( !a || !a.style || !all.length ) {
            return support;
        }
    
        // First batch of tests
        select = document.createElement("select");
        opt = select.appendChild( document.createElement("option") );
        input = div.getElementsByTagName("input")[ 0 ];
    
        a.style.cssText = "top:1px;float:left;opacity:.5";
    
        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        support.getSetAttribute = div.className !== "t";
    
        // IE strips leading whitespace when .innerHTML is used
        support.leadingWhitespace = div.firstChild.nodeType === 3;
    
        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        support.tbody = !div.getElementsByTagName("tbody").length;
    
        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        support.htmlSerialize = !!div.getElementsByTagName("link").length;
    
        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        support.style = /top/.test( a.getAttribute("style") );
    
        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        support.hrefNormalized = a.getAttribute("href") === "/a";
    
        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        support.opacity = /^0.5/.test( a.style.opacity );
    
        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        support.cssFloat = !!a.style.cssFloat;
    
        // Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
        support.checkOn = !!input.value;
    
        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        support.optSelected = opt.selected;
    
        // Tests for enctype support on a form (#6743)
        support.enctype = !!document.createElement("form").enctype;
    
        // Makes sure cloning an html5 element does not cause problems
        // Where outerHTML is undefined, this still works
        support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";
    
        // Will be defined later
        support.inlineBlockNeedsLayout = false;
        support.shrinkWrapBlocks = false;
        support.pixelPosition = false;
        support.deleteExpando = true;
        support.noCloneEvent = true;
        support.reliableMarginRight = true;
        support.boxSizingReliable = true;
    
        // Make sure checked status is properly cloned
        input.checked = true;
        support.noCloneChecked = input.cloneNode( true ).checked;
    
        // Make sure that the options inside disabled selects aren't marked as disabled
        // (WebKit marks them as disabled)
        select.disabled = true;
        support.optDisabled = !opt.disabled;
    
        // Support: IE<9
        try {
            delete div.test;
        } catch( e ) {
            support.deleteExpando = false;
        }
    
        // Check if we can trust getAttribute("value")
        input = document.createElement("input");
        input.setAttribute( "value", "" );
        support.input = input.getAttribute( "value" ) === "";
    
        // Check if an input maintains its value after becoming a radio
        input.value = "t";
        input.setAttribute( "type", "radio" );
        support.radioValue = input.value === "t";
    
        // #11217 - WebKit loses check when the name is after the checked attribute
        input.setAttribute( "checked", "t" );
        input.setAttribute( "name", "t" );
    
        fragment = document.createDocumentFragment();
        fragment.appendChild( input );
    
        // Check if a disconnected checkbox will retain its checked
        // value of true after appended to the DOM (IE6/7)
        support.appendChecked = input.checked;
    
        // WebKit doesn't clone checked state correctly in fragments
        support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;
    
        // Support: IE<9
        // Opera does not clone events (and typeof div.attachEvent === undefined).
        // IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
        if ( div.attachEvent ) {
            div.attachEvent( "onclick", function() {
                support.noCloneEvent = false;
            });
    
            div.cloneNode( true ).click();
        }
    
        // Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
        // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
        for ( i in { submit: true, change: true, focusin: true }) {
            div.setAttribute( eventName = "on" + i, "t" );
    
            support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
        }
    
        div.style.backgroundClip = "content-box";
        div.cloneNode( true ).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
    
        // Support: IE<9
        // Iteration over object's inherited properties before its own.
        for ( i in jQuery( support ) ) {
            break;
        }
        support.ownLast = i !== "0";
    
        // Run tests that need a body at doc ready
        jQuery(function() {
            var container, marginDiv, tds,
                divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
                body = document.getElementsByTagName("body")[0];
    
            if ( !body ) {
                // Return for frameset docs that don't have a body
                return;
            }
    
            container = document.createElement("div");
            container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";
    
            body.appendChild( container ).appendChild( div );
    
            // Support: IE8
            // Check if table cells still have offsetWidth/Height when they are set
            // to display:none and there are still other visible table cells in a
            // table row; if so, offsetWidth/Height are not reliable for use when
            // determining if an element has been hidden directly using
            // display:none (it is still safe to use offsets if a parent element is
            // hidden; don safety goggles and see bug #4512 for more information).
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            tds = div.getElementsByTagName("td");
            tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
            isSupported = ( tds[ 0 ].offsetHeight === 0 );
    
            tds[ 0 ].style.display = "";
            tds[ 1 ].style.display = "none";
    
            // Support: IE8
            // Check if empty table cells still have offsetWidth/Height
            support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
    
            // Check box-sizing and margin behavior.
            div.innerHTML = "";
            div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
    
            // Workaround failing boxSizing test due to offsetWidth returning wrong value
            // with some non-1 values of body zoom, ticket #13543
            jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
                support.boxSizing = div.offsetWidth === 4;
            });
    
            // Use window.getComputedStyle because jsdom on node.js will break without it.
            if ( window.getComputedStyle ) {
                support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
                support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";
    
                // Check if div with explicit width and no margin-right incorrectly
                // gets computed margin-right based on width of container. (#3333)
                // Fails in WebKit before Feb 2011 nightlies
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                marginDiv = div.appendChild( document.createElement("div") );
                marginDiv.style.cssText = div.style.cssText = divReset;
                marginDiv.style.marginRight = marginDiv.style.width = "0";
                div.style.width = "1px";
    
                support.reliableMarginRight =
                    !parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
            }
    
            if ( typeof div.style.zoom !== core_strundefined ) {
                // Support: IE<8
                // Check if natively block-level elements act like inline-block
                // elements when setting their display to 'inline' and giving
                // them layout
                div.innerHTML = "";
                div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
                support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );
    
                // Support: IE6
                // Check if elements with layout shrink-wrap their children
                div.style.display = "block";
                div.innerHTML = "<div></div>";
                div.firstChild.style.width = "5px";
                support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
    
                if ( support.inlineBlockNeedsLayout ) {
                    // Prevent IE 6 from affecting layout for positioned elements #11048
                    // Prevent IE from shrinking the body in IE 7 mode #12869
                    // Support: IE<8
                    body.style.zoom = 1;
                }
            }
    
            body.removeChild( container );
    
            // Null elements to avoid leaks in IE
            container = div = tds = marginDiv = null;
        });
    
        // Null elements to avoid leaks in IE
        all = select = fragment = opt = a = input = null;
    
        return support;
    })({});
    
    var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
        rmultiDash = /([A-Z])/g;
    
    function internalData( elem, name, data, pvt /* Internal Use Only */ ){
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }
    
        var ret, thisCache,
            internalKey = jQuery.expando,
    
            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,
    
            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,
    
            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
    
        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
            return;
        }
    
        if ( !id ) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if ( isNode ) {
                id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }
    
        if ( !cache[ id ] ) {
            // Avoid exposing jQuery metadata on plain JS objects when the object
            // is serialized using JSON.stringify
            cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
        }
    
        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ] = jQuery.extend( cache[ id ], name );
            } else {
                cache[ id ].data = jQuery.extend( cache[ id ].data, name );
            }
        }
    
        thisCache = cache[ id ];
    
        // jQuery data() is stored in a separate object inside the object's internal data
        // cache in order to avoid key collisions between internal data and user-defined
        // data.
        if ( !pvt ) {
            if ( !thisCache.data ) {
                thisCache.data = {};
            }
    
            thisCache = thisCache.data;
        }
    
        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }
    
        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if ( typeof name === "string" ) {
    
            // First Try to find as-is property data
            ret = thisCache[ name ];
    
            // Test for null|undefined property data
            if ( ret == null ) {
    
                // Try to find the camelCased property
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }
    
        return ret;
    }
    
    function internalRemoveData( elem, name, pvt ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }
    
        var thisCache, i,
            isNode = elem.nodeType,
    
            // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,
            id = isNode ? elem[ jQuery.expando ] : jQuery.expando;
    
        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if ( !cache[ id ] ) {
            return;
        }
    
        if ( name ) {
    
            thisCache = pvt ? cache[ id ] : cache[ id ].data;
    
            if ( thisCache ) {
    
                // Support array or space separated string names for data keys
                if ( !jQuery.isArray( name ) ) {
    
                    // try the string as a key before any manipulation
                    if ( name in thisCache ) {
                        name = [ name ];
                    } else {
    
                        // split the camel cased version by spaces unless a key with the spaces exists
                        name = jQuery.camelCase( name );
                        if ( name in thisCache ) {
                            name = [ name ];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    // If "name" is an array of keys...
                    // When data is initially created, via ("key", "val") signature,
                    // keys will be converted to camelCase.
                    // Since there is no way to tell _how_ a key was added, remove
                    // both plain key and camelCase key. #12786
                    // This will only penalize the array argument path.
                    name = name.concat( jQuery.map( name, jQuery.camelCase ) );
                }
    
                i = name.length;
                while ( i-- ) {
                    delete thisCache[ name[i] ];
                }
    
                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
                    return;
                }
            }
        }
    
        // See jQuery.data for more information
        if ( !pvt ) {
            delete cache[ id ].data;
    
            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if ( !isEmptyDataObject( cache[ id ] ) ) {
                return;
            }
        }
    
        // Destroy the cache
        if ( isNode ) {
            jQuery.cleanData( [ elem ], true );
    
        // Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
        /* jshint eqeqeq: false */
        } else if ( jQuery.support.deleteExpando || cache != cache.window ) {
            /* jshint eqeqeq: true */
            delete cache[ id ];
    
        // When all else fails, null
        } else {
            cache[ id ] = null;
        }
    }
    
    jQuery.extend({
        cache: {},
    
        // The following elements throw uncatchable exceptions if you
        // attempt to add expando properties to them.
        noData: {
            "applet": true,
            "embed": true,
            // Ban all objects except for Flash (which handle expandos)
            "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
    
        hasData: function( elem ) {
            elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
            return !!elem && !isEmptyDataObject( elem );
        },
    
        data: function( elem, name, data ) {
            return internalData( elem, name, data );
        },
    
        removeData: function( elem, name ) {
            return internalRemoveData( elem, name );
        },
    
        // For internal use only.
        _data: function( elem, name, data ) {
            return internalData( elem, name, data, true );
        },
    
        _removeData: function( elem, name ) {
            return internalRemoveData( elem, name, true );
        },
    
        // A method for determining if a DOM node can handle the data expando
        acceptData: function( elem ) {
            // Do not set data on non-element because it will not be cleared (#8335).
            if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
                return false;
            }
    
            var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];
    
            // nodes accept data unless otherwise specified; rejection can be conditional
            return !noData || noData !== true && elem.getAttribute("classid") === noData;
        }
    });
    
    jQuery.fn.extend({
        data: function( key, value ) {
            var attrs, name,
                data = null,
                i = 0,
                elem = this[0];
    
            // Special expections of .data basically thwart jQuery.access,
            // so implement the relevant behavior ourselves
    
            // Gets all values
            if ( key === undefined ) {
                if ( this.length ) {
                    data = jQuery.data( elem );
    
                    if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
                        attrs = elem.attributes;
                        for ( ; i < attrs.length; i++ ) {
                            name = attrs[i].name;
    
                            if ( name.indexOf("data-") === 0 ) {
                                name = jQuery.camelCase( name.slice(5) );
    
                                dataAttr( elem, name, data[ name ] );
                            }
                        }
                        jQuery._data( elem, "parsedAttrs", true );
                    }
                }
    
                return data;
            }
    
            // Sets multiple values
            if ( typeof key === "object" ) {
                return this.each(function() {
                    jQuery.data( this, key );
                });
            }
    
            return arguments.length > 1 ?
    
                // Sets one value
                this.each(function() {
                    jQuery.data( this, key, value );
                }) :
    
                // Gets one value
                // Try to fetch any internally stored data first
                elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
        },
    
        removeData: function( key ) {
            return this.each(function() {
                jQuery.removeData( this, key );
            });
        }
    });
    
    function dataAttr( elem, key, data ) {
        // If nothing was found internally, try to fetch any
        // data from the HTML5 data-* attribute
        if ( data === undefined && elem.nodeType === 1 ) {
    
            var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
    
            data = elem.getAttribute( name );
    
            if ( typeof data === "string" ) {
                try {
                    data = data === "true" ? true :
                        data === "false" ? false :
                        data === "null" ? null :
                        // Only convert to a number if it doesn't change the string
                        +data + "" === data ? +data :
                        rbrace.test( data ) ? jQuery.parseJSON( data ) :
                            data;
                } catch( e ) {}
    
                // Make sure we set the data so it isn't changed later
                jQuery.data( elem, key, data );
    
            } else {
                data = undefined;
            }
        }
    
        return data;
    }
    
    // checks a cache object for emptiness
    function isEmptyDataObject( obj ) {
        var name;
        for ( name in obj ) {
    
            // if the public data object is empty, the private is still empty
            if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
                continue;
            }
            if ( name !== "toJSON" ) {
                return false;
            }
        }
    
        return true;
    }
    jQuery.extend({
        queue: function( elem, type, data ) {
            var queue;
    
            if ( elem ) {
                type = ( type || "fx" ) + "queue";
                queue = jQuery._data( elem, type );
    
                // Speed up dequeue by getting out quickly if this is just a lookup
                if ( data ) {
                    if ( !queue || jQuery.isArray(data) ) {
                        queue = jQuery._data( elem, type, jQuery.makeArray(data) );
                    } else {
                        queue.push( data );
                    }
                }
                return queue || [];
            }
        },
    
        dequeue: function( elem, type ) {
            type = type || "fx";
    
            var queue = jQuery.queue( elem, type ),
                startLength = queue.length,
                fn = queue.shift(),
                hooks = jQuery._queueHooks( elem, type ),
                next = function() {
                    jQuery.dequeue( elem, type );
                };
    
            // If the fx queue is dequeued, always remove the progress sentinel
            if ( fn === "inprogress" ) {
                fn = queue.shift();
                startLength--;
            }
    
            if ( fn ) {
    
                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if ( type === "fx" ) {
                    queue.unshift( "inprogress" );
                }
    
                // clear up the last queue stop function
                delete hooks.stop;
                fn.call( elem, next, hooks );
            }
    
            if ( !startLength && hooks ) {
                hooks.empty.fire();
            }
        },
    
        // not intended for public consumption - generates a queueHooks object, or returns the current one
        _queueHooks: function( elem, type ) {
            var key = type + "queueHooks";
            return jQuery._data( elem, key ) || jQuery._data( elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    jQuery._removeData( elem, type + "queue" );
                    jQuery._removeData( elem, key );
                })
            });
        }
    });
    
    jQuery.fn.extend({
        queue: function( type, data ) {
            var setter = 2;
    
            if ( typeof type !== "string" ) {
                data = type;
                type = "fx";
                setter--;
            }
    
            if ( arguments.length < setter ) {
                return jQuery.queue( this[0], type );
            }
    
            return data === undefined ?
                this :
                this.each(function() {
                    var queue = jQuery.queue( this, type, data );
    
                    // ensure a hooks for this queue
                    jQuery._queueHooks( this, type );
    
                    if ( type === "fx" && queue[0] !== "inprogress" ) {
                        jQuery.dequeue( this, type );
                    }
                });
        },
        dequeue: function( type ) {
            return this.each(function() {
                jQuery.dequeue( this, type );
            });
        },
        // Based off of the plugin by Clint Helfers, with permission.
        // http://blindsignals.com/index.php/2009/07/jquery-delay/
        delay: function( time, type ) {
            time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
            type = type || "fx";
    
            return this.queue( type, function( next, hooks ) {
                var timeout = setTimeout( next, time );
                hooks.stop = function() {
                    clearTimeout( timeout );
                };
            });
        },
        clearQueue: function( type ) {
            return this.queue( type || "fx", [] );
        },
        // Get a promise resolved when queues of a certain type
        // are emptied (fx is the type by default)
        promise: function( type, obj ) {
            var tmp,
                count = 1,
                defer = jQuery.Deferred(),
                elements = this,
                i = this.length,
                resolve = function() {
                    if ( !( --count ) ) {
                        defer.resolveWith( elements, [ elements ] );
                    }
                };
    
            if ( typeof type !== "string" ) {
                obj = type;
                type = undefined;
            }
            type = type || "fx";
    
            while( i-- ) {
                tmp = jQuery._data( elements[ i ], type + "queueHooks" );
                if ( tmp && tmp.empty ) {
                    count++;
                    tmp.empty.add( resolve );
                }
            }
            resolve();
            return defer.promise( obj );
        }
    });
    var nodeHook, boolHook,
        rclass = /[\t\r\n\f]/g,
        rreturn = /\r/g,
        rfocusable = /^(?:input|select|textarea|button|object)$/i,
        rclickable = /^(?:a|area)$/i,
        ruseDefault = /^(?:checked|selected)$/i,
        getSetAttribute = jQuery.support.getSetAttribute,
        getSetInput = jQuery.support.input;
    
    jQuery.fn.extend({
        attr: function( name, value ) {
            return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
        },
    
        removeAttr: function( name ) {
            return this.each(function() {
                jQuery.removeAttr( this, name );
            });
        },
    
        prop: function( name, value ) {
            return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
        },
    
        removeProp: function( name ) {
            name = jQuery.propFix[ name ] || name;
            return this.each(function() {
                // try/catch handles cases where IE balks (such as removing a property on window)
                try {
                    this[ name ] = undefined;
                    delete this[ name ];
                } catch( e ) {}
            });
        },
    
        addClass: function( value ) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = typeof value === "string" && value;
    
            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).addClass( value.call( this, j, this.className ) );
                });
            }
    
            if ( proceed ) {
                // The disjunction here is for better compressibility (see removeClass)
                classes = ( value || "" ).match( core_rnotwhite ) || [];
    
                for ( ; i < len; i++ ) {
                    elem = this[ i ];
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        " "
                    );
    
                    if ( cur ) {
                        j = 0;
                        while ( (clazz = classes[j++]) ) {
                            if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
                                cur += clazz + " ";
                            }
                        }
                        elem.className = jQuery.trim( cur );
    
                    }
                }
            }
    
            return this;
        },
    
        removeClass: function( value ) {
            var classes, elem, cur, clazz, j,
                i = 0,
                len = this.length,
                proceed = arguments.length === 0 || typeof value === "string" && value;
    
            if ( jQuery.isFunction( value ) ) {
                return this.each(function( j ) {
                    jQuery( this ).removeClass( value.call( this, j, this.className ) );
                });
            }
            if ( proceed ) {
                classes = ( value || "" ).match( core_rnotwhite ) || [];
    
                for ( ; i < len; i++ ) {
                    elem = this[ i ];
                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass, " " ) :
                        ""
                    );
    
                    if ( cur ) {
                        j = 0;
                        while ( (clazz = classes[j++]) ) {
                            // Remove *all* instances
                            while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
                                cur = cur.replace( " " + clazz + " ", " " );
                            }
                        }
                        elem.className = value ? jQuery.trim( cur ) : "";
                    }
                }
            }
    
            return this;
        },
    
        toggleClass: function( value, stateVal ) {
            var type = typeof value;
    
            if ( typeof stateVal === "boolean" && type === "string" ) {
                return stateVal ? this.addClass( value ) : this.removeClass( value );
            }
    
            if ( jQuery.isFunction( value ) ) {
                return this.each(function( i ) {
                    jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
                });
            }
    
            return this.each(function() {
                if ( type === "string" ) {
                    // toggle individual class names
                    var className,
                        i = 0,
                        self = jQuery( this ),
                        classNames = value.match( core_rnotwhite ) || [];
    
                    while ( (className = classNames[ i++ ]) ) {
                        // check each className given, space separated list
                        if ( self.hasClass( className ) ) {
                            self.removeClass( className );
                        } else {
                            self.addClass( className );
                        }
                    }
    
                // Toggle whole class name
                } else if ( type === core_strundefined || type === "boolean" ) {
                    if ( this.className ) {
                        // store className if set
                        jQuery._data( this, "__className__", this.className );
                    }
    
                    // If the element has a class name or if we're passed "false",
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
                }
            });
        },
    
        hasClass: function( selector ) {
            var className = " " + selector + " ",
                i = 0,
                l = this.length;
            for ( ; i < l; i++ ) {
                if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
                    return true;
                }
            }
    
            return false;
        },
    
        val: function( value ) {
            var ret, hooks, isFunction,
                elem = this[0];
    
            if ( !arguments.length ) {
                if ( elem ) {
                    hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];
    
                    if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                        return ret;
                    }
    
                    ret = elem.value;
    
                    return typeof ret === "string" ?
                        // handle most common string cases
                        ret.replace(rreturn, "") :
                        // handle cases where value is null/undef or number
                        ret == null ? "" : ret;
                }
    
                return;
            }
    
            isFunction = jQuery.isFunction( value );
    
            return this.each(function( i ) {
                var val;
    
                if ( this.nodeType !== 1 ) {
                    return;
                }
    
                if ( isFunction ) {
                    val = value.call( this, i, jQuery( this ).val() );
                } else {
                    val = value;
                }
    
                // Treat null/undefined as ""; convert numbers to string
                if ( val == null ) {
                    val = "";
                } else if ( typeof val === "number" ) {
                    val += "";
                } else if ( jQuery.isArray( val ) ) {
                    val = jQuery.map(val, function ( value ) {
                        return value == null ? "" : value + "";
                    });
                }
    
                hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
    
                // If set returns undefined, fall back to normal setting
                if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                    this.value = val;
                }
            });
        }
    });
    
    jQuery.extend({
        valHooks: {
            option: {
                get: function( elem ) {
                    // Use proper attribute retrieval(#6932, #12072)
                    var val = jQuery.find.attr( elem, "value" );
                    return val != null ?
                        val :
                        elem.text;
                }
            },
            select: {
                get: function( elem ) {
                    var value, option,
                        options = elem.options,
                        index = elem.selectedIndex,
                        one = elem.type === "select-one" || index < 0,
                        values = one ? null : [],
                        max = one ? index + 1 : options.length,
                        i = index < 0 ?
                            max :
                            one ? index : 0;
    
                    // Loop through all the selected options
                    for ( ; i < max; i++ ) {
                        option = options[ i ];
    
                        // oldIE doesn't update selected after form reset (#2551)
                        if ( ( option.selected || i === index ) &&
                                // Don't return options that are disabled or in a disabled optgroup
                                ( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
                                ( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
    
                            // Get the specific value for the option
                            value = jQuery( option ).val();
    
                            // We don't need an array for one selects
                            if ( one ) {
                                return value;
                            }
    
                            // Multi-Selects return an array
                            values.push( value );
                        }
                    }
    
                    return values;
                },
    
                set: function( elem, value ) {
                    var optionSet, option,
                        options = elem.options,
                        values = jQuery.makeArray( value ),
                        i = options.length;
    
                    while ( i-- ) {
                        option = options[ i ];
                        if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
                            optionSet = true;
                        }
                    }
    
                    // force browsers to behave consistently when non-matching value is set
                    if ( !optionSet ) {
                        elem.selectedIndex = -1;
                    }
                    return values;
                }
            }
        },
    
        attr: function( elem, name, value ) {
            var hooks, ret,
                nType = elem.nodeType;
    
            // don't get/set attributes on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }
    
            // Fallback to prop when attributes are not supported
            if ( typeof elem.getAttribute === core_strundefined ) {
                return jQuery.prop( elem, name, value );
            }
    
            // All attributes are lowercase
            // Grab necessary hook if one is defined
            if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[ name ] ||
                    ( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
            }
    
            if ( value !== undefined ) {
    
                if ( value === null ) {
                    jQuery.removeAttr( elem, name );
    
                } else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                    return ret;
    
                } else {
                    elem.setAttribute( name, value + "" );
                    return value;
                }
    
            } else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;
    
            } else {
                ret = jQuery.find.attr( elem, name );
    
                // Non-existent attributes return null, we normalize to undefined
                return ret == null ?
                    undefined :
                    ret;
            }
        },
    
        removeAttr: function( elem, value ) {
            var name, propName,
                i = 0,
                attrNames = value && value.match( core_rnotwhite );
    
            if ( attrNames && elem.nodeType === 1 ) {
                while ( (name = attrNames[i++]) ) {
                    propName = jQuery.propFix[ name ] || name;
    
                    // Boolean attributes get special treatment (#10870)
                    if ( jQuery.expr.match.bool.test( name ) ) {
                        // Set corresponding property to false
                        if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
                            elem[ propName ] = false;
                        // Support: IE<9
                        // Also clear defaultChecked/defaultSelected (if appropriate)
                        } else {
                            elem[ jQuery.camelCase( "default-" + name ) ] =
                                elem[ propName ] = false;
                        }
    
                    // See #9699 for explanation of this approach (setting first, then removal)
                    } else {
                        jQuery.attr( elem, name, "" );
                    }
    
                    elem.removeAttribute( getSetAttribute ? name : propName );
                }
            }
        },
    
        attrHooks: {
            type: {
                set: function( elem, value ) {
                    if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                        // Setting the type on a radio button after the value resets the value in IE6-9
                        // Reset value to default in case type is set after value during creation
                        var val = elem.value;
                        elem.setAttribute( "type", value );
                        if ( val ) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        },
    
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
    
        prop: function( elem, name, value ) {
            var ret, hooks, notxml,
                nType = elem.nodeType;
    
            // don't get/set properties on text, comment and attribute nodes
            if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
                return;
            }
    
            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
    
            if ( notxml ) {
                // Fix name and attach hooks
                name = jQuery.propFix[ name ] || name;
                hooks = jQuery.propHooks[ name ];
            }
    
            if ( value !== undefined ) {
                return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
                    ret :
                    ( elem[ name ] = value );
    
            } else {
                return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
                    ret :
                    elem[ name ];
            }
        },
    
        propHooks: {
            tabIndex: {
                get: function( elem ) {
                    // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                    // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                    // Use proper attribute retrieval(#12072)
                    var tabindex = jQuery.find.attr( elem, "tabindex" );
    
                    return tabindex ?
                        parseInt( tabindex, 10 ) :
                        rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                            0 :
                            -1;
                }
            }
        }
    });
    
    // Hooks for boolean attributes
    boolHook = {
        set: function( elem, value, name ) {
            if ( value === false ) {
                // Remove boolean attributes when set to false
                jQuery.removeAttr( elem, name );
            } else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
                // IE<8 needs the *property* name
                elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );
    
            // Use defaultChecked and defaultSelected for oldIE
            } else {
                elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
            }
    
            return name;
        }
    };
    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
        var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;
    
        jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
            function( elem, name, isXML ) {
                var fn = jQuery.expr.attrHandle[ name ],
                    ret = isXML ?
                        undefined :
                        /* jshint eqeqeq: false */
                        (jQuery.expr.attrHandle[ name ] = undefined) !=
                            getter( elem, name, isXML ) ?
    
                            name.toLowerCase() :
                            null;
                jQuery.expr.attrHandle[ name ] = fn;
                return ret;
            } :
            function( elem, name, isXML ) {
                return isXML ?
                    undefined :
                    elem[ jQuery.camelCase( "default-" + name ) ] ?
                        name.toLowerCase() :
                        null;
            };
    });
    
    // fix oldIE attroperties
    if ( !getSetInput || !getSetAttribute ) {
        jQuery.attrHooks.value = {
            set: function( elem, value, name ) {
                if ( jQuery.nodeName( elem, "input" ) ) {
                    // Does not return so that setAttribute is also used
                    elem.defaultValue = value;
                } else {
                    // Use nodeHook if defined (#1954); otherwise setAttribute is fine
                    return nodeHook && nodeHook.set( elem, value, name );
                }
            }
        };
    }
    
    // IE6/7 do not support getting/setting some attributes with get/setAttribute
    if ( !getSetAttribute ) {
    
        // Use this for any attribute in IE6/7
        // This fixes almost every IE6/7 issue
        nodeHook = {
            set: function( elem, value, name ) {
                // Set the existing or create a new attribute node
                var ret = elem.getAttributeNode( name );
                if ( !ret ) {
                    elem.setAttributeNode(
                        (ret = elem.ownerDocument.createAttribute( name ))
                    );
                }
    
                ret.value = value += "";
    
                // Break association with cloned elements by also using setAttribute (#9646)
                return name === "value" || value === elem.getAttribute( name ) ?
                    value :
                    undefined;
            }
        };
        jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
            // Some attributes are constructed with empty-string values when not defined
            function( elem, name, isXML ) {
                var ret;
                return isXML ?
                    undefined :
                    (ret = elem.getAttributeNode( name )) && ret.value !== "" ?
                        ret.value :
                        null;
            };
        jQuery.valHooks.button = {
            get: function( elem, name ) {
                var ret = elem.getAttributeNode( name );
                return ret && ret.specified ?
                    ret.value :
                    undefined;
            },
            set: nodeHook.set
        };
    
        // Set contenteditable to false on removals(#10429)
        // Setting to empty string throws an error as an invalid value
        jQuery.attrHooks.contenteditable = {
            set: function( elem, value, name ) {
                nodeHook.set( elem, value === "" ? false : value, name );
            }
        };
    
        // Set width and height to auto instead of 0 on empty string( Bug #8150 )
        // This is for removals
        jQuery.each([ "width", "height" ], function( i, name ) {
            jQuery.attrHooks[ name ] = {
                set: function( elem, value ) {
                    if ( value === "" ) {
                        elem.setAttribute( name, "auto" );
                        return value;
                    }
                }
            };
        });
    }
    
    
    // Some attributes require a special call on IE
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !jQuery.support.hrefNormalized ) {
        // href/src property should get the full normalized URL (#10299/#12915)
        jQuery.each([ "href", "src" ], function( i, name ) {
            jQuery.propHooks[ name ] = {
                get: function( elem ) {
                    return elem.getAttribute( name, 4 );
                }
            };
        });
    }
    
    if ( !jQuery.support.style ) {
        jQuery.attrHooks.style = {
            get: function( elem ) {
                // Return undefined in the case of empty string
                // Note: IE uppercases css property names, but if we were to .toLowerCase()
                // .cssText, that would destroy case senstitivity in URL's, like in "background"
                return elem.style.cssText || undefined;
            },
            set: function( elem, value ) {
                return ( elem.style.cssText = value + "" );
            }
        };
    }
    
    // Safari mis-reports the default selected property of an option
    // Accessing the parent's selectedIndex property fixes it
    if ( !jQuery.support.optSelected ) {
        jQuery.propHooks.selected = {
            get: function( elem ) {
                var parent = elem.parentNode;
    
                if ( parent ) {
                    parent.selectedIndex;
    
                    // Make sure that it also works with optgroups, see #5701
                    if ( parent.parentNode ) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        };
    }
    
    jQuery.each([
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable"
    ], function() {
        jQuery.propFix[ this.toLowerCase() ] = this;
    });
    
    // IE6/7 call enctype encoding
    if ( !jQuery.support.enctype ) {
        jQuery.propFix.enctype = "encoding";
    }
    
    // Radios and checkboxes getter/setter
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = {
            set: function( elem, value ) {
                if ( jQuery.isArray( value ) ) {
                    return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
                }
            }
        };
        if ( !jQuery.support.checkOn ) {
            jQuery.valHooks[ this ].get = function( elem ) {
                // Support: Webkit
                // "" is returned instead of "on" if a value isn't specified
                return elem.getAttribute("value") === null ? "on" : elem.value;
            };
        }
    });
    var rformElems = /^(?:input|select|textarea)$/i,
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    
    function returnTrue() {
        return true;
    }
    
    function returnFalse() {
        return false;
    }
    
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch ( err ) { }
    }
    
    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {
    
        global: {},
    
        add: function( elem, types, handler, data, selector ) {
            var tmp, events, t, handleObjIn,
                special, eventHandle, handleObj,
                handlers, type, namespaces, origType,
                elemData = jQuery._data( elem );
    
            // Don't attach events to noData or text/comment nodes (but allow plain objects)
            if ( !elemData ) {
                return;
            }
    
            // Caller can pass in an object of custom data in lieu of the handler
            if ( handler.handler ) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }
    
            // Make sure that the handler has a unique ID, used to find/remove it later
            if ( !handler.guid ) {
                handler.guid = jQuery.guid++;
            }
    
            // Init the element's event structure and main handler, if this is the first
            if ( !(events = elemData.events) ) {
                events = elemData.events = {};
            }
            if ( !(eventHandle = elemData.handle) ) {
                eventHandle = elemData.handle = function( e ) {
                    // Discard the second event of a jQuery.event.trigger() and
                    // when an event is called after a page has unloaded
                    return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
                        jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
                        undefined;
                };
                // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
                eventHandle.elem = elem;
            }
    
            // Handle multiple events separated by a space
            types = ( types || "" ).match( core_rnotwhite ) || [""];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[t] ) || [];
                type = origType = tmp[1];
                namespaces = ( tmp[2] || "" ).split( "." ).sort();
    
                // There *must* be a type, no attaching namespace-only handlers
                if ( !type ) {
                    continue;
                }
    
                // If event changes its type, use the special event handlers for the changed type
                special = jQuery.event.special[ type ] || {};
    
                // If selector defined, determine special event api type, otherwise given type
                type = ( selector ? special.delegateType : special.bindType ) || type;
    
                // Update special based on newly reset type
                special = jQuery.event.special[ type ] || {};
    
                // handleObj is passed to all event handlers
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
                    namespace: namespaces.join(".")
                }, handleObjIn );
    
                // Init the event handler queue if we're the first
                if ( !(handlers = events[ type ]) ) {
                    handlers = events[ type ] = [];
                    handlers.delegateCount = 0;
    
                    // Only use addEventListener/attachEvent if the special events handler returns false
                    if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                        // Bind the global event handler to the element
                        if ( elem.addEventListener ) {
                            elem.addEventListener( type, eventHandle, false );
    
                        } else if ( elem.attachEvent ) {
                            elem.attachEvent( "on" + type, eventHandle );
                        }
                    }
                }
    
                if ( special.add ) {
                    special.add.call( elem, handleObj );
    
                    if ( !handleObj.handler.guid ) {
                        handleObj.handler.guid = handler.guid;
                    }
                }
    
                // Add to the element's handler list, delegates in front
                if ( selector ) {
                    handlers.splice( handlers.delegateCount++, 0, handleObj );
                } else {
                    handlers.push( handleObj );
                }
    
                // Keep track of which events have ever been used, for event optimization
                jQuery.event.global[ type ] = true;
            }
    
            // Nullify elem to prevent memory leaks in IE
            elem = null;
        },
    
        // Detach an event or set of events from an element
        remove: function( elem, types, handler, selector, mappedTypes ) {
            var j, handleObj, tmp,
                origCount, t, events,
                special, handlers, type,
                namespaces, origType,
                elemData = jQuery.hasData( elem ) && jQuery._data( elem );
    
            if ( !elemData || !(events = elemData.events) ) {
                return;
            }
    
            // Once for each type.namespace in types; type may be omitted
            types = ( types || "" ).match( core_rnotwhite ) || [""];
            t = types.length;
            while ( t-- ) {
                tmp = rtypenamespace.exec( types[t] ) || [];
                type = origType = tmp[1];
                namespaces = ( tmp[2] || "" ).split( "." ).sort();
    
                // Unbind all events (on this namespace, if provided) for the element
                if ( !type ) {
                    for ( type in events ) {
                        jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
                    }
                    continue;
                }
    
                special = jQuery.event.special[ type ] || {};
                type = ( selector ? special.delegateType : special.bindType ) || type;
                handlers = events[ type ] || [];
                tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );
    
                // Remove matching events
                origCount = j = handlers.length;
                while ( j-- ) {
                    handleObj = handlers[ j ];
    
                    if ( ( mappedTypes || origType === handleObj.origType ) &&
                        ( !handler || handler.guid === handleObj.guid ) &&
                        ( !tmp || tmp.test( handleObj.namespace ) ) &&
                        ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
                        handlers.splice( j, 1 );
    
                        if ( handleObj.selector ) {
                            handlers.delegateCount--;
                        }
                        if ( special.remove ) {
                            special.remove.call( elem, handleObj );
                        }
                    }
                }
    
                // Remove generic event handler if we removed something and no more handlers exist
                // (avoids potential for endless recursion during removal of special event handlers)
                if ( origCount && !handlers.length ) {
                    if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
                        jQuery.removeEvent( elem, type, elemData.handle );
                    }
    
                    delete events[ type ];
                }
            }
    
            // Remove the expando if it's no longer used
            if ( jQuery.isEmptyObject( events ) ) {
                delete elemData.handle;
    
                // removeData also checks for emptiness and clears the expando if empty
                // so use it instead of delete
                jQuery._removeData( elem, "events" );
            }
        },
    
        trigger: function( event, data, elem, onlyHandlers ) {
            var handle, ontype, cur,
                bubbleType, special, tmp, i,
                eventPath = [ elem || document ],
                type = core_hasOwn.call( event, "type" ) ? event.type : event,
                namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];
    
            cur = tmp = elem = elem || document;
    
            // Don't do events on text and comment nodes
            if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
                return;
            }
    
            // focus/blur morphs to focusin/out; ensure we're not firing them right now
            if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
                return;
            }
    
            if ( type.indexOf(".") >= 0 ) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
    
            // Caller can pass in a jQuery.Event object, Object, or just an event type string
            event = event[ jQuery.expando ] ?
                event :
                new jQuery.Event( type, typeof event === "object" && event );
    
            // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ?
                new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
                null;
    
            // Clean up the event in case it is being reused
            event.result = undefined;
            if ( !event.target ) {
                event.target = elem;
            }
    
            // Clone any incoming data and prepend the event, creating the handler arg list
            data = data == null ?
                [ event ] :
                jQuery.makeArray( data, [ event ] );
    
            // Allow special events to draw outside the lines
            special = jQuery.event.special[ type ] || {};
            if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
                return;
            }
    
            // Determine event propagation path in advance, per W3C events spec (#9951)
            // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
            if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
    
                bubbleType = special.delegateType || type;
                if ( !rfocusMorph.test( bubbleType + type ) ) {
                    cur = cur.parentNode;
                }
                for ( ; cur; cur = cur.parentNode ) {
                    eventPath.push( cur );
                    tmp = cur;
                }
    
                // Only add window if we got to document (e.g., not plain obj or detached DOM)
                if ( tmp === (elem.ownerDocument || document) ) {
                    eventPath.push( tmp.defaultView || tmp.parentWindow || window );
                }
            }
    
            // Fire handlers on the event path
            i = 0;
            while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
    
                event.type = i > 1 ?
                    bubbleType :
                    special.bindType || type;
    
                // jQuery handler
                handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
                if ( handle ) {
                    handle.apply( cur, data );
                }
    
                // Native handler
                handle = ontype && cur[ ontype ];
                if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
                    event.preventDefault();
                }
            }
            event.type = type;
    
            // If nobody prevented the default action, do it now
            if ( !onlyHandlers && !event.isDefaultPrevented() ) {
    
                if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
                    jQuery.acceptData( elem ) ) {
    
                    // Call a native DOM method on the target with the same name name as the event.
                    // Can't use an .isFunction() check here because IE6/7 fails that test.
                    // Don't do default actions on window, that's where global variables be (#6170)
                    if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {
    
                        // Don't re-trigger an onFOO event when we call its FOO() method
                        tmp = elem[ ontype ];
    
                        if ( tmp ) {
                            elem[ ontype ] = null;
                        }
    
                        // Prevent re-triggering of the same event, since we already bubbled it above
                        jQuery.event.triggered = type;
                        try {
                            elem[ type ]();
                        } catch ( e ) {
                            // IE<9 dies on focus/blur to hidden element (#1486,#12518)
                            // only reproducible on winXP IE8 native, not IE9 in IE8 mode
                        }
                        jQuery.event.triggered = undefined;
    
                        if ( tmp ) {
                            elem[ ontype ] = tmp;
                        }
                    }
                }
            }
    
            return event.result;
        },
    
        dispatch: function( event ) {
    
            // Make a writable jQuery.Event from the native event object
            event = jQuery.event.fix( event );
    
            var i, ret, handleObj, matched, j,
                handlerQueue = [],
                args = core_slice.call( arguments ),
                handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
                special = jQuery.event.special[ event.type ] || {};
    
            // Use the fix-ed jQuery.Event rather than the (read-only) native event
            args[0] = event;
            event.delegateTarget = this;
    
            // Call the preDispatch hook for the mapped type, and let it bail if desired
            if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
                return;
            }
    
            // Determine handlers
            handlerQueue = jQuery.event.handlers.call( this, event, handlers );
    
            // Run delegates first; they may want to stop propagation beneath us
            i = 0;
            while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
                event.currentTarget = matched.elem;
    
                j = 0;
                while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
    
                    // Triggered event must either 1) have no namespace, or
                    // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                    if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {
    
                        event.handleObj = handleObj;
                        event.data = handleObj.data;
    
                        ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
                                .apply( matched.elem, args );
    
                        if ( ret !== undefined ) {
                            if ( (event.result = ret) === false ) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
    
            // Call the postDispatch hook for the mapped type
            if ( special.postDispatch ) {
                special.postDispatch.call( this, event );
            }
    
            return event.result;
        },
    
        handlers: function( event, handlers ) {
            var sel, handleObj, matches, i,
                handlerQueue = [],
                delegateCount = handlers.delegateCount,
                cur = event.target;
    
            // Find delegate handlers
            // Black-hole SVG <use> instance trees (#13180)
            // Avoid non-left-click bubbling in Firefox (#3861)
            if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
    
                /* jshint eqeqeq: false */
                for ( ; cur != this; cur = cur.parentNode || this ) {
                    /* jshint eqeqeq: true */
    
                    // Don't check non-elements (#13208)
                    // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
                    if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
                        matches = [];
                        for ( i = 0; i < delegateCount; i++ ) {
                            handleObj = handlers[ i ];
    
                            // Don't conflict with Object.prototype properties (#13203)
                            sel = handleObj.selector + " ";
    
                            if ( matches[ sel ] === undefined ) {
                                matches[ sel ] = handleObj.needsContext ?
                                    jQuery( sel, this ).index( cur ) >= 0 :
                                    jQuery.find( sel, this, null, [ cur ] ).length;
                            }
                            if ( matches[ sel ] ) {
                                matches.push( handleObj );
                            }
                        }
                        if ( matches.length ) {
                            handlerQueue.push({ elem: cur, handlers: matches });
                        }
                    }
                }
            }
    
            // Add the remaining (directly-bound) handlers
            if ( delegateCount < handlers.length ) {
                handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
            }
    
            return handlerQueue;
        },
    
        fix: function( event ) {
            if ( event[ jQuery.expando ] ) {
                return event;
            }
    
            // Create a writable copy of the event object and normalize some properties
            var i, prop, copy,
                type = event.type,
                originalEvent = event,
                fixHook = this.fixHooks[ type ];
    
            if ( !fixHook ) {
                this.fixHooks[ type ] = fixHook =
                    rmouseEvent.test( type ) ? this.mouseHooks :
                    rkeyEvent.test( type ) ? this.keyHooks :
                    {};
            }
            copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
    
            event = new jQuery.Event( originalEvent );
    
            i = copy.length;
            while ( i-- ) {
                prop = copy[ i ];
                event[ prop ] = originalEvent[ prop ];
            }
    
            // Support: IE<9
            // Fix target property (#1925)
            if ( !event.target ) {
                event.target = originalEvent.srcElement || document;
            }
    
            // Support: Chrome 23+, Safari?
            // Target should not be a text node (#504, #13143)
            if ( event.target.nodeType === 3 ) {
                event.target = event.target.parentNode;
            }
    
            // Support: IE<9
            // For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
            event.metaKey = !!event.metaKey;
    
            return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
        },
    
        // Includes some event props shared by KeyEvent and MouseEvent
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    
        fixHooks: {},
    
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function( event, original ) {
    
                // Add which for key events
                if ( event.which == null ) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }
    
                return event;
            }
        },
    
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function( event, original ) {
                var body, eventDoc, doc,
                    button = original.button,
                    fromElement = original.fromElement;
    
                // Calculate pageX/Y if missing and clientX/Y available
                if ( event.pageX == null && original.clientX != null ) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;
    
                    event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                    event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
                }
    
                // Add relatedTarget, if necessary
                if ( !event.relatedTarget && fromElement ) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }
    
                // Add which for click: 1 === left; 2 === middle; 3 === right
                // Note: button is not normalized, so don't use it
                if ( !event.which && button !== undefined ) {
                    event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
                }
    
                return event;
            }
        },
    
        special: {
            load: {
                // Prevent triggered image.load events from bubbling to window.load
                noBubble: true
            },
            focus: {
                // Fire native event if possible so blur/focus sequence is correct
                trigger: function() {
                    if ( this !== safeActiveElement() && this.focus ) {
                        try {
                            this.focus();
                            return false;
                        } catch ( e ) {
                            // Support: IE<9
                            // If we error on focus to hidden element (#1486, #12518),
                            // let .trigger() run the handlers
                        }
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if ( this === safeActiveElement() && this.blur ) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {
                // For checkbox, fire native event so checked state will be right
                trigger: function() {
                    if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
                        this.click();
                        return false;
                    }
                },
    
                // For cross-browser consistency, don't fire native .click() on links
                _default: function( event ) {
                    return jQuery.nodeName( event.target, "a" );
                }
            },
    
            beforeunload: {
                postDispatch: function( event ) {
    
                    // Even when returnValue equals to undefined Firefox will still show alert
                    if ( event.result !== undefined ) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },
    
        simulate: function( type, elem, event, bubble ) {
            // Piggyback on a donor event to simulate a different one.
            // Fake originalEvent to avoid donor's stopPropagation, but if the
            // simulated event prevents default then we do the same on the donor.
            var e = jQuery.extend(
                new jQuery.Event(),
                event,
                {
                    type: type,
                    isSimulated: true,
                    originalEvent: {}
                }
            );
            if ( bubble ) {
                jQuery.event.trigger( e, null, elem );
            } else {
                jQuery.event.dispatch.call( elem, e );
            }
            if ( e.isDefaultPrevented() ) {
                event.preventDefault();
            }
        }
    };
    
    jQuery.removeEvent = document.removeEventListener ?
        function( elem, type, handle ) {
            if ( elem.removeEventListener ) {
                elem.removeEventListener( type, handle, false );
            }
        } :
        function( elem, type, handle ) {
            var name = "on" + type;
    
            if ( elem.detachEvent ) {
    
                // #8545, #7054, preventing memory leaks for custom events in IE6-8
                // detachEvent needed property on element, by name of that event, to properly expose it to GC
                if ( typeof elem[ name ] === core_strundefined ) {
                    elem[ name ] = null;
                }
    
                elem.detachEvent( name, handle );
            }
        };
    
    jQuery.Event = function( src, props ) {
        // Allow instantiation without the 'new' keyword
        if ( !(this instanceof jQuery.Event) ) {
            return new jQuery.Event( src, props );
        }
    
        // Event object
        if ( src && src.type ) {
            this.originalEvent = src;
            this.type = src.type;
    
            // Events bubbling up the document may have been marked as prevented
            // by a handler lower down the tree; reflect the correct value.
            this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
                src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;
    
        // Event type
        } else {
            this.type = src;
        }
    
        // Put explicitly provided properties onto the event object
        if ( props ) {
            jQuery.extend( this, props );
        }
    
        // Create a timestamp if incoming event doesn't have one
        this.timeStamp = src && src.timeStamp || jQuery.now();
    
        // Mark it as fixed
        this[ jQuery.expando ] = true;
    };
    
    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
    
        preventDefault: function() {
            var e = this.originalEvent;
    
            this.isDefaultPrevented = returnTrue;
            if ( !e ) {
                return;
            }
    
            // If preventDefault exists, run it on the original event
            if ( e.preventDefault ) {
                e.preventDefault();
    
            // Support: IE
            // Otherwise set the returnValue property of the original event to false
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;
    
            this.isPropagationStopped = returnTrue;
            if ( !e ) {
                return;
            }
            // If stopPropagation exists, run it on the original event
            if ( e.stopPropagation ) {
                e.stopPropagation();
            }
    
            // Support: IE
            // Set the cancelBubble property of the original event to true
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = returnTrue;
            this.stopPropagation();
        }
    };
    
    // Create mouseenter/leave events using mouseover/out and event-time checks
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    }, function( orig, fix ) {
        jQuery.event.special[ orig ] = {
            delegateType: fix,
            bindType: fix,
    
            handle: function( event ) {
                var ret,
                    target = this,
                    related = event.relatedTarget,
                    handleObj = event.handleObj;
    
                // For mousenter/leave call the handler if related is outside the target.
                // NB: No relatedTarget if the mouse left/entered the browser window
                if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply( this, arguments );
                    event.type = fix;
                }
                return ret;
            }
        };
    });
    
    // IE submit delegation
    if ( !jQuery.support.submitBubbles ) {
    
        jQuery.event.special.submit = {
            setup: function() {
                // Only need this for delegated form submit events
                if ( jQuery.nodeName( this, "form" ) ) {
                    return false;
                }
    
                // Lazy-add a submit handler when a descendant form may potentially be submitted
                jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
                    // Node name check avoids a VML-related crash in IE (#9807)
                    var elem = e.target,
                        form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
                    if ( form && !jQuery._data( form, "submitBubbles" ) ) {
                        jQuery.event.add( form, "submit._submit", function( event ) {
                            event._submit_bubble = true;
                        });
                        jQuery._data( form, "submitBubbles", true );
                    }
                });
                // return undefined since we don't need an event listener
            },
    
            postDispatch: function( event ) {
                // If form was submitted by the user, bubble the event up the tree
                if ( event._submit_bubble ) {
                    delete event._submit_bubble;
                    if ( this.parentNode && !event.isTrigger ) {
                        jQuery.event.simulate( "submit", this.parentNode, event, true );
                    }
                }
            },
    
            teardown: function() {
                // Only need this for delegated form submit events
                if ( jQuery.nodeName( this, "form" ) ) {
                    return false;
                }
    
                // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
                jQuery.event.remove( this, "._submit" );
            }
        };
    }
    
    // IE change delegation and checkbox/radio fix
    if ( !jQuery.support.changeBubbles ) {
    
        jQuery.event.special.change = {
    
            setup: function() {
    
                if ( rformElems.test( this.nodeName ) ) {
                    // IE doesn't fire change on a check/radio until blur; trigger it on click
                    // after a propertychange. Eat the blur-change in special.change.handle.
                    // This still fires onchange a second time for check/radio after blur.
                    if ( this.type === "checkbox" || this.type === "radio" ) {
                        jQuery.event.add( this, "propertychange._change", function( event ) {
                            if ( event.originalEvent.propertyName === "checked" ) {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add( this, "click._change", function( event ) {
                            if ( this._just_changed && !event.isTrigger ) {
                                this._just_changed = false;
                            }
                            // Allow triggered, simulated change events (#11500)
                            jQuery.event.simulate( "change", this, event, true );
                        });
                    }
                    return false;
                }
                // Delegated event; lazy-add a change handler on descendant inputs
                jQuery.event.add( this, "beforeactivate._change", function( e ) {
                    var elem = e.target;
    
                    if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
                        jQuery.event.add( elem, "change._change", function( event ) {
                            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
                                jQuery.event.simulate( "change", this.parentNode, event, true );
                            }
                        });
                        jQuery._data( elem, "changeBubbles", true );
                    }
                });
            },
    
            handle: function( event ) {
                var elem = event.target;
    
                // Swallow native change events from checkbox/radio, we already triggered them above
                if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
                    return event.handleObj.handler.apply( this, arguments );
                }
            },
    
            teardown: function() {
                jQuery.event.remove( this, "._change" );
    
                return !rformElems.test( this.nodeName );
            }
        };
    }
    
    // Create "bubbling" focus and blur events
    if ( !jQuery.support.focusinBubbles ) {
        jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
    
            // Attach a single capturing handler while someone wants focusin/focusout
            var attaches = 0,
                handler = function( event ) {
                    jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
                };
    
            jQuery.event.special[ fix ] = {
                setup: function() {
                    if ( attaches++ === 0 ) {
                        document.addEventListener( orig, handler, true );
                    }
                },
                teardown: function() {
                    if ( --attaches === 0 ) {
                        document.removeEventListener( orig, handler, true );
                    }
                }
            };
        });
    }
    
    jQuery.fn.extend({
    
        on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
            var type, origFn;
    
            // Types can be a map of types/handlers
            if ( typeof types === "object" ) {
                // ( types-Object, selector, data )
                if ( typeof selector !== "string" ) {
                    // ( types-Object, data )
                    data = data || selector;
                    selector = undefined;
                }
                for ( type in types ) {
                    this.on( type, selector, data, types[ type ], one );
                }
                return this;
            }
    
            if ( data == null && fn == null ) {
                // ( types, fn )
                fn = selector;
                data = selector = undefined;
            } else if ( fn == null ) {
                if ( typeof selector === "string" ) {
                    // ( types, selector, fn )
                    fn = data;
                    data = undefined;
                } else {
                    // ( types, data, fn )
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if ( fn === false ) {
                fn = returnFalse;
            } else if ( !fn ) {
                return this;
            }
    
            if ( one === 1 ) {
                origFn = fn;
                fn = function( event ) {
                    // Can use an empty set, since event contains the info
                    jQuery().off( event );
                    return origFn.apply( this, arguments );
                };
                // Use same guid so caller can remove using origFn
                fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
            }
            return this.each( function() {
                jQuery.event.add( this, types, fn, data, selector );
            });
        },
        one: function( types, selector, data, fn ) {
            return this.on( types, selector, data, fn, 1 );
        },
        off: function( types, selector, fn ) {
            var handleObj, type;
            if ( types && types.preventDefault && types.handleObj ) {
                // ( event )  dispatched jQuery.Event
                handleObj = types.handleObj;
                jQuery( types.delegateTarget ).off(
                    handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
                    handleObj.selector,
                    handleObj.handler
                );
                return this;
            }
            if ( typeof types === "object" ) {
                // ( types-object [, selector] )
                for ( type in types ) {
                    this.off( type, selector, types[ type ] );
                }
                return this;
            }
            if ( selector === false || typeof selector === "function" ) {
                // ( types [, fn] )
                fn = selector;
                selector = undefined;
            }
            if ( fn === false ) {
                fn = returnFalse;
            }
            return this.each(function() {
                jQuery.event.remove( this, types, fn, selector );
            });
        },
    
        trigger: function( type, data ) {
            return this.each(function() {
                jQuery.event.trigger( type, data, this );
            });
        },
        triggerHandler: function( type, data ) {
            var elem = this[0];
            if ( elem ) {
                return jQuery.event.trigger( type, data, elem, true );
            }
        }
    });
    var isSimple = /^.[^:#\[\.,]*$/,
        rparentsprev = /^(?:parents|prev(?:Until|All))/,
        rneedsContext = jQuery.expr.match.needsContext,
        // methods guaranteed to produce a unique set when starting from a unique set
        guaranteedUnique = {
            children: true,
            contents: true,
            next: true,
            prev: true
        };
    
    jQuery.fn.extend({
        find: function( selector ) {
            var i,
                ret = [],
                self = this,
                len = self.length;
    
            if ( typeof selector !== "string" ) {
                return this.pushStack( jQuery( selector ).filter(function() {
                    for ( i = 0; i < len; i++ ) {
                        if ( jQuery.contains( self[ i ], this ) ) {
                            return true;
                        }
                    }
                }) );
            }
    
            for ( i = 0; i < len; i++ ) {
                jQuery.find( selector, self[ i ], ret );
            }
    
            // Needed because $( selector, context ) becomes $( context ).find( selector )
            ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        },
    
        has: function( target ) {
            var i,
                targets = jQuery( target, this ),
                len = targets.length;
    
            return this.filter(function() {
                for ( i = 0; i < len; i++ ) {
                    if ( jQuery.contains( this, targets[i] ) ) {
                        return true;
                    }
                }
            });
        },
    
        not: function( selector ) {
            return this.pushStack( winnow(this, selector || [], true) );
        },
    
        filter: function( selector ) {
            return this.pushStack( winnow(this, selector || [], false) );
        },
    
        is: function( selector ) {
            return !!winnow(
                this,
    
                // If this is a positional/relative selector, check membership in the returned set
                // so $("p:first").is("p:last") won't return true for a doc with two "p".
                typeof selector === "string" && rneedsContext.test( selector ) ?
                    jQuery( selector ) :
                    selector || [],
                false
            ).length;
        },
    
        closest: function( selectors, context ) {
            var cur,
                i = 0,
                l = this.length,
                ret = [],
                pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
                    jQuery( selectors, context || this.context ) :
                    0;
    
            for ( ; i < l; i++ ) {
                for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
                    // Always skip document fragments
                    if ( cur.nodeType < 11 && (pos ?
                        pos.index(cur) > -1 :
    
                        // Don't pass non-elements to Sizzle
                        cur.nodeType === 1 &&
                            jQuery.find.matchesSelector(cur, selectors)) ) {
    
                        cur = ret.push( cur );
                        break;
                    }
                }
            }
    
            return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
        },
    
        // Determine the position of an element within
        // the matched set of elements
        index: function( elem ) {
    
            // No argument, return index in parent
            if ( !elem ) {
                return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
            }
    
            // index in selector
            if ( typeof elem === "string" ) {
                return jQuery.inArray( this[0], jQuery( elem ) );
            }
    
            // Locate the position of the desired element
            return jQuery.inArray(
                // If it receives a jQuery object, the first element is used
                elem.jquery ? elem[0] : elem, this );
        },
    
        add: function( selector, context ) {
            var set = typeof selector === "string" ?
                    jQuery( selector, context ) :
                    jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
                all = jQuery.merge( this.get(), set );
    
            return this.pushStack( jQuery.unique(all) );
        },
    
        addBack: function( selector ) {
            return this.add( selector == null ?
                this.prevObject : this.prevObject.filter(selector)
            );
        }
    });
    
    function sibling( cur, dir ) {
        do {
            cur = cur[ dir ];
        } while ( cur && cur.nodeType !== 1 );
    
        return cur;
    }
    
    jQuery.each({
        parent: function( elem ) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function( elem ) {
            return jQuery.dir( elem, "parentNode" );
        },
        parentsUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "parentNode", until );
        },
        next: function( elem ) {
            return sibling( elem, "nextSibling" );
        },
        prev: function( elem ) {
            return sibling( elem, "previousSibling" );
        },
        nextAll: function( elem ) {
            return jQuery.dir( elem, "nextSibling" );
        },
        prevAll: function( elem ) {
            return jQuery.dir( elem, "previousSibling" );
        },
        nextUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "nextSibling", until );
        },
        prevUntil: function( elem, i, until ) {
            return jQuery.dir( elem, "previousSibling", until );
        },
        siblings: function( elem ) {
            return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
        },
        children: function( elem ) {
            return jQuery.sibling( elem.firstChild );
        },
        contents: function( elem ) {
            return jQuery.nodeName( elem, "iframe" ) ?
                elem.contentDocument || elem.contentWindow.document :
                jQuery.merge( [], elem.childNodes );
        }
    }, function( name, fn ) {
        jQuery.fn[ name ] = function( until, selector ) {
            var ret = jQuery.map( this, fn, until );
    
            if ( name.slice( -5 ) !== "Until" ) {
                selector = until;
            }
    
            if ( selector && typeof selector === "string" ) {
                ret = jQuery.filter( selector, ret );
            }
    
            if ( this.length > 1 ) {
                // Remove duplicates
                if ( !guaranteedUnique[ name ] ) {
                    ret = jQuery.unique( ret );
                }
    
                // Reverse order for parents* and prev-derivatives
                if ( rparentsprev.test( name ) ) {
                    ret = ret.reverse();
                }
            }
    
            return this.pushStack( ret );
        };
    });
    
    jQuery.extend({
        filter: function( expr, elems, not ) {
            var elem = elems[ 0 ];
    
            if ( not ) {
                expr = ":not(" + expr + ")";
            }
    
            return elems.length === 1 && elem.nodeType === 1 ?
                jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
                jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
                    return elem.nodeType === 1;
                }));
        },
    
        dir: function( elem, dir, until ) {
            var matched = [],
                cur = elem[ dir ];
    
            while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
                if ( cur.nodeType === 1 ) {
                    matched.push( cur );
                }
                cur = cur[dir];
            }
            return matched;
        },
    
        sibling: function( n, elem ) {
            var r = [];
    
            for ( ; n; n = n.nextSibling ) {
                if ( n.nodeType === 1 && n !== elem ) {
                    r.push( n );
                }
            }
    
            return r;
        }
    });
    
    // Implement the identical functionality for filter and not
    function winnow( elements, qualifier, not ) {
        if ( jQuery.isFunction( qualifier ) ) {
            return jQuery.grep( elements, function( elem, i ) {
                /* jshint -W018 */
                return !!qualifier.call( elem, i, elem ) !== not;
            });
    
        }
    
        if ( qualifier.nodeType ) {
            return jQuery.grep( elements, function( elem ) {
                return ( elem === qualifier ) !== not;
            });
    
        }
    
        if ( typeof qualifier === "string" ) {
            if ( isSimple.test( qualifier ) ) {
                return jQuery.filter( qualifier, elements, not );
            }
    
            qualifier = jQuery.filter( qualifier, elements );
        }
    
        return jQuery.grep( elements, function( elem ) {
            return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
        });
    }
    function createSafeFragment( document ) {
        var list = nodeNames.split( "|" ),
            safeFrag = document.createDocumentFragment();
    
        if ( safeFrag.createElement ) {
            while ( list.length ) {
                safeFrag.createElement(
                    list.pop()
                );
            }
        }
        return safeFrag;
    }
    
    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
        rleadingWhitespace = /^\s+/,
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        rtagName = /<([\w:]+)/,
        rtbody = /<tbody/i,
        rhtml = /<|&#?\w+;/,
        rnoInnerhtml = /<(?:script|style|link)/i,
        manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
        // checked="checked" or checked
        rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
        rscriptType = /^$|\/(?:java|ecma)script/i,
        rscriptTypeMasked = /^true\/(.*)/,
        rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    
        // We have to close these tags to support XHTML (#13200)
        wrapMap = {
            option: [ 1, "<select multiple='multiple'>", "</select>" ],
            legend: [ 1, "<fieldset>", "</fieldset>" ],
            area: [ 1, "<map>", "</map>" ],
            param: [ 1, "<object>", "</object>" ],
            thead: [ 1, "<table>", "</table>" ],
            tr: [ 2, "<table><tbody>", "</tbody></table>" ],
            col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
            td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    
            // IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
            // unless wrapped in a div with non-breaking characters in front of it.
            _default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
        },
        safeFragment = createSafeFragment( document ),
        fragmentDiv = safeFragment.appendChild( document.createElement("div") );
    
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    
    jQuery.fn.extend({
        text: function( value ) {
            return jQuery.access( this, function( value ) {
                return value === undefined ?
                    jQuery.text( this ) :
                    this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
            }, null, value, arguments.length );
        },
    
        append: function() {
            return this.domManip( arguments, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    var target = manipulationTarget( this, elem );
                    target.appendChild( elem );
                }
            });
        },
    
        prepend: function() {
            return this.domManip( arguments, function( elem ) {
                if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
                    var target = manipulationTarget( this, elem );
                    target.insertBefore( elem, target.firstChild );
                }
            });
        },
    
        before: function() {
            return this.domManip( arguments, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this );
                }
            });
        },
    
        after: function() {
            return this.domManip( arguments, function( elem ) {
                if ( this.parentNode ) {
                    this.parentNode.insertBefore( elem, this.nextSibling );
                }
            });
        },
    
        // keepData is for internal use only--do not document
        remove: function( selector, keepData ) {
            var elem,
                elems = selector ? jQuery.filter( selector, this ) : this,
                i = 0;
    
            for ( ; (elem = elems[i]) != null; i++ ) {
    
                if ( !keepData && elem.nodeType === 1 ) {
                    jQuery.cleanData( getAll( elem ) );
                }
    
                if ( elem.parentNode ) {
                    if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
                        setGlobalEval( getAll( elem, "script" ) );
                    }
                    elem.parentNode.removeChild( elem );
                }
            }
    
            return this;
        },
    
        empty: function() {
            var elem,
                i = 0;
    
            for ( ; (elem = this[i]) != null; i++ ) {
                // Remove element nodes and prevent memory leaks
                if ( elem.nodeType === 1 ) {
                    jQuery.cleanData( getAll( elem, false ) );
                }
    
                // Remove any remaining nodes
                while ( elem.firstChild ) {
                    elem.removeChild( elem.firstChild );
                }
    
                // If this is a select, ensure that it displays empty (#12336)
                // Support: IE<9
                if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
                    elem.options.length = 0;
                }
            }
    
            return this;
        },
    
        clone: function( dataAndEvents, deepDataAndEvents ) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
    
            return this.map( function () {
                return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
            });
        },
    
        html: function( value ) {
            return jQuery.access( this, function( value ) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;
    
                if ( value === undefined ) {
                    return elem.nodeType === 1 ?
                        elem.innerHTML.replace( rinlinejQuery, "" ) :
                        undefined;
                }
    
                // See if we can take a shortcut and just use innerHTML
                if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
                    ( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
                    ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
                    !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {
    
                    value = value.replace( rxhtmlTag, "<$1></$2>" );
    
                    try {
                        for (; i < l; i++ ) {
                            // Remove element nodes and prevent memory leaks
                            elem = this[i] || {};
                            if ( elem.nodeType === 1 ) {
                                jQuery.cleanData( getAll( elem, false ) );
                                elem.innerHTML = value;
                            }
                        }
    
                        elem = 0;
    
                    // If using innerHTML throws an exception, use the fallback method
                    } catch(e) {}
                }
    
                if ( elem ) {
                    this.empty().append( value );
                }
            }, null, value, arguments.length );
        },
    
        replaceWith: function() {
            var
                // Snapshot the DOM in case .domManip sweeps something relevant into its fragment
                args = jQuery.map( this, function( elem ) {
                    return [ elem.nextSibling, elem.parentNode ];
                }),
                i = 0;
    
            // Make the changes, replacing each context element with the new content
            this.domManip( arguments, function( elem ) {
                var next = args[ i++ ],
                    parent = args[ i++ ];
    
                if ( parent ) {
                    // Don't use the snapshot next if it has moved (#13810)
                    if ( next && next.parentNode !== parent ) {
                        next = this.nextSibling;
                    }
                    jQuery( this ).remove();
                    parent.insertBefore( elem, next );
                }
            // Allow new content to include elements from the context set
            }, true );
    
            // Force removal if there was no new content (e.g., from empty arguments)
            return i ? this : this.remove();
        },
    
        detach: function( selector ) {
            return this.remove( selector, true );
        },
    
        domManip: function( args, callback, allowIntersection ) {
    
            // Flatten any nested arrays
            args = core_concat.apply( [], args );
    
            var first, node, hasScripts,
                scripts, doc, fragment,
                i = 0,
                l = this.length,
                set = this,
                iNoClone = l - 1,
                value = args[0],
                isFunction = jQuery.isFunction( value );
    
            // We can't cloneNode fragments that contain checked, in WebKit
            if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
                return this.each(function( index ) {
                    var self = set.eq( index );
                    if ( isFunction ) {
                        args[0] = value.call( this, index, self.html() );
                    }
                    self.domManip( args, callback, allowIntersection );
                });
            }
    
            if ( l ) {
                fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
                first = fragment.firstChild;
    
                if ( fragment.childNodes.length === 1 ) {
                    fragment = first;
                }
    
                if ( first ) {
                    scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
                    hasScripts = scripts.length;
    
                    // Use the original fragment for the last item instead of the first because it can end up
                    // being emptied incorrectly in certain situations (#8070).
                    for ( ; i < l; i++ ) {
                        node = fragment;
    
                        if ( i !== iNoClone ) {
                            node = jQuery.clone( node, true, true );
    
                            // Keep references to cloned scripts for later restoration
                            if ( hasScripts ) {
                                jQuery.merge( scripts, getAll( node, "script" ) );
                            }
                        }
    
                        callback.call( this[i], node, i );
                    }
    
                    if ( hasScripts ) {
                        doc = scripts[ scripts.length - 1 ].ownerDocument;
    
                        // Reenable scripts
                        jQuery.map( scripts, restoreScript );
    
                        // Evaluate executable scripts on first document insertion
                        for ( i = 0; i < hasScripts; i++ ) {
                            node = scripts[ i ];
                            if ( rscriptType.test( node.type || "" ) &&
                                !jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {
    
                                if ( node.src ) {
                                    // Hope ajax is available...
                                    jQuery._evalUrl( node.src );
                                } else {
                                    jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
                                }
                            }
                        }
                    }
    
                    // Fix #11809: Avoid leaking memory
                    fragment = first = null;
                }
            }
    
            return this;
        }
    });
    
    // Support: IE<8
    // Manipulating tables requires a tbody
    function manipulationTarget( elem, content ) {
        return jQuery.nodeName( elem, "table" ) &&
            jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?
    
            elem.getElementsByTagName("tbody")[0] ||
                elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
            elem;
    }
    
    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
        elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
        return elem;
    }
    function restoreScript( elem ) {
        var match = rscriptTypeMasked.exec( elem.type );
        if ( match ) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }
        return elem;
    }
    
    // Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
        var elem,
            i = 0;
        for ( ; (elem = elems[i]) != null; i++ ) {
            jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
        }
    }
    
    function cloneCopyEvent( src, dest ) {
    
        if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
            return;
        }
    
        var type, i, l,
            oldData = jQuery._data( src ),
            curData = jQuery._data( dest, oldData ),
            events = oldData.events;
    
        if ( events ) {
            delete curData.handle;
            curData.events = {};
    
            for ( type in events ) {
                for ( i = 0, l = events[ type ].length; i < l; i++ ) {
                    jQuery.event.add( dest, type, events[ type ][ i ] );
                }
            }
        }
    
        // make the cloned public data object a copy from the original
        if ( curData.data ) {
            curData.data = jQuery.extend( {}, curData.data );
        }
    }
    
    function fixCloneNodeIssues( src, dest ) {
        var nodeName, e, data;
    
        // We do not need to do anything for non-Elements
        if ( dest.nodeType !== 1 ) {
            return;
        }
    
        nodeName = dest.nodeName.toLowerCase();
    
        // IE6-8 copies events bound via attachEvent when using cloneNode.
        if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
            data = jQuery._data( dest );
    
            for ( e in data.events ) {
                jQuery.removeEvent( dest, e, data.handle );
            }
    
            // Event data gets referenced instead of copied if the expando gets copied too
            dest.removeAttribute( jQuery.expando );
        }
    
        // IE blanks contents when cloning scripts, and tries to evaluate newly-set text
        if ( nodeName === "script" && dest.text !== src.text ) {
            disableScript( dest ).text = src.text;
            restoreScript( dest );
    
        // IE6-10 improperly clones children of object elements using classid.
        // IE10 throws NoModificationAllowedError if parent is null, #12132.
        } else if ( nodeName === "object" ) {
            if ( dest.parentNode ) {
                dest.outerHTML = src.outerHTML;
            }
    
            // This path appears unavoidable for IE9. When cloning an object
            // element in IE9, the outerHTML strategy above is not sufficient.
            // If the src has innerHTML and the destination does not,
            // copy the src.innerHTML into the dest.innerHTML. #10324
            if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
                dest.innerHTML = src.innerHTML;
            }
    
        } else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
            // IE6-8 fails to persist the checked state of a cloned checkbox
            // or radio button. Worse, IE6-7 fail to give the cloned element
            // a checked appearance if the defaultChecked value isn't also set
    
            dest.defaultChecked = dest.checked = src.checked;
    
            // IE6-7 get confused and end up setting the value of a cloned
            // checkbox/radio button to an empty string instead of "on"
            if ( dest.value !== src.value ) {
                dest.value = src.value;
            }
    
        // IE6-8 fails to return the selected option to the default selected
        // state when cloning options
        } else if ( nodeName === "option" ) {
            dest.defaultSelected = dest.selected = src.defaultSelected;
    
        // IE6-8 fails to set the defaultValue to the correct value when
        // cloning other types of input fields
        } else if ( nodeName === "input" || nodeName === "textarea" ) {
            dest.defaultValue = src.defaultValue;
        }
    }
    
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function( name, original ) {
        jQuery.fn[ name ] = function( selector ) {
            var elems,
                i = 0,
                ret = [],
                insert = jQuery( selector ),
                last = insert.length - 1;
    
            for ( ; i <= last; i++ ) {
                elems = i === last ? this : this.clone(true);
                jQuery( insert[i] )[ original ]( elems );
    
                // Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
                core_push.apply( ret, elems.get() );
            }
    
            return this.pushStack( ret );
        };
    });
    
    function getAll( context, tag ) {
        var elems, elem,
            i = 0,
            found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
                typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
                undefined;
    
        if ( !found ) {
            for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
                if ( !tag || jQuery.nodeName( elem, tag ) ) {
                    found.push( elem );
                } else {
                    jQuery.merge( found, getAll( elem, tag ) );
                }
            }
        }
    
        return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
            jQuery.merge( [ context ], found ) :
            found;
    }
    
    // Used in buildFragment, fixes the defaultChecked property
    function fixDefaultChecked( elem ) {
        if ( manipulation_rcheckableType.test( elem.type ) ) {
            elem.defaultChecked = elem.checked;
        }
    }
    
    jQuery.extend({
        clone: function( elem, dataAndEvents, deepDataAndEvents ) {
            var destElements, node, clone, i, srcElements,
                inPage = jQuery.contains( elem.ownerDocument, elem );
    
            if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
                clone = elem.cloneNode( true );
    
            // IE<=8 does not properly clone detached, unknown element nodes
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
            }
    
            if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                    (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
    
                // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
                destElements = getAll( clone );
                srcElements = getAll( elem );
    
                // Fix all IE cloning issues
                for ( i = 0; (node = srcElements[i]) != null; ++i ) {
                    // Ensure that the destination node is not null; Fixes #9587
                    if ( destElements[i] ) {
                        fixCloneNodeIssues( node, destElements[i] );
                    }
                }
            }
    
            // Copy the events from the original to the clone
            if ( dataAndEvents ) {
                if ( deepDataAndEvents ) {
                    srcElements = srcElements || getAll( elem );
                    destElements = destElements || getAll( clone );
    
                    for ( i = 0; (node = srcElements[i]) != null; i++ ) {
                        cloneCopyEvent( node, destElements[i] );
                    }
                } else {
                    cloneCopyEvent( elem, clone );
                }
            }
    
            // Preserve script evaluation history
            destElements = getAll( clone, "script" );
            if ( destElements.length > 0 ) {
                setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
            }
    
            destElements = srcElements = node = null;
    
            // Return the cloned set
            return clone;
        },
    
        buildFragment: function( elems, context, scripts, selection ) {
            var j, elem, contains,
                tmp, tag, tbody, wrap,
                l = elems.length,
    
                // Ensure a safe fragment
                safe = createSafeFragment( context ),
    
                nodes = [],
                i = 0;
    
            for ( ; i < l; i++ ) {
                elem = elems[ i ];
    
                if ( elem || elem === 0 ) {
    
                    // Add nodes directly
                    if ( jQuery.type( elem ) === "object" ) {
                        jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
    
                    // Convert non-html into a text node
                    } else if ( !rhtml.test( elem ) ) {
                        nodes.push( context.createTextNode( elem ) );
    
                    // Convert html into DOM nodes
                    } else {
                        tmp = tmp || safe.appendChild( context.createElement("div") );
    
                        // Deserialize a standard representation
                        tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
                        wrap = wrapMap[ tag ] || wrapMap._default;
    
                        tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];
    
                        // Descend through wrappers to the right content
                        j = wrap[0];
                        while ( j-- ) {
                            tmp = tmp.lastChild;
                        }
    
                        // Manually add leading whitespace removed by IE
                        if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                            nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
                        }
    
                        // Remove IE's autoinserted <tbody> from table fragments
                        if ( !jQuery.support.tbody ) {
    
                            // String was a <table>, *may* have spurious <tbody>
                            elem = tag === "table" && !rtbody.test( elem ) ?
                                tmp.firstChild :
    
                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !rtbody.test( elem ) ?
                                    tmp :
                                    0;
    
                            j = elem && elem.childNodes.length;
                            while ( j-- ) {
                                if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
                                    elem.removeChild( tbody );
                                }
                            }
                        }
    
                        jQuery.merge( nodes, tmp.childNodes );
    
                        // Fix #12392 for WebKit and IE > 9
                        tmp.textContent = "";
    
                        // Fix #12392 for oldIE
                        while ( tmp.firstChild ) {
                            tmp.removeChild( tmp.firstChild );
                        }
    
                        // Remember the top-level container for proper cleanup
                        tmp = safe.lastChild;
                    }
                }
            }
    
            // Fix #11356: Clear elements from fragment
            if ( tmp ) {
                safe.removeChild( tmp );
            }
    
            // Reset defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            if ( !jQuery.support.appendChecked ) {
                jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
            }
    
            i = 0;
            while ( (elem = nodes[ i++ ]) ) {
    
                // #4087 - If origin and destination elements are the same, and this is
                // that element, do not do anything
                if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
                    continue;
                }
    
                contains = jQuery.contains( elem.ownerDocument, elem );
    
                // Append to fragment
                tmp = getAll( safe.appendChild( elem ), "script" );
    
                // Preserve script evaluation history
                if ( contains ) {
                    setGlobalEval( tmp );
                }
    
                // Capture executables
                if ( scripts ) {
                    j = 0;
                    while ( (elem = tmp[ j++ ]) ) {
                        if ( rscriptType.test( elem.type || "" ) ) {
                            scripts.push( elem );
                        }
                    }
                }
            }
    
            tmp = null;
    
            return safe;
        },
    
        cleanData: function( elems, /* internal */ acceptData ) {
            var elem, type, id, data,
                i = 0,
                internalKey = jQuery.expando,
                cache = jQuery.cache,
                deleteExpando = jQuery.support.deleteExpando,
                special = jQuery.event.special;
    
            for ( ; (elem = elems[i]) != null; i++ ) {
    
                if ( acceptData || jQuery.acceptData( elem ) ) {
    
                    id = elem[ internalKey ];
                    data = id && cache[ id ];
    
                    if ( data ) {
                        if ( data.events ) {
                            for ( type in data.events ) {
                                if ( special[ type ] ) {
                                    jQuery.event.remove( elem, type );
    
                                // This is a shortcut to avoid jQuery.event.remove's overhead
                                } else {
                                    jQuery.removeEvent( elem, type, data.handle );
                                }
                            }
                        }
    
                        // Remove cache only if it was not already removed by jQuery.event.remove
                        if ( cache[ id ] ) {
    
                            delete cache[ id ];
    
                            // IE does not allow us to delete expando properties from nodes,
                            // nor does it have a removeAttribute function on Document nodes;
                            // we must handle all of these cases
                            if ( deleteExpando ) {
                                delete elem[ internalKey ];
    
                            } else if ( typeof elem.removeAttribute !== core_strundefined ) {
                                elem.removeAttribute( internalKey );
    
                            } else {
                                elem[ internalKey ] = null;
                            }
    
                            core_deletedIds.push( id );
                        }
                    }
                }
            }
        },
    
        _evalUrl: function( url ) {
            return jQuery.ajax({
                url: url,
                type: "GET",
                dataType: "script",
                async: false,
                global: false,
                "throws": true
            });
        }
    });
    jQuery.fn.extend({
        wrapAll: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapAll( html.call(this, i) );
                });
            }
    
            if ( this[0] ) {
                // The elements to wrap the target around
                var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);
    
                if ( this[0].parentNode ) {
                    wrap.insertBefore( this[0] );
                }
    
                wrap.map(function() {
                    var elem = this;
    
                    while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                        elem = elem.firstChild;
                    }
    
                    return elem;
                }).append( this );
            }
    
            return this;
        },
    
        wrapInner: function( html ) {
            if ( jQuery.isFunction( html ) ) {
                return this.each(function(i) {
                    jQuery(this).wrapInner( html.call(this, i) );
                });
            }
    
            return this.each(function() {
                var self = jQuery( this ),
                    contents = self.contents();
    
                if ( contents.length ) {
                    contents.wrapAll( html );
    
                } else {
                    self.append( html );
                }
            });
        },
    
        wrap: function( html ) {
            var isFunction = jQuery.isFunction( html );
    
            return this.each(function(i) {
                jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
            });
        },
    
        unwrap: function() {
            return this.parent().each(function() {
                if ( !jQuery.nodeName( this, "body" ) ) {
                    jQuery( this ).replaceWith( this.childNodes );
                }
            }).end();
        }
    });
    var iframe, getStyles, curCSS,
        ralpha = /alpha\([^)]*\)/i,
        ropacity = /opacity\s*=\s*([^)]*)/,
        rposition = /^(top|right|bottom|left)$/,
        // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
        // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
        rdisplayswap = /^(none|table(?!-c[ea]).+)/,
        rmargin = /^margin/,
        rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
        rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
        rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
        elemdisplay = { BODY: "block" },
    
        cssShow = { position: "absolute", visibility: "hidden", display: "block" },
        cssNormalTransform = {
            letterSpacing: 0,
            fontWeight: 400
        },
    
        cssExpand = [ "Top", "Right", "Bottom", "Left" ],
        cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
    
    // return a css property mapped to a potentially vendor prefixed property
    function vendorPropName( style, name ) {
    
        // shortcut for names that are not vendor prefixed
        if ( name in style ) {
            return name;
        }
    
        // check for vendor prefixed names
        var capName = name.charAt(0).toUpperCase() + name.slice(1),
            origName = name,
            i = cssPrefixes.length;
    
        while ( i-- ) {
            name = cssPrefixes[ i ] + capName;
            if ( name in style ) {
                return name;
            }
        }
    
        return origName;
    }
    
    function isHidden( elem, el ) {
        // isHidden might be called from jQuery#filter function;
        // in that case, element will be second argument
        elem = el || elem;
        return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
    }
    
    function showHide( elements, show ) {
        var display, elem, hidden,
            values = [],
            index = 0,
            length = elements.length;
    
        for ( ; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
    
            values[ index ] = jQuery._data( elem, "olddisplay" );
            display = elem.style.display;
            if ( show ) {
                // Reset the inline display of this element to learn if it is
                // being hidden by cascaded rules or not
                if ( !values[ index ] && display === "none" ) {
                    elem.style.display = "";
                }
    
                // Set elements which have been overridden with display: none
                // in a stylesheet to whatever the default browser style is
                // for such an element
                if ( elem.style.display === "" && isHidden( elem ) ) {
                    values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
                }
            } else {
    
                if ( !values[ index ] ) {
                    hidden = isHidden( elem );
    
                    if ( display && display !== "none" || !hidden ) {
                        jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
                    }
                }
            }
        }
    
        // Set the display of most of the elements in a second loop
        // to avoid the constant reflow
        for ( index = 0; index < length; index++ ) {
            elem = elements[ index ];
            if ( !elem.style ) {
                continue;
            }
            if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
                elem.style.display = show ? values[ index ] || "" : "none";
            }
        }
    
        return elements;
    }
    
    jQuery.fn.extend({
        css: function( name, value ) {
            return jQuery.access( this, function( elem, name, value ) {
                var len, styles,
                    map = {},
                    i = 0;
    
                if ( jQuery.isArray( name ) ) {
                    styles = getStyles( elem );
                    len = name.length;
    
                    for ( ; i < len; i++ ) {
                        map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
                    }
    
                    return map;
                }
    
                return value !== undefined ?
                    jQuery.style( elem, name, value ) :
                    jQuery.css( elem, name );
            }, name, value, arguments.length > 1 );
        },
        show: function() {
            return showHide( this, true );
        },
        hide: function() {
            return showHide( this );
        },
        toggle: function( state ) {
            if ( typeof state === "boolean" ) {
                return state ? this.show() : this.hide();
            }
    
            return this.each(function() {
                if ( isHidden( this ) ) {
                    jQuery( this ).show();
                } else {
                    jQuery( this ).hide();
                }
            });
        }
    });
    
    jQuery.extend({
        // Add in style property hooks for overriding the default
        // behavior of getting and setting a style property
        cssHooks: {
            opacity: {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // We should always get a number back from opacity
                        var ret = curCSS( elem, "opacity" );
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },
    
        // Don't automatically add "px" to these possibly-unitless properties
        cssNumber: {
            "columnCount": true,
            "fillOpacity": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            "orphans": true,
            "widows": true,
            "zIndex": true,
            "zoom": true
        },
    
        // Add in properties whose names you wish to fix before
        // setting or getting the value
        cssProps: {
            // normalize float css property
            "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
        },
    
        // Get and set the style property on a DOM Node
        style: function( elem, name, value, extra ) {
            // Don't set styles on text and comment nodes
            if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
                return;
            }
    
            // Make sure that we're working with the right name
            var ret, type, hooks,
                origName = jQuery.camelCase( name ),
                style = elem.style;
    
            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );
    
            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
    
            // Check if we're setting a value
            if ( value !== undefined ) {
                type = typeof value;
    
                // convert relative number strings (+= or -=) to relative numbers. #7345
                if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                    value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
                    // Fixes bug #9237
                    type = "number";
                }
    
                // Make sure that NaN and null values aren't set. See: #7116
                if ( value == null || type === "number" && isNaN( value ) ) {
                    return;
                }
    
                // If a number was passed in, add 'px' to the (except for certain CSS properties)
                if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                    value += "px";
                }
    
                // Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
                // but it would mean to define eight (for every problematic property) identical functions
                if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
                    style[ name ] = "inherit";
                }
    
                // If a hook was provided, use that value, otherwise just set the specified value
                if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
    
                    // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                    // Fixes bug #5509
                    try {
                        style[ name ] = value;
                    } catch(e) {}
                }
    
            } else {
                // If a hook was provided get the non-computed value from there
                if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                    return ret;
                }
    
                // Otherwise just get the value from the style object
                return style[ name ];
            }
        },
    
        css: function( elem, name, extra, styles ) {
            var num, val, hooks,
                origName = jQuery.camelCase( name );
    
            // Make sure that we're working with the right name
            name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );
    
            // gets hook for the prefixed version
            // followed by the unprefixed version
            hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
    
            // If a hook was provided get the computed value from there
            if ( hooks && "get" in hooks ) {
                val = hooks.get( elem, true, extra );
            }
    
            // Otherwise, if a way to get the computed value exists, use that
            if ( val === undefined ) {
                val = curCSS( elem, name, styles );
            }
    
            //convert "normal" to computed value
            if ( val === "normal" && name in cssNormalTransform ) {
                val = cssNormalTransform[ name ];
            }
    
            // Return, converting to number if forced or a qualifier was provided and val looks numeric
            if ( extra === "" || extra ) {
                num = parseFloat( val );
                return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
            }
            return val;
        }
    });
    
    // NOTE: we've included the "window" in window.getComputedStyle
    // because jsdom on node.js will break without it.
    if ( window.getComputedStyle ) {
        getStyles = function( elem ) {
            return window.getComputedStyle( elem, null );
        };
    
        curCSS = function( elem, name, _computed ) {
            var width, minWidth, maxWidth,
                computed = _computed || getStyles( elem ),
    
                // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
                style = elem.style;
    
            if ( computed ) {
    
                if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
                    ret = jQuery.style( elem, name );
                }
    
                // A tribute to the "awesome hack by Dean Edwards"
                // Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
                // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
                // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
                if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
    
                    // Remember the original values
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;
    
                    // Put in the new values to get a computed value out
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;
    
                    // Revert the changed values
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }
    
            return ret;
        };
    } else if ( document.documentElement.currentStyle ) {
        getStyles = function( elem ) {
            return elem.currentStyle;
        };
    
        curCSS = function( elem, name, _computed ) {
            var left, rs, rsLeft,
                computed = _computed || getStyles( elem ),
                ret = computed ? computed[ name ] : undefined,
                style = elem.style;
    
            // Avoid setting ret to empty string here
            // so we don't default to auto
            if ( ret == null && style && style[ name ] ) {
                ret = style[ name ];
            }
    
            // From the awesome hack by Dean Edwards
            // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291
    
            // If we're not dealing with a regular pixel number
            // but a number that has a weird ending, we need to convert it to pixels
            // but not position css attributes, as those are proportional to the parent element instead
            // and we can't measure the parent instead because it might trigger a "stacking dolls" problem
            if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {
    
                // Remember the original values
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;
    
                // Put in the new values to get a computed value out
                if ( rsLeft ) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";
    
                // Revert the changed values
                style.left = left;
                if ( rsLeft ) {
                    rs.left = rsLeft;
                }
            }
    
            return ret === "" ? "auto" : ret;
        };
    }
    
    function setPositiveNumber( elem, value, subtract ) {
        var matches = rnumsplit.exec( value );
        return matches ?
            // Guard against undefined "subtract", e.g., when used as in cssHooks
            Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
            value;
    }
    
    function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
        var i = extra === ( isBorderBox ? "border" : "content" ) ?
            // If we already have the right measurement, avoid augmentation
            4 :
            // Otherwise initialize for horizontal or vertical properties
            name === "width" ? 1 : 0,
    
            val = 0;
    
        for ( ; i < 4; i += 2 ) {
            // both box models exclude margin, so add it if we want it
            if ( extra === "margin" ) {
                val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
            }
    
            if ( isBorderBox ) {
                // border-box includes padding, so remove it if we want content
                if ( extra === "content" ) {
                    val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
                }
    
                // at this point, extra isn't border nor margin, so remove border
                if ( extra !== "margin" ) {
                    val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            } else {
                // at this point, extra isn't content, so add padding
                val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    
                // at this point, extra isn't content nor padding, so add border
                if ( extra !== "padding" ) {
                    val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
                }
            }
        }
    
        return val;
    }
    
    function getWidthOrHeight( elem, name, extra ) {
    
        // Start with offset property, which is equivalent to the border-box value
        var valueIsBorderBox = true,
            val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
            styles = getStyles( elem ),
            isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
    
        // some non-html elements return undefined for offsetWidth, so check for null/undefined
        // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
        // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
        if ( val <= 0 || val == null ) {
            // Fall back to computed then uncomputed css if necessary
            val = curCSS( elem, name, styles );
            if ( val < 0 || val == null ) {
                val = elem.style[ name ];
            }
    
            // Computed unit is not pixels. Stop here and return.
            if ( rnumnonpx.test(val) ) {
                return val;
            }
    
            // we need the check for style in case a browser which returns unreliable values
            // for getComputedStyle silently falls back to the reliable elem.style
            valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );
    
            // Normalize "", auto, and prepare for extra
            val = parseFloat( val ) || 0;
        }
    
        // use the active box-sizing model to add/subtract irrelevant styles
        return ( val +
            augmentWidthOrHeight(
                elem,
                name,
                extra || ( isBorderBox ? "border" : "content" ),
                valueIsBorderBox,
                styles
            )
        ) + "px";
    }
    
    // Try to determine the default display value of an element
    function css_defaultDisplay( nodeName ) {
        var doc = document,
            display = elemdisplay[ nodeName ];
    
        if ( !display ) {
            display = actualDisplay( nodeName, doc );
    
            // If the simple way fails, read from inside an iframe
            if ( display === "none" || !display ) {
                // Use the already-created iframe if possible
                iframe = ( iframe ||
                    jQuery("<iframe frameborder='0' width='0' height='0'/>")
                    .css( "cssText", "display:block !important" )
                ).appendTo( doc.documentElement );
    
                // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
                doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
                doc.write("<!doctype html><html><body>");
                doc.close();
    
                display = actualDisplay( nodeName, doc );
                iframe.detach();
            }
    
            // Store the correct default display
            elemdisplay[ nodeName ] = display;
        }
    
        return display;
    }
    
    // Called ONLY from within css_defaultDisplay
    function actualDisplay( name, doc ) {
        var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
            display = jQuery.css( elem[0], "display" );
        elem.remove();
        return display;
    }
    
    jQuery.each([ "height", "width" ], function( i, name ) {
        jQuery.cssHooks[ name ] = {
            get: function( elem, computed, extra ) {
                if ( computed ) {
                    // certain elements can have dimension info if we invisibly show them
                    // however, it must have a current display style that would benefit from this
                    return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
                        jQuery.swap( elem, cssShow, function() {
                            return getWidthOrHeight( elem, name, extra );
                        }) :
                        getWidthOrHeight( elem, name, extra );
                }
            },
    
            set: function( elem, value, extra ) {
                var styles = extra && getStyles( elem );
                return setPositiveNumber( elem, value, extra ?
                    augmentWidthOrHeight(
                        elem,
                        name,
                        extra,
                        jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
                        styles
                    ) : 0
                );
            }
        };
    });
    
    if ( !jQuery.support.opacity ) {
        jQuery.cssHooks.opacity = {
            get: function( elem, computed ) {
                // IE uses filters for opacity
                return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                    ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
                    computed ? "1" : "";
            },
    
            set: function( elem, value ) {
                var style = elem.style,
                    currentStyle = elem.currentStyle,
                    opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
                    filter = currentStyle && currentStyle.filter || style.filter || "";
    
                // IE has trouble with opacity if it does not have layout
                // Force it by setting the zoom level
                style.zoom = 1;
    
                // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
                // if value === "", then remove inline opacity #12685
                if ( ( value >= 1 || value === "" ) &&
                        jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
                        style.removeAttribute ) {
    
                    // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                    // if "filter:" is present at all, clearType is disabled, we want to avoid this
                    // style.removeAttribute is IE Only, but so apparently is this code path...
                    style.removeAttribute( "filter" );
    
                    // if there is no filter style applied in a css rule or unset inline opacity, we are done
                    if ( value === "" || currentStyle && !currentStyle.filter ) {
                        return;
                    }
                }
    
                // otherwise, set new filter values
                style.filter = ralpha.test( filter ) ?
                    filter.replace( ralpha, opacity ) :
                    filter + " " + opacity;
            }
        };
    }
    
    // These hooks cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    jQuery(function() {
        if ( !jQuery.support.reliableMarginRight ) {
            jQuery.cssHooks.marginRight = {
                get: function( elem, computed ) {
                    if ( computed ) {
                        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                        // Work around by temporarily setting element display to inline-block
                        return jQuery.swap( elem, { "display": "inline-block" },
                            curCSS, [ elem, "marginRight" ] );
                    }
                }
            };
        }
    
        // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
        // getComputedStyle returns percent when specified for top/left/bottom/right
        // rather than make the css module depend on the offset module, we just check for it here
        if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
            jQuery.each( [ "top", "left" ], function( i, prop ) {
                jQuery.cssHooks[ prop ] = {
                    get: function( elem, computed ) {
                        if ( computed ) {
                            computed = curCSS( elem, prop );
                            // if curCSS returns percentage, fallback to offset
                            return rnumnonpx.test( computed ) ?
                                jQuery( elem ).position()[ prop ] + "px" :
                                computed;
                        }
                    }
                };
            });
        }
    
    });
    
    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.hidden = function( elem ) {
            // Support: Opera <= 12.12
            // Opera reports offsetWidths and offsetHeights less than zero on some elements
            return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
                (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
        };
    
        jQuery.expr.filters.visible = function( elem ) {
            return !jQuery.expr.filters.hidden( elem );
        };
    }
    
    // These hooks are used by animate to expand properties
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function( prefix, suffix ) {
        jQuery.cssHooks[ prefix + suffix ] = {
            expand: function( value ) {
                var i = 0,
                    expanded = {},
    
                    // assumes a single number if not a string
                    parts = typeof value === "string" ? value.split(" ") : [ value ];
    
                for ( ; i < 4; i++ ) {
                    expanded[ prefix + cssExpand[ i ] + suffix ] =
                        parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
                }
    
                return expanded;
            }
        };
    
        if ( !rmargin.test( prefix ) ) {
            jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
        }
    });
    var r20 = /%20/g,
        rbracket = /\[\]$/,
        rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i;
    
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param( this.serializeArray() );
        },
        serializeArray: function() {
            return this.map(function(){
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop( this, "elements" );
                return elements ? jQuery.makeArray( elements ) : this;
            })
            .filter(function(){
                var type = this.type;
                // Use .is(":disabled") so that fieldset[disabled] works
                return this.name && !jQuery( this ).is( ":disabled" ) &&
                    rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
                    ( this.checked || !manipulation_rcheckableType.test( type ) );
            })
            .map(function( i, elem ){
                var val = jQuery( this ).val();
    
                return val == null ?
                    null :
                    jQuery.isArray( val ) ?
                        jQuery.map( val, function( val ){
                            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                        }) :
                        { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
            }).get();
        }
    });
    
    //Serialize an array of form elements or a set of
    //key/values into a query string
    jQuery.param = function( a, traditional ) {
        var prefix,
            s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };
    
        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }
    
        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });
    
        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }
    
        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    };
    
    function buildParams( prefix, obj, traditional, add ) {
        var name;
    
        if ( jQuery.isArray( obj ) ) {
            // Serialize array item.
            jQuery.each( obj, function( i, v ) {
                if ( traditional || rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );
    
                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
                }
            });
    
        } else if ( !traditional && jQuery.type( obj ) === "object" ) {
            // Serialize object item.
            for ( name in obj ) {
                buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
            }
    
        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    }
    jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
        "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
        "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {
    
        // Handle event binding
        jQuery.fn[ name ] = function( data, fn ) {
            return arguments.length > 0 ?
                this.on( name, null, data, fn ) :
                this.trigger( name );
        };
    });
    
    jQuery.fn.extend({
        hover: function( fnOver, fnOut ) {
            return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
        },
    
        bind: function( types, data, fn ) {
            return this.on( types, null, data, fn );
        },
        unbind: function( types, fn ) {
            return this.off( types, null, fn );
        },
    
        delegate: function( selector, types, data, fn ) {
            return this.on( types, selector, data, fn );
        },
        undelegate: function( selector, types, fn ) {
            // ( namespace ) or ( selector, types [, fn] )
            return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
        }
    });
    var
        // Document location
        ajaxLocParts,
        ajaxLocation,
        ajax_nonce = jQuery.now(),
    
        ajax_rquery = /\?/,
        rhash = /#.*$/,
        rts = /([?&])_=[^&]*/,
        rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
        // #7653, #8125, #8152: local protocol detection
        rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        rnoContent = /^(?:GET|HEAD)$/,
        rprotocol = /^\/\//,
        rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,
    
        // Keep a copy of the old load method
        _load = jQuery.fn.load,
    
        /* Prefilters
         * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
         * 2) These are called:
         *    - BEFORE asking for a transport
         *    - AFTER param serialization (s.data is a string if s.processData is true)
         * 3) key is the dataType
         * 4) the catchall symbol "*" can be used
         * 5) execution will start with transport dataType and THEN continue down to "*" if needed
         */
        prefilters = {},
    
        /* Transports bindings
         * 1) key is the dataType
         * 2) the catchall symbol "*" can be used
         * 3) selection will start with transport dataType and THEN go to "*" if needed
         */
        transports = {},
    
        // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
        allTypes = "*/".concat("*");
    
    // #8138, IE may throw an exception when accessing
    // a field from window.location if document.domain has been set
    try {
        ajaxLocation = location.href;
    } catch( e ) {
        // Use the href attribute of an A element
        // since IE will modify it given document.location
        ajaxLocation = document.createElement( "a" );
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }
    
    // Segment location into parts
    ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
    
    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {
    
        // dataTypeExpression is optional and defaults to "*"
        return function( dataTypeExpression, func ) {
    
            if ( typeof dataTypeExpression !== "string" ) {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }
    
            var dataType,
                i = 0,
                dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];
    
            if ( jQuery.isFunction( func ) ) {
                // For each dataType in the dataTypeExpression
                while ( (dataType = dataTypes[i++]) ) {
                    // Prepend if requested
                    if ( dataType[0] === "+" ) {
                        dataType = dataType.slice( 1 ) || "*";
                        (structure[ dataType ] = structure[ dataType ] || []).unshift( func );
    
                    // Otherwise append
                    } else {
                        (structure[ dataType ] = structure[ dataType ] || []).push( func );
                    }
                }
            }
        };
    }
    
    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
    
        var inspected = {},
            seekingTransport = ( structure === transports );
    
        function inspect( dataType ) {
            var selected;
            inspected[ dataType ] = true;
            jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
                var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
                if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
                    options.dataTypes.unshift( dataTypeOrTransport );
                    inspect( dataTypeOrTransport );
                    return false;
                } else if ( seekingTransport ) {
                    return !( selected = dataTypeOrTransport );
                }
            });
            return selected;
        }
    
        return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }
    
    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend( target, src ) {
        var deep, key,
            flatOptions = jQuery.ajaxSettings.flatOptions || {};
    
        for ( key in src ) {
            if ( src[ key ] !== undefined ) {
                ( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
            }
        }
        if ( deep ) {
            jQuery.extend( true, target, deep );
        }
    
        return target;
    }
    
    jQuery.fn.load = function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );
        }
    
        var selector, response, type,
            self = this,
            off = url.indexOf(" ");
    
        if ( off >= 0 ) {
            selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }
    
        // If it's a function
        if ( jQuery.isFunction( params ) ) {
    
            // We assume that it's the callback
            callback = params;
            params = undefined;
    
        // Otherwise, build a param string
        } else if ( params && typeof params === "object" ) {
            type = "POST";
        }
    
        // If we have elements to modify, make the request
        if ( self.length > 0 ) {
            jQuery.ajax({
                url: url,
    
                // if "type" variable is undefined, then "GET" method will be used
                type: type,
                dataType: "html",
                data: params
            }).done(function( responseText ) {
    
                // Save response for use in complete callback
                response = arguments;
    
                self.html( selector ?
    
                    // If a selector was specified, locate the right elements in a dummy div
                    // Exclude scripts to avoid IE 'Permission Denied' errors
                    jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :
    
                    // Otherwise use the full result
                    responseText );
    
            }).complete( callback && function( jqXHR, status ) {
                self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
            });
        }
    
        return this;
    };
    
    // Attach a bunch of functions for handling common AJAX events
    jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
        jQuery.fn[ type ] = function( fn ){
            return this.on( type, fn );
        };
    });
    
    jQuery.extend({
    
        // Counter for holding the number of active queries
        active: 0,
    
        // Last-Modified header cache for next request
        lastModified: {},
        etag: {},
    
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            /*
            timeout: 0,
            data: null,
            dataType: null,
            username: null,
            password: null,
            cache: null,
            throws: false,
            traditional: false,
            headers: {},
            */
    
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
    
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
    
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
    
            // Data converters
            // Keys separate source (or catchall "*") and destination types with a single space
            converters: {
    
                // Convert anything to text
                "* text": String,
    
                // Text to html (true = no transformation)
                "text html": true,
    
                // Evaluate text as a json expression
                "text json": jQuery.parseJSON,
    
                // Parse text as xml
                "text xml": jQuery.parseXML
            },
    
            // For options that shouldn't be deep extended:
            // you can add your own custom options here if
            // and when you create one that shouldn't be
            // deep extended (see ajaxExtend)
            flatOptions: {
                url: true,
                context: true
            }
        },
    
        // Creates a full fledged settings object into target
        // with both ajaxSettings and settings fields.
        // If target is omitted, writes into ajaxSettings.
        ajaxSetup: function( target, settings ) {
            return settings ?
    
                // Building a settings object
                ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
    
                // Extending ajaxSettings
                ajaxExtend( jQuery.ajaxSettings, target );
        },
    
        ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
        ajaxTransport: addToPrefiltersOrTransports( transports ),
    
        // Main method
        ajax: function( url, options ) {
    
            // If url is an object, simulate pre-1.5 signature
            if ( typeof url === "object" ) {
                options = url;
                url = undefined;
            }
    
            // Force options to be an object
            options = options || {};
    
            var // Cross-domain detection vars
                parts,
                // Loop variable
                i,
                // URL without anti-cache param
                cacheURL,
                // Response headers as string
                responseHeadersString,
                // timeout handle
                timeoutTimer,
    
                // To know if global events are to be dispatched
                fireGlobals,
    
                transport,
                // Response headers
                responseHeaders,
                // Create the final options object
                s = jQuery.ajaxSetup( {}, options ),
                // Callbacks context
                callbackContext = s.context || s,
                // Context for global events is callbackContext if it is a DOM node or jQuery collection
                globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
                    jQuery( callbackContext ) :
                    jQuery.event,
                // Deferreds
                deferred = jQuery.Deferred(),
                completeDeferred = jQuery.Callbacks("once memory"),
                // Status-dependent callbacks
                statusCode = s.statusCode || {},
                // Headers (they are sent all at once)
                requestHeaders = {},
                requestHeadersNames = {},
                // The jqXHR state
                state = 0,
                // Default abort message
                strAbort = "canceled",
                // Fake xhr
                jqXHR = {
                    readyState: 0,
    
                    // Builds headers hashtable if needed
                    getResponseHeader: function( key ) {
                        var match;
                        if ( state === 2 ) {
                            if ( !responseHeaders ) {
                                responseHeaders = {};
                                while ( (match = rheaders.exec( responseHeadersString )) ) {
                                    responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                                }
                            }
                            match = responseHeaders[ key.toLowerCase() ];
                        }
                        return match == null ? null : match;
                    },
    
                    // Raw string
                    getAllResponseHeaders: function() {
                        return state === 2 ? responseHeadersString : null;
                    },
    
                    // Caches the header
                    setRequestHeader: function( name, value ) {
                        var lname = name.toLowerCase();
                        if ( !state ) {
                            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                            requestHeaders[ name ] = value;
                        }
                        return this;
                    },
    
                    // Overrides response content-type header
                    overrideMimeType: function( type ) {
                        if ( !state ) {
                            s.mimeType = type;
                        }
                        return this;
                    },
    
                    // Status-dependent callbacks
                    statusCode: function( map ) {
                        var code;
                        if ( map ) {
                            if ( state < 2 ) {
                                for ( code in map ) {
                                    // Lazy-add the new callback in a way that preserves old ones
                                    statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
                                }
                            } else {
                                // Execute the appropriate callbacks
                                jqXHR.always( map[ jqXHR.status ] );
                            }
                        }
                        return this;
                    },
    
                    // Cancel the request
                    abort: function( statusText ) {
                        var finalText = statusText || strAbort;
                        if ( transport ) {
                            transport.abort( finalText );
                        }
                        done( 0, finalText );
                        return this;
                    }
                };
    
            // Attach deferreds
            deferred.promise( jqXHR ).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
    
            // Remove hash character (#7531: and string promotion)
            // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
            // Handle falsy url in the settings object (#10093: consistency with old signature)
            // We also use the url parameter if available
            s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
    
            // Alias method option to type as per ticket #12004
            s.type = options.method || options.type || s.method || s.type;
    
            // Extract dataTypes list
            s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];
    
            // A cross-domain request is in order when we have a protocol:host:port mismatch
            if ( s.crossDomain == null ) {
                parts = rurl.exec( s.url.toLowerCase() );
                s.crossDomain = !!( parts &&
                    ( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
                        ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
                            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
                );
            }
    
            // Convert data if not already a string
            if ( s.data && s.processData && typeof s.data !== "string" ) {
                s.data = jQuery.param( s.data, s.traditional );
            }
    
            // Apply prefilters
            inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
    
            // If request was aborted inside a prefilter, stop there
            if ( state === 2 ) {
                return jqXHR;
            }
    
            // We can fire global events as of now if asked to
            fireGlobals = s.global;
    
            // Watch for a new set of requests
            if ( fireGlobals && jQuery.active++ === 0 ) {
                jQuery.event.trigger("ajaxStart");
            }
    
            // Uppercase the type
            s.type = s.type.toUpperCase();
    
            // Determine if request has content
            s.hasContent = !rnoContent.test( s.type );
    
            // Save the URL in case we're toying with the If-Modified-Since
            // and/or If-None-Match header later on
            cacheURL = s.url;
    
            // More options handling for requests with no content
            if ( !s.hasContent ) {
    
                // If data is available, append data to url
                if ( s.data ) {
                    cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
                    // #9682: remove data so that it's not used in an eventual retry
                    delete s.data;
                }
    
                // Add anti-cache in url if needed
                if ( s.cache === false ) {
                    s.url = rts.test( cacheURL ) ?
    
                        // If there is already a '_' parameter, set its value
                        cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :
    
                        // Otherwise add one to the end
                        cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
                }
            }
    
            // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
            if ( s.ifModified ) {
                if ( jQuery.lastModified[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
                }
                if ( jQuery.etag[ cacheURL ] ) {
                    jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
                }
            }
    
            // Set the correct header, if data is being sent
            if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
                jqXHR.setRequestHeader( "Content-Type", s.contentType );
            }
    
            // Set the Accepts header for the server, depending on the dataType
            jqXHR.setRequestHeader(
                "Accept",
                s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                    s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                    s.accepts[ "*" ]
            );
    
            // Check for headers option
            for ( i in s.headers ) {
                jqXHR.setRequestHeader( i, s.headers[ i ] );
            }
    
            // Allow custom headers/mimetypes and early abort
            if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already and return
                return jqXHR.abort();
            }
    
            // aborting is no longer a cancellation
            strAbort = "abort";
    
            // Install callbacks on deferreds
            for ( i in { success: 1, error: 1, complete: 1 } ) {
                jqXHR[ i ]( s[ i ] );
            }
    
            // Get transport
            transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
    
            // If no transport, we auto-abort
            if ( !transport ) {
                done( -1, "No Transport" );
            } else {
                jqXHR.readyState = 1;
    
                // Send global event
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
                }
                // Timeout
                if ( s.async && s.timeout > 0 ) {
                    timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout");
                    }, s.timeout );
                }
    
                try {
                    state = 1;
                    transport.send( requestHeaders, done );
                } catch ( e ) {
                    // Propagate exception as error if not done
                    if ( state < 2 ) {
                        done( -1, e );
                    // Simply rethrow otherwise
                    } else {
                        throw e;
                    }
                }
            }
    
            // Callback for when everything is done
            function done( status, nativeStatusText, responses, headers ) {
                var isSuccess, success, error, response, modified,
                    statusText = nativeStatusText;
    
                // Called once
                if ( state === 2 ) {
                    return;
                }
    
                // State is "done" now
                state = 2;
    
                // Clear timeout if it exists
                if ( timeoutTimer ) {
                    clearTimeout( timeoutTimer );
                }
    
                // Dereference transport for early garbage collection
                // (no matter how long the jqXHR object will be used)
                transport = undefined;
    
                // Cache response headers
                responseHeadersString = headers || "";
    
                // Set readyState
                jqXHR.readyState = status > 0 ? 4 : 0;
    
                // Determine if successful
                isSuccess = status >= 200 && status < 300 || status === 304;
    
                // Get response data
                if ( responses ) {
                    response = ajaxHandleResponses( s, jqXHR, responses );
                }
    
                // Convert no matter what (that way responseXXX fields are always set)
                response = ajaxConvert( s, response, jqXHR, isSuccess );
    
                // If successful, handle type chaining
                if ( isSuccess ) {
    
                    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                    if ( s.ifModified ) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if ( modified ) {
                            jQuery.lastModified[ cacheURL ] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if ( modified ) {
                            jQuery.etag[ cacheURL ] = modified;
                        }
                    }
    
    
                    // if no content
                    if ( status === 204 || s.type === "HEAD" ) {
                        statusText = "nocontent";
    
                    // if not modified
                    } else if ( status === 304 ) {
                        statusText = "notmodified";
    
                    // If we have data, let's convert it
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {
                    // We extract error from statusText
                    // then normalize statusText and status for non-aborts
                    error = statusText;
                    if ( status || !statusText ) {
                        statusText = "error";
                        if ( status < 0 ) {
                            status = 0;
                        }
                    }
                }
    
                // Set data for the fake xhr object
                jqXHR.status = status;
                jqXHR.statusText = ( nativeStatusText || statusText ) + "";
    
                // Success/Error
                if ( isSuccess ) {
                    deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
                } else {
                    deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
                }
    
                // Status-dependent callbacks
                jqXHR.statusCode( statusCode );
                statusCode = undefined;
    
                if ( fireGlobals ) {
                    globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
                        [ jqXHR, s, isSuccess ? success : error ] );
                }
    
                // Complete
                completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
    
                if ( fireGlobals ) {
                    globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                    // Handle the global AJAX counter
                    if ( !( --jQuery.active ) ) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }
    
            return jqXHR;
        },
    
        getJSON: function( url, data, callback ) {
            return jQuery.get( url, data, callback, "json" );
        },
    
        getScript: function( url, callback ) {
            return jQuery.get( url, undefined, callback, "script" );
        }
    });
    
    jQuery.each( [ "get", "post" ], function( i, method ) {
        jQuery[ method ] = function( url, data, callback, type ) {
            // shift arguments if data argument was omitted
            if ( jQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
    
            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });
    
    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {
        var firstDataType, ct, finalDataType, type,
            contents = s.contents,
            dataTypes = s.dataTypes;
    
        // Remove auto dataType and get content-type in the process
        while( dataTypes[ 0 ] === "*" ) {
            dataTypes.shift();
            if ( ct === undefined ) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }
    
        // Check if we're dealing with a known content-type
        if ( ct ) {
            for ( type in contents ) {
                if ( contents[ type ] && contents[ type ].test( ct ) ) {
                    dataTypes.unshift( type );
                    break;
                }
            }
        }
    
        // Check to see if we have a response for the expected dataType
        if ( dataTypes[ 0 ] in responses ) {
            finalDataType = dataTypes[ 0 ];
        } else {
            // Try convertible dataTypes
            for ( type in responses ) {
                if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                    finalDataType = type;
                    break;
                }
                if ( !firstDataType ) {
                    firstDataType = type;
                }
            }
            // Or just use first one
            finalDataType = finalDataType || firstDataType;
        }
    
        // If we found a dataType
        // We add the dataType to the list if needed
        // and return the corresponding response
        if ( finalDataType ) {
            if ( finalDataType !== dataTypes[ 0 ] ) {
                dataTypes.unshift( finalDataType );
            }
            return responses[ finalDataType ];
        }
    }
    
    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert( s, response, jqXHR, isSuccess ) {
        var conv2, current, conv, tmp, prev,
            converters = {},
            // Work with a copy of dataTypes in case we need to modify it for conversion
            dataTypes = s.dataTypes.slice();
    
        // Create converters map with lowercased keys
        if ( dataTypes[ 1 ] ) {
            for ( conv in s.converters ) {
                converters[ conv.toLowerCase() ] = s.converters[ conv ];
            }
        }
    
        current = dataTypes.shift();
    
        // Convert to each sequential dataType
        while ( current ) {
    
            if ( s.responseFields[ current ] ) {
                jqXHR[ s.responseFields[ current ] ] = response;
            }
    
            // Apply the dataFilter if provided
            if ( !prev && isSuccess && s.dataFilter ) {
                response = s.dataFilter( response, s.dataType );
            }
    
            prev = current;
            current = dataTypes.shift();
    
            if ( current ) {
    
                // There's only work to do if current dataType is non-auto
                if ( current === "*" ) {
    
                    current = prev;
    
                // Convert response if prev dataType is non-auto and differs from current
                } else if ( prev !== "*" && prev !== current ) {
    
                    // Seek a direct converter
                    conv = converters[ prev + " " + current ] || converters[ "* " + current ];
    
                    // If none found, seek a pair
                    if ( !conv ) {
                        for ( conv2 in converters ) {
    
                            // If conv2 outputs current
                            tmp = conv2.split( " " );
                            if ( tmp[ 1 ] === current ) {
    
                                // If prev can be converted to accepted input
                                conv = converters[ prev + " " + tmp[ 0 ] ] ||
                                    converters[ "* " + tmp[ 0 ] ];
                                if ( conv ) {
                                    // Condense equivalence converters
                                    if ( conv === true ) {
                                        conv = converters[ conv2 ];
    
                                    // Otherwise, insert the intermediate dataType
                                    } else if ( converters[ conv2 ] !== true ) {
                                        current = tmp[ 0 ];
                                        dataTypes.unshift( tmp[ 1 ] );
                                    }
                                    break;
                                }
                            }
                        }
                    }
    
                    // Apply converter (if not an equivalence)
                    if ( conv !== true ) {
    
                        // Unless errors are allowed to bubble, catch and return them
                        if ( conv && s[ "throws" ] ) {
                            response = conv( response );
                        } else {
                            try {
                                response = conv( response );
                            } catch ( e ) {
                                return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
                            }
                        }
                    }
                }
            }
        }
    
        return { state: "success", data: response };
    }
    // Install script dataType
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function( text ) {
                jQuery.globalEval( text );
                return text;
            }
        }
    });
    
    // Handle cache's special case and global
    jQuery.ajaxPrefilter( "script", function( s ) {
        if ( s.cache === undefined ) {
            s.cache = false;
        }
        if ( s.crossDomain ) {
            s.type = "GET";
            s.global = false;
        }
    });
    
    // Bind script tag hack transport
    jQuery.ajaxTransport( "script", function(s) {
    
        // This transport only deals with cross domain requests
        if ( s.crossDomain ) {
    
            var script,
                head = document.head || jQuery("head")[0] || document.documentElement;
    
            return {
    
                send: function( _, callback ) {
    
                    script = document.createElement("script");
    
                    script.async = true;
    
                    if ( s.scriptCharset ) {
                        script.charset = s.scriptCharset;
                    }
    
                    script.src = s.url;
    
                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function( _, isAbort ) {
    
                        if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {
    
                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;
    
                            // Remove the script
                            if ( script.parentNode ) {
                                script.parentNode.removeChild( script );
                            }
    
                            // Dereference the script
                            script = null;
    
                            // Callback if not abort
                            if ( !isAbort ) {
                                callback( 200, "success" );
                            }
                        }
                    };
    
                    // Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
                    // Use native DOM manipulation to avoid our domManip AJAX trickery
                    head.insertBefore( script, head.firstChild );
                },
    
                abort: function() {
                    if ( script ) {
                        script.onload( undefined, true );
                    }
                }
            };
        }
    });
    var oldCallbacks = [],
        rjsonp = /(=)\?(?=&|$)|\?\?/;
    
    // Default jsonp settings
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
            this[ callback ] = true;
            return callback;
        }
    });
    
    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
    
        var callbackName, overwritten, responseContainer,
            jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
                "url" :
                typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
            );
    
        // Handle iff the expected data type is "jsonp" or we have a parameter to set
        if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
    
            // Get callback name, remembering preexisting value associated with it
            callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
                s.jsonpCallback() :
                s.jsonpCallback;
    
            // Insert callback into url or form data
            if ( jsonProp ) {
                s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
            } else if ( s.jsonp !== false ) {
                s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
            }
    
            // Use data converter to retrieve json after script execution
            s.converters["script json"] = function() {
                if ( !responseContainer ) {
                    jQuery.error( callbackName + " was not called" );
                }
                return responseContainer[ 0 ];
            };
    
            // force json dataType
            s.dataTypes[ 0 ] = "json";
    
            // Install callback
            overwritten = window[ callbackName ];
            window[ callbackName ] = function() {
                responseContainer = arguments;
            };
    
            // Clean-up function (fires after converters)
            jqXHR.always(function() {
                // Restore preexisting value
                window[ callbackName ] = overwritten;
    
                // Save back as free
                if ( s[ callbackName ] ) {
                    // make sure that re-using the options doesn't screw things around
                    s.jsonpCallback = originalSettings.jsonpCallback;
    
                    // save the callback name for future use
                    oldCallbacks.push( callbackName );
                }
    
                // Call if it was a function and we have a response
                if ( responseContainer && jQuery.isFunction( overwritten ) ) {
                    overwritten( responseContainer[ 0 ] );
                }
    
                responseContainer = overwritten = undefined;
            });
    
            // Delegate to script
            return "script";
        }
    });
    var xhrCallbacks, xhrSupported,
        xhrId = 0,
        // #5280: Internet Explorer will keep connections alive if we don't abort on unload
        xhrOnUnloadAbort = window.ActiveXObject && function() {
            // Abort all pending requests
            var key;
            for ( key in xhrCallbacks ) {
                xhrCallbacks[ key ]( undefined, true );
            }
        };
    
    // Functions to create xhrs
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch( e ) {}
    }
    
    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch( e ) {}
    }
    
    // Create the request object
    // (This is still attached to ajaxSettings for backward compatibility)
    jQuery.ajaxSettings.xhr = window.ActiveXObject ?
        /* Microsoft failed to properly
         * implement the XMLHttpRequest in IE7 (can't request local files),
         * so we use the ActiveXObject when it is available
         * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
         * we need a fallback.
         */
        function() {
            return !this.isLocal && createStandardXHR() || createActiveXHR();
        } :
        // For all other browsers, use the standard XMLHttpRequest object
        createStandardXHR;
    
    // Determine support properties
    xhrSupported = jQuery.ajaxSettings.xhr();
    jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    xhrSupported = jQuery.support.ajax = !!xhrSupported;
    
    // Create transport if the browser can provide an xhr
    if ( xhrSupported ) {
    
        jQuery.ajaxTransport(function( s ) {
            // Cross domain only allowed if supported through XMLHttpRequest
            if ( !s.crossDomain || jQuery.support.cors ) {
    
                var callback;
    
                return {
                    send: function( headers, complete ) {
    
                        // Get a new xhr
                        var handle, i,
                            xhr = s.xhr();
    
                        // Open the socket
                        // Passing null username, generates a login popup on Opera (#2865)
                        if ( s.username ) {
                            xhr.open( s.type, s.url, s.async, s.username, s.password );
                        } else {
                            xhr.open( s.type, s.url, s.async );
                        }
    
                        // Apply custom fields if provided
                        if ( s.xhrFields ) {
                            for ( i in s.xhrFields ) {
                                xhr[ i ] = s.xhrFields[ i ];
                            }
                        }
    
                        // Override mime type if needed
                        if ( s.mimeType && xhr.overrideMimeType ) {
                            xhr.overrideMimeType( s.mimeType );
                        }
    
                        // X-Requested-With header
                        // For cross-domain requests, seeing as conditions for a preflight are
                        // akin to a jigsaw puzzle, we simply never set it to be sure.
                        // (it can always be set on a per-request basis or even using ajaxSetup)
                        // For same-domain requests, won't change header if already provided.
                        if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }
    
                        // Need an extra try/catch for cross domain requests in Firefox 3
                        try {
                            for ( i in headers ) {
                                xhr.setRequestHeader( i, headers[ i ] );
                            }
                        } catch( err ) {}
    
                        // Do send the request
                        // This may raise an exception which is actually
                        // handled in jQuery.ajax (so no try/catch here)
                        xhr.send( ( s.hasContent && s.data ) || null );
    
                        // Listener
                        callback = function( _, isAbort ) {
                            var status, responseHeaders, statusText, responses;
    
                            // Firefox throws exceptions when accessing properties
                            // of an xhr when a network error occurred
                            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                            try {
    
                                // Was never called and is aborted or complete
                                if ( callback && ( isAbort || xhr.readyState === 4 ) ) {
    
                                    // Only called once
                                    callback = undefined;
    
                                    // Do not keep as active anymore
                                    if ( handle ) {
                                        xhr.onreadystatechange = jQuery.noop;
                                        if ( xhrOnUnloadAbort ) {
                                            delete xhrCallbacks[ handle ];
                                        }
                                    }
    
                                    // If it's an abort
                                    if ( isAbort ) {
                                        // Abort it manually if needed
                                        if ( xhr.readyState !== 4 ) {
                                            xhr.abort();
                                        }
                                    } else {
                                        responses = {};
                                        status = xhr.status;
                                        responseHeaders = xhr.getAllResponseHeaders();
    
                                        // When requesting binary data, IE6-9 will throw an exception
                                        // on any attempt to access responseText (#11426)
                                        if ( typeof xhr.responseText === "string" ) {
                                            responses.text = xhr.responseText;
                                        }
    
                                        // Firefox throws an exception when accessing
                                        // statusText for faulty cross-domain requests
                                        try {
                                            statusText = xhr.statusText;
                                        } catch( e ) {
                                            // We normalize with Webkit giving an empty statusText
                                            statusText = "";
                                        }
    
                                        // Filter status for non standard behaviors
    
                                        // If the request is local and we have data: assume a success
                                        // (success with no data won't get notified, that's the best we
                                        // can do given current implementations)
                                        if ( !status && s.isLocal && !s.crossDomain ) {
                                            status = responses.text ? 200 : 404;
                                        // IE - #1450: sometimes returns 1223 when it should be 204
                                        } else if ( status === 1223 ) {
                                            status = 204;
                                        }
                                    }
                                }
                            } catch( firefoxAccessException ) {
                                if ( !isAbort ) {
                                    complete( -1, firefoxAccessException );
                                }
                            }
    
                            // Call complete if needed
                            if ( responses ) {
                                complete( status, statusText, responses, responseHeaders );
                            }
                        };
    
                        if ( !s.async ) {
                            // if we're in sync mode we fire the callback
                            callback();
                        } else if ( xhr.readyState === 4 ) {
                            // (IE6 & IE7) if it's in cache and has been
                            // retrieved directly we need to fire the callback
                            setTimeout( callback );
                        } else {
                            handle = ++xhrId;
                            if ( xhrOnUnloadAbort ) {
                                // Create the active xhrs callbacks list if needed
                                // and attach the unload handler
                                if ( !xhrCallbacks ) {
                                    xhrCallbacks = {};
                                    jQuery( window ).unload( xhrOnUnloadAbort );
                                }
                                // Add to list of active xhrs callbacks
                                xhrCallbacks[ handle ] = callback;
                            }
                            xhr.onreadystatechange = callback;
                        }
                    },
    
                    abort: function() {
                        if ( callback ) {
                            callback( undefined, true );
                        }
                    }
                };
            }
        });
    }
    var fxNow, timerId,
        rfxtypes = /^(?:toggle|show|hide)$/,
        rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
        rrun = /queueHooks$/,
        animationPrefilters = [ defaultPrefilter ],
        tweeners = {
            "*": [function( prop, value ) {
                var tween = this.createTween( prop, value ),
                    target = tween.cur(),
                    parts = rfxnum.exec( value ),
                    unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
    
                    // Starting value computation is required for potential unit mismatches
                    start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
                        rfxnum.exec( jQuery.css( tween.elem, prop ) ),
                    scale = 1,
                    maxIterations = 20;
    
                if ( start && start[ 3 ] !== unit ) {
                    // Trust units reported by jQuery.css
                    unit = unit || start[ 3 ];
    
                    // Make sure we update the tween properties later on
                    parts = parts || [];
    
                    // Iteratively approximate from a nonzero starting point
                    start = +target || 1;
    
                    do {
                        // If previous iteration zeroed out, double until we get *something*
                        // Use a string for doubling factor so we don't accidentally see scale as unchanged below
                        scale = scale || ".5";
    
                        // Adjust and apply
                        start = start / scale;
                        jQuery.style( tween.elem, prop, start + unit );
    
                    // Update scale, tolerating zero or NaN from tween.cur()
                    // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
                    } while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
                }
    
                // Update tween properties
                if ( parts ) {
                    start = tween.start = +start || +target || 0;
                    tween.unit = unit;
                    // If a +=/-= token was provided, we're doing a relative animation
                    tween.end = parts[ 1 ] ?
                        start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
                        +parts[ 2 ];
                }
    
                return tween;
            }]
        };
    
    // Animations created synchronously will run synchronously
    function createFxNow() {
        setTimeout(function() {
            fxNow = undefined;
        });
        return ( fxNow = jQuery.now() );
    }
    
    function createTween( value, prop, animation ) {
        var tween,
            collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
            index = 0,
            length = collection.length;
        for ( ; index < length; index++ ) {
            if ( (tween = collection[ index ].call( animation, prop, value )) ) {
    
                // we're done with this property
                return tween;
            }
        }
    }
    
    function Animation( elem, properties, options ) {
        var result,
            stopped,
            index = 0,
            length = animationPrefilters.length,
            deferred = jQuery.Deferred().always( function() {
                // don't match elem in the :animated selector
                delete tick.elem;
            }),
            tick = function() {
                if ( stopped ) {
                    return false;
                }
                var currentTime = fxNow || createFxNow(),
                    remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
                    // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
                    temp = remaining / animation.duration || 0,
                    percent = 1 - temp,
                    index = 0,
                    length = animation.tweens.length;
    
                for ( ; index < length ; index++ ) {
                    animation.tweens[ index ].run( percent );
                }
    
                deferred.notifyWith( elem, [ animation, percent, remaining ]);
    
                if ( percent < 1 && length ) {
                    return remaining;
                } else {
                    deferred.resolveWith( elem, [ animation ] );
                    return false;
                }
            },
            animation = deferred.promise({
                elem: elem,
                props: jQuery.extend( {}, properties ),
                opts: jQuery.extend( true, { specialEasing: {} }, options ),
                originalProperties: properties,
                originalOptions: options,
                startTime: fxNow || createFxNow(),
                duration: options.duration,
                tweens: [],
                createTween: function( prop, end ) {
                    var tween = jQuery.Tween( elem, animation.opts, prop, end,
                            animation.opts.specialEasing[ prop ] || animation.opts.easing );
                    animation.tweens.push( tween );
                    return tween;
                },
                stop: function( gotoEnd ) {
                    var index = 0,
                        // if we are going to the end, we want to run all the tweens
                        // otherwise we skip this part
                        length = gotoEnd ? animation.tweens.length : 0;
                    if ( stopped ) {
                        return this;
                    }
                    stopped = true;
                    for ( ; index < length ; index++ ) {
                        animation.tweens[ index ].run( 1 );
                    }
    
                    // resolve when we played the last frame
                    // otherwise, reject
                    if ( gotoEnd ) {
                        deferred.resolveWith( elem, [ animation, gotoEnd ] );
                    } else {
                        deferred.rejectWith( elem, [ animation, gotoEnd ] );
                    }
                    return this;
                }
            }),
            props = animation.props;
    
        propFilter( props, animation.opts.specialEasing );
    
        for ( ; index < length ; index++ ) {
            result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
            if ( result ) {
                return result;
            }
        }
    
        jQuery.map( props, createTween, animation );
    
        if ( jQuery.isFunction( animation.opts.start ) ) {
            animation.opts.start.call( elem, animation );
        }
    
        jQuery.fx.timer(
            jQuery.extend( tick, {
                elem: elem,
                anim: animation,
                queue: animation.opts.queue
            })
        );
    
        // attach callbacks from options
        return animation.progress( animation.opts.progress )
            .done( animation.opts.done, animation.opts.complete )
            .fail( animation.opts.fail )
            .always( animation.opts.always );
    }
    
    function propFilter( props, specialEasing ) {
        var index, name, easing, value, hooks;
    
        // camelCase, specialEasing and expand cssHook pass
        for ( index in props ) {
            name = jQuery.camelCase( index );
            easing = specialEasing[ name ];
            value = props[ index ];
            if ( jQuery.isArray( value ) ) {
                easing = value[ 1 ];
                value = props[ index ] = value[ 0 ];
            }
    
            if ( index !== name ) {
                props[ name ] = value;
                delete props[ index ];
            }
    
            hooks = jQuery.cssHooks[ name ];
            if ( hooks && "expand" in hooks ) {
                value = hooks.expand( value );
                delete props[ name ];
    
                // not quite $.extend, this wont overwrite keys already present.
                // also - reusing 'index' from above because we have the correct "name"
                for ( index in value ) {
                    if ( !( index in props ) ) {
                        props[ index ] = value[ index ];
                        specialEasing[ index ] = easing;
                    }
                }
            } else {
                specialEasing[ name ] = easing;
            }
        }
    }
    
    jQuery.Animation = jQuery.extend( Animation, {
    
        tweener: function( props, callback ) {
            if ( jQuery.isFunction( props ) ) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.split(" ");
            }
    
            var prop,
                index = 0,
                length = props.length;
    
            for ( ; index < length ; index++ ) {
                prop = props[ index ];
                tweeners[ prop ] = tweeners[ prop ] || [];
                tweeners[ prop ].unshift( callback );
            }
        },
    
        prefilter: function( callback, prepend ) {
            if ( prepend ) {
                animationPrefilters.unshift( callback );
            } else {
                animationPrefilters.push( callback );
            }
        }
    });
    
    function defaultPrefilter( elem, props, opts ) {
        /* jshint validthis: true */
        var prop, value, toggle, tween, hooks, oldfire,
            anim = this,
            orig = {},
            style = elem.style,
            hidden = elem.nodeType && isHidden( elem ),
            dataShow = jQuery._data( elem, "fxshow" );
    
        // handle queue: false promises
        if ( !opts.queue ) {
            hooks = jQuery._queueHooks( elem, "fx" );
            if ( hooks.unqueued == null ) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if ( !hooks.unqueued ) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;
    
            anim.always(function() {
                // doing this makes sure that the complete handler will be called
                // before this completes
                anim.always(function() {
                    hooks.unqueued--;
                    if ( !jQuery.queue( elem, "fx" ).length ) {
                        hooks.empty.fire();
                    }
                });
            });
        }
    
        // height/width overflow pass
        if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
            // Make sure that nothing sneaks out
            // Record all 3 overflow attributes because IE does not
            // change the overflow attribute when overflowX and
            // overflowY are set to the same value
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
    
            // Set display property to inline-block for height/width
            // animations on inline elements that are having width/height animated
            if ( jQuery.css( elem, "display" ) === "inline" &&
                    jQuery.css( elem, "float" ) === "none" ) {
    
                // inline-level elements accept inline-block;
                // block-level elements need to be inline with layout
                if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
                    style.display = "inline-block";
    
                } else {
                    style.zoom = 1;
                }
            }
        }
    
        if ( opts.overflow ) {
            style.overflow = "hidden";
            if ( !jQuery.support.shrinkWrapBlocks ) {
                anim.always(function() {
                    style.overflow = opts.overflow[ 0 ];
                    style.overflowX = opts.overflow[ 1 ];
                    style.overflowY = opts.overflow[ 2 ];
                });
            }
        }
    
    
        // show/hide pass
        for ( prop in props ) {
            value = props[ prop ];
            if ( rfxtypes.exec( value ) ) {
                delete props[ prop ];
                toggle = toggle || value === "toggle";
                if ( value === ( hidden ? "hide" : "show" ) ) {
                    continue;
                }
                orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
            }
        }
    
        if ( !jQuery.isEmptyObject( orig ) ) {
            if ( dataShow ) {
                if ( "hidden" in dataShow ) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = jQuery._data( elem, "fxshow", {} );
            }
    
            // store state if its toggle - enables .stop().toggle() to "reverse"
            if ( toggle ) {
                dataShow.hidden = !hidden;
            }
            if ( hidden ) {
                jQuery( elem ).show();
            } else {
                anim.done(function() {
                    jQuery( elem ).hide();
                });
            }
            anim.done(function() {
                var prop;
                jQuery._removeData( elem, "fxshow" );
                for ( prop in orig ) {
                    jQuery.style( elem, prop, orig[ prop ] );
                }
            });
            for ( prop in orig ) {
                tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
    
                if ( !( prop in dataShow ) ) {
                    dataShow[ prop ] = tween.start;
                    if ( hidden ) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        }
    }
    
    function Tween( elem, options, prop, end, easing ) {
        return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;
    
    Tween.prototype = {
        constructor: Tween,
        init: function( elem, options, prop, end, easing, unit ) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
        },
        cur: function() {
            var hooks = Tween.propHooks[ this.prop ];
    
            return hooks && hooks.get ?
                hooks.get( this ) :
                Tween.propHooks._default.get( this );
        },
        run: function( percent ) {
            var eased,
                hooks = Tween.propHooks[ this.prop ];
    
            if ( this.options.duration ) {
                this.pos = eased = jQuery.easing[ this.easing ](
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                );
            } else {
                this.pos = eased = percent;
            }
            this.now = ( this.end - this.start ) * eased + this.start;
    
            if ( this.options.step ) {
                this.options.step.call( this.elem, this.now, this );
            }
    
            if ( hooks && hooks.set ) {
                hooks.set( this );
            } else {
                Tween.propHooks._default.set( this );
            }
            return this;
        }
    };
    
    Tween.prototype.init.prototype = Tween.prototype;
    
    Tween.propHooks = {
        _default: {
            get: function( tween ) {
                var result;
    
                if ( tween.elem[ tween.prop ] != null &&
                    (!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
                    return tween.elem[ tween.prop ];
                }
    
                // passing an empty string as a 3rd parameter to .css will automatically
                // attempt a parseFloat and fallback to a string if the parse fails
                // so, simple values such as "10px" are parsed to Float.
                // complex values such as "rotate(1rad)" are returned as is.
                result = jQuery.css( tween.elem, tween.prop, "" );
                // Empty strings, null, undefined and "auto" are converted to 0.
                return !result || result === "auto" ? 0 : result;
            },
            set: function( tween ) {
                // use step hook for back compat - use cssHook if its there - use .style if its
                // available and use plain properties where available
                if ( jQuery.fx.step[ tween.prop ] ) {
                    jQuery.fx.step[ tween.prop ]( tween );
                } else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
                    jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
                } else {
                    tween.elem[ tween.prop ] = tween.now;
                }
            }
        }
    };
    
    // Support: IE <=9
    // Panic based approach to setting things on disconnected nodes
    
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function( tween ) {
            if ( tween.elem.nodeType && tween.elem.parentNode ) {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    };
    
    jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
        var cssFn = jQuery.fn[ name ];
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return speed == null || typeof speed === "boolean" ?
                cssFn.apply( this, arguments ) :
                this.animate( genFx( name, true ), speed, easing, callback );
        };
    });
    
    jQuery.fn.extend({
        fadeTo: function( speed, to, easing, callback ) {
    
            // show any hidden elements after setting opacity to 0
            return this.filter( isHidden ).css( "opacity", 0 ).show()
    
                // animate to the value specified
                .end().animate({ opacity: to }, speed, easing, callback );
        },
        animate: function( prop, speed, easing, callback ) {
            var empty = jQuery.isEmptyObject( prop ),
                optall = jQuery.speed( speed, easing, callback ),
                doAnimation = function() {
                    // Operate on a copy of prop so per-property easing won't be lost
                    var anim = Animation( this, jQuery.extend( {}, prop ), optall );
    
                    // Empty animations, or finishing resolves immediately
                    if ( empty || jQuery._data( this, "finish" ) ) {
                        anim.stop( true );
                    }
                };
                doAnimation.finish = doAnimation;
    
            return empty || optall.queue === false ?
                this.each( doAnimation ) :
                this.queue( optall.queue, doAnimation );
        },
        stop: function( type, clearQueue, gotoEnd ) {
            var stopQueue = function( hooks ) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop( gotoEnd );
            };
    
            if ( typeof type !== "string" ) {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if ( clearQueue && type !== false ) {
                this.queue( type || "fx", [] );
            }
    
            return this.each(function() {
                var dequeue = true,
                    index = type != null && type + "queueHooks",
                    timers = jQuery.timers,
                    data = jQuery._data( this );
    
                if ( index ) {
                    if ( data[ index ] && data[ index ].stop ) {
                        stopQueue( data[ index ] );
                    }
                } else {
                    for ( index in data ) {
                        if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
                            stopQueue( data[ index ] );
                        }
                    }
                }
    
                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
                        timers[ index ].anim.stop( gotoEnd );
                        dequeue = false;
                        timers.splice( index, 1 );
                    }
                }
    
                // start the next in the queue if the last step wasn't forced
                // timers currently will call their complete callbacks, which will dequeue
                // but only if they were gotoEnd
                if ( dequeue || !gotoEnd ) {
                    jQuery.dequeue( this, type );
                }
            });
        },
        finish: function( type ) {
            if ( type !== false ) {
                type = type || "fx";
            }
            return this.each(function() {
                var index,
                    data = jQuery._data( this ),
                    queue = data[ type + "queue" ],
                    hooks = data[ type + "queueHooks" ],
                    timers = jQuery.timers,
                    length = queue ? queue.length : 0;
    
                // enable finishing flag on private data
                data.finish = true;
    
                // empty the queue first
                jQuery.queue( this, type, [] );
    
                if ( hooks && hooks.stop ) {
                    hooks.stop.call( this, true );
                }
    
                // look for any active animations, and finish them
                for ( index = timers.length; index--; ) {
                    if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
                        timers[ index ].anim.stop( true );
                        timers.splice( index, 1 );
                    }
                }
    
                // look for any animations in the old queue and finish them
                for ( index = 0; index < length; index++ ) {
                    if ( queue[ index ] && queue[ index ].finish ) {
                        queue[ index ].finish.call( this );
                    }
                }
    
                // turn off finishing flag
                delete data.finish;
            });
        }
    });
    
    // Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
        var which,
            attrs = { height: type },
            i = 0;
    
        // if we include width, step value is 1 to do all cssExpand values,
        // if we don't include width, step value is 2 to skip over Left and Right
        includeWidth = includeWidth? 1 : 0;
        for( ; i < 4 ; i += 2 - includeWidth ) {
            which = cssExpand[ i ];
            attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
        }
    
        if ( includeWidth ) {
            attrs.opacity = attrs.width = type;
        }
    
        return attrs;
    }
    
    // Generate shortcuts for custom animations
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
        jQuery.fn[ name ] = function( speed, easing, callback ) {
            return this.animate( props, speed, easing, callback );
        };
    });
    
    jQuery.speed = function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
        };
    
        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
    
        // normalize opt.queue - true/undefined/null -> "fx"
        if ( opt.queue == null || opt.queue === true ) {
            opt.queue = "fx";
        }
    
        // Queueing
        opt.old = opt.complete;
    
        opt.complete = function() {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }
    
            if ( opt.queue ) {
                jQuery.dequeue( this, opt.queue );
            }
        };
    
        return opt;
    };
    
    jQuery.easing = {
        linear: function( p ) {
            return p;
        },
        swing: function( p ) {
            return 0.5 - Math.cos( p*Math.PI ) / 2;
        }
    };
    
    jQuery.timers = [];
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.tick = function() {
        var timer,
            timers = jQuery.timers,
            i = 0;
    
        fxNow = jQuery.now();
    
        for ( ; i < timers.length; i++ ) {
            timer = timers[ i ];
            // Checks the timer has not already been removed
            if ( !timer() && timers[ i ] === timer ) {
                timers.splice( i--, 1 );
            }
        }
    
        if ( !timers.length ) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };
    
    jQuery.fx.timer = function( timer ) {
        if ( timer() && jQuery.timers.push( timer ) ) {
            jQuery.fx.start();
        }
    };
    
    jQuery.fx.interval = 13;
    
    jQuery.fx.start = function() {
        if ( !timerId ) {
            timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
        }
    };
    
    jQuery.fx.stop = function() {
        clearInterval( timerId );
        timerId = null;
    };
    
    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    };
    
    // Back Compat <1.8 extension point
    jQuery.fx.step = {};
    
    if ( jQuery.expr && jQuery.expr.filters ) {
        jQuery.expr.filters.animated = function( elem ) {
            return jQuery.grep(jQuery.timers, function( fn ) {
                return elem === fn.elem;
            }).length;
        };
    }
    jQuery.fn.offset = function( options ) {
        if ( arguments.length ) {
            return options === undefined ?
                this :
                this.each(function( i ) {
                    jQuery.offset.setOffset( this, options, i );
                });
        }
    
        var docElem, win,
            box = { top: 0, left: 0 },
            elem = this[ 0 ],
            doc = elem && elem.ownerDocument;
    
        if ( !doc ) {
            return;
        }
    
        docElem = doc.documentElement;
    
        // Make sure it's not a disconnected DOM node
        if ( !jQuery.contains( docElem, elem ) ) {
            return box;
        }
    
        // If we don't have gBCR, just use 0,0 rather than error
        // BlackBerry 5, iOS 3 (original iPhone)
        if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow( doc );
        return {
            top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
            left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
        };
    };
    
    jQuery.offset = {
    
        setOffset: function( elem, options, i ) {
            var position = jQuery.css( elem, "position" );
    
            // set position first, in-case top/left are set even on static elem
            if ( position === "static" ) {
                elem.style.position = "relative";
            }
    
            var curElem = jQuery( elem ),
                curOffset = curElem.offset(),
                curCSSTop = jQuery.css( elem, "top" ),
                curCSSLeft = jQuery.css( elem, "left" ),
                calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
                props = {}, curPosition = {}, curTop, curLeft;
    
            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if ( calculatePosition ) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat( curCSSTop ) || 0;
                curLeft = parseFloat( curCSSLeft ) || 0;
            }
    
            if ( jQuery.isFunction( options ) ) {
                options = options.call( elem, i, curOffset );
            }
    
            if ( options.top != null ) {
                props.top = ( options.top - curOffset.top ) + curTop;
            }
            if ( options.left != null ) {
                props.left = ( options.left - curOffset.left ) + curLeft;
            }
    
            if ( "using" in options ) {
                options.using.call( elem, props );
            } else {
                curElem.css( props );
            }
        }
    };
    
    
    jQuery.fn.extend({
    
        position: function() {
            if ( !this[ 0 ] ) {
                return;
            }
    
            var offsetParent, offset,
                parentOffset = { top: 0, left: 0 },
                elem = this[ 0 ];
    
            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if ( jQuery.css( elem, "position" ) === "fixed" ) {
                // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {
                // Get *real* offsetParent
                offsetParent = this.offsetParent();
    
                // Get correct offsets
                offset = this.offset();
                if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
                    parentOffset = offsetParent.offset();
                }
    
                // Add offsetParent borders
                parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
                parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
            }
    
            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return {
                top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
                left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
            };
        },
    
        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || docElem;
                while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || docElem;
            });
        }
    });
    
    
    // Create scrollLeft and scrollTop methods
    jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
        var top = /Y/.test( prop );
    
        jQuery.fn[ method ] = function( val ) {
            return jQuery.access( this, function( elem, method, val ) {
                var win = getWindow( elem );
    
                if ( val === undefined ) {
                    return win ? (prop in win) ? win[ prop ] :
                        win.document.documentElement[ method ] :
                        elem[ method ];
                }
    
                if ( win ) {
                    win.scrollTo(
                        !top ? val : jQuery( win ).scrollLeft(),
                        top ? val : jQuery( win ).scrollTop()
                    );
    
                } else {
                    elem[ method ] = val;
                }
            }, method, val, arguments.length, null );
        };
    });
    
    function getWindow( elem ) {
        return jQuery.isWindow( elem ) ?
            elem :
            elem.nodeType === 9 ?
                elem.defaultView || elem.parentWindow :
                false;
    }
    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
        jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
            // margin is only for outerHeight, outerWidth
            jQuery.fn[ funcName ] = function( margin, value ) {
                var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
                    extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
    
                return jQuery.access( this, function( elem, type, value ) {
                    var doc;
    
                    if ( jQuery.isWindow( elem ) ) {
                        // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
                        // isn't a whole lot we can do. See pull request at this URL for discussion:
                        // https://github.com/jquery/jquery/pull/764
                        return elem.document.documentElement[ "client" + name ];
                    }
    
                    // Get document width or height
                    if ( elem.nodeType === 9 ) {
                        doc = elem.documentElement;
    
                        // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
                        // unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
                        return Math.max(
                            elem.body[ "scroll" + name ], doc[ "scroll" + name ],
                            elem.body[ "offset" + name ], doc[ "offset" + name ],
                            doc[ "client" + name ]
                        );
                    }
    
                    return value === undefined ?
                        // Get width or height on the element, requesting but not forcing parseFloat
                        jQuery.css( elem, type, extra ) :
    
                        // Set width or height on the element
                        jQuery.style( elem, type, value, extra );
                }, type, chainable ? margin : undefined, chainable, null );
            };
        });
    });
    // Limit scope pollution from any deprecated API
    // (function() {
    
    // The number of elements contained in the matched element set
    jQuery.fn.size = function() {
        return this.length;
    };
    
    jQuery.fn.andSelf = jQuery.fn.addBack;
    
    // })();
    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        // Expose jQuery as module.exports in loaders that implement the Node
        // module pattern (including browserify). Do not create the global, since
        // the user will be storing it themselves locally, and globals are frowned
        // upon in the Node module world.
        module.exports = jQuery;
    } else {
        // Otherwise expose jQuery to the global object as usual
        window.jQuery = window.$ = jQuery;
    
        // Register as a named AMD module, since jQuery can be concatenated with other
        // files that may use define, but not via a proper concatenation script that
        // understands anonymous AMD modules. A named AMD is safest and most robust
        // way to register. Lowercase jquery is used because AMD module names are
        // derived from file names, and jQuery is normally delivered in a lowercase
        // file name. Do this after creating the global so that if an AMD module wants
        // to call noConflict to hide this version of jQuery, it will work.
        if ( typeof define === "function" && define.amd ) {
            define( "jquery", [], function () { return jQuery; } );
        }
    }
    
    })( window );
























/*! jQuery v3.4.0 | (c) JS Foundation and other contributors | jquery.org/license */ ! function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(C, e) {
    "use strict";
    var t = [],
        E = C.document,
        r = Object.getPrototypeOf,
        s = t.slice,
        g = t.concat,
        u = t.push,
        i = t.indexOf,
        n = {},
        o = n.toString,
        v = n.hasOwnProperty,
        a = v.toString,
        l = a.call(Object),
        y = {},
        m = function(e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        x = function(e) {
            return null != e && e === e.window
        },
        c = {
            type: !0,
            src: !0,
            nonce: !0,
            noModule: !0
        };

    function b(e, t, n) {
        var r, i, o = (n = n || E).createElement("script");
        if (o.text = e, t)
            for (r in c)(i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }

    function w(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? n[o.call(e)] || "object" : typeof e
    }
    var f = "3.4.0",
        k = function(e, t) {
            return new k.fn.init(e, t)
        },
        p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    function d(e) {
        var t = !!e && "length" in e && e.length,
            n = w(e);
        return !m(e) && !x(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    k.fn = k.prototype = {
        jquery: f,
        constructor: k,
        length: 0,
        toArray: function() {
            return s.call(this)
        },
        get: function(e) {
            return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = k.merge(this.constructor(), e);
            return t.prevObject = this, t
        },
        each: function(e) {
            return k.each(this, e)
        },
        map: function(n) {
            return this.pushStack(k.map(this, function(e, t) {
                return n.call(e, t, e)
            }))
        },
        slice: function() {
            return this.pushStack(s.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: u,
        sort: t.sort,
        splice: t.splice
    }, k.extend = k.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {},
            s = 1,
            u = arguments.length,
            l = !1;
        for ("boolean" == typeof a && (l = a, a = arguments[s] || {}, s++), "object" == typeof a || m(a) || (a = {}), s === u && (a = this, s--); s < u; s++)
            if (null != (e = arguments[s]))
                for (t in e) r = e[t], "__proto__" !== t && a !== r && (l && r && (k.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || k.isPlainObject(n) ? n : {}, i = !1, a[t] = k.extend(l, o, r)) : void 0 !== r && (a[t] = r));
        return a
    }, k.extend({
        expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== o.call(e)) && (!(t = r(e)) || "function" == typeof(n = v.call(t, "constructor") && t.constructor) && a.call(n) === l)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        globalEval: function(e, t) {
            b(e, {
                nonce: t && t.nonce
            })
        },
        each: function(e, t) {
            var n, r = 0;
            if (d(e)) {
                for (n = e.length; r < n; r++)
                    if (!1 === t.call(e[r], r, e[r])) break
            } else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r])) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(p, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (d(Object(e)) ? k.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)), n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : i.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
            return e.length = i, e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++) !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, i, o = 0,
                a = [];
            if (d(e))
                for (r = e.length; o < r; o++) null != (i = t(e[o], o, n)) && a.push(i);
            else
                for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
            return g.apply([], a)
        },
        guid: 1,
        support: y
    }), "function" == typeof Symbol && (k.fn[Symbol.iterator] = t[Symbol.iterator]), k.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        n["[object " + t + "]"] = t.toLowerCase()
    });
    var h = function(n) {
        var e, d, b, o, i, h, f, g, w, u, l, T, C, a, E, v, s, c, y, k = "sizzle" + 1 * new Date,
            m = n.document,
            S = 0,
            r = 0,
            p = ue(),
            x = ue(),
            A = ue(),
            N = ue(),
            D = function(e, t) {
                return e === t && (l = !0), 0
            },
            j = {}.hasOwnProperty,
            t = [],
            q = t.pop,
            L = t.push,
            H = t.push,
            O = t.slice,
            P = function(e, t) {
                for (var n = 0, r = e.length; n < r; n++)
                    if (e[n] === t) return n;
                return -1
            },
            R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            M = "[\\x20\\t\\r\\n\\f]",
            I = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            W = "\\[" + M + "*(" + I + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + I + "))|)" + M + "*\\]",
            $ = ":(" + I + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + W + ")*)|.*)\\)|)",
            F = new RegExp(M + "+", "g"),
            B = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
            _ = new RegExp("^" + M + "*," + M + "*"),
            z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
            U = new RegExp(M + "|>"),
            X = new RegExp($),
            V = new RegExp("^" + I + "$"),
            G = {
                ID: new RegExp("^#(" + I + ")"),
                CLASS: new RegExp("^\\.(" + I + ")"),
                TAG: new RegExp("^(" + I + "|[*])"),
                ATTR: new RegExp("^" + W),
                PSEUDO: new RegExp("^" + $),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + R + ")$", "i"),
                needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
            },
            Y = /HTML$/i,
            Q = /^(?:input|select|textarea|button)$/i,
            J = /^h\d$/i,
            K = /^[^{]+\{\s*\[native \w/,
            Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ee = /[+~]/,
            te = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
            ne = function(e, t, n) {
                var r = "0x" + t - 65536;
                return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            },
            re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            ie = function(e, t) {
                return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            oe = function() {
                T()
            },
            ae = be(function(e) {
                return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            H.apply(t = O.call(m.childNodes), m.childNodes), t[m.childNodes.length].nodeType
        } catch (e) {
            H = {
                apply: t.length ? function(e, t) {
                    L.apply(e, O.call(t))
                } : function(e, t) {
                    var n = e.length,
                        r = 0;
                    while (e[n++] = t[r++]);
                    e.length = n - 1
                }
            }
        }

        function se(t, e, n, r) {
            var i, o, a, s, u, l, c, f = e && e.ownerDocument,
                p = e ? e.nodeType : 9;
            if (n = n || [], "string" != typeof t || !t || 1 !== p && 9 !== p && 11 !== p) return n;
            if (!r && ((e ? e.ownerDocument || e : m) !== C && T(e), e = e || C, E)) {
                if (11 !== p && (u = Z.exec(t)))
                    if (i = u[1]) {
                        if (9 === p) {
                            if (!(a = e.getElementById(i))) return n;
                            if (a.id === i) return n.push(a), n
                        } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i) return n.push(a), n
                    } else {
                        if (u[2]) return H.apply(n, e.getElementsByTagName(t)), n;
                        if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName) return H.apply(n, e.getElementsByClassName(i)), n
                    } if (d.qsa && !N[t + " "] && (!v || !v.test(t)) && (1 !== p || "object" !== e.nodeName.toLowerCase())) {
                    if (c = t, f = e, 1 === p && U.test(t)) {
                        (s = e.getAttribute("id")) ? s = s.replace(re, ie): e.setAttribute("id", s = k), o = (l = h(t)).length;
                        while (o--) l[o] = "#" + s + " " + xe(l[o]);
                        c = l.join(","), f = ee.test(t) && ye(e.parentNode) || e
                    }
                    try {
                        return H.apply(n, f.querySelectorAll(c)), n
                    } catch (e) {
                        N(t, !0)
                    } finally {
                        s === k && e.removeAttribute("id")
                    }
                }
            }
            return g(t.replace(B, "$1"), e, n, r)
        }

        function ue() {
            var r = [];
            return function e(t, n) {
                return r.push(t + " ") > b.cacheLength && delete e[r.shift()], e[t + " "] = n
            }
        }

        function le(e) {
            return e[k] = !0, e
        }

        function ce(e) {
            var t = C.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function fe(e, t) {
            var n = e.split("|"),
                r = n.length;
            while (r--) b.attrHandle[n[r]] = t
        }

        function pe(e, t) {
            var n = t && e,
                r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r) return r;
            if (n)
                while (n = n.nextSibling)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function de(t) {
            return function(e) {
                return "input" === e.nodeName.toLowerCase() && e.type === t
            }
        }

        function he(n) {
            return function(e) {
                var t = e.nodeName.toLowerCase();
                return ("input" === t || "button" === t) && e.type === n
            }
        }

        function ge(t) {
            return function(e) {
                return "form" in e ? e.parentNode && !1 === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ae(e) === t : e.disabled === t : "label" in e && e.disabled === t
            }
        }

        function ve(a) {
            return le(function(o) {
                return o = +o, le(function(e, t) {
                    var n, r = a([], e.length, o),
                        i = r.length;
                    while (i--) e[n = r[i]] && (e[n] = !(t[n] = e[n]))
                })
            })
        }

        function ye(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }
        for (e in d = se.support = {}, i = se.isXML = function(e) {
                var t = e.namespaceURI,
                    n = (e.ownerDocument || e).documentElement;
                return !Y.test(t || n && n.nodeName || "HTML")
            }, T = se.setDocument = function(e) {
                var t, n, r = e ? e.ownerDocument || e : m;
                return r !== C && 9 === r.nodeType && r.documentElement && (a = (C = r).documentElement, E = !i(C), m !== C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", oe, !1) : n.attachEvent && n.attachEvent("onunload", oe)), d.attributes = ce(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), d.getElementsByTagName = ce(function(e) {
                    return e.appendChild(C.createComment("")), !e.getElementsByTagName("*").length
                }), d.getElementsByClassName = K.test(C.getElementsByClassName), d.getById = ce(function(e) {
                    return a.appendChild(e).id = k, !C.getElementsByName || !C.getElementsByName(k).length
                }), d.getById ? (b.filter.ID = function(e) {
                    var t = e.replace(te, ne);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }, b.find.ID = function(e, t) {
                    if ("undefined" != typeof t.getElementById && E) {
                        var n = t.getElementById(e);
                        return n ? [n] : []
                    }
                }) : (b.filter.ID = function(e) {
                    var n = e.replace(te, ne);
                    return function(e) {
                        var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                        return t && t.value === n
                    }
                }, b.find.ID = function(e, t) {
                    if ("undefined" != typeof t.getElementById && E) {
                        var n, r, i, o = t.getElementById(e);
                        if (o) {
                            if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
                            i = t.getElementsByName(e), r = 0;
                            while (o = i[r++])
                                if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
                        }
                        return []
                    }
                }), b.find.TAG = d.getElementsByTagName ? function(e, t) {
                    return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0
                } : function(e, t) {
                    var n, r = [],
                        i = 0,
                        o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        while (n = o[i++]) 1 === n.nodeType && r.push(n);
                        return r
                    }
                    return o
                }, b.find.CLASS = d.getElementsByClassName && function(e, t) {
                    if ("undefined" != typeof t.getElementsByClassName && E) return t.getElementsByClassName(e)
                }, s = [], v = [], (d.qsa = K.test(C.querySelectorAll)) && (ce(function(e) {
                    a.appendChild(e).innerHTML = "<a id='" + k + "'></a><select id='" + k + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + M + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || v.push("\\[" + M + "*(?:value|" + R + ")"), e.querySelectorAll("[id~=" + k + "-]").length || v.push("~="), e.querySelectorAll(":checked").length || v.push(":checked"), e.querySelectorAll("a#" + k + "+*").length || v.push(".#.+[+~]")
                }), ce(function(e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = C.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && v.push("name" + M + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"), a.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:")
                })), (d.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ce(function(e) {
                    d.disconnectedMatch = c.call(e, "*"), c.call(e, "[s!='']:x"), s.push("!=", $)
                }), v = v.length && new RegExp(v.join("|")), s = s.length && new RegExp(s.join("|")), t = K.test(a.compareDocumentPosition), y = t || K.test(a.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        r = t && t.parentNode;
                    return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                } : function(e, t) {
                    if (t)
                        while (t = t.parentNode)
                            if (t === e) return !0;
                    return !1
                }, D = t ? function(e, t) {
                    if (e === t) return l = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === m && y(m, e) ? -1 : t === C || t.ownerDocument === m && y(m, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return l = !0, 0;
                    var n, r = 0,
                        i = e.parentNode,
                        o = t.parentNode,
                        a = [e],
                        s = [t];
                    if (!i || !o) return e === C ? -1 : t === C ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
                    if (i === o) return pe(e, t);
                    n = e;
                    while (n = n.parentNode) a.unshift(n);
                    n = t;
                    while (n = n.parentNode) s.unshift(n);
                    while (a[r] === s[r]) r++;
                    return r ? pe(a[r], s[r]) : a[r] === m ? -1 : s[r] === m ? 1 : 0
                }), C
            }, se.matches = function(e, t) {
                return se(e, null, null, t)
            }, se.matchesSelector = function(e, t) {
                if ((e.ownerDocument || e) !== C && T(e), d.matchesSelector && E && !N[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t))) try {
                    var n = c.call(e, t);
                    if (n || d.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n
                } catch (e) {
                    N(t, !0)
                }
                return 0 < se(t, C, null, [e]).length
            }, se.contains = function(e, t) {
                return (e.ownerDocument || e) !== C && T(e), y(e, t)
            }, se.attr = function(e, t) {
                (e.ownerDocument || e) !== C && T(e);
                var n = b.attrHandle[t.toLowerCase()],
                    r = n && j.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
                return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
            }, se.escape = function(e) {
                return (e + "").replace(re, ie)
            }, se.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, se.uniqueSort = function(e) {
                var t, n = [],
                    r = 0,
                    i = 0;
                if (l = !d.detectDuplicates, u = !d.sortStable && e.slice(0), e.sort(D), l) {
                    while (t = e[i++]) t === e[i] && (r = n.push(i));
                    while (r--) e.splice(n[r], 1)
                }
                return u = null, e
            }, o = se.getText = function(e) {
                var t, n = "",
                    r = 0,
                    i = e.nodeType;
                if (i) {
                    if (1 === i || 9 === i || 11 === i) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += o(e)
                    } else if (3 === i || 4 === i) return e.nodeValue
                } else
                    while (t = e[r++]) n += o(t);
                return n
            }, (b = se.selectors = {
                cacheLength: 50,
                createPseudo: le,
                match: G,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(te, ne), e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && X.test(n) && (t = h(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(te, ne).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = p[e + " "];
                        return t || (t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) && p(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(n, r, i) {
                        return function(e) {
                            var t = se.attr(e, n);
                            return null == t ? "!=" === r : !r || (t += "", "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(F, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(h, e, t, g, v) {
                        var y = "nth" !== h.slice(0, 3),
                            m = "last" !== h.slice(-4),
                            x = "of-type" === e;
                        return 1 === g && 0 === v ? function(e) {
                            return !!e.parentNode
                        } : function(e, t, n) {
                            var r, i, o, a, s, u, l = y !== m ? "nextSibling" : "previousSibling",
                                c = e.parentNode,
                                f = x && e.nodeName.toLowerCase(),
                                p = !n && !x,
                                d = !1;
                            if (c) {
                                if (y) {
                                    while (l) {
                                        a = e;
                                        while (a = a[l])
                                            if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) return !1;
                                        u = l = "only" === h && !u && "nextSibling"
                                    }
                                    return !0
                                }
                                if (u = [m ? c.firstChild : c.lastChild], m && p) {
                                    d = (s = (r = (i = (o = (a = c)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]) && r[2], a = s && c.childNodes[s];
                                    while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                        if (1 === a.nodeType && ++d && a === e) {
                                            i[h] = [S, s, d];
                                            break
                                        }
                                } else if (p && (d = s = (r = (i = (o = (a = e)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]), !1 === d)
                                    while (a = ++s && a && a[l] || (d = s = 0) || u.pop())
                                        if ((x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) && ++d && (p && ((i = (o = a[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [S, d]), a === e)) break;
                                return (d -= v) === g || d % g == 0 && 0 <= d / g
                            }
                        }
                    },
                    PSEUDO: function(e, o) {
                        var t, a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                        return a[k] ? a(o) : 1 < a.length ? (t = [e, e, "", o], b.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function(e, t) {
                            var n, r = a(e, o),
                                i = r.length;
                            while (i--) e[n = P(e, r[i])] = !(t[n] = r[i])
                        }) : function(e) {
                            return a(e, 0, t)
                        }) : a
                    }
                },
                pseudos: {
                    not: le(function(e) {
                        var r = [],
                            i = [],
                            s = f(e.replace(B, "$1"));
                        return s[k] ? le(function(e, t, n, r) {
                            var i, o = s(e, null, r, []),
                                a = e.length;
                            while (a--)(i = o[a]) && (e[a] = !(t[a] = i))
                        }) : function(e, t, n) {
                            return r[0] = e, s(r, null, n, i), r[0] = null, !i.pop()
                        }
                    }),
                    has: le(function(t) {
                        return function(e) {
                            return 0 < se(t, e).length
                        }
                    }),
                    contains: le(function(t) {
                        return t = t.replace(te, ne),
                            function(e) {
                                return -1 < (e.textContent || o(e)).indexOf(t)
                            }
                    }),
                    lang: le(function(n) {
                        return V.test(n || "") || se.error("unsupported lang: " + n), n = n.replace(te, ne).toLowerCase(),
                            function(e) {
                                var t;
                                do {
                                    if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                                } while ((e = e.parentNode) && 1 === e.nodeType);
                                return !1
                            }
                    }),
                    target: function(e) {
                        var t = n.location && n.location.hash;
                        return t && t.slice(1) === e.id
                    },
                    root: function(e) {
                        return e === a
                    },
                    focus: function(e) {
                        return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: ge(!1),
                    disabled: ge(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !b.pseudos.empty(e)
                    },
                    header: function(e) {
                        return J.test(e.nodeName)
                    },
                    input: function(e) {
                        return Q.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: ve(function() {
                        return [0]
                    }),
                    last: ve(function(e, t) {
                        return [t - 1]
                    }),
                    eq: ve(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: ve(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: ve(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: ve(function(e, t, n) {
                        for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r;) e.push(r);
                        return e
                    }),
                    gt: ve(function(e, t, n) {
                        for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
                        return e
                    })
                }
            }).pseudos.nth = b.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) b.pseudos[e] = de(e);
        for (e in {
                submit: !0,
                reset: !0
            }) b.pseudos[e] = he(e);

        function me() {}

        function xe(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
            return r
        }

        function be(s, e, t) {
            var u = e.dir,
                l = e.next,
                c = l || u,
                f = t && "parentNode" === c,
                p = r++;
            return e.first ? function(e, t, n) {
                while (e = e[u])
                    if (1 === e.nodeType || f) return s(e, t, n);
                return !1
            } : function(e, t, n) {
                var r, i, o, a = [S, p];
                if (n) {
                    while (e = e[u])
                        if ((1 === e.nodeType || f) && s(e, t, n)) return !0
                } else
                    while (e = e[u])
                        if (1 === e.nodeType || f)
                            if (i = (o = e[k] || (e[k] = {}))[e.uniqueID] || (o[e.uniqueID] = {}), l && l === e.nodeName.toLowerCase()) e = e[u] || e;
                            else {
                                if ((r = i[c]) && r[0] === S && r[1] === p) return a[2] = r[2];
                                if ((i[c] = a)[2] = s(e, t, n)) return !0
                            } return !1
            }
        }

        function we(i) {
            return 1 < i.length ? function(e, t, n) {
                var r = i.length;
                while (r--)
                    if (!i[r](e, t, n)) return !1;
                return !0
            } : i[0]
        }

        function Te(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)(o = e[s]) && (n && !n(o, r, i) || (a.push(o), l && t.push(s)));
            return a
        }

        function Ce(d, h, g, v, y, e) {
            return v && !v[k] && (v = Ce(v)), y && !y[k] && (y = Ce(y, e)), le(function(e, t, n, r) {
                var i, o, a, s = [],
                    u = [],
                    l = t.length,
                    c = e || function(e, t, n) {
                        for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
                        return n
                    }(h || "*", n.nodeType ? [n] : n, []),
                    f = !d || !e && h ? c : Te(c, s, d, n, r),
                    p = g ? y || (e ? d : l || v) ? [] : t : f;
                if (g && g(f, p, n, r), v) {
                    i = Te(p, u), v(i, [], n, r), o = i.length;
                    while (o--)(a = i[o]) && (p[u[o]] = !(f[u[o]] = a))
                }
                if (e) {
                    if (y || d) {
                        if (y) {
                            i = [], o = p.length;
                            while (o--)(a = p[o]) && i.push(f[o] = a);
                            y(null, p = [], i, r)
                        }
                        o = p.length;
                        while (o--)(a = p[o]) && -1 < (i = y ? P(e, a) : s[o]) && (e[i] = !(t[i] = a))
                    }
                } else p = Te(p === t ? p.splice(l, p.length) : p), y ? y(null, t, p, r) : H.apply(t, p)
            })
        }

        function Ee(e) {
            for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0, u = be(function(e) {
                    return e === i
                }, a, !0), l = be(function(e) {
                    return -1 < P(i, e)
                }, a, !0), c = [function(e, t, n) {
                    var r = !o && (n || t !== w) || ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
                    return i = null, r
                }]; s < r; s++)
                if (t = b.relative[e[s].type]) c = [be(we(c), t)];
                else {
                    if ((t = b.filter[e[s].type].apply(null, e[s].matches))[k]) {
                        for (n = ++s; n < r; n++)
                            if (b.relative[e[n].type]) break;
                        return Ce(1 < s && we(c), 1 < s && xe(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(B, "$1"), t, s < n && Ee(e.slice(s, n)), n < r && Ee(e = e.slice(n)), n < r && xe(e))
                    }
                    c.push(t)
                } return we(c)
        }
        return me.prototype = b.filters = b.pseudos, b.setFilters = new me, h = se.tokenize = function(e, t) {
            var n, r, i, o, a, s, u, l = x[e + " "];
            if (l) return t ? 0 : l.slice(0);
            a = e, s = [], u = b.preFilter;
            while (a) {
                for (o in n && !(r = _.exec(a)) || (r && (a = a.slice(r[0].length) || a), s.push(i = [])), n = !1, (r = z.exec(a)) && (n = r.shift(), i.push({
                        value: n,
                        type: r[0].replace(B, " ")
                    }), a = a.slice(n.length)), b.filter) !(r = G[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(), i.push({
                    value: n,
                    type: o,
                    matches: r
                }), a = a.slice(n.length));
                if (!n) break
            }
            return t ? a.length : a ? se.error(e) : x(e, s).slice(0)
        }, f = se.compile = function(e, t) {
            var n, v, y, m, x, r, i = [],
                o = [],
                a = A[e + " "];
            if (!a) {
                t || (t = h(e)), n = t.length;
                while (n--)(a = Ee(t[n]))[k] ? i.push(a) : o.push(a);
                (a = A(e, (v = o, m = 0 < (y = i).length, x = 0 < v.length, r = function(e, t, n, r, i) {
                    var o, a, s, u = 0,
                        l = "0",
                        c = e && [],
                        f = [],
                        p = w,
                        d = e || x && b.find.TAG("*", i),
                        h = S += null == p ? 1 : Math.random() || .1,
                        g = d.length;
                    for (i && (w = t === C || t || i); l !== g && null != (o = d[l]); l++) {
                        if (x && o) {
                            a = 0, t || o.ownerDocument === C || (T(o), n = !E);
                            while (s = v[a++])
                                if (s(o, t || C, n)) {
                                    r.push(o);
                                    break
                                } i && (S = h)
                        }
                        m && ((o = !s && o) && u--, e && c.push(o))
                    }
                    if (u += l, m && l !== u) {
                        a = 0;
                        while (s = y[a++]) s(c, f, t, n);
                        if (e) {
                            if (0 < u)
                                while (l--) c[l] || f[l] || (f[l] = q.call(r));
                            f = Te(f)
                        }
                        H.apply(r, f), i && !e && 0 < f.length && 1 < u + y.length && se.uniqueSort(r)
                    }
                    return i && (S = h, w = p), c
                }, m ? le(r) : r))).selector = e
            }
            return a
        }, g = se.select = function(e, t, n, r) {
            var i, o, a, s, u, l = "function" == typeof e && e,
                c = !r && h(e = l.selector || e);
            if (n = n || [], 1 === c.length) {
                if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
                    if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0])) return n;
                    l && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                i = G.needsContext.test(e) ? 0 : o.length;
                while (i--) {
                    if (a = o[i], b.relative[s = a.type]) break;
                    if ((u = b.find[s]) && (r = u(a.matches[0].replace(te, ne), ee.test(o[0].type) && ye(t.parentNode) || t))) {
                        if (o.splice(i, 1), !(e = r.length && xe(o))) return H.apply(n, r), n;
                        break
                    }
                }
            }
            return (l || f(e, c))(r, t, !E, n, !t || ee.test(e) && ye(t.parentNode) || t), n
        }, d.sortStable = k.split("").sort(D).join("") === k, d.detectDuplicates = !!l, T(), d.sortDetached = ce(function(e) {
            return 1 & e.compareDocumentPosition(C.createElement("fieldset"))
        }), ce(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || fe("type|href|height|width", function(e, t, n) {
            if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), d.attributes && ce(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || fe("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        }), ce(function(e) {
            return null == e.getAttribute("disabled")
        }) || fe(R, function(e, t, n) {
            var r;
            if (!n) return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }), se
    }(C);
    k.find = h, k.expr = h.selectors, k.expr[":"] = k.expr.pseudos, k.uniqueSort = k.unique = h.uniqueSort, k.text = h.getText, k.isXMLDoc = h.isXML, k.contains = h.contains, k.escapeSelector = h.escape;
    var T = function(e, t, n) {
            var r = [],
                i = void 0 !== n;
            while ((e = e[t]) && 9 !== e.nodeType)
                if (1 === e.nodeType) {
                    if (i && k(e).is(n)) break;
                    r.push(e)
                } return r
        },
        S = function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        A = k.expr.match.needsContext;

    function N(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    var D = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

    function j(e, n, r) {
        return m(n) ? k.grep(e, function(e, t) {
            return !!n.call(e, t, e) !== r
        }) : n.nodeType ? k.grep(e, function(e) {
            return e === n !== r
        }) : "string" != typeof n ? k.grep(e, function(e) {
            return -1 < i.call(n, e) !== r
        }) : k.filter(n, e, r)
    }
    k.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? k.find.matchesSelector(r, e) ? [r] : [] : k.find.matches(e, k.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, k.fn.extend({
        find: function(e) {
            var t, n, r = this.length,
                i = this;
            if ("string" != typeof e) return this.pushStack(k(e).filter(function() {
                for (t = 0; t < r; t++)
                    if (k.contains(i[t], this)) return !0
            }));
            for (n = this.pushStack([]), t = 0; t < r; t++) k.find(e, i[t], n);
            return 1 < r ? k.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(j(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(j(this, e || [], !0))
        },
        is: function(e) {
            return !!j(this, "string" == typeof e && A.test(e) ? k(e) : e || [], !1).length
        }
    });
    var q, L = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (k.fn.init = function(e, t, n) {
        var r, i;
        if (!e) return this;
        if (n = n || q, "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : L.exec(e)) || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof k ? t[0] : t, k.merge(this, k.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)), D.test(r[1]) && k.isPlainObject(t))
                    for (r in t) m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = E.getElementById(r[2])) && (this[0] = i, this.length = 1), this
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : m(e) ? void 0 !== n.ready ? n.ready(e) : e(k) : k.makeArray(e, this)
    }).prototype = k.fn, q = k(E);
    var H = /^(?:parents|prev(?:Until|All))/,
        O = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };

    function P(e, t) {
        while ((e = e[t]) && 1 !== e.nodeType);
        return e
    }
    k.fn.extend({
        has: function(e) {
            var t = k(e, this),
                n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (k.contains(this, t[e])) return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0,
                i = this.length,
                o = [],
                a = "string" != typeof e && k(e);
            if (!A.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && k.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        } return this.pushStack(1 < o.length ? k.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? i.call(k(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(k.uniqueSort(k.merge(this.get(), k(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), k.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return T(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return T(e, "parentNode", n)
        },
        next: function(e) {
            return P(e, "nextSibling")
        },
        prev: function(e) {
            return P(e, "previousSibling")
        },
        nextAll: function(e) {
            return T(e, "nextSibling")
        },
        prevAll: function(e) {
            return T(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return T(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return T(e, "previousSibling", n)
        },
        siblings: function(e) {
            return S((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return S(e.firstChild)
        },
        contents: function(e) {
            return "undefined" != typeof e.contentDocument ? e.contentDocument : (N(e, "template") && (e = e.content || e), k.merge([], e.childNodes))
        }
    }, function(r, i) {
        k.fn[r] = function(e, t) {
            var n = k.map(this, i, e);
            return "Until" !== r.slice(-5) && (t = e), t && "string" == typeof t && (n = k.filter(t, n)), 1 < this.length && (O[r] || k.uniqueSort(n), H.test(r) && n.reverse()), this.pushStack(n)
        }
    });
    var R = /[^\x20\t\r\n\f]+/g;

    function M(e) {
        return e
    }

    function I(e) {
        throw e
    }

    function W(e, t, n, r) {
        var i;
        try {
            e && m(i = e.promise) ? i.call(e).done(t).fail(n) : e && m(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    k.Callbacks = function(r) {
        var e, n;
        r = "string" == typeof r ? (e = r, n = {}, k.each(e.match(R) || [], function(e, t) {
            n[t] = !0
        }), n) : k.extend({}, r);
        var i, t, o, a, s = [],
            u = [],
            l = -1,
            c = function() {
                for (a = a || r.once, o = i = !0; u.length; l = -1) {
                    t = u.shift();
                    while (++l < s.length) !1 === s[l].apply(t[0], t[1]) && r.stopOnFalse && (l = s.length, t = !1)
                }
                r.memory || (t = !1), i = !1, a && (s = t ? [] : "")
            },
            f = {
                add: function() {
                    return s && (t && !i && (l = s.length - 1, u.push(t)), function n(e) {
                        k.each(e, function(e, t) {
                            m(t) ? r.unique && f.has(t) || s.push(t) : t && t.length && "string" !== w(t) && n(t)
                        })
                    }(arguments), t && !i && c()), this
                },
                remove: function() {
                    return k.each(arguments, function(e, t) {
                        var n;
                        while (-1 < (n = k.inArray(t, s, n))) s.splice(n, 1), n <= l && l--
                    }), this
                },
                has: function(e) {
                    return e ? -1 < k.inArray(e, s) : 0 < s.length
                },
                empty: function() {
                    return s && (s = []), this
                },
                disable: function() {
                    return a = u = [], s = t = "", this
                },
                disabled: function() {
                    return !s
                },
                lock: function() {
                    return a = u = [], t || i || (s = t = ""), this
                },
                locked: function() {
                    return !!a
                },
                fireWith: function(e, t) {
                    return a || (t = [e, (t = t || []).slice ? t.slice() : t], u.push(t), i || c()), this
                },
                fire: function() {
                    return f.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!o
                }
            };
        return f
    }, k.extend({
        Deferred: function(e) {
            var o = [
                    ["notify", "progress", k.Callbacks("memory"), k.Callbacks("memory"), 2],
                    ["resolve", "done", k.Callbacks("once memory"), k.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", k.Callbacks("once memory"), k.Callbacks("once memory"), 1, "rejected"]
                ],
                i = "pending",
                a = {
                    state: function() {
                        return i
                    },
                    always: function() {
                        return s.done(arguments).fail(arguments), this
                    },
                    "catch": function(e) {
                        return a.then(null, e)
                    },
                    pipe: function() {
                        var i = arguments;
                        return k.Deferred(function(r) {
                            k.each(o, function(e, t) {
                                var n = m(i[t[4]]) && i[t[4]];
                                s[t[1]](function() {
                                    var e = n && n.apply(this, arguments);
                                    e && m(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments)
                                })
                            }), i = null
                        }).promise()
                    },
                    then: function(t, n, r) {
                        var u = 0;

                        function l(i, o, a, s) {
                            return function() {
                                var n = this,
                                    r = arguments,
                                    e = function() {
                                        var e, t;
                                        if (!(i < u)) {
                                            if ((e = a.apply(n, r)) === o.promise()) throw new TypeError("Thenable self-resolution");
                                            t = e && ("object" == typeof e || "function" == typeof e) && e.then, m(t) ? s ? t.call(e, l(u, o, M, s), l(u, o, I, s)) : (u++, t.call(e, l(u, o, M, s), l(u, o, I, s), l(u, o, M, o.notifyWith))) : (a !== M && (n = void 0, r = [e]), (s || o.resolveWith)(n, r))
                                        }
                                    },
                                    t = s ? e : function() {
                                        try {
                                            e()
                                        } catch (e) {
                                            k.Deferred.exceptionHook && k.Deferred.exceptionHook(e, t.stackTrace), u <= i + 1 && (a !== I && (n = void 0, r = [e]), o.rejectWith(n, r))
                                        }
                                    };
                                i ? t() : (k.Deferred.getStackHook && (t.stackTrace = k.Deferred.getStackHook()), C.setTimeout(t))
                            }
                        }
                        return k.Deferred(function(e) {
                            o[0][3].add(l(0, e, m(r) ? r : M, e.notifyWith)), o[1][3].add(l(0, e, m(t) ? t : M)), o[2][3].add(l(0, e, m(n) ? n : I))
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? k.extend(e, a) : a
                    }
                },
                s = {};
            return k.each(o, function(e, t) {
                var n = t[2],
                    r = t[5];
                a[t[1]] = n.add, r && n.add(function() {
                    i = r
                }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock), n.add(t[3].fire), s[t[0]] = function() {
                    return s[t[0] + "With"](this === s ? void 0 : this, arguments), this
                }, s[t[0] + "With"] = n.fireWith
            }), a.promise(s), e && e.call(s, s), s
        },
        when: function(e) {
            var n = arguments.length,
                t = n,
                r = Array(t),
                i = s.call(arguments),
                o = k.Deferred(),
                a = function(t) {
                    return function(e) {
                        r[t] = this, i[t] = 1 < arguments.length ? s.call(arguments) : e, --n || o.resolveWith(r, i)
                    }
                };
            if (n <= 1 && (W(e, o.done(a(t)).resolve, o.reject, !n), "pending" === o.state() || m(i[t] && i[t].then))) return o.then();
            while (t--) W(i[t], a(t), o.reject);
            return o.promise()
        }
    });
    var $ = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    k.Deferred.exceptionHook = function(e, t) {
        C.console && C.console.warn && e && $.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t)
    }, k.readyException = function(e) {
        C.setTimeout(function() {
            throw e
        })
    };
    var F = k.Deferred();

    function B() {
        E.removeEventListener("DOMContentLoaded", B), C.removeEventListener("load", B), k.ready()
    }
    k.fn.ready = function(e) {
        return F.then(e)["catch"](function(e) {
            k.readyException(e)
        }), this
    }, k.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --k.readyWait : k.isReady) || (k.isReady = !0) !== e && 0 < --k.readyWait || F.resolveWith(E, [k])
        }
    }), k.ready.then = F.then, "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(k.ready) : (E.addEventListener("DOMContentLoaded", B), C.addEventListener("load", B));
    var _ = function(e, t, n, r, i, o, a) {
            var s = 0,
                u = e.length,
                l = null == n;
            if ("object" === w(n))
                for (s in i = !0, n) _(e, t, s, n[s], !0, o, a);
            else if (void 0 !== r && (i = !0, m(r) || (a = !0), l && (a ? (t.call(e, r), t = null) : (l = t, t = function(e, t, n) {
                    return l.call(k(e), n)
                })), t))
                for (; s < u; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return i ? e : l ? t.call(e) : u ? t(e[0], n) : o
        },
        z = /^-ms-/,
        U = /-([a-z])/g;

    function X(e, t) {
        return t.toUpperCase()
    }

    function V(e) {
        return e.replace(z, "ms-").replace(U, X)
    }
    var G = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };

    function Y() {
        this.expando = k.expando + Y.uid++
    }
    Y.uid = 1, Y.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {}, G(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t) i[V(t)] = n;
            else
                for (r in t) i[V(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][V(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(V) : (t = V(t)) in r ? [t] : t.match(R) || []).length;
                    while (n--) delete r[t[n]]
                }(void 0 === t || k.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !k.isEmptyObject(t)
        }
    };
    var Q = new Y,
        J = new Y,
        K = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        Z = /[A-Z]/g;

    function ee(e, t, n) {
        var r, i;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(Z, "-$&").toLowerCase(), "string" == typeof(n = e.getAttribute(r))) {
                try {
                    n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : K.test(i) ? JSON.parse(i) : i)
                } catch (e) {}
                J.set(e, t, n)
            } else n = void 0;
        return n
    }
    k.extend({
        hasData: function(e) {
            return J.hasData(e) || Q.hasData(e)
        },
        data: function(e, t, n) {
            return J.access(e, t, n)
        },
        removeData: function(e, t) {
            J.remove(e, t)
        },
        _data: function(e, t, n) {
            return Q.access(e, t, n)
        },
        _removeData: function(e, t) {
            Q.remove(e, t)
        }
    }), k.fn.extend({
        data: function(n, e) {
            var t, r, i, o = this[0],
                a = o && o.attributes;
            if (void 0 === n) {
                if (this.length && (i = J.get(o), 1 === o.nodeType && !Q.get(o, "hasDataAttrs"))) {
                    t = a.length;
                    while (t--) a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = V(r.slice(5)), ee(o, r, i[r]));
                    Q.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof n ? this.each(function() {
                J.set(this, n)
            }) : _(this, function(e) {
                var t;
                if (o && void 0 === e) return void 0 !== (t = J.get(o, n)) ? t : void 0 !== (t = ee(o, n)) ? t : void 0;
                this.each(function() {
                    J.set(this, n, e)
                })
            }, null, e, 1 < arguments.length, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                J.remove(this, e)
            })
        }
    }), k.extend({
        queue: function(e, t, n) {
            var r;
            if (e) return t = (t || "fx") + "queue", r = Q.get(e, t), n && (!r || Array.isArray(n) ? r = Q.access(e, t, k.makeArray(n)) : r.push(n)), r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = k.queue(e, t),
                r = n.length,
                i = n.shift(),
                o = k._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, function() {
                k.dequeue(e, t)
            }, o)), !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Q.get(e, n) || Q.access(e, n, {
                empty: k.Callbacks("once memory").add(function() {
                    Q.remove(e, [t + "queue", n])
                })
            })
        }
    }), k.fn.extend({
        queue: function(t, n) {
            var e = 2;
            return "string" != typeof t && (n = t, t = "fx", e--), arguments.length < e ? k.queue(this[0], t) : void 0 === n ? this : this.each(function() {
                var e = k.queue(this, t, n);
                k._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && k.dequeue(this, t)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                k.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1,
                i = k.Deferred(),
                o = this,
                a = this.length,
                s = function() {
                    --r || i.resolveWith(o, [o])
                };
            "string" != typeof e && (t = e, e = void 0), e = e || "fx";
            while (a--)(n = Q.get(o[a], e + "queueHooks")) && n.empty && (r++, n.empty.add(s));
            return s(), i.promise(t)
        }
    });
    var te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ne = new RegExp("^(?:([+-])=|)(" + te + ")([a-z%]*)$", "i"),
        re = ["Top", "Right", "Bottom", "Left"],
        ie = E.documentElement,
        oe = function(e) {
            return k.contains(e.ownerDocument, e)
        },
        ae = {
            composed: !0
        };
    ie.attachShadow && (oe = function(e) {
        return k.contains(e.ownerDocument, e) || e.getRootNode(ae) === e.ownerDocument
    });
    var se = function(e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && oe(e) && "none" === k.css(e, "display")
        },
        ue = function(e, t, n, r) {
            var i, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            for (o in i = n.apply(e, r || []), t) e.style[o] = a[o];
            return i
        };

    function le(e, t, n, r) {
        var i, o, a = 20,
            s = r ? function() {
                return r.cur()
            } : function() {
                return k.css(e, t, "")
            },
            u = s(),
            l = n && n[3] || (k.cssNumber[t] ? "" : "px"),
            c = e.nodeType && (k.cssNumber[t] || "px" !== l && +u) && ne.exec(k.css(e, t));
        if (c && c[3] !== l) {
            u /= 2, l = l || c[3], c = +u || 1;
            while (a--) k.style(e, t, c + l), (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0), c /= o;
            c *= 2, k.style(e, t, c + l), n = n || []
        }
        return n && (c = +c || +u || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = l, r.start = c, r.end = i)), i
    }
    var ce = {};

    function fe(e, t) {
        for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)(r = e[c]).style && (n = r.style.display, t ? ("none" === n && (l[c] = Q.get(r, "display") || null, l[c] || (r.style.display = "")), "" === r.style.display && se(r) && (l[c] = (u = a = o = void 0, a = (i = r).ownerDocument, s = i.nodeName, (u = ce[s]) || (o = a.body.appendChild(a.createElement(s)), u = k.css(o, "display"), o.parentNode.removeChild(o), "none" === u && (u = "block"), ce[s] = u)))) : "none" !== n && (l[c] = "none", Q.set(r, "display", n)));
        for (c = 0; c < f; c++) null != l[c] && (e[c].style.display = l[c]);
        return e
    }
    k.fn.extend({
        show: function() {
            return fe(this, !0)
        },
        hide: function() {
            return fe(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                se(this) ? k(this).show() : k(this).hide()
            })
        }
    });
    var pe = /^(?:checkbox|radio)$/i,
        de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
        he = /^$|^module$|\/(?:java|ecma)script/i,
        ge = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };

    function ve(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && N(e, t) ? k.merge([e], n) : n
    }

    function ye(e, t) {
        for (var n = 0, r = e.length; n < r; n++) Q.set(e[n], "globalEval", !t || Q.get(t[n], "globalEval"))
    }
    ge.optgroup = ge.option, ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead, ge.th = ge.td;
    var me, xe, be = /<|&#?\w+;/;

    function we(e, t, n, r, i) {
        for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++)
            if ((o = e[d]) || 0 === o)
                if ("object" === w(o)) k.merge(p, o.nodeType ? [o] : o);
                else if (be.test(o)) {
            a = a || f.appendChild(t.createElement("div")), s = (de.exec(o) || ["", ""])[1].toLowerCase(), u = ge[s] || ge._default, a.innerHTML = u[1] + k.htmlPrefilter(o) + u[2], c = u[0];
            while (c--) a = a.lastChild;
            k.merge(p, a.childNodes), (a = f.firstChild).textContent = ""
        } else p.push(t.createTextNode(o));
        f.textContent = "", d = 0;
        while (o = p[d++])
            if (r && -1 < k.inArray(o, r)) i && i.push(o);
            else if (l = oe(o), a = ve(f.appendChild(o), "script"), l && ye(a), n) {
            c = 0;
            while (o = a[c++]) he.test(o.type || "") && n.push(o)
        }
        return f
    }
    me = E.createDocumentFragment().appendChild(E.createElement("div")), (xe = E.createElement("input")).setAttribute("type", "radio"), xe.setAttribute("checked", "checked"), xe.setAttribute("name", "t"), me.appendChild(xe), y.checkClone = me.cloneNode(!0).cloneNode(!0).lastChild.checked, me.innerHTML = "<textarea>x</textarea>", y.noCloneChecked = !!me.cloneNode(!0).lastChild.defaultValue;
    var Te = /^key/,
        Ce = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        Ee = /^([^.]*)(?:\.(.+)|)/;

    function ke() {
        return !0
    }

    function Se() {
        return !1
    }

    function Ae(e, t) {
        return e === function() {
            try {
                return E.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }

    function Ne(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n, n = void 0), t) Ne(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i) i = Se;
        else if (!i) return e;
        return 1 === o && (a = i, (i = function(e) {
            return k().off(e), a.apply(this, arguments)
        }).guid = a.guid || (a.guid = k.guid++)), e.each(function() {
            k.event.add(this, t, i, r, n)
        })
    }

    function De(e, i, o) {
        o ? (Q.set(e, i, !1), k.event.add(e, i, {
            namespace: !1,
            handler: function(e) {
                var t, n, r = Q.get(this, i);
                if (1 & e.isTrigger && this[i]) {
                    if (r)(k.event.special[i] || {}).delegateType && e.stopPropagation();
                    else if (r = s.call(arguments), Q.set(this, i, r), t = o(this, i), this[i](), r !== (n = Q.get(this, i)) || t ? Q.set(this, i, !1) : n = void 0, r !== n) return e.stopImmediatePropagation(), e.preventDefault(), n
                } else r && (Q.set(this, i, k.event.trigger(k.extend(r.shift(), k.Event.prototype), r, this)), e.stopImmediatePropagation())
            }
        })) : k.event.add(e, i, ke)
    }
    k.event = {
        global: {},
        add: function(t, e, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = Q.get(t);
            if (v) {
                n.handler && (n = (o = n).handler, i = o.selector), i && k.find.matchesSelector(ie, i), n.guid || (n.guid = k.guid++), (u = v.events) || (u = v.events = {}), (a = v.handle) || (a = v.handle = function(e) {
                    return "undefined" != typeof k && k.event.triggered !== e.type ? k.event.dispatch.apply(t, arguments) : void 0
                }), l = (e = (e || "").match(R) || [""]).length;
                while (l--) d = g = (s = Ee.exec(e[l]) || [])[1], h = (s[2] || "").split(".").sort(), d && (f = k.event.special[d] || {}, d = (i ? f.delegateType : f.bindType) || d, f = k.event.special[d] || {}, c = k.extend({
                    type: d,
                    origType: g,
                    data: r,
                    handler: n,
                    guid: n.guid,
                    selector: i,
                    needsContext: i && k.expr.match.needsContext.test(i),
                    namespace: h.join(".")
                }, o), (p = u[d]) || ((p = u[d] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)), f.add && (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)), i ? p.splice(p.delegateCount++, 0, c) : p.push(c), k.event.global[d] = !0)
            }
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = Q.hasData(e) && Q.get(e);
            if (v && (u = v.events)) {
                l = (t = (t || "").match(R) || [""]).length;
                while (l--)
                    if (d = g = (s = Ee.exec(t[l]) || [])[1], h = (s[2] || "").split(".").sort(), d) {
                        f = k.event.special[d] || {}, p = u[d = (r ? f.delegateType : f.bindType) || d] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = p.length;
                        while (o--) c = p[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1), c.selector && p.delegateCount--, f.remove && f.remove.call(e, c));
                        a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || k.removeEvent(e, d, v.handle), delete u[d])
                    } else
                        for (d in u) k.event.remove(e, d + t[l], n, r, !0);
                k.isEmptyObject(u) && Q.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a, s = k.event.fix(e),
                u = new Array(arguments.length),
                l = (Q.get(this, "events") || {})[s.type] || [],
                c = k.event.special[s.type] || {};
            for (u[0] = s, t = 1; t < arguments.length; t++) u[t] = arguments[t];
            if (s.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, s)) {
                a = k.event.handlers.call(this, s, l), t = 0;
                while ((i = a[t++]) && !s.isPropagationStopped()) {
                    s.currentTarget = i.elem, n = 0;
                    while ((o = i.handlers[n++]) && !s.isImmediatePropagationStopped()) s.rnamespace && !1 !== o.namespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (r = ((k.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u)) && !1 === (s.result = r) && (s.preventDefault(), s.stopPropagation()))
                }
                return c.postDispatch && c.postDispatch.call(this, s), s.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [],
                u = t.delegateCount,
                l = e.target;
            if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
                        for (o = [], a = {}, n = 0; n < u; n++) void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < k(i, this).index(l) : k.find(i, this, null, [l]).length), a[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    } return l = this, u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }), s
        },
        addProp: function(t, e) {
            Object.defineProperty(k.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: m(e) ? function() {
                    if (this.originalEvent) return e(this.originalEvent)
                } : function() {
                    if (this.originalEvent) return this.originalEvent[t]
                },
                set: function(e) {
                    Object.defineProperty(this, t, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: e
                    })
                }
            })
        },
        fix: function(e) {
            return e[k.expando] ? e : new k.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && N(t, "input") && void 0 === Q.get(t, "click") && De(t, "click", ke), !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return pe.test(t.type) && t.click && N(t, "input") && void 0 === Q.get(t, "click") && De(t, "click"), !0
                },
                _default: function(e) {
                    var t = e.target;
                    return pe.test(t.type) && t.click && N(t, "input") && Q.get(t, "click") || N(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, k.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, k.Event = function(e, t) {
        if (!(this instanceof k.Event)) return new k.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? ke : Se, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && k.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[k.expando] = !0
    }, k.Event.prototype = {
        constructor: k.Event,
        isDefaultPrevented: Se,
        isPropagationStopped: Se,
        isImmediatePropagationStopped: Se,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = ke, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = ke, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = ke, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, k.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        "char": !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && Te.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ce.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, k.event.addProp), k.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        k.event.special[e] = {
            setup: function() {
                return De(this, e, Ae), !1
            },
            trigger: function() {
                return De(this, e), !0
            },
            delegateType: t
        }
    }), k.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, i) {
        k.event.special[e] = {
            delegateType: i,
            bindType: i,
            handle: function(e) {
                var t, n = e.relatedTarget,
                    r = e.handleObj;
                return n && (n === this || k.contains(this, n)) || (e.type = r.origType, t = r.handler.apply(this, arguments), e.type = i), t
            }
        }
    }), k.fn.extend({
        on: function(e, t, n, r) {
            return Ne(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return Ne(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj) return r = e.handleObj, k(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
            if ("object" == typeof e) {
                for (i in e) this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = Se), this.each(function() {
                k.event.remove(this, e, n, t)
            })
        }
    });
    var je = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        qe = /<script|<style|<link/i,
        Le = /checked\s*(?:[^=]|=\s*.checked.)/i,
        He = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    function Oe(e, t) {
        return N(e, "table") && N(11 !== t.nodeType ? t : t.firstChild, "tr") && k(e).children("tbody")[0] || e
    }

    function Pe(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function Re(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
    }

    function Me(e, t) {
        var n, r, i, o, a, s, u, l;
        if (1 === t.nodeType) {
            if (Q.hasData(e) && (o = Q.access(e), a = Q.set(t, o), l = o.events))
                for (i in delete a.handle, a.events = {}, l)
                    for (n = 0, r = l[i].length; n < r; n++) k.event.add(t, i, l[i][n]);
            J.hasData(e) && (s = J.access(e), u = k.extend({}, s), J.set(t, u))
        }
    }

    function Ie(n, r, i, o) {
        r = g.apply([], r);
        var e, t, a, s, u, l, c = 0,
            f = n.length,
            p = f - 1,
            d = r[0],
            h = m(d);
        if (h || 1 < f && "string" == typeof d && !y.checkClone && Le.test(d)) return n.each(function(e) {
            var t = n.eq(e);
            h && (r[0] = d.call(this, e, t.html())), Ie(t, r, i, o)
        });
        if (f && (t = (e = we(r, n[0].ownerDocument, !1, n, o)).firstChild, 1 === e.childNodes.length && (e = t), t || o)) {
            for (s = (a = k.map(ve(e, "script"), Pe)).length; c < f; c++) u = e, c !== p && (u = k.clone(u, !0, !0), s && k.merge(a, ve(u, "script"))), i.call(n[c], u, c);
            if (s)
                for (l = a[a.length - 1].ownerDocument, k.map(a, Re), c = 0; c < s; c++) u = a[c], he.test(u.type || "") && !Q.access(u, "globalEval") && k.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? k._evalUrl && !u.noModule && k._evalUrl(u.src, {
                    nonce: u.nonce || u.getAttribute("nonce")
                }) : b(u.textContent.replace(He, ""), u, l))
        }
        return n
    }

    function We(e, t, n) {
        for (var r, i = t ? k.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || k.cleanData(ve(r)), r.parentNode && (n && oe(r) && ye(ve(r, "script")), r.parentNode.removeChild(r));
        return e
    }
    k.extend({
        htmlPrefilter: function(e) {
            return e.replace(je, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, u, l, c = e.cloneNode(!0),
                f = oe(e);
            if (!(y.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || k.isXMLDoc(e)))
                for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++) s = o[r], u = a[r], void 0, "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
            if (t)
                if (n)
                    for (o = o || ve(e), a = a || ve(c), r = 0, i = o.length; r < i; r++) Me(o[r], a[r]);
                else Me(e, c);
            return 0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")), c
        },
        cleanData: function(e) {
            for (var t, n, r, i = k.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (G(n)) {
                    if (t = n[Q.expando]) {
                        if (t.events)
                            for (r in t.events) i[r] ? k.event.remove(n, r) : k.removeEvent(n, r, t.handle);
                        n[Q.expando] = void 0
                    }
                    n[J.expando] && (n[J.expando] = void 0)
                }
        }
    }), k.fn.extend({
        detach: function(e) {
            return We(this, e, !0)
        },
        remove: function(e) {
            return We(this, e)
        },
        text: function(e) {
            return _(this, function(e) {
                return void 0 === e ? k.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return Ie(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Oe(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return Ie(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = Oe(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return Ie(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return Ie(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (k.cleanData(ve(e, !1)), e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return k.clone(this, e, t)
            })
        },
        html: function(e) {
            return _(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    r = this.length;
                if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !qe.test(e) && !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = k.htmlPrefilter(e);
                    try {
                        for (; n < r; n++) 1 === (t = this[n] || {}).nodeType && (k.cleanData(ve(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return Ie(this, arguments, function(e) {
                var t = this.parentNode;
                k.inArray(this, n) < 0 && (k.cleanData(ve(this)), t && t.replaceChild(e, this))
            }, n)
        }
    }), k.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, a) {
        k.fn[e] = function(e) {
            for (var t, n = [], r = k(e), i = r.length - 1, o = 0; o <= i; o++) t = o === i ? this : this.clone(!0), k(r[o])[a](t), u.apply(n, t.get());
            return this.pushStack(n)
        }
    });
    var $e = new RegExp("^(" + te + ")(?!px)[a-z%]+$", "i"),
        Fe = function(e) {
            var t = e.ownerDocument.defaultView;
            return t && t.opener || (t = C), t.getComputedStyle(e)
        },
        Be = new RegExp(re.join("|"), "i");

    function _e(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || Fe(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || oe(e) || (a = k.style(e, t)), !y.pixelBoxStyles() && $e.test(a) && Be.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a
    }

    function ze(e, t) {
        return {
            get: function() {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }! function() {
        function e() {
            if (u) {
                s.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", ie.appendChild(s).appendChild(u);
                var e = C.getComputedStyle(u);
                n = "1%" !== e.top, a = 12 === t(e.marginLeft), u.style.right = "60%", o = 36 === t(e.right), r = 36 === t(e.width), u.style.position = "absolute", i = 12 === t(u.offsetWidth / 3), ie.removeChild(s), u = null
            }
        }

        function t(e) {
            return Math.round(parseFloat(e))
        }
        var n, r, i, o, a, s = E.createElement("div"),
            u = E.createElement("div");
        u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", y.clearCloneStyle = "content-box" === u.style.backgroundClip, k.extend(y, {
            boxSizingReliable: function() {
                return e(), r
            },
            pixelBoxStyles: function() {
                return e(), o
            },
            pixelPosition: function() {
                return e(), n
            },
            reliableMarginLeft: function() {
                return e(), a
            },
            scrollboxSize: function() {
                return e(), i
            }
        }))
    }();
    var Ue = ["Webkit", "Moz", "ms"],
        Xe = E.createElement("div").style,
        Ve = {};

    function Ge(e) {
        var t = k.cssProps[e] || Ve[e];
        return t || (e in Xe ? e : Ve[e] = function(e) {
            var t = e[0].toUpperCase() + e.slice(1),
                n = Ue.length;
            while (n--)
                if ((e = Ue[n] + t) in Xe) return e
        }(e) || e)
    }
    var Ye = /^(none|table(?!-c[ea]).+)/,
        Qe = /^--/,
        Je = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        Ke = {
            letterSpacing: "0",
            fontWeight: "400"
        };

    function Ze(e, t, n) {
        var r = ne.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }

    function et(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0,
            s = 0,
            u = 0;
        if (n === (r ? "border" : "content")) return 0;
        for (; a < 4; a += 2) "margin" === n && (u += k.css(e, n + re[a], !0, i)), r ? ("content" === n && (u -= k.css(e, "padding" + re[a], !0, i)), "margin" !== n && (u -= k.css(e, "border" + re[a] + "Width", !0, i))) : (u += k.css(e, "padding" + re[a], !0, i), "padding" !== n ? u += k.css(e, "border" + re[a] + "Width", !0, i) : s += k.css(e, "border" + re[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0), u
    }

    function tt(e, t, n) {
        var r = Fe(e),
            i = (!y.boxSizingReliable() || n) && "border-box" === k.css(e, "boxSizing", !1, r),
            o = i,
            a = _e(e, t, r),
            s = "offset" + t[0].toUpperCase() + t.slice(1);
        if ($e.test(a)) {
            if (!n) return a;
            a = "auto"
        }
        return (!y.boxSizingReliable() && i || "auto" === a || !parseFloat(a) && "inline" === k.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === k.css(e, "boxSizing", !1, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + et(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
    }

    function nt(e, t, n, r, i) {
        return new nt.prototype.init(e, t, n, r, i)
    }
    k.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = _e(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = V(t),
                    u = Qe.test(t),
                    l = e.style;
                if (u || (t = Ge(s)), a = k.cssHooks[t] || k.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                "string" === (o = typeof n) && (i = ne.exec(n)) && i[1] && (n = le(e, t, i), o = "number"), null != n && n == n && ("number" !== o || u || (n += i && i[3] || (k.cssNumber[s] ? "" : "px")), y.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = V(t);
            return Qe.test(t) || (t = Ge(s)), (a = k.cssHooks[t] || k.cssHooks[s]) && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = _e(e, t, r)), "normal" === i && t in Ke && (i = Ke[t]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }), k.each(["height", "width"], function(e, u) {
        k.cssHooks[u] = {
            get: function(e, t, n) {
                if (t) return !Ye.test(k.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? tt(e, u, n) : ue(e, Je, function() {
                    return tt(e, u, n)
                })
            },
            set: function(e, t, n) {
                var r, i = Fe(e),
                    o = !y.scrollboxSize() && "absolute" === i.position,
                    a = (o || n) && "border-box" === k.css(e, "boxSizing", !1, i),
                    s = n ? et(e, u, n, a, i) : 0;
                return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - et(e, u, "border", !1, i) - .5)), s && (r = ne.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t, t = k.css(e, u)), Ze(0, t, s)
            }
        }
    }), k.cssHooks.marginLeft = ze(y.reliableMarginLeft, function(e, t) {
        if (t) return (parseFloat(_e(e, "marginLeft")) || e.getBoundingClientRect().left - ue(e, {
            marginLeft: 0
        }, function() {
            return e.getBoundingClientRect().left
        })) + "px"
    }), k.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(i, o) {
        k.cssHooks[i + o] = {
            expand: function(e) {
                for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++) n[i + re[t] + o] = r[t] || r[t - 2] || r[0];
                return n
            }
        }, "margin" !== i && (k.cssHooks[i + o].set = Ze)
    }), k.fn.extend({
        css: function(e, t) {
            return _(this, function(e, t, n) {
                var r, i, o = {},
                    a = 0;
                if (Array.isArray(t)) {
                    for (r = Fe(e), i = t.length; a < i; a++) o[t[a]] = k.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? k.style(e, t, n) : k.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }), ((k.Tween = nt).prototype = {
        constructor: nt,
        init: function(e, t, n, r, i, o) {
            this.elem = e, this.prop = n, this.easing = i || k.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (k.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = nt.propHooks[this.prop];
            return e && e.get ? e.get(this) : nt.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = nt.propHooks[this.prop];
            return this.options.duration ? this.pos = t = k.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : nt.propHooks._default.set(this), this
        }
    }).init.prototype = nt.prototype, (nt.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = k.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                k.fx.step[e.prop] ? k.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !k.cssHooks[e.prop] && null == e.elem.style[Ge(e.prop)] ? e.elem[e.prop] = e.now : k.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = nt.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, k.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, k.fx = nt.prototype.init, k.fx.step = {};
    var rt, it, ot, at, st = /^(?:toggle|show|hide)$/,
        ut = /queueHooks$/;

    function lt() {
        it && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(lt) : C.setTimeout(lt, k.fx.interval), k.fx.tick())
    }

    function ct() {
        return C.setTimeout(function() {
            rt = void 0
        }), rt = Date.now()
    }

    function ft(e, t) {
        var n, r = 0,
            i = {
                height: e
            };
        for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = re[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e), i
    }

    function pt(e, t, n) {
        for (var r, i = (dt.tweeners[t] || []).concat(dt.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e)) return r
    }

    function dt(o, e, t) {
        var n, a, r = 0,
            i = dt.prefilters.length,
            s = k.Deferred().always(function() {
                delete u.elem
            }),
            u = function() {
                if (a) return !1;
                for (var e = rt || ct(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++) l.tweens[r].run(n);
                return s.notifyWith(o, [l, n, t]), n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1)
            },
            l = s.promise({
                elem: o,
                props: k.extend({}, e),
                opts: k.extend(!0, {
                    specialEasing: {},
                    easing: k.easing._default
                }, t),
                originalProperties: e,
                originalOptions: t,
                startTime: rt || ct(),
                duration: t.duration,
                tweens: [],
                createTween: function(e, t) {
                    var n = k.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
                    return l.tweens.push(n), n
                },
                stop: function(e) {
                    var t = 0,
                        n = e ? l.tweens.length : 0;
                    if (a) return this;
                    for (a = !0; t < n; t++) l.tweens[t].run(1);
                    return e ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]), this
                }
            }),
            c = l.props;
        for (! function(e, t) {
                var n, r, i, o, a;
                for (n in e)
                    if (i = t[r = V(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = k.cssHooks[r]) && "expand" in a)
                        for (n in o = a.expand(o), delete e[r], o) n in e || (e[n] = o[n], t[n] = i);
                    else t[r] = i
            }(c, l.opts.specialEasing); r < i; r++)
            if (n = dt.prefilters[r].call(l, o, c, l.opts)) return m(n.stop) && (k._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)), n;
        return k.map(c, pt, l), m(l.opts.start) && l.opts.start.call(o, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), k.fx.timer(k.extend(u, {
            elem: o,
            anim: l,
            queue: l.opts.queue
        })), l
    }
    k.Animation = k.extend(dt, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return le(n.elem, e, ne.exec(t), n), n
            }]
        },
        tweener: function(e, t) {
            m(e) ? (t = e, e = ["*"]) : e = e.match(R);
            for (var n, r = 0, i = e.length; r < i; r++) n = e[r], dt.tweeners[n] = dt.tweeners[n] || [], dt.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, o, a, s, u, l, c, f = "width" in t || "height" in t,
                p = this,
                d = {},
                h = e.style,
                g = e.nodeType && se(e),
                v = Q.get(e, "fxshow");
            for (r in n.queue || (null == (a = k._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function() {
                    a.unqueued || s()
                }), a.unqueued++, p.always(function() {
                    p.always(function() {
                        a.unqueued--, k.queue(e, "fx").length || a.empty.fire()
                    })
                })), t)
                if (i = t[r], st.test(i)) {
                    if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
                        if ("show" !== i || !v || void 0 === v[r]) continue;
                        g = !0
                    }
                    d[r] = v && v[r] || k.style(e, r)
                } if ((u = !k.isEmptyObject(t)) || !k.isEmptyObject(d))
                for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (l = v && v.display) && (l = Q.get(e, "display")), "none" === (c = k.css(e, "display")) && (l ? c = l : (fe([e], !0), l = e.style.display || l, c = k.css(e, "display"), fe([e]))), ("inline" === c || "inline-block" === c && null != l) && "none" === k.css(e, "float") && (u || (p.done(function() {
                        h.display = l
                    }), null == l && (c = h.display, l = "none" === c ? "" : c)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function() {
                        h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
                    })), u = !1, d) u || (v ? "hidden" in v && (g = v.hidden) : v = Q.access(e, "fxshow", {
                    display: l
                }), o && (v.hidden = !g), g && fe([e], !0), p.done(function() {
                    for (r in g || fe([e]), Q.remove(e, "fxshow"), d) k.style(e, r, d[r])
                })), u = pt(g ? v[r] : 0, r, p), r in v || (v[r] = u.start, g && (u.end = u.start, u.start = 0))
        }],
        prefilter: function(e, t) {
            t ? dt.prefilters.unshift(e) : dt.prefilters.push(e)
        }
    }), k.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? k.extend({}, e) : {
            complete: n || !n && t || m(e) && e,
            duration: e,
            easing: n && t || t && !m(t) && t
        };
        return k.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in k.fx.speeds ? r.duration = k.fx.speeds[r.duration] : r.duration = k.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function() {
            m(r.old) && r.old.call(this), r.queue && k.dequeue(this, r.queue)
        }, r
    }, k.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(se).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(t, e, n, r) {
            var i = k.isEmptyObject(t),
                o = k.speed(e, n, r),
                a = function() {
                    var e = dt(this, k.extend({}, t), o);
                    (i || Q.get(this, "finish")) && e.stop(!0)
                };
            return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(i, e, o) {
            var a = function(e) {
                var t = e.stop;
                delete e.stop, t(o)
            };
            return "string" != typeof i && (o = e, e = i, i = void 0), e && !1 !== i && this.queue(i || "fx", []), this.each(function() {
                var e = !0,
                    t = null != i && i + "queueHooks",
                    n = k.timers,
                    r = Q.get(this);
                if (t) r[t] && r[t].stop && a(r[t]);
                else
                    for (t in r) r[t] && r[t].stop && ut.test(t) && a(r[t]);
                for (t = n.length; t--;) n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o), e = !1, n.splice(t, 1));
                !e && o || k.dequeue(this, i)
            })
        },
        finish: function(a) {
            return !1 !== a && (a = a || "fx"), this.each(function() {
                var e, t = Q.get(this),
                    n = t[a + "queue"],
                    r = t[a + "queueHooks"],
                    i = k.timers,
                    o = n ? n.length : 0;
                for (t.finish = !0, k.queue(this, a, []), r && r.stop && r.stop.call(this, !0), e = i.length; e--;) i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0), i.splice(e, 1));
                for (e = 0; e < o; e++) n[e] && n[e].finish && n[e].finish.call(this);
                delete t.finish
            })
        }
    }), k.each(["toggle", "show", "hide"], function(e, r) {
        var i = k.fn[r];
        k.fn[r] = function(e, t, n) {
            return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(ft(r, !0), e, t, n)
        }
    }), k.each({
        slideDown: ft("show"),
        slideUp: ft("hide"),
        slideToggle: ft("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, r) {
        k.fn[e] = function(e, t, n) {
            return this.animate(r, e, t, n)
        }
    }), k.timers = [], k.fx.tick = function() {
        var e, t = 0,
            n = k.timers;
        for (rt = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || k.fx.stop(), rt = void 0
    }, k.fx.timer = function(e) {
        k.timers.push(e), k.fx.start()
    }, k.fx.interval = 13, k.fx.start = function() {
        it || (it = !0, lt())
    }, k.fx.stop = function() {
        it = null
    }, k.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, k.fn.delay = function(r, e) {
        return r = k.fx && k.fx.speeds[r] || r, e = e || "fx", this.queue(e, function(e, t) {
            var n = C.setTimeout(e, r);
            t.stop = function() {
                C.clearTimeout(n)
            }
        })
    }, ot = E.createElement("input"), at = E.createElement("select").appendChild(E.createElement("option")), ot.type = "checkbox", y.checkOn = "" !== ot.value, y.optSelected = at.selected, (ot = E.createElement("input")).value = "t", ot.type = "radio", y.radioValue = "t" === ot.value;
    var ht, gt = k.expr.attrHandle;
    k.fn.extend({
        attr: function(e, t) {
            return _(this, k.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                k.removeAttr(this, e)
            })
        }
    }), k.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? k.prop(e, t, n) : (1 === o && k.isXMLDoc(e) || (i = k.attrHooks[t.toLowerCase()] || (k.expr.match.bool.test(t) ? ht : void 0)), void 0 !== n ? null === n ? void k.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = k.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!y.radioValue && "radio" === t && N(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0,
                i = t && t.match(R);
            if (i && 1 === e.nodeType)
                while (n = i[r++]) e.removeAttribute(n)
        }
    }), ht = {
        set: function(e, t, n) {
            return !1 === t ? k.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, k.each(k.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var a = gt[t] || k.find.attr;
        gt[t] = function(e, t, n) {
            var r, i, o = t.toLowerCase();
            return n || (i = gt[o], gt[o] = r, r = null != a(e, t, n) ? o : null, gt[o] = i), r
        }
    });
    var vt = /^(?:input|select|textarea|button)$/i,
        yt = /^(?:a|area)$/i;

    function mt(e) {
        return (e.match(R) || []).join(" ")
    }

    function xt(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }

    function bt(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(R) || []
    }
    k.fn.extend({
        prop: function(e, t) {
            return _(this, k.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[k.propFix[e] || e]
            })
        }
    }), k.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return 1 === o && k.isXMLDoc(e) || (t = k.propFix[t] || t, i = k.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = k.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : vt.test(e.nodeName) || yt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), y.optSelected || (k.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), k.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        k.propFix[this.toLowerCase()] = this
    }), k.fn.extend({
        addClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (m(t)) return this.each(function(e) {
                k(this).addClass(t.call(this, e, xt(this)))
            });
            if ((e = bt(t)).length)
                while (n = this[u++])
                    if (i = xt(n), r = 1 === n.nodeType && " " + mt(i) + " ") {
                        a = 0;
                        while (o = e[a++]) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = mt(r)) && n.setAttribute("class", s)
                    } return this
        },
        removeClass: function(t) {
            var e, n, r, i, o, a, s, u = 0;
            if (m(t)) return this.each(function(e) {
                k(this).removeClass(t.call(this, e, xt(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ((e = bt(t)).length)
                while (n = this[u++])
                    if (i = xt(n), r = 1 === n.nodeType && " " + mt(i) + " ") {
                        a = 0;
                        while (o = e[a++])
                            while (-1 < r.indexOf(" " + o + " ")) r = r.replace(" " + o + " ", " ");
                        i !== (s = mt(r)) && n.setAttribute("class", s)
                    } return this
        },
        toggleClass: function(i, t) {
            var o = typeof i,
                a = "string" === o || Array.isArray(i);
            return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : m(i) ? this.each(function(e) {
                k(this).toggleClass(i.call(this, e, xt(this), t), t)
            }) : this.each(function() {
                var e, t, n, r;
                if (a) {
                    t = 0, n = k(this), r = bt(i);
                    while (e = r[t++]) n.hasClass(e) ? n.removeClass(e) : n.addClass(e)
                } else void 0 !== i && "boolean" !== o || ((e = xt(this)) && Q.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Q.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            t = " " + e + " ";
            while (n = this[r++])
                if (1 === n.nodeType && -1 < (" " + mt(xt(n)) + " ").indexOf(t)) return !0;
            return !1
        }
    });
    var wt = /\r/g;
    k.fn.extend({
        val: function(n) {
            var r, e, i, t = this[0];
            return arguments.length ? (i = m(n), this.each(function(e) {
                var t;
                1 === this.nodeType && (null == (t = i ? n.call(this, e, k(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = k.map(t, function(e) {
                    return null == e ? "" : e + ""
                })), (r = k.valHooks[this.type] || k.valHooks[this.nodeName.toLowerCase()]) && "set" in r && void 0 !== r.set(this, t, "value") || (this.value = t))
            })) : t ? (r = k.valHooks[t.type] || k.valHooks[t.nodeName.toLowerCase()]) && "get" in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof(e = t.value) ? e.replace(wt, "") : null == e ? "" : e : void 0
        }
    }), k.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = k.find.attr(e, "value");
                    return null != t ? t : mt(k.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i = e.options,
                        o = e.selectedIndex,
                        a = "select-one" === e.type,
                        s = a ? null : [],
                        u = a ? o + 1 : i.length;
                    for (r = o < 0 ? u : a ? o : 0; r < u; r++)
                        if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !N(n.parentNode, "optgroup"))) {
                            if (t = k(n).val(), a) return t;
                            s.push(t)
                        } return s
                },
                set: function(e, t) {
                    var n, r, i = e.options,
                        o = k.makeArray(t),
                        a = i.length;
                    while (a--)((r = i[a]).selected = -1 < k.inArray(k.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), k.each(["radio", "checkbox"], function() {
        k.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t)) return e.checked = -1 < k.inArray(k(e).val(), t)
            }
        }, y.checkOn || (k.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), y.focusin = "onfocusin" in C;
    var Tt = /^(?:focusinfocus|focusoutblur)$/,
        Ct = function(e) {
            e.stopPropagation()
        };
    k.extend(k.event, {
        trigger: function(e, t, n, r) {
            var i, o, a, s, u, l, c, f, p = [n || E],
                d = v.call(e, "type") ? e.type : e,
                h = v.call(e, "namespace") ? e.namespace.split(".") : [];
            if (o = f = a = n = n || E, 3 !== n.nodeType && 8 !== n.nodeType && !Tt.test(d + k.event.triggered) && (-1 < d.indexOf(".") && (d = (h = d.split(".")).shift(), h.sort()), u = d.indexOf(":") < 0 && "on" + d, (e = e[k.expando] ? e : new k.Event(d, "object" == typeof e && e)).isTrigger = r ? 2 : 3, e.namespace = h.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : k.makeArray(t, [e]), c = k.event.special[d] || {}, r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
                if (!r && !c.noBubble && !x(n)) {
                    for (s = c.delegateType || d, Tt.test(s + d) || (o = o.parentNode); o; o = o.parentNode) p.push(o), a = o;
                    a === (n.ownerDocument || E) && p.push(a.defaultView || a.parentWindow || C)
                }
                i = 0;
                while ((o = p[i++]) && !e.isPropagationStopped()) f = o, e.type = 1 < i ? s : c.bindType || d, (l = (Q.get(o, "events") || {})[e.type] && Q.get(o, "handle")) && l.apply(o, t), (l = u && o[u]) && l.apply && G(o) && (e.result = l.apply(o, t), !1 === e.result && e.preventDefault());
                return e.type = d, r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(p.pop(), t) || !G(n) || u && m(n[d]) && !x(n) && ((a = n[u]) && (n[u] = null), k.event.triggered = d, e.isPropagationStopped() && f.addEventListener(d, Ct), n[d](), e.isPropagationStopped() && f.removeEventListener(d, Ct), k.event.triggered = void 0, a && (n[u] = a)), e.result
            }
        },
        simulate: function(e, t, n) {
            var r = k.extend(new k.Event, n, {
                type: e,
                isSimulated: !0
            });
            k.event.trigger(r, null, t)
        }
    }), k.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                k.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n) return k.event.trigger(e, t, n, !0)
        }
    }), y.focusin || k.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, r) {
        var i = function(e) {
            k.event.simulate(r, e.target, k.event.fix(e))
        };
        k.event.special[r] = {
            setup: function() {
                var e = this.ownerDocument || this,
                    t = Q.access(e, r);
                t || e.addEventListener(n, i, !0), Q.access(e, r, (t || 0) + 1)
            },
            teardown: function() {
                var e = this.ownerDocument || this,
                    t = Q.access(e, r) - 1;
                t ? Q.access(e, r, t) : (e.removeEventListener(n, i, !0), Q.remove(e, r))
            }
        }
    });
    var Et = C.location,
        kt = Date.now(),
        St = /\?/;
    k.parseXML = function(e) {
        var t;
        if (!e || "string" != typeof e) return null;
        try {
            t = (new C.DOMParser).parseFromString(e, "text/xml")
        } catch (e) {
            t = void 0
        }
        return t && !t.getElementsByTagName("parsererror").length || k.error("Invalid XML: " + e), t
    };
    var At = /\[\]$/,
        Nt = /\r?\n/g,
        Dt = /^(?:submit|button|image|reset|file)$/i,
        jt = /^(?:input|select|textarea|keygen)/i;

    function qt(n, e, r, i) {
        var t;
        if (Array.isArray(e)) k.each(e, function(e, t) {
            r || At.test(n) ? i(n, t) : qt(n + "[" + ("object" == typeof t && null != t ? e : "") + "]", t, r, i)
        });
        else if (r || "object" !== w(e)) i(n, e);
        else
            for (t in e) qt(n + "[" + t + "]", e[t], r, i)
    }
    k.param = function(e, t) {
        var n, r = [],
            i = function(e, t) {
                var n = m(t) ? t() : t;
                r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
            };
        if (null == e) return "";
        if (Array.isArray(e) || e.jquery && !k.isPlainObject(e)) k.each(e, function() {
            i(this.name, this.value)
        });
        else
            for (n in e) qt(n, e[n], t, i);
        return r.join("&")
    }, k.fn.extend({
        serialize: function() {
            return k.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = k.prop(this, "elements");
                return e ? k.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !k(this).is(":disabled") && jt.test(this.nodeName) && !Dt.test(e) && (this.checked || !pe.test(e))
            }).map(function(e, t) {
                var n = k(this).val();
                return null == n ? null : Array.isArray(n) ? k.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Nt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Nt, "\r\n")
                }
            }).get()
        }
    });
    var Lt = /%20/g,
        Ht = /#.*$/,
        Ot = /([?&])_=[^&]*/,
        Pt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Rt = /^(?:GET|HEAD)$/,
        Mt = /^\/\//,
        It = {},
        Wt = {},
        $t = "*/".concat("*"),
        Ft = E.createElement("a");

    function Bt(o) {
        return function(e, t) {
            "string" != typeof e && (t = e, e = "*");
            var n, r = 0,
                i = e.toLowerCase().match(R) || [];
            if (m(t))
                while (n = i[r++]) "+" === n[0] ? (n = n.slice(1) || "*", (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t)
        }
    }

    function _t(t, i, o, a) {
        var s = {},
            u = t === Wt;

        function l(e) {
            var r;
            return s[e] = !0, k.each(t[e] || [], function(e, t) {
                var n = t(i, o, a);
                return "string" != typeof n || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n), l(n), !1)
            }), r
        }
        return l(i.dataTypes[0]) || !s["*"] && l("*")
    }

    function zt(e, t) {
        var n, r, i = k.ajaxSettings.flatOptions || {};
        for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && k.extend(!0, e, r), e
    }
    Ft.href = Et.href, k.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Et.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": $t,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": k.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? zt(zt(e, k.ajaxSettings), t) : zt(k.ajaxSettings, e)
        },
        ajaxPrefilter: Bt(It),
        ajaxTransport: Bt(Wt),
        ajax: function(e, t) {
            "object" == typeof e && (t = e, e = void 0), t = t || {};
            var c, f, p, n, d, r, h, g, i, o, v = k.ajaxSetup({}, t),
                y = v.context || v,
                m = v.context && (y.nodeType || y.jquery) ? k(y) : k.event,
                x = k.Deferred(),
                b = k.Callbacks("once memory"),
                w = v.statusCode || {},
                a = {},
                s = {},
                u = "canceled",
                T = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (h) {
                            if (!n) {
                                n = {};
                                while (t = Pt.exec(p)) n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2])
                            }
                            t = n[e.toLowerCase() + " "]
                        }
                        return null == t ? null : t.join(", ")
                    },
                    getAllResponseHeaders: function() {
                        return h ? p : null
                    },
                    setRequestHeader: function(e, t) {
                        return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e, a[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return null == h && (v.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (h) T.always(e[T.status]);
                            else
                                for (t in e) w[t] = [w[t], e[t]];
                        return this
                    },
                    abort: function(e) {
                        var t = e || u;
                        return c && c.abort(t), l(0, t), this
                    }
                };
            if (x.promise(T), v.url = ((e || v.url || Et.href) + "").replace(Mt, Et.protocol + "//"), v.type = t.method || t.type || v.method || v.type, v.dataTypes = (v.dataType || "*").toLowerCase().match(R) || [""], null == v.crossDomain) {
                r = E.createElement("a");
                try {
                    r.href = v.url, r.href = r.href, v.crossDomain = Ft.protocol + "//" + Ft.host != r.protocol + "//" + r.host
                } catch (e) {
                    v.crossDomain = !0
                }
            }
            if (v.data && v.processData && "string" != typeof v.data && (v.data = k.param(v.data, v.traditional)), _t(It, v, t, T), h) return T;
            for (i in (g = k.event && v.global) && 0 == k.active++ && k.event.trigger("ajaxStart"), v.type = v.type.toUpperCase(), v.hasContent = !Rt.test(v.type), f = v.url.replace(Ht, ""), v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Lt, "+")) : (o = v.url.slice(f.length), v.data && (v.processData || "string" == typeof v.data) && (f += (St.test(f) ? "&" : "?") + v.data, delete v.data), !1 === v.cache && (f = f.replace(Ot, "$1"), o = (St.test(f) ? "&" : "?") + "_=" + kt++ + o), v.url = f + o), v.ifModified && (k.lastModified[f] && T.setRequestHeader("If-Modified-Since", k.lastModified[f]), k.etag[f] && T.setRequestHeader("If-None-Match", k.etag[f])), (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && T.setRequestHeader("Content-Type", v.contentType), T.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + $t + "; q=0.01" : "") : v.accepts["*"]), v.headers) T.setRequestHeader(i, v.headers[i]);
            if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h)) return T.abort();
            if (u = "abort", b.add(v.complete), T.done(v.success), T.fail(v.error), c = _t(Wt, v, t, T)) {
                if (T.readyState = 1, g && m.trigger("ajaxSend", [T, v]), h) return T;
                v.async && 0 < v.timeout && (d = C.setTimeout(function() {
                    T.abort("timeout")
                }, v.timeout));
                try {
                    h = !1, c.send(a, l)
                } catch (e) {
                    if (h) throw e;
                    l(-1, e)
                }
            } else l(-1, "No Transport");

            function l(e, t, n, r) {
                var i, o, a, s, u, l = t;
                h || (h = !0, d && C.clearTimeout(d), c = void 0, p = r || "", T.readyState = 0 < e ? 4 : 0, i = 200 <= e && e < 300 || 304 === e, n && (s = function(e, t, n) {
                    var r, i, o, a, s = e.contents,
                        u = e.dataTypes;
                    while ("*" === u[0]) u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break
                            } if (u[0] in n) o = u[0];
                    else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + " " + u[0]]) {
                                o = i;
                                break
                            }
                            a || (a = i)
                        }
                        o = o || a
                    }
                    if (o) return o !== u[0] && u.unshift(o), n[o]
                }(v, T, n)), s = function(e, t, n, r) {
                    var i, o, a, s, u, l = {},
                        c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
                    o = c.shift();
                    while (o)
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift())
                            if ("*" === o) o = u;
                            else if ("*" !== u && u !== o) {
                        if (!(a = l[u + " " + o] || l["* " + o]))
                            for (i in l)
                                if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                    !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0], c.unshift(s[1]));
                                    break
                                } if (!0 !== a)
                            if (a && e["throws"]) t = a(t);
                            else try {
                                t = a(t)
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: a ? e : "No conversion from " + u + " to " + o
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: t
                    }
                }(v, s, T, i), i ? (v.ifModified && ((u = T.getResponseHeader("Last-Modified")) && (k.lastModified[f] = u), (u = T.getResponseHeader("etag")) && (k.etag[f] = u)), 204 === e || "HEAD" === v.type ? l = "nocontent" : 304 === e ? l = "notmodified" : (l = s.state, o = s.data, i = !(a = s.error))) : (a = l, !e && l || (l = "error", e < 0 && (e = 0))), T.status = e, T.statusText = (t || l) + "", i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]), T.statusCode(w), w = void 0, g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]), b.fireWith(y, [T, l]), g && (m.trigger("ajaxComplete", [T, v]), --k.active || k.event.trigger("ajaxStop")))
            }
            return T
        },
        getJSON: function(e, t, n) {
            return k.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return k.get(e, void 0, t, "script")
        }
    }), k.each(["get", "post"], function(e, i) {
        k[i] = function(e, t, n, r) {
            return m(t) && (r = r || n, n = t, t = void 0), k.ajax(k.extend({
                url: e,
                type: i,
                dataType: r,
                data: t,
                success: n
            }, k.isPlainObject(e) && e))
        }
    }), k._evalUrl = function(e, t) {
        return k.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                k.globalEval(e, t)
            }
        })
    }, k.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (m(e) && (e = e.call(this[0])), t = k(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                var e = this;
                while (e.firstElementChild) e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function(n) {
            return m(n) ? this.each(function(e) {
                k(this).wrapInner(n.call(this, e))
            }) : this.each(function() {
                var e = k(this),
                    t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n)
            })
        },
        wrap: function(t) {
            var n = m(t);
            return this.each(function(e) {
                k(this).wrapAll(n ? t.call(this, e) : t)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                k(this).replaceWith(this.childNodes)
            }), this
        }
    }), k.expr.pseudos.hidden = function(e) {
        return !k.expr.pseudos.visible(e)
    }, k.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, k.ajaxSettings.xhr = function() {
        try {
            return new C.XMLHttpRequest
        } catch (e) {}
    };
    var Ut = {
            0: 200,
            1223: 204
        },
        Xt = k.ajaxSettings.xhr();
    y.cors = !!Xt && "withCredentials" in Xt, y.ajax = Xt = !!Xt, k.ajaxTransport(function(i) {
        var o, a;
        if (y.cors || Xt && !i.crossDomain) return {
            send: function(e, t) {
                var n, r = i.xhr();
                if (r.open(i.type, i.url, i.async, i.username, i.password), i.xhrFields)
                    for (n in i.xhrFields) r[n] = i.xhrFields[n];
                for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType), i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e) r.setRequestHeader(n, e[n]);
                o = function(e) {
                    return function() {
                        o && (o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null, "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Ut[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
                            binary: r.response
                        } : {
                            text: r.responseText
                        }, r.getAllResponseHeaders()))
                    }
                }, r.onload = o(), a = r.onerror = r.ontimeout = o("error"), void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function() {
                    4 === r.readyState && C.setTimeout(function() {
                        o && a()
                    })
                }, o = o("abort");
                try {
                    r.send(i.hasContent && i.data || null)
                } catch (e) {
                    if (o) throw e
                }
            },
            abort: function() {
                o && o()
            }
        }
    }), k.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }), k.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return k.globalEval(e), e
            }
        }
    }), k.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), k.ajaxTransport("script", function(n) {
        var r, i;
        if (n.crossDomain || n.scriptAttrs) return {
            send: function(e, t) {
                r = k("<script>").attr(n.scriptAttrs || {}).prop({
                    charset: n.scriptCharset,
                    src: n.url
                }).on("load error", i = function(e) {
                    r.remove(), i = null, e && t("error" === e.type ? 404 : 200, e.type)
                }), E.head.appendChild(r[0])
            },
            abort: function() {
                i && i()
            }
        }
    });
    var Vt, Gt = [],
        Yt = /(=)\?(?=&|$)|\?\?/;
    k.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Gt.pop() || k.expando + "_" + kt++;
            return this[e] = !0, e
        }
    }), k.ajaxPrefilter("json jsonp", function(e, t, n) {
        var r, i, o, a = !1 !== e.jsonp && (Yt.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Yt.test(e.data) && "data");
        if (a || "jsonp" === e.dataTypes[0]) return r = e.jsonpCallback = m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Yt, "$1" + r) : !1 !== e.jsonp && (e.url += (St.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function() {
            return o || k.error(r + " was not called"), o[0]
        }, e.dataTypes[0] = "json", i = C[r], C[r] = function() {
            o = arguments
        }, n.always(function() {
            void 0 === i ? k(C).removeProp(r) : C[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, Gt.push(r)), o && m(i) && i(o[0]), o = i = void 0
        }), "script"
    }), y.createHTMLDocument = ((Vt = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === Vt.childNodes.length), k.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (y.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href, t.head.appendChild(r)) : t = E), o = !n && [], (i = D.exec(e)) ? [t.createElement(i[1])] : (i = we([e], t, o), o && o.length && k(o).remove(), k.merge([], i.childNodes)));
        var r, i, o
    }, k.fn.load = function(e, t, n) {
        var r, i, o, a = this,
            s = e.indexOf(" ");
        return -1 < s && (r = mt(e.slice(s)), e = e.slice(0, s)), m(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), 0 < a.length && k.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments, a.html(r ? k("<div>").append(k.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, k.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        k.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), k.expr.pseudos.animated = function(t) {
        return k.grep(k.timers, function(e) {
            return t === e.elem
        }).length
    }, k.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, u, l = k.css(e, "position"),
                c = k(e),
                f = {};
            "static" === l && (e.style.position = "relative"), s = c.offset(), o = k.css(e, "top"), u = k.css(e, "left"), ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(u) || 0), m(t) && (t = t.call(e, n, k.extend({}, s))), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : c.css(f)
        }
    }, k.fn.extend({
        offset: function(t) {
            if (arguments.length) return void 0 === t ? this : this.each(function(e) {
                k.offset.setOffset(this, t, e)
            });
            var e, n, r = this[0];
            return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
                top: e.top + n.pageYOffset,
                left: e.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0],
                    i = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === k.css(r, "position")) t = r.getBoundingClientRect();
                else {
                    t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement;
                    while (e && (e === n.body || e === n.documentElement) && "static" === k.css(e, "position")) e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = k(e).offset()).top += k.css(e, "borderTopWidth", !0), i.left += k.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - k.css(r, "marginTop", !0),
                    left: t.left - i.left - k.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var e = this.offsetParent;
                while (e && "static" === k.css(e, "position")) e = e.offsetParent;
                return e || ie
            })
        }
    }), k.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(t, i) {
        var o = "pageYOffset" === i;
        k.fn[t] = function(e) {
            return _(this, function(e, t, n) {
                var r;
                if (x(e) ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === n) return r ? r[i] : e[t];
                r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n
            }, t, e, arguments.length)
        }
    }), k.each(["top", "left"], function(e, n) {
        k.cssHooks[n] = ze(y.pixelPosition, function(e, t) {
            if (t) return t = _e(e, n), $e.test(t) ? k(e).position()[n] + "px" : t
        })
    }), k.each({
        Height: "height",
        Width: "width"
    }, function(a, s) {
        k.each({
            padding: "inner" + a,
            content: s,
            "": "outer" + a
        }, function(r, o) {
            k.fn[o] = function(e, t) {
                var n = arguments.length && (r || "boolean" != typeof e),
                    i = r || (!0 === e || !0 === t ? "margin" : "border");
                return _(this, function(e, t, n) {
                    var r;
                    return x(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement, Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? k.css(e, t, i) : k.style(e, t, n, i)
                }, s, n ? e : void 0, n)
            }
        })
    }), k.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, n) {
        k.fn[n] = function(e, t) {
            return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n)
        }
    }), k.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), k.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), k.proxy = function(e, t) {
        var n, r, i;
        if ("string" == typeof t && (n = e[t], t = e, e = n), m(e)) return r = s.call(arguments, 2), (i = function() {
            return e.apply(t || this, r.concat(s.call(arguments)))
        }).guid = e.guid = e.guid || k.guid++, i
    }, k.holdReady = function(e) {
        e ? k.readyWait++ : k.ready(!0)
    }, k.isArray = Array.isArray, k.parseJSON = JSON.parse, k.nodeName = N, k.isFunction = m, k.isWindow = x, k.camelCase = V, k.type = w, k.now = Date.now, k.isNumeric = function(e) {
        var t = k.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }, "function" == typeof define && define.amd && define("jquery", [], function() {
        return k
    });
    var Qt = C.jQuery,
        Jt = C.$;
    return k.noConflict = function(e) {
        return C.$ === k && (C.$ = Jt), e && C.jQuery === k && (C.jQuery = Qt), k
    }, e || (C.jQuery = C.$ = k), k
});




































    /**
 * turn.js 3rd release
 * www.turnjs.com
 *
 * Copyright (C) 2012, Emmanuel Garcia.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Any redistribution, use, or modification is done solely for personal 
 * benefit and not for any commercial purpose or for monetary gain.
 * 
 **/

(function($) {

    'use strict';
    
    var has3d,
    
        vendor ='',
    
        PI = Math.PI,
    
        A90 = PI/2,
    
        isTouch = 'ontouchstart' in window,
    
        events = (isTouch) ? {start: 'touchstart', move: 'touchmove', end: 'touchend'}
                : {start: 'mousedown', move: 'mousemove', end: 'mouseup'},
    
        // Contansts used for each corner
        // tl * tr
        // *     *
        // bl * br
    
        corners = {
            backward: ['bl', 'tl'],
            forward: ['br', 'tr'],
            all: ['tl', 'bl', 'tr', 'br']
        },
    
        displays = ['single', 'double'],
    
        // Default options
    
        turnOptions = {
    
            // First page
    
            page: 1,
            
            // Enables gradients
    
            gradients: true,
    
            // Duration of transition in milliseconds
    
            duration: 600,
    
            // Enables hardware acceleration
    
            acceleration: true,
    
            // Display
    
            display: 'double',
    
            // Events
    
            when: null
        },
    
        flipOptions = {
    
            // Back page
            
            folding: null,
    
            // Corners
            // backward: Activates both tl and bl corners
            // forward: Activates both tr and br corners
            // all: Activates all the corners
    
            corners: 'forward',
            
            // Size of the active zone of each corner
    
            cornerSize: 100,
    
            // Enables gradients
    
            gradients: true,
    
            // Duration of transition in milliseconds
    
            duration: 600,
    
            // Enables hardware acceleration
    
            acceleration: true
        },
    
        // Number of pages in the DOM, minimum value: 6
    
        pagesInDOM = 6,
        
        pagePosition = {0: {top: 0, left: 0, right: 'auto', bottom: 'auto'},
                        1: {top: 0, right: 0, left: 'auto', bottom: 'auto'}},
    
        // Gets basic attributes for a layer
    
        divAtt = function(top, left, zIndex, overf) {
            return {'css': {
                        position: 'absolute',
                        top: top,
                        left: left,
                        'overflow': overf || 'hidden',
                        'z-index': zIndex || 'auto'
                        }
                };
        },
    
        // Gets a 2D point from a bezier curve of four points
    
        bezier = function(p1, p2, p3, p4, t) {
            var mum1 = 1 - t,
                mum13 = mum1 * mum1 * mum1,
                mu3 = t * t * t;
    
            return point2D(Math.round(mum13*p1.x + 3*t*mum1*mum1*p2.x + 3*t*t*mum1*p3.x + mu3*p4.x),
                            Math.round(mum13*p1.y + 3*t*mum1*mum1*p2.y + 3*t*t*mum1*p3.y + mu3*p4.y));
        },
        
        // Converts an angle from degrees to radians
    
        rad = function(degrees) {
            return degrees/180*PI;
        },
    
        // Converts an angle from radians to degrees
    
        deg = function(radians) {
            return radians/PI*180;
        },
    
        // Gets a 2D point
    
        point2D = function(x, y) {
            return {x: x, y: y};
        },
    
        // Returns the traslate value
    
        translate = function(x, y, use3d) {
            return (has3d && use3d) ? ' translate3d(' + x + 'px,' + y + 'px, 0px) ' : ' translate(' + x + 'px, ' + y + 'px) ';
        },
    
        // Returns the rotation value
    
        rotate = function(degrees) {
            return ' rotate(' + degrees + 'deg) ';
        },
    
        // Checks if a property belongs to an object
    
        has = function(property, object) {
            return Object.prototype.hasOwnProperty.call(object, property);
        },
    
        // Gets the CSS3 vendor prefix
    
        getPrefix = function() {
            var vendorPrefixes = ['Moz','Webkit','Khtml','O','ms'],
                len = vendorPrefixes.length,
                vendor = '';
    
            while (len--)
                if ((vendorPrefixes[len] + 'Transform') in document.body.style)
                    vendor='-'+vendorPrefixes[len].toLowerCase()+'-';
    
            return vendor;
        },
    
        // Adds gradients
    
        gradient = function(obj, p0, p1, colors, numColors) {
        
            var j, cols = [];
    
            if (vendor=='-webkit-') {
            
                for (j = 0; j<numColors; j++)
                        cols.push('color-stop('+colors[j][0]+', '+colors[j][1]+')');
                
                obj.css({'background-image': '-webkit-gradient(linear, '+p0.x+'% '+p0.y+'%,  '+p1.x+'% '+p1.y+'%, '+ cols.join(',') +' )'});
    
            } else {
    
                // This procedure makes the gradients for non-webkit browsers
                // It will be reduced to one unique way for gradients in next versions
                
                p0 = {x:p0.x/100 * obj.width(), y:p0.y/100 * obj.height()};
                p1 = {x:p1.x/100 * obj.width(), y:p1.y/100 * obj.height()};
    
                var dx = p1.x-p0.x,
                    dy = p1.y-p0.y,
                    angle = Math.atan2(dy, dx),
                    angle2 = angle - Math.PI/2,
                    diagonal = Math.abs(obj.width()*Math.sin(angle2)) + Math.abs(obj.height()*Math.cos(angle2)),
                    gradientDiagonal = Math.sqrt(dy*dy + dx*dx),
                    corner = point2D((p1.x<p0.x) ? obj.width() : 0, (p1.y<p0.y) ? obj.height() : 0),
                    slope = Math.tan(angle),
                    inverse = -1/slope,
                    x = (inverse*corner.x - corner.y - slope*p0.x + p0.y) / (inverse-slope),
                    c = {x: x, y: inverse*x - inverse*corner.x + corner.y},
                    segA = (Math.sqrt( Math.pow(c.x-p0.x,2) + Math.pow(c.y-p0.y,2)));
    
                    for (j = 0; j<numColors; j++)
                        cols.push(' '+colors[j][1]+' '+(( segA + gradientDiagonal*colors[j][0] )*100/diagonal)+'%');
            
                    obj.css({'background-image': vendor+'linear-gradient(' + (-angle) + 'rad,' + cols.join(',') + ')'});
            }
        },
    
    turnMethods = {
    
        // Singleton constructor
        // $('#selector').turn([options]);
    
        init: function(opts) {
    
            // Define constants
            if (has3d===undefined) {
                has3d = 'WebKitCSSMatrix' in window || 'MozPerspective' in document.body.style;
                vendor = getPrefix();
            }
    
            var i, data = this.data(), ch = this.children();
        
            opts = $.extend({width: this.width(), height: this.height()}, turnOptions, opts);
            data.opts = opts;
            data.pageObjs = {};
            data.pages = {};
            data.pageWrap = {};
            data.pagePlace = {};
            data.pageMv = [];
            data.totalPages = opts.pages || 0;
    
            if (opts.when)
                for (i in opts.when)
                    if (has(i, opts.when))
                        this.bind(i, opts.when[i]);
    
    
            this.css({position: 'relative', width: opts.width, height: opts.height});
    
            this.turn('display', opts.display);
    
            if (has3d && !isTouch && opts.acceleration)
                this.transform(translate(0, 0, true));
        
            for (i = 0; i<ch.length; i++)
                this.turn('addPage', ch[i], i+1);
        
            this.turn('page', opts.page);
    
            // allow setting active corners as an option
            corners = $.extend({}, corners, opts.corners);
    
            // Event listeners
    
            $(this).bind(events.start, function(e) {
                for (var page in data.pages)
                    if (has(page, data.pages) && flipMethods._eventStart.call(data.pages[page], e)===false)
                        return false;
            });
                
            $(document).bind(events.move, function(e) {
                for (var page in data.pages)
                    if (has(page, data.pages))
                        flipMethods._eventMove.call(data.pages[page], e);
            }).
            bind(events.end, function(e) {
                for (var page in data.pages)
                    if (has(page, data.pages))
                        flipMethods._eventEnd.call(data.pages[page], e);
    
            });
    
            data.done = true;
    
            return this;
        },
    
        // Adds a page from external data
    
        addPage: function(element, page) {
    
            var incPages = false,
                data = this.data(),
                lastPage = data.totalPages+1;
    
            if (page) {
                if (page==lastPage) {
                    page = lastPage;
                    incPages = true;
                } else if (page>lastPage)
                    throw new Error ('It is impossible to add the page "'+page+'", the maximum value is: "'+lastPage+'"');
    
            } else {
                page = lastPage;
                incPages = true;
            }
    
            if (page>=1 && page<=lastPage) {
    
                // Stop animations
                if (data.done) this.turn('stop');
    
                // Move pages if it's necessary
                if (page in data.pageObjs)
                    turnMethods._movePages.call(this, page, 1);
    
                // Update number of pages
                if (incPages)
                    data.totalPages = lastPage;
    
                // Add element
                data.pageObjs[page] = $(element).addClass('turn-page p' + page);
    
                // Add page
                turnMethods._addPage.call(this, page);
    
                // Update view
                if (data.done)
                    this.turn('update');
    
                turnMethods._removeFromDOM.call(this);
            }
    
            return this;
        },
    
        // Adds a page from internal data
    
        _addPage: function(page) {
            
            var data = this.data(),
                element = data.pageObjs[page];
    
            if (element)
                if (turnMethods._necessPage.call(this, page)) {
                    
                    if (!data.pageWrap[page]) {
    
                        var pageWidth = (data.display=='double') ? this.width()/2 : this.width(),
                            pageHeight = this.height();
    
                        element.css({width:pageWidth, height:pageHeight});
    
                        // Place
                        data.pagePlace[page] = page;
    
                        // Wrapper
                        data.pageWrap[page] = $('<div/>', {'class': 'turn-page-wrapper',
                                                        page: page,
                                                        css: {position: 'absolute',
                                                        overflow: 'hidden',
                                                        width: pageWidth,
                                                        height: pageHeight}}).
                                                        css(pagePosition[(data.display=='double') ? page%2 : 0]);
    
                        // Append to this
                        this.append(data.pageWrap[page]);
    
                        // Move data.pageObjs[page] (element) to wrapper
                        data.pageWrap[page].prepend(data.pageObjs[page]);
                    }
    
                    // If the page is in the current view, create the flip effect
                    if (!page || turnMethods._setPageLoc.call(this, page)==1)
                        turnMethods._makeFlip.call(this, page);
                    
                } else {
    
                    // Place
                    data.pagePlace[page] = 0;
    
                    // Remove element from the DOM
                    if (data.pageObjs[page])
                        data.pageObjs[page].remove();
    
                }
    
        },
    
        // Checks if a page is in memory
        
        hasPage: function(page) {
    
            return page in this.data().pageObjs;
        
        },
    
        // Prepares the flip effect for a page
    
        _makeFlip: function(page) {
    
            var data = this.data();
    
            if (!data.pages[page] && data.pagePlace[page]==page) {
    
                var single = data.display=='single',
                    even = page%2;
                
                data.pages[page] = data.pageObjs[page].
                                    css({width: (single) ? this.width() : this.width()/2, height: this.height()}).
                                    flip({page: page,
                                        next: (single && page === data.totalPages) ? page -1 : ((even || single) ? page+1 : page-1),
                                        turn: this,
                                        duration: data.opts.duration,
                                        acceleration : data.opts.acceleration,
                                        corners: (single) ? 'all' : ((even) ? 'forward' : 'backward'),
                                        backGradient: data.opts.gradients,
                                        frontGradient: data.opts.gradients
                                        }).
                                        flip('disable', data.disabled).
                                        bind('pressed', turnMethods._pressed).
                                        bind('released', turnMethods._released).
                                        bind('start', turnMethods._start).
                                        bind('end', turnMethods._end).
                                        bind('flip', turnMethods._flip);
            }
            return data.pages[page];
        },
    
        // Makes pages within a range
    
        _makeRange: function() {
    
            var page,
                data = this.data(),
                range = this.turn('range');
    
                for (page = range[0]; page<=range[1]; page++)
                    turnMethods._addPage.call(this, page);
    
        },
    
        // Returns a range of `pagesInDOM` pages that should be in the DOM
        // Example:
        // - page of the current view, return true
        // * page is in the range, return true
        // 0 page is not in the range, return false
        //
        // 1 2-3 4-5 6-7 8-9 10-11 12-13
        //    **  **  --   **  **
    
        range: function(page) {
    
            var remainingPages, left, right,
                data = this.data();
                page = page || data.tpage || data.page;
                var view = turnMethods._view.call(this, page);
    
                if (page<1 || page>data.totalPages)
                    throw new Error ('"'+page+'" is not a page for range');
            
                view[1] = view[1] || view[0];
                
                if (view[0]>=1 && view[1]<=data.totalPages) {
    
                    remainingPages = Math.floor((pagesInDOM-2)/2);
    
                    if (data.totalPages-view[1] > view[0]) {
                        left = Math.min(view[0]-1, remainingPages);
                        right = 2*remainingPages-left;
                    } else {
                        right = Math.min(data.totalPages-view[1], remainingPages);
                        left = 2*remainingPages-right;
                    }
    
                } else {
                    left = pagesInDOM-1;
                    right = pagesInDOM-1;
                }
    
                return [Math.max(1, view[0]-left), Math.min(data.totalPages, view[1]+right)];
    
        },
    
        // Detects if a page is within the range of `pagesInDOM` from the current view
    
        _necessPage: function(page) {
            
            if (page===0)
                return true;
    
            var range = this.turn('range');
    
            return page>=range[0] && page<=range[1];
            
        },
    
        // Releases memory by removing pages from the DOM
    
        _removeFromDOM: function() {
    
            var page, data = this.data();
    
            for (page in data.pageWrap)
                if (has(page, data.pageWrap) && !turnMethods._necessPage.call(this, page))
                    turnMethods._removePageFromDOM.call(this, page);
            
    
        },
    
        // Removes a page from DOM and its internal references
    
        _removePageFromDOM: function(page) {
    
            var data = this.data();
    
            if (data.pages[page]) {
                var dd = data.pages[page].data();
                if (dd.f && dd.f.fwrapper)
                    dd.f.fwrapper.remove();
                data.pages[page].remove();
                delete data.pages[page];
            }
    
            if (data.pageObjs[page])
                data.pageObjs[page].remove();
    
            if (data.pageWrap[page]) {
                data.pageWrap[page].remove();
                delete data.pageWrap[page];
            }
    
            delete data.pagePlace[page];
    
        },
    
        // Removes a page
    
        removePage: function(page) {
    
            var data = this.data();
    
            if (data.pageObjs[page]) {
                // Stop animations
                this.turn('stop');
    
                // Remove `page`
                turnMethods._removePageFromDOM.call(this, page);
                delete data.pageObjs[page];
    
                // Move the pages behind `page`
                turnMethods._movePages.call(this, page, -1);
    
                // Resize the size of this magazine
                data.totalPages = data.totalPages-1;
                turnMethods._makeRange.call(this);
    
                // Check the current view
                if (data.page>data.totalPages)
                    this.turn('page', data.totalPages);
            }
    
            return this;
        
        },
    
        // Moves pages
    
        _movePages: function(from, change) {
    
            var page,
                data = this.data(),
                single = data.display=='single',
                move = function(page) {
    
                    var next = page + change,
                        odd = next%2;
    
                    if (data.pageObjs[page])
                        data.pageObjs[next] = data.pageObjs[page].removeClass('page' + page).addClass('page' + next);
    
                    if (data.pagePlace[page] && data.pageWrap[page]) {
                        data.pagePlace[next] = next;
                        data.pageWrap[next] = data.pageWrap[page].css(pagePosition[(single) ? 0 : odd]).attr('page', next);
                        
                        if (data.pages[page])
                            data.pages[next] = data.pages[page].flip('options', {
                                page: next,
                                next: (single || odd) ? next+1 : next-1,
                                corners: (single) ? 'all' : ((odd) ? 'forward' : 'backward')
                            });
    
                        if (change) {
                            delete data.pages[page];
                            delete data.pagePlace[page];
                            delete data.pageObjs[page];
                            delete data.pageWrap[page];
                            delete data.pageObjs[page];
                        }
                }
            };
    
            if (change>0)
                for (page=data.totalPages; page>=from; page--) move(page);
            else
                for (page=from; page<=data.totalPages; page++) move(page);
    
        },
    
        // Sets or Gets the display mode
    
        display: function(display) {
    
            var data = this.data(),
                currentDisplay = data.display;
    
            if (display) {
    
                if ($.inArray(display, displays)==-1)
                    throw new Error ('"'+display + '" is not a value for display');
                
                if (display=='single') {
                    if (!data.pageObjs[0]) {
                        this.turn('stop').
                            css({'overflow': 'hidden'});
                        data.pageObjs[0] = $('<div />', {'class': 'turn-page p-temporal'}).
                                        css({width: this.width(), height: this.height()}).
                                            appendTo(this);
                    }
                } else {
                    if (data.pageObjs[0]) {
                        this.turn('stop').
                            css({'overflow': ''});
                        data.pageObjs[0].remove();
                        delete data.pageObjs[0];
                    }
                }
    
                data.display = display;
    
                if (currentDisplay) {
                    var size = this.turn('size');
                    turnMethods._movePages.call(this, 1, 0);
                    this.turn('size', size.width, size.height).
                            turn('update');
                }
    
                return this;
    
            } else
                return currentDisplay;
        
        },
    
        // Detects if the pages are being animated
    
        animating: function() {
    
            return this.data().pageMv.length>0;
    
        },
    
        // Disables and enables the effect
    
        disable: function(bool) {
    
            var page,
                data = this.data(),
                view = this.turn('view');
    
                data.disabled = bool===undefined || bool===true;
    
            for (page in data.pages)
                if (has(page, data.pages))
                    data.pages[page].flip('disable', bool ? $.inArray(page, view) : false );
    
            return this;
    
        },
    
        // Gets and sets the size
    
        size: function(width, height) {
    
            if (width && height) {
    
                var data = this.data(), pageWidth = (data.display=='double') ? width/2 : width, page;
    
                this.css({width: width, height: height});
    
                if (data.pageObjs[0])
                    data.pageObjs[0].css({width: pageWidth, height: height});
                
                for (page in data.pageWrap) {
                    if (!has(page, data.pageWrap)) continue;
                    data.pageObjs[page].css({width: pageWidth, height: height});
                    data.pageWrap[page].css({width: pageWidth, height: height});
                    if (data.pages[page])
                        data.pages[page].css({width: pageWidth, height: height});
                }
    
                this.turn('resize');
    
                return this;
    
            } else {
                
                return {width: this.width(), height: this.height()};
    
            }
        },
    
        // Resizes each page
    
        resize: function() {
    
            var page, data = this.data();
    
            if (data.pages[0]) {
                data.pageWrap[0].css({left: -this.width()});
                data.pages[0].flip('resize', true);
            }
    
            for (page = 1; page <= data.totalPages; page++)
                if (data.pages[page])
                    data.pages[page].flip('resize', true);
    
    
        },
    
        // Removes an animation from the cache
    
        _removeMv: function(page) {
    
            var i, data = this.data();
                
            for (i=0; i<data.pageMv.length; i++)
                if (data.pageMv[i]==page) {
                    data.pageMv.splice(i, 1);
                    return true;
                }
    
            return false;
    
        },
    
        // Adds an animation to the cache
        
        _addMv: function(page) {
    
            var data = this.data();
    
            turnMethods._removeMv.call(this, page);
            data.pageMv.push(page);
    
        },
    
        // Gets indexes for a view
    
        _view: function(page) {
        
            var data = this.data();
            page = page || data.page;
    
            if (data.display=='double')
                return (page%2) ? [page-1, page] : [page, page+1];
            else
                return [page];
    
        },
    
        // Gets a view
    
        view: function(page) {
    
            var data = this.data(), view = turnMethods._view.call(this, page);
    
            return (data.display=='double') ? [(view[0]>0) ? view[0] : 0, (view[1]<=data.totalPages) ? view[1] : 0]
                    : [(view[0]>0 && view[0]<=data.totalPages) ? view[0] : 0];
    
        },
    
        // Stops animations
    
        stop: function(ok) {
    
            var i, opts, data = this.data(), pages = data.pageMv;
    
            data.pageMv = [];
    
            if (data.tpage) {
                data.page = data.tpage;
                delete data['tpage'];
            }
    
            for (i in pages) {
                if (!has(i, pages)) continue;
                opts = data.pages[pages[i]].data().f.opts;
                flipMethods._moveFoldingPage.call(data.pages[pages[i]], null);
                data.pages[pages[i]].flip('hideFoldedPage');
                data.pagePlace[opts.next] = opts.next;
                
                if (opts.force) {
                    opts.next = (opts.page%2===0) ? opts.page-1 : opts.page+1;
                    delete opts['force'];
                }
    
            }
    
            this.turn('update');
    
            return this;
        },
    
        // Gets and sets the number of pages
    
        pages: function(pages) {
    
            var data = this.data();
    
            if (pages) {
                if (pages<data.totalPages) {
    
                    for (var page = pages+1; page<=data.totalPages; page++)
                        this.turn('removePage', page);
    
                    if (this.turn('page')>pages)
                        this.turn('page', pages);
                }
    
                data.totalPages = pages;
    
                return this;
            } else
                return data.totalPages;
    
        },
    
        // Sets a page without effect
    
        _fitPage: function(page, ok) {
            
            var data = this.data(), newView = this.turn('view', page);
            
            if (data.page!=page) {
                this.trigger('turning', [page, newView]);
                if ($.inArray(1, newView)!=-1) this.trigger('first');
                if ($.inArray(data.totalPages, newView)!=-1) this.trigger('last');
            }
    
            if (!data.pageObjs[page])
                return;
    
            data.tpage = page;
    
            this.turn('stop', ok);
            turnMethods._removeFromDOM.call(this);
            turnMethods._makeRange.call(this);
            this.trigger('turned', [page, newView]);
    
        },
        
        // Turns to a page
    
        _turnPage: function(page) {
    
            var current, next,
                data = this.data(),
                view = this.turn('view'),
                newView = this.turn('view', page);
        
            if (data.page!=page) {
                this.trigger('turning', [page, newView]);
                if ($.inArray(1, newView)!=-1) this.trigger('first');
                if ($.inArray(data.totalPages, newView)!=-1) this.trigger('last');
            }
    
            if (!data.pageObjs[page])
                return;
    
            data.tpage = page;
    
            this.turn('stop');
    
            turnMethods._makeRange.call(this);
    
            if (data.display=='single') {
                current = view[0];
                next = newView[0];
            } else if (view[1] && page>view[1]) {
                current = view[1];
                next = newView[0];
            } else if (view[0] && page<view[0]) {
                current = view[0];
                next = newView[1];
            }
    
            if (data.pages[current]) {
    
                var opts = data.pages[current].data().f.opts;
                data.tpage = next;
                
                if (opts.next!=next) {
                    opts.next = next;
                    data.pagePlace[next] = opts.page;
                    opts.force = true;
                }
    
                if (data.display=='single')
                    data.pages[current].flip('turnPage', (newView[0] > view[0]) ? 'br' : 'bl');
                else
                    data.pages[current].flip('turnPage');
            }
    
        },
    
        // Gets and sets a page
    
        page: function(page) {
    
            page = parseInt(page, 10);
    
            var data = this.data();
    
            if (page>0 && page<=data.totalPages) {
                if (!data.done || $.inArray(page, this.turn('view'))!=-1)
                    turnMethods._fitPage.call(this, page);
                else
                    turnMethods._turnPage.call(this, page);
            
                return this;
    
            } else
                return data.page;
        
        },
    
        // Turns to the next view
    
        next: function() {
    
            var data = this.data();
            return this.turn('page', turnMethods._view.call(this, data.page).pop() + 1);
        
        },
    
        // Turns to the previous view
    
        previous: function() {
            
            var data = this.data();
            return this.turn('page', turnMethods._view.call(this, data.page).shift() - 1);
    
        },
    
        // Adds a motion to the internal list
    
        _addMotionPage: function() {
    
            var opts = $(this).data().f.opts,
                turn = opts.turn,
                dd = turn.data();
    
            opts.pageMv = opts.page;
            turnMethods._addMv.call(turn, opts.pageMv);
            dd.pagePlace[opts.next] = opts.page;
            turn.turn('update');
    
        },
    
        // This event is called in context of flip
    
        _start: function(e, opts, corner) {
    
                var data = opts.turn.data(),
                    event = $.Event('start');
    
                e.stopPropagation();
    
                opts.turn.trigger(event, [opts, corner]);
    
                if (event.isDefaultPrevented()) {
                    e.preventDefault();
                    return;
                }
            
            if (data.display=='single') {
    
                var left = corner.charAt(1)=='l';
                if ((opts.page==1 && left) || (opts.page==data.totalPages && !left))
                    e.preventDefault();
                else {
                    if (left) {
                        opts.next = (opts.next<opts.page) ? opts.next : opts.page-1;
                        opts.force = true;
                    } else
                        opts.next = (opts.next>opts.page) ? opts.next : opts.page+1;
                }
    
            }
    
            turnMethods._addMotionPage.call(this);
        },
    
        // This event is called in context of flip
    
        _end: function(e, turned) {
            
            var that = $(this),
                data = that.data().f,
                opts = data.opts,
                turn = opts.turn,
                dd = turn.data();
    
            e.stopPropagation();
    
            if (turned || dd.tpage) {
    
                if (dd.tpage==opts.next || dd.tpage==opts.page) {
                    delete dd['tpage'];
                    turnMethods._fitPage.call(turn, dd.tpage || opts.next, true);
                }
    
            } else {
                //turnMethods._removeMv.call(turn, opts.pageMv);
                turn.turn('update');
            }
            
        },
        
        // This event is called in context of flip
    
        _pressed: function() {
    
            var page,
                that = $(this),
                data = that.data().f,
                turn = data.opts.turn,
                pages = turn.data().pages;
        
            for (page in pages)
                if (page!=data.opts.page)
                    pages[page].flip('disable', true);
    
            return data.time = new Date().getTime();
    
        },
    
        // This event is called in context of flip
    
        _released: function(e, point) {
            
            var that = $(this),
                data = that.data().f;
    
                e.stopPropagation();
    
            if ((new Date().getTime())-data.time<200 || point.x<0 || point.x>$(this).width()) {
                e.preventDefault();
                data.opts.turn.data().tpage = data.opts.next;
                data.opts.turn.turn('update');
                $(that).flip('turnPage');
            }
    
        },
    
        // This event is called in context of flip
        
        _flip: function() {
    
            var opts = $(this).data().f.opts;
    
            opts.turn.trigger('turn', [opts.next]);
    
        },
    
        // Calculate the z-index value for pages during the animation
    
        calculateZ: function(mv) {
    
            var i, page, nextPage, placePage, dpage,
                that = this,
                data = this.data(),
                view = this.turn('view'),
                currentPage = view[0] || view[1],
                r = {pageZ: {}, partZ: {}, pageV: {}},
    
                addView = function(page) {
                    var view = that.turn('view', page);
                    if (view[0]) r.pageV[view[0]] = true;
                    if (view[1]) r.pageV[view[1]] = true;
                };
            
                for (i = 0; i<mv.length; i++) {
                    page = mv[i];
                    nextPage = data.pages[page].data().f.opts.next;
                    placePage = data.pagePlace[page];
                    addView(page);
                    addView(nextPage);
                    dpage = (data.pagePlace[nextPage]==nextPage) ? nextPage : page;
                    r.pageZ[dpage] = data.totalPages - Math.abs(currentPage-dpage);
                    r.partZ[placePage] = data.totalPages*2 + Math.abs(currentPage-dpage);
                }
    
            return r;
        },
    
        // Updates the z-index and display property of every page
    
        update: function() {
    
            var page,
                data = this.data();
    
            if (data.pageMv.length && data.pageMv[0]!==0) {
    
                // Update motion
    
                var apage,
                    pos = this.turn('calculateZ', data.pageMv),
                    view = this.turn('view', data.tpage);
            
                if (data.pagePlace[view[0]]==view[0]) apage = view[0];
                else if (data.pagePlace[view[1]]==view[1]) apage = view[1];
            
                for (page in data.pageWrap) {
    
                    if (!has(page, data.pageWrap)) continue;
    
                    data.pageWrap[page].css({display: (pos.pageV[page]) ? '' : 'none', 'z-index': pos.pageZ[page] || 0});
    
                    if (data.pages[page]) {
                        data.pages[page].flip('z', pos.partZ[page] || null);
    
                        if (pos.pageV[page])
                            data.pages[page].flip('resize');
    
                        if (data.tpage)
                            data.pages[page].flip('disable', true); // data.disabled || page!=apage
                    }
                }
                    
            } else {
    
                // Update static pages
    
                for (page in data.pageWrap) {
                    if (!has(page, data.pageWrap)) continue;
                        var pageLocation = turnMethods._setPageLoc.call(this, page);
                        if (data.pages[page])
                            data.pages[page].flip('disable', data.disabled || pageLocation!=1).flip('z', null);
                }
            }
        },
    
        // Sets the z-index and display property of a page
        // It depends on the current view
    
        _setPageLoc: function(page) {
    
            var data = this.data(),
                view = this.turn('view');
    
            if (page==view[0] || page==view[1]) {
                data.pageWrap[page].css({'z-index': data.totalPages, display: ''});
                return 1;
            } else if ((data.display=='single' && page==view[0]+1) || (data.display=='double' && page==view[0]-2 || page==view[1]+2)) {
                data.pageWrap[page].css({'z-index': data.totalPages-1, display: ''});
                return 2;
            } else {
                data.pageWrap[page].css({'z-index': 0, display: 'none'});
                return 0;
            }
        }
    },
    
    // Methods and properties for the flip page effect
    
    flipMethods = {
    
        // Constructor
    
        init: function(opts) {
    
            if (opts.gradients) {
                opts.frontGradient = true;
                opts.backGradient = true;
            }
    
            this.data({f: {}});
            this.flip('options', opts);
    
            flipMethods._addPageWrapper.call(this);
    
            return this;
        },
    
        setData: function(d) {
            
            var data = this.data();
    
            data.f = $.extend(data.f, d);
    
            return this;
        },
    
        options: function(opts) {
            
            var data = this.data().f;
    
            if (opts) {
                flipMethods.setData.call(this, {opts: $.extend({}, data.opts || flipOptions, opts) });
                return this;
            } else
                return data.opts;
    
        },
    
        z: function(z) {
    
            var data = this.data().f;
            data.opts['z-index'] = z;
            data.fwrapper.css({'z-index': z || parseInt(data.parent.css('z-index'), 10) || 0});
    
            return this;
        },
    
        _cAllowed: function() {
    
            return corners[this.data().f.opts.corners] || this.data().f.opts.corners;
    
        },
    
        _cornerActivated: function(e) {
            if (e.originalEvent === undefined) {
                return false;
            }		
    
            e = (isTouch) ? e.originalEvent.touches : [e];
    
            var data = this.data().f,
                pos = data.parent.offset(),
                width = this.width(),
                height = this.height(),
                c = {x: Math.max(0, e[0].pageX-pos.left), y: Math.max(0, e[0].pageY-pos.top)},
                csz = data.opts.cornerSize,
                allowedCorners = flipMethods._cAllowed.call(this);
    
                if (c.x<=0 || c.y<=0 || c.x>=width || c.y>=height) return false;
    
                if (c.y<csz) c.corner = 't';
                else if (c.y>=height-csz) c.corner = 'b';
                else return false;
                
                if (c.x<=csz) c.corner+= 'l';
                else if (c.x>=width-csz) c.corner+= 'r';
                else return false;
    
            return ($.inArray(c.corner, allowedCorners)==-1) ? false : c;
    
        },
    
        _c: function(corner, opts) {
    
            opts = opts || 0;
            return ({tl: point2D(opts, opts),
                    tr: point2D(this.width()-opts, opts),
                    bl: point2D(opts, this.height()-opts),
                    br: point2D(this.width()-opts, this.height()-opts)})[corner];
    
        },
    
        _c2: function(corner) {
    
            return {tl: point2D(this.width()*2, 0),
                    tr: point2D(-this.width(), 0),
                    bl: point2D(this.width()*2, this.height()),
                    br: point2D(-this.width(), this.height())}[corner];
    
        },
    
        _foldingPage: function(corner) {
    
            var opts = this.data().f.opts;
            
            if (opts.folding) return opts.folding;
            else if(opts.turn) {
                var data = opts.turn.data();
                if (data.display == 'single')
                    return (data.pageObjs[opts.next]) ? data.pageObjs[0] : null;
                else
                    return data.pageObjs[opts.next];
            }
    
        },
    
        _backGradient: function() {
    
            var data =	this.data().f,
                turn = data.opts.turn,
                gradient = data.opts.backGradient &&
                            (!turn || turn.data().display=='single' || (data.opts.page!=2 && data.opts.page!=turn.data().totalPages-1) );
    
    
            if (gradient && !data.bshadow)
                data.bshadow = $('<div/>', divAtt(0, 0, 1)).
                    css({'position': '', width: this.width(), height: this.height()}).
                        appendTo(data.parent);
    
            return gradient;
    
        },
    
        resize: function(full) {
            
            var data = this.data().f,
                width = this.width(),
                height = this.height(),
                size = Math.round(Math.sqrt(Math.pow(width, 2)+Math.pow(height, 2)));
    
            if (full) {
                data.wrapper.css({width: size, height: size});
                data.fwrapper.css({width: size, height: size}).
                    children(':first-child').
                        css({width: width, height: height});
    
                data.fpage.css({width: height, height: width});
    
                if (data.opts.frontGradient)
                    data.ashadow.css({width: height, height: width});
    
                if (flipMethods._backGradient.call(this))
                    data.bshadow.css({width: width, height: height});
            }
    
            if (data.parent.is(':visible')) {
                data.fwrapper.css({top: data.parent.offset().top,
                    left: data.parent.offset().left});
    
                if (data.opts.turn)
                    data.fparent.css({top: -data.opts.turn.offset().top, left: -data.opts.turn.offset().left});
            }
    
            this.flip('z', data.opts['z-index']);
    
        },
    
        // Prepares the page by adding a general wrapper and another objects
    
        _addPageWrapper: function() {
    
            var att,
                data = this.data().f,
                parent = this.parent();
    
            if (!data.wrapper) {
    
                var left = this.css('left'),
                    top = this.css('top'),
                    width = this.width(),
                    height = this.height(),
                    size = Math.round(Math.sqrt(Math.pow(width, 2)+Math.pow(height, 2)));
                
                data.parent = parent;
                data.fparent = (data.opts.turn) ? data.opts.turn.data().fparent : $('#turn-fwrappers');
    
                if (!data.fparent) {
                    var fparent = $('<div/>', {css: {'pointer-events': 'none'}}).hide();
                        fparent.data().flips = 0;
    
                    if (data.opts.turn) {
                        fparent.css(divAtt(-data.opts.turn.offset().top, -data.opts.turn.offset().left, 'auto', 'visible').css).
                                appendTo(data.opts.turn);
                        
                        data.opts.turn.data().fparent = fparent;
                    } else {
                        fparent.css(divAtt(0, 0, 'auto', 'visible').css).
                            attr('id', 'turn-fwrappers').
                                appendTo($('body'));
                    }
    
                    data.fparent = fparent;
                }
    
                this.css({position: 'absolute', top: 0, left: 0, bottom: 'auto', right: 'auto'});
    
                data.wrapper = $('<div/>', divAtt(0, 0, this.css('z-index'))).
                                    appendTo(parent).
                                        prepend(this);
    
                data.fwrapper = $('<div/>', divAtt(parent.offset().top, parent.offset().left)).
                                    hide().
                                        appendTo(data.fparent);
    
                data.fpage = $('<div/>', {css: {cursor: 'default'}}).
                        appendTo($('<div/>', divAtt(0, 0, 0, 'visible')).
                                    appendTo(data.fwrapper));
    
                if (data.opts.frontGradient)
                    data.ashadow = $('<div/>', divAtt(0, 0,  1)).
                        appendTo(data.fpage);
    
                // Save data
    
                flipMethods.setData.call(this, data);
    
                // Set size
                flipMethods.resize.call(this, true);
            }
    
        },
    
        // Takes a 2P point from the screen and applies the transformation
    
        _fold: function(point) {
    
            var that = this,
                a = 0,
                alpha = 0,
                beta,
                px,
                gradientEndPointA,
                gradientEndPointB,
                gradientStartV,
                gradientSize,
                gradientOpacity,
                mv = point2D(0, 0),
                df = point2D(0, 0),
                tr = point2D(0, 0),
                width = this.width(),
                height = this.height(),
                folding = flipMethods._foldingPage.call(this),
                tan = Math.tan(alpha),
                data = this.data().f,
                ac = data.opts.acceleration,
                h = data.wrapper.height(),
                o = flipMethods._c.call(this, point.corner),
                top = point.corner.substr(0, 1) == 't',
                left = point.corner.substr(1, 1) == 'l',
    
                compute = function() {
                    var rel = point2D((o.x) ? o.x - point.x : point.x, (o.y) ? o.y - point.y : point.y),
                        tan = (Math.atan2(rel.y, rel.x)),
                        middle;
    
                    alpha = A90 - tan;
                    a = deg(alpha);
                    middle = point2D((left) ? width - rel.x/2 : point.x + rel.x/2, rel.y/2);
    
                    var gamma = alpha - Math.atan2(middle.y, middle.x),
                        distance =  Math.max(0, Math.sin(gamma) * Math.sqrt(Math.pow(middle.x, 2) + Math.pow(middle.y, 2)));
    
                        tr = point2D(distance * Math.sin(alpha), distance * Math.cos(alpha));
    
                        if (alpha > A90) {
                        
                            tr.x = tr.x + Math.abs(tr.y * Math.tan(tan));
                            tr.y = 0;
    
                            if (Math.round(tr.x*Math.tan(PI-alpha)) < height) {
    
                                point.y = Math.sqrt(Math.pow(height, 2)+2 * middle.x * rel.x);
                                if (top) point.y =  height - point.y;
                                return compute();
    
                            }
                        }
                
                    if (alpha>A90) {
                        var beta = PI-alpha, dd = h - height/Math.sin(beta);
                        mv = point2D(Math.round(dd*Math.cos(beta)), Math.round(dd*Math.sin(beta)));
                        if (left) mv.x = - mv.x;
                        if (top) mv.y = - mv.y;
                    }
    
                    px = Math.round(tr.y/Math.tan(alpha) + tr.x);
                
                    var side = width - px,
                        sideX = side*Math.cos(alpha*2),
                        sideY = side*Math.sin(alpha*2);
                        df = point2D(Math.round( (left ? side -sideX : px+sideX)), Math.round((top) ? sideY : height - sideY));
                        
                    
                    // GRADIENTS
    
                        gradientSize = side*Math.sin(alpha);
                            var endingPoint = flipMethods._c2.call(that, point.corner),
                            far = Math.sqrt(Math.pow(endingPoint.x-point.x, 2)+Math.pow(endingPoint.y-point.y, 2));
    
                        gradientOpacity = (far<width) ? far/width : 1;
    
    
                    if (data.opts.frontGradient) {
    
                        gradientStartV = gradientSize>100 ? (gradientSize-100)/gradientSize : 0;
                        gradientEndPointA = point2D(gradientSize*Math.sin(A90-alpha)/height*100, gradientSize*Math.cos(A90-alpha)/width*100);
                    
                        if (top) gradientEndPointA.y = 100-gradientEndPointA.y;
                        if (left) gradientEndPointA.x = 100-gradientEndPointA.x;
                    }
    
                    if (flipMethods._backGradient.call(that)) {
    
                        gradientEndPointB = point2D(gradientSize*Math.sin(alpha)/width*100, gradientSize*Math.cos(alpha)/height*100);
                        if (!left) gradientEndPointB.x = 100-gradientEndPointB.x;
                        if (!top) gradientEndPointB.y = 100-gradientEndPointB.y;
                    }
                    //
    
                    tr.x = Math.round(tr.x);
                    tr.y = Math.round(tr.y);
    
                    return true;
                },
    
                transform = function(tr, c, x, a) {
                
                    var f = ['0', 'auto'], mvW = (width-h)*x[0]/100, mvH = (height-h)*x[1]/100,
                        v = {left: f[c[0]], top: f[c[1]], right: f[c[2]], bottom: f[c[3]]},
                        aliasingFk = (a!=90 && a!=-90) ? (left ? -1 : 1) : 0;
    
                        x = x[0] + '% ' + x[1] + '%';
    
                    that.css(v).transform(rotate(a) + translate(tr.x + aliasingFk, tr.y, ac), x);
    
                    data.fpage.parent().css(v);
                    data.wrapper.transform(translate(-tr.x + mvW-aliasingFk, -tr.y + mvH, ac) + rotate(-a), x);
    
                    data.fwrapper.transform(translate(-tr.x + mv.x + mvW, -tr.y + mv.y + mvH, ac) + rotate(-a), x);
                    data.fpage.parent().transform(rotate(a) + translate(tr.x + df.x - mv.x, tr.y + df.y - mv.y, ac), x);
    
                    if (data.opts.frontGradient)
                        gradient(data.ashadow,
                                point2D(left?100:0, top?100:0),
                                point2D(gradientEndPointA.x, gradientEndPointA.y),
                                [[gradientStartV, 'rgba(0,0,0,0)'],
                                [((1-gradientStartV)*0.8)+gradientStartV, 'rgba(0,0,0,'+(0.2*gradientOpacity)+')'],
                                [1, 'rgba(255,255,255,'+(0.2*gradientOpacity)+')']],
                                3,
                                alpha);
            
                    if (flipMethods._backGradient.call(that))
                        gradient(data.bshadow,
                                point2D(left?0:100, top?0:100),
                                point2D(gradientEndPointB.x, gradientEndPointB.y),
                                [[0.8, 'rgba(0,0,0,0)'],
                                [1, 'rgba(0,0,0,'+(0.3*gradientOpacity)+')'],
                                [1, 'rgba(0,0,0,0)']],
                                3);
                    
                };
    
            switch (point.corner) {
                case 'tl' :
                    point.x = Math.max(point.x, 1);
                    compute();
                    transform(tr, [1,0,0,1], [100, 0], a);
                    data.fpage.transform(translate(-height, -width, ac) + rotate(90-a*2) , '100% 100%');
                    folding.transform(rotate(90) + translate(0, -height, ac), '0% 0%');
                break;
                case 'tr' :
                    point.x = Math.min(point.x, width-1);
                    compute();
                    transform(point2D(-tr.x, tr.y), [0,0,0,1], [0, 0], -a);
                    data.fpage.transform(translate(0, -width, ac) + rotate(-90+a*2) , '0% 100%');
                    folding.transform(rotate(270) + translate(-width, 0, ac), '0% 0%');
                break;
                case 'bl' :
                    point.x = Math.max(point.x, 1);
                    compute();
                    transform(point2D(tr.x, -tr.y), [1,1,0,0], [100, 100], -a);
                    data.fpage.transform(translate(-height, 0, ac) + rotate(-90+a*2), '100% 0%');
                    folding.transform(rotate(270) + translate(-width, 0, ac), '0% 0%');
                break;
                case 'br' :
                    point.x = Math.min(point.x, width-1);
                    compute();
                    transform(point2D(-tr.x, -tr.y), [0,1,1,0], [0, 100], a);
                    data.fpage.transform(rotate(90-a*2), '0% 0%');
                    folding.transform(rotate(90) + translate(0, -height, ac), '0% 0%');
    
                break;
            }
    
            data.point = point;
        
        },
    
        _moveFoldingPage: function(bool) {
    
            var data = this.data().f,
                folding = flipMethods._foldingPage.call(this);
    
            if (folding) {
                if (bool) {
                    if (!data.fpage.children()[data.ashadow? '1' : '0']) {
                        flipMethods.setData.call(this, {backParent: folding.parent()});
                        data.fpage.prepend(folding);
                    }
                } else {
                    if (data.backParent)
                        data.backParent.prepend(folding);
    
                }
            }
    
        },
    
        _showFoldedPage: function(c, animate) {
    
            var folding = flipMethods._foldingPage.call(this),
                dd = this.data(),
                data = dd.f;
    
            if (!data.point || data.point.corner!=c.corner) {
                var event = $.Event('start');
                this.trigger(event, [data.opts, c.corner]);
    
                if (event.isDefaultPrevented())
                    return false;
            }
    
    
            if (folding) {
    
                if (animate) {
    
                    var that = this, point = (data.point && data.point.corner==c.corner) ? data.point : flipMethods._c.call(this, c.corner, 1);
                
                    this.animatef({from: [point.x, point.y], to:[c.x, c.y], duration: 500, frame: function(v) {
                        c.x = Math.round(v[0]);
                        c.y = Math.round(v[1]);
                        flipMethods._fold.call(that, c);
                    }});
    
                } else	{
    
                    flipMethods._fold.call(this, c);
                    if (dd.effect && !dd.effect.turning)
                        this.animatef(false);
    
                }
    
                if (!data.fwrapper.is(':visible')) {
                    data.fparent.show().data().flips++;
                    flipMethods._moveFoldingPage.call(this, true);
                    data.fwrapper.show();
    
                    if (data.bshadow)
                        data.bshadow.show();
                }
    
                return true;
            }
    
            return false;
        },
    
        hide: function() {
    
            var data = this.data().f,
                folding = flipMethods._foldingPage.call(this);
    
            if ((--data.fparent.data().flips)===0)
                data.fparent.hide();
    
            this.css({left: 0, top: 0, right: 'auto', bottom: 'auto'}).transform('', '0% 100%');
    
            data.wrapper.transform('', '0% 100%');
    
            data.fwrapper.hide();
    
            if (data.bshadow)
                data.bshadow.hide();
    
            folding.transform('', '0% 0%');
    
            return this;
        },
    
        hideFoldedPage: function(animate) {
    
            var data = this.data().f;
    
            if (!data.point) return;
    
            var that = this,
                p1 = data.point,
                hide = function() {
                    data.point = null;
                    that.flip('hide');
                    that.trigger('end', [false]);
                };
    
            if (animate) {
                var p4 = flipMethods._c.call(this, p1.corner),
                    top = (p1.corner.substr(0,1)=='t'),
                    delta = (top) ? Math.min(0, p1.y-p4.y)/2 : Math.max(0, p1.y-p4.y)/2,
                    p2 = point2D(p1.x, p1.y+delta),
                    p3 = point2D(p4.x, p4.y-delta);
            
                this.animatef({
                    from: 0,
                    to: 1,
                    frame: function(v) {
                        var np = bezier(p1, p2, p3, p4, v);
                        p1.x = np.x;
                        p1.y = np.y;
                        flipMethods._fold.call(that, p1);
                    },
                    complete: hide,
                    duration: 800,
                    hiding: true
                    });
    
            } else {
                this.animatef(false);
                hide();
            }
        },
    
        turnPage: function(corner) {
    
            var that = this,
                data = this.data().f;
    
            corner = {corner: (data.corner) ? data.corner.corner : corner || flipMethods._cAllowed.call(this)[0]};
    
            var p1 = data.point || flipMethods._c.call(this, corner.corner, (data.opts.turn) ? data.opts.turn.data().opts.elevation : 0),
                p4 = flipMethods._c2.call(this, corner.corner);
    
                this.trigger('flip').
                    animatef({
                        from: 0,
                        to: 1,
                        frame: function(v) {
                            var np = bezier(p1, p1, p4, p4, v);
                            corner.x = np.x;
                            corner.y = np.y;
                            flipMethods._showFoldedPage.call(that, corner);
                        },
                        
                        complete: function() {
                            that.trigger('end', [true]);
                        },
                        duration: data.opts.duration,
                        turning: true
                    });
    
                data.corner = null;
        },
    
        moving: function() {
    
            return 'effect' in this.data();
        
        },
    
        isTurning: function() {
    
            return this.flip('moving') && this.data().effect.turning;
        
        },
    
        _eventStart: function(e) {
    
            var data = this.data().f;
    
            if (!data.disabled && !this.flip('isTurning')) {
                data.corner = flipMethods._cornerActivated.call(this, e);
                if (data.corner && flipMethods._foldingPage.call(this, data.corner)) {
                    flipMethods._moveFoldingPage.call(this, true);
                    this.trigger('pressed', [data.point]);
                    return false;
                } else
                    data.corner = null;
            }
    
        },
    
        _eventMove: function(e) {
    
            var data = this.data().f;
    
            if (!data.disabled) {
                e = (isTouch) ? e.originalEvent.touches : [e];
            
                if (data.corner) {
    
                    var pos = data.parent.offset();
    
                    data.corner.x = e[0].pageX-pos.left;
                    data.corner.y = e[0].pageY-pos.top;
    
                    flipMethods._showFoldedPage.call(this, data.corner);
                
                } else if (!this.data().effect && this.is(':visible')) { // roll over
                    
                    var corner = flipMethods._cornerActivated.call(this, e[0]);
                    if (corner) {
                        var origin = flipMethods._c.call(this, corner.corner, data.opts.cornerSize/2);
                        corner.x = origin.x;
                        corner.y = origin.y;
                        flipMethods._showFoldedPage.call(this, corner, true);
                    } else
                        flipMethods.hideFoldedPage.call(this, true);
    
                }
            }
        },
    
        _eventEnd: function() {
    
            var data = this.data().f;
    
            if (!data.disabled && data.point) {
                var event = $.Event('released');
                this.trigger(event, [data.point]);
                if (!event.isDefaultPrevented())
                    flipMethods.hideFoldedPage.call(this, true);
            }
    
            data.corner = null;
    
        },
    
        disable: function(disable) {
    
            flipMethods.setData.call(this, {'disabled': disable});
            return this;
    
        }
    },
    
    cla = function(that, methods, args) {
    
        if (!args[0] || typeof(args[0])=='object')
            return methods.init.apply(that, args);
        else if(methods[args[0]] && args[0].toString().substr(0, 1)!='_')
            return methods[args[0]].apply(that, Array.prototype.slice.call(args, 1));
        else
            throw args[0] + ' is an invalid value';
    };
    
    $.extend($.fn, {
    
        flip: function(req, opts) {
            return cla(this, flipMethods, arguments);
        },
    
        turn: function(req) {
            return cla(this, turnMethods, arguments);
        },
    
        transform: function(transform, origin) {
    
            var properties = {};
            
            if (origin)
                properties[vendor+'transform-origin'] = origin;
            
            properties[vendor+'transform'] = transform;
        
            return this.css(properties);
    
        },
    
        animatef: function(point) {
    
            var data = this.data();
    
            if (data.effect)
                clearInterval(data.effect.handle);
    
            if (point) {
    
                if (!point.to.length) point.to = [point.to];
                if (!point.from.length) point.from = [point.from];
                if (!point.easing) point.easing = function (x, t, b, c, data) { return c * Math.sqrt(1 - (t=t/data-1)*t) + b; };
    
                var j, diff = [],
                    len = point.to.length,
                    that = this,
                    fps = point.fps || 30,
                    time = - fps,
                    f = function() {
                        var j, v = [];
                        time = Math.min(point.duration, time + fps);
        
                        for (j = 0; j < len; j++)
                            v.push(point.easing(1, time, point.from[j], diff[j], point.duration));
    
                        point.frame((len==1) ? v[0] : v);
    
                        if (time==point.duration) {
                            clearInterval(data.effect.handle);
                            delete data['effect'];
                            that.data(data);
                            if (point.complete)
                                point.complete();
                            }
                        };
    
                for (j = 0; j < len; j++)
                    diff.push(point.to[j] - point.from[j]);
    
                data.effect = point;
                data.effect.handle = setInterval(f, fps);
                this.data(data);
                f();
            } else {
                delete data['effect'];
            }
        }
    });
    
    
    $.isTouch = isTouch;
    
    })(jQuery);



/**
 * @name        jQuery FullScreen Plugin
 * @author      Martin Angelov, Morten Sjøgren
 * @version     1.2
 * @url         http://tutorialzine.com/2012/02/enhance-your-website-fullscreen-api/
 * @license     MIT License
 */

/*jshint browser: true, jquery: true */
(function($){
	"use strict";

	// These helper functions available only to our plugin scope.
	function supportFullScreen(){
		var doc = document.documentElement;

		return ('requestFullscreen' in doc) ||
				('mozRequestFullScreen' in doc && document.mozFullScreenEnabled) ||
				('webkitRequestFullScreen' in doc);
	}

	function requestFullScreen(elem){
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullScreen) {
			elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	}

	function fullScreenStatus(){
		return document.fullscreen ||
				document.mozFullScreen ||
				document.webkitIsFullScreen ||
				false;
	}

	function cancelFullScreen(){
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}

	function onFullScreenEvent(callback){
		$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function(){
			// The full screen status is automatically
			// passed to our callback as an argument.
			callback(fullScreenStatus());
		});
	}

	// Adding a new test to the jQuery support object
	$.support.fullscreen = supportFullScreen();

	// Creating the plugin
	$.fn.fullScreen = function(props){
		if(!$.support.fullscreen || this.length !== 1) {
			// The plugin can be called only
			// on one element at a time

			return this;
		}

		if(fullScreenStatus()){
			// if we are already in fullscreen, exit
			cancelFullScreen();
			return this;
		}

		// You can potentially pas two arguments a color
		// for the background and a callback function

		var options = $.extend({
			'background'      : '#111',
			'callback'        : $.noop( ),
			'fullscreenClass' : 'fullScreen'
		}, props),

		elem = this,

		// This temporary div is the element that is
		// actually going to be enlarged in full screen

		fs = $('<div>', {
			'css' : {
				'overflow-y' : 'auto',
				'background' : options.background,
				'width'      : '100%',
				'height'     : '100%'
			}
		})
			.insertBefore(elem)
			.append(elem);

		// You can use the .fullScreen class to
		// apply styling to your element
		elem.addClass( options.fullscreenClass );

		// Inserting our element in the temporary
		// div, after which we zoom it in fullscreen

		requestFullScreen(fs.get(0));

		fs.click(function(e){
			if(e.target == this){
				// If the black bar was clicked
				cancelFullScreen();
			}
		});

		elem.cancel = function(){
			cancelFullScreen();
			return elem;
		};

		onFullScreenEvent(function(fullScreen){
			if(!fullScreen){
				// We have exited full screen.
			        // Detach event listener
			        $(document).off( 'fullscreenchange mozfullscreenchange webkitfullscreenchange' );
				// Remove the class and destroy
				// the temporary div

				elem.removeClass( options.fullscreenClass ).insertBefore(fs);
				fs.remove();
			}

			// Calling the facultative user supplied callback
			if(options.callback) {
                            options.callback(fullScreen);
                        }
		});

		return elem;
	};

	$.fn.cancelFullScreen = function( ) {
			cancelFullScreen();

			return this;
	};
}(jQuery));






/*! jQuery Address v1.6 | (c) 2009, 2013 Rostislav Hristov | jquery.org/license */
(function(c){c.address=function(){var s=function(a){a=c.extend(c.Event(a),function(){for(var b={},f=c.address.parameterNames(),m=0,p=f.length;m<p;m++)b[f[m]]=c.address.parameter(f[m]);return{value:c.address.value(),path:c.address.path(),pathNames:c.address.pathNames(),parameterNames:f,parameters:b,queryString:c.address.queryString()}}.call(c.address));c(c.address).trigger(a);return a},g=function(a){return Array.prototype.slice.call(a)},k=function(){c().bind.apply(c(c.address),Array.prototype.slice.call(arguments));
    return c.address},da=function(){c().unbind.apply(c(c.address),Array.prototype.slice.call(arguments));return c.address},G=function(){return A.pushState&&d.state!==h},T=function(){return("/"+n.pathname.replace(new RegExp(d.state),"")+n.search+(H()?"#"+H():"")).replace(S,"/")},H=function(){var a=n.href.indexOf("#");return a!=-1?n.href.substr(a+1):""},q=function(){return G()?T():H()},U=function(){return"javascript"},M=function(a){a=a.toString();return(d.strict&&a.substr(0,1)!="/"?"/":"")+a},t=function(a,
    b){return parseInt(a.css(b),10)},C=function(){if(!I){var a=q();if(decodeURI(e)!=decodeURI(a))if(v&&x<7)n.reload();else{v&&!J&&d.history&&u(N,50);e=a;B(o)}}},B=function(a){u(ea,10);return s(V).isDefaultPrevented()||s(a?W:X).isDefaultPrevented()},ea=function(){if(d.tracker!=="null"&&d.tracker!==D){var a=c.isFunction(d.tracker)?d.tracker:i[d.tracker],b=(n.pathname+n.search+(c.address&&!G()?c.address.value():"")).replace(/\/\//,"/").replace(/^\/$/,"");if(c.isFunction(a))a(b);else if(c.isFunction(i.urchinTracker))i.urchinTracker(b);
    else if(i.pageTracker!==h&&c.isFunction(i.pageTracker._trackPageview))i.pageTracker._trackPageview(b);else i._gaq!==h&&c.isFunction(i._gaq.push)&&i._gaq.push(["_trackPageview",decodeURI(b)])}},N=function(){var a=U()+":"+o+";document.open();document.writeln('<html><head><title>"+l.title.replace(/\'/g,"\\'")+"</title><script>var "+y+' = "'+encodeURIComponent(q()).replace(/\'/g,"\\'")+(l.domain!=n.hostname?'";document.domain="'+l.domain:"")+"\";<\/script></head></html>');document.close();";if(x<7)j.src=
    a;else j.contentWindow.location.replace(a)},Z=function(){if(E&&Y!=-1){var a,b,f=E.substr(Y+1).split("&");for(a=0;a<f.length;a++){b=f[a].split("=");if(/^(autoUpdate|history|strict|wrap)$/.test(b[0]))d[b[0]]=isNaN(b[1])?/^(true|yes)$/i.test(b[1]):parseInt(b[1],10)!==0;if(/^(state|tracker)$/.test(b[0]))d[b[0]]=b[1]}E=D}e=q()},aa=function(){if(!$){$=r;Z();c('a[rel*="address:"]').address();if(d.wrap){var a=c("body");c("body > *").wrapAll('<div style="padding:'+(t(a,"marginTop")+t(a,"paddingTop"))+"px "+
    (t(a,"marginRight")+t(a,"paddingRight"))+"px "+(t(a,"marginBottom")+t(a,"paddingBottom"))+"px "+(t(a,"marginLeft")+t(a,"paddingLeft"))+'px;" />').parent().wrap('<div id="'+y+'" style="height:100%;overflow:auto;position:relative;'+(K&&!window.statusbar.visible?"resize:both;":"")+'" />');c("html, body").css({height:"100%",margin:0,padding:0,overflow:"hidden"});K&&c('<style type="text/css" />').appendTo("head").text("#"+y+"::-webkit-resizer { background-color: #fff; }")}if(v&&!J){a=l.getElementsByTagName("frameset")[0];
    j=l.createElement((a?"":"i")+"frame");j.src=U()+":"+o;if(a){a.insertAdjacentElement("beforeEnd",j);a[a.cols?"cols":"rows"]+=",0";j.noResize=r;j.frameBorder=j.frameSpacing=0}else{j.style.display="none";j.style.width=j.style.height=0;j.tabIndex=-1;l.body.insertAdjacentElement("afterBegin",j)}u(function(){c(j).bind("load",function(){var b=j.contentWindow;e=b[y]!==h?b[y]:"";if(e!=q()){B(o);n.hash=e}});j.contentWindow[y]===h&&N()},50)}u(function(){s("init");B(o)},1);if(!G())if(v&&x>7||!v&&J)if(i.addEventListener)i.addEventListener(F,
    C,o);else i.attachEvent&&i.attachEvent("on"+F,C);else fa(C,50);"state"in window.history&&c(window).trigger("popstate")}},ga=function(a){a=a.toLowerCase();a=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}},h,D=null,y="jQueryAddress",F="hashchange",V="change",W="internalChange",X="externalChange",
    r=true,o=false,d={autoUpdate:r,history:r,strict:r,wrap:o},z=function(){var a={},b=ga(navigator.userAgent);if(b.browser){a[b.browser]=true;a.version=b.version}if(a.chrome)a.webkit=true;else if(a.webkit)a.safari=true;return a}(),x=parseFloat(z.version),K=z.webkit||z.safari,v=!c.support.opacity,i=function(){try{return top.document!==h&&top.document.title!==h?top:window}catch(a){return window}}(),l=i.document,A=i.history,n=i.location,fa=setInterval,u=setTimeout,S=/\/{2,9}/g;z=navigator.userAgent;var J=
    "on"+F in i,j,E=c("script:last").attr("src"),Y=E?E.indexOf("?"):-1,O=l.title,I=o,$=o,ba=r,L=o,e=q();if(v){x=parseFloat(z.substr(z.indexOf("MSIE")+4));if(l.documentMode&&l.documentMode!=x)x=l.documentMode!=8?7:8;var ca=l.onpropertychange;l.onpropertychange=function(){ca&&ca.call(l);if(l.title!=O&&l.title.indexOf("#"+q())!=-1)l.title=O}}if(A.navigationMode)A.navigationMode="compatible";if(document.readyState=="complete")var ha=setInterval(function(){if(c.address){aa();clearInterval(ha)}},50);else{Z();
    c(aa)}c(window).bind("popstate",function(){if(decodeURI(e)!=decodeURI(q())){e=q();B(o)}}).bind("unload",function(){if(i.removeEventListener)i.removeEventListener(F,C,o);else i.detachEvent&&i.detachEvent("on"+F,C)});return{bind:function(){return k.apply(this,g(arguments))},unbind:function(){return da.apply(this,g(arguments))},init:function(){return k.apply(this,["init"].concat(g(arguments)))},change:function(){return k.apply(this,[V].concat(g(arguments)))},internalChange:function(){return k.apply(this,
    [W].concat(g(arguments)))},externalChange:function(){return k.apply(this,[X].concat(g(arguments)))},baseURL:function(){var a=n.href;if(a.indexOf("#")!=-1)a=a.substr(0,a.indexOf("#"));if(/\/$/.test(a))a=a.substr(0,a.length-1);return a},autoUpdate:function(a){if(a!==h){d.autoUpdate=a;return this}return d.autoUpdate},history:function(a){if(a!==h){d.history=a;return this}return d.history},state:function(a){if(a!==h){d.state=a;var b=T();if(d.state!==h)if(A.pushState)b.substr(0,3)=="/#/"&&n.replace(d.state.replace(/^\/$/,
    "")+b.substr(2));else b!="/"&&b.replace(/^\/#/,"")!=H()&&u(function(){n.replace(d.state.replace(/^\/$/,"")+"/#"+b)},1);return this}return d.state},strict:function(a){if(a!==h){d.strict=a;return this}return d.strict},tracker:function(a){if(a!==h){d.tracker=a;return this}return d.tracker},wrap:function(a){if(a!==h){d.wrap=a;return this}return d.wrap},update:function(){L=r;this.value(e);L=o;return this},title:function(a){if(a!==h){u(function(){O=l.title=a;if(ba&&j&&j.contentWindow&&j.contentWindow.document){j.contentWindow.document.title=
    a;ba=o}},50);return this}return l.title},value:function(a){if(a!==h){a=M(a);if(a=="/")a="";if(e==a&&!L)return;e=a;if(d.autoUpdate||L){if(B(r))return this;if(G())A[d.history?"pushState":"replaceState"]({},"",d.state.replace(/\/$/,"")+(e===""?"/":e));else{I=r;if(K)if(d.history)n.hash="#"+e;else n.replace("#"+e);else if(e!=q())if(d.history)n.hash="#"+e;else n.replace("#"+e);v&&!J&&d.history&&u(N,50);if(K)u(function(){I=o},1);else I=o}}return this}return M(e)},path:function(a){if(a!==h){var b=this.queryString(),
    f=this.hash();this.value(a+(b?"?"+b:"")+(f?"#"+f:""));return this}return M(e).split("#")[0].split("?")[0]},pathNames:function(){var a=this.path(),b=a.replace(S,"/").split("/");if(a.substr(0,1)=="/"||a.length===0)b.splice(0,1);a.substr(a.length-1,1)=="/"&&b.splice(b.length-1,1);return b},queryString:function(a){if(a!==h){var b=this.hash();this.value(this.path()+(a?"?"+a:"")+(b?"#"+b:""));return this}a=e.split("?");return a.slice(1,a.length).join("?").split("#")[0]},parameter:function(a,b,f){var m,
    p;if(b!==h){var P=this.parameterNames();p=[];b=b===h||b===D?"":b.toString();for(m=0;m<P.length;m++){var Q=P[m],w=this.parameter(Q);if(typeof w=="string")w=[w];if(Q==a)w=b===D||b===""?[]:f?w.concat([b]):[b];for(var R=0;R<w.length;R++)p.push(Q+"="+w[R])}c.inArray(a,P)==-1&&b!==D&&b!==""&&p.push(a+"="+b);this.queryString(p.join("&"));return this}if(b=this.queryString()){f=[];p=b.split("&");for(m=0;m<p.length;m++){b=p[m].split("=");b[0]==a&&f.push(b.slice(1).join("="))}if(f.length!==0)return f.length!=
    1?f:f[0]}},parameterNames:function(){var a=this.queryString(),b=[];if(a&&a.indexOf("=")!=-1){a=a.split("&");for(var f=0;f<a.length;f++){var m=a[f].split("=")[0];c.inArray(m,b)==-1&&b.push(m)}}return b},hash:function(a){if(a!==h){this.value(e.split("#")[0]+(a?"#"+a:""));return this}a=e.split("#");return a.slice(1,a.length).join("#")}}}();c.fn.address=function(s){this.data("address")||this.on("click",function(g){if(g.shiftKey||g.ctrlKey||g.metaKey||g.which==2)return true;var k=g.currentTarget;if(c(k).is("a")){g.preventDefault();
    g=s?s.call(k):/address:/.test(c(k).attr("rel"))?c(k).attr("rel").split("address:")[1].split(" ")[0]:c.address.state()!==undefined&&!/^\/?$/.test(c.address.state())?c(k).attr("href").replace(new RegExp("^(.*"+c.address.state()+"|\\.)"),""):c(k).attr("href").replace(/^(#\!?|\.)/,"");c.address.value(g)}}).on("submit",function(g){var k=g.currentTarget;if(c(k).is("form")){g.preventDefault();g=c(k).attr("action");k=s?s.call(k):(g.indexOf("?")!=-1?g.replace(/&$/,""):g+"?")+c(k).serialize();c.address.value(k)}}).data("address",
    true);return this}})(jQuery);
    








    /*! waitForImages jQuery Plugin - v1.5.0 - 2013-07-20
* https://github.com/alexanderdickson/waitForImages
* Copyright (c) 2013 Alex Dickson; Licensed MIT */
;(function ($) {
    // Namespace all events.
    var eventNamespace = 'waitForImages';

    // CSS properties which contain references to images.
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage', 'cursor']
    };

    // Custom selector to find `img` elements that have a valid `src` attribute and have not already loaded.
    $.expr[':'].uncached = function (obj) {
        // Ensure we are dealing with an `img` element with a valid `src` attribute.
        if (!$(obj).is('img[src!=""]')) {
            return false;
        }

        // Firefox's `complete` property will always be `true` even if the image has not been downloaded.
        // Doing it this way works in Firefox.
        var img = new Image();
        img.src = obj.src;
        return !img.complete;
    };

    $.fn.waitForImages = function (finishedCallback, eachCallback, waitForAll) {
		
		

        var allImgsLength = 0;
        var allImgsLoaded = 0;

        // Handle options object.
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
			// This must be last as arguments[0]
			// is aliased with finishedCallback.
            finishedCallback = arguments[0].finished;
        }

        // Handle missing callbacks.
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;

        // Convert waitForAll to Boolean
        waitForAll = !! waitForAll;

        // Ensure callbacks are functions.
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }

        return this.each(function () {
            // Build a list of all imgs, dependent on what images will be considered.
            var obj = $(this);
			
            var allImgs = [];
            // CSS properties which may contain an image.
            var hasImgProperties = $.waitForImages.hasImageProperties || [];
            // To match `url()` references.
            // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
            var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

            if (waitForAll) {

                // Get all elements (including the original), as any one of them could have a background image.
                obj.find('*').addBack().each(function () {
                    var element = $(this);

                    
 
                    // If an `img` element, add it. But keep iterating in case it has a background image too.
                    if (element.is('img:uncached')) {
                        allImgs.push({
                            src: element.attr('src'),
                            element: element[0]
                        });
                    }

                    $.each(hasImgProperties, function (i, property) {
						
						
						
                        var propertyValue = element.css(property);
                        var match;

                        // If it doesn't contain this property, skip.
                        if (!propertyValue) {
                            return true;
                        }

                        // Get all url() of this element.
                        while (match = matchUrl.exec(propertyValue)) {
							
                           allImgs.push({
                                src: match[2],
                                element: element[0]
                            });
                        }
                    });
                });
            } else {
                // For images only, the task is simpler.
                obj.find('img:uncached')
                    .each(function () {
                    allImgs.push({
                        src: this.src,
                        element: this
                    });
                });
            }

            allImgsLength = allImgs.length;
            allImgsLoaded = 0;

            // If no images found, don't bother.
            if (allImgsLength === 0) {
                finishedCallback.call(obj[0]);
            }

            $.each(allImgs, function (i, img) {

                var image = new Image();

                // Handle the image loading and error with the same callback.
                $(image).on('load.' + eventNamespace + ' error.' + eventNamespace, function (event) {
                    allImgsLoaded++;

                    // If an error occurred with loading the image, set the third argument accordingly.
                    eachCallback.call(img.element, allImgsLoaded, allImgsLength, event.type == 'load');

                    if (allImgsLoaded == allImgsLength) {
                        finishedCallback.call(obj[0]);
                        return false;
                    }

                });

                image.src = img.src;
            });
        });
    };
}(jQuery));






(function($){

    ////CONFIGURATION
    var WIDTH_BOOK           			//WIDTH BOOK
    var HEIGHT_BOOK						//HEIGHT BOOK
    var BOOK_SLUG;						//SLUG FOR BOOK
    var WINDOW_WIDTH;                   //WIDTH AREA [px]
    var WINDOW_HEIGHT;                  //HEIGHT AREA [px]
    var ZOOM_STEP 		        		//STEPS SIZE FOR ZOOM
    var ZOOM_DOUBLE_CLICK_ENABLED;		//ENABLED DOUBLE CLICK FOR ZOOM
    var ZOOM_DOUBLE_CLICK;    			//ZOOM FOR DOUBLE CLICK
    var GOTOPAGE_WIDTH;					//WIDTH FOR INPUT FIELD
    var IS_AS_TEMPLATE               	//IF THIS TEMPLATE 
    var TOOL_TIP_VISIBLE                //TOOLTIP VISIBLE
    var SWF_ADDRESS                     //SWF ADDRESS
    var TOOLS_VISIBLE                   //TOOLBAR VISIBLE
    var RTL                             //RIGHT TO LEFT
    
    
    /* =  event ready 
    --------------------------*/
    $(document).ready(function(e) {	
     
          
     
       Book_v5.ready()
       
       
       /* =  event load 
       --------------------------*/
       $('#fb5').waitForImages({
                waitForAll: true,
                finished: function() {						 
                     Book_v5.load()
                }
       });	
       /* =  end event load 
       --------------------------*/	
                               
    
       if( general.browser_firefox() ) {
          console.log("book:jquery version "+$.fn.jquery);   
       }
       
       
      ;  
    });
    
    
    
    /* =  set Page
    --------------------------*/
         
      setPage=function(nr_) {
          
          if( SWF_ADDRESS == "true" ){ 
              var results= $("#fb5-deeplinking ul li[data-page="+nr_+"]");
              var address = results.attr('data-address');
                setAddress( $('#fb5').attr('data-current')+"/"+address);	
          }else{
              setPageTurn(nr_);      
          }
           
     };
     
     
     /* =  set Page
    --------------------------
    NO the problem with the Iphone Landscape
    */
         
      setPageTurn=function(nr_) {      
            var nr=nr_;
            if(RTL=='true'){
              nr=new Number(nr_).rtl()    
            }	  
            $('#fb5-book').turn('page',nr);      
      };
     
     
    
    /* =  set Address
    --------------------------*/
    
     setAddress=function(address_) {
           
           $.address.value( address_ );
      };
    
    
    /* =  show lightbox with video 
    --------------------------*/
    
      youtube=function(id_,w_,h_) {
    
         var w=w_;
         var h=h_;
         var id=id_;
         
        $('body').prepend('<div id="v5_lightbox"><div class="bcg"></div><iframe class="youtube-player" width='+w+' height='+h+' src="http://www.youtube.com/embed/'+id+'?html5=1" frameborder="0" allowfullscreen></iframe></div>');
      
        $(window).trigger('orientationchange');
              
        $("#v5_lightbox").click(function(){
            $(this).children().hide();
            $(this).remove();
            
            Book_v5.zoomAuto();
        })
        
        $("#v5_lightbox").css('display','block');
        
     };
     
     
    /* =  prototype 
    --------------------------*/
    Number.prototype.rtl=function()
    {
    return (Book_v5.getLength()+1)-this.valueOf();
    }
    
    
    /* =  local general function 
    --------------------------*/
    var general={
    
    browser_firefox:function(){	
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          return true;	
        }else{
          return false;	
        }
    }
    
    }
    
    /* =  FlipBook v5
    --------------------------*/
    var Book_v5 = {
    
        toolsHeight:0,   //tools height
        zoom:1,           //zoom
        page_padding:0.1,
        paddingL:0.02,
        paddingR:0.02,
        paddingT:0.02,
        paddingB:0.02,
        currentPage:0,
        
    
    
        ready: function(){
            
           if( general.browser_firefox() ) {	
               console.log('book:event ready'); 
           }
           //start	 
          
           //Configuration
           var config=$('#fb5').data('config'); 
           Book_v5.config=config; 
           WIDTH_BOOK=Number(config['page_width'])*2;  	 
           HEIGHT_BOOK=Number(config['page_height']);
           ZOOM_STEP=Number(config['zoom_step']);
           ZOOM_DOUBLE_CLICK_ENABLED=(config['double_click_enabled']);           
           ZOOM_DOUBLE_CLICK=Number(config['zoom_double_click'])
           GOTOPAGE_WIDTH=Number(config['gotopage_width']);
           TOOL_TIP_VISIBLE=(config['tooltip_visible']);
           SWF_ADDRESS=(config['deeplinking_enabled']);
           RTL=config['rtl'];
           
           IS_AS_TEMPLATE=config['full_area'];//$('#fb5-ajax').attr('data-template') == "true" ? true : false;
           if( IS_AS_TEMPLATE == "true" ){
             $('#fb5-ajax').attr('data-template','true');   
           }
           
           TOOLS_VISIBLE=(config['toolbar_visible']);
           if( TOOLS_VISIBLE == "true" ){
                 Book_v5.toolsHeight=60;
           }else{
                 Book_v5.toolsHeight=0;
            }
            
            ///blockade move 
            
            //remove default touch move  
            if(IS_AS_TEMPLATE=="true"){ 
                $(document).bind('touchmove',function(e) {
                    e.preventDefault(); 
                });
            }
            
            ///about show
            $('#fb5-about').css('display','block');		
                      
    
           //event resize
           $(window).bind('orientationchange resize', function(event){
                 if( IS_AS_TEMPLATE == "true" ){
                    window.scrollTo(0,0);
                }
                Book_v5.book_area();
                Book_v5.zoomAuto();
                Book_v5.book_position();
                Book_v5.dragdrop_init();        
                Book_v5.resize_page()     
                Book_v5.center($('#v5_lightbox'));           
                Book_v5.center_icon();
                Book_v5.center_icon();
                Book_v5.media_queries()
            });
    
          
                    
            
            /////enabled/disabled lazy loading for thumbs
            if(  Book_v5.config['lazy_loading_thumbs']!='true'  ){
                    $('#fb5-all-pages li img').each(function(index, element) { 										
                                var el=$(element);                            
                                var src=el.attr('data-src');												
                                if( el.attr('src')==undefined  ){
                                    el.attr('src',src);					
                                }
                    });	
            }
                                    
                    
            
            /////enabled/disabled lazy loading for pages
            if( Book_v5.config['lazy_loading_pages']=="true" ){	
            
                /*lazy loading for pages enabled
                you need to load a previously two current page
                ( change attributes data to src )			
                /*/		
                
                  //get current pages
                var address=$.address.pathNames()[1];
                var results=$('#fb5-deeplinking ul li[data-address='+address+']');
                var nrPage=new Number(results.attr('data-page'))  //nr page from deeplinking
                var left=Book_v5.getCurrentPages(nrPage).left;
                var right=Book_v5.getCurrentPages(nrPage).right;
                
                if( left != null ){ //current left page
                     var left_div=$('#fb5-book > div').eq(left-1);
                     //change data-background-image to background-image
                     var data_background_image=left_div.attr('data-background-image');			 			 
                     if(   data_background_image!=""   ){				 
                           left_div.css('background-image', 'url("'+data_background_image+'")');				 
                     }
                     //change data to src for image in description page
                     $('.fb5-page-book img',left_div).each(function(index, element) {
                            var data_src=$(element).attr('data-src');
                            $(element).attr('src',data_src);					
                     });		
                     
                }
                
                if( right != null ){  //current right page
                     var right_div=$('#fb5-book > div').eq(right-1);
                      //change data-background-image to background-image
                     var data_background_image=right_div.attr('data-background-image');			 			 
                     if(   data_background_image!=""   ){				 
                        right_div.css('background-image', 'url("'+data_background_image+'")');				 
                     }
                      //change data to src for image in description page
                     $('.fb5-page-book img',right_div).each(function(index, element) {
                            var data_src=$(element).attr('data-src');
                            $(element).attr('src',data_src);					
                     });	
                }
                
            }else{ 
            
                  /*lazdy loading for pages disabled
                  you need to replace the data-src attribute to src
                  /*/  
                
                  //change attributes data-background-image to background-image
                  $('#fb5-book > div').each(function(index, element) {           
                         var page_div=$(element);
                         var data_background_image=page_div.attr('data-background-image');	
                                                               
                         if(   data_background_image!="" &&  data_background_image!=undefined   ){	
                             page_div.css('background-image', 'url("'+data_background_image+'")');	
                                 
                         }
                   });	
                   //change data to src for image in description page
                   $('.fb5-page-book img').each(function(index, element) {
                            var data_src=$(element).attr('data-src');
                            $(element).attr('src',data_src);
                        
                   });			    
                        
            }
            
            
            
            //reverse book		
            $( $('#fb5-book>div').get().reverse()  ).each(function(index,element) { 
                    var item=$(element);
                    var meta=$('div.fb5-meta',this);
                    ///for only reverse
                    if( RTL == "true" ){				  
                          //reverse					
                          $(this).appendTo( $(this).parent() );					  
                          //reorder description and number
                          var desc=$('span.fb5-description',item);
                          if( desc.index() ==0 ){
                            desc.appendTo(meta);						  
                          }else{
                            desc.prependTo(meta); 
                          }				  					  
                          ///for double
                          if( item.hasClass('fb5-double') ){						  
                            if(  item.hasClass('fb5-first') ){
                                 item.removeClass('fb5-first').addClass('fb5-second');							
                            }else if( item.hasClass('fb5-second') ){
                                 item.removeClass('fb5-second').addClass('fb5-first');							
                            }						  
                          }		
                         //add data for meta
                          if( index%2!=0 ){			 
                              meta.addClass('fb5-left');		
                          }else{
                              meta.addClass('fb5-right');					 
                          }			  
                      }else{
                         //add data for meta
                          if( index%2==0 ){			 
                              meta.addClass('fb5-left');		
                          }else{
                              meta.addClass('fb5-right');					 
                          }					
                    } 
            });
            
            
            //preloader start
            var preloader_visible=Book_v5.config['preloader_visible'];
            if( preloader_visible=="true"){
               $('.fb5-preloader').css('display','block');
            }
            
            WINDOW_WIDTH=$('#fb5').width();
            WINDOW_HEIGHT=$('#fb5').height();
            
            Book_v5.resize_input_text()
            Book_v5.book_area();
            $("#fb5").css('opacity','1');
            
                
            
            /* SCALE PAGE IN FLIPBOOK  /*/
            //size default for class .fb5-cont-page-book
            $("#fb5 .fb5-cont-page-book").css('width',(WIDTH_BOOK/2)+'px');
            $("#fb5 .fb5-cont-page-book").css('height',HEIGHT_BOOK+'px');
            $("#fb5 .fb5-cont-page-book").css({'transform-origin':'0 0','-ms-transform-origin':'0 0','-webkit-transform-origin':'0 0'});
            //size default for class .page_book
            var paddingL=WIDTH_BOOK*this.paddingL;
            var paddingR=WIDTH_BOOK*this.paddingR;
            var paddingT=WIDTH_BOOK*this.paddingT;
            var paddingB=WIDTH_BOOK*this.paddingB;
            $("#fb5 .fb5-page-book").css('width',(WIDTH_BOOK/2-(paddingL+paddingR))+'px');
            $("#fb5 .fb5-page-book").css('height',(HEIGHT_BOOK-(paddingT+paddingB))+'px');
            
            /* SCALE ABOUT near FLIPBOOK  /*/
            $("#fb5 #fb5-about").css('width',(WIDTH_BOOK/2)+'px');
            $("#fb5 #fb5-about").css('height',HEIGHT_BOOK+'px');
            if(RTL=='true'){
                $("#fb5 #fb5-about").css('right','0px');
                $("#fb5 #fb5-about").css({'transform-origin':'right 0','-ms-transform-origin':'right 0','-webkit-transform-origin':'right 0'});
            }else{
                $("#fb5 #fb5-about").css({'transform-origin':'0 0','-ms-transform-origin':'0 0','-webkit-transform-origin':'0 0'});
            }
            
            //run key
            this.key_down();    
    
            //show and hide full screen icon
            if( !Book_v5.support_fullscreen() ){
                $('li a.fb5-fullscreen').parent(this).remove();
            }
                 
        },
            
        load: function(){
            if( general.browser_firefox() ) {
               console.log('book:event load');
            }
            
            //preloader hide
            $('.fb5-preloader').css('display','none');
            
               $.address.strict(false)
            $.address.autoUpdate(true)
        
            $('#fb5-container-book').show();
            
            Book_v5.init();
        
            Book_v5.zoomAuto();
            
            Book_v5.book_position();
        
            Book_v5.dragdrop_init();
    
            Navigation_v5.init();
    
            Book_v5.resize_page();   
            
            if( TOOLS_VISIBLE == "true" ){
                $("#fb5 #fb5-footer").css('opacity','1');
            }
            
             //center icon
            Book_v5.center_icon();
            Book_v5.center_icon();
            Book_v5.media_queries()
       
             
        },
        
        check_platform:function(){		
            var platform="Unknown OS";
            if (navigator.platform.indexOf("Win")!=-1) platform="Windows";
            else if (navigator.platform.indexOf("Mac")!=-1) platform="MacOS";
            else if (navigator.platform.indexOf("X11")!=-1) platform="UNIX";
            else if (navigator.platform.indexOf("Linux")!=-1) platform="Linux";        	
            return platform;		
        },
        
        support_fullscreen:function(){
            
            ////not support from safari on Windows or MAC
            console.log(navigator.userAgent);
            var is_safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)
            var platform= Book_v5.check_platform();			
            if(  platform=='Windows' && is_safari ||  platform=='MacOS' && is_safari  ){
               return false;  	
            }
                
            //check support with plugin fullscreen		
            if( $.support.fullscreen ){
               return true;	// supportet
            }	
                        
            return false;
            
        },
        
    
            
        getLength:function(){		
            return $('#fb5-deeplinking ul li').length;		
        },
        
        center_icon:function(){
        
            //icon tools position
            var icon=$('#fb5-center');
            var all_width=$('#fb5').width();
            var left_w=$('#fb5-logo').width();
            var center_w=$('#fb5-center').width();
            var right_w=$('#fb5-right').width();
                    
            var posX=all_width/2-center_w/2;
            icon.css('left',posX+'px');
            
            
            
            
        },
        
        media_queries:function (){
                 
           //center
           var position_center=$('#fb5-center').position();
           var xMax_center=position_center.left+$('#fb5-center').width();
           var xMin_center=position_center.left
           //right
           var position_right=$('#fb5-right').position();
           var xMin_right=position_right.left;
           //left
           var position_left=$('#fb5-logo').position();
           var xMax_left=position_left.left+$('#fb5-logo').width();
                  
           if( xMax_center > xMin_right || xMax_left > xMin_center  ){
             $('#fb5 #fb5-right,#fb5 #fb5-logo').css('visibility','hidden');
           }else{
             $('#fb5 #fb5-right,#fb5 #fb5-logo').css('visibility','visible');
           }
    
    
        }, 
        
        autoMarginB:function(){
          return Math.round(  $('#fb5').height()*0.02 )
        },
        
        autoMarginT:function(){
            return Math.round( $('#fb5').height()*0.02 )    
        },
        
         autoMarginL:function(){
          return Math.round( $('#fb5').width()*0.02 )    
        },
        
         autoMarginR:function(){
           return Math.round(  $('#fb5').width()*0.02 )   
        },
        
        change_address:function(){
            
                            var th=this;
                            //console.log("book:change address")
                            //$('h1.entry-title').append(' /change ')
                            ///for slug
                            var slug=$.address.pathNames()[0];
                            if(th.tmp_slug!=undefined&&slug!=th.tmp_slug){			   			 
                              
                                 //setAddress('book5-1'); 
                                 setTimeout(function(){
                                 window.location.reload();
                                 },1);
                                 
                                 //console.log("book:change book")
                                 //$('h1.entry-title').append(' /change book ')
                                 
                                 $("#fb5").remove();
                                 // Ajax_v5.ready()
                                 return;						 
                             }
                           
                           th.tmp_slug=slug;
                        
                           //normal
                           var address=$.address.pathNames()[$.address.pathNames().length-1];
                           var results=$('#fb5-deeplinking ul li[data-address='+address+']');
                           var nrPage=results.attr('data-page')
                           if(RTL=='true'){
                               var nrPage =  ( Book_v5.getLength()+1 ) -results.attr('data-page');						
                           }
                           //error nr page
                           if(!nrPage){
                               if(RTL=='true'){
                                  nrPage=Book_v5.getLength();
                               }else{ 
                                  nrPage=1;   
                               }
                           }
                    
                           $('#fb5-book').turn('page',nrPage);
                           Book_v5.resize_page();
            
        },
        
        
        getCurrentPages:function(page){
            
                                if(page%2==0){
                                    var page_left=page
                                    var page_right=page+1
                                }else{
                                    var page_right=page
                                    var page_left=page-1							
                                }
                                /////if current page is page oldf
                                if(page_left==Book_v5.getLength()){
                                   page_right=null	
                                }
                                ////if current page is page first 
                                if(page_right==1){
                                   page_left=null	
                                }
                                
                                return {left:page_left,right:page_right}									
              
            
        },
        
        init: function() {
            
            var th=this;
            //this.on_start = true;
            
            
            if( SWF_ADDRESS=="true" ){
            
                    /* =  jQuery Addresss INIT
                    --------------------------*/
                    var current_address=$.address.pathNames()[$.address.pathNames().length-1];
                    BOOK_SLUG=$.address.pathNames()[0];
                    var results=$('#fb5-deeplinking ul li[data-address='+current_address+']');
                    var nrPage =   results.attr('data-page');
                    if(RTL=='true'){
                     var nrPage =   ( Book_v5.getLength()+1 ) -results.attr('data-page');						
                    }
                   
                    //error nr page
                    if(!nrPage){
                        if(RTL=='true'){
                             nrPage=Book_v5.getLength();
                         }else{ 
                             nrPage=1;   
                         }
                    }
                
            
                    /* =  jQuery Addresss CHANGE
                    --------------------------*/ 
                    $.address.change(function(event) {
                           th.change_address()     
                   })
                   
                   
           }
         
            
            $('#fb5-book').turn({
                display: 'double',
                acceleration: true,
                elevation:50,
                page:nrPage,
                when: {
                    first: function(e, page) {
                        $('.fb5-nav-arrow.prev').hide();
                    },
                    
                    turned: function(e, page) {
                        
                        if (page > 1) {
                            $('.fb5-nav-arrow.prev').fadeIn();
                            //$('#fb5-about').hide();
                        }
                        
                        if( (page==1&&RTL=='false') || ( page==$(this).turn('pages')&&RTL=='true') ){	
                            $('#fb5-about').css('z-index',11);
                        }						
                        
                        if ( page < $(this).turn('pages') ) {
                            $('.fb5-nav-arrow.next').fadeIn();
                        }
                                           
                        Book_v5.resize_page();
                        if(SWF_ADDRESS=="true"){
                           if(RTL=='true'){
                             setPage( new Number(page).rtl() )   
                           }else{
                             setPage(page);   
                           }
                               
                           th.tmp_slug=$.address.pathNames()[0]             
                        }
                        
                        
                        //add image required ( lazy loading )
                        if( Book_v5.config['lazy_loading_pages']=="true" ){
                                
                                //create array with list number pages for left and right side
                                var array_right=[];
                                var array_left=[];
                                
                                //get list requided number pages
                                var range = $(this).turn('range', page);
                                var _pages=[]
                                for (i = range[0]; i<=range[1]; i++){ 
                                     _pages.push(i)												 	
                                }							
                                
                                ////get curent page 'page_left' and 'page_right'
                                var page_left=Book_v5.getCurrentPages(page).left;
                                var page_right=Book_v5.getCurrentPages(page).right;								
                                                        
                                //create array pages for right side
                                if(page_right!=null){
                                    var index_right=$.inArray(page_right,_pages);
                                    var array_right=_pages.slice(index_right);
                                }
                                //createarray pages for left side
                                if(page_left!=null){
                                    var index_left=$.inArray(page_left,_pages)+1;
                                    var array_left=_pages.slice(0,index_left).reverse();
                                }
                                //contact array pages ( right+left )
                                var pages_new=[];
                                var first_left=array_left.shift();
                                if(first_left!=undefined){
                                    array_right.unshift(first_left);
                                }
                                
                                //combine two arrays
                                if( RTL == "true" ){
                                  pages_new=array_left.concat(array_right);
                                }else{
                                  pages_new=array_right.concat(array_left); 	
                                }
                                                                
                                //run lazy loading with array required pages						
                                Book_v5.lazy_loading( pages_new );
                                //console.log(pages_new);
                                
                        }		
                    },
                    
                    turning: function(e, page) {
                                
                        $('#fb5-about').css('z-index',5);
                        
                        
                    },
                    
                    last: function(e, page) {
                        $('.fb5-nav-arrow.next').hide();
                    }	
                }
            });
            Book_v5.arrows();
            
        },
        
        lazy_loading: function(pages_){	
        
            
                $.each(pages_, function(index, value) {
    
                    var element=$( '.turn-page.p'+(value) ); 				
                                                     
                    
                    //if( $(element).css('background-image')=='none'  ){		                                  
                    var src=element.attr('data-background-image');
                    if(src!='' && src!=undefined ){
                        //console.log("start loading = "+src);								
                        $('<img>').attr('src', src).load(function(){	
                             element.css('background-image', 'url("'+src+'")');
                        });	
                    
                    }
                    
                    ///change data-src for image in description for page
                    $('.fb5-page-book img',element).each(function(index, element) {
                        var data_src=$(element).attr('data-src');
                        $(element).attr('src',data_src);
                        
                    });		
    
                    //for Firefox  ( not load background image if display:none )
                    var el=element.parent()
                    if( el.css('display')=='none'  ){					
                        
                        el.css('opacity','0');
                        el.css('display','block')
                                            
                        setTimeout(function(){
                        el.css('display','none');
                        el.css('opacity','1');
                        },1);
                    }
                });
                    
            /* old method	
            $('.turn-page').each(function(index, element) { 
            
                                          
                    //if( $(element).css('background-image')=='none'  ){		                                  
                    var src=$(element).attr('data-background-image');								
                    $('<img>').attr('src', src).load(function(){	
                         $(element).css('background-image', 'url("'+src+'")');
                    });				
    
                    //for Firefox  ( not load background image if display:none )
                    var el=$(element).parent()
                    if( el.css('display')=='none'  ){					
                        
                        el.css('opacity','0');
                        el.css('display','block')
                                            
                        setTimeout(function(){
                        el.css('display','none');
                        el.css('opacity','1');
                        },1);
                    }
                                        
            });		
            /*/
            
        },
        
        corner_change:function(boolean_){
            //$('#fb5-book').turn("disable",boolean_);		
        },
            
        center: function (lightbox_) {
        
                var iframe=$('iframe',lightbox_);
                var old_w=iframe.attr("width");
                var old_h=iframe.attr("height");
                iframe.css("position","absolute");
        
                var stage_w=$(window).width();
                var stage_h=$(window).height();
                var delta_w=stage_w-old_w;
                var delta_h=stage_h-old_h
                
                if(delta_w<delta_h){
                    var new_w=$(window).width()-200;
                    var new_h=(new_w*old_h)/old_w
                }else{
                    var new_h=$(window).height()-200;
                    var new_w=(old_w*new_h)/old_h
                }
                iframe.attr("width", new_w);
                iframe.attr("height",new_h);
                
                var height=iframe.height();
                var width=iframe.width();
                iframe.css("top", ( $(window).height()/2 - height/2+"px"));
                iframe.css("left", ( $(window).width()/2 -width/2+"px"  ));
        },    
            
        key_down: function(){
            $(window).bind('keydown', function(e){
            if (e.keyCode==37)
                //$('#fb5-book').turn('previous');
                Book_v5.prevPage();
            else if (e.keyCode==39)
                //$('#fb5-book').turn('next');
                Book_v5.nextPage();
    
            });	
        },
    
        resize_input_text: function (){
            var input=$('#fb5-page-number');
            var btn=$('div#fb5-right button');
            input.css('width',GOTOPAGE_WIDTH);
            input.css('padding-right',btn.width()+2);
        }, 
    
        is_iPad_iPhone: function (){
           return ( (navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1)  );
        },
        
        is_iPhone: function (orient_){
           if(  (navigator.platform.indexOf("iPhone") != -1)   ){
                 if(orient_=="Landscape"){
                    
                    if( $(window).width() > $(window).height() ){
                        return true;
                    }else{
                        return false;
                    }
                     
                 }else if(orient_=="Portrait"){
                     
                     if( $(window).width() < $(window).height() ){
                        return true;
                    }else{
                        return false;
                    }
                     
                 }else if(orient_==undefined){
                    return true; 
                 }
               
           }
        },
    
        arrows: function() {
            $('.fb5-nav-arrow.prev').click(function() {
                //$('#fb5-book').turn('previous');
                Book_v5.prevPage();
                Book_v5.resize_page()
            });
            $('.fb5-nav-arrow.next').click(function() {
                //$('#fb5-book').turn('next');
                Book_v5.nextPage();
                Book_v5.resize_page()
            });
        },
        
        nextPage:function(){
          
         $('#fb5-book').turn('next');
        
        },
        
        prevPage:function(){
        
          $('#fb5-book').turn('previous');
          
        
        },
        
        setAutoWidthSlider:function(){
            
            var summary = 0;
            $('#fb5-slider li').each(function() {
                li_width = $(this).outerWidth();
                summary += li_width;
            })	
            $('#fb5-slider').css('width', summary);
            this.width_slider=summary;
            return this.width_slider
            
        },
    
        all_pages: function() {
            
            //remove corner
            Book_v5.corner_change(true);     
            
            //start load images
            if(!this.load_one_thumbs){
                
                    $('#fb5-all-pages li img').each(function(index, element) { 
                                    
                            var el=$(element);                            
                            var src=el.attr('data-src');		
                                            
                            if( el.attr('src')==undefined  ){
                            
                                    setTimeout( function(){
                                                                
                                            $('<img>').attr('src',src).load(function(){	
                                                el.css('opacity',0).animate({'opacity':1});
                                                el.attr('src',src);
                                                Book_v5.setAutoWidthSlider()
                                            });				
                                    
                                    },index*200)				
                            }
                    });	
            this.load_one_thumbs=1;
            }
            
                 
            ///height thumbs
            var cont_thumbs=$('#fb5-all-pages .fb5-container-pages');
            var area_height=$('#fb5').height()-this.toolsHeight;
            var height_container=area_height*80/100;
            if(height_container>225){
              height_container=225;
            }
            cont_thumbs.css('height',height_container+'px');
            //position thumbs
            var _top=( (area_height/2) -  ( (cont_thumbs.outerHeight())/2   )  )
            cont_thumbs.css('top',_top+'px');
         
            
            var self = this;
            Book_v5.setAutoWidthSlider();	
            
                    
        
            $("#fb5-menu-holder").mousemove(function(e) {
            
            ///////////////////////////////////////////
                                 
                if ( $(this).width() < $("#fb5-slider").width() ) {
                     var distance = e.pageX - $(this).offset().left;
                    var percentage = distance / $(this).width();
                    var targetX = -Math.round(($("#fb5-slider").width() - $(this).width()) * percentage);
                    $('#fb5-slider').animate({left: [targetX+"px",'easeOutCubic']  }, { queue:false, duration: 200 });
                }
            });
    
            //////////////////////SWIPE
            if(self.events_thumbs!=1){
            $('#fb5-all-pages .fb5-container-pages').bind("touchstart", function(e) {
                   
                  
                   
                   $('#fb5-slider').stop();
                   
                   //time
                   self.time_start=new Date().getTime();
                   self.time_move_old=self.time_start;
                   
                   //road
                   self.x_start = e.originalEvent.targetTouches[0].pageX;
                   self.x_move=undefined;
                   self.x_move_old=self.x_start;
                   
                   //remove default action
                   e.preventDefault(e); 
                   
            });
            
            
                    
            $('#fb5-all-pages .fb5-container-pages').bind("touchmove", function(e) {
                           
                          
                    //current round and time
                    self.x_move = e.originalEvent.targetTouches[0].pageX;  
                    self.time_move=new Date().getTime();
                                            
                    //time - delta
                    self.delta_t=new Date().getTime()-self.time_move_old;
                    self.time_move_old=new Date().getTime();                
                                            
                    //round- delta
                    self.delta_s=self.x_move-self.x_move_old;
                    self.x_move_old=self.x_move;
                        
                    //set position thumbs
                    self.current_x=parseInt( $('#fb5-slider').css('left') ); 
                    var new_position=self.current_x+self.delta_s;
                    if(new_position>0){ new_position=0 }   
                    var minX=-Book_v5.width_slider+WINDOW_WIDTH;
                    if(new_position<minX ){new_position=minX}
                    $('#fb5-slider').css({left:new_position});
                  
                    //remove default action
                    e.preventDefault(e);       
                    
                             
             });
             
             $('#fb5-all-pages .fb5-container-pages li').bind("touchend", function(e) {   
                                                
                   //calculation speed                 
                   var v=self.delta_s/self.delta_t;
                   var s= ( WINDOW_WIDTH*0.25 )*v; 
                   var t=Math.abs(s/v);
                
                   //set position thumbs
                   var new_position=self.current_x+s
                   if(new_position>0){new_position=0}   
                   var minX=-Book_v5.width_slider+WINDOW_WIDTH;
                   if(new_position<minX ){new_position=minX } 
                 
                   if( Math.abs( self.delta_s ) > 5){
                     
                     
                       $('#fb5-slider').animate({ left:[new_position+"px","easeOutCubic"]  },t); 
                        
                                  
                   }			    
                                   
                   //redirect to page	     
                   if( self.x_move==undefined ){
                         var page_index = $(this).attr('class');
                         var tmp = parseInt(page_index);		
                         setPageTurn(tmp)
                         setTimeout(function(){					   
                            close_overlay();
                         },200);
                    }
                               
                  //e.preventDefault(e);
     
            });		
            //////////////////////end SWIPE
            self.events_thumbs=1;
            }        
            
            
            ////redirect to click thumbs ( not work in IPhone )
            if ( !Book_v5.is_iPad_iPhone() ) {
                $('#fb5-slider li').bind('click',function() {
                    self.x_start=null;
                    self.x_move=null;
                    $('#fb5-slider').stop();
                    var page_index = $(this).attr('class');
                    var tmp = parseInt(page_index);
                    
                    close_overlay();				
                    
                    setTimeout(function(){					  
                        setPage(tmp); 
                    },200);
        
                })
            }
    
            $(document).on('click',function(e) {
                var target = $(e.target);
                if ( target.hasClass('fb5-overlay') ) close_overlay();
            });
            
           
        
        },
    
        book_grab: function() {		
            $('#fb5-container-book').css('cursor', '-webkit-grab');
            $('#fb5-container-book').css('cursor', '-moz-grab');	
        },
    
        book_grabbing: function() {		
            $('#fb5-container-book').css('cursor', '-webkit-grabbing');
            $('#fb5-container-book').css('cursor', '-moz-grabbing');
        },
        
        book_area: function(){
            
            var width_book=$('#fb5').width();
                    
            ///if(IS_AS_TEMPLATE==true){
               // var height=$(window).height()+"px";
            //}else{
                //var height=(width_book*HEIGHT_BOOK/WIDTH_BOOK)+this.toolsHeight+"px";
            ///}
            
            if(IS_AS_TEMPLATE=="true"){
               var height=($(window).height())+"px";
               if( Book_v5.is_iPhone("Landscape") ){
                       height=(window.innerHeight+1)+"px";	 
               }
            }else{
            
               if( $('#fb5').hasClass('fullScreen') ){
                  var height=$(window).height()+"px";
               }else{           
                  var height=(width_book*HEIGHT_BOOK/WIDTH_BOOK)+this.toolsHeight+"px";
               }
                         
            }
            
            
             
             $("#fb5").css('height',height);
            
        },
        
        ///current width book
        widthBook:  function(){
             return $('#fb5-container-book').width();   
        },
        
        //current height book
        heightBook: function(){
             return $('#fb5-container-book').height();    
        },
    
        book_position: function() {
        
      
            var book_height	= this.heightBook();
            var book_width	= this.widthBook();
            
            var half_height	= (  (book_height/2)+this.toolsHeight/2   );
            var half_width	= (  book_width/2 );
            
            var x=$('#fb5').width()/2-half_width;
            var y=$('#fb5').height()/2-half_height;
            $('#fb5-container-book').css({ left: x, top:y });
            
            /*footer position/*/
            var new_y=book_height+this.autoMarginT()+this.autoMarginB();
            //$("#fb5-footer").css({top:new_y+'px'});
            //$("#fb5").css('height',new_y+this.toolsHeight);
            
        },
        
        touchstart_book:function(e){
        
           this.book_x = e.originalEvent.touches[0].pageX;
           this.book_y = e.originalEvent.touches[0].pageY;
             
        },
        
        touchmove_book:function(e){
        
            //delta x
            this.book_x_delta=e.originalEvent.touches[0].pageX-this.book_x;
            this.book_x=e.originalEvent.touches[0].pageX;
            
            //delta y
            this.book_y_delta=e.originalEvent.touches[0].pageY-this.book_y;
            this.book_y=e.originalEvent.touches[0].pageY;
            
                    
            var current_x= parseInt(  $('#fb5-container-book').css('left')  )
            var current_y= parseInt(  $('#fb5-container-book').css('top')  )
            
            var x=current_x+this.book_x_delta;
            var y=current_y+this.book_y_delta;
            $('#fb5-container-book').css( {left:x,top:y } ); 
            
            e.preventDefault();
            
            
            
            //var t=e.originalEvent.changedTouches[0].pageX
            
            //alert("move");
        
        },
        touchend_book:function(e){
        
        
            
               
        },    
    
        drag: function(e) {
            
            var el = $(this);
            var dragged = el.addClass('draggable');
    
            $('#fb5-container-book').unbind('mousemove');
            $('#fb5-container-book').bind('mousemove', Book_v5.book_grabbing);
            
    
            var d_h = dragged.outerHeight();
            var d_w = dragged.outerWidth();
            var pos_y = dragged.offset().top + d_h - e.pageY;
            var pos_x = dragged.offset().left + d_w - e.pageX;
            
            dragged.parents().unbind("mousemove");
            dragged.parents().bind("mousemove", function(e) {
                $('.draggable').offset({
                    top:e.pageY + pos_y - d_h,
                    left:e.pageX + pos_x - d_w
                });
            });
            e.preventDefault();
        },
        
        drop: function() {
            Book_v5.book_grab();
            $('#fb5-container-book').bind('mousemove', Book_v5.book_grab);
            $('#fb5-container-book').removeClass('draggable');
        },
        
        checkScrollBook: function () {
          
          var vertical=$('#fb5-book').height() > $("#fb5").height() - this.toolsHeight;
          var horizontal=$('#fb5-book').width() > $("#fb5").width() - (this.arrow_width*2);
          
         
          if ( vertical || horizontal ) {
            higherThanWindow = true;
          } else {
            higherThanWindow = false;
          }
           return higherThanWindow;
        },
    
        dragdrop_init: function() {
            this.checkScrollBook();
    
            if ( higherThanWindow == false ) {
                //mobile
                $('#fb5-container-book').unbind('touchstart', Book_v5.touchstart_book);
                $('#fb5-container-book').unbind('touchmove', Book_v5.touchmove_book);
                $('#fb5-container-book').unbind('touchend', Book_v5.touchend_book);    
                
            
                $('#fb5-container-book').unbind('mousedown', Book_v5.drag);
                $('#fb5-container-book').unbind('mouseup', Book_v5.drop);
                $('#fb5-container-book').unbind('mousemove', Book_v5.book_grab);
                $('#fb5-container-book').unbind('mousemove', Book_v5.book_grabbing);
                $('#fb5-container-book').css('cursor', 'default');
            } else {
                //mobile
                $('#fb5-container-book').bind('touchstart', Book_v5.touchstart_book);
                $('#fb5-container-book').bind('touchmove', Book_v5.touchmove_book);
                $('#fb5-container-book').bind('touchend', Book_v5.touchend_book);
                
                $('#fb5-container-book').bind('mousedown', Book_v5.drag);
                $('#fb5-container-book').bind('mouseup', Book_v5.drop);
                $('#fb5-container-book').bind('mousemove', Book_v5.book_grab);
                Book_v5.book_grab();
            }
            Book_v5.resize_page();
        },
        
        scaleStart: function() {
            //if ( this.on_start == true ) {
                this.checkScrollBook();			
                //this.on_start = false;
            //}
        },
        
        setSize:function(w_,h_){
        
           $('#fb5-container-book').css({ width:w_, height:h_ });
           $('#fb5-book').turn('size',w_,h_);
        
        },
        
        zoomTo:function(zoom_){
           
           this.zoom=zoom_;
             
           var new_width=(WIDTH_BOOK*this.zoom);
           var new_height=(HEIGHT_BOOK*this.zoom);
           
          
           this.setSize(new_width,new_height);
           this.scale_arrows()
           
           this.book_position();
           Book_v5.dragdrop_init();
           Book_v5.resize_page()
          
           
        },
        
        zoomOriginal:function(){
        
            this.zoomTo(1);
                 
        },   
       
        scale_arrows:function(){
           
           var HEIGHT_ARROW=136;
           var WIDTH_ARROW=34;
           
           var height_arrow=this.heightBook()*0.45;
           if( height_arrow > 136 ){
             height_arrow=136;
           }
            
           
           var width_arrow= (height_arrow*WIDTH_ARROW)/HEIGHT_ARROW;
          
           this.zoom_arrows=height_arrow/HEIGHT_ARROW;   
             
                               $('.fb5-nav-arrow').css({'transform':'scale('+this.zoom_arrows+')','-ms-transform':'scale('+this.zoom_arrows+')','-webkit-transform':'scale('+this.zoom_arrows+')'});    
        },
        
        zoomAuto: function() {
                    
            Book_v5.scaleStart();	
            
              
            ////resize one 
            var zoom=this.getAutoZoomBook(0);   
            this.zoomTo( zoom  ) 
              
            ////resize two (with arrow)
            this.scale_arrows();
            var arrow_width=$('.fb5-nav-arrow').width()*this.zoom_arrows; 
            this.arrow_width=arrow_width;
            var zoom=this.getAutoZoomBook(arrow_width*2);
            //calculate optimal zoom
            zoom=Math.round(zoom * 100) / 100
            var percent=zoom*100;
            if(percent%2!=0){
              zoom=zoom-0.01;
            }
               this.zoomTo( zoom   )
    
            Book_v5.resize_page()
          
        },
             
        getAutoZoomBook: function(arrow_width_){
           
            var book_width=this.widthBook();
            var book_height=this.heightBook();
            var screen_width	=  $("#fb5").width()-  ( this.autoMarginL()+this.autoMarginR() + (arrow_width_) );
            var screen_height	= $("#fb5").height()-this.toolsHeight-( this.autoMarginT()+this.autoMarginB()  )
     
            
            if(screen_width>WIDTH_BOOK){
              screen_width=WIDTH_BOOK	
            }
            
            if(screen_height>HEIGHT_BOOK){
              screen_height=HEIGHT_BOOK	
            }
            
            
            var scaleW=screen_width/book_width;
            var scaleH=screen_height/book_height;
            
            var scale=Math.min(scaleW,scaleH)	
            var new_width		= book_width*scale;
            var new_height		= book_height*scale;
            var auto_zoom= new_width/WIDTH_BOOK
            return auto_zoom;
        
        },
    
        zoomIn: function() {
           var zoom=this.zoom;  
           
            
           this.zoomTo(zoom+ZOOM_STEP  );
        },
        
        zoomOut: function() {
           this.zoomTo( this.zoom-ZOOM_STEP );
        },
        
        resize_page: function (){
            
             /* RESIZE PAGE IN FLIPBOOK  /*/
             //resize class .fb5-page-book
             var page_width=this.widthBook()/2;
             var width_current_page=(page_width)
             var width_orginal_page=  ( WIDTH_BOOK/2 )     
             var zoom= (width_current_page / width_orginal_page);
             $('.fb5-cont-page-book').css({'transform':'scale('+zoom+')','-ms-transform':'scale('+zoom+')','-webkit-transform':'scale('+zoom+')'});
             ///center class .fb5-page-book
             var paddingL=(this.widthBook()*this.paddingL)/zoom;
             var paddingT=(this.widthBook()*this.paddingT)/zoom;
             $('.fb5-page-book').css({'left':paddingL+'px','top':paddingT+'px'});
                
             /* RESIZE ABOUT IN FLIPBOOK  /*/
             $('#fb5-about').css({'transform':'scale('+zoom+')','-ms-transform':'scale('+zoom+')','-webkit-transform':'scale('+zoom+')'});
             //padding top
             var padding_top=(this.heightBook()*0.05);
             $('#fb5-about').css('top',padding_top+'px');
             //height
             var height=(this.heightBook()-( padding_top*2) )/zoom;
             $('#fb5-about').css('height',height+'px');
             //width
             var width=(  (this.widthBook()/2)-( this.widthBook()*0.05  ) )/zoom;
             $('#fb5-about').css('width',width+'px');
             
             
             //CENTER VERTICAL FOR HOME PAGE
             //var posY=$('.fb5-page-book').height()/2 - $('#fb5 #fb5-cover ul').innerHeight()/2;
             //$('#fb5 #fb5-cover ul').css('top',posY+'px');
             
             
        },
        
        resize_font:  function($size_original_,path_){
            var w=this.widthBook();
            var size= ($size_original_*w)/WIDTH_BOOK;
            var new_size=Math.round(parseInt(size))+"px";
            ///$(path_).css('font-size',new_size);
            ///$(path_).css('line-height',new_size);
            $(path_).css('font-size',$size_original_+"px");
            $(path_).css('line-height',$size_original_+"px");
        }
    }
    
    
    /* =  Navigation
    --------------------------*/
    
    var Navigation_v5 = {
        
        tooltip: function() {
        
        
            $('.fb5-menu li').filter(':not(.fb5-goto)').each(function() {
                var description = $('a', this).attr('title');
                var tooltip = '<span class="fb5-tooltip">'+description+'<b></b></span>';
                $('a', this).removeAttr("title");
                $(this).append(tooltip);
            });
            
            $('.fb5-menu li').mousemove(function(e) {
                            
                var tooltip=$('.fb5-tooltip', this);
                var offset = $(this).offset(); 
                var relY = e.pageY - offset.top;
                var x2= e.pageX-$('#fb5').offset().left+tooltip.width()  
                var width_area=$('#fb5').width()
                
                if( (x2+10)>width_area){
                    var orient="right";
                }else{
                    var orient="left";
                }
                
                if(orient=="left"){
                     var relX = e.pageX - offset.left;
                    $('#fb5 .fb5-tooltip b').css('left','6px')
                }else{
                    var relX = e.pageX - offset.left-tooltip.width()-5;
                    $('#fb5 .fb5-tooltip b').css('left',(tooltip.width()+6)+'px') 
                }			            
                
                //$('.fb5-tooltip', this).html( x2+" > "+width_area  );
                $('.fb5-tooltip', this).css({ left: relX, top: relY-45 });
            })
            
            $('.fb5-menu li').hover(function() { 
                $('.fb5-tooltip').stop();
                $('.fb5-tooltip', this).fadeIn();
            }, function() {
                $('.fb5-tooltip').hide();
            });
            
            Book_v5.resize_page()
    
        },
    
    
        ///event mouse down in book 
        book_mouse_down: function(){
                   $('#fb5-about').css('z-index',5);
                //Book_v5.resize_page();
        },
        
        book_mouse_up: function(e){
             var offset = $(this).offset();
             var relativeX = (e.pageX - offset.left);
             if( relativeX > ( WIDTH_BOOK / 2 )  ){
                //$('#fb5-about').css('z-index',11); 
             }
            
        },
    
        init: function() {
    
            // Double Click
            if(ZOOM_DOUBLE_CLICK_ENABLED=="true"){
            $('#fb5-book').dblclick(function() {
                           
                if(Book_v5.checkScrollBook()==false){ //zoom
                     Book_v5.zoomTo(ZOOM_DOUBLE_CLICK)
                }else{
                   Book_v5.zoomAuto();
                   $('#fb5-container-book').css('cursor', 'default');
                }
            });
            }
    
    
        //full screen
        $('.fb5-fullscreen').on('click', function() {
                
         $('.fb5-tooltip').hide();
         
         $('#fb5').fullScreen({
             
             'callback': function(isFullScreen){
             
               Book_v5.book_area();
               Book_v5.zoomAuto();
               Book_v5.center_icon();
             
                 if(isFullScreen){
                    
                 }else{
                    
                 }
            
              }
             });
             e.preventDefault();
                
          });
             
             
            //download
            
             
             
             $('.fb5-download').on('click', function(event) {
              
             
              
             
             
              //$.address.update();
             // event.preventDefault();
              
            }); 
    
            // Home 
            $('.fb5-home').on('click', function() {     	  
              setPageTurn(1);
              //setAddress('book5-1');		  
            });
        
            // Zoom Original
            $('.fb5-zoom-original').click(function() {
                
    
                Book_v5.zoomOriginal();
          
                
            });
        
            // Zoom Auto
            $('.fb5-zoom-auto').on('click', function() {
                Book_v5.zoomAuto();
            });
    
            // Zoom In
            $('.fb5-zoom-in').on('click', function() {
                
                    Book_v5.zoomIn();
                    
                                
            });
        
            // Zoom Out
            $('.fb5-zoom-out').on('click', function() {
                
                    Book_v5.zoomOut();
                    
            });
    
            // All Pages
            $('.fb5-show-all').on('click', function() {
                $('#fb5-all-pages').
                    addClass('active').
                    css('opacity', 0).
                    animate({ opacity: 1 }, 1000);
                Book_v5.all_pages();
                return false;
            })
            
            // Goto Page
            $('#fb5-page-number').keydown(function(e) {
                if (e.keyCode == 13) {
                   setPageTurn( $('#fb5-page-number').val() );
                }
            });
            
            $('.fb5-goto button').click(function(e) {
                setPageTurn( $('#fb5-page-number').val() );
            });
    
    
            // Contact
            $('.contact').click(function() {
                $('#fb5-contact').addClass('active').animate({ opacity: 1 }, 1000);
                contact_form();
                clear_on_focus();
                return false;
            })
            
            //change z-index in about
            $('#fb5-book').bind('mousedown',this.book_mouse_down);
            $('#fb5-book').bind('mouseup',this.book_mouse_up);
            if (Book_v5.is_iPad_iPhone()) {//for IPhone		
            $('#fb5-book').bind('touchstart',this.book_mouse_down);
            $('#fb5-book').bind('touchend',this.book_mouse_up);
            }
    
            //show tooltip for icon
            if ( !Book_v5.is_iPad_iPhone() && TOOL_TIP_VISIBLE=="true" ) {
                this.tooltip();
            }
        }
    }
    
     
    /* = CONTACT FORM
    --------------------------*/
    
    function clear_on_focus() {
        $('input[type="text"], input[type="password"], textarea').each( function() {
            var startValue = $(this).val();
            $.data(this, "startValue", startValue);	
            this.value=startValue;
        })
    
        $('input[type="text"], input[type="password"], textarea').focus(function() {
            var startValue = $.data(this, "startValue");		
            if ( this.value == startValue ) {
                this.value = '';
            }
        });
        $('input[type="text"], input[type="password"], textarea').blur(function() {
            var startValue = $.data(this, "startValue");
            if ( this.value == '' ) {
                this.value = startValue;
            }
        })
    }
    
    
    function close_overlay() {
        $('.fb5-overlay').removeClass('active');
        setTimeout(function(){
        Book_v5.corner_change(false);
        },1000);
    }
    
    
    function contact_form() {
    
        $('#fb5-contact .req').each(function() {
            var startValue = $(this).val();
            $.data(this, "startValue", startValue);
        });
    
        $('#fb5-contact button[type="submit"]').click(function() {
    
            $('#fb5-contact .req').removeClass('fb5-error');
            $('#fb5-contact button').fadeOut('fast');
    
            var isError = 0;
    
            // Get the data from the form
            var name	= $('#fb5-contact #fb5-form-name').val();
            var email	= $('#fb5-contact #fb5-form-email').val();
            var message	= $('#fb5-contact #fb5-form-message').val();
    
            // Validate the data
            $('#fb5-contact .req').each(function() {
                var startValue = jQuery.data(this, "startValue");
                if ( ($(this).val() == '') || (this.value == startValue) ) {
                    $(this).addClass('fb5-error');
                    isError = 1;
                }
            });
    
            var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(email)==false) {
                $('#fb5-contact #fb5-form-email').addClass('fb5-error');
                isError=1;
            }
    
            // Terminate the script if an error is found
            if (isError == 1) {
                $('#fb5-contact button').fadeIn('fast');
                return false;
            }
    
            $.ajaxSetup ({
                cache: false
            });
    
            var _email=Book_v5.config['email_form']; 
            var dataString = 'name='+ name + '&email=' + email + '&message=' + message+'&_email='+_email;  
            
            $.ajax({
                type: "POST",
                url: 	"php/submit-form-ajax.php",
                data: dataString,
                success: function(msg) {
                    
                    // Check to see if the mail was successfully sent
                    if (msg == 'Mail sent') {
                        $("#fb5-contact fieldset").hide();
                        $("#fb5-contact fieldset.fb5-thanks").show();
                        
                        setTimeout(function() {
                            close_overlay();
                        }, 5000);
                        
                    } else {
                        $('#fb5-contact button').fadeIn('fast');
                        alert('The problem with sending it, please try again!');
                    }
                },
    
                error: function(ob,errStr) {
                    alert('The problem with sending it, please try again.');
                }
            });
            return false;
        });
    
        $('#fb5-contact .fb5-close').click(function() {
            close_overlay();
        })
    }
    
    
    /*
     * $ Easing v1.3 - http://gsgd.co.uk/sandbox/$/easing/
     *
     * Uses the built in easing capabilities added In $ 1.1
     * to offer multiple easing options
    */
    
    $.easing["jswing"]=$.easing["swing"];$.extend($.easing,{def:"easeOutQuad",swing:function(a,b,c,d,e){return $.easing[$.easing.def](a,b,c,d,e)},easeInQuad:function(a,b,c,d,e){return d*(b/=e)*b+c},easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c},easeInOutQuad:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b+c;return-d/2*(--b*(b-2)-1)+c},easeInCubic:function(a,b,c,d,e){return d*(b/=e)*b*b+c},easeOutCubic:function(a,b,c,d,e){return d*((b=b/e-1)*b*b+1)+c},easeInOutCubic:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b+c;return d/2*((b-=2)*b*b+2)+c},easeInQuart:function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},easeOutQuart:function(a,b,c,d,e){return-d*((b=b/e-1)*b*b*b-1)+c},easeInOutQuart:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b+c;return-d/2*((b-=2)*b*b*b-2)+c},easeInQuint:function(a,b,c,d,e){return d*(b/=e)*b*b*b*b+c},easeOutQuint:function(a,b,c,d,e){return d*((b=b/e-1)*b*b*b*b+1)+c},easeInOutQuint:function(a,b,c,d,e){if((b/=e/2)<1)return d/2*b*b*b*b*b+c;return d/2*((b-=2)*b*b*b*b+2)+c},easeInSine:function(a,b,c,d,e){return-d*Math.cos(b/e*(Math.PI/2))+d+c},easeOutSine:function(a,b,c,d,e){return d*Math.sin(b/e*(Math.PI/2))+c},easeInOutSine:function(a,b,c,d,e){return-d/2*(Math.cos(Math.PI*b/e)-1)+c},easeInExpo:function(a,b,c,d,e){return b==0?c:d*Math.pow(2,10*(b/e-1))+c},easeOutExpo:function(a,b,c,d,e){return b==e?c+d:d*(-Math.pow(2,-10*b/e)+1)+c},easeInOutExpo:function(a,b,c,d,e){if(b==0)return c;if(b==e)return c+d;if((b/=e/2)<1)return d/2*Math.pow(2,10*(b-1))+c;return d/2*(-Math.pow(2,-10*--b)+2)+c},easeInCirc:function(a,b,c,d,e){return-d*(Math.sqrt(1-(b/=e)*b)-1)+c},easeOutCirc:function(a,b,c,d,e){return d*Math.sqrt(1-(b=b/e-1)*b)+c},easeInOutCirc:function(a,b,c,d,e){if((b/=e/2)<1)return-d/2*(Math.sqrt(1-b*b)-1)+c;return d/2*(Math.sqrt(1-(b-=2)*b)+1)+c},easeInElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return-(h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g))+c},easeOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e)==1)return c+d;if(!g)g=e*.3;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);return h*Math.pow(2,-10*b)*Math.sin((b*e-f)*2*Math.PI/g)+d+c},easeInOutElastic:function(a,b,c,d,e){var f=1.70158;var g=0;var h=d;if(b==0)return c;if((b/=e/2)==2)return c+d;if(!g)g=e*.3*1.5;if(h<Math.abs(d)){h=d;var f=g/4}else var f=g/(2*Math.PI)*Math.asin(d/h);if(b<1)return-.5*h*Math.pow(2,10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)+c;return h*Math.pow(2,-10*(b-=1))*Math.sin((b*e-f)*2*Math.PI/g)*.5+d+c},easeInBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*(b/=e)*b*((f+1)*b-f)+c},easeOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;return d*((b=b/e-1)*b*((f+1)*b+f)+1)+c},easeInOutBack:function(a,b,c,d,e,f){if(f==undefined)f=1.70158;if((b/=e/2)<1)return d/2*b*b*(((f*=1.525)+1)*b-f)+c;return d/2*((b-=2)*b*(((f*=1.525)+1)*b+f)+2)+c},easeInBounce:function(a,b,c,d,e){return d-$.easing.easeOutBounce(a,e-b,0,d,e)+c},easeOutBounce:function(a,b,c,d,e){if((b/=e)<1/2.75){return d*7.5625*b*b+c}else if(b<2/2.75){return d*(7.5625*(b-=1.5/2.75)*b+.75)+c}else if(b<2.5/2.75){return d*(7.5625*(b-=2.25/2.75)*b+.9375)+c}else{return d*(7.5625*(b-=2.625/2.75)*b+.984375)+c}},easeInOutBounce:function(a,b,c,d,e){if(b<e/2)return $.easing.easeInBounce(a,b*2,0,d,e)*.5+c;return $.easing.easeOutBounce(a,b*2-e,0,d,e)*.5+d*.5+c}})
    
    
    
    
    })(jQuery)
    
    
    
     
    