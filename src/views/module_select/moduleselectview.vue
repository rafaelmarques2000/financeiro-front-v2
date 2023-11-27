
<template>
     <div class="container-fluid">
          <page-title page-subtitle="Escolha um modulo para continuar" page-title="Seja bem-vindo, Admin"></page-title>
          <div class="row row-cols-2">
              <div class="col-md-2 col-margin" v-for="item in moduleList">
                   <div class="card module-card" @click="openModule(item.url, item.standalone)">
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
                  url: "dashboard_module",
                  standalone: true
               },
               {
                 title: "Contas",
                 icon: "fa-solid fa-receipt",
                 url:"contas",
                 standalone: false
               },
               {
                 title: "Cartões",
                 icon: "fa-solid fa-credit-card",
                 url:"cartoes",
                 standalone: false
               },
               {
                 title: "Caixa",
                 icon: "fa-solid fa-money-bill",
                 url: "caixa",
                 standalone: false
               },
               {
                 title: "Cofrinhos",
                 icon: "fa-solid fa-piggy-bank",
                 url: "goals_module",
                 standalone: true
               },
             {
               title: "Listas",
               icon: "fa-solid fa-list",
               url:"lists",
               standalone: true
             },
             {
               title: "Historico Transações",
               icon: "fa-solid fa-clock",
               url: "transaction_history",
               standalone: true
             }
           ]

         let router = useRouter()

         const openModule = (url, standalone) => {
             if(standalone){
                router.push({
                    name: url
                })
                return
             }

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