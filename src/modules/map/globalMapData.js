import store from '../../store'

export default {
    getData() {
        if (store.getters.mapView) {
            console.log(store.getters.mapView)
        } else {
            console.log('No Data')
        }
    },
}
