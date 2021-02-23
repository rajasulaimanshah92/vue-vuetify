<template>
    <v-container grid-list-xs,sm,md,lg,xl class="pt-0 pb-0 scroll">
        <v-layout row>
            <v-flex xs12 id="facilities-container">
                <v-sheet class="pa-2 primaryGreen radius-0">
                    <v-text-field
                        v-model="search"
                        label="Search Facility"
                        dark
                        flat
                        solo-inverted
                        hide-details
                        clearable
                        clear-icon="mdi-close"
                    ></v-text-field>
                    <v-checkbox class="mt-1" v-model="caseSensitive" dark hide-details label="Case sensitive search"></v-checkbox>
                </v-sheet>
                <v-card flat id="" class="pr-2 ">
                    <v-progress-linear v-if="loadTree" indeterminate color="accentPurple3"></v-progress-linear>
                    <v-treeview
                        dense
                        v-model="tree"
                        :search="search"
                        :filter="filter"
                        :active.sync="active"
                        :items="treeItems"
                        :open.sync="open"
                        activatable
                        selected-color="primary"
                        item-key="id"
                        active-class="grey lighten-5 primaryGreen--text"
                        open-on-click
                        transition
                    >
                        <template v-slot:prepend="{ item, open }">
                            <v-icon v-if="!item.icon">
                                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                            </v-icon>
                            <v-icon v-else :color="checkColor(item.icon)">
                                {{ icons[item.icon] }}
                            </v-icon>
                        </template>
                    </v-treeview>
                </v-card>
            </v-flex>
            <v-dialog v-model="dialog" max-width="85%">
                <fi-dialog v-if="dialog" :id="dialogProps"></fi-dialog>
            </v-dialog>
            <v-dialog v-model="dialogCSHI" max-width="85%">
                <cshi-dialog v-if="dialogCSHI" :id="dialogProps"></cshi-dialog>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import { loadModules } from 'esri-loader'
import { EventBus } from '@/main'
import FIDialog from '@/components/MapViewer/Dialog/FIDialog'
import CSHIDialog from '@/components/MapViewer/Dialog/CSHIDialog'

export default {
    components: {
        'cshi-dialog': CSHIDialog,
        'fi-dialog': FIDialog,
    },
    data() {
        return {
            loadTree: false,
            dialog: false,
            dialogProps: '',
            dialogCSHI: false,
            search: null,
            caseSensitive: false,
            active: [],
            open: [],
            tree: [],
            icons: {
                map: 'mdi-map',
                info: 'mdi-information',
                emergency: 'mdi-alert',
                none: '',
            },
            treeItems: [],
            treeIDAndNameList: [],
        }
    },
    watch: {
        tree(value) {
            this.toggleLayerVisibility(value)
        },
        active(value) {
            if (!value.length) return
            const [id] = value
            if (id.includes('_EX') | id.includes('_EM')) {
                this.createEmergency(id)
            } else if (id.includes('_FI')) {
                this.dialogProps = value
                this.dialog = true
            } else if (id.includes('_CSHI')) {
                this.dialogProps = value
                this.dialogCSHI = true
            } else if (id.includes('_MAP')) {
                if (id.includes('KLCC')) {
                    this.gotoLocation('KLCC')
                } else if (id.includes('DAYABUMI')) {
                    this.gotoLocation('DAYABUMI')
                } else {
                    this.zoomToFacility(id)
                }
            } else {
                // this.gotoLocation(id)
            }
        },
        dialog(value) {
            if (!value) {
                this.active = []
            }
        },
        dialogCSHI(value) {
            if (!value) {
                this.active = []
            }
        },
        search(value) {
            if (value && value.length > 1) {
                let result = this.findPath(this.searchID(this.search), this.treeItems)
                this.open = [...result]
                console.log(this.open)
            } else {
                // console.log('Stop')
            }
        },
    },
    methods: {
        createEmergency(id) {
            const [item, type, location] = id.split('_')
            let mode = ''

            if (type === 'EM' || type === 'EMKLCC' || type === 'EMDAYABUMI') mode = 'emergency'
            else mode = 'exercise'
            this.gotoIncidentFact(mode, type, location)
        },
        gotoIncidentFact(mode, type, location) {
            console.log(type)
            if (type.includes('KLCC') || type.includes('DAYABUMI')) {
                let x, y
                if (type.includes('KLCC')) {
                    x = 101.6958
                    y = 3.1466
                } else if (type.includes('DAYABUMI')) {
                    x = 101.6941
                    y = 3.1449
                }
                this.gotoPage(`createemergency?mode=${mode}&location=${location}&x=${x}&y=${y}`)
            } else {
                const options = process.env.ARCGIS_API_OPTIONS
                loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], options).then(([QueryTask, Query]) => {
                    var url = `${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS1/MapServer/0` // Represents the REST endpoint for a layer of cities.
                    var queryTask = new QueryTask({
                        url: url,
                    })
                    var query = new Query()
                    query.returnGeometry = true
                    query.outFields = ['*']
                    query.where = `Facility_ID='${location}'`

                    queryTask.execute(query).then((results) => {
                        try {
                            let x = results.features[0].geometry.longitude
                            let y = results.features[0].geometry.latitude
                            this.gotoPage(`createemergency?mode=${mode}&location=${location}&x=${x}&y=${y}`)
                        } catch (error) {
                            console.error(error)
                        }
                    })
                })
            }
        },
        gotoLocation(place) {
            const view = this.$store.getters.map.view
            let x, y
            if (place == 'KLCC') {
                x = 101.6958
                y = 3.1466
            } else if (place == 'DAYABUMI') {
                x = 101.6941
                y = 3.1449
            }

            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/geometry/Extent', 'esri/geometry/SpatialReference'], options).then(
                ([Extent, SpatialReference]) => {
                    view.extent = new Extent({
                        xmin: x - 0.01,
                        ymin: y - 0.01,
                        xmax: x + 0.01,
                        ymax: y + 0.01,
                        spatialReference: SpatialReference.WGS84,
                    })
                }
            )
        },
        zoomToFacility(id) {
            const view = this.$store.getters.map.view
            const [item, type, location] = id.split('_')
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/geometry/Extent', 'esri/geometry/SpatialReference'],
                options
            ).then(([QueryTask, Query, Extent, SpatialReference]) => {
                var url = `${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS1/MapServer/0` // Represents the REST endpoint for a layer of cities.
                var queryTask = new QueryTask({
                    url: url,
                })
                var query = new Query()
                query.returnGeometry = true
                query.outFields = ['*']
                query.where = `Facility_ID='${location}'`

                queryTask.execute(query).then((results) => {
                    console.log(results)
                    let x = results.features[0].geometry.longitude
                    let y = results.features[0].geometry.latitude
                    view.extent = new Extent({
                        xmin: x - 0.01,
                        ymin: y - 0.01,
                        xmax: x + 0.01,
                        ymax: y + 0.01,
                        spatialReference: SpatialReference.WGS84,
                    })
                })
            })
        },
        openFacilityDialog() {
            this.dialog = true
        },
        checkColor(icon) {
            if (icon === 'emergency') return 'highlight'
            else if (icon === 'folder') return 'gray'
            else return 'primaryGreen'
        },
        toggleLayerVisibility(tree) {
            // hide all unchecked layers

            // show all checked layers
            tree.forEach((item) => {
                // show selected item
            })
        },
        treeDFS(obj) {
            const array = Object.entries(obj)
            let temp = {}
            for (const [key, value] of array) {
                if (typeof value !== 'object' && key === 'id') {
                    temp = { id: value }
                } else if (typeof value !== 'object' && key === 'name') {
                    temp = { ...temp, name: value }
                    this.treeIDAndNameList.push(temp)
                } else {
                    // console.log(`${key}: `)
                }
                if (value instanceof Object || value instanceof Array) {
                    this.treeDFS(value)
                }
            }
        },
        searchID(keyword) {
            this.treeIDAndNameList = []
            this.treeDFS(this.treeItems)
            const result = this.treeIDAndNameList.filter((item) => {
                if (item.name.toUpperCase().includes(keyword.toUpperCase())) {
                    return item
                }
            })
            if (result.length) return result[0].id
            else return ''
        },
        findPath(keyword, object, path = []) {
            for (const [key, value] of Object.entries(object)) {
                if (value === keyword) {
                    return [...path, value.id !== undefined ? value.id : null]
                }
                if (typeof value === 'object' || typeof value === 'function') {
                    const newPath = this.findPath(keyword, value, [...path, value.id !== undefined ? value.id : null])
                    if (newPath) {
                        return newPath.filter((item) => item !== null)
                    }
                }
            }
            return null
        },
    },
    computed: {
        filter() {
            return this.caseSensitive ? (item, search, textKey) => item[textKey].indexOf(search) > -1 : undefined
        },
    },
    created() {
        EventBus.$on('openFacilityDialog', (payload) => {
            this.openFacilityDialog()
        })
    },
    mounted() {
        this.dialog = false
        this.$root.$on('sendLoc', (loc) => {
            this.dialogProps = [`${loc}_FI`]
            this.dialog = true
        })
        this.loadTree = true
        axios
            .get(`${process.env.VUE_APP_API_URL}/facilityitem/all`, {
                headers: {
                    Authorization: 'Bearer ' + this.$store.getters.user.token,
                },
            })
            .then((response) => {
                setTimeout(() => {
                    this.treeItems = response.data
                    this.loadTree = false
                }, 1000)
            })
            .catch((error) => {
                this.loadTree = false
                console.log(error)
            })
    },
}
</script>

<style lang="scss" scoped>
#facilities-container {
    overflow: hidden;
}

.radius-0 {
    border-radius: 0 !important;
}

.scroll {
    height: calc(100vh - 50px);
    overflow-y: auto;
}

@media screen and (max-width: 1264px) {
    .scroll {
        height: calc(100vh - 0px);
    }
}
</style>
