<template>
    <v-bottom-sheet id="time-slider" persistent hide-overlay v-model="bottomPanel">
        <v-list class="py-0">
            <!-- <v-subheader>Open in</v-subheader> -->
            <v-layout>
                <v-flex xs12>
                    <v-btn style="float: right;" tile text color="primary" @click="closeBottomPanel"
                        >Close
                        <v-icon style="float: right;">mdi-close</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
            <div class="slider-container">
                <div class="" id="timeSliderDiv"></div>
            </div>
        </v-list>
    </v-bottom-sheet>
</template>

<script>
import { EventBus } from '@/main'
import { loadModules } from 'esri-loader'
import moment from 'moment'
import mtz from 'moment-timezone'

export default {
    data() {
        return {
            map: null,
            view: null,
            items: null,
            bottomPanel: false,
            timeslider: null,
        }
    },
    methods: {
        openBottomPanel() {
            this.bottomPanel = true
        },
        closeBottomPanel() {
            // if(this.timeslider){
            //   if (this.timeslider.viewModel.state === "playing") {
            //     this.timeslider.stop();
            //     this.timeslider.destroy()
            //   }
            // }
            // this.timeslider = null

            const item = document.querySelector('.slider-container')
            // console.log(item);
            if (item) {
                item.innerHTML = ''
            }

            // console.log(item);

            this.bottomPanel = false
            // console.log(this.map.allLayers);
            // console.log(this.map);
            if (this.map) {
                if (this.map.allLayers) {
                    let [trackline, spillets, thicknessgrid] = this.getOilMapLayer()
                    trackline.visible = false
                    spillets.visible = false
                    thicknessgrid.visible = false
                }
            }
        },
        togglePanel() {
            this.bottomPanel = !this.bottomPanel
        },
        genTimeSlider() {
            // console.log(this.items);
            const item = document.querySelector('.slider-container')
            console.log(item)
            if (item) {
                if (this.timeslider) {
                    this.timeslider.destroy()
                }
                if (document.querySelector('#timeSliderDiv')) {
                    document.querySelector('#timeSliderDiv').innerHTML = ''
                }
                item.innerHTML = ''
                item.innerHTML = '<div id="timeSliderDiv"></div>'
            }
            // console.log(this.items);
            let startDt = new Date(this.items.dateStarted)

            const options = process.env.ARCGIS_API_OPTIONS
            loadModules(['esri/widgets/TimeSlider', 'esri/tasks/QueryTask'], options).then(([TimeSlider, QueryTask]) => {
                this.timeslider = new TimeSlider({
                    container: 'timeSliderDiv',
                    view: this.view,
                    // show data within a given time range
                    // in this case data within one year
                    mode: 'time-window',
                    loop: false,
                    fullTimeExtent: {
                        // entire extent of the timeSlider
                        // start: new Date(moment(this.items.dateStarted).year(), moment(this.items.dateStarted).month(), moment(this.items.dateStarted).date()),
                        start: new Date(startDt.setSeconds(0)),
                        end: new Date(
                            new Date(new Date(startDt.setSeconds(0))).setHours(
                                new Date(startDt.setSeconds(0)).getHours() + this.items.simulationLength
                            )
                        ),
                    },
                    stops: {
                        interval: {
                            value: 1,
                            unit: 'hours',
                        },
                        // timeExtent: {
                        //   start: new Date(2001, 0, 1),
                        //   end: new Date(2010, 0, 1)
                        // }
                    },
                })

                this.map.allLayers.items.find((layer) => layer.title == 'Oil Map Scenarios').visible = true
                let [trackline, spillets, thicknessgrid] = this.getOilMapLayer()

                // console.log(this.items);
                // console.log(this.getOilMapLayer());
                let queryTask = new QueryTask(trackline.url)
                // console.log(trackline.url);
                // console.log(`scenario = '${this.items.sid}'`);
                queryTask
                    .executeForExtent({
                        // autocasts as new Query()
                        where: `scenario = '${this.items.sid}'`,
                    })
                    .then((res) => {
                        // console.log(res);
                        this.view.goTo(res.extent)
                    })

                trackline.definitionExpression = `scenario = '${this.items.sid}'`
                trackline.visible = true

                spillets.definitionExpression = `scenario = '${this.items.sid}'`
                spillets.visible = true

                thicknessgrid.definitionExpression = `scenario = '${this.items.sid}'`
                thicknessgrid.visible = true

                this.timeslider.watch('timeExtent', (value) => {
                    // console.log(value.start);
                    // console.log(value.end);
                    spillets.filter = {
                        timeExtent: value,
                    }
                    thicknessgrid.filter = {
                        timeExtent: value,
                    }
                })
            })
        },
        getOilMapLayer() {
            return this.map.allLayers.items.find((layer) => layer.title == 'Oil Map Scenarios').allSublayers.items
        },
    },
    mounted() {
        EventBus.$on('openBottomPanel', (payload) => {
            this.map = payload.map
            this.view = payload.view
            this.items = payload.item

            this.genTimeSlider()
            this.openBottomPanel()
        })
        EventBus.$on('closeBottomPanel', (payload) => {
            this.closeBottomPanel()
        })
        EventBus.$on('togglePanel', (payload) => {
            this.togglePanel()
        })
    },
}
</script>

<style lang="scss" scoped></style>
