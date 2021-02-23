<template>
    <section id="mapviewer">
        <div ref="map" class="map" id="viewDiv"></div>
        <v-btn id="btn-right-panel" fab dark small color="primaryGreen" absolute right top @click="toggleRightPanel">
            <v-icon dark>{{ rightPanel ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>

        <div id="topbar" class="esri-component esri-zoom esri-widget">
            <div
                class="esri-widget--button esri-widget esri-interactive"
                role="button"
                tabindex="0"
                title="Calculate distance"
                ref="distanceButton"
                @click="measureDistanceArea('distance')"
            >
                <span aria-hidden="true" role="presentation" class="esri-icon esri-icon-minus"></span>
                <span class="esri-icon-font-fallback-text">Distance</span>
            </div>
            <div
                class="esri-widget--button esri-widget esri-interactive"
                role="button"
                tabindex="0"
                title="Calculate area"
                ref="areaButton"
                @click="measureDistanceArea('area')"
            >
                <span aria-hidden="true" role="presentation" class="esri-icon esri-icon-polygon"></span>
                <span class="esri-icon-font-fallback-text">Area</span>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/main'
import { loadModules } from 'esri-loader'
import basemap from '@/modules/map/basemap'
import addLayer from '@/modules/map/addLayer'
import layerList from '@/modules/map/layerList'
import legend from '@/modules/map/legend'
import sketch from '@/modules/map/sketch'
import editor from '@/modules/map/editor'
import print from '@/modules/map/print'
import identifyAll from '@/modules/map/identifyAll'
import identify from '@/modules/map/identify'
import home from '@/modules/map/home'
import locate from '@/modules/map/locate'
import MapDashboard from '@/components/MapViewer/MapDashboard'
import MapBuffer from '@/components/MapViewer/MapBuffer'

export default {
    data() {
        return {
            rightPanel: false,
            map: null,
            view: null,
            extent: [],
            activeWidget: null,
            mapWidget: {
                baseMap: {
                    widget: {},
                    toggle: {},
                },
                layerList: {
                    widget: {},
                    toggle: {},
                },
                legend: {
                    widget: {},
                    toggle: {},
                },
                sketch: {
                    widget: {},
                    toggle: {},
                },
                editor: {
                    widget: {},
                    toggle: {},
                },
                print: {
                    widget: {},
                    toggle: {},
                },
            },
            events: [],
            token: null,
        }
    },
    watch: {
        events(layers) {
            // console.log(layers);
        },
    },
    methods: {
        addPoint() {
            this.$root.$emit('addemergency', true)
        },
        async addMods(map, view) {
            return Promise.all([
                basemap.loadView(map, view, this),
                addLayer.addLayer(this.map, this.view, this),
                locate.addLocator(this.map, this.view, this),
                home.addHome(this.map, this.view, this),
                layerList.addLayerList(map, view, this),
                legend.addLegend(map, view, this),
                sketch.addSketch(map, view, this),
                print.addPrint(map, view, this),
                identifyAll.addIdentifyAll(this.map, this.view, this),
            ])
                .then((res) => {
                    let map = res[1]
                    this.events = map.layers.items.find((layer) => layer.title == 'Emergency Event').layers.items
                    // console.log(this.$route.params.id);

                    this.events.forEach((layer) => {
                        layer.definitionExpression = `EMERGENCY_ID = '${this.$route.params.id}'`
                        // layer.definitionExpression = `EMERGENCY_ID = 'PPTSB-1566865574463'`
                    })
                })
                .then(() => {
                    this.getToken()
                        .then((res) => {
                            this.token = res.data.token
                            return this.token
                        })
                        .then((token) => {
                            const options = process.env.ARCGIS_API_OPTIONS

                            // console.log(token);
                            return loadModules(['esri/layers/MapImageLayer', 'esri/identity/IdentityManager'], options).then(
                                ([MapImageLayer, IdentityManager]) => {
                                    var tokenObj = {
                                        server: 'https://rps.serasi.tech/server/rest/services',
                                        token: token,
                                    }
                                    IdentityManager.registerToken(tokenObj)

                                    var OilMapScenarios = new MapImageLayer({
                                        // MapImageLayer || FeatureLayer
                                        title: 'Oil Map Scenarios',
                                        url: `https://rps.serasi.tech/server/rest/services/petronas/petronas_oilmap_service/MapServer`,
                                        // url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/Oil_Map_Scenarios/MapServer`,
                                        listMode: 'show', // show || hide || hide-children

                                        opacity: 1,
                                        visible: false,
                                        sublayers: [
                                            {
                                                id: 3,
                                                title: 'Oil Thickness Grid',
                                                visible: false,
                                                definitionExpression: "scenario = ''",
                                            },
                                            {
                                                id: 2,
                                                title: 'Oil Spillets',
                                                visible: false,
                                                definitionExpression: "scenario = ''",
                                            },
                                            {
                                                id: 1,
                                                title: 'Oil Trackline',
                                                visible: false,
                                                definitionExpression: "scenario = ''",
                                            },
                                        ],
                                    })

                                    OilMapScenarios.on('layerview-create-error', function(e) {
                                        console.log('ROSAK DA')
                                        console.log(e)
                                    })

                                    OilMapScenarios.on('layerview-create', function(e) {
                                        console.log('ADA')
                                        console.log(e)
                                    })

                                    map.addMany([OilMapScenarios])
                                }
                            )
                        })
                })
        },
        toggleRightPanel() {
            EventBus.$emit('toggleRightPanel')
            EventBus.$emit('hideLeftPanel')
            this.rightPanel = !this.rightPanel
        },
        measureDistanceArea(type) {
            this.setActiveWidget(null)
            if (type == 'distance') {
                this.$refs.areaButton.classList.remove('active')
                this.$refs.distanceButton.classList.toggle('active')
                if (this.$refs.distanceButton.classList.contains('active')) {
                    this.setActiveWidget('distance')
                }
            } else if (type == 'area') {
                this.$refs.distanceButton.classList.remove('active')
                this.$refs.areaButton.classList.toggle('active')
                if (this.$refs.areaButton.classList.contains('active')) {
                    this.setActiveWidget('area')
                }
            }
        },
        setActiveWidget(type) {
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/widgets/DistanceMeasurement2D', 'esri/widgets/AreaMeasurement2D'], options).then(
                ([DistanceMeasurement2D, AreaMeasurement2D]) => {
                    switch (type) {
                        case 'distance':
                            this.activeWidget = new DistanceMeasurement2D({
                                view: this.view,
                            })

                            // skip the initial 'new measurement' button
                            this.activeWidget.viewModel.newMeasurement()

                            this.view.ui.add(this.activeWidget, 'top-right')
                            break
                        case 'area':
                            this.activeWidget = new AreaMeasurement2D({
                                view: this.view,
                            })

                            // skip the initial 'new measurement' button
                            this.activeWidget.viewModel.newMeasurement()

                            this.view.ui.add(this.activeWidget, 'top-right')
                            break
                        case null:
                            if (this.activeWidget) {
                                this.view.ui.remove(this.activeWidget)
                                this.activeWidget.destroy()
                                this.activeWidget = null
                            }
                            break
                    }
                }
            )
        },
        getToken() {
            return axios.get(`${process.env.VUE_APP_API_URL}/oilmapscenario/gettoken`, {
                headers: {
                    Authorization: 'Bearer ' + this.$store.getters.user.token,
                },
            })
        },
    },
    computed: {},
    beforeCreate() {},
    mounted() {
        // console.log(this.$store.getters.mapEmergency);
        // console.log(this.map);
        const options = process.env.ARCGIS_API_OPTIONS
        loadModules(
            [
                'esri/views/MapView',
                'esri/Map',
                'esri/geometry/Extent',
                'esri/geometry/SpatialReference',
                'esri/widgets/Search',
                'esri/widgets/Sketch/SketchViewModel',
            ],
            options
        )
            .then(async ([MapView, Map, Extent, SpatialReference, Search, SketchViewModel]) => {
                // this.map = new Map({
                //     basemap: 'hybrid', // topo, streets,
                // })
                this.map = new Map({
                    // basemap: 'hybrid', // topo, streets,
                    basemap: 'dark-gray',
                })

                this.extent = [
                    new Extent(103.452, 4.563, 103.47, 4.575, SpatialReference.WGS84),
                    new Extent(104.717, 5.2, 104.737, 5.22, SpatialReference.WGS84),
                ]

                this.view = new MapView({
                    map: this.map,
                    container: this.$refs.map,
                    center: [85, 20],
                    zoom: 4,
                })

                await this.addMods(this.map, this.view)

                // zoom to facility point
                this.view.ui.add('topbar', 'top-right')
                // console.log(this.map);
                this.map.layers.items.find((layer) => layer.title == 'Emergency Event').visible = true
                this.map.allLayers.items.find((layer) => layer.title == 'Event (Point)').visible = true
                this.map.allLayers.items.find((layer) => layer.title == 'Event (Perimeter)').visible = true

                let eventLayer = await this.map.allLayers.items.find((layer) => layer.title == 'Event (Point)')

                this.$root.$emit('sendMap', {
                    map: this.map,
                    view: this.view,
                    extent: this.extent,
                    mapWidget: this.mapWidget,
                })

                this.$store.dispatch('setMapEmergency', {
                    map: this.map,
                    view: this.view,
                    extent: this.extent,
                    mapWidget: this.mapWidget,
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
    destroyed() {
        // console.log('abih');
        EventBus.$emit('closeBottomPanel')
    },
}
</script>

<style lang="scss" scoped>
#mapviewer {
    height: calc(100% - 37px);
}

.map {
    height: 100%;
    width: 100%;
}

#btn-right-panel {
    top: 48px;
    right: 12px;
    z-index: 1;
}
</style>
