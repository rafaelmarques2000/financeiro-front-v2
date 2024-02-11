import Store from "@/store";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import {getMoneyValue} from "@/services/utils/helpers";


const listAllWishlistItems = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    let url = `/users/${userId}/wishlist/${data.wishlist.id}/items?limit=${data.pagination.limit}&page=${data.pagination.current_page}`
    if(data.filter.description != null && data.filter.description !== "" ) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    httpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.wishlistsItems = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter items")
    })
}

const getWishListItemById = (data) => {
    data.loading.show = true
    let userId = Store.getters.userData.user_id
    httpService.get(`/users/${userId}/wishlist/${data.wishlist.id}/items/${data.wishlistItem.id}`).then(result => {
        data.loading.show = false
        data.wishlistItem.id = result.data.id
        data.wishlistItem.description = result.data.description
        data.wishlistItem.amount = result.data.amount
        data.wishlistItem.checked = result.data.checked
        data.wishlistItem.link = result.data.link
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter dados dos items, tente novamente ou contate o administrador")
    })
}

const saveWishListItem = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    let url = `/users/${userId}/wishlist/${data.wishlist.id}/items`
    data.wishlistItem.amount = getMoneyValue(data.wishlistItem.amount)
    httpService.post(url, data.wishlistItem).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Item criado com sucesso").then(result => {
            if(result.isConfirmed){
                listAllWishlistItems(data)
                data.wishlistItem.id = ""
                data.wishlistItem.description = ""
                data.wishlistItem.amount = 0
                data.wishlistItem.checked = false
                data.wishlistItem.link = ""

                data.modals.wishlistItem.show = false
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao criar item, tente novamente ou contate o administrador")
    })
}

const updateWishListItem = (data, alert) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    data.wishlistItem.amount = getMoneyValue(data.wishlistItem.amount)
    httpService.put(`/users/${userId}/wishlist/${data.wishlist.id}/items/${data.wishlistItem.id}`, data.wishlistItem).then(result => {
        data.loading.show = false
        if(!alert) {
            listAllWishlistItems(data)
            data.wishlistItem.id = ""
            data.wishlistItem.description = ""
            data.wishlistItem.amount = 0
            data.wishlistItem.checked = false
            data.wishlistItem.link = ""
            data.modals.wishlistItem.show = false
            return
        }
        alertSuccess("sucesso!!", "Item atualizado com sucesso").then(alertResult => {
            listAllWishlistItems(data)
            data.wishlistItem.id = ""
            data.wishlistItem.description = ""
            data.wishlistItem.amount = 0
            data.wishlistItem.checked = false
            data.wishlistItem.link = ""
            data.modals.wishlistItem.show = false
        })
    }).catch(error => {
        alertError("Atenção", "Falha ao atualizar lista de desejos, tente novamente ou contate o administrador")
    })
}

const deleteWishListItem = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    httpService.delete(`/users/${userId}/wishlist/${data.wishlist.id}/items/${data.wishlistItem.id}`).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Item deletado com sucesso").then(result => {
            if(result.isConfirmed){
                data.wishlistItem.id = ""
                listAllWishlistItems(data)
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao deletar item, tente novamente ou contate o adminstrador.")
    })
}

export {
    listAllWishlistItems,
    getWishListItemById,
    saveWishListItem,
    updateWishListItem,
    deleteWishListItem
}