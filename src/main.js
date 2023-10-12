import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "./assets/general.scss"

/* import the fontawesome core */
import {library} from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

/* import specific icons */
import {
    faChartColumn,
    faFilter,
    faHome,
    faPenToSquare,
    faPlusCircle,
    faReceipt,
    faRightFromBracket,
    faSackDollar,
    faSearch,
    faTrash,
    faArrowLeft,
    faArrowRight,
    faCreditCard,
    faChartLine, faPiggyBank, faMoneyBill, faArrowUpRightFromSquare, faCircleCheck, faBars, faEdit, faClock, faList
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
    faHome,
    faReceipt,
    faSackDollar,
    faRightFromBracket,
    faChartColumn,
    faPlusCircle,
    faFilter,
    faPenToSquare,
    faTrash,
    faSearch,
    faArrowLeft,
    faArrowRight,
    faCreditCard,
    faChartLine,
    faPiggyBank,
    faMoneyBill,
    faArrowUpRightFromSquare,
    faCircleCheck,
    faBars,
    faPenToSquare,
    faClock,
    faList
)
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
createApp(App)
    .use(store)
    .use(router)
    .use(VCalendar)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
