class ExpressError extends Error {
    constructor(message, statusCode) {
        super();    //this calls the error constructor
        this.message = message;
        this.status = statusCode;
    }
}

module.exports = ExpressError;