import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist';
import Crypto from 'crypto-js';
import Cookie from 'js-cookie';

const cookieName = 'state';

const storageKey = 'state';

const encryptionToken = Cookie.get(cookieName) || "dcefb8d7-17dd-45cd-8123-91e92b7fc52c";

const vuexLocal = new VuexPersistence({
    storage: {
        getItem: () => {
            const store = window.localStorage.getItem(storageKey);
            if (store) {
                try {
                    const bytes = Crypto.AES.decrypt(store, encryptionToken);
                    return JSON.parse(bytes.toString(Crypto.enc.Utf8));
                } catch (e) {
                    window.localStorage.removeItem(storageKey);
                }
            }
            return null;
        },
        setItem: (key, value) => {
            const store = Crypto.AES.encrypt(value, encryptionToken).toString();
            return window.localStorage.setItem(storageKey, store);
        },
        removeItem: () => window.localStorage.removeItem(storageKey),
    }
});

export default createStore({
  state: {
      isAuth: false,
      userData: {},
      showWelcomeTitle: false
  },
  getters: {
     isAuth(state) {
        return state.isAuth
     },
     userData(state) {
          return state.userData
     },
     isWelcomeTitle(state) {
         return state.showWelcomeTitle
     }
  },
  mutations: {
      enableAuth(state) {
          state.isAuth = true
      },
      disabledAuth(state) {
          state.isAuth = false
      },
      setUserData(state, payload) {
          state.userData = payload
      },
      clearState(state) {
        state.isAuth = false
        state.userData = {}
     },
      showWelcomeTitle(state) {
          state.showWelcomeTitle = true
      },
      hiddenWelcomeTitle(state) {
          state.showWelcomeTitle = false
      },
  },
  plugins: [vuexLocal.plugin]
})
