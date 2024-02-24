<template>
  <router-view/>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import {onMounted} from "vue";
import {saveToken} from "@/services/api/firebaseService";
   export default {
   }
</script>
