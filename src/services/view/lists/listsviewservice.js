
import {findAll} from "@/services/api/listsService";
import {alertError} from "@/helper/alertHelper";

const openCloseFilter = (data) => {
    if(data.filter.open) {
        data.filter.open = false
        return;
    }
    data.filter.open = true
}


const navigatePages = (data, direction) => {
    if(direction === 'prev') {
        if(data.pagination.current_page > 1) {
            data.pagination.current_page -=1
            findAll(data)
            return;
        }
    }

    if(direction === 'next') {
        if(data.pagination.current_page >= data.pagination.totalPages) {
            return
        }
        data.pagination.current_page +=1
        findAll(data)
    }
}

const validateFormAndSubmit = (data, callback) => {
    if(data.newList.description === "") {
        alertError("Atenção",`Preencha o campo descrição`)
        return
    }
    callback()
}

const searchFilter = (data) => {
    findAll(data)
}

export {
    openCloseFilter,
    navigatePages,
    searchFilter,
    validateFormAndSubmit
}