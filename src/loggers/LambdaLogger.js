'use strict'

const path   = require( 'path' )
const printf = require( 'printf' );

class LambdaLogger {

    constructor( mod ) {
        this.levels = [ 'none', 'trace', 'debug', 'info', 'warn', 'error' ]

        global.LambdaLogger = global.LambdaLogger || {}
        this.context        = global.LambdaLogger.context = global.LambdaLogger.context || {}
        this.level   = global.LambdaLogger.level || 'info'
        this.pattern = global.LambdaLogger.pattern = global.LambdaLogger.pattern || '%(ms)d [%(level)5s] %(modname)s %(m)s'

        if ( typeof mod === 'string' ) this.modname = mod
        else if ( typeof mod === 'object' && 'parent' in mod ) {
            const filename = mod && mod.id && mod.id.split( path.sep ).pop() || 'unknown'
            const regex    = /(.*)\.[^.]+$/.exec( filename )
            this.modname   = regex[ 1 ] || filename
        }
        else this.modname = ''

        this.timers = {}
    }

    setContext( prop, value ) {
        if ( arguments.length > 1 && typeof prop === 'string' ) {
            this.context[ prop ] = value
            return this
        }
    }

    unsetContext( prop ) {
        if ( arguments.length === 1 && typeof prop === 'string' ) {
            delete this.context[ prop ]
            return this
        }
    }

    get level() {
        return global.LambdaLogger.level
    }

    set level( value ) {
        value = value.toLowerCase()
        if ( global.LambdaLogger.level !== value ) {
            const intLevel = this.levels.indexOf( value )
            if ( intLevel < 0 ) throw new Error( `Invalid logging level (${value})` )
            global.LambdaLogger.level    = value
            global.LambdaLogger.intLevel = intLevel
        }
    }

    get pattern() {
        return global.LambdaLogger.pattern
    }

    set pattern( value ) {
        global.LambdaLogger.pattern = value
    }

    moduleName( name ) {
        return new this( name )
    }

    output( args ) {
        console.log( printf( this.pattern, args ) )
    }

    log() {
        if ( global.LambdaLogger.intLevel === 0 ) return

        const args     = Array.from( arguments )
        const level    = args.shift()
        const intLevel = this.levels.indexOf( level )
        if ( intLevel < 0 ) throw new Error( `Invalid logging level (${level})` )
        if ( intLevel === 0 ) return

        if ( intLevel >= global.LambdaLogger.intLevel ) {
            // arguments to log can be a single string, or a printf pattern followed by args
            const m = args.length > 1 && typeof args[ 0 ] === 'string'
                ? printf.apply( null, args ) : args[ 0 ]

            const now = new Date()
            this.output( {
                now: now,
                ms: now.getTime(),
                utc: now.toISOString(),
                level: level,
                m: m,
                modname: this.modname,
                context: this.context
            } )
        }
    }

    trace() {
        this.log.apply( this, [ 'trace' ].concat( Array.from( arguments ) ) )
    }

    debug() {
        this.log.apply( this, [ 'debug' ].concat( Array.from( arguments ) ) )
    }

    info() {
        this.log.apply( this, [ 'info' ].concat( Array.from( arguments ) ) )
    }

    warn() {
        this.log.apply( this, [ 'warn' ].concat( Array.from( arguments ) ) )
    }

    error() {
        this.log.apply( this, [ 'error' ].concat( Array.from( arguments ) ) )
    }

    time( level, label ) {
        if (arguments.length === 1) {
            label = level
            level = 'debug'
        }
        this.timers[ label ] = {
            now: new Date().getTime(),
            level: level
        }
    }

    timeEnd( label ) {
        const value = this.timers[label]
        if (value) {
            this.log( value.level, label + ': ' + new Date().getTime() - value.now + 'ms')
            delete this.timers[label]
        }
    }
}

module.exports = LambdaLogger

