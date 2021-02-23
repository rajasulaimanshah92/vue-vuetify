import { loadModules } from 'esri-loader'

export default {
    addLocator(map, view, self) {
        const options = process.env.ARCGIS_API_OPTIONS
        loadModules(['esri/widgets/Locate'], options).then(([Locate]) => {
            var locateWidget = new Locate({
                view: view, // Attaches the Locate button to the view
            })
            view.ui.add(locateWidget, 'top-left')
            // locateWidget.on("locate", function(locateEvent){
            //   console.log(locateEvent);
            //   console.log(homeWidget);
            // })
        })
    },
}
