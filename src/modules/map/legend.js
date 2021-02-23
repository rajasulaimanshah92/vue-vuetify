import { loadModules } from 'esri-loader'

export default {
    addLegend(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(['esri/widgets/Legend', 'esri/widgets/Expand'], options)
            .then(([Legend, Expand]) => {
                view.when(function() {
                    // let legend = new Legend({
                    //     view: view,
                    //     container : 'legend-container'
                    // })
                    self.mapWidget.legend.widget = new Legend({
                        view: view,
                    })

                    self.mapWidget.legend.toggle = new Expand({
                        expandIconClass: 'esri-icon-layer-list',
                        group: 'top-right',
                        view: view,
                        autoCollapse: false,
                        content: self.mapWidget.legend.widget,
                    })

                    view.ui.add(self.mapWidget.legend.toggle, 'top-right')
                })
                // Add widget to the bottom right corner of the view
                //view.ui.add(legend, "bottom-right");
            })
            .catch((err) => {
                console.error(err)
            })
    },
}
