import { loadModules } from 'esri-loader'

export default {
    svm(self) {
        const options = process.env.ARCGIS_API_OPTIONS
        loadModules(['esri/widgets/Sketch/SketchViewModel', 'esri/Graphic'], options).then(([SketchViewModel, Graphic]) => {
            let view = self.$store.getters.map.view
            let graphicsLayer = self.$store.getters.map.webmap.layers.items.find((layer) => layer.id == 'tempGraphics')
            // console.log(graphicsLayer);
            view.when(function() {
                const sketchViewModel = new SketchViewModel({
                    view,
                    layer: graphicsLayer,
                })

                const sketchViewModelEmergency = new SketchViewModel({
                    view,
                    layer: graphicsLayer,
                })

                console.log('asdfsadf')
            })
        })
    },
}
