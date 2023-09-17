import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from "@/views/login/loginview.vue";
import Home from "@/views/home/homeview.vue"
import Modules from "@/views/module_select/moduleselectview.vue";
import Contas from "@/views/contas/contasview.vue";
import store from "@/store";
import {checkValidToken} from "@/services/api/authService";

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

        // if(to.meta.enableBreadcrumb) {
        //     let routeMeta = to.meta
        //     routeMeta.breadcrumb.map((item) => {
        //
        //         if(item.first && item.isLink) {
        //             item.name = store.getters.getLastRoute[0].toUpperCase() + store.getters.getLastRoute.slice(1)
        //             item.path = `/app/${store.getters.getLastRoute}`
        //             return item
        //         }
        //
        //         if (item.name === "Transações" && item.isLink) {
        //             item.path = from.path
        //             return item
        //         }
        //         return item
        //     })
        //     store.commit("setRouteMetaData", routeMeta)
        // }else{
        //     store.commit("setRouteMetaData", [])
        // }
    }
});

export default router
