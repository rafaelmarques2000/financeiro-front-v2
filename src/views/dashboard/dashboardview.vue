<template>
    <div class="container-fluid">
        <page-title page-subtitle="Gerencie suas finanças" page-title="Dashboard" icon="fa-solid fa-chart-line"></page-title>
        <canvas id="chart"></canvas>
    </div>
</template>

<script >
   import PageTitle from "@/components/page_title/pagetile.vue";
   import {onMounted, reactive} from "vue";
   import {getInvoiceReport} from "@/services/api/dashboardService";
   export default {
       name : "dashboard",
     components: {PageTitle},
       setup(){

         const data = reactive({
              dashboard:{
                  expense: null
              }
         })

          onMounted(() => {

            getInvoiceReport(data)

          })

         return {
           data
         }
       }
   }
</script>

<style scoped lang="scss">

</style>