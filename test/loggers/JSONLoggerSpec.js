'use strict'

const chai      = require( 'chai' )
const sinon     = require( 'sinon' )
const sinonChai = require( 'sinon-chai' )

chai.use( sinonChai )
chai.should()

const libpath = '../..'

describe( 'JSONLoggerSpec', () => {

    beforeEach( () => {
        sinon.spy( console, 'log' );
    } )

    afterEach( () => {
        console.log.restore()

        // Clear the require cache, so require() forces a new load of class
        Object.keys( require.cache ).forEach( function ( key ) {
            delete require.cache[ key ]
        } )

        // Clear the global object to reset the level to default on next creation of a logger
        delete global.LambdaLogger
    } )

    it( 'should output simple json content', () => {
        const log = require( libpath ).JSONLogger( module )
        log.info( { foo: 'bar' } )
        console.log.should.have.been.called
        const args = console.log.firstCall.args[ 0 ]
        args.should.be.an( 'string' )
        const arg = JSON.parse(args)
        arg.should.have.property( 'modname' ).equal( 'JSONLoggerSpec' )
        arg.should.have.property( 'level' ).equal( 'info' )
        arg.should.have.property( 'm' ).deep.equal( {"foo":"bar"} )
    } )

    it( 'should output json content with modname', () => {
        const log = require( libpath ).JSONLogger( 'modname' )
        log.info( { foo: 'bar' } )
        console.log.should.have.been.called
        const args = console.log.firstCall.args[ 0 ]
        args.should.be.an( 'string' )
        const arg = JSON.parse(args)
        arg.should.have.property( 'modname' ).equal( 'modname' )
        arg.should.have.property( 'level' ).equal( 'info' )
        arg.should.have.property( 'm' ).deep.equal( {"foo":"bar"} )
    } )

} )