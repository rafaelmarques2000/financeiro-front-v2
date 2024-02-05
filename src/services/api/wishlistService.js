import Store from "@/store";
import {formatDate} from "@/services/utils/date";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";
import Swal from "sweetalert2";

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

export {
    listAllWishlist
}