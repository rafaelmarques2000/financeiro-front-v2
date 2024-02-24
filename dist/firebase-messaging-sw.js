importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCiAWY3wcWo8ah-4fxNxeEUSOkctaZ1Fyg",
    authDomain: "graninha-push-alert.firebaseapp.com",
    projectId: "graninha-push-alert",
    storageBucket: "graninha-push-alert.appspot.com",
    messagingSenderId: "358604125063",
    appId: "1:358604125063:web:200dc04cf7eebd77ff5922"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("recebi mensagens")
});