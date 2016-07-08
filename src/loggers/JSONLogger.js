'use strict'

const path = require('path')

const LambdaLogger = require( './LambdaLogger' )

class JSONLogger extends LambdaLogger {

    constructor( mod ) {
        super(mod)
    }

    output( args ) {
        console.log( JSON.stringify( args ) )
    }
}

module.exports = JSONLogger

