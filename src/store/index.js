import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import map from './map'
import emergency from './emergency'
import shared from './shared'
import oilspill from './oilspill'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user: user,
        map: map,
        emergency: emergency,
        shared: shared,
        oilspill: oilspill,
    },
})
