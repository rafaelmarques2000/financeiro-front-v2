import Store from "@/store";
import {formatDate} from "@/services/utils/date";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import Swal from "sweetalert2";


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
    getAccountTransactions
}