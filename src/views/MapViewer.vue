<template>
    <section id="mapviewer">
        <!-- <v-btn class="mr-5" id="btn-emergency" absolute dark right top color="highlight" @click="addPoint()">
            Emergency
            <v-icon right dark>mdi-alert</v-icon>
        </v-btn> -->
        <div ref="map" class="map" id="viewDiv"></div>
        <map-dashboard></map-dashboard>
        <map-buffer :bufferId="bufferId" :active="bufferOpen"></map-buffer>
        <v-bottom-sheet persistent hide-overlay v-model="sheet">
            <v-list>
                <v-subheader>Open in</v-subheader>
                <v-list-item v-for="tile in tiles" :key="tile.title" @click="sheet = false">
                    <v-list-item-avatar>
                        <v-avatar size="32px" tile>
                            <img :src="`https://cdn.vuetifyjs.com/images/bottom-sheets/${tile.img}`" :alt="tile.title" />
                        </v-avatar>
                    </v-list-item-avatar>
                    <v-list-item-title>{{ tile.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-bottom-sheet>
    </section>
</template>

<script>
import { EventBus } from '@/main'
import { loadModules } from 'esri-loader'
import basemap from '@/modules/map/basemap'
import addLayer from '@/modules/map/addLayer'
import layerList from '@/modules/map/layerList'
import legend from '@/modules/map/legend'
import sketch from '@/modules/map/sketch'
import editor from '@/modules/map/editor'
import identifyAll from '@/modules/map/identifyAll'
import identify from '@/modules/map/identify'
import home from '@/modules/map/home'
import locate from '@/modules/map/locate'
import MapDashboard from '@/components/MapViewer/MapDashboard'
import MapBuffer from '@/components/MapViewer/MapBuffer'

export default {
    components: {
        'map-dashboard': MapDashboard,
        'map-buffer': MapBuffer,
    },
    name: 'MapViewer',
    data() {
        return {
            bufferId: null,
            bufferOpen: false,
            sheet: false,
            tiles: [
                { img: 'keep.png', title: 'Keep' },
                { img: 'inbox.png', title: 'Inbox' },
                { img: 'hangouts.png', title: 'Hangouts' },
                { img: 'messenger.png', title: 'Messenger' },
                { img: 'google.png', title: 'Google+' },
            ],
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
            },
            graphicsLayer: null,
            sketchViewModel: null,
        }
    },
    methods: {
        addPoint() {
            this.$root.$emit('addemergency', true)
        },
        addMods(map, view) {
            basemap
                .loadView(map, view, this)
                .then(() => {
                    layerList.addLayerList(map, view, this)
                })
                .then(() => {
                    legend.addLegend(map, view, this)
                })
                .then(() => {
                    sketch.addSketch(map, view, this)
                })
                .then(() => {
                    // editor.addEditor(map, view,this)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
    mounted() {
        // console.log(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS/MapServer`);
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
            .then(([MapView, Map, Extent, SpatialReference, Search, SketchViewModel]) => {
                const webmap = new Map({
                    // basemap: 'hybrid', // topo, streets,
                    basemap: 'dark-gray',
                })

                let params = {}
                let identifyTask = {}
                let layer = {}
                let extent = []
                let sref = {}

                extent = [
                    new Extent(103.452, 4.563, 103.47, 4.575, SpatialReference.WGS84),
                    new Extent(104.717, 5.2, 104.737, 5.22, SpatialReference.WGS84),
                    new Extent(52.27038889, 39.67372222, 52.27238889, 39.67572222, SpatialReference.WGS84),
                    new Extent(52.27038889, 39.67372222, 52.27238889, 39.67572222, SpatialReference.WGS84),
                    new Extent(52.20594444, 39.70011111, 52.20794444, 39.70211111, SpatialReference.WGS84),
                    new Extent(52.28122222, 39.67594444, 52.28322222, 39.67794444, SpatialReference.WGS84),
                    new Extent(52.35177778, 39.63983333, 52.35377778, 39.64183333, SpatialReference.WGS84),
                    new Extent(52.50316667, 39.5415, 52.50516667, 39.5435, SpatialReference.WGS84),
                    new Extent(52.68511111, 40.15733333, 52.68711111, 40.15933333, SpatialReference.WGS84),
                ]

                // and we show that map in a container w/ id #viewDiv
                const view = new MapView({
                    map: webmap,
                    container: this.$refs.map,
                    center: [85, 20],
                    zoom: 4,
                })

                // var search = new Search({
                //   view: view
                // });
                //
                // view.ui.add(search, "bottom-left");

                // WIDGETS
                home.addHome(webmap, view, this)
                locate.addLocator(webmap, view, this)
                addLayer.addLayer(webmap, view, this)

                this.$nextTick(() => {
                    this.addMods(webmap, view)
                })

                // EVENTS
                // identify.addIdentify(webmap,view,this,params,identifyTask)
                identifyAll.addIdentifyAll(webmap, view, this)
                let mapWidget = this.mapWidget
                this.$store.dispatch('setMap', { view, extent, webmap, mapWidget, sketchViewModel: SketchViewModel })
            })
            .catch((err) => {
                console.error(err)
            })
        // this.$root.$on('emergencyselect',(val) => {
        //   console.log(val);
        // })
        this.$root.$on('triggerBuffer', (id) => {
            this.bufferId = id
            this.bufferOpen = true
        })
    },
}
</script>

<style lang="css" scoped>
#mapviewer {
    height: 100%;
}

.map {
    height: 100%;
    width: 100%;
}

#btn-emergency {
    top: 14px;
    right: 38px;
    z-index: 1;
}
/* .esri-ui-top-right{
    top: 50px !important;
} */
</style>
