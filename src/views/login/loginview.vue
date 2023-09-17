<template>
    <div id="login-view">
        <div class="container w-100 d-flex justify-content-center align-items-center">
             <div class="row">
                   <div class="col-md-12" >
                        <div class="card px-5 py-5 login-card-custom ">
                          <div class="col-md-12 justify-content-center">
                            <h1 class="login-title">Graninha 4.0 <br><span class="login-subtitle">Seja bem vindo, insira suas credencias para começar</span></h1>
                          </div>
                          <alert v-if="data.alert.show"  :message="data.alert.message" alert-type="danger"></alert>
                          <loading v-if="data.showLoading" message="processando aguarde..."></loading>
                            <form @submit.prevent="formSubmit">
                                <div class="mb-4">
                                    <input type="text" v-model="data.username" placeholder="Digite seu usuário" class="form-control login-input">
                                </div>

                              <div class="mb-4">
                                <input type="password" v-model="data.password" placeholder="Digite sua senha" class="form-control login-input">
                              </div>

                              <div class="mb-3">
                                  <button type="submit" class="btn btn-dark w-100 login-btn">Entrar</button>
                              </div>
                            </form>
                        </div>
                     <div class="login-footer d-flex justify-content-center">
                         <p>Graninha 4.0 - Todos os direitos reservados 2023</p>
                     </div>
                   </div>
             </div>

        </div>
    </div>
</template>

<script>
  import {reactive} from "vue";
  import Alert from "@/components/alert/alert.vue";
  import {validateAndLogin} from "@/services/view/login/loginService";
  import Loading from "@/components/loading/loading.vue";
  import {useRouter} from "vue-router";

  export default {
    components: {Loading, Alert},
      setup(){
          let data = reactive({
             username: "",
             password: "",
             showLoading: false,
             alert: {
               show: false,
               message: ""
             }
          })

        let router = useRouter();

        let formSubmit = () => {
            validateAndLogin(data, router)
        }

         return {
             data,
             formSubmit
         }
      }
  }

</script>


<style scoped lang="scss">
     @import "loginstyle";
</style>