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
              Modulos
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li><router-link to="" class="nav-link dropdown-item" aria-current="page">Dashboard</router-link></li>
              <li><router-link to="/app/modules/contas" class="nav-link dropdown-item" aria-current="page">Contas</router-link></li>
              <li><router-link to="/app/modules/cartoes" class="nav-link dropdown-item" aria-current="page">Cartões</router-link></li>
              <li><router-link to="/app/modules/caixa" class="nav-link dropdown-item" aria-current="page">Caixa</router-link></li>
              <li><router-link to="/app/modules/cofrinhos" class="nav-link dropdown-item" aria-current="page">Cofrinhos</router-link></li>
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

    export default {
      components: {FontAwesomeIcon},
      setup(){
         let router = useRouter();
         const viewLogout = () => {
             alertConfirm("Confirmação", "Deseja deslogar do sistema?", () => {
                 store.commit("clearState")
                 router.push({name:"login"})
             })
         }
          return {
              viewLogout
          }
      }
    }
</script>

<style scoped lang="scss">
   @import "homestyle";
</style>