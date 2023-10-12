<template>
      <div class="container-fluid">
        <page-title :page-subtitle="data.pageTitle.subtitle" :page-title="data.pageTitle.title" :icon="data.pageTitle.icon"></page-title>
        <loading message="Processando aguarde..." v-if="data.loading.show"></loading>
        <div class="page-action">
          <button class="btn btn-primary app-button" @click="viewOpenModalForm" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
          <button class="btn btn-secondary app-button" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
          <div class="show-per-page">
            <select class="form-select show-pages" @change="viewChangeLimitPerPage" v-model="data.pagination.limit">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <div class="filter-body" v-if="data.filter.open">
          <div class="row row-cols-1">
            <div class="col-md-6">
              <label class="form-label">Descrição</label>
              <div class="input-group">
                <input type="text" v-model="data.filter.description" class="form-control">
                <button type="button" @click="viewSearchFilter" class="btn btn-primary app-button">
                  <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
                </button>
              </div>

            </div>
          </div>
        </div>

        <no-content v-if="!isData" message="Não há metas cadastradas"></no-content>

        <div v-else class="row row-cols-1 goal-cards">
            <div class="col-md-4 goals-cards-columns" v-for="item in data.goals">
                <div class="card">
                    <div class="card-header">
                         <h3>{{item.description}}</h3>
                    </div>

                    <div class="card-body">
                      <ul class="meta-list">
                        <li><b style="font-weight: bold">Meta:</b> {{formatMoneyBRL(item.amount)}}</li>
                        <li><b style="font-weight: bold">Total arrecadado:</b> {{formatMoneyBRL(item.balance.goal_contributions)}}</li>
                        <li><b style="font-weight: bold">Restante:</b> {{formatMoneyBRL(item.balance.goal_remaining)}}</li>
                        <li>
                          <div class="progress" style="height: 20px;">
                            <div v-if="item.balance.percentage < 100" class="progress-bar bar-animate" role="progressbar" :style="`width:${item.balance.percentage}%`" style="background: #ff7b9a" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            <div v-else class="progress-bar bar-animate" role="progressbar"  style="width:100%; background: #3c9536" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div class="card-footer">
                      <div class="row-btn-actions d-flex">
                        <button type="button" @click="openAportesModal(item)" class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-circle-plus" /> Aportes</button>
                        <button type="button" @click="viewOpenModalEditForm(item.id, item.description)" class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                        <button type="button" @click="viewDeleteGoalPrompt(item.id, item.description)" class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                      </div>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="isData" class="row">
          <div class="col-12">
            <nav aria-label="Page navigation example">
              <ul class="pagination">
                <li class="page-item"><a @click.prevent="viewListNavigation('prev')" class="page-link" href="#">Anterior</a></li>
                <li v-for="page in data.pagination.pages" class="page-item">
                  <span class="page-link" v-if="page === '...'">...</span>
                  <a v-else @click.prevent="viewChangePageByPageNumber(page)" class="page-link" :class="{active: data.pagination.current_page === page}" href="#">{{page}}</a>
                </li>
                <li class="page-item"><a  @click.prevent="viewListNavigation('next')" class="page-link" href="#">Proximo</a></li>
              </ul>
            </nav>
          </div>
        </div>


        <modal v-if="data.modal.show" @close-modal="viewCloseModal" :show-action-buttons="true" :show-close-button="true" @save-data="viewModalSaveData" :title="data.modal.title" :icon="data.modal.icon">
              <div class="row row-cols-1">
                  <div class="col-md-6">
                     <label for="description" class="form-label">Descrição</label>
                     <input type="text" class="form-control" placeholder="digite uma descrição" v-model="data.goal.description">
                  </div>
                  <div class="col-md-6">
                    <label for="description" class="form-label">Meta</label>
                    <currency-input class="form-control" :options="data.moneyInputConfig" v-model="data.goal.amount"></currency-input>
                  </div>
              </div>
        </modal>


        <modal v-if="aportesData.modal.show" :show-action-buttons="false" :show-close-button="true" @close-modal="viewCloseAporteModal" :title="aportesData.modal.title">
            <div class="alert alert-info">
              <div class="row row-cols-2">
                <div class="col-md-3">
                  <h4 class="tipo-transacao-label">Meta:</h4>
                  <span class="value-label positive-label">{{formatMoneyBRL(aportesData.goalBalance.meta)}}</span>
                </div>

                <div class="col-md-3">
                  <h4 class="tipo-transacao-label">Total arrecadado:</h4>
                  <span class="value-label positive-label">{{formatMoneyBRL(aportesData.goalBalance.goalContributions)}}</span>
                </div>

                <div class="col-md-3">
                  <h4 class="tipo-transacao-label">Restante:</h4>
                  <span class="value-label positive-label">{{formatMoneyBRL(aportesData.goalBalance.goalRemaining)}}</span>
                </div>

                <div class="col-md-3">
                  <h4 class="tipo-transacao-label">Concluída:</h4>
                  <span class="value-label positive-label">{{aportesData.goalBalance.percentage.toFixed(2)}}%</span>
                </div>

              </div>
            </div>

          <div class="row row-cols-1 form-row">
            <div class="col-md-4">
              <label class="form-label">Descrição</label>
              <input type="text" v-model="aportesData.goalContribution.description" class="form-control">
            </div>
            <div class="col-md-4">
              <label class="form-label">Valor</label>
              <CurrencyInput class="form-control" v-model="aportesData.goalContribution.amount" :options="data.moneyInputConfig"></CurrencyInput>
            </div>
            <div class="col-md-2">
              <label class="form-label">Tipo:</label>
              <select v-model="aportesData.goalContribution.operation_type" class="form-select">
                <option value="">Selecione um tipo</option>
                <option value="positive">Entrada</option>
                <option value="negative">Saida</option>
              </select>
            </div>
            <div class="col-md-2">
              <button @click="submitGoalContribution()" class="btn btn-primary app-button btn-cadastrar-aporte">Cadastrar</button>
            </div>
          </div>

          <table class="table table-striped">
            <thead class="page-table-header">
              <tr>
                <td>Descrição</td>
                <td>Valor</td>
                <td></td>
              </tr>
            </thead>
            <tbody class="page-table-body">
              <tr v-for="item in aportesData.goalContributionsPaginated" class="page-table-row">
                <td data-title="Descrição">{{item.description}}</td>
                <td data-title="Valor">
                  <money-format :value="item.amount"></money-format>
                </td>
                <td><button type="button" @click="ViewDeleteGoalContribution(item.id, item.description)" class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button></td>
              </tr>
            </tbody>
          </table>

          <div class="row" v-if="aportesData.goalContributionsPaginated.length">
            <div class="col-12">
              <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item"><a @click.prevent="navigatePagesAportes('prev')" class="page-link" href="#">Anterior</a></li>
                  <li v-for="page in aportesData.goalContributionsPagination.pages" class="page-item">
                    <span class="page-link" v-if="page === '...'">...</span>
                    <a v-else @click.prevent="linkNavigationPageArray(page - 1)" class="page-link" :class="{active: aportesData.goalContributionsPagination.currentPage === page - 1}" href="#">{{page}}</a>
                  </li>
                  <li class="page-item"><a @click.prevent="navigatePagesAportes('next')" class="page-link" href="#">Proximo</a></li>
                </ul>
              </nav>
            </div>
          </div>

        </modal>
        <loading message="Processando aguarde..." v-if="aportesData.loading.show"></loading>

      </div>
</template>

<script>
     import PageTitle from "@/components/page_title/pagetile.vue";
     import {computed, onMounted, reactive, watch} from "vue";
     import Loading from "@/components/loading/loading.vue";
     import {deleteGoal, findAll, findById, saveGoal, updateGoal} from "@/services/api/goalService";
     import {formatMoneyBRL} from "../../helper/moneyHelper";
     import Modal from "@/components/modal/modal.vue";
     import CurrencyInput from "@/components/CurrencyInput.vue";
     import {navigateTransactionPages, validateFormAndSubmit} from "@/services/view/goal/goalviewservice";
     import {alertConfirm} from "@/helper/alertHelper";
     import {generatePagesArray} from "@/services/utils/Pagination";
     import NoContent from "@/components/nocontent/NoContent.vue";
     import {
       aportesData, closeModal, isGoalContributionsData,
       linkNavigationPageArray,
       navigatePagesAportes,
       openAportesModal, submitGoalContribution, ViewDeleteGoalContribution
     } from "@/services/view/goal/goalviewaportes";
     import MoneyFormat from "@/components/money/moneyformat.vue";

     export default {
         name: "goals",
         components: {MoneyFormat, NoContent, CurrencyInput, Modal, Loading, PageTitle},
         setup() {
              const data = reactive({
                    modal:{
                      title:"Novo cofrinho",
                      icon: "",
                      show: false,
                      operation: "new"
                    },
                    pageTitle: {
                      title: "Cofrinhos",
                      subtitle: "Gerencie suas metas",
                      icon: "fa-solid fa-piggy-bank"
                    },
                    filter: {
                      open: true,
                      description: "",
                      range: ""
                    },
                    loading: {
                      show : false
                    },
                    pagination: {
                      pages: [],
                      limit: 15,
                      current_page:1,
                      totalPages: 0,
                      totalRows: 0
                    },
                    goal:{
                       id: "",
                       description:"",
                       amount: 0
                    },
                    goals:[],
                    goalBalance: {
                      meta: 0,
                      goalContributions: 0,
                      goalRemaining: 0,
                      percentage: 0,
                    },

                    moneyInputConfig: {
                      currency:'BRL',
                      locale:'pt-BR',
                      precision: 2,
                      autoDecimalDigits: true
                    }
              })

           const viewOpenModalForm = () => {
             data.modal.show = true
             data.modal.operation = "new"
             data.modal.title = "Novo cofrinho"
             data.modal.icon = "fa-solid fa-circle-plus"
           }

           const viewCloseModal = () => {
             data.modal.show = false
             data.goal.id = ""
             data.goal.description = ""
             data.goal.amount = 0
           }

           const viewModalSaveData = () => {
                validateFormAndSubmit(data, () => {
                  if(data.modal.operation === "new") {
                    saveGoal(data)
                  }else{
                    updateGoal(data)
                  }
                });
           }

           const viewOpenModalEditForm = (id, description) => {
             data.modal.show = true
             data.modal.operation = "edit"
             data.modal.title = `Editar - ${description}`
             data.modal.icon = "fa-solid fa-pen-to-square"
             data.goal.id = id
             findById(data)
           }

           const viewDeleteGoalPrompt = (id, description) => {
                alertConfirm("Atenção", `Deseja deletar ${description}`, () => {
                      data.goal.id = id
                      deleteGoal(data)
                })
           }

           const viewChangeLimitPerPage = () => {
             findAll(data)
           }

           const viewListNavigation= (direction) => {
             navigateTransactionPages(data, direction)
           }

           const viewChangePageByPageNumber = (page) => {
             data.pagination.current_page = page
             findAll(data)
           }

           const viewSearchFilter = () => {
                findAll(data)
           }

           const viewCloseAporteModal = () => {
                closeModal(data);
           }

           //WATCHS AND COMPUTED

           watch(() => data.goals , (transactions) => {
             if(data.pagination.current_page > 1 && transactions.length === 0) {
               data.pagination.current_page -= 1
               findAll(data)
             }
             data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
           })

           const isData = computed(() => {
               return data.goals.length > 0
           });


           onMounted(() => {
                findAll(data)
           })

           return {
                data,
                viewOpenModalForm,
                viewCloseModal,
                viewModalSaveData,
                viewOpenModalEditForm,
                viewDeleteGoalPrompt,
                viewChangeLimitPerPage,
                viewListNavigation,
                viewChangePageByPageNumber,
                viewSearchFilter,
                viewCloseAporteModal,
                ViewDeleteGoalContribution,
                submitGoalContribution,
                closeModal,
                linkNavigationPageArray,
                navigatePagesAportes,
                openAportesModal,
                formatMoneyBRL,
                isData,
                aportesData
           }
         }
     }
</script>

<style scoped lang="scss">
  @import "goalsstyle";
</style>