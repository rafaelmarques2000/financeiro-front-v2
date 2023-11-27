import Store from "@/store";
import httpService from "@/services/http/HttpService";
import {alertError} from "@/helper/alertHelper";

const getItems = (data) => {
    let userId = Store.getters.userData.user_id
    httpService.get(`/users/${userId}/lists/${data.list.id}/items`).then(result => {
        data.listItems = result.data
    }).catch(error => {
        alertError("Atenção", "Falha ao obter dados da lista, tente novamente ou contate o administrador")
    })
}

const createListItem = (data) => {
    let userId = Store.getters.userData.user_id
    const payload = {
        description: data.listItem.description,
        order_number: data.listItem.order_number
    }

    httpService.post(`/users/${userId}/lists/${data.list.id}/items`, payload).then(result => {
        data.listItem.description = ""
        data.listItem.order_number = ""
        getItems(data)
    }).catch(error => {
        alertError("Atenção", "Falha ao criar item, tente novamente ou contate o administrador")
    })
}

const checkUncheckItem = (data, itemId, itemChecked) => {
    let userId = Store.getters.userData.user_id
    const payload = {
        checked: itemChecked
    }

    httpService.put(`/users/${userId}/lists/${data.list.id}/items/${itemId}`, payload).then(result => {
        getItems(data)
    }).catch(error => {
        alertError("Atenção", "Falha ao concluir operação, tente novamente ou contate o administrador")
    })
}

const deleteItem = (data, itemId) => {
    let userId = Store.getters.userData.user_id

    httpService.delete(`/users/${userId}/lists/${data.list.id}/items/${itemId}`).then(result => {
        getItems(data)
    }).catch(error => {
        alertError("Atenção", "Falha ao deletar item, tente novamente ou contate o administrador")
    })
}

export {
    getItems,
    createListItem,
    checkUncheckItem,
    deleteItem
}