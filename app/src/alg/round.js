
exports.roundNumber = (e =>{
    //Useful function to round a number up to 1st decimal
    e = parseFloat(e.toFixed(2));
    let decimal = e % 1
    let integer = parseInt(e)
    if (decimal >= 0.25) {
        e = parseFloat(integer + 0.5)
    }
    else {
        e = integer
    }
    return e
})
