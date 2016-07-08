'use strict'

class LambdaError extends Error {

    /**
     *
     * @param {string} message Description of the error
     * @param {number} [status] A high level status value that describes the category of error
     * @param {string|number} [code] A detailed status value that describes the specific type of error
     * @param {Error} [cause] The underlying error object
     */
    constructor( message, status, code, cause ) {
        super( message )
        this.name = this.constructor.name

        const args = Array.from( arguments )
        args.shift()

        // Determine if the last argument is an error
        let arg = args.pop()
        if ( arg instanceof Error ) {
            this.cause = arg
            arg        = args.pop()
        }

        // If there is still a last argument, it is either a status or code depending on the remaining args
        if ( arg && args.length === 1 ) {
            this.status = args.pop()
            this.code   = arg
        }
        else if ( arg && args.length === 0 ) {
            this.status = arg
            this.code   = undefined
        }
    }

    toJSON() {
        const result = {
            name: this.name,
            message: this.message
        }
        if ( this.code !== undefined ) result.code = this.code
        if ( this.cause !== undefined ) result.cause = this.cause
        if ( this.status !== undefined ) result.status = this.status
        return result
    }

}

module.exports = LambdaError