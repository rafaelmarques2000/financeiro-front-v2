<template>
   <div class="container-fluid">
        <page-title page-subtitle="Consulte historico de lançamentos em todas as contas" icon="fa-solid fa-clock" page-title="Historico Transações"></page-title>
       <div class="page-action">
         <div class="show-per-page">
           <select class="form-select show-pages" @change="viewSearchFilter" v-model="data.pagination.limit">
             <option value="5">5</option>
             <option value="10">10</option>
             <option value="15">15</option>
             <option value="50">50</option>
             <option value="100">100</option>
             <option value="500">500</option>
           </select>
         </div>
       </div>

     <div class="filter-body" v-if="data.filter.open">
       <div class="row row-cols-1">
         <div class="col-md-3">
           <label class="form-label">Descrição</label>
           <div class="input-group">
             <input type="text" v-model="data.filter.description" class="form-control">
           </div>
         </div>

         <div class="col-md-3">
           <div class="type-account-filter" style="padding-top: 8px">
             <label>Conta</label>
             <select v-model="data.filter.accountId" class="form-select">
                 <option value="">Selecione uma conta</option>
                 <option :value="item.id" v-for="item in data.accounts">{{item.description}}</option>
             </select>
           </div>
         </div>
         <div class="col-md-4">
           <label class="form-label" style="padding: 0">Data Criação</label>
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

     <no-content v-if="!isRegisters" message="Não há registros"></no-content>
     <table v-else class="table table-striped page-table table-hover">
       <thead class="page-table-header">
       <tr>
         <td>Conta Origem</td>
         <td>Tipo</td>
         <td>Descrição</td>
         <td>Nome fatura</td>
         <td>Data</td>
         <td>Data Criação</td>
         <td>Tipo</td>
         <td>Categoria</td>
         <td>Valor</td>
         <td>Parcelado</td>
         <td>Qtd.Parcelas</td>
         <td>N.Parcela</td>
       </tr>
       </thead>
       <tbody class="page-table-body">
           <tr v-for="item in data.transactions">
             <td data-title="Conta origem">{{item.account.description}}</td>
             <td data-title="Tipo">{{item.account.account_type.description}}</td>
             <td data-title="Descrição" >{{item.description}}</td>
             <td data-title="Nome fatura" >{{formatEmptyValue(item.installment_description)}}</td>
             <td data-title="Data">{{item.date}}</td>
             <td data-title="Data Criação">{{item.created_at}}</td>
             <td data-title="Tipo"><span>{{item.transaction_type.description}}</span></td>
             <td data-title="Categoria">{{item.category.description}}</td>
             <td data-title="Valor"><money-format :value="item.amount"></money-format> </td>
             <td data-title="Parcelado">{{formatParceladoLabel(item.installment)}}</td>
             <td data-title="Qtd.Parcelas">{{formatEmptyValue(item.amount_installment)}}</td>
             <td data-title="N.Parcela">{{formatEmptyValue(item.current_installment)}}</td>
           </tr>
       </tbody>
     </table>

     <div class="row">
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

     <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
   </div>
</template>

<script>
    import PageTitle from "@/components/page_title/pagetile.vue";
    import {computed, onMounted, reactive, watch} from "vue";
    import NoContent from "@/components/nocontent/NoContent.vue";
    import MoneyFormat from "@/components/money/moneyformat.vue";
    import {
      formatEmptyValue,
      formatParceladoLabel,
      searchTransactionFilter
    } from "../../services/view/transactions/transactionviewservice";
    import {generatePagesArray} from "@/services/utils/Pagination";
    import {listAllTransactionHistory} from "@/services/api/TransactionHistoryService";
    import {setInitialDateFilter} from "@/services/view/contas/contasviewservice";
    import Loading from "@/components/loading/loading.vue";
    import {listAccountTypes} from "@/services/api/accountTypeService";
    import {getUserAccounts} from "@/services/api/accountService";

    export default {
      methods: {formatParceladoLabel, formatEmptyValue},
      components: {Loading, MoneyFormat, NoContent, PageTitle},
        setup(){
           const data = reactive({
             loading: {
               show : false
             },
             accountTypes:[],
             accounts:[],
             filter: {
               open: true,
               description: "",
               range: "",
               accountId:""
             },
             pagination: {
               pages: [],
               limit: 15,
               current_page:1,
               totalPages: 0,
               totalRows: 0
             },
             transactions:[]
           })


          const viewListNavigation = (direction) => {
            if(direction === 'prev') {
              if(data.pagination.current_page > 1) {
                data.pagination.current_page -=1
                listAllTransactionHistory(data)
                return;
              }
            }

            if(direction === 'next') {
              if(data.pagination.current_page >= data.pagination.totalPages) {
                return
              }
              data.pagination.current_page +=1
              listAllTransactionHistory(data)
            }
          }

          const isRegisters = computed(() => {
            return data.transactions.length > 0
          });


          const viewChangePageByPageNumber = (page) => {
              data.pagination.current_page = page
              listAllTransactionHistory(data)
          }

          const viewSearchFilter = () => {
            listAllTransactionHistory(data)
          }

          watch(() => data.transactions , (transactions) => {
            if(data.pagination.current_page > 1 && transactions.length === 0) {
              data.pagination.current_page -= 1
              listAllTransactionHistory(data)
            }
            data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
          })

          onMounted(() => {
            setInitialDateFilter(data)
            listAllTransactionHistory(data)
            listAccountTypes(data)
            getUserAccounts(data)
          })

           return {
             data,
             isRegisters,
             viewListNavigation,
             viewChangePageByPageNumber,
             viewSearchFilter,
           }
        }
    }
</script>


<style scoped lang="scss">
@import "transactionhistorystyle";
</style>