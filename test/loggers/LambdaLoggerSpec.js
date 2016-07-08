'use strict'

const chai      = require( 'chai' )
const sinon     = require( 'sinon' )
const sinonChai = require( 'sinon-chai' )

chai.use( sinonChai )
chai.should()

const libpath = '../..'

describe( 'LambdaLoggerSpec', () => {

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

    describe( 'levels', () => {
        it( 'should set default level to info', () => {
            const log = require( libpath ).Logger()

            log.level.should.equal( 'info' )

            log.debug( 'test' )
            console.log.should.not.have.been.called
            console.log.reset()

            log.trace( 'test' )
            console.log.should.not.have.been.called
            console.log.reset()

            log.info( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[ info\]  test/ )
            console.log.reset()

            log.warn( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[ warn\]  test/ )
        } )

        it( 'should recognize debug level', () => {
            const log = require( libpath ).Logger()
            log.level = 'debug'
            log.debug( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[debug\]  test/ )
        } )

        it( 'should not log anything in "none" level', () => {
            const log = require( libpath ).Logger()
            log.level = 'none'
            log.error( 'test' )
            console.log.should.not.have.been.called
        } )
    } )

    describe( 'modules', () => {

        it( 'should report implicit module', () => {
            const log = require( libpath ).Logger()
            log.info( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[ info\]  test/ )
        } )

        it( 'should report derived module', () => {
            const log = require( libpath ).Logger( module )
            log.info( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[ info\] LambdaLoggerSpec test/ )
        } )

        it( 'should report overridden module', () => {
            const log = require( libpath ).Logger( 'override' )
            log.info( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[ info\] override test/ )
        } )

        it( 'should report class module', () => {
            const ModuleParentClass = require( '../ModuleParentClass' )
            const clazz             = new ModuleParentClass()
            clazz.logMessage( 'test' )

            console.log.should.have.been.calledWithMatch( /\d+ \[ info\] ModuleParentClass test/ )
        } )

    } )

    describe( 'patterns', () => {
        it( 'should be able to provide a custom pattern', () => {
            const log   = require( libpath ).Logger()
            log.pattern = '%(ms)d [%()s]'
        } )
    } )

    describe( 'context', () => {

        it( 'will not log context object unless pattern calls for it', () => {
            const log = require( libpath ).Logger()
            log.setContext( 'prop', { foo: 'bar' } )
            log.info( 'test' )
            console.log.should.have.been.calledWithMatch( /\d+ \[ info\]  test/ )
        } )

        it( 'will log context object when pattern is set', () => {
            const log = require( libpath ).Logger()
            log.setContext( 'prop', { foo: 'bar' } )
            log.pattern = 'This is a %(m)s, foo = "%(context.prop.foo)s"'
            log.info( 'test' )
            console.log.should.have.been.calledWithMatch( /This is a test, foo = "bar"/ )
        } )

    } )

} )