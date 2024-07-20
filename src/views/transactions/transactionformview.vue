<template>
    <div class="container-fluid">

      <page-title :page-subtitle="`Conta: ${data.page.subtitle}`" :page-title="'Nova Transação'"></page-title>
      <loading v-if="data.loading.show" message="Processando aguarde..."></loading>

      <div class="card">

        <div class="card-body">


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
              <input type="date" v-model="data.transaction.date" class="form-control" id="date" placeholder="Digite a data da transação" aria-describedby="descriptionHelp">
            </div>
          </div>

          <div class="row row-cols-1 transaction-form-rows">
            <div class="col-md-4">
              <label for="date" class="form-label">Data real</label>
              <input type="date" v-model="data.transaction.real_date" class="form-control" id="real_date" placeholder="Digite a data real de compra" aria-describedby="descriptionHelp">
            </div>

            <div class="col-md-4">
              <label for="tipo" class="form-label">Tipo</label>
              <select class="form-select" v-model="data.transaction.transaction_type">
                <option value="">Selecione um tipo</option>
                <option v-for="item in data.transactionTypes" :value="item.id">{{item.description}}</option>
              </select>
            </div>

            <div class="col-md-4">
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
            <div class="col-md-12 table-responsive" style="height: 300px; overflow: auto">
              <table class="table table-striped">
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
        </div>
        <div class="card-footer d-flex" style="justify-content: flex-end">
            <a href="" class="btn btn-secondary" @click.prevent="cancelButtonAction">Cancelar</a>
            <a href="" class="btn btn-primary app-button" @click.prevent="viewModalSaveData"  style="margin-left: 10px">Salvar</a>
        </div>
      </div>
    </div>
</template>

<script>

    import PageTitle from "@/components/page_title/pagetile.vue";
    import Loading from "@/components/loading/loading.vue";
    import {onMounted, reactive, watch} from "vue";
    import CurrencyInput from "@/components/CurrencyInput.vue";
    import {listTransactionType} from "@/services/api/TransactionTypeService";
    import {
      listTransactionCategories,
      listTransactionCategoriesExpense
    } from "@/services/api/TransactionCategoriesService";
    import {useRoute, useRouter} from "vue-router";
    import {validateFormAndSubmit} from "@/services/view/transactions/transactionviewservice";
    import {saveTransaction, updateTransaction} from "@/services/api/transactionService";
    import {getAccountByIdPromisse} from "@/services/api/accountService";

    export  default  {
        name:"transaction-form-view",
      components: {CurrencyInput, Loading, PageTitle},
        setup() {

            let route = useRoute()
            let router = useRouter()

            let data = reactive({
              page:{
                 subtitle:""
              },
              transactionTypes: [],
              transactionCategories: [],
              inputLabels: [
                "Descrição", "Data" , "Tipo", "Categoria", "Valor", "Quantidade"
              ],
              selectStates: {
                categoryDisable: true,
                installmentDisable: true
              },
              loading: {
                show : false
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
                related_installments: [],
                real_date:""
              },
              transactions: [],
              moneyInputConfig: {
                currency:'BRL',
                locale:'pt-BR',
                precision: 2,
                autoDecimalDigits: true
              }
            })

          const viewSimulateInstallmentsAmount = () => {
            if(data.transaction.amount_installments === "") {
              data.simulateInstallment = 0;
              return;
            }
            data.simulateInstallment  =data.transaction.amount/ data.transaction.amount_installments
          }


          const viewModalSaveData = () => {
            validateFormAndSubmit(data, () => {
              if(route.params.operation === "new") {
                saveTransaction(data, route, router)
              }else{
                updateTransaction(data, route)
              }
            })
          }

          const cancelButtonAction = () => {
               router.push({name:"transanctions_module", params:{module:route.params.module, id:route.params.id}})
          }

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
            listTransactionType(data, (transaction_type) => {
              listTransactionCategoriesExpense(data, transaction_type)
            })
            getAccountByIdPromisse(route.params.id).then(result => {
                data.page.subtitle = result.data.description
            })
          })

          return  {
              data,
              viewSimulateInstallmentsAmount,
              viewModalSaveData,
              cancelButtonAction
          }
        }
    }

</script>


<style scoped lang="scss">

</style>