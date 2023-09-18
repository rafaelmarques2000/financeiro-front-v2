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


export {
    renderTransactionPageTitle,
    navigateTransactionPages,
    searchTransactionFilter
}