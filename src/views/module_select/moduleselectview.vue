
<template>
     <div class="container-fluid">
          <page-title page-subtitle="Escolha um modulo para continuar" page-title="Seja bem-vindo, Admin"></page-title>
          <div class="row row-cols-2">
              <div class="col-md-2 col-margin" v-for="item in moduleList">

                <div v-if="item.external" class="card module-card" @click="openExternal(item.url)">
                  <div class="card-body flex-column d-flex align-items-center justify-content-center">
                    <font-awesome-icon class="module-icon" :icon="item.icon" />
                    <span class="module-name">{{item.title}}</span>
                  </div>
                </div>
                 <div v-else class="card module-card" @click="openModule(item.url, item.standalone , item.external)">
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
    import HttpService from "@/services/http/HttpService";

    export default {
      components: {PageTitle},
       setup(){
           let moduleList = [
               {
                  title: "Dashboard",
                  icon: "fa-solid fa-chart-line",
                  url: "https://grafana.globalapps.xyz/d/fc2129c0-7323-4414-90c8-ed4a09dd97a2/gastos-mensais-graninha-4-0?orgId=1",
                  external: true,
                  standalone: true
               },
               {
                 title: "Contas",
                 icon: "fa-solid fa-receipt",
                 url:"contas",
                 external: false,
                 standalone: false
               },
               {
                 title: "Cartões",
                 icon: "fa-solid fa-credit-card",
                 url:"cartoes",
                 external: false,
                 standalone: false
               },
               {
                 title: "Caixa",
                 icon: "fa-solid fa-money-bill",
                 url: "caixa",
                 external: false,
                 standalone: false
               },
               {
                 title: "Cofrinhos",
                 icon: "fa-solid fa-piggy-bank",
                 url: "goals_module",
                 external: false,
                 standalone: true
               },
             {
               title: "Lista de desejos",
               icon: "fa-solid fa-heart",
               url: "wishlist",
               external: false,
               standalone: true
             },
             {
               title: "Historico Transações",
               icon: "fa-solid fa-clock",
               url: "transaction_history",
               standalone: true,
               external: false,
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

         const openExternal = (url) =>{
           window.open(url, '_blank')
         }

         return {
             moduleList,
             openModule,
             openExternal
         }
       }
    }
</script>

<style scoped lang="scss">
  @import "moduleselectstyle";
</style>