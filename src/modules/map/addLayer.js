import { loadModules } from 'esri-loader'

export default {
    addLayer(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(
            [
                'esri/config',
                'esri/core/urlUtils',
                'esri/layers/MapImageLayer',
                'esri/layers/FeatureLayer',
                'esri/layers/GroupLayer',
                'esri/layers/GraphicsLayer',
                'esri/widgets/Sketch/SketchViewModel',
                'esri/Graphic',
            ],
            options
        ).then(
            ([
                esriConfig,
                urlUtils,
                MapImageLayer,
                FeatureLayer,
                GroupLayer,
                GraphicsLayer,
                SketchViewModel,
                Graphic,
            ]) => {
                esriConfig.request.proxyUrl = 'https://www.cmis.petronas.com/proxy/proxy.ashx'

                urlUtils.addProxyRule({
                    urlPrefix: '192.168.1.113',
                    proxyUrl: 'http://192.168.1.113/proxy/proxy.ashx',
                })

                urlUtils.addProxyRule({
                    urlPrefix: '10.14.161.185',
                    proxyUrl: 'https://www.cmis.petronas.com/proxy/proxy.ashx',
                })

                urlUtils.addProxyRule({
                    urlPrefix: 'gis.serasi.tech',
                    proxyUrl: 'http://cmis.serasi.tech/proxy/proxy.ashx',
                })

                // MYS_EP/001EP_MAIN/MapServer
                var EP = new MapImageLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'Exploration & Production',
                    url: `${process.env.VUE_APP_ARCGIS_SERVICES_URL}/MYS_EP/001EP_MAIN/MapServer`,
                    listMode: 'show', // show || hide || hide-children

                    opacity: 1,
                    visible: false,
                })

                var HSSE = new MapImageLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'HSSE',
                    url: `${process.env.VUE_APP_ARCGIS_SERVICES_URL}/HSSE/001HS_HSSE/MapServer`,
                    listMode: 'show', // show || hide || hide-children

                    opacity: 1,
                    visible: false,
                })

                var ESI = new MapImageLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'ESI',
                    url: `${process.env.VUE_APP_ARCGIS_SERVICES_URL}/ESI/001ES_MYSALL/MapServer`,
                    listMode: 'show', // show || hide || hide-children

                    opacity: 1,
                    visible: false,
                })
                // end baseMapLayers

                // EP
                var wellLocation = new MapImageLayer({
                    // MapImageLayer || FeatureLayer (if featureLayer, comment listMode
                    title: 'Well Location',
                    url: 'https://pirigis.petronas.com/arcgis/rest/services/MYS_EP/001EP_WELLLOC/MapServer',
                    //listMode: "hide-children", // show || hide || hide-children

                    opacity: 1,
                    visible: true,
                })

                var awardedBlock = new MapImageLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'Awarded Block',
                    url: 'https://pirigis.petronas.com/arcgis/rest/services/MYS_EP/004EP_AWARDBLK/MapServer',
                    //listMode: "hide-children", // show || hide || hide-children

                    opacity: 1,
                    visible: true,
                })

                var cmis = new MapImageLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'Crisis Management',
                    url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS1/MapServer`,
                    listMode: 'show', // show || hide || hide-children
                    id: 'layer1',
                    opacity: 1,
                    visible: true,
                })

                var emergency = new MapImageLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'Emergency Status',
                    url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/emergency/MapServer`,
                    listMode: 'show', // show || hide || hide-children

                    opacity: 1,
                    visible: true,
                })

                self.event1 = new FeatureLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'Event (Point)',
                    url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/event1/FeatureServer`,
                    // url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/event1/MapServer`,
                    listMode: 'hide', // show || hide || hide-children
                    id: 'Event Point',
                    opacity: 1,
                    visible: false,
                })

                // self.event1.popupTemplate = {
                //   content: '<h1>{EMERGENCY_ID} Heii</h1>'
                // }

                self.event2 = new FeatureLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'Event (Perimeter)',
                    url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/event2/FeatureServer`,
                    listMode: 'hide', // show || hide || hide-children
                    opacity: 1,
                    visible: false,
                })

                // var drawPoint = new FeatureLayer({ // MapImageLayer || FeatureLayer
                //     title: "Drawing Point",
                //     url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/drawing_point/FeatureServer`,
                //     listMode: "hide", // show || hide || hide-children
                //     opacity: 1,
                //     visible: true
                // })

                var EmergencyMapLayers = new GroupLayer({
                    title: 'Emergency Event',
                    visible: false,
                    visibilityMode: 'hide', //exclusive || inclusive
                    layers: [self.event1, self.event2],
                    opacity: 1,
                })

                // var PPTSBFacility = new MapImageLayer({ // MapImageLayer || FeatureLayer
                // 	title: "PPTSB Facility",
                // 	url: "http://192.168.45.88/arcgis/rest/services/CMIS/PPTSB_Facility/MapServer",
                // 	//listMode: "hide-children", // show || hide || hide-children
                //
                // 	opacity: 1,
                // 	visible: false
                // });

                // end EP
                // console.log(event1);

                // var OilMapScenarios = new MapImageLayer({ // MapImageLayer || FeatureLayer
                //     title: "Oil Map Scenarios",
                //     url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/Oil_Map_Scenarios/MapServer`,
                //     listMode: "show", // show || hide || hide-children
                //
                //     opacity: 1,
                //     visible: false,
                //     sublayers: [{
                //       id: 2,
                //       title: 'Oil Thickness Grid',
                //       visible: false,
                //       definitionExpression: "SID = ''"
                //     }, {
                //        id: 1,
                //        title: 'Oil Spillets',
                //        visible: false,
                //        definitionExpression: "SID = ''"
                //      },{
                //         id: 0,
                //         title: 'Oil Trackline',
                //         visible: false,
                //         definitionExpression: "SID = ''"
                //       } ]
                // })

                var nCov_Cases = new FeatureLayer({
                    // MapImageLayer || FeatureLayer
                    title: 'nCov Cases',
                    url: `https://services1.arcgis.com/0MSEUqKaxRlEPj5g/arcgis/rest/services/ncov_cases/FeatureServer/1`,
                    // url: `${process.env.VUE_APP_ARCGIS_SERVER_URL}/event1/MapServer`,
                    listMode: 'show', // show || hide || hide-children
                    id: 'nCov_Cases',
                    opacity: 0.5,
                    visible: true,
                })

                const graphicsLayer = new GraphicsLayer({
                    id: 'tempGraphics',
                    listMode: 'hide',
                })

                map.addMany([
                    // baseMapLayers,
                    EP,
                    HSSE,
                    ESI,
                    cmis,
                    emergency,
                    // PPTSBFacility,
                    EmergencyMapLayers,
                    // OilMapScenarios,
                    // drawPoint,
                    graphicsLayer,

                    nCov_Cases,
                ]) // adds the layer to the map
                return map
            }
        )
        // .catch(err => {
        //     console.error(err)
        // })
    },
}
