const comisson = require("../model/comission")

const calculateCommission = async()=>{
    const result = await comisson.aggregate({
        amount : {$sum:"$amount"}
    }
    )
    return result;
}

module.exports = {calculateCommission}