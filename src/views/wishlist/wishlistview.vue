<template>
    <div class="container-fluid">
      <page-title page-subtitle="Gerencie suas lista de desejos" page-title="Lista de desejos" icon="fa-solid fa-heart"></page-title>

      <div class="page-action">
        <button class="btn btn-primary app-button" @click="openWishListModal" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
        <button class="btn btn-secondary app-button" @click="openCloseFilter" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
        <div class="show-per-page">
          <select class="form-select show-pages" @change="searchWishListAndChangeLimit" v-model="data.pagination.limit">
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
              <button type="button" @click="searchWishListAndChangeLimit" class="btn btn-primary app-button">
                <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <no-content v-if="!data.wishlists.length" message="Não há lista de desejos cadastradas"></no-content>

      <table  v-if="data.wishlists.length" class="table table-striped page-table table-hover">
        <thead class="page-table-header">
        <tr>
          <td>Descrição</td>
          <td>Status</td>
          <td>Criada em</td>
          <td></td>
        </tr>
        </thead>
        <tbody class="page-table-body">
           <tr v-for="item in data.wishlists">
              <td @click.self="viewItemList(item.id)" data-title="Descrição">{{item.description}}</td>
              <td @click.self="viewItemList(item.id)" data-title="Status">{{item.status}}</td>
              <td @click.self="viewItemList(item.id)" data-title="Criado em">{{formatDateAndHour(item.created_at)}}</td>
              <td>
                <div class="table-actions d-flex">
                  <button type="button" @click="openEditModal(item.id, item.description)"  class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                  <button type="button" @click="removeWishList(item.id, item.description)"  class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                </div>
              </td>
           </tr>
        </tbody>

      </table>

      <div  v-if="data.wishlists.length" class="col-12">
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

      <modal v-if="data.modals.wishlist.show" @close-modal="closeWishListModal" :show-action-buttons="true" :show-close-button="true" @save-data="createWishList" :title="data.modals.wishlist.title" :icon="data.modals.wishlist.icon">
           <div class="row">
               <div class="col-md-6">
                    <label for="description" class="form-label">Descrição</label>
                    <input type="text" v-model="data.wishlist.description" class="form form-control">
               </div>
             <div class="col-md-6">
               <label for="description" class="form-label">Status</label>
               <select v-model="data.wishlist.status" class="form-select">
                   <option value="">Selecione um status</option>
                   <option value="EM PROGRESSO">Em progresso</option>
                   <option value="COMPLETO">Completo</option>
               </select>
             </div>
           </div>
      </modal>

      <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
    </div>
</template>

<script>

import {onMounted, reactive, watch} from "vue";
import PageTitle from "@/components/page_title/pagetile.vue";
import {
  deleteWishList,
  getWishListById,
  listAllWishlist,
  saveWishList,
  updateWishList
} from "@/services/api/wishlistService";
import {formatDateAndHour} from "../../services/utils/date";
import Loading from "@/components/loading/loading.vue";
import Modal from "@/components/modal/modal.vue";
import {alertConfirm, alertError} from "@/helper/alertHelper";
import {generatePagesArray} from "@/services/utils/Pagination";
import NoContent from "@/components/nocontent/NoContent.vue";
import {useRouter} from "vue-router";

export default {
  methods: {formatDateAndHour},
  components: {NoContent, Modal, Loading, PageTitle},
  setup() {
    let router = useRouter();
    let data = reactive({
          wishlist: {
             id: "",
             description: "",
             status:""
          },
          modals:{
             wishlist: {
                 title:"Nova lista de desejos",
                 icon: "",
                 show: false,
                 operation: "new"
             }
          },
          wishlists: [],
          filter: {
            open: true,
            description: ""
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
    })

    const openCloseFilter = () => {
      if(data.filter.open) {
        data.filter.open = false
        return;
      }
      data.filter.open = true
    }

    const openWishListModal = () => {
        data.modals.wishlist.operation = "new"
        data.modals.wishlist.show = true;
        data.modals.wishlist.title = "Nova lista de desejos"
    }

    const closeWishListModal = () => {
      data.modals.wishlist.show = false;
      data.modals.wishlist.title = "Nova lista de desejos"
      data.modals.wishlist.operation = "new"
      data.wishlist.id = ""
      data.wishlist.description = ""
      data.wishlist.status = ""
    }

    const searchWishListAndChangeLimit = () => {
         listAllWishlist(data)
    }

    const createWishList = () => {
        if(data.wishlist.description === "") {
           alertError("Atenção", "Preencha o campo descrição")
           return;
        }
        if(data.wishlist.status === "") {
          alertError("Atenção", "Selecione um status para sua lista")
          return
        }

        if(data.modals.wishlist.operation === "new") {
          saveWishList(data)
          return
        }
        updateWishList(data)
    }

    const navigatePages = (direction) => {
      if(direction === 'prev') {
        if(data.pagination.current_page > 1) {
          data.pagination.current_page -=1
          listAllWishlist(data)
          return;
        }
        return;
      }

      if(direction === 'next') {
        if(data.pagination.current_page >= data.pagination.totalPages) {
          return
        }
        data.pagination.current_page +=1
        listAllWishlist(data)
        return
      }

      data.pagination.current_page = direction
      listAllWishlist(data)
    }

    const removeWishList = (id,description) => {
      alertConfirm("Confirmação", `Deseja deletar a lista ${description}?`, () =>{
        data.wishlist.id = id
        deleteWishList(data)
      })
    }

    const openEditModal  = (id, description) => {
        data.modals.wishlist.operation = "edit"
        data.modals.wishlist.title = `Editar ${description}`
        data.wishlist.id = id
        getWishListById(data)
        data.modals.wishlist.show = true
    }

    const viewItemList = (id) => {
        router.push({name: "wishlist-items", params: {id}})
    }

    //WATCHERS
    watch(() => data.wishlists , (wishlists) => {
      if(data.pagination.current_page > 1 && wishlists.length === 0) {
        data.pagination.current_page -= 1
        listAllWishlist(data)
      }
      data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
    })

    onMounted(() => {
        listAllWishlist(data)
    })

    return {
        data,
        openCloseFilter,
        openWishListModal,
        closeWishListModal,
        searchWishListAndChangeLimit,
        createWishList,
        navigatePages,
        removeWishList,
        openEditModal,
        viewItemList
    }
  }
}
</script>

<style scoped lang="scss">
   @import "wishliststyle";
</style>