<template>
    <div class="container-fluid">
       <h1 style="margin-left: 14px; margin-bottom: 25px">{{data.list.description}}</h1>

       <div class="container-fluid d-flex">
           <input type="text" v-model="data.listItem.description" class="form-control" @keyup.enter="viewCreateListItem" placeholder="Crie um item" style="margin-right: 15px">
           <button type="button" @click="viewCreateListItem" class="btn app-button list-item-btn"><font-awesome-icon icon="fa-solid fa-circle-plus"></font-awesome-icon> </button>
       </div>

       <div class="container-fluid">
            <ul class="list-items d-flex">
                <li class="d-flex list-item" :key="item.id" v-for="item in data.listItems">
                    <input type="checkbox" @change="viewCheckUncheckItem(item.item_id, item.checked)" v-model="item.checked" class="list-item-checkbox form-check-input">
                    <span class="list-default" :class="{'list-checked-label':item.checked}">{{item.description}}</span>
                    <div class="list-actions">
                      <button type="button" @click="viewDeleteItem(item.item_id)" class="btn-list"><font-awesome-icon icon="fa-solid fa-trash"></font-awesome-icon></button>
                    </div>
                </li>
            </ul>
       </div>

    </div>
</template>

<script>
  import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
  import {onMounted, reactive} from "vue";
  import {findBy} from "@/services/api/listsService";
  import {useRoute} from "vue-router";
  import {checkUncheckItem, createListItem, deleteItem, getItems} from "@/services/api/listItemsService"
  import {alertError} from "@/helper/alertHelper";
  import NoContent from "@/components/nocontent/NoContent.vue";
  import draggable from 'vuedraggable'
   export default {
     name: "list-items",
     components: {NoContent, FontAwesomeIcon},
       setup(){
           const route = useRoute()
           let data = reactive({

               list: {
                   id:"",
                   description:"",
                   is_realtime: false
               },
               listItems:[],
               listItem: {
                 listId: "",
                 description: "",
                 order_number: 1
               }
           })


         const viewCreateListItem = () => {

           if(data.listItem.description === "") {
               alertError("Atenção", "Informe um nome para o item")
               return
           }

           data.listItem.listId = route.params.id
           data.listItem.order_number = data.listItems.length + 1
           createListItem(data)
         }

         const viewCheckUncheckItem = (itemId, ItemChecked) => {
             checkUncheckItem(data, itemId, ItemChecked)
         }

         const viewDeleteItem = (itemId) => {
             deleteItem(data, itemId)
         }

          const getListData = () => {
            let id = route.params.id
            findBy(id, (result) => {
              data.list.id = result.id
              data.list.description = result.description
              data.list.is_realtime = result.is_realtime
              getItems(data)
            })
          }

          onMounted(() => {
              getListData()
          })

          return {
             data,
             viewCreateListItem,
             viewCheckUncheckItem,
             viewDeleteItem
          }
       }
   }



</script>

<style scoped lang="scss">
    @import "listitemsstyle";
</style>