<template>
     <div :class="'alert alert-'+$props.alertType">{{$props.message}}</div>
</template>

  <script>
      export default {
          name: "alert",
          props:{
              alertType:{
                  type:String,
                  required: true
              },
              message:{
                 type:String,
                 required: true
              }
          },
      }
  </script>

<style scoped lang="scss">
    @import "alertstyle";
</style>