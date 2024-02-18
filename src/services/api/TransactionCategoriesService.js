
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

const listTransactionCategoriesExpense = (data, transaction_type) => {
     let filter = transaction_type.filter((value) => {
          return value.slug_name === "despesa"
     })
    return httpService.get(`/transaction-categories?transaction_type_id=${filter[0].id}`).then(result => {
        data.loading.show = false
        data.filter_categories = result.data
    }).catch(error => {
        alertError("Atenção", "Falha ao listar categorias no filtro")
    })
}

export {
    listTransactionCategories,
    listTransactionCategoriesExpense
}