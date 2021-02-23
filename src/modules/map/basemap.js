import { loadModules } from 'esri-loader'
import globalMapData from './globalMapData'

export default {
    loadView(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(['esri/widgets/BasemapGallery', 'esri/widgets/Expand'], options)
            .then(([BasemapGallery, Expand]) => {
                // let basemapGallery = new BasemapGallery({
                //     view: view,
                //     container : 'basemap-container'
                // })
                // globalMapData.getData()

                self.mapWidget.baseMap.widget = new BasemapGallery({
                    view: view,
                    container: document.createElement('div'),
                })
                self.mapWidget.baseMap.widget.renderNow()
                self.mapWidget.baseMap.toggle = new Expand({
                    expandIconClass: 'esri-icon-basemap',
                    group: 'top-right',
                    view: view,
                    autoCollapse: false,
                    content: self.mapWidget.baseMap.widget,
                })

                // mobile view auto close after selecting basemap
                self.mapWidget.baseMap.widget.watch('activeBasemap', function() {
                    var mobileSize = view.heightBreakpoint === 'xsmall' || view.widthBreakpoint === 'xsmall'

                    if (mobileSize) {
                        self.mapWidget.baseMap.toggle.collapse()
                    }
                })

                view.ui.add(self.mapWidget.baseMap.toggle, 'top-right')
            })
            .catch((err) => {
                // handle any errors
                console.error(err)
            })
    },
}
