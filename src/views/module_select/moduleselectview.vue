
<template>
     <div class="container-fluid">
          <page-title page-subtitle="Escolha um modulo para continuar" page-title="Seja bem-vindo, Admin"></page-title>
          <div class="row row-cols-2">
              <div class="col-md-2 col-margin" v-for="item in moduleList">
                   <div class="card module-card" @click="openModule(item.url)">
                        <div class="card-body flex-column d-flex align-items-center justify-content-center">
                          <font-awesome-icon class="module-icon" :icon="item.icon" />
                          <span class="module-name">{{item.title}}</span>
                        </div>
                   </div>
              </div>
          </div>


     </div>
</template>

<script>
    import {useRouter} from "vue-router";
    import PageTitle from "@/components/page_title/pagetile.vue";

    export default {
      components: {PageTitle},
       setup(){
           let moduleList = [
               {
                  title: "Dashboard",
                  icon: "fa-solid fa-chart-line",
                  url: "dashboard"
               },
               {
                 title: "Contas",
                 icon: "fa-solid fa-receipt",
                 url:"contas",
               },
               {
                 title: "Cartões",
                 icon: "fa-solid fa-credit-card",
                 url:"cartoes"
               },
               {
                 title: "Caixa",
                 icon: "fa-solid fa-money-bill",
                 url: "caixa"
               },
               {
                 title: "Cofrinhos",
                 icon: "fa-solid fa-piggy-bank",
                 url: "cofrinho"
               }
           ]

         let router = useRouter()

         const openModule = (url) => {
            router.push(
                {
                  name: "conta_module",
                  params:{module: url}
                }
            )
         }

         return {
             moduleList,
             openModule
         }
       }
    }
</script>

<style scoped lang="scss">
  @import "moduleselectstyle";
</style>