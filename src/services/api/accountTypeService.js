import httpService from "@/services/http/HttpService";
import {alertError} from "@/helper/alertHelper";
import Swal from "sweetalert2";

const getAccountType = (data, route) => {

    let module = route.params.module

    httpService.get("/account-types").then(result => {
        let accountType = result.data.filter((item) => item.slug_name === buildSlugname(module))
        data.account.account_type_id = accountType[0].id
    }).catch(error => {
        alertError("Atenção", "Falha ao obter tipos de contas")
    })
}

const listAccountTypes = (data) => {
    return httpService.get('/account-types').then(result => {
        data.accountTypes = result.data
    }).catch(error => {
       alertError("Atenção","Falha ao obter lista de tipos de contas")
    })
}

const buildSlugname = (module) => {
    if(module === "contas"){
        return "conta_corrente"
    }

    if(module === "cartoes"){
        return "cartao_credito"
    }

    if(module === "caixa"){
        return "caixa"
    }
}


export {
    getAccountType,
    listAccountTypes
}