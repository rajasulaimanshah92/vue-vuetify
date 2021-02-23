import axios from 'axios'

export default {
    state: {
        map: null,
        mapEmergency: null,
    },
    mutations: {
        setMap(state, payload) {
            state.map = payload
        },
        setMapEmergency(state, payload) {
            state.mapEmergency = payload
        },
    },
    actions: {
        setMap({ commit }, payload) {
            commit('setMap', payload)
        },
        setMapEmergency({ commit }, payload) {
            commit('setMapEmergency', payload)
        },
    },
    getters: {
        map(state) {
            return state.map
        },
        mapEmergency(state) {
            return state.mapEmergency
        },
    },
}
