import {alertError} from "@/helper/alertHelper";
import httpService from "@/services/http/HttpService";

const listTransactionType = (data) => {
    return httpService.get('/transaction-types').then(result => {
        data.transactionTypes = result.data
    }).catch(error => {
        alertError("Atenção", "Falha ao obter tipo de transações")
    })
}

export {
    listTransactionType
}