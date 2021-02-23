import { loadModules } from 'esri-loader'

export default {
    addIdentify(map, view, self, params, identifyTask) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(
            ['esri/core/promiseUtils', 'esri/tasks/IdentifyTask', 'esri/tasks/support/IdentifyParameters'],
            options
        ).then(([promiseUtils, IdentifyTask, IdentifyParameters]) => {
            view.when(function() {
                // executeIdentifyTask() is called each time the view is clicked
                view.on('click', executeIdentifyTask)

                // Create identify task for the specified map service
                identifyTask = new IdentifyTask(`${process.env.VUE_APP_ARCGIS_SERVER_URL}/CMIS/MapServer`)

                // Set the parameters for the Identify
                params = new IdentifyParameters()
                params.tolerance = 3
                params.layerIds = [1, 2, 4, 6, 7, 8, 9, 10, 11, 15, 17, 18, 19, 20, 22, 23, 24, 26, 27, 28, 29, 30, 31]
                params.layerOption = 'top'
                params.width = view.width
                params.height = view.height
            })

            function executeIdentifyTask(event) {
                // console.log(event);
                // Set the geometry to the location of the view click
                params.geometry = event.mapPoint
                params.mapExtent = view.extent
                //document.getElementById("viewDiv").style.cursor = "wait";

                // This function returns a promise that resolves to an array of features
                // A custom popupTemplate is set for each feature based on the layer it
                // originates from
                identifyTask
                    .execute(params)
                    .then(function(response) {
                        console.log(response)
                        let results = response.results

                        return results.map(function(result) {
                            let feature = result.feature
                            let layerName = result.layerName

                            feature.attributes.layerName = layerName
                            feature.popupTemplate = {
                                // autocasts as new PopupTemplate()
                                title: '{Map Unit Name}',
                                content: '',
                            }

                            return feature
                        })
                    })
                    .then(showPopup) // Send the array of features to showPopup()

                function showPopup(response) {
                    console.log(response)
                    // EventBus.$emit('openFacilityDialog')
                    // view.goTo(extent)
                    // webmap.findLayerById('layer1').findSublayerById(3).visible = true
                }
            }
        })
    },
}
