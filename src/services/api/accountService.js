import Store from "@/store";
import {formatDate} from "@/services/utils/date";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import Swal from "sweetalert2";

const accountlistAll = (data, route) => {

    let userId = Store.getters.userData.user_id
    let module = route.params.module

    data.loading.show = true
    let url = buildUrl(userId, "accounts", data, module);

    httpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.accounts = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter lista de dados")
    })

}

const getAccountById = (data, route) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    httpService.get(`/users/${userId}/accounts/${data.account.id}`).then(result => {
        data.loading.show = false
        data.account.id = result.data.id
        data.account.description = result.data.description
        data.account.account_type_id = result.data.accountType.id
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter dados da conta, tente novamente ou contate o administrador")
    })
}

const getAccountByIdPromisse = (id) => {
    let userId = Store.getters.userData.user_id
    return httpService.get(`/users/${userId}/accounts/${id}`)
}

const saveAccount = (data, route) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    httpService.post(`/users/${userId}/accounts`, data.account).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Conta cadastrada com sucesso").then(result => {
            if(result.isConfirmed){
                accountlistAll(data, route)
                data.account.description = ""
                data.modal.show = false
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao salvar conta, tente novamente ou contate o administrador")
    })
}

const updateAccount = (data, route) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    httpService.put(`/users/${userId}/accounts/${data.account.id}`, data.account).then(result => {
       data.loading.show = false
       alertSuccess("sucesso!!", "Conta atualizada com sucesso").then(alertResult => {
            accountlistAll(data, route)
            data.modal.show = false
            data.account.description = ""
            data.accounts.id = ""

       })
    }).catch(error => {
       alertError("Atenção", "Falha ao atualizar conta, tente novamente ou contate o administrador")
    })
}


const deleteAccount = (data, route) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    httpService.delete(`/users/${userId}/accounts/${data.account.id}`).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Conta deletada com sucesso").then(result => {
            if(result.isConfirmed){
                data.account.id = ""
                accountlistAll(data, route)
            }
        })
    }).catch(error => {
        alertError("Atenção", "Falha ao deletar conta, tente novamente ou contate o adminstrador.")
    })
}

const archiveAccount = (data, route) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    let archived = data.account.archived
    httpService.patch(`/users/${userId}/accounts/${data.account.id}/archive`, {archived}).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", data.account.archived === 1 ? "Arquivado com sucesso!" : "Desarquivado com sucesso!").then(result => {
            if(result.isConfirmed){
                data.account.id = ""
                data.account.archived = 0
                accountlistAll(data, route)
                getAccountPeriodGeneralStatistic(data, route)
            }
        })
    }).catch(error => {
        alertError("Atenção", "Falha ao arquivar, tente novamente ou contate o adminstrador.")
    })
}


const getAccountPeriodGeneralStatistic = (data, route) => {
    let userId = Store.getters.userData.user_id
    let module = route.params.module

    let url = buildUrl(userId, 'accounts/statistics' , data, module);

    httpService.get(url).then(result => {
        data.statistics = result.data
    }).catch(error => {
        alertError("Atenção", error.response.data.message)
    })
}

const getUserAccounts = (data) => {
    let userId = Store.getters.userData.user_id
    let url = `/users/${userId}/user-accounts`
    data.loading.show = true;
    httpService.get(url).then(result => {
        data.loading.show = false;
        data.accounts = result.data
    }).catch(error => {
        alertError("Atenção", error.response.data.message)
    })
}


function buildUrl(userId,uri, data, module) {
    let url = `/users/${userId}/${uri}?limit=${data.pagination.limit}&page=${data.pagination.current_page}`

    if (data.filter.description != null) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    if (data.filter.archived != null) {
        url = url.concat(`&archived=${data.filter.archived}`)
    }

    if (module === "contas") {
        url = url.concat(`&account_types[]=conta_corrente`)
    }

    if (module === "cartoes") {
        url = url.concat(`&account_types[]=cartao_credito`)
    }

    if (module === "caixa") {
        url = url.concat(`&account_types[]=caixa`)
    }

    return url.concat(`&initial_date=${formatDate(data.filter.range.start)}&end_date=${formatDate(data.filter.range.end)}`)
}

export {
    accountlistAll,
    getAccountById,
    saveAccount,
    deleteAccount,
    updateAccount,
    getAccountByIdPromisse,
    getAccountPeriodGeneralStatistic,
    getUserAccounts,
    archiveAccount
}