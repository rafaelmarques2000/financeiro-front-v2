import Store from "@/store";
import {formatDate} from "@/services/utils/date";
import httpService from "@/services/http/HttpService";
import {alertError} from "@/helper/alertHelper";

const listAllTransactionHistory = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    let url = `/users/${userId}/transactions-history?limit=${data.pagination.limit}&page=${data.pagination.current_page}&initial_date=${formatDate(data.filter.range.start)}&end_date=${formatDate(data.filter.range.end)}`

    if(data.filter.description != null && data.filter.description !== "" ) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    if(data.filter.accountId != null && data.filter.accountId !== "" ) {
        url = url.concat(`&account_id=${data.filter.accountId}`)
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

export {
    listAllTransactionHistory
}