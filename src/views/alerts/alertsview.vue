<template>
   <div class="container-fluid">
      <page-title page-subtitle="Gerencie seus alertas" page-title="Alertas" icon="fa-solid fa-bell"></page-title>

     <div class="page-action">
       <button class="btn btn-primary app-button" @click="" type="button" ><font-awesome-icon icon="fa-solid fa-circle-plus" /></button>
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


   </div>
</template>

<script>
    import {reactive} from "vue";
    import PageTitle from "@/components/page_title/pagetile.vue";
    export default {
      components: {PageTitle},
        setup() {
            let data = reactive({
                filter: {
                  description : "",
                  open: true
                },
                pagination: {
                  pages: [],
                  limit: 15,
                  current_page: 1,
                  totalPages: 0,
                  totalRows: 0
                },
            });

          const openCloseFilter = () => {
            if (data.filter.open) {
              data.filter.open = false
              return;
            }
            data.filter.open = true
          }

            return {
               data,
               openCloseFilter
            }
        }
    }
</script>

<style scoped lang="scss">
  @import "alertstyle";
</style>