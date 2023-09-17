<template>
   <div class="app-modal-backdrop ">
      <div class="app-modal-content container-fluid">
           <div class="app-modal-header">
               <h3><font-awesome-icon :icon="$props.icon"></font-awesome-icon> {{$props.title}}</h3>
           </div>

          <div class="app-modal-body">
              <slot></slot>
          </div>

          <div class="app-modal-footer d-flex justify-content-end">
             <button type="button" @click="viewCancel" class="btn btn-secondary">Cancelar</button>
             <button type="button" @click="viewSave" class="btn btn-primary app-button">Salvar</button>
          </div>
      </div>
   </div>
</template>

<script>
   import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

   export default {
       name:"modal",
       components: {FontAwesomeIcon},
       props:["title", "icon"],
       setup(props, ctx){


          const viewCancel = () => {
              ctx.emit("close-modal")
          }

          const viewSave = () => {
             ctx.emit("save-data")
          }

          return {
            viewCancel,
            viewSave
          }

       }
   }
</script>


<style scoped lang="scss">
  @import "modalstyle";
</style>