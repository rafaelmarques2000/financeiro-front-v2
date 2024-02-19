<template>
  <router-view/>
</template>

<script>
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import {onMounted} from "vue";
import {saveToken} from "@/services/api/firebaseService";
   export default {
       setup() {

         let saveFCMToken = () => {
           const firebaseConfig = {
             apiKey: "AIzaSyCiAWY3wcWo8ah-4fxNxeEUSOkctaZ1Fyg",
             authDomain: "graninha-push-alert.firebaseapp.com",
             projectId: "graninha-push-alert",
             storageBucket: "graninha-push-alert.appspot.com",
             messagingSenderId: "358604125063",
             appId: "1:358604125063:web:200dc04cf7eebd77ff5922"
           };

           const firebaseApp = initializeApp(firebaseConfig);
           const messaging = getMessaging(firebaseApp);

           getToken(messaging)
               .then((currentToken) => {
                 if (currentToken) {
                    saveToken(currentToken)
                 } else {
                   console.log('Não foi possível obter o token do dispositivo.');
                 }
               })
               .catch((error) => {
                 console.error('Erro ao obter o token do dispositivo:', error);
               });
         }

         onMounted(() => {
             saveFCMToken()
         })


       }
   }
</script>
