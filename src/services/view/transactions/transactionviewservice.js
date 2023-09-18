import {accountlistAll, getAccountById, getAccountByIdPromisse} from "@/services/api/accountService";
import {alertError} from "@/helper/alertHelper";
import {getAccountTransactions, getTransactionStatisticAccountPeriod} from "@/services/api/transactionService";

const renderTransactionPageTitle = (data, route) => {
    getAccountByIdPromisse(route.params.id).then(result => {
        data.pageTitle.title = `Transações - ${result.data.description}`
        data.pageTitle.icon = "fa-solid fa-receipt"
        data.pageTitle.subtitle = "Gerencie suas transações"
    })
}

const searchTransactionFilter = (data, route) => {
    if(data.filter.range == null) {
        alertError("Atenção", "Preencha o filtro de data com inicio e fim para continuar")
        return;
    }
    getTransactionStatisticAccountPeriod(data, route)
    getAccountTransactions(data, route)
}

const navigateTransactionPages = (data, route, direction) => {
    if(direction === 'prev') {
        if(data.pagination.current_page > 1) {
            data.pagination.current_page -=1
            getAccountTransactions(data, route)
            return;
        }
    }

    if(direction === 'next') {
        if(data.pagination.current_page >= data.pagination.totalPages) {
            return
        }
        data.pagination.current_page +=1
        getAccountTransactions(data, route)
    }
}

const validateFormAndSubmit = (data, callback) => {
    let properties = Object.getOwnPropertyNames(data.transaction);
    console.log(properties)
    for(let i=0; i<properties.length; i++) {

        if(properties[i] === "installment_description") {
            continue;
        }

        if(data.transaction[properties[i]] === "" || data.transaction[properties[i]] == null) {
            console.log(`ERROR: ${properties[i]}`)
            alertError("Atenção",`Preencha o campo ${data.inputLabels[i]}`)
            return;
        }
        if(properties[i] === "installment" &&
            data.transaction['installment'] === "true"
            && data.transaction.amount_installments === 0
            && data.disableInstallment === false) {
            alertError("Atenção", "Numero de parcelas inválido")
            return;
        }
    }
    callback()
}


export {
    renderTransactionPageTitle,
    navigateTransactionPages,
    searchTransactionFilter,
    validateFormAndSubmit
}