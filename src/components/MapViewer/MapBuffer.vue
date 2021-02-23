<template>
    <section id="map-buffer" v-show="active">
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-card-title class="primaryGreen white--text pt-2 pb-2">
                        <span class="subtitle-1 font-weight-regular">Buffer Setting</span>
                        <v-spacer></v-spacer>
                        <v-icon dark @click="active = false">mdi-close</v-icon>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text class="pt-0">
                        <v-layout wrap row>
                            <v-flex xs12>
                                <v-text-field v-model="distance" label="Distance"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-select v-model="unit" label="Units" :items="units"></v-select>
                            </v-flex>
                        </v-layout>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small outlined depressed color="primaryGreen" class="caption mr-2" @click="removeBuffer"
                            >Remove Buffer</v-btn
                        >
                        <v-btn small dark depressed color="primaryGreen" class="caption" @click="generateBuffer"
                            >Generate Buffer</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </section>
</template>

<script>
import axios from 'axios'
import { loadModules } from 'esri-loader'

export default {
    props: ['bufferId', 'active'],
    data() {
        return {
            bufferDialog: true,
            units: ['meters', 'kilometers'],
            distance: null,
            unit: null,
        }
    },
    watch: {
        active(val) {
            // console.log(val);
        },
    },
    methods: {
        generateBuffer() {
            if (isNaN(this.distance)) {
                return
            }
            if (this.distance <= 0) {
                return
            }
            const self = this
            console.log(this.bufferId)
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/Graphic', 'esri/geometry/geometryEngine'],
                options
            ).then(([QueryTask, Query, Graphic, geometryEngine]) => {
                let view = this.$store.getters.map.view
                var url = `${process.env.VUE_APP_ARCGIS_SERVER_URL}/event1/MapServer/0` // Represents the REST endpoint for a layer of cities.
                var queryTask = new QueryTask({ url: url })
                var query = new Query()
                query.returnGeometry = true
                query.outFields = ['*']
                query.where = 'OBJECTID = ' + self.bufferId

                var polySym = {
                    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                    color: [255, 0, 0, 0.3],
                    outline: {
                        color: [122, 0, 0, 0.7],
                        width: 3,
                    },
                }

                queryTask.execute(query).then(function(results) {
                    let point = results.features[0].geometry

                    var buffer = geometryEngine.geodesicBuffer(point, self.distance, self.unit)
                    let graphic = new Graphic({
                        geometry: buffer,
                        symbol: polySym,
                    })
                    view.graphics.add(graphic)
                    view.goTo(buffer.extent)
                    // bufferLayer.add(
                    // new Graphic({
                    //   geometry: buffer,
                    //   symbol: polySym
                    // })
                    // );
                    // console.log(buffer);
                })
            })
        },
        removeBuffer() {
            let view = this.$store.getters.map.view
            view.graphics.removeAll()
        },
    },
    created() {},
    beforeDestroy() {},
    updated() {
        // this.bufferId = null
        console.log(this.active)
    },
}
</script>

<style lang="scss" scoped>
#map-buffer {
    position: absolute;
    bottom: 36px;
    left: 24px;
    width: 300px;
}
</style>
