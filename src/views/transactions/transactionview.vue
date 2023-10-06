<template>
   <div class="container-fluid">

     <page-title :page-subtitle="data.pageTitle.subtitle" :page-title="data.pageTitle.title" :icon="data.pageTitle.icon"></page-title>
     <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
     <div class="alert alert-primary statistic-container">
       <div class="row row-cols-2">
         <div v-for="item in data.statistics" class="col-md-2 statistic-columns">
           <h4 class="tipo-transacao-label">{{item.description}}</h4>
           <span><money-format :value="item.amount"></money-format></span>
         </div>
       </div>
     </div>


     <div class="page-action">
       <button class="btn btn-primary app-button" @click="viewOpenModalForm" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
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
           <button type="button" @click="viewSearchFilter" class="btn btn-primary app-button">
             <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
           </button>
           </div>
         </div>
       </div>
     </div>

     <no-content v-if="!isRegisters" message="Não há registros, Efetue uma busca ou adicione um novo registro"></no-content>
     <table v-else class="table table-striped page-table table-hover">
          <thead class="page-table-header">
             <tr>
                 <td>Descrição</td>
                 <td>Nome fatura</td>
                 <td>Data</td>
                 <td>Tipo</td>
                 <td>Categoria</td>
                 <td>Valor</td>
                 <td>Parcelado</td>
                 <td>Qtd.Parcelas</td>
                 <td>N.Parcela</td>
                 <td>Verificado</td>
                 <td></td>
             </tr>
          </thead>
          <tbody class="page-table-body">
             <tr v-for="item in data.transactions">
                <td data-title="Descrição" :class="{'checked-row': item.checked}">{{item.description}}</td>
                <td data-title="Nome fatura" :class="{'checked-row': item.checked}">{{formatEmptyValue(item.installment_description)}}</td>
                <td data-title="Data" :class="{'checked-row': item.checked}">{{item.date}}</td>
                <td data-title="Tipo" :class="{'checked-row': item.checked}">{{item.transaction_type.description}}</td>
                <td data-title="Categoria" :class="{'checked-row': item.checked}">{{item.category.description}}</td>
                <td data-title="Valor" :class="{'checked-row': item.checked}"><money-format :value="item.amount"></money-format> </td>
                <td data-title="Parcelado" :class="{'checked-row': item.checked}">{{formatParceladoLabel(item.installment)}}</td>
                <td data-title="Qtd.Parcelas" :class="{'checked-row': item.checked}">{{formatEmptyValue(item.amount_installment)}}</td>
                <td data-title="N.Parcela" :class="{'checked-row': item.checked}">{{formatEmptyValue(item.current_installment)}}</td>
                <td data-title="Verificado" :class="{'checked-row': item.checked}"><input type="checkbox" @change="viewCheckedTransaction(item.id, $event)" :checked="item.checked"/></td>

                <td :class="{'checked-row': item.checked}">
                   <div class="table-actions d-flex">
                     <button type="button" @click="viewOpenModalEditForm(item.id, item.description)"  class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                     <button type="button" @click="viewDeleteAccountConfirmation(item.id, item.description)"  class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                   </div>
                </td>
             </tr>
          </tbody>
     </table>

     <div class="row" v-if="isRegisters">
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
          <div class="container-fluid">

            <div class="row row-cols-1 transaction-form-rows">
                <div class="col-md-4">
                  <label for="description" class="form-label">Descrição</label>
                  <input type="text" v-model="data.transaction.description"  class="form-control" id="description" placeholder="Digite um nome para sua conta" aria-describedby="descriptionHelp">
                </div>

                <div class="col-md-4">
                  <label for="description" class="form-label">Nome na fatura</label>
                  <input type="text" v-model="data.transaction.installment_description"  class="form-control" id="description" placeholder="Digite o nome que esta escrito na fatura" aria-describedby="descriptionHelp">
                </div>

                <div class="col-md-4">
                  <label for="date" class="form-label">Data</label>
                  <input type="date" v-model="data.transaction.date" class="form-control" id="date" placeholder="Digite um nome para sua conta" aria-describedby="descriptionHelp">
                </div>
              </div>

              <div class="row row-cols-2 transaction-form-rows">
                <div class="col-6">
                  <label for="tipo" class="form-label">Tipo</label>
                  <select class="form-select" v-model="data.transaction.transaction_type">
                    <option value="">Selecione um tipo</option>
                    <option v-for="item in data.transactionTypes" :value="item.id">{{item.description}}</option>
                  </select>
                </div>

                <div class="col-md-6">
                  <label for="categoria" class="form-label">Categoria</label>
                  <select class="form-select" v-model="data.transaction.transaction_category" :disabled="data.selectStates.categoryDisable">
                    <option value="">Selecione uma categoria</option>
                    <option v-for="item in data.transactionCategories" :value="item.id">{{item.description}}</option>
                  </select>
                </div>


              </div>

            <div  class="row row-cols-2 transaction-form-rows">

              <div class="col-6">
                <label for="valor" class="form-label">Valor</label>
                <currency-input class="form-control" v-model="data.transaction.amount" :options="data.moneyInputConfig"></currency-input>
              </div>

              <div class="col-md-3" v-if="!isEdit">
                <label for="categoria" class="form-label">Parcelamento ?</label>
                <select class="form-select" v-model="data.transaction.installment">
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
                </select>
              </div>
              <div  class="col-md-1" v-if="!isEdit">
                <label for="parcelas" class="form-label">Parcelas</label>
                <input type="text" @keyup="viewSimulateInstallmentsAmount" v-model="data.transaction.amount_installments" class="form-control" :disabled="data.selectStates.installmentDisable" id="parcelas" placeholder="Parcelas">
              </div>
              <div  class="col-md-2" v-if="!isEdit">
                <label for="valor_parcela" class="form-label">Valor parcela</label>
                <CurrencyInput :options="{ currency: 'BRL' }" v-model="data.simulateInstallment" disabled class="form-control"></CurrencyInput>
              </div>
            </div>

            <div class="row" v-if="data.isInstallment && data.transaction.related_installments.length">

              <table class="table table-striped installment-table">
                <thead class="page-table-header">
                  <tr>
                    <td>Descrição</td>
                    <td>Nome na fatura</td>
                    <td>Competência</td>
                    <td>Numero Parcela</td>
                    <td>Valor</td>
                  </tr>
                </thead>
               <tbody class="installment-table-body">
                  <tr v-for="item in data.transaction.related_installments" class="page-table-row">
                    <td data-title="Descrição"><input type="text" class="form-control installment-table-input-size" v-model="item.description"></td>
                    <td data-title="Nome na fatura"><input type="text" class="form-control installment-table-input-size" v-model="item.installment_description"></td>
                    <td data-title="Competência">{{ item.month }}/{{item.year}}</td>
                    <td data-title="Numero Parcela">{{ item.current_installment }}</td>
                    <td data-title="Valor"><CurrencyInput :options="data.moneyInputConfig" v-model="item.amount" class="form-control installment-table-input-size"></CurrencyInput></td>
                  </tr>
               </tbody>
              </table>
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
  openCloseFilter,
  setInitialDateFilter,
} from "@/services/view/contas/contasviewservice";
import Loading from "@/components/loading/loading.vue";
import Badge from "@/components/badge/badge.vue";
import MoneyFormat from "@/components/money/moneyformat.vue";
import {generatePagesArray} from "@/services/utils/Pagination";
import {formatDateAndHour} from "@/services/utils/date";
import Modal from "@/components/modal/modal.vue";
import {alertConfirm} from "@/helper/alertHelper";
import {
  formatEmptyValue,
  formatParceladoLabel,
  navigateTransactionPages,
  renderTransactionPageTitle,
  searchTransactionFilter, validateFormAndSubmit
} from "@/services/view/transactions/transactionviewservice";
import {
  checkAndUncheckTransaction,
  deleteTransaction,
  getAccountTransactions, getTransactionById,
  getTransactionStatisticAccountPeriod, saveTransaction, updateTransaction
} from "@/services/api/transactionService";
import {listTransactionType} from "@/services/api/TransactionTypeService";
import {listTransactionCategories} from "@/services/api/TransactionCategoriesService";
import NoContent from "@/components/nocontent/NoContent.vue";
import CurrencyInput from "@/components/CurrencyInput.vue";

export default {
  components: {CurrencyInput, NoContent, Modal, MoneyFormat, Badge, Loading, PageTitle},
  setup(){
     let route = useRoute();
     let data = reactive({
          modal:{
              title:"Nova Transação",
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
             range: ""
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
       transactionTypes: [],
       transactionCategories: [],
       inputLabels: [
          "Descrição", "Nome Fatura", "Data" , "Tipo", "Categoria", "Valor", "Quantidade"
       ],
       selectStates: {
         categoryDisable: true,
         installmentDisable: true
       },
       simulateInstallment: 0,
       isInstallment: false,
       transactionId: "",
        transaction: {
          description: "",
          installment_description:"",
          date: "",
          transaction_type:"",
          transaction_category: "",
          amount: null,
          installment: "false",
          amount_installments: 0,
          related_installments: []
        },
        transactions: [],
        moneyInputConfig: {
              currency:'BRL',
              locale:'pt-BR',
              precision: 2,
              autoDecimalDigits: true
          }
      });

     const viewOpenCloseFilter = () => {
         openCloseFilter(data)
     }

    const viewChangeLimitPerPage = () => {
       getAccountTransactions(data, route)
    }

    const viewListNavigation= (direction) => {
        navigateTransactionPages(data, route, direction)
    }

    const viewChangePageByPageNumber = (page) => {
        data.pagination.current_page = page
        getAccountTransactions(data, route)
    }

    const viewSearchFilter = () => {
        searchTransactionFilter(data, route)
    }

    const viewOpenModalForm = () => {
        data.modal.show = true
        data.modal.operation = "new"
        data.modal.title = "Nova transação"
        data.modal.icon = "fa-solid fa-circle-plus"
    }

    const viewCloseModal = () => {
        data.modal.show = false
        data.transaction = {
          installment_description:"",
          description: "",
          date: "",
          transaction_type:"",
          amount: null,
          transaction_category: "",
          installment: "false",
          amount_installments: 0,
          related_installments: []
        }
    }

    const viewModalSaveData = () => {
        validateFormAndSubmit(data, () => {
            if(data.modal.operation === "new") {
              saveTransaction(data, route)
            }else{
              updateTransaction(data, route)
            }
        })
    }

    const viewOpenModalEditForm = (id, description) => {
       data.transactionId = id
       getTransactionById(data, route)
       data.modal.show = true
       data.modal.operation = "edit"
       data.modal.title = `Editar - ${description}`
       data.modal.icon = "fa-solid fa-pen-to-square"
    }

    const viewDeleteTransactionConfirmation = (id, description) => {
        alertConfirm("Confirmação", `Deseja deletar a transação ${description}?`, () =>{
            data.transaction.id = id
            deleteTransaction(data, route)
        })
    }

    const viewSimulateInstallmentsAmount = () => {
       if(data.transaction.amount_installments === "") {
           data.simulateInstallment = 0;
           return;
       }
       data.simulateInstallment  =data.transaction.amount/ data.transaction.amount_installments
    }

    let viewCheckedTransaction = (transactionId, event) => {
      data.transactionId = transactionId
      data.transactions = data.transactions.map((transaction) => {
        if(transaction.id === transactionId) {
          transaction.checked = event.target.checked
          return transaction
        }
        return transaction
      })
      checkAndUncheckTransaction(data, route,  event.target.checked)
    }

    //COMPUTED OR WATCHERS
    const isEdit = computed(() => {
         return data.modal.operation === "edit"
    });

    const isRegisters = computed(() => {
      return data.transactions.length > 0
    });

    watch(() => data.transactions , (transactions) => {
      if(data.pagination.current_page > 1 && transactions.length === 0) {
        data.pagination.current_page -= 1
        getAccountTransactions(data, route)
      }
      data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
    })

    watch(() => data.transaction.transaction_type , (transaction_type) => {
      if(transaction_type === "") {
        data.selectStates.categoryDisable = true;
        data.transactionCategories = []
        return
      }
      data.selectStates.categoryDisable = false
      listTransactionCategories(data)
    })

    watch(() => data.transaction.installment, (isInstalment) => {
      if(isInstalment === "true") {
        data.selectStates.installmentDisable = false
        return
      }
      data.transaction.amount_installments = 0
      data.selectStates.installmentDisable = true
    })

     onMounted(() => {
         setInitialDateFilter(data)
         renderTransactionPageTitle(data, route)
         getTransactionStatisticAccountPeriod(data,route)
         getAccountTransactions(data, route)
         listTransactionType(data)
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
        viewDeleteAccountConfirmation: viewDeleteTransactionConfirmation,
        viewOpenModalEditForm,
        viewSimulateInstallmentsAmount,
        isEdit,
        isRegisters,
        formatDateAndHour,
        formatParceladoLabel,
        viewCheckedTransaction,
        formatEmptyValue
      }
  }
}
</script>

<style scoped lang="scss">
  @import "transactionstyle";
</style>