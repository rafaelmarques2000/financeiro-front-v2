<template>
  <div class="container-fluid">
    <page-title page-subtitle="Gerencie seus items" :page-title="'Lista de desejos - ' + data.wishlist.description" icon="fa-solid fa-heart"></page-title>
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

    <no-content v-if="!data.wishlistsItems.length" message="Não há items cadastrados"></no-content>

    <table  v-if="data.wishlistsItems.length" class="table table-striped page-table table-hover">
      <thead class="page-table-header">
      <tr>
        <td>Descrição</td>
        <td>Valor</td>
        <td>Link</td>
        <td>Comprado</td>
        <td>Criada em</td>
        <td></td>
      </tr>
      </thead>
      <tbody class="page-table-body">
      <tr  v-for="item in data.wishlistsItems">
        <td :class="{'checked-row': item.checked}"  data-title="Descrição">{{item.description}}</td>
        <td :class="{'checked-row': item.checked}"  data-title="Valor"><money-format :value="item.amount"></money-format></td>
        <td :class="{'checked-row': item.checked}" data-title="Link"><a :href="item.link" target="_blank">Site do produto</a></td>
        <td :class="{'checked-row': item.checked}"  data-title="Comprado"><input type="checkbox" @change="viewCheckedItem(item,$event)" :checked="item.checked"/></td>
        <td :class="{'checked-row': item.checked}"  data-title="Criado em">{{formatDateAndHour(item.created_at)}}</td>
        <td :class="{'checked-row': item.checked}">
          <div class="table-actions d-flex">
            <button type="button" @click="openEditModal(item.id, item.description)"  class="btn btn-primary app-button"><font-awesome-icon icon="fa-solid fa-pen-to-square" /></button>
            <button type="button" @click="removeWishList(item.id, item.description)"  class="btn btn-outline-danger"><font-awesome-icon icon="fa-solid fa-trash" /></button>
          </div>
        </td>
      </tr>
      </tbody>

    </table>

    <div  v-if="data.wishlistsItems.length" class="col-12">
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

    <modal v-if="data.modals.wishlistItem.show" @close-modal="closeWishListModal" :show-action-buttons="true" :show-close-button="true" @save-data="createWishList"
           :title="data.modals.wishlistItem.title" :icon="data.modals.wishlistItem.icon">
      <div class="row">
        <div class="col-md-6">
          <label for="description" class="form-label">Descrição</label>
          <input type="text" v-model="data.wishlistItem.description" class="form form-control">
        </div>
        <div class="col-md-6">
          <label for="description" class="form-label">Valor</label>
          <currency-input class="form-control" v-model="data.wishlistItem.amount" :options="data.moneyInputConfig"></currency-input>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <label for="description" class="form-label">Link</label>
          <input type="text" v-model="data.wishlistItem.link" class="form form-control">
        </div>
      </div>
    </modal>

    <loading v-if="data.loading.show" message="Processando aguarde..."></loading>
  </div>
</template>

<script>
import {onMounted, reactive, watch} from "vue";
import PageTitle from "@/components/page_title/pagetile.vue";
import {useRoute} from "vue-router";
import Modal from "@/components/modal/modal.vue";
import Loading from "@/components/loading/loading.vue";
import NoContent from "@/components/nocontent/NoContent.vue";
import {alertConfirm, alertError} from "@/helper/alertHelper";
import {generatePagesArray} from "@/services/utils/Pagination";
import {
  deleteWishListItem,
  getWishListItemById,
  listAllWishlistItems,
  saveWishListItem, updateWishListItem
} from "@/services/api/wishlistItemService";
import CurrencyInput from "@/components/CurrencyInput.vue";
import {formatDateAndHour} from "../../services/utils/date";
import {getWishListById} from "@/services/api/wishlistService";
import MoneyFormat from "@/components/money/moneyformat.vue";
import {checkAndUncheckTransaction} from "@/services/api/transactionService";

  export default {
    methods: {formatDateAndHour},
    components: {MoneyFormat, CurrencyInput, NoContent, Loading, Modal, PageTitle},
     setup() {
        const route = useRoute()

       let data = reactive({
            wishlist: {
                id: route.params.id,
                description: ""
            },
            wishlistItem: {
              id: "",
              description:"",
              amount: "",
              checked: false,
              link: ""
            },
         modals:{
           wishlistItem: {
             title:"Novo Item",
             icon: "",
             show: false,
             operation: "new"
           }
         },
         wishlistsItems: [],
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
         moneyInputConfig: {
           currency:'BRL',
           locale:'pt-BR',
           precision: 2,
           autoDecimalDigits: true
         },
         statistics: {
              wishlistItemTotal: 0
         }
       })

       const openCloseFilter = () => {
         if(data.filter.open) {
           data.filter.open = false
           return;
         }
         data.filter.open = true
       }

       const openWishListModal = () => {
         data.modals.wishlistItem.operation = "new"
         data.modals.wishlistItem.show = true;
         data.modals.wishlistItem.title = "Novo Item"
       }

       const closeWishListModal = () => {
         data.modals.wishlistItem.show = false;
         data.modals.wishlistItem.title = "Nova lista de desejos"
         data.modals.wishlistItem.operation = "new"
         data.wishlistItem.id = ""
         data.wishlistItem.description = ""
         data.wishlistItem.amount = 0
         data.wishlistItem.checked = false
         data.wishlistItem.link = ""
       }

       const searchWishListAndChangeLimit = () => {
         listAllWishlistItems(data)
       }

       const createWishList = () => {

         const urlPattern = /^(https?|ftp|http):\/\/([a-zA-Z0-9.-]+)(\.[a-zA-Z]{2,})(:\d+)?(\/\S*)?$/;

         if(data.wishlistItem.description === "") {
           alertError("Atenção", "Preencha o campo descrição")
           return;
         }

         if(data.wishlistItem.amount === 0 || data.wishlistItem.amount === "" || data.wishlistItem.amount === null) {
           alertError("Atenção", "Preencha o campo Valor")
           return;
         }

         if(!urlPattern.test(data.wishlistItem.link)) {
           alertError("Atenção", "Preencha o campo link com uma url valida")
           return
         }

         if(data.modals.wishlistItem.operation === "new") {
           saveWishListItem(data)
           return
         }
         updateWishListItem(data, true)
       }

       const navigatePages = (direction) => {
         if(direction === 'prev') {
           if(data.pagination.current_page > 1) {
             data.pagination.current_page -=1
             listAllWishlistItems(data)
             return;
           }
           return;
         }

         if(direction === 'next') {
           if(data.pagination.current_page >= data.pagination.totalPages) {
             return
           }
           data.pagination.current_page +=1
           listAllWishlistItems(data)
           return
         }

         data.pagination.current_page = direction
         listAllWishlistItems(data)
       }

       const removeWishList = (id,description) => {
         alertConfirm("Confirmação", `Deseja deletar o item ${description}?`, () =>{
           data.wishlistItem.id = id
           deleteWishListItem(data)
         })
       }

       const openEditModal  = (id, description) => {
         data.modals.wishlistItem.operation = "edit"
         data.modals.wishlistItem.title = `Editar ${description}`
         data.wishlistItem.id = id
         getWishListItemById(data)
         data.modals.wishlistItem.show = true
       }

       let viewCheckedItem = (item, event) => {
         data.wishlistsItems = data.wishlistsItems.map((wishlistItem) => {
           if(wishlistItem.id === item.id) {
             wishlistItem.checked = event.target.checked
             data.wishlistItem = wishlistItem
             return wishlistItem
           }
           return wishlistItem
         })
         updateWishListItem(data, false)
       }

       //WATCHERS
       watch(() => data.wishlistsItems , (wishlistsItems) => {
         if(data.pagination.current_page > 1 && wishlistsItems.length === 0) {
           data.pagination.current_page -= 1
           listAllWishlistItems(data)
         }
         data.pagination.pages = generatePagesArray(data.pagination.current_page, data.pagination.totalRows, data.pagination.limit, 8)
       })

       onMounted(()=> {
         listAllWishlistItems(data)
         getWishListById(data)
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
         viewCheckedItem
        }
     }
  }


</script>


<style scoped lang="scss">
    @import "wishlistitemsstyle";

    .checked-row {
      background: #f6c4dc !important;
    }
</style>