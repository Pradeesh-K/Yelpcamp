module.exports = func => {
    return function (req, res, next) {
        func (req, res, next).catch(next)
    }
}

//this is the same  wrapAsync function  