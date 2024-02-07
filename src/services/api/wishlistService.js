import Store from "@/store";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import {accountlistAll} from "@/services/api/accountService";


const listAllWishlist = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    let url = `/users/${userId}/wishlist?limit=${data.pagination.limit}&page=${data.pagination.current_page}`
    if(data.filter.description != null && data.filter.description !== "" ) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    httpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.wishlists = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter transações")
    })
}

const getWishListById = (data) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    httpService.get(`/users/${userId}/wishlist/${data.wishlist.id}`).then(result => {
        data.loading.show = false
        data.wishlist.id = result.data.id
        data.wishlist.description = result.data.description
        data.wishlist.status = result.data.status
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter dados da lista de desejos, tente novamente ou contate o administrador")
    })
}

const saveWishList = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    let url = `/users/${userId}/wishlist`

    httpService.post(url, data.wishlist).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Lista de desejos criada com sucesso").then(result => {
            if(result.isConfirmed){
                listAllWishlist(data)
                data.wishlist.description = ""
                data.wishlist.status = ""
                data.modals.wishlist.show = false
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao salvar conta, tente novamente ou contate o administrador")
    })
}

const updateWishList = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    httpService.put(`/users/${userId}/wishlist/${data.wishlist.id}`, data.wishlist).then(result => {
        data.loading.show = false
        alertSuccess("sucesso!!", "Lista de desejo atualizada com sucesso").then(alertResult => {
            listAllWishlist(data)
            data.modals.wishlist.show = false
            data.wishlist.description = ""
            data.wishlist.status = ""
            data.wishlist.id = ""
        })
    }).catch(error => {
        alertError("Atenção", "Falha ao atualizar lista de desejos, tente novamente ou contate o administrador")
    })
}

const deleteWishList = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    httpService.delete(`/users/${userId}/wishlist/${data.wishlist.id}`).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Lista de desejos deletada com sucesso").then(result => {
            if(result.isConfirmed){
                data.wishlist.id = ""
                listAllWishlist(data)
            }
        })
    }).catch(error => {
        alertError("Atenção", "Falha ao deletar lista de desejos, tente novamente ou contate o adminstrador.")
    })
}

export {
    listAllWishlist,
    saveWishList,
    deleteWishList,
    getWishListById,
    updateWishList
}