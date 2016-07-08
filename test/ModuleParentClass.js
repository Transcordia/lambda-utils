'use strict'

const log = require( '..' ).Logger(module)

class ModuleParentClass {
    logMessage( message ) {
        log.info( message )
    }
}

module.exports = ModuleParentClass