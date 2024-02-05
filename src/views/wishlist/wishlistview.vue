<template>
    <div class="container-fluid">
      <page-title page-subtitle="Gerencie suas lista de desejos" page-title="Lista de desejos" icon="fa-solid fa-heart"></page-title>

      <div class="page-action">
        <button class="btn btn-primary app-button" @click="openWishListModal" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
        <button class="btn btn-secondary app-button" @click="openCloseFilter" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
        <div class="show-per-page">
          <select class="form-select show-pages" @change="" v-model="data.pagination.limit">
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
              <button type="button" @click="" class="btn btn-primary app-button">
                <font-awesome-icon icon="fa-solid fa-search"></font-awesome-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <table class="table table-striped page-table table-hover">
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
              <td data-title="Descrição">{{item.description}}</td>
              <td data-title="Status">{{item.status}}</td>
              <td data-title="Criado em">{{formatDateAndHour(item.created_at)}}</td>
              <td>
                <div class="table-actions d-flex">
                  <button type="button" @click=""  class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
                  <button type="button" @click=""  class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
                </div>
              </td>
           </tr>
        </tbody>

      </table>

      <modal v-if="data.modals.wishlist.show" @close-modal="closeWishListModal" :show-action-buttons="true" :show-close-button="true" @save-data="" :title="data.modals.wishlist.title" :icon="data.modals.wishlist.icon">
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

import {onMounted, reactive} from "vue";
import PageTitle from "@/components/page_title/pagetile.vue";
import {listAllWishlist} from "@/services/api/wishlistService";
import {formatDateAndHour} from "../../services/utils/date";
import Loading from "@/components/loading/loading.vue";
import Modal from "@/components/modal/modal.vue";

export default {
  methods: {formatDateAndHour},
  components: {Modal, Loading, PageTitle},
  setup() {
    let data = reactive({
          wishlist: {
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
    }

    const closeWishListModal = () => {
      data.modals.wishlist.show = false;
    }

    onMounted(() => {
        listAllWishlist(data)
    })

    return {
        data,
        openCloseFilter,
        openWishListModal,
        closeWishListModal
    }
  }
}
</script>

<style scoped lang="scss">
   @import "wishliststyle";
</style>