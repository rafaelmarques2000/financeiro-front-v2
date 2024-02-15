import Store from "@/store";
import httpService from "@/services/http/HttpService";
import {alertError, alertSuccess} from "@/helper/alertHelper";

const listAllCategories = (data) => {
    data.loading.show = true

    let url = `/categories?limit=${data.pagination.limit}&page=${data.pagination.current_page}`
    if(data.filter.description != null && data.filter.description !== "" ) {
        url = url.concat(`&description=${data.filter.description}`)
    }

    httpService.get(url).then(result => {
        data.loading.show = false
        data.pagination.current_page = result.data.current_page
        data.pagination.totalPages = result.data.total_pages
        data.pagination.totalRows = result.data.total_rows
        data.categories = result.data.items
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter categorias")
    })
}

const getCategoryById = (data) => {
    data.loading.show = true
    httpService.get(`/categories/${data.category.id}`).then(result => {
        data.loading.show = false
        data.category.id = result.data.id
        data.category.description = result.data.description
        data.category.category_type_id = result.data.category_type.id
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao obter categoria, tente novamente ou contate o administrador")
    })
}

const saveCategory = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    let url = `/categories`

    httpService.post(url, data.category).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", "Categoria criada com sucesso").then(result => {
            if(result.isConfirmed){
                listAllCategories(data)
                data.category.id = ""
                data.category.description = ""
                data.category_type_id = ""
                data.modals.category.show = false
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha criar categoria, tente novamente ou contate o administrador")
    })
}

const updateCategory = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true

    httpService.put(`/categories/${data.category.id}`, data.category).then(result => {
        data.loading.show = false
        alertSuccess("sucesso!!", "Categoria atualizada com sucesso").then(alertResult => {
            listAllCategories(data)
            data.modals.category.show = false
            data.category.id = ""
            data.category.description = ""
            data.category_type_id = ""
        })
    }).catch(error => {
        alertError("Atenção", "Falha ao atualizar categoria, tente novamente ou contate o administrador")
    })
}

const deleteCategory = (data) => {
    let userId = Store.getters.userData.user_id
    data.loading.show = true
    httpService.delete(`/categories/${data.category.id}`).then(result => {
        data.loading.show = false
        alertSuccess("Sucesso!", " Categoria deletada com sucesso").then(result => {
            if(result.isConfirmed){
                data.category.id = ""
                listAllCategories(data)
            }
        })
    }).catch(error => {
        data.loading.show = false
        alertError("Atenção", "Falha ao deletar categoria, tente novamente ou contate o adminstrador.")
    })
}

export {
    listAllCategories,
    saveCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}