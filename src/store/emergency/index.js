import axios from 'axios'

export default {
    state: {
        emergencyName: '',
        emergencyID: '',
    },
    mutations: {
        setEmergencyName(state, payload) {
            state.emergencyName = payload
        },
        setEmergencyID(state, payload) {
            state.emergencyID = payload
        },
        setEmergencyInfo(state, payload) {
            state.emergencyName = payload.name
            state.emergencyID = payload.id
        },
    },
    actions: {
        setEmergencyName({ commit }, payload) {
            commit('setEmergencyName', payload)
        },
        setEmergencyID({ commit }, payload) {
            commit('setEmergencyID', payload)
        },
        checkEmergencyInfoStorage({ commit, getters }) {
            const emergencyInfo = JSON.parse(localStorage.getItem('emergencyInfo'))
            if (emergencyInfo) {
                commit('setEmergencyInfo', emergencyInfo)
            }
        },
    },
    getters: {
        emergencyName(state) {
            return state.emergencyName
        },
        emergencyID(state) {
            return state.emergencyID
        },
    },
}
