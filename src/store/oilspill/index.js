import axios from 'axios'

export default {
    state: {
        fatesGraphData: null,
        createdOilSpill: null,
    },
    mutations: {
        setFatesGraphData(state, payload) {
            state.fatesGraphData = payload
        },
        setCreatedOilSpill(state, payload) {
            state.createdOilSpill = payload
        },
    },
    actions: {
        setFatesGraphData({ commit }, payload) {
            commit('setFatesGraphData', payload)
        },
        setCreatedOilSpill({ commit }, payload) {
            commit('setCreatedOilSpill', payload)
        },
    },
    getters: {
        getFatesGraphData(state) {
            return state.fatesGraphData
        },
        getCreatedOilSpill(state) {
            return state.createdOilSpill
        },
    },
}
