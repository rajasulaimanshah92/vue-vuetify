import { loadModules } from 'esri-loader'

export default {
    addPrint(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        return loadModules(['esri/widgets/Print', 'esri/widgets/Expand'], options).then(([Print, Expand]) => {
            // console.log(`${process.env.VUE_APP_ARCGIS_SERVICES_URL}/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task`);
            view.when(function() {
                self.mapWidget.print.widget = new Print({
                    view: view,
                    printServiceUrl: `${process.env.VUE_APP_ARCGIS_SERVICES_URL}/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task`,
                })

                self.mapWidget.print.toggle = new Expand({
                    expandIconClass: 'esri-icon-printer',
                    group: 'top-right',
                    view: view,
                    autoCollapse: false,
                    content: self.mapWidget.print.widget,
                })
                // console.log(`${process.env.VUE_APP_ARCGIS_SERVICES_URL}/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task`);
                // Add widget to the top right corner of the view
                view.ui.add(self.mapWidget.print.toggle, 'top-right')
            })
        })
    },
}
