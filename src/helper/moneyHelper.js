const formatMoneyBRL = (value) => {
    return value.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        }
    )
}

export {
    formatMoneyBRL
}