import {timer} from "@/helper/timerHelper";
import {authenticate} from "@/services/api/authService";
import {alertError} from "@/helper/alertHelper";
import store from "@/store";

const validateAndLogin = (data, router) => {

     if(data.username === ""){
         data.alert.show = true;
         data.alert.message = "Preencha o campo usuário"
         timer(() => data.alert.show = false, 3000)
         return;
     }

    if(data.password === ""){
        data.alert.show = true;
        data.alert.message = "Preencha o campo senha"
        timer(() => data.alert.show = false, 3000)
        return;
    }

    data.showLoading = true;

    authenticate(data).then(response =>{
        console.log(response.data)
        data.showLoading = false;
        store.commit("enableAuth")
        store.commit("setUserData", response.data)
        router.push({name: "app"})
    }).catch(error => {
      try {
          console.log(error)
          data.showLoading = false;
          alertError("Atencão", error.response.data.message)
      }catch (ex) {
          data.showLoading = false;
          alertError("Atencão", ex.message)
      }
    })
}

export {
    validateAndLogin
}