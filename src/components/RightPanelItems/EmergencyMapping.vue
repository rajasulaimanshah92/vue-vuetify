<template>
    <v-card class="mx-2 elevation-0">
        <v-card-title class="mb-4 primaryGreen--text body-1 font-weight-bold">
            Emergency Mapping
        </v-card-title>
        <v-treeview v-model="tree" :open="open" open-all :items="items" item-key="name">
            <template v-slot:prepend="{ item, open }">
                <v-img v-if="item.src" :src="item.src" max-width="24" max-height="24"></v-img>
            </template>
            <template v-slot:append="{ item, open }">
                <template v-if="item.name !== 'Plot Resources'">
                    <v-icon v-if="item.isOilSpill" small class="mr-2" @click="oilSpillForm(item)">mdi-water</v-icon>
                    <v-icon v-if="item.zoomTo" small class="mr-2" @click="mapZoom(item)">mdi-map</v-icon>
                    <v-icon v-if="item.create && !item.isEvent" small class="mr-2" @click="addItem(item)">{{
                        item.isActive ? 'mdi-undo' : 'mdi-plus'
                    }}</v-icon>
                    <v-icon v-if="item.create && item.isEvent" small class="mr-2" @click="addItem(item)">mdi-album</v-icon>
                    <v-icon v-if="item.edit" small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                    <v-icon v-if="item.delete" small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </template>
        </v-treeview>
        <v-treeview v-model="treeDrawing" :open="open" :items="itemsDrawing" item-key="name">
            <template v-slot:prepend="{ item, open }">
                <v-btn
                    x-small
                    v-if="item.icon"
                    style="width:24px; height:24px; min-width:10px;"
                    class="elevation-0"
                    fab
                    dark
                    color="primaryGreen"
                >
                    <v-icon size="15" dark>{{ item.icon }}</v-icon>
                </v-btn>
            </template>
            <template v-slot:append="{ item, open }">
                <template v-if="item.name !== 'Drawing'">
                    <v-icon v-if="item.zoomTo" small class="mr-2" @click="mapZoom(item)">mdi-map</v-icon>
                    <v-icon v-if="item.create && !item.isDrawing" small class="mr-2" @click="addItemDrawing(item)">{{
                        item.isActive ? 'mdi-undo' : 'mdi-plus'
                    }}</v-icon>
                    <v-icon v-if="item.create && item.isDrawing" small class="mr-2" @click="addItemDrawing(item)"
                        >mdi-album</v-icon
                    >
                    <v-icon v-if="item.edit" small class="mr-2" @click="editItemDrawing(item)">mdi-pencil</v-icon>
                    <v-icon v-if="item.delete" small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </template>
        </v-treeview>
        <v-dialog v-model="addItemDialog" persistent max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Add resources</span>
                </v-card-title>
                <v-card-text v-if="newItem">
                    <v-text-field label="Emergency ID" v-model="newItem.EMERGENCY_ID" readonly></v-text-field>
                    <v-text-field label="Facility ID" v-model="newItem.FACILITY_ID" readonly></v-text-field>
                    <v-text-field label="Title" v-model="newItem.NAME"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="addItemCancel">Cancel</v-btn>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="addItemChangeLocation"
                        >Change location</v-btn
                    >
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="confirmAddItem">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editItemDialog" persistent max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Edit Event</span>
                </v-card-title>
                <v-card-text v-if="editedItem.items">
                    <v-text-field label="Emergency ID" v-model="editedItem.items.attributes.EMERGENCY_ID" readonly></v-text-field>
                    <v-text-field label="Facility ID" v-model="editedItem.items.attributes.FACILITY_ID" readonly></v-text-field>
                    <v-text-field label="Title" v-model="editedItem.items.attributes.NAME"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="editItemCancel">Cancel</v-btn>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="editItemChangeLocation"
                        >Change location</v-btn
                    >
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="updateItem">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addBufferDialog" persistent max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Buffer</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Name" v-model="bufferItem.name"></v-text-field>
                    <v-text-field label="Distance" v-model="bufferTemp.distance"></v-text-field>
                    <v-select label="Units" :items="units" v-model="bufferTemp.unit"> </v-select>
                    <v-text-field label="Description" v-model="bufferItem.description"></v-text-field>
                    <v-menu offset-y :close-on-content-click="false" min-width="300">
                        <template v-slot:activator="{ on }">
                            <v-layout>
                                <v-flex xs12>
                                    <span style="width: 70px !important;display: inline-block;">Fill</span>
                                    <v-icon
                                        :style="{
                                            color: `rgba(${bufferTemp.fill.r},${bufferTemp.fill.g},${bufferTemp.fill.b},${bufferTemp.fill.a})`,
                                        }"
                                        >mdi-circle</v-icon
                                    >
                                    <v-icon v-on="on">mdi-palette</v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-color-picker
                                class="elevation-0"
                                v-model="bufferTemp.fill"
                                width="300px"
                                mode="rgba"
                                :hide-inputs="true"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                    <v-menu offset-y :close-on-content-click="false" min-width="300">
                        <template v-slot:activator="{ on }">
                            <v-layout>
                                <v-flex xs12>
                                    <span class="mt-2" style="width: 70px !important;display: inline-block;">Stroke</span>
                                    <v-icon
                                        :style="{
                                            color: `rgba(${bufferTemp.stroke.r},${bufferTemp.stroke.g},${bufferTemp.stroke.b},${bufferTemp.stroke.a})`,
                                        }"
                                        >mdi-circle</v-icon
                                    >
                                    <v-icon v-on="on">mdi-palette</v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-color-picker
                                class="elevation-0"
                                v-model="bufferTemp.stroke"
                                width="300px"
                                mode="rgba"
                                :hide-inputs="true"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="cancelAddbuffer">Cancel</v-btn>
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="addBuffer">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteItemDialog" persistent max-width="500px">
            <v-card>
                <v-card-title primary-title>
                    Delete {{ lastSelectedItem ? (lastSelectedItem.isEvent ? 'Event' : 'Buffer') : '' }}
                </v-card-title>
                <v-card-text> Delete {{ lastSelectedItem ? lastSelectedItem.name : '' }} item? </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="cancelDeleteItem">Cancel</v-btn>
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="delItem">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addDrawingDialog" persistent max-width="500px">
            <v-card>
                <v-card-title primary-title>
                    Add drawing
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Emergency ID" v-model="newDrawing.EMERGENCY_ID" readonly></v-text-field>
                    <v-text-field label="Facility ID" v-model="newDrawing.FACILITY_ID" readonly></v-text-field>
                    <v-text-field label="Title" v-model="newDrawing.NAME"></v-text-field>
                    <v-text-field label="Description" v-model="newDrawing.DESCRIPTION"></v-text-field>
                    <v-menu
                        v-if="lastSelectedItem && lastSelectedItem.name != 'Polyline'"
                        offset-y
                        :close-on-content-click="false"
                        min-width="300"
                    >
                        <template v-slot:activator="{ on }">
                            <v-layout>
                                <v-flex xs12>
                                    <span style="width: 70px !important;display: inline-block;">Fill</span>
                                    <v-icon
                                        :style="{
                                            color: `rgba(${bufferTemp.fill.r},${bufferTemp.fill.g},${bufferTemp.fill.b},${bufferTemp.fill.a})`,
                                        }"
                                        >mdi-circle</v-icon
                                    >
                                    <v-icon v-on="on">mdi-palette</v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-color-picker
                                class="elevation-0"
                                v-model="bufferTemp.fill"
                                width="300px"
                                mode="rgba"
                                :hide-inputs="true"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                    <v-menu offset-y :close-on-content-click="false" min-width="300">
                        <template v-slot:activator="{ on }">
                            <v-layout>
                                <v-flex xs12>
                                    <span class="mt-2" style="width: 70px !important;display: inline-block;">Stroke</span>
                                    <v-icon
                                        :style="{
                                            color: `rgba(${bufferTemp.stroke.r},${bufferTemp.stroke.g},${bufferTemp.stroke.b},${bufferTemp.stroke.a})`,
                                        }"
                                        >mdi-circle</v-icon
                                    >
                                    <v-icon v-on="on">mdi-palette</v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-color-picker
                                class="elevation-0"
                                v-model="bufferTemp.stroke"
                                width="300px"
                                mode="rgba"
                                :hide-inputs="true"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="cancelDrawing">Cancel</v-btn>
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="addDrawing">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDrawingDialog" persistent max-width="500px">
            <v-card>
                <v-card-title primary-title>
                    Edit drawing
                </v-card-title>
                <v-card-text v-if="editedDrawingItem.items">
                    <v-text-field
                        label="Emergency ID"
                        v-model="editedDrawingItem.items.attributes.EMERGENCY_ID"
                        readonly
                    ></v-text-field>
                    <v-text-field
                        label="Facility ID"
                        v-model="editedDrawingItem.items.attributes.FACILITY_ID"
                        readonly
                    ></v-text-field>
                    <v-text-field label="Title" v-model="editedDrawingItem.items.attributes.NAME"></v-text-field>
                    <v-text-field label="Description" v-model="editedDrawingItem.items.attributes.DESCRIPTION"></v-text-field>
                    <v-menu
                        v-if="lastSelectedItem && lastSelectedItem.name != 'Polyline'"
                        offset-y
                        :close-on-content-click="false"
                        min-width="300"
                    >
                        <template v-slot:activator="{ on }">
                            <v-layout>
                                <v-flex xs12>
                                    <span style="width: 70px !important;display: inline-block;">Fill</span>
                                    <v-icon
                                        :style="{
                                            color: `rgba(${bufferTemp.fill.r},${bufferTemp.fill.g},${bufferTemp.fill.b},${bufferTemp.fill.a})`,
                                        }"
                                        >mdi-circle</v-icon
                                    >
                                    <v-icon v-on="on">mdi-palette</v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-color-picker
                                class="elevation-0"
                                v-model="bufferTemp.fill"
                                width="300px"
                                mode="rgba"
                                :hide-inputs="true"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                    <v-menu offset-y :close-on-content-click="false" min-width="300">
                        <template v-slot:activator="{ on }">
                            <v-layout>
                                <v-flex xs12>
                                    <span class="mt-2" style="width: 70px !important;display: inline-block;">Stroke</span>
                                    <v-icon
                                        :style="{
                                            color: `rgba(${bufferTemp.stroke.r},${bufferTemp.stroke.g},${bufferTemp.stroke.b},${bufferTemp.stroke.a})`,
                                        }"
                                        >mdi-circle</v-icon
                                    >
                                    <v-icon v-on="on">mdi-palette</v-icon>
                                </v-flex>
                            </v-layout>
                        </template>
                        <v-card>
                            <v-color-picker
                                class="elevation-0"
                                v-model="bufferTemp.stroke"
                                width="300px"
                                mode="rgba"
                                :hide-inputs="true"
                            ></v-color-picker>
                        </v-card>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="editItemDrawingCancel">Cancel</v-btn>
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="editDrawing">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import { loadModules } from 'esri-loader'
import moment from 'moment'
import mtz from 'moment-timezone'

export default {
    data() {
        return {
            map: null,
            view: null,
            sketchViewModel: null,
            graphicsLayer: null,
            events: [],
            deleteItemDialog: false,
            editItemDialog: false,
            addItemDialog: false,
            addBufferDialog: false,
            editBufferDialog: false,
            addDrawingDialog: false,
            editDrawingDialog: false,
            drawingTools: null,
            activeDrawingTools: null,
            bufferTemp: {
                distance: null,
                unit: null,
                fill: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 0.3,
                },
                stroke: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 1,
                },
            },
            units: ['meters', 'kilometers'],
            colors: '',
            open: ['public'],
            files: {
                html: 'mdi-language-html5',
                js: 'mdi-nodejs',
                json: 'mdi-json',
                md: 'mdi-markdown',
                pdf: 'mdi-file-pdf',
                png: 'mdi-file-image',
                txt: 'mdi-file-document-outline',
                xls: 'mdi-file-excel',
            },
            tree: [],
            treeDrawing: [],
            lastSelectedItem: null,
            items: [
                {
                    name: 'Plot Resources',
                    children: [],
                },
            ],
            itemsDrawing: [
                {
                    name: 'Drawing',
                    children: [
                        {
                            name: 'Point',
                            icon: 'mdi-vector-point',
                            isTool: true,
                            create: true,
                            isActive: false,
                            type: 'point',
                            url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_point/FeatureServer`,
                            bufferUrl: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/buffer_point/FeatureServer`,
                            children: [],
                        },
                        {
                            name: 'Polyline',
                            icon: 'mdi-vector-line',
                            isTool: true,
                            create: true,
                            isActive: false,
                            type: 'polyline',
                            url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_polyline/FeatureServer`,
                            bufferUrl: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/buffer_polyline/FeatureServer`,
                            children: [],
                        },
                        {
                            name: 'Rectangle',
                            icon: 'mdi-vector-rectangle',
                            isTool: true,
                            create: true,
                            isActive: false,
                            type: 'rectangle',
                            url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_rectangle/FeatureServer`,
                            bufferUrl: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/buffer_rectangle/FeatureServer`,
                            children: [],
                        },
                        {
                            name: 'Circle',
                            icon: 'mdi-vector-circle',
                            isTool: true,
                            create: true,
                            isActive: false,
                            type: 'circle',
                            url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_circle/FeatureServer`,
                            bufferUrl: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/buffer_circle/FeatureServer`,
                            children: [],
                        },
                        {
                            name: 'Polygon',
                            icon: 'mdi-vector-polygon',
                            isTool: true,
                            create: true,
                            isActive: false,
                            type: 'polygon',
                            url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_polygon/FeatureServer`,
                            bufferUrl: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/buffer_polygon/FeatureServer`,
                            children: [],
                        },
                        {
                            name: 'Label',
                            icon: 'mdi-alphabetical',
                            isTool: true,
                            create: true,
                            isActive: false,
                            type: 'point',
                            url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_label/FeatureServer`,
                            bufferUrl: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/buffer_label/FeatureServer`,
                            children: [],
                        },
                    ],
                },
            ],
            rendererTypes: [
                {
                    name: 'Oil Spill',
                    src: require('@/assets/icons/arcgis-event1/oilspill.png'),
                },
                {
                    name: 'Ambulance',
                    src: require('@/assets/icons/arcgis-event1/ambulance.png'),
                },
                {
                    name: 'ERT',
                    src: require('@/assets/icons/arcgis-event1/ert.png'),
                },
                {
                    name: 'Fire',
                    src: require('@/assets/icons/arcgis-event1/fire.png'),
                },
                {
                    name: 'Fire Engine',
                    src: require('@/assets/icons/arcgis-event1/fireengine.png'),
                },
                {
                    name: 'Police',
                    src: require('@/assets/icons/arcgis-event1/police.png'),
                },
            ],
            newItem: {
                NAME: null,
                EMERGENCY_ID: null,
                FACILITY_ID: null,
                CREATEDBY: null,
                LATITUDE: null,
                LONGITUDE: null,
                CREATEDBY: null,
                DATECR: null,
                TYPE: null,
            },
            bufferItem: {
                EMERGENCY_ID: null,
                FACILITY_ID: null,
                CATEGORY: 'Buffer',
                UPDATEBY: null,
                DATECR: mtz.tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm:ss'),
                PID: null,
                NAME: null,
                DESCRIPTION: null,
                SYMBOLOGY: null,
            },
            newDrawing: {
                NAME: null,
                EMERGENCY_ID: null,
                FACILITY_ID: null,
                CREATEDBY: null,
                LATITUDE: null,
                LONGITUDE: null,
                CREATEDBY: null,
                DATECR: null,
                TYPE: null,
                DESCRIPTION: null,
                SYMBOLOGY: null,
            },
            editedItem: {},
            editedDrawingItem: {},
            editedBufferItem: {},
            graphicPointSymbol: {
                type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                color: {
                    r: 0,
                    g: 200,
                    b: 255,
                    a: 0.5,
                },
                size: 10,
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    width: 1,
                    color: {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 1,
                    },
                },
            },
            bufferData: [],
            childBuffer: [],
            bufferArrayDelete: [],
            bufferGraphic: [],
            drawingGraphic: [],
        }
    },
    watch: {
        drawingTools(val) {
            switch (val) {
                case 0:
                    this.activeDrawingTools = 'point'
                    this.draw()
                    break
                case 1:
                    this.activeDrawingTools = 'polyline'
                    this.draw()
                    break
                case 2:
                    this.activeDrawingTools = 'rectangle'
                    this.draw()
                    break
                case 3:
                    this.activeDrawingTools = 'circle'
                    this.draw()
                    break
                case 4:
                    this.activeDrawingTools = 'polygon'
                    this.draw()
                    break
                case 5:
                    this.activeDrawingTools = 'label'
                    break
                case undefined:
                    if (this.sketchViewModel) {
                        //this.sketchViewModel.reset();
                        this.sketchViewModel.cancel()
                        this.sketchViewModel = null
                    }
                    // this.draw()
                    break
            }
            // console.log(this.activeDrawingTools);
        },
        drawingGraphic(arr) {
            this.drawToLayer()
        },
        map(obj) {
            const fac_id = this.$route.params.id
                .split('-')
                .splice(0, this.$route.params.id.split('-').length - 1)
                .join('-')
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/tasks/QueryTask', 'esri/tasks/support/Query'], options).then(([QueryTask, Query]) => {
                var url = `${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS1/MapServer/0`
                var queryTask = new QueryTask({
                    url: url,
                })
                var query = new Query()
                query.outFields = ['*']
                query.returnGeometry = true
                query.where = `Facility_ID = '${fac_id}'`

                queryTask.execute(query).then((res) => {
                    // console.log(res);
                    this.view.goTo({
                        target: res.features[0].geometry,
                        zoom: 15,
                    })
                })
            })
        },
    },
    methods: {
        mapZoom(item) {
            const view = this.view
            let layerPoint = item.items.layer
            let queryParams
            // console.log(item);

            queryParams = layerPoint.createQuery()
            queryParams.where = `OBJECTID = '${item.items.attributes.OBJECTID}'`

            layerPoint.queryExtent(queryParams).then(function(results) {
                if (item.isEvent) {
                    view.goTo({
                        target: results.extent,
                        zoom: 15,
                    })
                } else {
                    view.goTo({
                        target: results.extent,
                        // zoom: 15
                    })
                }
            })
        },
        addItem(item) {
            if (this.lastSelectedItem && this.lastSelectedItem !== item) {
                this.lastSelectedItem.isActive = false
                if (this.sketchViewModel) {
                    //this.sketchViewModel.reset();
                    this.sketchViewModel.cancel()
                    this.sketchViewModel = null
                }
            }
            this.lastSelectedItem = item
            item.isActive = !item.isActive

            if (item.addBuffer) {
                this.addBufferDialog = true
                return
            }

            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic'], options).then(([SketchViewModel, Graphic]) => {
                if (item.isActive) {
                    this.sketchViewModel = new SketchViewModel({
                        view: this.view,
                        layer: this.graphicsLayer,
                    })
                    this.sketchViewModel.create('point')
                } else {
                    //this.sketchViewModel.reset();
                    this.sketchViewModel.cancel()
                    this.sketchViewModel = null
                }

                this.sketchViewModel.on('create', (event) => {
                    if (event.state === 'cancel') {
                        this.graphicsLayer.remove(event.graphic)
                        item.items.layer.refresh()
                        item.isActive = false
                        //this.sketchViewModel.reset();
                        this.graphicsLayer.removeAll()
                    }
                    if (event.state === 'complete') {
                        // console.log(event);
                        this.newItem.TYPE = item.name
                        this.newItem.LATITUDE = event.graphic.geometry.latitude
                        this.newItem.LONGITUDE = event.graphic.geometry.longitude
                        this.addItemDialog = true
                    }
                })

                this.sketchViewModel.on('update', (event) => {
                    if (event.state === 'cancel') {
                        this.graphicsLayer.remove(event.graphic)
                        item.items.layer.refresh()
                        item.isActive = false
                        //this.sketchViewModel.reset();
                        this.graphicsLayer.removeAll()
                    }
                    if (event.state === 'complete') {
                        this.addItemDialog = true
                    }
                })
            })
        },
        confirmAddItem() {
            this.graphicsLayer.graphics.items[0].attributes = this.newItem
            const addFeatures = {
                addFeatures: [this.graphicsLayer.graphics.items[0]],
            }
            this.layerCrud(addFeatures)
            this.addItemDialog = false
            this.newItem.NAME = null
        },
        addItemChangeLocation() {
            this.sketchViewModel.update(this.graphicsLayer.graphics.items[0])
            this.addItemDialog = false
        },
        addItemCancel() {
            this.lastSelectedItem.isActive = false
            //this.sketchViewModel.reset();
            this.sketchViewModel.cancel()
            this.sketchViewModel = null
            this.graphicsLayer.removeAll()

            this.addItemDialog = false
        },
        editItemCancel() {
            if (this.sketchViewModel) {
                //this.sketchViewModel.reset();
                this.sketchViewModel.cancel()
                this.sketchViewModel = null
            }
            this.graphicsLayer.removeAll()

            this.editItemDialog = false
            this.editBufferDialog = false
        },
        editItem(item) {
            if (item.isEvent) {
                this.editedItem = item
                this.lastSelectedItem = item
                this.mapZoom(this.editedItem)
                this.editItemDialog = true
            } else if (item.isBuffer) {
                this.editedBufferItem = item
                // console.log(this.editedBufferItem);
                this.lastSelectedItem = item
                this.bufferTemp.unit = this.lastSelectedItem.items.attributes.UNIT
                this.bufferTemp.distance = this.lastSelectedItem.items.attributes.DISTANCE
                this.bufferTemp.fill = JSON.parse(this.lastSelectedItem.items.attributes.SYMBOLOGY).color
                this.bufferTemp.stroke = JSON.parse(this.lastSelectedItem.items.attributes.SYMBOLOGY).outline.color

                // console.log(this.bufferTemp);

                this.mapZoom(this.editedBufferItem)
                this.editBufferDialog = true
            }
        },
        editItemChangeLocation() {
            this.mapZoom(this.editedItem)
            this.editItemDialog = false
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic', 'esri/geometry/SpatialReference'], options).then(
                ([SketchViewModel, Graphic, SpatialReference]) => {
                    this.sketchViewModel = new SketchViewModel({
                        view: this.view,
                        layer: this.graphicsLayer,
                    })

                    let graphic = new Graphic({
                        geometry: this.editedItem.items.geometry,
                        symbol: this.graphicPointSymbol,
                    })

                    this.graphicsLayer.add(graphic)
                    this.sketchViewModel.update(this.graphicsLayer.graphics.items[0])
                    // this.addItemDialog = false

                    this.sketchViewModel.on('update', (event) => {
                        if (event.state === 'cancel') {
                            console.log('Cancelled')
                            this.graphicsLayer.remove(event.graphic)
                            this.editedItem.items.layer.refresh()
                            //this.sketchViewModel.reset();
                            this.graphicsLayer.removeAll()
                        }
                        if (event.state === 'complete') {
                            let editedGraphic = new Graphic({
                                geometry: event.graphics[0].geometry,
                            })
                            this.editedItem.items.geometry = editedGraphic.geometry
                            this.editItemDialog = true
                        }
                    })
                }
            )
        },
        deleteItem(item) {
            this.lastSelectedItem = item
            this.deleteItemDialog = true
        },
        cancelDeleteItem() {
            this.lastSelectedItem = null
            this.deleteItemDialog = false
        },
        delItem() {
            // console.log(this.lastSelectedItem);
            if (this.lastSelectedItem.isEvent || this.lastSelectedItem.isDrawing) {
                let deleteFeatures = {
                    deleteFeatures: [this.lastSelectedItem.items],
                }
                this.layerCrud(deleteFeatures)
                if (this.lastSelectedItem.children.length) {
                    this.bufferArrayDelete = []
                    this.lastSelectedItem.children.forEach((child) => {
                        this.bufferArrayDelete.push(child.items)
                    })
                    this.lastSelectedItem = this.lastSelectedItem.children[0]
                    deleteFeatures = {
                        deleteFeatures: this.bufferArrayDelete,
                    }
                    this.layerCrud(deleteFeatures)
                }
            } else {
                const deleteFeatures = {
                    deleteFeatures: [this.lastSelectedItem.items],
                }
                this.layerCrud(deleteFeatures)
            }
            this.deleteItemDialog = false
        },
        updateItem() {
            const editFeatures = {
                updateFeatures: [this.editedItem.items],
            }
            this.layerCrud(editFeatures)
            this.editItemDialog = false
        },
        layerCrud(obj) {
            // let layer = this.lastSelectedItem.items.layer
            let layer
            // console.log(obj);
            // console.log(this.lastSelectedItem);
            // return
            if (obj.addFeatures) {
                if (!this.lastSelectedItem.addBuffer) {
                    layer = this.events.find((layer) => layer.title == 'Event (Point)')
                } else {
                    layer = this.events.find((layer) => layer.title == 'Event (Perimeter)')
                }
            } else if (obj.updateFeatures) {
                if (this.lastSelectedItem.isEvent) {
                    layer = this.events.find((layer) => layer.title == 'Event (Point)')
                } else {
                    layer = this.events.find((layer) => layer.title == 'Event (Perimeter)')
                }
            } else if (obj.deleteFeatures) {
                // console.log(this.lastSelectedItem);
                if (this.lastSelectedItem.isEvent) {
                    layer = this.events.find((layer) => layer.title == 'Event (Point)')
                } else if (this.lastSelectedItem.isEventBuffer) {
                    layer = this.events.find((layer) => layer.title == 'Event (Perimeter)')
                } else {
                    layer = this.lastSelectedItem.items.layer
                }
            }

            // const self = this
            layer
                .applyEdits(obj)
                .then((res) => {
                    // console.log(res);
                    this.generateTreeStructure('event')
                    this.generateTreeStructure('drawing')
                    this.view.graphics.removeAll()
                    this.graphicsLayer.removeAll()
                    this.renderBuffer()
                })
                .catch((err) => {
                    console.error(err)
                })
            if (this.sketchViewModel) {
                // //this.sketchViewModel.reset();
                this.sketchViewModel.cancel()
                this.sketchViewModel = null
            }
            // console.log(this.view.graphics);
            // this.generateTreeStructure('drawing')
            layer.refresh()
        },
        cancelAddbuffer() {
            this.lastSelectedItem.isActive = false
            this.bufferTemp = {
                distance: null,
                unit: null,
                fill: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 0.3,
                },
                stroke: {
                    r: 255,
                    g: 0,
                    b: 0,
                    a: 1,
                },
            }
            this.addBufferDialog = false
        },
        addBuffer() {
            const item = this.lastSelectedItem

            if (item.isDrawing) {
                this.addItemDrawingBuffer()
                return
            }
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/Graphic', 'esri/geometry/geometryEngine', 'esri/Color'], options).then(
                ([Graphic, geometryEngine, Color]) => {
                    let layer = this.lastSelectedItem.items.layer
                    // if(this.lastSelectedItem.isEvent){
                    //   layer = this.events.find(layer => layer.title == 'Event (Point)')
                    // }else if(this.lastSelectedItem.isBuffer){
                    //   layer = this.events.find(layer => layer.title == 'Event (Perimeter)')
                    // }

                    var polySym = {
                        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 3,
                        },
                    }

                    let buffer = geometryEngine.geodesicBuffer(
                        item.items.geometry,
                        this.bufferTemp.distance,
                        this.bufferTemp.unit
                    )

                    let graphic = new Graphic({
                        geometry: buffer,
                        symbol: polySym,
                        attributes: {
                            EMERGENCY_ID: item.items.attributes.EMERGENCY_ID,
                            FACILITY_ID: item.items.attributes.FACILITY_ID,
                            CATEGORY: 'Buffer',
                            UPDATEBY: this.$store.getters.user.userInfos.userName,
                            DATECR: mtz.tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm:ss'),
                            PID: item.items.attributes.OBJECTID,
                            NAME: this.bufferItem.name,
                            DESCRIPTION: this.bufferItem.description,
                            SYMBOLOGY: JSON.stringify(polySym),
                            DISTANCE: this.bufferItem.distance,
                            UNIT: this.bufferItem.unit,
                        },
                    })

                    const addFeatures = {
                        addFeatures: [graphic],
                    }

                    this.layerCrud(addFeatures)
                    this.addBufferDialog = false
                    this.bufferItem.name = null
                    this.bufferItem.description = null
                    this.bufferTemp = {
                        distance: null,
                        unit: null,
                        fill: {
                            r: 255,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                        stroke: {
                            r: 255,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                    }
                }
            )
        },
        updateBufferItem() {
            // console.log(this.lastSelectedItem);
            const layer = this.lastSelectedItem.items.layer

            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/Graphic', 'esri/geometry/geometryEngine', 'esri/Color'], options).then(
                ([Graphic, geometryEngine, Color]) => {
                    let layer = this.lastSelectedItem.items.layer
                    // if(this.lastSelectedItem.isEvent){
                    //   layer = this.events.find(layer => layer.title == 'Event (Point)')
                    // }else if(this.lastSelectedItem.isBuffer){
                    //   layer = this.events.find(layer => layer.title == 'Event (Perimeter)')
                    // }

                    var polySym = {
                        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 3,
                        },
                    }

                    let buffer = geometryEngine.geodesicBuffer(
                        this.lastSelectedItem.items.geometry,
                        this.bufferTemp.distance,
                        this.bufferTemp.unit
                    )
                    this.editedBufferItem.items.attributes.SYMBOLOGY = JSON.stringify(polySym)
                    let graphic = new Graphic({
                        geometry: buffer,
                        symbol: polySym,
                        attributes: this.editedBufferItem.items.attributes,
                    })
                    // console.log(graphic);
                    //
                    // console.log(this.editedBufferItem);

                    const editFeatures = {
                        updateFeatures: [graphic],
                    }
                    // this.layerCrud(editFeatures)
                    layer.applyEdits(editFeatures).then((res) => {
                        // console.log(res);
                        this.generateTreeStructure('drawing')
                    })
                    this.editBufferDialog = false
                    // this.editItemDialog = false
                }
            )
        },
        async generateTreeStructure(eventType) {
            if (eventType == 'event') {
                this.items[0].children = []
                const layerPoint = await this.events.find((layer) => layer.title == 'Event (Point)')

                // layerPoint.renderer.uniqueValueInfos.forEach(type => {
                this.rendererTypes.forEach((type) => {
                    // this.rendererTypes.push(type)
                    this.items[0].children.push({
                        name: type.name,
                        src: type.src,
                        items: {
                            layer: layerPoint,
                        },
                        zoomTo: false,
                        create: true,
                        edit: false,
                        delete: false,
                        addEvent: true,
                        isActive: false,
                        children: [],
                    })
                    this.generateTreeEmergency(type.name)
                })
                this.generateTreeBuffer()
                this.renderBuffer()
            } else if (eventType == 'drawing') {
                // console.log(this.itemsDrawing);
                this.drawingGraphic = []
                this.itemsDrawing[0].children.forEach((child) => {
                    // console.log(child);
                    const options = process.env.ARCGIS_API_OPTIONS
                    loadModules(['esri/layers/FeatureLayer', 'esri/Graphic'], options).then(([FeatureLayer, Graphic]) => {
                        const layer = new FeatureLayer({
                            // URL to the service
                            url: child.url,
                        })
                        child.children = []

                        // console.log(layer);
                        let query = layer.createQuery()
                        query.where = `EMERGENCY_ID = '${this.$route.params.id}'`
                        layer.queryFeatures(query).then((res) => {
                            // console.log(res);
                            if (res.features.length) {
                                res.features.forEach((obj) => {
                                    // console.log(obj);
                                    child.children.push({
                                        name: obj.attributes.NAME || '-',
                                        items: obj,
                                        zoomTo: true,
                                        create: true,
                                        edit: true,
                                        delete: true,
                                        addBuffer: true,
                                        isDrawing: true,
                                        isBuffer: false,
                                        isActive: false,
                                        geomType: child.name,
                                        bufferUrl: child.bufferUrl,
                                        children: [],
                                    })
                                    this.drawingGraphic.push({
                                        id: obj.attributes.OBJECTID,
                                        type: child.name,
                                        name: obj.attributes.NAME,
                                        graphic: new Graphic({
                                            geometry: obj.geometry,
                                        }),
                                        symbology: JSON.parse(obj.attributes.SYMBOLOGY) || null,
                                    })
                                })
                                this.generateTreeBufferDrawing(child.children)
                            }
                        })
                    })
                })
            }
        },
        generateTreeBufferDrawing(child) {
            // console.log(child);
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/layers/FeatureLayer', 'esri/Graphic'], options).then(([FeatureLayer, Graphic]) => {
                child.forEach((obj) => {
                    const layer = new FeatureLayer({
                        // URL to the service
                        url: obj.bufferUrl,
                    })

                    let query = layer.createQuery()
                    query.where = `PID = ${obj.items.attributes.OBJECTID}`
                    layer.queryFeatures(query).then((res) => {
                        if (res.features.length) {
                            // console.log(res.features);
                            res.features.forEach((result) => {
                                obj.children.push({
                                    name: result.attributes.NAME || '-',
                                    items: result,
                                    zoomTo: true,
                                    delete: true,
                                    isDrawing: false,
                                    isBuffer: true,
                                    isActive: false,
                                    bufferUrl: obj.bufferUrl,
                                    children: [],
                                })
                                this.drawingGraphic.push({
                                    id: result.attributes.OBJECTID,
                                    type: obj.name,
                                    name: result.attributes.NAME,
                                    graphic: new Graphic({
                                        geometry: result.geometry,
                                    }),
                                    symbology: JSON.parse(result.attributes.SYMBOLOGY) || null,
                                })
                            })
                        }
                    })
                })
            })
        },
        generateTreeEmergency(type) {
            const layerPoint = this.events.find((layer) => layer.title == 'Event (Point)')
            const queryParams = layerPoint.createQuery()
            let treeParent = this.items[0]
            queryParams.outSpatialReference = { wkid: 102100 }
            queryParams.where = `${layerPoint.definitionExpression} AND TYPE = '${type}'`

            layerPoint.queryFeatures(queryParams).then((results) => {
                if (results.features.length) {
                    results.features.forEach((obj) => {
                        treeParent.children
                            .find((child) => child.name == type)
                            .children.push({
                                name: obj.attributes.NAME || '-',
                                items: obj,
                                zoomTo: true,
                                create: true,
                                edit: true,
                                delete: true,
                                addBuffer: true,
                                isEvent: true,
                                isBuffer: false,
                                isActive: false,
                                isOilSpill: type == 'Oil Spill' ? true : false,
                                children: [],
                            })
                    })
                }
            })
        },
        generateTreeBuffer() {
            this.bufferData = []
            this.childBuffer = []
            const layerPerimeter = this.events.find((layer) => layer.title == 'Event (Perimeter)')
            const queryParams = layerPerimeter.createQuery()
            const self = this
            let treeParent = this.items[0].children
            queryParams.outSpatialReference = { wkid: 102100 }
            queryParams.where = `${layerPerimeter.definitionExpression} AND CATEGORY = 'Buffer'`
            layerPerimeter.queryFeatures(queryParams).then((results) => {
                if (results.features.length) {
                    const features = results.features
                    this.bufferData = features

                    treeParent.forEach((parent) => {
                        parent.children.forEach((parentChild) => {
                            // console.log(parentChild);
                            const findChild = features.filter(
                                (child) => child.attributes.PID == parentChild.items.attributes.OBJECTID
                            )
                            if (findChild.length) {
                                let tempArr = []
                                findChild.forEach((children) => {
                                    parentChild.children.push({
                                        name: children.attributes.NAME || '-',
                                        items: children,
                                        zoomTo: true,
                                        // create: false,
                                        // edit: true,
                                        delete: true,
                                        isEventBuffer: true,
                                        // addBuffer: true,
                                        isEvent: false,
                                        isBuffer: true,
                                        isActive: false,
                                        children: [],
                                    })
                                })
                            }
                        })
                    })
                }
            })
        },
        renderBuffer() {
            const layerEvent2 = this.events[1]
            const options = process.env.ARCGIS_API_OPTIONS
            const self = this
            this.bufferGraphic = []
            return loadModules(['esri/Graphic'], options).then(([Graphic]) => {
                layerEvent2.queryFeatures().then(function(results) {
                    // console.log(results);
                    // console.log(results);
                    const buffers = results.features
                    if (buffers.length) {
                        // console.log(buffers);
                        buffers.forEach((buffer) => {
                            self.bufferGraphic.push({
                                id: buffer.attributes.OBJECTID,
                                name: buffer.attributes.NAME,
                                graphic: new Graphic({
                                    geometry: buffer.geometry,
                                }),
                                symbology: JSON.parse(buffer.attributes.SYMBOLOGY),
                            })
                        })
                    } else {
                        self.bufferGraphic = []
                    }
                    self.drawBuffer()
                    // console.log(self.bufferGraphic);
                })
            })
        },
        drawBuffer() {
            const options = process.env.ARCGIS_API_OPTIONS
            return loadModules(['esri/Graphic'], options).then(([Graphic]) => {
                // console.log(self.bufferGraphic);
                let buffGraphicArr = []
                for (let i = 0; i < this.bufferGraphic.length; i++) {
                    const buffer = this.bufferGraphic[i]
                    const bufferGraphic = new Graphic({
                        geometry: buffer.graphic.geometry,
                        symbol: buffer.symbology,
                    })
                    buffGraphicArr.push(bufferGraphic)
                }
                // console.log(this.view.graphics);
                this.view.graphics.addMany(buffGraphicArr)
            })
        },

        // DRAWING METHODS //

        addItemDrawing(item) {
            if (this.lastSelectedItem && this.lastSelectedItem !== item) {
                this.lastSelectedItem.isActive = false
                if (this.sketchViewModel) {
                    //this.sketchViewModel.reset();
                    this.sketchViewModel.cancel()
                    this.sketchViewModel = null
                }
            }
            this.lastSelectedItem = item
            item.isActive = !item.isActive
            // console.log(item.isActive);
            if (item.isActive) {
                // console.log(item);
                if (item.addBuffer) {
                    this.addBufferDialog = true
                    // this.addBuffer()
                } else {
                    this.draw()
                }
            } else {
                //this.sketchViewModel.reset();
                this.sketchViewModel.cancel()
                this.sketchViewModel = null
            }
            // console.log(item);
        },
        addItemDrawingBuffer() {
            const item = this.lastSelectedItem

            // console.log(item);
            // console.log(item.bufferUrl);
            // return
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/layers/FeatureLayer', 'esri/Graphic', 'esri/geometry/geometryEngine', 'esri/Color'], options).then(
                ([FeatureLayer, Graphic, geometryEngine, Color]) => {
                    const layer = new FeatureLayer({
                        // URL to the service
                        url: item.bufferUrl,
                    })

                    var polySym = {
                        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 3,
                        },
                    }

                    let buffer = geometryEngine.geodesicBuffer(
                        item.items.geometry,
                        this.bufferTemp.distance,
                        this.bufferTemp.unit
                    )

                    let graphic = new Graphic({
                        geometry: buffer,
                        symbol: polySym,
                        attributes: {
                            EMERGENCY_ID: item.items.attributes.EMERGENCY_ID,
                            FACILITY_ID: item.items.attributes.FACILITY_ID,
                            CATEGORY: 'Buffer',
                            UPDATEBY: this.$store.getters.user.userInfos.userName,
                            DATECR: mtz.tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm:ss'),
                            PID: item.items.attributes.OBJECTID,
                            NAME: this.bufferItem.name,
                            DESCRIPTION: this.bufferItem.description,
                            SYMBOLOGY: JSON.stringify(polySym),
                            DISTANCE: this.bufferTemp.distance,
                            UNIT: this.bufferTemp.unit,
                        },
                    })
                    // console.log(this.bufferItem);
                    // console.log(graphic);
                    // return

                    const addFeatures = {
                        addFeatures: [graphic],
                    }

                    layer
                        .applyEdits(addFeatures)
                        .then((res) => {
                            console.log(res)
                            this.generateTreeStructure('drawing')
                        })
                        .catch((err) => {
                            console.error(err)
                        })

                    // this.layerCrud(addFeatures)
                    this.addBufferDialog = false
                    this.bufferItem.name = null
                    this.bufferItem.description = null
                    this.bufferTemp = {
                        distance: null,
                        unit: null,
                        fill: {
                            r: 255,
                            g: 0,
                            b: 0,
                            a: 0.3,
                        },
                        stroke: {
                            r: 255,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                    }
                }
            )
        },
        draw() {
            if (this.sketchViewModel) {
                //this.sketchViewModel.reset();
                this.sketchViewModel.cancel()
                this.sketchViewModel = null
            }
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic'], options).then(([SketchViewModel, Graphic]) => {
                this.sketchViewModel = new SketchViewModel({
                    view: this.view,
                    layer: this.graphicsLayer,
                })

                var textSymbol = {
                    type: 'text', // autocasts as new TextSymbol()
                    color: 'white',
                    haloColor: 'black',
                    haloSize: '1px',
                    text: 'Label here',
                    xoffset: 3,
                    yoffset: 3,
                    font: {
                        // autocasts as new Font()
                        size: 12,
                        family: 'Arial',
                        weight: 'bold',
                    },
                }

                // this.sketchViewModel.pointSymbol = {
                //   type: "simple-marker",
                //   style: "circle",
                //   size: 12,
                //   color: [255, 255, 255],
                //   outline: {
                //    color: [50, 50, 50],
                //     width: 1
                //   }
                // }

                this.sketchViewModel.polygonSymbol = {
                    type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                    color: [51, 51, 204, 0.9],
                    style: 'solid',
                    outline: {
                        // autocasts as new SimpleLineSymbol()
                        color: 'white',
                        width: 1,
                    },
                }
                this.sketchViewModel.polylineSymbol = {
                    type: 'simple-line',
                    // color: [130, 130, 130],
                    color: 'white',
                    width: 2,
                }

                this.sketchViewModel.create(this.lastSelectedItem.type)

                this.sketchViewModel.on('create', (ev) => {
                    // console.log(this.polygonSymbol);
                    // console.log(ev.state);
                    if (ev.state === 'complete') {
                        // if(this.lastSelectedItem.name == 'Label'){
                        //   this.graphicsLayer.remove(ev.graphic);
                        //   console.log(ev);
                        //   var labelPointGraphic = new Graphic(ev.graphic.geometry, textSymbol);
                        //   this.view.graphics.add(labelPointGraphic)
                        // }else{
                        // this.graphicsLayer.remove(ev.graphic);
                        // console.log(this.newDrawing);
                        this.addDrawingDialog = true
                        // }

                        this.lastSelectedItem.isActive = false
                        //this.sketchViewModel.reset();
                        this.sketchViewModel.cancel()
                        this.sketchViewModel = null
                    }
                })

                // this.sketchViewModel.on('update',function(){
                //
                // })
            })
        },
        addDrawing() {
            const tool = this.lastSelectedItem.name
            switch (tool) {
                case 'Point':
                    this.insertDrawing(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_point/FeatureServer`)
                    break
                case 'Polyline':
                    this.insertDrawing(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_polyline/FeatureServer`)
                    break
                case 'Rectangle':
                    this.insertDrawing(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_rectangle/FeatureServer`)
                    break
                case 'Circle':
                    this.insertDrawing(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_circle/FeatureServer`)
                    break
                case 'Polygon':
                    this.insertDrawing(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_polygon/FeatureServer`)
                    break
                case 'Label':
                    this.insertDrawing(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_label/FeatureServer`)
                    break
                default:
            }
        },
        editDrawing() {
            const layer = this.lastSelectedItem.items.layer
            let polySym
            // console.log(this.lastSelectedItem.geomType);
            switch (this.lastSelectedItem.geomType) {
                case 'Point':
                    polySym = {
                        type: 'simple-marker',
                        style: 'circle',
                        size: 12,
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 1,
                        },
                    }
                    break
                case 'Polyline':
                    polySym = {
                        type: 'simple-line',
                        color: this.bufferTemp.stroke,
                        width: 2,
                    }
                    break
                case 'Rectangle':
                    polySym = {
                        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 3,
                        },
                    }
                    break
                case 'Circle':
                    polySym = {
                        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 3,
                        },
                    }
                    break
                case 'Polygon':
                    polySym = {
                        type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                        color: this.bufferTemp.fill,
                        outline: {
                            color: this.bufferTemp.stroke,
                            width: 3,
                        },
                    }
                    break
                case 'Label':
                    polySym = {
                        type: 'text', // autocasts as new TextSymbol()
                        color: this.bufferTemp.fill,
                        haloColor: this.bufferTemp.stroke,
                        haloSize: '1px',
                        text: this.editedDrawingItem.items.NAME,
                        xoffset: 3,
                        yoffset: 3,
                        font: {
                            // autocasts as new Font()
                            size: 12,
                            family: 'Arial',
                            weight: 'bold',
                        },
                    }
                    break
                default:
            }

            this.editedDrawingItem.items.attributes.SYMBOLOGY = JSON.stringify(polySym)

            const editFeatures = {
                updateFeatures: [this.editedDrawingItem.items],
            }
            layer.applyEdits(editFeatures).then((res) => {
                this.generateTreeStructure('drawing')
            })
            this.editDrawingDialog = false
        },
        editItemDrawing(item) {
            this.editDrawingDialog = true
            this.editedDrawingItem = item
            this.lastSelectedItem = item
            // this.bufferTemp.unit = this.lastSelectedItem.items.attributes.UNIT
            // this.bufferTemp.distance = this.lastSelectedItem.items.attributes.DISTANCE
            console.log(this.lastSelectedItem.items.attributes)
            this.bufferTemp.fill = this.lastSelectedItem.items.attributes.SYMBOLOGY
                ? JSON.parse(this.lastSelectedItem.items.attributes.SYMBOLOGY).color
                : {
                      r: 255,
                      g: 0,
                      b: 0,
                      a: 0.3,
                  }
            this.bufferTemp.stroke = this.lastSelectedItem.items.attributes.SYMBOLOGY
                ? JSON.parse(this.lastSelectedItem.items.attributes.SYMBOLOGY).outline.color
                : {
                      r: 255,
                      g: 0,
                      b: 0,
                      a: 1,
                  }
        },
        editItemDrawingCancel() {
            if (this.sketchViewModel) {
                //this.sketchViewModel.reset();
                this.sketchViewModel.cancel()
                this.sketchViewModel = null
            }
            this.graphicsLayer.removeAll()

            this.editDrawingDialog = false
        },
        insertDrawing(url) {
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/layers/FeatureLayer'], options).then(([FeatureLayer]) => {
                const layer = new FeatureLayer({
                    // URL to the service
                    url: url,
                })
                let polySym

                switch (this.lastSelectedItem.name) {
                    case 'Point':
                        polySym = {
                            type: 'simple-marker',
                            style: 'circle',
                            size: 12,
                            color: this.bufferTemp.fill,
                            outline: {
                                color: this.bufferTemp.stroke,
                                width: 1,
                            },
                        }
                        break
                    case 'Polyline':
                        polySym = {
                            type: 'simple-line',
                            color: this.bufferTemp.stroke,
                            width: 2,
                        }
                        break
                    case 'Rectangle':
                        polySym = {
                            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                            color: this.bufferTemp.fill,
                            outline: {
                                color: this.bufferTemp.stroke,
                                width: 3,
                            },
                        }
                        break
                    case 'Circle':
                        polySym = {
                            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                            color: this.bufferTemp.fill,
                            outline: {
                                color: this.bufferTemp.stroke,
                                width: 3,
                            },
                        }
                        break
                    case 'Polygon':
                        polySym = {
                            type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                            color: this.bufferTemp.fill,
                            outline: {
                                color: this.bufferTemp.stroke,
                                width: 3,
                            },
                        }
                        break
                    case 'Label':
                        polySym = {
                            type: 'text', // autocasts as new TextSymbol()
                            color: this.bufferTemp.fill,
                            haloColor: this.bufferTemp.stroke,
                            haloSize: '1px',
                            text: this.newDrawing.NAME,
                            xoffset: 3,
                            yoffset: 3,
                            font: {
                                // autocasts as new Font()
                                size: 12,
                                family: 'Arial',
                                weight: 'bold',
                            },
                        }
                        break
                    default:
                }

                this.newDrawing.SYMBOLOGY = JSON.stringify(polySym)
                this.graphicsLayer.graphics.items[0].attributes = this.newDrawing
                // console.log(this.newDrawing);
                // return
                const addFeatures = {
                    addFeatures: [this.graphicsLayer.graphics.items[0]],
                }

                const self = this
                layer.applyEdits(addFeatures).then((result) => {
                    self.view.graphics.removeAll()
                    self.generateTreeStructure('drawing')
                })

                if (this.sketchViewModel) {
                    //this.sketchViewModel.reset();
                    this.sketchViewModel.cancel()
                    this.sketchViewModel = null
                }
                this.graphicsLayer.removeAll()
                this.addDrawingDialog = false

                layer.refresh()

                this.bufferTemp = {
                    distance: null,
                    unit: null,
                    fill: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 0.3,
                    },
                    stroke: {
                        r: 255,
                        g: 0,
                        b: 0,
                        a: 1,
                    },
                }
            })
        },
        cancelDrawing() {
            if (this.sketchViewModel) {
                //this.sketchViewModel.reset();
                this.sketchViewModel.cancel()
                this.sketchViewModel = null
            }
            this.graphicsLayer.removeAll()
            this.addDrawingDialog = false
        },
        drawToLayer() {
            const options = process.env.ARCGIS_API_OPTIONS
            return loadModules(['esri/Graphic'], options).then(([Graphic]) => {
                let buffGraphicArr = []
                for (let i = 0; i < this.drawingGraphic.length; i++) {
                    const buffer = this.drawingGraphic[i]
                    let drawingGraphic
                    if (buffer == 'Label') {
                        drawingGraphic = new Graphic(buffer.graphic.geometry, buffer.symbology)
                    } else {
                        drawingGraphic = new Graphic({
                            geometry: buffer.graphic.geometry,
                            symbol: buffer.symbology,
                        })
                    }

                    buffGraphicArr.push(drawingGraphic)
                }
                // console.log(this.view.graphics);
                this.view.graphics.addMany(buffGraphicArr)
            })
        },
        toRgba(buffType) {
            return JSON.stringify(
                Object.keys(buffType).reduce((color, key) => {
                    color[key] = Number(buffType[key].toFixed(2))
                    return color
                }, {}),
                null,
                2
            )
        },
        oilSpillForm(item) {
            // console.log(item);
            let oilSpillItem = item.items
            // console.log(this.$parent);
            this.$root.$emit('openOilSpillTab', oilSpillItem)
        },
    },
    computed: {
        // showColor () {
        //   if (typeof this.bufferTemp.fill === 'string') return this.bufferTemp.fill
        //
        //   return JSON.stringify(Object.keys(this.bufferTemp.fill).reduce((color, key) => {
        //     color[key] = Number(this.bufferTemp.fill[key].toFixed(2))
        //     return color
        //   }, {}), null, 2)
        // },
    },
    mounted() {
        this.$root.$on('sendMap', (config) => {
            this.map = config.map
            this.view = config.view
            this.events = this.map.layers.items.find((layer) => layer.title == 'Emergency Event').layers.items
            let emergencyLayer = this.map.layers.items.find((layer) => layer.title == 'Emergency')
            this.graphicsLayer = this.map.layers.items.find((layer) => layer.id == 'tempGraphics')

            const fac_id = this.$route.params.id
                .split('-')
                .splice(0, this.$route.params.id.split('-').length - 1)
                .join('-')
            this.generateTreeStructure('event')
            this.generateTreeStructure('drawing')

            this.newItem.CREATEDBY = this.$store.getters.user.userInfos.userName
            this.newItem.EMERGENCY_ID = this.$route.params.id
            this.newItem.FACILITY_ID = fac_id

            this.newDrawing.CREATEDBY = this.$store.getters.user.userInfos.userName
            this.newDrawing.EMERGENCY_ID = this.$route.params.id
            this.newDrawing.FACILITY_ID = fac_id
        })
    },
}
</script>

<style lang="scss" scoped>
.theme--light.v-btn-toggle .v-btn.v-btn .v-icon {
    color: #fff;
}

.theme--light.v-btn-toggle .v-btn.v-btn {
    border: none !important;
}

.btn-groups-fab {
    border-radius: 50% !important;
}
</style>
