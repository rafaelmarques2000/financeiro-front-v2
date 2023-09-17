<template>
    <h3 class="page-title">
      <font-awesome-icon :icon="$props.icon"></font-awesome-icon> {{$props.pageTitle}}<br>
      <small class="text-muted page-subtitle">{{$props.pageSubtitle}}</small>
    </h3>
</template>

<script>
   import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

   export default {
       name:"page-title",
     components: {FontAwesomeIcon},
       props: {
          pageTitle:{
              type:String,
              required: true
          },
          pageSubtitle:{
             type:String,
             required: true
          },
          icon:{
           type:String,
           required: false
          }
       }
   }
</script>

<style scoped lang="scss">
@import "pagetitlestyle";
</style>