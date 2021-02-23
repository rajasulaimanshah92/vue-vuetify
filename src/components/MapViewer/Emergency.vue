<template>
    <v-container grid-list-xs,sm,md,lg,xl class="pt-0 pb-0 scroll">
        <v-layout row>
            <v-flex xs12>
                <v-sheet class="pa-2 radius-0">
                    <v-select
                        hide-details
                        :items="emergencylist"
                        item-text="name"
                        item-value="id"
                        v-model="emergencyselect"
                        @change="emergencychange"
                        clearable
                        label="Emergency List"
                    ></v-select>
                </v-sheet>
                <v-card v-show="emergencyselect" flat>
                    <v-treeview :items="treeitems">
                        <div slot="label" slot-scope="data">
                            <v-layout v-if="data.item.addable" row>
                                <v-checkbox
                                    :label="data.item.name"
                                    @change="toggleEventLayer(data.item)"
                                    hide-details
                                    hide-actions
                                    class="mt-0"
                                    v-model="data.item.visible"
                                ></v-checkbox>
                                <!-- <v-btn fab dark small color="primary">
                        <v-icon @click="addEvent(data.item)">add</v-icon>
                      </v-btn> -->
                                <v-icon v-if="!data.item.isActive" @click="toggleAddEvent(data.item)">mdi-plus</v-icon>
                                <v-icon v-else @click="toggleAddEvent(data.item)">mdi-undo</v-icon>
                            </v-layout>
                            <v-layout v-else-if="!data.item.root" row>
                                <v-checkbox
                                    :label="data.item.name"
                                    @change="toggleEventLayerData(data.item)"
                                    hide-details
                                    hide-actions
                                    class="mt-0"
                                    v-model="data.item.visible"
                                ></v-checkbox>
                                <!-- @change="toggleEventLayerData(data.item)" -->
                                <!-- <span>{{data.item.name}}</span> -->
                                <v-icon v-if="data.item.buffer" @click="bufferSetting(data.item)">mdi-album</v-icon>
                                <v-icon @click="removeData(data.item)">mdi-close</v-icon>
                            </v-layout>
                            <v-subheader v-else>{{ data.item.name }}</v-subheader>
                            <!-- <span v-else>{{data.item.name}}</span> -->
                        </div>
                    </v-treeview>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import mtz from 'moment-timezone'
import { loadModules } from 'esri-loader'
import svm from '@/modules/map/SketchViewModel'

export default {
    components: {},
    data() {
        return {
            emergencylist: [],
            emergencyselect: null,
            emergencyEvent: null,
            events: [],
            treeIds: 1,
            currSketchViewModel: null,
            currSketchViewModelEmergency: null,
            selectedItem: null,
            treeitems: [
                {
                    id: 1,
                    name: 'Emergency Event',
                    root: true,
                    children: [
                        {
                            id: 2,
                            name: 'Fire Truck',
                            value: 'Fire Engine',
                            addable: true,
                            eventName: 'Event (Point)',
                            event: 'point',
                            visible: true,
                            isActive: false,
                            children: [],
                        },
                        {
                            id: 3,
                            name: 'Police',
                            value: 'Police',
                            addable: true,
                            eventName: 'Event (Point)',
                            event: 'point',
                            visible: true,
                            isActive: false,
                            children: [],
                        },
                        {
                            id: 4,
                            name: 'Ambulance',
                            value: 'Ambulance',
                            addable: true,
                            eventName: 'Event (Point)',
                            event: 'point',
                            visible: true,
                            isActive: false,
                            children: [],
                        },
                        {
                            id: 5,
                            name: 'Fire',
                            value: 'Fire',
                            addable: true,
                            eventName: 'Event (Point)',
                            event: 'point',
                            visible: true,
                            isActive: false,
                            children: [],
                        },
                        {
                            id: 6,
                            name: 'ERT',
                            value: 'ERT',
                            addable: true,
                            eventName: 'Event (Point)',
                            event: 'point',
                            visible: true,
                            isActive: false,
                            children: [],
                        },
                        // ,{
                        //   id: 5,
                        //   name: 'Incidents (Fire & Explosion)',
                        //   addable: true,
                        //   isActive: false,
                        //   children: []
                        // },{
                        //   id: 6,
                        //   name: 'ERT Personal',
                        //   addable: true,
                        //   isActive: false,
                        //   children: []
                        // },{
                        //   id: 7,
                        //   name: 'Triage',
                        //   addable: true,
                        //   isActive: false,
                        //   children: []
                        // }
                    ],
                },
            ],
        }
    },
    methods: {
        emergencychange() {
            // console.log(this.emergencyselect);
            if (!this.emergencyselect) {
                // console.log(this.events);
                if (this.currSketchViewModel) {
                    this.currSketchViewModel.reset()
                    this.currSketchViewModel.cancel()
                }
                this.treeitems[0].children.map((obj) => (obj.isActive = false))
                this.currSketchViewModel = null
                this.events.map((layer) => (layer.visible = false))
            } else {
                // console.log(this.events);
                this.events.forEach((layer) => {
                    const view = this.$store.getters.map.view
                    layer.definitionExpression = `EMERGENCY_ID = '${this.emergencyselect}'`
                    layer.visible = true
                    layer.queryExtent().then(function(results) {
                        view.goTo(results.extent)
                    })
                })
            }
            this.loadTreeviewData()
        },
        loadTreeviewData() {
            const layerList = ['Event (Point)']

            this.treeitems[0].children
                .filter((obj) => layerList.includes(obj.eventName))
                .forEach((obj) => {
                    obj['layer'] = this.$store.getters.map.webmap.allLayers.items.find((ob) => ob.title == obj.eventName)
                    // obj['layer'].visible = true
                    const queryParams = obj['layer'].createQuery()
                    queryParams.returnGeometry = true
                    queryParams.where = `EMERGENCY_ID = '${this.emergencyselect}' AND TYPE = '${obj.value}'`
                    // console.log(obj);
                    obj['children'] = []
                    obj['layer'].queryFeatures(queryParams).then(function(results) {
                        const data = results.features
                        if (data.length) {
                            data.forEach((feature, i) => {
                                obj['children'].push({
                                    id: feature.attributes.OBJECTID,
                                    name: `${feature.attributes.TYPE} ${i + 1}`,
                                    parentName: feature.attributes.TYPE,
                                    visible: true,
                                    buffer: true,
                                    bufferSetting: false,
                                    layer: obj['layer'],
                                })
                            })
                        } else {
                            obj['children'] = []
                        }
                    })
                })
        },
        toggleEventLayer(item) {
            const activeLayers = this.treeitems[0].children
                .filter((obj) => obj.visible)
                .map((obj) => obj.value)
                .map((name) => `'${name}'`)
            const inactiveLayers = this.treeitems[0].children
                .filter((obj) => !obj.visible)
                .map((obj) => obj.value)
                .map((name) => `'${name}'`)
            if (item.children.length) {
                if (item.visible) {
                    item.layer.definitionExpression = `EMERGENCY_ID = '${this.emergencyselect}' AND TYPE IN (${activeLayers.join(
                        ','
                    )})`
                } else {
                    item.layer.definitionExpression = `EMERGENCY_ID = '${
                        this.emergencyselect
                    }' AND TYPE NOT IN (${inactiveLayers.join(',')})`
                }
                item.children.forEach((data) => {
                    data.visible = item.visible
                })
            }
        },
        toggleEventLayerData(item) {
            const activeLayers = this.treeitems[0].children
                .filter((obj) => obj.visible)
                .map((obj) => obj.value)
                .map((name) => `'${name}'`)
            let dataList = []
            const activeLayersData = this.treeitems[0].children
                .filter((obj) => obj.visible)
                .forEach((obj) => {
                    obj.children.forEach((data) => {
                        if (data.visible) dataList.push(data.id)
                    })
                })
            item.layer.definitionExpression = `EMERGENCY_ID = '${this.emergencyselect}' AND TYPE IN (${activeLayers.join(
                ','
            )}) AND OBJECTID IN (${dataList.join(',')})`
        },
        toggleAddEvent(item) {
            if (this.treeitems[0].children.find((obj) => obj.isActive) === undefined) {
                item.isActive = !item.isActive
            } else {
                this.currSketchViewModel.reset()
                this.currSketchViewModel.cancel()
                this.currSketchViewModel = null
                if (this.treeitems[0].children.find((obj) => obj.isActive).id == item.id) {
                    item.isActive = !item.isActive
                } else {
                    this.treeitems[0].children.map((obj) => (obj.isActive = false))
                    item.isActive = !item.isActive
                }
            }
            this.addEvent(item)
        },
        addEvent(item) {
            const self = this
            const ev = item.event
            const val = item.value
            const layer = item.layer
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic'], options).then(([SketchViewModel, Graphic]) => {
                let view = this.$store.getters.map.view
                let graphicsLayer = this.$store.getters.map.webmap.layers.items.find((layer) => layer.id == 'tempGraphics')
                view.when(function() {
                    if (!item.isActive) {
                        self.currSketchViewModel.reset()
                        self.currSketchViewModel.cancel()
                        self.currSketchViewModel = null
                    } else {
                        console.log(item.isActive)
                        self.currSketchViewModel = new SketchViewModel({
                            view,
                            layer: graphicsLayer,
                        })
                        self.currSketchViewModel.create(ev)
                    }

                    self.currSketchViewModel.on('create', function(event) {
                        console.log(event.state)
                        if (event.state == 'cancel') {
                            graphicsLayer.remove(event.graphic)
                            layer.refresh()
                            self.currSketchViewModel.reset()
                            graphicsLayer.removeAll()
                        }
                        if (event.state == 'complete') {
                            graphicsLayer.remove(event.graphic)

                            const graphic = new Graphic({
                                geometry: event.graphic.geometry,
                                attributes: {
                                    TYPE: val,
                                    EMERGENCY_ID: self.emergencyselect,
                                    FACILITY_ID: self.emergencyselect.split('-')[0],
                                    CREATEDBY: self.$store.getters.user.userInfos.userName,
                                    DATECR: mtz.tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm:ss'),
                                    LONGITUDE: event.graphic.geometry.longitude,
                                    LATITUDE: event.graphic.geometry.latitude,
                                },
                            })

                            const edits = {
                                addFeatures: [graphic],
                            }

                            layer
                                .applyEdits(edits)
                                .then(function(editsResult) {
                                    if (editsResult.addFeatureResults.length > 0) {
                                        const objectId = editsResult.addFeatureResults[0].objectId
                                        //selectFeature(objectId);
                                        console.log(objectId)
                                        self.loadTreeviewData()
                                        self.treeitems[0].children.map((obj) => (obj.isActive = false))
                                    }
                                })
                                .catch(function(error) {
                                    console.log('===============================================')
                                    console.error('[ applyEdits ] FAILURE: ', error.code, error.name, error.message)
                                    console.log('error = ', error)
                                })
                            layer.visible = true
                            layer.refresh()
                            self.currSketchViewModel.reset()
                            graphicsLayer.removeAll()
                            // setActiveButton();
                        }
                    })
                })
            })
        },
        addEmergency() {
            const self = this
            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(
                ['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic', 'esri/geometry/Polyline', 'esri/geometry/Point'],
                options
            ).then(([SketchViewModel, Graphic, Polyline, Point]) => {
                let view = this.$store.getters.map.view
                let graphicsLayer = this.$store.getters.map.webmap.layers.items.find((layer) => layer.id == 'tempGraphics')
                view.when(function() {
                    // self.currSketchViewModelEmergency = null

                    const pointSymbolC = {
                        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                        style: 'circle',
                        color: [255, 255, 255, 0],
                        size: '32px',
                        outline: {
                            // autocasts as new SimpleLineSymbol()
                            color: [255, 255, 0],
                            width: 3,
                        },
                    }

                    const polylineSymbol = {
                        type: 'simple-line', // autocasts as new SimpleLineSymbol()
                        color: '#8A2BE2',
                        width: '4',
                        style: 'dash',
                    }

                    self.currSketchViewModelEmergency = new SketchViewModel({
                        view,
                        layer: graphicsLayer,
                    })

                    self.currSketchViewModelEmergency.create('point')

                    self.currSketchViewModelEmergency.on('create', addGraphicEmergency)

                    let selected_distance
                    let selected_facility
                    let arr_LongLat
                    let selected_p
                    function addGraphicEmergency(event) {
                        //graphicsLayer.removeAll();
                        let x = event.graphic.geometry.longitude
                        let y = event.graphic.geometry.latitude
                        //arr_LongLat=webMercatorUtils.xyToLngLat(x,y);
                        arr_LongLat = [x, y]
                        //console.log(arr_LongLat);
                        loadModules(
                            [
                                'esri/tasks/QueryTask',
                                'esri/tasks/support/Query',
                                'esri/tasks/GeometryService',
                                'esri/tasks/support/DistanceParameters',
                                'esri/geometry/geometryEngine',
                                'esri/geometry/projection',
                            ],
                            options
                        ).then(([QueryTask, Query, GeometryService, DistanceParameters, GeometryEngine, projection]) => {
                            var url = `${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS/MapServer/2` // Represents the REST endpoint for a layer of cities.
                            var queryTask = new QueryTask({ url: url })
                            var query = new Query()
                            query.returnGeometry = true
                            query.outFields = ['*']
                            query.where = '1=1'

                            queryTask.execute(query).then(function(results) {
                                var distance = 0

                                projection.load().then(function() {
                                    var selected = 0
                                    for (var i = 0; i < results.features.length; i++) {
                                        var g = results.features[i].geometry
                                        var p = projection.project(g, { wkid: 3857 })
                                        distance = p.distance(event.graphic.geometry)
                                        if (i > 0) {
                                            if (distance < selected_distance) {
                                                selected = i
                                                selected_distance = distance
                                                selected_p = p
                                            }
                                        } else {
                                            selected_distance = distance
                                            selected_p = p
                                        }
                                    }
                                    console.log(results.features[selected])
                                    console.log(results.features[selected].attributes['FacilityID'] + ' - ' + selected_distance)

                                    self.currSketchViewModelEmergency.reset()
                                    // setActiveButton();
                                    // console.log(results.features[selected]);

                                    // self.$store.dispatch('setEmergencyName',)
                                    // self.$store.dispatch('setEmergencyID',)
                                    self.$router.push(
                                        `createemergency?mode=emergency&location=${results.features[selected].attributes.FacilityID}&x=${x}&y=${y}`
                                    )

                                    // highlite selected facility
                                    // var graphic = new Graphic({
                                    //   geometry: results.features[selected].geometry,
                                    //   symbol: pointSymbolC
                                    // });
                                    //
                                    // graphicsLayer.graphics.add(graphic);
                                    //
                                    // var line = new Polyline();
                                    //
                                    // line.addPath([results.features[selected].geometry,new Point(arr_LongLat)]);
                                    // //line.addPath(event.graphic.geometry)
                                    // // console.log(line);
                                    // var graphicLine = new Graphic({
                                    //   geometry: line,
                                    //   symbol: polylineSymbol
                                    // });
                                    // console.log('asdf');
                                    //
                                    // graphicsLayer.graphics.add(graphicLine);
                                    // draw line from click event to facility
                                    // popup facility info

                                    // selected_facility=results.features[selected].attributes["FacilityID"];
                                    // document.getElementById("facility_id_info").innerHTML=results.features[selected].attributes["FacilityID"];
                                    // document.getElementById("facility_name_info").innerHTML=results.features[selected].attributes["Facility_Nam"];
                                    // document.getElementById("distance_info").innerHTML=Math.round(selected_distance/10)/100 + "km";
                                    // document.getElementById("facility_selected").style.display="";

                                    view.center = [results.features[selected].geometry.x, results.features[selected].geometry.y] // Sets the center point of the view at a specified lon/lat
                                    //view.zoom = 13;
                                    //
                                })
                            })
                        })
                    }
                })
            })
        },
        removeData(item) {
            // console.log(item);
            const deleteFeature = {
                objectId: [item.id],
            }
            item.layer
                .applyEdits({
                    deleteFeatures: [deleteFeature],
                })
                .then((res) => {
                    console.log('success delete')
                    this.loadTreeviewData()
                })
        },
        bufferSetting(item) {
            this.$root.$emit('triggerBuffer', item.id)
        },
        loadData() {
            let url = `${process.env.VUE_APP_API_URL}/emergency/emergency/all`
            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    if (res.data.length) {
                        const data = res.data
                        data.forEach((obj) => {
                            this.emergencylist.push({ id: obj.id, name: obj.emergencyInfo.emergencyName })
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
    },
    computed: {},
    mounted() {
        this.loadData()
        this.$root.$on('addemergency', (val) => {
            let graphicsLayer = this.$store.getters.map.webmap.layers.items.find((layer) => layer.id == 'tempGraphics')
            graphicsLayer.removeAll()
            this.addEmergency()
        })
    },
    updated() {
        if (this.$store.getters.map) {
            // console.log(self.currSketchViewModel);
            const layerList = ['Event (Point)']
            const self = this

            layerList.forEach((name) => {
                if (this.$store.getters.map.webmap.allLayers.items.find((layer) => layerList.includes(layer.title))) {
                    this.events.push(
                        this.$store.getters.map.webmap.allLayers.items.find((layer) => layerList.includes(layer.title))
                    )
                }
            })

            // const options = process.env.ARCGIS_API_OPTIONS
            // loadModules(["esri/widgets/Sketch/SketchViewModel","esri/Graphic"],options)
            // .then(([SketchViewModel, Graphic]) => {
            //   let view = this.$store.getters.map.view
            //   let graphicsLayer = this.$store.getters.map.webmap.layers.items.find(layer => layer.id == 'tempGraphics')
            //   let editGraphic;
            //
            //   self.currSketchViewModel = new SketchViewModel({
            //     view,
            //     layer: graphicsLayer,
            //   });
            //
            //   self.currSketchViewModel.on('update',updateGraphic)
            //
            //   function updateGraphic(event){
            //     console.log(event.state);
            // 		if (event.state == "complete") {
            // 			const edits = { //Fire the addFeatures function using the completed graphic
            // 				updateFeatures: [editGraphic]
            // 			};
            //
            // 			self.events[0].applyEdits(edits).then(function(editsResult) {
            // 				console.log(editsResult);
            // 				self.events[0].refresh();
            // 				editGraphic = null;
            // 			})
            // 			.catch(function(error) {
            // 			  console.log("===============================================");
            // 			  console.error("[ applyEdits ] FAILURE: ", error.code, error.name,
            // 				error.message);
            // 			  console.log("error = ", error);
            // 			});
            // 			self.currSketchViewModel.reset();
            // 			graphicsLayer.removeAll();
            // 			editGraphic = null;
            // 		}
            // 		if (event.state == "cancel"){
            // 			self.currSketchViewModel.reset();
            // 			graphicsLayer.removeAll();
            // 			editGraphic = null;
            // 		}
            //   }
            //
            //   view.on("click", function (event) {
            //     view.hitTest(event).then(function (response) {
            //       var results = response.results;
            //       if (results.length > 0) {
            //         for (var i = 0; i < results.length; i++) {
            //           if (!editGraphic && results[i].graphic.layer.id === "Event Point") {
            //             console.log(results[i]);
            //             // console.log(results[i]);
            //             // Save a reference to the graphic we intend to update
            //             editGraphic = results[i].graphic;
            //             graphicsLayer.add(editGraphic);
            //
            //             self.currSketchViewModel.update(editGraphic);
            //             break;
            //           }
            //         }
            //       }
            //     });
            //   });
            // })

            // this.events[0].on('click',function(ev){
            //   console.log(ev);
            // })
            // const layerList = ['Event (Point)']
            //
            // this.treeitems[0].children.filter(obj => layerList.includes(obj.eventName)).forEach(obj => {
            //   obj['layer'] = this.$store.getters.map.webmap.allLayers.items.find(ob => ob.title == obj.eventName)
            //   // if(obj['layer']){
            //   //   this.events.push(this.$store.getters.map.webmap.allLayers.items.find(ob => ob.title == obj.eventName))
            //   // }
            //   obj['layer'].queryFeatures().then(function(results){
            //     console.log(results.features);
            //   })
            // })
            // layerList.forEach(name => {
            //   if(this.$store.getters.map.webmap.allLayers.items.find(layer => layerList.includes(layer.title))){
            //       this.events.push(this.$store.getters.map.webmap.allLayers.items.find(layer => layerList.includes(layer.title)))
            //   }
            // })
            // console.log(this.events);
            // let graphicsLayer = this.$store.getters.map.webmap.layers.items.find(layer => layer.id == 'tempGraphics')
            // console.log(this.$store.getters.map);
            // const options = process.env.ARCGIS_API_OPTIONS
            // loadModules(["esri/widgets/Sketch/SketchViewModel","esri/Graphic"],options)
            // .then(([SketchViewModel, Graphic]) => {
            //   console.log(this.$store.getters.map);
            //   let view = this.$store.getters.map.view
            //   let graphicsLayer = this.$store.getters.map.webmap.layers.items.find(layer => layer.id == 'tempGraphics')
            //   // console.log(graphicsLayer);
            //   view.when(function(){
            //     this.sketchViewModel = new SketchViewModel({
            //       view,
            //       layer: graphicsLayer
            //     });
            //     console.log(this.sketchViewModel);
            //
            //     const sketchViewModelEmergency = new SketchViewModel({
            //       view,
            //       layer: graphicsLayer
            //     });
            //   })
            // })
        }
        //   if(this.$store.getters.map){
        //     // console.log(this.$store.getters.map.webmap.layers.find(obj => obj.title.includes('Emergency Event')));
        //     if(this.$store.getters.map.webmap.layers.length){
        //       this.emergencyEvent = this.$store.getters.map.webmap.layers.find(obj => obj.title.includes('Emergency Event'))
        //       this.events = this.emergencyEvent.layers.items
        //
        //
        //       this.events.forEach(layer => {
        //         layer.renderer.uniqueValueInfos.forEach(eventInfo => {
        //           this.treeIds += 1
        //           let obj = {
        //             id: this.treeIds,
        //             name: eventInfo.value,
        //             children: []
        //           }
        //           this.treeitems[0].children.push(obj)
        //           // this.treeitems[0].children.push(...layer.renderer.uniqueValueInfos)
        //           // console.log(layer.renderer.uniqueValueInfos);
        //         })
        //       })
        //       console.log(this.treeitems);
        //     }
        //
        //   }
    },
}
</script>

<style lang="scss" scoped>
.scroll {
    height: calc(100vh - 80px);
    overflow-y: auto;
}

@media screen and (max-width: 1264px) {
    .scroll {
        height: calc(100vh - 32px);
    }
}
</style>
