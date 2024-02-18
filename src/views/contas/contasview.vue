<template>
   <div class="container-fluid">

     <page-title :page-subtitle="data.pageTitle.subtitle" :page-title="data.pageTitle.title" :icon="data.pageTitle.icon"></page-title>
     <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
     <div class="alert alert-primary statistic-container">
       <div class="row row-cols-2">
         <div class="col-md-2 statistic-columns">
           <h4 class="tipo-transacao-label">Saldo total</h4>
           <span><money-format :value="totalAmountAccounts"></money-format></span>
         </div>
       </div>
     </div>


     <div class="page-action">
       <button class="btn btn-primary app-button" v-if="!data.filter.archived" @click="viewOpenModalForm" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
       <button class="btn btn-primary app-button" v-else disabled type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
       <button class="btn btn-secondary app-button" @click="viewOpenCloseFilter" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
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
           </div>
         </div>
         <div class="col-md-4">
           <label class="form-label">Data</label>
           <div class="calendar-content d-flex">
           <v-date-picker
               mode="date"
               v-model = "data.filter.range"
               is-range
           >
             <template v-slot="{ inputValue, inputEvents, isDragging }">
               <div class="d-flex">
                 <input class="form-control"
                        :value="inputValue.start"
                        v-on="inputEvents.start"
                 />
                 <span style="padding: 10px">até</span>
                 <input disabled style="margin-right: 10px"
                        class="form-control"
                        :value="inputValue.end"
                        v-on="inputEvents.end"
                 />
               </div>
             </template>
           </v-date-picker>
             <div class="filter-actions d-flex">
               <button type="button" @click="viewSearchFilter" class="btn btn-primary app-button">
                 <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
               </button>
               <button type="button" @click="showArchives" class="btn btn-primary app-button app-clear-button">
                 <font-awesome-icon icon="fa-solid fa-box-archive"></font-awesome-icon>
               </button>
               <button type="button" @click="clearFilters" class="btn btn-primary app-button app-clear-button">
                 <font-awesome-icon icon="fa-solid fa-xmark"></font-awesome-icon>
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>

     <no-content v-if="!data.accounts.length" message="Não há dados"></no-content>

     <table v-else class="table table-striped page-table table-hover">
          <thead class="page-table-header">
             <tr>
                 <td>Descrição</td>
                 <td>Saldo</td>
                 <td>Ultima atualização</td>
                 <td></td>
             </tr>
          </thead>
          <tbody class="page-table-body">
             <tr v-for="item in data.accounts">
                <td @click.self="viewEnterTransaction(item.id)" data-title="Descrição">{{item.description}}</td>
                <td @click.self="viewEnterTransaction(item.id)" data-title="Saldo"><money-format :value="item.amount"></money-format> </td>
                <td @click.self="viewEnterTransaction(item.id)" data-title="Ultima atualização">{{formatDateAndHour(item.updated_at)}}</td>
                <td>
                   <div class="table-actions d-flex">
                     <button type="button" title="Editar" @click="viewOpenModalEditForm(item.id, item.description)"  class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                     <button type="button" title="Deletar" @click="viewDeleteAccountConfirmation(item.id, item.description)"  class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                     <button type="button" title="Arquivar" v-if="data.filter.archived === 0" @click="viewArchiveConfirmation(item.id, item.description)"  class="btn btn-outline-secondary"><font-awesome-icon icon="fa-solid fa-box-archive" /></button>
                     <button type="button" title="Desarquivar" v-else @click="viewUnarchiveConfirmation(item.id, item.description)"  class="btn btn-outline-secondary"><font-awesome-icon icon="fa-solid fa-box-open" /></button>
                   </div>
                </td>
             </tr>
          </tbody>
     </table>

     <div class="row" v-if="data.accounts.length">
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
     <modal v-if="data.modal.show" :show-close-button="true" :show-action-buttons="true" @close-modal="viewCloseModal" @save-data="viewModalSaveData" :title="data.modal.title" :icon="data.modal.icon">
          <div class="container-fluid">
              <div class="row">
                  <div class="col-md-12">
                      <label class="form-label">Descrição</label>
                      <input type="text" v-model="data.account.description" class="form-control" placeholder="Digite uma descrição">
                  </div>
              </div>

          </div>
     </modal>
   </div>
</template>

<script>

import {computed, onMounted, reactive, watch} from "vue";
import PageTitle from "@/components/page_title/pagetile.vue";
import {useRoute, useRouter} from "vue-router";
import {
  navigatePages,
  openCloseFilter, renderModalTitle,
  renderPageTitle, searchFilter,
  setInitialDateFilter,
} from "@/services/view/contas/contasviewservice";
import Loading from "@/components/loading/loading.vue";
import {
  accountlistAll, archiveAccount,
  deleteAccount, getAccountById,
  getAccountPeriodGeneralStatistic,
  saveAccount, updateAccount
} from "@/services/api/accountService";
import Badge from "@/components/badge/badge.vue";
import MoneyFormat from "@/components/money/moneyformat.vue";
import {generatePagesArray} from "@/services/utils/Pagination";
import {formatDateAndHour} from "@/services/utils/date";
import Modal from "@/components/modal/modal.vue";
import {getAccountType} from "@/services/api/accountTypeService";
import {alertConfirm} from "@/helper/alertHelper";
import {getAccountTransactions, getTransactionStatisticAccountPeriod} from "@/services/api/transactionService";
import store from "@/store";
import NoContent from "@/components/nocontent/NoContent.vue";

export default {
  components: {NoContent, Modal, MoneyFormat, Badge, Loading, PageTitle},
  setup(){
     let route = useRoute();
     let router = useRouter();
     let data = reactive({
          modal:{
              title:"Nova Conta",
              icon: "",
              show: false,
              operation: "new"
          },
          pageTitle: {
              title: "",
              subtitle: "",
              icon: ""
          },
          filter: {
             open: true,
             description: "",
             range: "",
             archived: 0
          },
          loading: {
             show : false
          },
          statistics: {},
          pagination: {
              pages: [],
              limit: 15,
              current_page:1,
              totalPages: 0,
              totalRows: 0
          },
          account:{
              id:"",
              description: "",
              account_type_id: "",
              archived: 0
          },
          accounts:[]
      });

     const viewOpenCloseFilter = () => {
         openCloseFilter(data)
     }

    const viewChangeLimitPerPage = () => {
       accountlistAll(data, route)
    }

    const viewListNavigation= (direction) => {
        navigatePages(data, route, direction)
    }

    const viewChangePageByPageNumber = (page) => {
        data.pagination.current_page = page
        accountlistAll(data, route)
    }

    const viewSearchFilter = () => {
        searchFilter(data, route)
    }

    const viewOpenModalForm = () => {
        renderModalTitle(data, route, "new")
        data.modal.show = true
        data.modal.operation = "new"
    }

    const viewCloseModal = () => {
        data.modal.show = false
        data.account.id = ""
        data.account.description = ""
    }

    const viewModalSaveData = () => {
         if(data.modal.operation === "new") {
           saveAccount(data, route, router)
         }else{
            updateAccount(data, route)
         }
    }

    const viewOpenModalEditForm = (id, description) => {
       data.account.id = id
       renderModalTitle(data, route, "edit", description)
       getAccountById(data, route)
       data.modal.show = true
       data.modal.operation = "edit"
    }

    const viewDeleteAccountConfirmation = (id, description) => {
        alertConfirm("Confirmação", `Deseja deletar a conta ${description}?`, () =>{
            data.account.id = id
            deleteAccount(data, route)
        })
    }

    const viewArchiveConfirmation = (id, description) => {
      alertConfirm("Confirmação", `Deseja arquivar ${description}?`, () =>{
        data.account.id = id
        data.account.archived = 1
        archiveAccount(data, route)
        getAccountPeriodGeneralStatistic(data, route)
      })
    }
    const viewUnarchiveConfirmation = (id, description) => {
      alertConfirm("Confirmação", `Deseja desarquivar ${description}?`, () =>{
        data.account.id = id
        data.account.archived = 0
        archiveAccount(data, route)
        getAccountPeriodGeneralStatistic(data, route)
      })
    }

    const viewEnterTransaction = (id) => {
        let module = route.params.module
        router.push({name: "transanctions_module", params: {module, id}})
    }

    const clearFilters = () => {
      data.filter.description = ""
      data.filter.archived = 0
      renderPageTitle(data, route)
      const now = new Date();
      data.filter.range = {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
      }
      store.commit("setDateFilter", data.filter.range)
      accountlistAll(data, route)
      getAccountPeriodGeneralStatistic(data, route)
    }

    const showArchives = () => {
        data.filter.archived = 1
        renderPageTitle(data, route)
        accountlistAll(data, route)
        getAccountPeriodGeneralStatistic(data, route)
    }

    //COMPUTED OR WATCHERS

    const totalAmountAccounts = computed(() => {
      return data.statistics.period_amount /100;
    })

    watch(() => data.accounts , (accounts) => {
      if(data.pagination.current_page > 1 && accounts.length === 0) {
        data.pagination.current_page -= 1
        accountlistAll(data, route)
      }
      data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
    })

     onMounted(() => {
         renderPageTitle(data, route)
         setInitialDateFilter(data)
         accountlistAll(data, route)
         getAccountPeriodGeneralStatistic(data, route)
         getAccountType(data, route)
     })


      return{
        data,
        viewOpenCloseFilter,
        viewChangeLimitPerPage,
        viewListNavigation,
        viewChangePageByPageNumber,
        viewSearchFilter,
        viewCloseModal,
        viewModalSaveData,
        viewOpenModalForm,
        viewDeleteAccountConfirmation,
        viewOpenModalEditForm,
        viewEnterTransaction,
        formatDateAndHour,
        totalAmountAccounts,
        clearFilters,
        viewArchiveConfirmation,
        showArchives,
        viewUnarchiveConfirmation
      }
  }
}
</script>

<style scoped lang="scss">
  @import "contasstyle";
</style>