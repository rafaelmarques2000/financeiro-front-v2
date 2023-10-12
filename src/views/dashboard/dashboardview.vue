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
            <div class="row row-cols-1">
               <div class="col-md-6 dashboard-columns">
                 <div class="card">
                   <div class="card-header dashboard-card-header">
                     <h4>Gasto anual</h4>
                   </div>
                   <div class="card-body">
                     <canvas id="expenseChart" height="180"></canvas>
                   </div>
                 </div>
               </div>

              <div class="col-md-6 dashboard-columns">
                <div class="card">
                  <div class="card-header dashboard-card-header">
                    <h4>Curva de gastos</h4>
                  </div>
                  <div class="card-body">
                    <canvas id="spending-curve" height="180"></canvas>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="tab2-tab">

            <div class="container-fluid dash-filter">
                <div class="row row-cols-1">
                    <div class="col-md-3">
                        <label>Modulo</label>
                        <select v-model="data.filters.module" class="form-select">
                              <option :value="item.slug_name" v-for="item in data.accountTypes">{{item.description}}</option>
                        </select>
                    </div>

                  <div class="col-md-4 period-filter-content">
                    <label>Periodo</label>
                    <v-date-picker
                        v-model="data.filters.range"
                        mode="date"
                        is-range
                    >
                      <template v-slot="{ inputValue, inputEvents, isDragging }">
                        <div style="display: flex; width: 100%">
                          <input class="form-control" style="margin-right: 10px"
                                 :value="inputValue.start"
                                 v-on="inputEvents.start"
                          />
                          <span style="padding-left: 3px; padding-right: 11px; padding-top: 6px">até</span>
                          <input disabled
                                 class="form-control"
                                 :value="inputValue.end"
                                 v-on="inputEvents.end"
                          />
                          <button type="button" @click="searchFilter" style="margin-left: 13px; height: 36px;" class="btn btn-primary app-button">
                            <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
                          </button>
                        </div>
                      </template>
                    </v-date-picker>

                  </div>

                </div>
            </div>

            <div class="row row-cols-1">
                 <div class="col-md-6">
                   <div class="card pie-graph-card ">
                      <div class="card-header dashboard-card-header">
                          <h3>Gastos por categoria</h3>
                      </div>
                      <div class="card-body">
                        <no-content v-if="!data.dashboard.expensePerCategory.length" message="Não há dados para mostrar"></no-content>
                        <div class="pie-chart-content">
                            <canvas id="expense-per-category" height="300"></canvas>
                        </div>
                      </div>
                   </div>
                 </div>
                 <div class="col-md-6">
                     <div class="card pie-graph-card">
                         <div class="card-header dashboard-card-header">
                           <h3>Ranking de gastos</h3>
                         </div>
                         <div class="card-body">
                           <no-content message="Não há dados no período" style="position: relative; top: 50%" v-if="!data.dashboard.expensePerCategory.length"></no-content>
                           <div v-else class="categories-container" >
                               <div v-for="item in data.dashboard.expensePerCategory" class="categories-progress">
                                 <h4 class="ranking-title">{{item.description}} - {{ formatMoneyBRL(item.amount) }} <a href="" @click.prevent="viewOpenModalRanking(item.description, item.id, item.amount)" class="chart-ranking-details-btn" ><font-awesome-icon icon="fa-solid fa-arrow-up-right-from-square" /></a> </h4>
                                 <div class="progress" style="height: 20px;">
                                   <div class="progress-bar bar-animate" role="progressbar" :style="`width: ${item.percentage}%; background:${getChartColor(item.description)}`" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                 </div>
                               </div>
                           </div>

                         </div>
                     </div>
                 </div>
            </div>
        </div>
      </div>
      <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
      <modal v-if="data.chartRankingModal.show" :title="data.chartRankingModal.title" @close-modal="data.chartRankingModal.show = false" :show-action-buttons="false" :show-close-button="true">
          <div class="modal-table-content" style="width: 100%">
            <table class="table table-striped">
              <thead class="page-table-header">
              <tr class="page-table-header">
                <td>Data</td>
                <td>Conta origem</td>
                <td>Descrição</td>
                <td>Parcelado</td>
                <td>Qtd Parcelas</td>
                <td>Numero Parcela</td>
                <td>Valor</td>
              </tr>
              </thead>

              <tbody class="page-table-body">
              <tr v-for="item in data.transactionList">
                <td data-title="Data">{{item.date}}</td>
                <td data-title="Conta origem" class="nowrap">{{item.account.description}}</td>
                <td data-title="Descrição" class="nowrap">{{item.description}}</td>
                <td data-title="Parcelado">{{item.installment ? "Sim":"Não"}}</td>
                <td data-title="Qtd Parcelas">{{item.amount_installment}}</td>
                <td data-title="Numero Parcela">{{item.current_installment}}</td>
                <td data-title="Valor">{{formatMoneyBRL(item.amount)}}</td>
              </tr>
              </tbody>
            </table>
          </div>
      </modal>

    </div>
</template>

<script >
   import PageTitle from "@/components/page_title/pagetile.vue";
   import {onMounted, reactive} from "vue";
   import {getExpensePerCategory, getInvoiceReport} from "@/services/api/dashboardService";
   import NoContent from "@/components/nocontent/NoContent.vue";
   import {listAccountTypes} from "@/services/api/accountTypeService";
   import Loading from "@/components/loading/loading.vue";
   import {formatMoneyBRL} from "../../helper/moneyHelper";
   import Modal from "@/components/modal/modal.vue";
   import {getTransactionByCategory} from "@/services/api/transactionService";
   export default {
       name : "dashboard",
     methods: {formatMoneyBRL},
     components: {Modal, Loading, NoContent, PageTitle},
       setup(){

         const data = reactive({
              loading:{
                show: false
              },
              categoryId:"",
              years: [],
              accountTypes:[],
              transactionList:[],
              filters: {
                year: "",
                range: null,
                module: "cartao_credito"
              },
              dashboard:{
                  expense: [],
                  expensePerCategory:[]
              },
             chartRankingModal: {
               show: false,
               title: "",
               total: ""
             },
              config: {
                  expensePerCategoryBackgroundColors: []
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

         const searchFilter = () => {
            getExpensePerCategory(data)
         }

         const getChartColor = (item) => {
             let result = data.config.expensePerCategoryBackgroundColors.filter((color => {
                 return color.description === item
             }))
             return result[0].color
         }

         const viewOpenModalRanking = (description, categoryId, amount) => {
            data.chartRankingModal.show = true
            data.chartRankingModal.title = description
            data.chartRankingModal.total = amount
            data.categoryId = categoryId
            getTransactionByCategory(data)
         }


          onMounted(() => {
            const now = new Date()
            data.filters.range = {
              start: new Date(now.getFullYear(), now.getMonth(), 1),
              end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
            }


            generateSelectYears()
            getInvoiceReport(data)
            getExpensePerCategory(data)
            listAccountTypes(data)
          })

         return {
           data,
           updateBarChart,
           searchFilter,
           getChartColor,
           viewOpenModalRanking
         }
       }
   }
</script>

<style scoped lang="scss">
 @import "dashboardstyle";
</style>