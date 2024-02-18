const formatMoneyBRL = (value) => {
    return parseFloat(value).toLocaleString("pt-BR", {style: "currency", currency :"BRL"})
}

const getMoneyValue = (value) => {
    if(Number.isInteger(value)) {
        return value * 100
    }else {
        let stringMoney = String(value).split(".")
        let integer = stringMoney[0]
        let decimal = stringMoney[1]
        let result = 0
        if(decimal.indexOf('0',0) < 0) {
            if(parseInt(decimal) < 10) {
                result = integer
                    .concat(decimal)
                    .concat('0')
            }else {
                result = integer
                    .concat(decimal)
            }
        }else{
            result = integer.concat(decimal)
        }
        return Number.parseInt(result)
    }
}

const formatEmptyValues = (value) => {
    if(value === "" || value == null) {
        return "-"
    }
    return value
}

export {
    formatMoneyBRL,
    getMoneyValue,
    formatEmptyValues
}