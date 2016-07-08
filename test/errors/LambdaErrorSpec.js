'use strict'

const chai      = require( 'chai' )
const sinon     = require( 'sinon' )
const sinonChai = require( 'sinon-chai' )

chai.use( sinonChai )
chai.should()

const libpath     = '../..'
const LambdaError = require( libpath ).LambdaError

describe( 'LambdaErrorSpec', () => {

    const sandbox = sinon.sandbox.create()

    afterEach( () => {
        sandbox.restore()
    } )

    it( 'constructor options', () => {
        let error = new LambdaError()
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: ''
        } )

        error = new LambdaError( 'test' )
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: 'test'
        } )

        error = new LambdaError( 'test', new Error( 'foo' ) )
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: 'test',
            cause: new Error( 'foo' )
        } )

        error = new LambdaError( 'test', 500, new Error( 'foo' ) )
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: 'test',
            status: 500,
            cause: new Error( 'foo' )
        } )

        error = new LambdaError( 'test', 500, 'Server error', new Error( 'foo' ) )
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: 'test',
            status: 500,
            code: 'Server error',
            cause: new Error( 'foo' )
        } )

        error = new LambdaError( 'test', 500 )
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: 'test',
            status: 500
        } )

        error = new LambdaError( 'test', 500, 'Server error' )
        error.toJSON().should.deep.equal( {
            name: 'LambdaError',
            message: 'test',
            status: 500,
            code: 'Server error'
        } )
    } )

    it( 'should support extension errors', () => {
        class ServerError extends LambdaError {
            constructor() {
                super('Server Error', 500)
            }
        }

        new ServerError().should.be.instanceof( ServerError )
        new ServerError().should.be.instanceof( LambdaError )
        new ServerError().should.be.instanceof( Error )
        new ServerError().toJSON().should.deep.equal( {
            name: 'ServerError',
            message: 'Server Error',
            status: 500
        } )
    } )

} )