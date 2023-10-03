import Swal from "sweetalert2";
import Store from "@/store";
import HttpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import {getMoneyValue} from "@/services/utils/helpers";
import httpService from "@/services/http/HttpService";

const findAll = (data) => {
    data.loading.show = true;
    let userId = Store.getters.userData.user_id

    let url = `/users/${userId}/goals?limit=${data.pagination.limit}&page=${data.pagination.current_page}`

    if(data.filter.description) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    HttpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.currentPage = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.goals = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção","Falha ao obter lista de dados");
    })
}

const findById = (data) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    let url = `/users/${userId}/goals/${data.goal.id}`

    HttpService.get(url).then(result => {

        data.loading.show = false
        data.goal.description = result.data.description
        data.goal.amount = result.data.amount
        data.goalId = result.data.id

        data.goalBalance.goalContributions = result.data.balance.goal_contributions
        data.goalBalance.goalRemaining = result.data.balance.goal_remaining
        data.goalBalance.percentage = result.data.balance.percentage
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção","Falha ao obter dados");
    })
}



const saveGoal = (data) => {
    data.loading.show = true;
    data.goal.amount = getMoneyValue(data.goal.amount)
    let userId = Store.getters.userData.user_id

    httpService.post(`/users/${userId}/goals`, data.goal).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!!", "Cadastro Realizado com sucesso!").then(result => {
            data.goal.description = ""
            data.goal.amount = ""
            data.modal.show = false
            findAll(data)
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao realizar cadastro");
    })
}

const updateGoal = (data) => {
    data.loading.show = false
    data.goal.amount = getMoneyValue(data.goal.amount)
    let userId = Store.getters.userData.user_id
    httpService.put(`/users/${userId}/goals/${data.goal.id}`, data.goal).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!!", "Atualização realizada com sucesso!").then(result => {
            if(result.isConfirmed) {
                data.modal.show = false
                data.goal.description = ""
                data.goal.amount = ""
                findAll(data)
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção","Falha ao realizar atualização");
    })
}

const deleteGoal = (data) => {
    data.loading.show = true;
    let userId = Store.getters.userData.user_id
    return httpService.delete(`/users/${userId}/goals/${data.goal.id}`).then(result => {
        data.loading.show = false
        findAll(data)
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção",'Falha ao deletar registro')
    })
}


export {
    findAll,
    saveGoal,
    updateGoal,
    findById,
    deleteGoal
}