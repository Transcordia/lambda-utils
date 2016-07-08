'use strict'

const LambdaLogger = require( './loggers/LambdaLogger' )
const JSONLogger   = require( './loggers/JSONLogger' )

module.exports = {
    LambdaError: require( './errors/LambdaError' ),
    LambdaHandler: require( './handlers/LambdaHandler' ),
    APIGHandler: require( './handlers/APIGHandler' ),
    Logger: mod => new LambdaLogger( mod ),
    JSONLogger: mod => new JSONLogger( mod )
}