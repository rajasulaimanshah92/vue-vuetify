import { loadModules } from 'esri-loader'

export default {
    addHome(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        loadModules(['esri/widgets/Home'], options).then(([Home]) => {
            var homeWidget = new Home({
                view: view,
            })
            view.ui.add(homeWidget, 'top-left')
        })
    },
}
