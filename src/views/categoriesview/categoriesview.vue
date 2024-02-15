<template>
  <div class="container-fluid">
    <page-title page-subtitle="Gerencie suas categorias" page-title="Categorias" icon="fa-solid fa-list"></page-title>

    <div class="page-action">
      <button class="btn btn-primary app-button" @click="openCategoryModal" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
      <button class="btn btn-secondary app-button" @click="openCloseFilter" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
      <div class="show-per-page">
        <select class="form-select show-pages" @change="searchCategoryAndChangeLimit" v-model="data.pagination.limit">
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
            <button type="button" @click="searchCategoryAndChangeLimit" class="btn btn-primary app-button">
              <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
            </button>
          </div>
        </div>
      </div>
    </div>

    <no-content v-if="!data.categories.length" message="Não há Categorias cadastradas"></no-content>

    <table  v-if="data.categories.length" class="table table-striped page-table table-hover">
      <thead class="page-table-header">
      <tr>
        <td>Descrição</td>
        <td>Tipo</td>
        <td>Criada em</td>
        <td></td>
      </tr>
      </thead>
      <tbody class="page-table-body">
      <tr v-for="item in data.categories">
        <td  data-title="Descrição">{{item.description}}</td>
        <td  data-title="Tipo">{{item.category_type.description}}</td>
        <td  data-title="Criado em">{{formatDateAndHour(item.created_at)}}</td>
        <td>
          <div class="table-actions d-flex">
            <button type="button" @click="openEditModal(item.id, item.description)"  class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
            <button type="button" v-if="item.deletable" ref="tooltip" @click="removeCategory(item.id, item.description)"  class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
            <button type="button" disabled
                    v-else class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
          </div>
        </td>
      </tr>
      </tbody>

    </table>

    <div  v-if="data.categories.length" class="col-12">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item"><a @click.prevent="navigatePages('prev')" class="page-link" href="#">Anterior</a></li>
          <li v-for="page in data.pagination.pages" class="page-item">
            <span class="page-link" v-if="page === '...'">...</span>
            <a v-else @click.prevent="navigatePages(page)" class="page-link" :class="{active: data.pagination.current_page === page}" href="#">{{page}}</a>
          </li>
          <li class="page-item"><a  @click.prevent="navigatePages('next')" class="page-link" href="#">Proximo</a></li>
        </ul>
      </nav>
    </div>

    <modal v-if="data.modals.category.show" @close-modal="closeCategoryModal" :show-action-buttons="true" :show-close-button="true" @save-data="createCategory" :title="data.modals.category.title" :icon="data.modals.category.icon">
      <div class="row">
        <div class="col-md-6">
          <label for="description" class="form-label">Descrição</label>
          <input type="text" v-model="data.category.description" class="form form-control">
        </div>

        <div class="col-md-6">
          <label for="description" class="form-label">Tipo</label>
          <select class="form-select" v-model="data.category.category_type_id">
            <option value="">Selecione um tipo</option>
            <option :value="item.id" v-for="item in data.transactionTypes">{{item.description}}</option>
          </select>
        </div>

      </div>
    </modal>

    <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
  </div>
</template>

<script>

import {onMounted, reactive, ref, watch} from "vue";
import PageTitle from "@/components/page_title/pagetile.vue";
import {formatDateAndHour} from "@/services/utils/date";
import Loading from "@/components/loading/loading.vue";
import Modal from "@/components/modal/modal.vue";
import {alertConfirm, alertError} from "@/helper/alertHelper";
import {generatePagesArray} from "@/services/utils/Pagination";
import NoContent from "@/components/nocontent/NoContent.vue";
import {useRouter} from "vue-router";
import { Tooltip } from "bootstrap";
import {
  deleteCategory,
  getCategoryById,
  listAllCategories,
  saveCategory,
  updateCategory
} from "@/services/api/config/categoriesService";
import {listTransactionType} from "@/services/api/TransactionTypeService";

export default {
  methods: {formatDateAndHour},
  components: {NoContent, Modal, Loading, PageTitle},
  setup() {
    let router = useRouter();
    let data = reactive({
      category: {
        id: "",
        description: "",
        category_type_id: ""
      },
      modals: {
        category: {
          title: "Nova Categoria",
          icon: "",
          show: false,
          operation: "new"
        }
      },
      categories: [],
      transactionTypes:[],
      filter: {
        open: true,
        description: ""
      },
      loading: {
        show: false
      },
      pagination: {
        pages: [],
        limit: 15,
        current_page: 1,
        totalPages: 0,
        totalRows: 0
      },
    })

    const openCloseFilter = () => {
      if (data.filter.open) {
        data.filter.open = false
        return;
      }
      data.filter.open = true
    }

    const openCategoryModal = () => {
      data.modals.category.operation = "new"
      data.modals.category.show = true;
      data.modals.category.title = "Nova Categoria"
    }

    const closeCategoryModal = () => {
      data.modals.category.show = false;
      data.modals.category.title = "Nova lista de desejos"
      data.modals.category.operation = "new"
      data.category.id = ""
      data.category.description = ""
      data.category.category_type_id = ""
    }

    const searchCategoryAndChangeLimit = () => {
      listAllCategories(data)
    }

    const createCategory = () => {

      if(data.category.description === "") {
        alertError("Atenção", "Preencha o campo descrição")
        return
      }

      if(data.category.category_type_id === "") {
        alertError("Atenção", "Escolha o tipo da categoria")
        return
      }

      if (data.modals.category.operation === "new") {
        saveCategory(data)
        return
      }
      updateCategory(data)
    }

    const navigatePages = (direction) => {
      if (direction === 'prev') {
        if (data.pagination.current_page > 1) {
          data.pagination.current_page -= 1
          listAllCategories(data)
          return;
        }
        return;
      }

      if (direction === 'next') {
        if (data.pagination.current_page >= data.pagination.totalPages) {
          return
        }
        data.pagination.current_page += 1
        listAllCategories(data)
        return
      }

      data.pagination.current_page = direction
      listAllCategories(data)
    }

    const removeCategory = (id, description) => {
      alertConfirm("Confirmação", `Deseja deletar a categoria ${description}?`, () => {
        data.category.id = id
        deleteCategory(data)
      })
    }

    const openEditModal = (id, description) => {
      data.modals.category.operation = "edit"
      data.modals.category.title = `Editar ${description}`
      data.category.id = id
      getCategoryById(data)
      data.modals.category.show = true
    }

    //WATCHERS
    watch(() => data.categories, (categories) => {
      if (data.pagination.current_page > 1 && categories.length === 0) {
        data.pagination.current_page -= 1
        listAllCategories(data)
      }
      data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
    })

    onMounted(() => {
      listAllCategories(data)
      listTransactionType(data)
    })

    return {
      data,
      openCloseFilter,
      openCategoryModal,
      closeCategoryModal,
      searchCategoryAndChangeLimit,
      createCategory,
      navigatePages,
      removeCategory,
      openEditModal
    }
  }
}
</script>

<style scoped lang="scss">
@import "categoriesstyle";
</style>