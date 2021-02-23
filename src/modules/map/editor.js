import { loadModules } from 'esri-loader'

export default {
    addEditor(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(
            [
                'esri/widgets/Expand',
                'esri/widgets/Editor',
                'esri/widgets/Editor/EditorViewModel',
                'esri/widgets/FeatureForm/FieldConfig',
                'esri/layers/support/CodedValueDomain',
                'esri/layers/support/Field',
                'esri/Graphic',
            ],
            options
        ).then(([Expand, Editor, EditorViewModel, FieldConfig, CodedValueDomain, Field, Graphic]) => {
            //
            // self.event1.on("graphic-add",function(e){
            //   console.log('test :'+e);
            // })

            self.event1.on('edits', function(event) {
                console.log(event)
                const extractObjectId = function(result) {
                    return result.objectId
                }

                const adds = event.addedFeatures.map(extractObjectId)
                console.log('addedFeatures: ', adds.length, adds)

                const updates = event.updatedFeatures.map(extractObjectId)
                console.log('updatedFeatures: ', updates.length, updates)

                const deletes = event.deletedFeatures.map(extractObjectId)
                console.log('deletedFeatures: ', deletes.length, deletes)

                // get feature by extractObjectId
                if (adds.length > 0) {
                    console.log('new feature detected : ' + extractObjectId)
                    self.event1
                        .queryFeatures({
                            objectIds: [adds[0]],
                            outFields: ['*'],
                            returnGeometry: true,
                        })
                        .then(function(results) {
                            console.log(results)
                            if (results.features.length > 0) {
                                let editFeature = results.features[0]
                                console.log(editFeature)
                                // addFeature = {}

                                // update attributes
                                editFeature.attributes['DATECR'] = Date.now()
                                editFeature.attributes['CREATEDBY'] = 'Hanif Sulong'
                                editFeature.attributes['EMERGENCY_ID'] = 'PMAAngsi-1563866028486'
                                editFeature.attributes['FACILITY_ID'] = null
                                editFeature.attributes['LATITUDE'] = results.features[0].geometry.latitude
                                editFeature.attributes['LONGITUDE'] = results.features[0].geometry.longitude

                                // addFeature.attributes["CREATEDBY"] = "Hanif Sulong";
                                // addFeature.attributes["EMERGENCY_ID"] = "PMAAngsi-1563866028486";
                                // addFeature.attributes["FACILITY_ID"] = "";
                                console.log(editFeature.attributes)
                                const edits = {
                                    // addFeatures: [addFeature],
                                    updateFeatures: [editFeature],
                                }

                                self.event1.applyEdits(edits)
                            }
                        })
                }
            })

            view.when(function() {
                //view.popup.autoOpenEnabled = false; //disable popups
                // Create the Editor
                self.mapWidget.editor.widget = new Editor({
                    view: view,
                    layerInfos: [
                        {
                            layer: self.event1, // pass in the feature layer
                            fieldConfig: [
                                // Specify which fields to configure
                                {
                                    name: 'TYPE',
                                    label: 'Event Type',
                                    required: true,
                                },
                                {
                                    name: 'DATECR',
                                    label: 'Date Created',
                                    // editable  : false,
                                    default: Date.now(),
                                    value: Date.now(),
                                },
                                {
                                    name: 'CREATEDBY',
                                    label: 'Created by',
                                    editable: false,
                                },
                                {
                                    name: 'EMERGENCY_ID',
                                    label: 'Emergency ID',
                                    editable: false,
                                },
                                {
                                    name: 'FACILITY_ID',
                                    label: 'Facility ID',
                                    editable: false,
                                },
                            ],
                        },
                    ],
                })

                // view.on('click',function(e){
                //   console.log('asdf');
                //   console.log(e);
                // })

                self.mapWidget.editor.toggle = new Expand({
                    expandIconClass: 'esri-icon-map-pin',
                    group: 'top-right',
                    view: view,
                    autoCollapse: false,
                    content: self.mapWidget.editor.widget,
                })
                // Add widget to top-right of the view
                view.ui.add(self.mapWidget.editor.toggle, 'top-right')

                // self.event1.applyEdits()
            })
        })
    },
}
