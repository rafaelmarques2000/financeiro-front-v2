<template>
    <div class="container-fluid">
      <page-title icon="fa-solid fa-list" page-title="Listas" page-subtitle="Gerencie suas listas"></page-title>
      <loading message="Processando aguarde..." v-if="data.loading.show"></loading>
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
              <button type="button" @click="viewSearchFilter" class="btn btn-primary app-button">
                <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
              </button>
            </div>

          </div>
        </div>
      </div>

      <table class="table table-striped page-table table-hover" v-if="data.lists.length > 0">
        <thead class="page-table-header">
        <tr>
          <td>Nome da lista</td>
          <td>Tempo real</td>
          <td></td>
        </tr>
        </thead>
        <tbody class="page-table-body">
        <tr v-for="item in data.lists">
          <td @click="viewOpenList(item.id)" data-title="Descrição">{{item.description}}</td>
          <td @click="viewOpenList(item.id)" data-title="Tempo real">{{formatRealTimeField(item.is_realtime)}}</td>
          <td>
            <div class="table-actions d-flex">
              <button type="button" @click="viewOpenModalEditForm(item.id, item.description)"   class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
              <button type="button" @click="viewDeletePrompt(item.id, item.description)" class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="row" v-if="data.lists.length > 0">
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

      <no-content message="Não há listas cadastradas." v-if="data.lists <=0 "></no-content>

      <modal v-if="data.modal.show" :show-close-button="true" :show-action-buttons="true" @close-modal="viewCloseModal" @save-data="viewModalSaveData" :title="data.modal.title" :icon="data.modal.icon">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <label class="form-label">Descrição</label>
              <input type="text" v-model="data.newList.description" class="form-control" placeholder="Digite uma descrição">
            </div>
            <div class="col-md-12">
              <label class="form-label">Tempo real?</label>
              <select class="form-select" v-model="data.newList.real_time">
                  <option value="false">Não</option>
                  <option value="true">Sim</option>
              </select>
            </div>
          </div>

        </div>
      </modal>

    </div>
</template>

<script>
    import PageTitle from "@/components/page_title/pagetile.vue";
    import Loading from "@/components/loading/loading.vue";
    import {onMounted, reactive, watch} from "vue";
    import {openCloseFilter, navigatePages, searchFilter, validateFormAndSubmit} from "@/services/view/lists/listsviewservice";
    import MoneyFormat from "@/components/money/moneyformat.vue";
    import {deleteList, findAll, findById, saveList, updateList} from "@/services/api/listsService";
    import {generatePagesArray} from "@/services/utils/Pagination";
    import Modal from "@/components/modal/modal.vue";
    import {alertConfirm} from "@/helper/alertHelper";
    import {deleteGoal} from "@/services/api/goalService";
    import NoContent from "@/components/nocontent/NoContent.vue";
    import {useRouter} from "vue-router";

    export default {
       components: {NoContent, Modal, MoneyFormat, Loading, PageTitle},
       setup(){

          let router = useRouter()

            let data = reactive({
              modal:{
                title:"Nova lista",
                icon: "",
                show: false,
                operation: "new"
              },
              lists:[],
              newList: {
                id:"",
                description: "",
                real_time: false
              },
              filter: {
                open: true,
                description: ""
              },
              pagination: {
                pages: [],
                limit: 15,
                current_page:1,
                totalPages: 0,
                totalRows: 0
              },
              loading: {
                show : false
              },
            })

         const viewOpenCloseFilter = () => {
              openCloseFilter(data)
         }

         const viewListNavigation= (direction) => {
           navigatePages(data, direction)
         }

         const viewChangePageByPageNumber = (page) => {
           data.pagination.current_page = page
           findAll(data)
         }

         const viewChangeLimitPerPage = () => {
           findAll(data)
         }

         const viewSearchFilter = () => {
           searchFilter(data)
         }

         const viewOpenModalForm = () => {
           data.modal.show = true
           data.modal.operation = "new"
           data.modal.icon = "fa-solid fa-circle-plus"
         }

         const viewCloseModal = () => {
           data.modal.show = false
           data.newList.id = ""
           data.newList.description = ""
           data.newList.real_time = false
         }

         const viewModalSaveData = () => {
           validateFormAndSubmit(data, () => {
                 if(data.modal.operation === "new") {
                   saveList(data)
                 }else{
                   updateList(data)
                 }
           })
         }

         const viewOpenModalEditForm = (id, description) => {
           data.modal.show = true
           data.modal.operation = "edit"
           data.modal.title = `Editar - ${description}`
           data.modal.icon = "fa-solid fa-pen-to-square"
           data.newList.id = id
           findById(data)
         }

         const formatRealTimeField = (isRealtime) => {
              return isRealtime ? "Sim":"Não"
         }

         const viewDeletePrompt = (id, description) => {
           alertConfirm("Atenção", `Deseja deletar ${description}`, () => {
             data.newList.id = id
             deleteList(data)
           })
         }

         const viewOpenList = (id) => {
              router.push({name: "list-items", params:{id}})
         }

         //COMPUTED OU WATCHERS

         watch(() => data.lists , (lists) => {
           if(data.pagination.current_page > 1 && lists.length === 0) {
             data.pagination.current_page -= 1
             findAll(data)
           }
           data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
         })

         onMounted(() => {
             findAll(data)
         })

         return {
              data,
              viewOpenCloseFilter,
              viewListNavigation,
              viewChangePageByPageNumber,
              viewChangeLimitPerPage,
              viewSearchFilter,
              viewOpenModalForm,
              viewCloseModal,
              viewModalSaveData,
              viewOpenModalEditForm,
              formatRealTimeField,
              viewDeletePrompt,
              viewOpenList
         }
       }
    }
</script>

<style scoped lang="scss">
  @import "listsstyleview";
</style>