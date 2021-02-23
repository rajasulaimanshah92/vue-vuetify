import { loadModules } from 'esri-loader'
import axios from 'axios'

export default {
    addIdentifyAll(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(
            ['esri/core/promiseUtils', 'esri/tasks/IdentifyTask', 'esri/tasks/support/IdentifyParameters'],
            options
        ).then(([promiseUtils, IdentifyTask, IdentifyParameters]) => {
            let identifyTask, params

            // identify task parameters
            params = new IdentifyParameters()
            params.tolerance = 20 // 3,6
            params.layerOption = 'visible' // top, visible, all
            params.width = view.width
            params.height = view.height
            params.returnGeometry = true
            params.returnFieldName = false // return field alias
            // 102100
            // params.spatialReference = 102100;
            // params.spatialReference = 3857;
            // params.spatialReference = 4326;

            view.when(function() {
                view.on('click', function(event) {
                    // assign map view extent and click information to param

                    params.geometry = event.mapPoint
                    // console.log(event.mapPoint);
                    params.mapExtent = view.extent

                    // recursive function on map layer and return layer url
                    function getLayersURL(layers, resultLayers, id) {
                        var layer
                        for (var i = 0; i < layers.length; i++) {
                            layer = layers[i]
                            // console.log(layer);
                            if (layer.type == 'group') {
                                var arr = getLayersURL(layer.layers.items, resultLayers, id + '-' + i)
                                resultLayers.concat(arr)
                            } else {
                                if (layer.url && layer.visible) {
                                    // add exception if want to exclude certain layers
                                    resultLayers.push(layer.url)
                                }
                            }
                        }
                        // console.log(resultLayers);
                        return resultLayers
                    }

                    var resultLayers = []
                    // console.log(map);
                    var layersURL = getLayersURL(map.layers.items, resultLayers, '0')

                    // construct identify task list
                    var Ttasks = []
                    for (var i = 0; i < layersURL.length; i++) {
                        // console.log(layersURL[i]);
                        Ttasks[i] = new IdentifyTask(layersURL[i])
                    }

                    // console.log(Ttasks);
                    // promise function for multiple asyncronize identify task
                    promiseUtils
                        .eachAlways(
                            Ttasks.map(function(task) {
                                // console.log(params);
                                return task.execute(params).then(function(response) {
                                    // console.log(response);
                                    var results = response.results
                                    return results
                                })
                            })
                        )
                        .then(function(eachAlwaysResults) {
                            var data = {}
                            eachAlwaysResults.forEach(function(result) {
                                // console.log(result);
                                if (result.error) {
                                    console.log('There was an error in your query.', result.error)
                                } else {
                                    // mapping of multiple identify results
                                    if (result.value.length > 0) {
                                        for (var i = 0; i < result.value.length; i++) {
                                            var d = result.value[i]
                                            if (!data[d.layerName]) {
                                                data[d.layerName] = []
                                            }
                                            data[d.layerName].push(d.feature)
                                        }
                                    }
                                }
                            })
                            //console.log(data);
                            showIdentifyResult(data)
                        }) // end then
                }) // end view on click
            })

            function showIdentifyResult(result) {
                console.log(result)

                if (result['Active Emergency']) {
                    let tableData = {}
                    const link = process.env.VUE_APP_WEB_URL
                    axios
                        .get(`${process.env.VUE_APP_API_URL}/emergency/${result['Active Emergency'][0].attributes.ID}`)
                        .then((res) => {
                            // console.log(res);
                            const data = res.data.emergencyInfo
                            tableData = {
                                id: result['Active Emergency'][0].attributes.ID,
                                name: data.emergencyName,
                                location: data.location,
                                tier: data.responseTierData,
                                date: data.dateCr,
                            }
                            self.$store.dispatch('setEmergencyName', data.emergencyName)
                            self.$store.dispatch('setEmergencyID', data.id)
                            localStorage.setItem('emergencyInfo', JSON.stringify({ id: data.id, name: data.emergencyName }))

                            let c = ''
                            c += '<table style="width: 100%;">'
                            c += '<tr>'
                            c += '<td>Name</td>'
                            c += '<td>' + tableData.name + '</td>'
                            c += '</tr>'
                            c += '<tr>'
                            c += '<td>Location</td>'
                            c += '<td>' + tableData.location + '</td>'
                            c += '</tr>'
                            c += '<tr>'
                            c += '<td>Tier</td>'
                            c += '<td>' + tableData.tier + '</td>'
                            c += '</tr>'
                            c += '<tr>'
                            c += '<td>Date</td>'
                            c += '<td>' + tableData.date + '</td>'
                            c += '</tr>'
                            c += '<tr>'
                            c +=
                                '<td colspan="2"><a href="' +
                                link +
                                '/statusboard/incidentfacts/' +
                                tableData.id +
                                '">Click here for details</a></td>'
                            c += '</tr>'
                            c += '</table>'

                            view.popup.open({
                                title: 'Identify Result ',
                                features: result['Active Emergency'][0],
                                location: params.geometry,
                                content: c,
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    // var loc = result['Active Emergency'][0].attributes.FacilityID
                    // self.$root.$emit('sendLoc',loc)
                } else if (result['Facilities Location']) {
                    var loc = result['Facilities Location'][0].attributes.FacilityID
                    self.$root.$emit('sendLoc', loc)
                }
            }
        })
    },
}
