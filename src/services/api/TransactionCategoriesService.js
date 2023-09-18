
import httpService from "@/services/http/HttpService";
import {alertError} from "@/helper/alertHelper";

const listTransactionCategories = (data) => {
    data.loading.show = true
    return httpService.get(`/transaction-categories?transaction_type_id=${data.transaction.transaction_type}`).then(result => {
        data.loading.show = false
        data.transactionCategories = result.data
    }).catch(error => {
        alertError("Atenção", "Falha ao listar categorias")
    })
}

export {
    listTransactionCategories
}