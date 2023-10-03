import Store from "@/store";
import HttpService from "@/services/http/HttpService";
import {generatePagesArray, paginateArray} from "@/services/utils/Pagination";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import Swal from "sweetalert2";
import {getMoneyValue} from "@/services/utils/helpers";
import httpService from "@/services/http/HttpService";
import {findAll, findById} from "@/services/api/goalService";

const findAllGoalContributions = (data) => {
    let userId = Store.getters.userData.user_id
    let url = `/users/${userId}/goals/${data.goalId}/contributions`
    HttpService.get(url).then(result => {
        data.goalContributions = result.data
        data.goalContributionsPaginated = paginateArray(data.goalContributions, data.goalContributionsPagination.limit, data.goalContributionsPagination.currentPage)
        data.goalContributionsPagination.pages = generatePagesArray(
            data.goalContributionsPagination.currentPage + 1,
            data.goalContributions.length,
            data.goalContributionsPagination.limit,
            5
        )
    }).catch(error => {
        alertError("Atenção","Falha ao obter lista de dados");
    })
}

const saveGoalContribution = (data) => {
    let userId = Store.getters.userData.user_id
    data.goalContribution.amount = getMoneyValue(data.goalContribution.amount)
    httpService.post(`/users/${userId}/goals/${data.goalId}/contributions`, data.goalContribution).then(result => {
        alertSuccess("Sucesso!!", "Cadastro Realizado com sucesso!", 'success').then(result => {
            data.goalContribution.description = ""
            data.goalContribution.amount = ""
            data.goalContribution.operation_type = ""
            findAllGoalContributions(data)
        })
    }).catch(error => {
        alertError("Atenção","Falha ao realizar cadastro");
    })
}

export {
    findAllGoalContributions,
    saveGoalContribution
}