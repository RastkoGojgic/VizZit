function checkAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch((err)=>{
            next(err)
        })
    }
}

exports.checkAsync = checkAsync