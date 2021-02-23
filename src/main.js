import Vue from 'vue'
import App from './App.vue'
import Highcharts from 'highcharts'
import VueHighcharts from 'vue-highcharts'
import router from './router/index'
import axios from 'axios'
import store from './store/index'
import vuetify from './plugins/vuetify'
import moment from 'moment'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

// import mixins
import appMixins from '@/mixins/globalMixins'

// init global mixins
Vue.mixin(appMixins)

// create event bus
export const EventBus = new Vue()

// import shared components
import Modal from '@/components/Global/Modal.vue'

// register global component
Vue.component('app-modal', Modal)

// init middleware
Vue.use(VueHighcharts, { Highcharts })
Vue.prototype.moment = moment

// import global filters
import Snippet from './filters/snippet'
import UpperCaseFirstLetter from './filters/upperCaseFirstLetter'

// init global filters
Vue.filter('snippet', Snippet)
Vue.filter('upperCaseFirstLetter', UpperCaseFirstLetter)
Vue.filter('toUpperCase', (value) => {
    return value.toUpperCase()
})
Vue.filter('convertNullToDash', (value) => {
    if (value != 'null') return value
    else return '-'
})
Vue.filter('toMoney', (value) => {
    const adjusted = value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
    return adjusted
})

// global custom directives
Vue.directive('focus', {
    inserted: function(el) {
        el.focus()
    },
})

// axios interceptors - refresh token
let isRefreshing = false

axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        const {
            config,
            response: { status, data },
        } = error

        if (status === 401 && data.message === 'Expired token') {
            if (!isRefreshing) {
                isRefreshing = true
                store
                    .dispatch('refreshToken')
                    .then(({ status }) => {
                        if (status === 200 || status === 204) {
                            isRefreshing = false
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }
)

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
    created() {
        this.$store.dispatch('checkUserLocalStorage')
        this.$store.dispatch('checkEmergencyInfoStorage')
    },
}).$mount('#app')
