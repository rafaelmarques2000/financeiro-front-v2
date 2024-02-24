<template>
  <nav class="navbar custom-navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"><font-awesome-icon icon="fa-solid fa-sack-dollar"></font-awesome-icon> Graninha 4.0</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/app/modules" class="nav-link active" aria-current="page"> <font-awesome-icon icon="fa-solid fa-home"></font-awesome-icon> Inicio</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon icon="fa-solid fa-list"></font-awesome-icon> Modulos
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><router-link to="/app/modules/dashboard" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-chart-line" /> Dashboard</router-link></li>
              <li><router-link to="/app/modules/contas" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-receipt" /> Contas</router-link></li>
              <li><router-link to="/app/modules/cartoes" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-credit-card" /> Cartões</router-link></li>
              <li><router-link to="/app/modules/caixa" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-money-bill" /> Caixa</router-link></li>
              <li><router-link to="/app/modules/cofrinhos" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-piggy-bank" /> Cofrinhos</router-link></li>
              <li><router-link to="/app/modules/wishlist" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-heart" /> Lista de desejos</router-link></li>
              <li><router-link to="/app/modules/transaction-history" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-clock" /> Historico Transações</router-link></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon icon="fa-solid fa-gear"></font-awesome-icon> Configurações
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><router-link to="/app/modules/config/categories" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-list" /> Categorias</router-link></li>
              <li><router-link to="/app/modules/config/alerts" class="nav-link dropdown-item" aria-current="page"><font-awesome-icon  icon="fa-solid fa-bell" /> Alertas</router-link></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" @click.prevent="viewLogout" aria-current="page" href="#"><font-awesome-icon icon="fa-solid fa-right-from-bracket"></font-awesome-icon> Sair</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

   <div class="container-fluid main-container">
        <router-view :key="$route.params.module"></router-view>
   </div>

</template>

<script>
    import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
    import {alertConfirm} from "@/helper/alertHelper";
    import store from "@/store";
    import {useRouter} from "vue-router";
    import {initializeApp} from "firebase/app";
    import {getMessaging, getToken} from "firebase/messaging";
    import {saveToken} from "@/services/api/firebaseService";
    import {onMounted} from "vue";

    export default {
      components: {FontAwesomeIcon},

      setup(){
         let router = useRouter();

        let saveFCMToken = () => {
          const firebaseConfig = {
            apiKey: "AIzaSyCiAWY3wcWo8ah-4fxNxeEUSOkctaZ1Fyg",
            authDomain: "graninha-push-alert.firebaseapp.com",
            projectId: "graninha-push-alert",
            storageBucket: "graninha-push-alert.appspot.com",
            messagingSenderId: "358604125063",
            appId: "1:358604125063:web:200dc04cf7eebd77ff5922"
          };

          const firebaseApp = initializeApp(firebaseConfig);
          const messaging = getMessaging(firebaseApp);

          getToken(messaging)
              .then((currentToken) => {
                if (currentToken) {
                  saveToken(currentToken)
                } else {
                  console.log('Não foi possível obter o token do dispositivo.');
                }
              })
              .catch((error) => {
                console.error('Erro ao obter o token do dispositivo:', error);
              });
        }
         const viewLogout = () => {
             alertConfirm("Confirmação", "Deseja deslogar do sistema?", () => {
                 store.commit("clearState")
                 router.push({name:"login"})
             })
         }
         onMounted(() => {
           saveFCMToken()
         })
          return {
              viewLogout
          }
      }
    }
</script>

<style scoped lang="scss">
   @import "homestyle";
</style>