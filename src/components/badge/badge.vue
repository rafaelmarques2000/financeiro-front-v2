<script>
   export default {
       name: "badge",
       props: ["color", "text"]
   }
</script>

<template>
  <span class="badge rounded-pill text-bg-primary" :style="`background:${$props.color}!important`">{{$props.text}}</span>
</template>