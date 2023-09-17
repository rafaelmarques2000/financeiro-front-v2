<template>
    <div class="loading-overlay align-items-center justify-content-center">
          <img src="../../assets/images/loading.gif" alt="loading" class="loading-icon">
          <span class="loading-message">{{$props.message}}</span>
    </div>
</template>

<script>
   export default {
       name: "loading",
       props:{
         message:{
           type: String,
           required: false
         }
       }
   }
</script>

<style scoped lang="scss">
     @import "loadingstyle";
</style>