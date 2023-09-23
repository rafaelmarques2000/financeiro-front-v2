<template>
      <div class="container-fluid">
        <page-title :page-subtitle="data.pageTitle.subtitle" :page-title="data.pageTitle.title" :icon="data.pageTitle.icon"></page-title>

        <div class="page-action">
          <button class="btn btn-primary app-button" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
          <button class="btn btn-secondary app-button" type="button"><font-awesome-icon icon="fa-solid fa-filter" /></button>
          <div class="show-per-page">
            <select class="form-select show-pages" v-model="data.pagination.limit">
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



      </div>
</template>

<script>
     import PageTitle from "@/components/page_title/pagetile.vue";
     import {reactive} from "vue";

     export default {
         name: "goals",
         components: {PageTitle},
         setup() {
              const data = reactive({
                    modal:{
                      title:"Nova Transação",
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
              })

           return {
                data
           }
         }
     }
</script>

<style scoped lang="scss">
  @import "goalsstyle";
</style>