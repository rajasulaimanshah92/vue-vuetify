import { loadModules } from 'esri-loader'

export default {
    addLayerList(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(['esri/widgets/LayerList', 'esri/widgets/Expand'], options)
            .then(([LayerList, Expand]) => {
                // view.when(function() {
                //     let layerList = new LayerList({
                //         view: view,
                //         container : 'layerlist-container'
                //     })
                // })
                // Add widget to the bottom right corner of the view
                //view.ui.add(legend, "bottom-right");

                function defineActions(event) {
                    var item = event.item
                    // console.log(item);
                    switch (item.title) {
                        case 'Drawing Point':
                            item.open = false
                            item.visible = false
                            break
                        case 'Emergency Event':
                            item.open = false
                            break
                        case 'Crisis Management':
                            item.open = true
                            break

                        case 'International Boundaries':
                        case 'Country':
                            item.actionsSections = [
                                [
                                    {
                                        title: 'Go to full extent',
                                        className: 'esri-icon-zoom-out-fixed',
                                        id: 'full-extent',
                                    },
                                    {
                                        title: 'Layer information',
                                        className: 'esri-icon-description',
                                        id: 'information',
                                    },
                                ],
                                [
                                    {
                                        title: 'Increase opacity',
                                        className: 'esri-icon-up',
                                        id: 'increase-opacity',
                                    },
                                    {
                                        title: 'Decrease opacity',
                                        className: 'esri-icon-down',
                                        id: 'decrease-opacity',
                                    },
                                ],
                            ]
                            break
                    }
                }

                view.when(function() {
                    self.mapWidget.layerList.widget = new LayerList({
                        view: view,
                        listItemCreatedFunction: defineActions,
                    })

                    self.mapWidget.layerList.toggle = new Expand({
                        expandIconClass: 'esri-icon-layers',
                        group: 'top-right',
                        view: view,
                        autoCollapse: false,
                        content: self.mapWidget.layerList.widget,
                    })

                    self.mapWidget.layerList.widget.on('trigger-action', function(event) {
                        // console.log(event.action.id);
                        // The layer visible in the view at the time of the trigger.

                        var id = event.action.id
                        var visibleLayer = map.findLayerById(event.item.layer.id)

                        if (id === 'full-extent') {
                            view.goTo(visibleLayer.fullExtent)
                        } else if (id === 'information') {
                            window.open(visibleLayer.url)
                        } else if (id === 'increase-opacity') {
                            if (visibleLayer.opacity < 1) {
                                visibleLayer.opacity += 0.25
                            }
                        } else if (id === 'decrease-opacity') {
                            if (visibleLayer.opacity > 0) {
                                visibleLayer.opacity -= 0.25
                            }
                        }
                    })

                    // Add widget to the top right corner of the view
                    view.ui.add(self.mapWidget.layerList.toggle, 'top-right')
                })
            })
            .catch((err) => {
                console.error(err)
            })
    },
}
