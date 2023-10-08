<template>
    <div class="container-fluid">
        <page-title page-subtitle="Gerencie suas finanças" page-title="Dashboard" icon="fa-solid fa-chart-line"></page-title>
      <ul class="nav nav-tabs" id="myTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <a class="nav-link active" id="tab1-tab" data-bs-toggle="tab" href="#tab1" role="tab" aria-controls="tab1" aria-selected="true">Balanço anual</a>
        </li>
        <li class="nav-item" role="presentation">
          <a class="nav-link" id="tab2-tab" data-bs-toggle="tab" href="#tab2" role="tab" aria-controls="tab2" aria-selected="false">Balanço mensal</a>
        </li>
      </ul>

      <div class="tab-content" id="myTabsContent">

        <div class="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab">

            <div class="container-fluid dash-expense-filter d-flex align-items-md-end justify-content-end">
                <select @change="updateBarChart" v-model="data.filters.year" class="form-select">
                    <option v-for="item in data.years" :value="item">{{item}}</option>
                </select>
            </div>

          <no-content v-if="!data.dashboard.expense.length" message="Não há dados para mostrar"></no-content>

            <div class="container-fluid expense-chart-content">
               <canvas id="expenseChart" height="100"></canvas>
            </div>
        </div>

        <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">
          Contenido de la Tab 2
        </div>
      </div>
    </div>
</template>

<script >
   import PageTitle from "@/components/page_title/pagetile.vue";
   import {onMounted, reactive} from "vue";
   import {getInvoiceReport} from "@/services/api/dashboardService";
   import NoContent from "@/components/nocontent/NoContent.vue";
   export default {
       name : "dashboard",
     components: {NoContent, PageTitle},
       setup(){

         const data = reactive({
              loading:{
                show: false
              },
              years: [],
              filters: {
                year: ""
              },
              dashboard:{
                  expense: []
              }
         })

         const generateSelectYears = () => {
             let currentYear = new Date().getFullYear()
             const yearsToShow = 5;

             // Loop para gerar a lista de anos
             for (let i = currentYear; i <= currentYear + yearsToShow; i++) {
                  data.years.push(i)
             }
             data.filters.year = currentYear
         }

         const updateBarChart = () => {
             getInvoiceReport(data)
         }


          onMounted(() => {
            generateSelectYears()
            getInvoiceReport(data)

          })

         return {
           data,
           updateBarChart
         }
       }
   }
</script>

<style scoped lang="scss">
 @import "dashboardstyle";
</style>