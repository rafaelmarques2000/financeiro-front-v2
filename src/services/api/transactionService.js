import Store from "@/store";
import {formatDate} from "@/services/utils/date";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import Swal from "sweetalert2";
import {getMoneyValue} from "@/services/utils/helpers";


const getTransactionStatisticAccountPeriod = (data, route) => {
    let userId = Store.getters.userData.user_id
    let accountId = route.params.id
    let url = `/users/${userId}/accounts/${accountId}/statistics`
    url = url.concat(`?initial_date=${formatDate(data.filter.range.start)}&end_date=${formatDate(data.filter.range.end)}`)

    httpService.get(url).then(result => {
        data.statistics = result.data
    }).catch(error => {
       alertError("Atenção", "Falha ao obter statistica")
    })
}

const getAccountTransactions = (data, route) => {
    let userId = Store.getters.userData.user_id
    let accountId = route.params.id
    data.loading.show = true

    let url = `/users/${userId}/accounts/${accountId}/transactions?limit=${data.pagination.limit}&page=${data.pagination.current_page}&initial_date=${formatDate(data.filter.range.start)}&end_date=${formatDate(data.filter.range.end)}`

    if(data.filter.description != null) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    httpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.transactions = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter transações")
    })
}

const saveTransaction = (data, route) => {
    let userId = Store.getters.userData.user_id
    let accountId = route.params.id

    let transaction = data.transaction

    if(transaction.installment === "false") {
        delete transaction['installment']
        delete transaction['amount_installments']
    }
    transaction.amount = getMoneyValue(transaction.amount)

    data.loading.show = true

    httpService.post(`/users/${userId}/accounts/${accountId}/transactions`, transaction).then(result => {
       data.loading.show = false
       alertSuccess("Sucesso!!", "Transação cadastrada com sucesso").then(alertResult => {
           data.transaction.description = null;
           data.transaction.date = null;
           data.transaction.transaction_type = "";
           data.transaction.amount = null;
           data.transaction.transaction_category = "";
           data.categoryDisable = true
           data.transaction.installment = "false";
           data.transaction.amount_installments = null;
           data.simulateInstallment = null
           data.transaction.installment_description = null
       })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao cadastrar transação, tente novamente ou contate o administrador")
    })
}

const deleteTransaction = (data, route) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    let accountId = route.params.id

    return httpService.delete(`/users/${userId}/accounts/${accountId}/transactions/${data.transaction.id}`).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!!", "Transação deletada com sucesso").then(alertResult => {
            if(alertResult.isConfirmed) {
                getAccountTransactions(data, route)
                getTransactionStatisticAccountPeriod(data, route)
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao deletar transação")
    })
}


export {
    getTransactionStatisticAccountPeriod,
    deleteTransaction,
    getAccountTransactions,
    saveTransaction
}