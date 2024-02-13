import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from "@/views/login/loginview.vue";
import Home from "@/views/home/homeview.vue"
import Modules from "@/views/module_select/moduleselectview.vue";
import Contas from "@/views/contas/contasview.vue";
import Transactions from "@/views/transactions/transactionview.vue";
import Goals from "@/views/goals/goalsview.vue";
import Dashboard from "@/views/dashboard/dashboardview.vue"
import TransactionHistory from "@/views/transaction_history/transactionhistoryview.vue"
import store from "@/store";
import {checkValidToken} from "@/services/api/authService";
import Wishlistview from "@/views/wishlist/wishlistview.vue";
import WishlistItemsview from "@/views/wishlist/wishlistItemsview.vue";
import Categoriesview from "@/views/categoriesview/categoriesview.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
     path: "/app",
     name: "app",
     redirect: "/app/modules",
     component: Home,
     children: [
       {
         path: '/app/modules',
         name: 'modules',
         component: Modules
       },
       {
         path: '/app/modules/:module',
         name: 'conta_module',
         component: Contas
       },
       {
         path: '/app/modules/:module/:id/transactions',
         name: 'transanctions_module',
         component: Transactions
       },
       {
         path: '/app/modules/cofrinhos',
         name: 'goals_module',
         component: Goals
       },

         {
             path: '/app/modules/dashboard',
             name: 'dashboard_module',
             component: Dashboard
         },
         {
             path: '/app/modules/transaction-history',
             name: 'transaction_history',
             component: TransactionHistory
         },
         {
             path: '/app/modules/wishlist',
             name: 'wishlist',
             component: Wishlistview
         },
         {
             path: '/app/modules/wishlist/:id/items',
             name: 'wishlist-items',
             component: WishlistItemsview
         },
         {
             path: '/app/modules/config/categories',
             name: 'config-categories',
             component: Categoriesview
         }
     ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from) => {
    if(to.name !== 'login') {
        let user = store.getters.userData;

        if(!store.getters.isAuth) {
            return router.push({name: "login"})
        }

        if(user.token === "" || !user.hasOwnProperty("token")) {
            return router.push({name: "login"})
        }

        checkValidToken(user.token).catch(error => {
            store.commit("clearState")
            return router.push({name: "login"})
        })
    }
});

export default router
