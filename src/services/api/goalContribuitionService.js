import Store from "@/store";
import HttpService from "@/services/http/HttpService";
import {generatePagesArray, paginateArray} from "@/services/utils/Pagination";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import {getMoneyValue} from "@/services/utils/helpers";
import httpService from "@/services/http/HttpService";
import {findById} from "@/services/api/goalService";

const findAllGoalContributions = (data) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    let url = `/users/${userId}/goals/${data.goalId}/contributions`
    HttpService.get(url).then(result => {
        data.loading.show = false
        data.goalContributions = result.data.map((item) => {
            if(item.operation_type === "negative"){
                item.amount *= -1
                return item
            }
            return item
        })
        data.goalContributionsPaginated = paginateArray(data.goalContributions, data.goalContributionsPagination.limit, data.goalContributionsPagination.currentPage)
        data.goalContributionsPagination.pages = generatePagesArray(
            data.goalContributionsPagination.currentPage + 1,
            data.goalContributions.length,
            data.goalContributionsPagination.limit,
            5
        )
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção","Falha ao obter lista de dados");
    })
}

const saveGoalContribution = (data) => {
    let userId = Store.getters.userData.user_id
    delete data.goalContribution.id
    data.goalContribution.amount = getMoneyValue(data.goalContribution.amount)
    data.loading.show = true
    httpService.post(`/users/${userId}/goals/${data.goalId}/contributions`, data.goalContribution).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!!", "Cadastro Realizado com sucesso!", 'success').then(result => {
            data.goalContribution.description = ""
            data.goalContribution.amount = ""
            data.goalContribution.operation_type = ""
            findAllGoalContributions(data)
            findById(data, true)
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção","Falha ao realizar cadastro");
    })
}

const deleteGoalContribution = (data) => {
    data.loading.show = true;
    let userId = Store.getters.userData.user_id
    return httpService.delete(`/users/${userId}/goals/${data.goalId}/contributions/${data.goalContribution.id}`).then(result => {
        data.loading.show = false;
        findAllGoalContributions(data)
        findById(data, true)
    }).catch(error => {
        data.loading.show = false;
        alertError('Atenção','Falha ao deletar registro')
    })
}

export {
    findAllGoalContributions,
    saveGoalContribution,
    deleteGoalContribution
}