import Store from "@/store";
import httpService from "@/services/http/HttpService";
import {alertError} from "@/helper/alertHelper";

const saveToken = (token) => {
    let userId = Store.getters.userData.user_id
    httpService.post(`/users/${userId}/fcm-token`, {origin:'web', token}).then(result => {}).catch(error => {
        alertError("Atenção", "Falha ao registrar token, atualize a pagina se o erro persistir contate o administrador do sistema")
    })
}

export {
    saveToken
}