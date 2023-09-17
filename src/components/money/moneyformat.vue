<script>
   import {computed} from "vue";
   import {formatMoneyBRL} from "@/helper/moneyHelper";

   export default {
       name: "money-format",
       props: ["value"],
       setup(props){
          const isPositiveOrNegative = computed( () => {
              return props.value >= 0
          })

         return {
            isPositiveOrNegative,
            formatMoneyBRL
         }
       }
   }
</script>

<template>
      <span :class="{'positive':isPositiveOrNegative, 'negative': !isPositiveOrNegative}">{{formatMoneyBRL($props.value)}}</span>
</template>

<style scoped lang="scss">
    .positive{
        color: green;
        font-weight: bold;
    }

    .negative{
        color: red;
        font-weight: bold;
    }
</style>