<template>

    <div class="container-fluid d-flex align-items-center">
         <h3>{{$props.message}}</h3>
    </div>


</template>

<script>
    export default {
        name: "no-content",
        props: ["message"],
        setup(){

        }
    }
</script>



<style scoped lang="scss">

</style>