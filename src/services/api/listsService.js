import Store from "@/store";
import HttpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import httpService from "@/services/http/HttpService";

const findAll = (data) => {
    data.loading.show = true;
    let userId = Store.getters.userData.user_id

    let url = `/users/${userId}/lists?limit=${data.pagination.limit}&page=${data.pagination.current_page}`

    if(data.filter.description) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    HttpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.currentPage = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.lists = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção","Falha ao obter lista de dados");
    })
}

const findById = (data) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    httpService.get(`/users/${userId}/lists/${data.newList.id}`).then(result => {
        data.loading.show = false
        data.newList.id = result.data.id
        data.newList.description = result.data.description
        data.newList.real_time = result.data.is_realtime
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter dados da lista, tente novamente ou contate o administrador")
    })
}

const findBy = (id, callback) => {
    let userId = Store.getters.userData.user_id
    httpService.get(`/users/${userId}/lists/${id}`).then(result => {
        callback(result.data)
    }).catch(error => {
        console.log(error)
        alertError("Atenção", "Falha ao obter dados da lista, tente novamente ou contate o administrador")
    })
}

const saveList = (data) => {
    data.loading.show = true;
    let userId = Store.getters.userData.user_id

    delete data.newList["id"]

    httpService.post(`/users/${userId}/lists`, data.newList).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!!", "Cadastro Realizado com sucesso!").then(result => {
            data.newList.description = ""
            data.newList.real_time = false
            data.modal.show = false
            data.newList.id = ""
            findAll(data)
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao realizar cadastro");
    })
}

const updateList = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    let listId = data.newList.id

    delete data.newList["id"]

    httpService.put(`/users/${userId}/lists/${listId}`, data.newList).then(result => {
        data.loading.show = false
        alertSuccess("sucesso!!", "Lista atualizada com sucesso").then(alertResult => {
            findAll(data)
            data.newList.description = ""
            data.newList.real_time = false
            data.modal.show = false
            data.newList.id = ""

        })
    }).catch(error => {
        alertError("Atenção", "Falha ao atualizar lista, tente novamente ou contate o administrador")
    })
}

const deleteList = (data) => {
    data.loading.show = true;
    let userId = Store.getters.userData.user_id
    return httpService.delete(`/users/${userId}/lists/${data.newList.id}`).then(result => {
        data.loading.show = false
        data.newList.id = ""
        findAll(data)
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção",'Falha ao deletar registro')
    })
}

export {
    findAll,
    findById,
    saveList,
    updateList,
    deleteList,
    findBy
}