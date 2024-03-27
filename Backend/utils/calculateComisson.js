const comisson = require("../models/comisson")

const calculateComisson = async()=>{
    const result = await comisson.aggregate({
        amount : {$sum:"$amount"}
    }
    )
    return result;
}

module.exports = {calculateComisson}