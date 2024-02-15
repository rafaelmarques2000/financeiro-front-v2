import axios from "axios";
import store from "../../store/index"

let axiosOption = {
    baseURL:"https://api.globalapps.xyz/api/v1",
}
//
// let axiosOption = {
//     baseURL:"http://localhost:8005/api/v1",
// }

let client = axios.create(axiosOption)

client.interceptors.request.use((config) => {
     if(store.getters.isAuth){
         config.headers.Authorization = ("Bearer ") + (store.getters.userData.token !== undefined ? store.getters.userData.token : "")
         return config
     }
     return config
})

client.interceptors.response.use((response) => {
    return response
}, (error) => {
     return Promise.reject(error)
})

export default client