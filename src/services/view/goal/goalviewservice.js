import {alertError} from "@/helper/alertHelper";
import {findAll} from "@/services/api/goalService";

const validateFormAndSubmit = (data, callback) => {

    if(data.goal.description === ""){
        alertError("Atenção", "Preencha o campo Descrição")
        return
    }

    if(data.goal.amount === ""){
        alertError("Atenção", "Preencha o campo Meta")
        return
    }

    callback()
}

const navigateTransactionPages = (data, direction) => {
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


export {
    validateFormAndSubmit,
    navigateTransactionPages
}