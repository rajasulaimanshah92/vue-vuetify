import { loadModules } from 'esri-loader'

export default {
    addSketch(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(
            ['esri/widgets/Expand', 'esri/widgets/Sketch', 'esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel'],
            options
        ).then(([Expand, Sketch, GraphicsLayer, SketchViewModel]) => {
            self.graphicsLayer = GraphicsLayer({
                // MapImageLayer || FeatureLayer
                title: 'Sketch Layer',
                listMode: 'hide', // show || hide || hide-children
                opacity: 1,
                visible: true,
            })

            self.sketchViewModel = new SketchViewModel({
                view: view,
                layer: self.graphicsLayer,
            })

            self.sketchViewModel.on('update', onGraphicUpdate)

            function onGraphicUpdate(event) {
                // get the graphic as it is being updated
                const graphics = event.graphics
                //var graphicJSON=graphics[0].toJSON();

                for (var i = 0; i < self.graphicsLayer.graphics.items.length; i++) {
                    console.log(self.graphicsLayer.graphics.items[i].geometry.toJSON())
                    var g = self.graphicsLayer.graphics.items[i].geometry.toJSON()
                    console.log(JSON.stringify(g))
                    //graphicJSON[i]=(graphicsLayer.graphics.items[i].geometry.toJSON())
                }
                graphicJSON = self.graphicsLayer.graphics.toJSON()
                console.log(JSON.stringify(graphicJSON))
            }

            map.add(self.graphicsLayer)

            self.mapWidget.sketch.widget = new Sketch({
                view: view,
                layer: self.graphicsLayer,
            })

            self.mapWidget.sketch.toggle = new Expand({
                expandIconClass: 'esri-icon-edit',
                group: 'top-right',
                view: view,
                autoCollapse: false,
                content: self.mapWidget.sketch.widget,
            })
            // mobile view auto close after selecting sketch

            view.ui.add(self.mapWidget.sketch.toggle, 'top-right')
        })
    },
}
