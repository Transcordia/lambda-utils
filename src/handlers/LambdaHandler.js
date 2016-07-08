'use strict'

class LambdaHandler {

    constructor( log ) {
        this.handler = this.handle.bind( this )
        this.console = log || console
    }

    handle( event, context, callback ) {
        this.console.time( 'debug', 'handle' )
        const payload = this.prehandle( event, context )
        return this.process( payload, context )
            .then( this.succeed( context ).bind( this ) )
            .catch( this.fail( context ).bind( this ) )
            .finally( () => {
                this.console.timeEnd( 'handle' )
            } )
    }

    prehandle( event, context ) {
        return event
    }

    process( payload, context ) {
        return Promise.resolve( 'success' )
    }

    succeed( context ) {
        return result => {
            this.console.log( 'trace', result )
            context.succeed( result )
        }
    }

    fail( context ) {
        return error => {
            if ( error instanceof LambdaError ) {
                this.console.log( 'error', error.toJSON() )
                return context.fail( JSON.stringify( error.toJSON() ) )
            }
            context.fail( error )
        }
    }
}

module.exports = LambdaHandler