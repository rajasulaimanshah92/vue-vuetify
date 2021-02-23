<template>
    <v-container grid-list-xs,sm,md,lg,xl>
        <v-layout row wrap>
            <v-flex xs1></v-flex>
            <v-flex xs10>
                <v-layout row wrap>
                    <v-flex xs12 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.name"
                            label="Scenario name"
                            @keydown="validateName"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs6 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.latitude"
                            label="Latitude"
                            type="number"
                            min="-90"
                            max="90"
                            @keydown="validateLatitude"
                            @keyup="validateLatitude"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs6 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.longitude"
                            label="Longitude"
                            type="number"
                            min="-180"
                            max="180"
                            @keydown="validateLongitude"
                            @keyup="validateLongitude"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.description"
                            label="Description"
                            @keydown="validateDescription"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs6 pa-2 pl-4 pr-4>
                        <v-menu v-model="datePicker" :close-on-content-click="false" max-width="290">
                            <template v-slot:activator="{ on }">
                                <v-text-field :value="date" clearable label="Date" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="date" @change="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-flex>
                    <v-flex xs6 pa-2 pl-4 pr-4>
                        <v-select hide-details v-model="time" label="Time" :items="getTimeListing"></v-select>
                    </v-flex>
                    <v-flex xs4 pa-2 pl-4 pr-4>
                        <v-select hide-details v-model="scenario.oilType" label="Oil Type" :items="sortedOilTypeList"></v-select>
                    </v-flex>
                    <v-flex xs4 pa-2 pl-4 pr-4>
                        <v-select hide-details v-model="scenario.units" label="Units" :items="unitsList"></v-select>
                    </v-flex>
                    <v-flex xs4 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.volume"
                            type="number"
                            label="Volume of Oil"
                            min="1"
                            max="99000"
                            @keydown="validateVolume"
                            @keyup="validateVolume"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs4 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.duration"
                            type="number"
                            label="Duration"
                            suffix="Hours"
                            min="0"
                            max="84"
                            @keydown="validateDuration"
                            @keyup="validateDuration"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs4 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.simulationLength"
                            type="number"
                            min="1"
                            max="84"
                            label="Simulation Length"
                            suffix="Hours"
                            @keydown="validateSimulationLength"
                            @keyup="validateSimulationLength"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs4 pa-2 pl-4 pr-4>
                        <v-text-field
                            hide-details
                            v-model="scenario.temperature"
                            type="number"
                            min="-10"
                            max="54"
                            label="Temperature"
                            suffix="Celcius"
                            @keydown="validateTemperature"
                            @keyup="validateTemperature"
                        ></v-text-field>
                    </v-flex>
                    <v-flex xs12 pl-4 pr-4>
                        <small>{{ unitsLabel }}</small>
                    </v-flex>
                    <v-flex xs12 pa-2 pt-5 pl-4 pr-4>
                        <v-select
                            hide-details
                            v-model="scenario.windDataSource"
                            label="Winds and Current Data Source"
                            :items="windDataSourceList"
                            @change="manual = !manual"
                        ></v-select>
                    </v-flex>
                    <template v-if="manual">
                        <v-flex xs6 pa-2 pl-4 pr-4>
                            <v-text-field
                                hide-details
                                v-model="scenario.windSpeed"
                                type="number"
                                :min="0"
                                :max="90"
                                label="Wind Speed"
                                suffix="knots"
                                @keydown="validateWindSpeed"
                                @keyup="validateWindSpeed"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 pa-2 pl-4 pr-4>
                            <v-select
                                hide-details
                                v-model="scenario.windDirection"
                                label="Wind Direction (direction from)"
                                :items="directionList"
                            ></v-select>
                        </v-flex>
                        <v-flex xs6 pa-2 pl-4 pr-4>
                            <v-text-field
                                hide-details
                                v-model="scenario.currentSpeed"
                                type="number"
                                min="0"
                                max="90"
                                label="Current Speed"
                                suffix="knots"
                                @keydown="validateCurrentSpeed"
                                @keyup="validateCurrentSpeed"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 pa-2 pl-4 pr-4>
                            <v-select
                                hide-details
                                v-model="scenario.currentDirection"
                                label="Current Direction (going toward)"
                                :items="directionList"
                            ></v-select>
                        </v-flex>
                    </template>
                    <v-flex xs12 pa-2 pt-5 pl-4 pr-4 text-center>
                        <v-banner single-line elevation-0>
                            <template v-slot:actions>
                                <v-btn
                                    depressed
                                    :disabled="disabledBtnRun"
                                    :loading="isLoading"
                                    color="primaryGreen"
                                    @click="runScenario"
                                    >Run Scenario</v-btn
                                >
                            </template>
                            <span>{{ statusMsg }}</span>
                        </v-banner>
                    </v-flex>
                    <v-flex xs12 pa-2 pt-5 pl-4 pr-4 text-center v-if="fetchModel">
                        <v-progress-linear color="secondaryLightBlue" height="10" striped indeterminate></v-progress-linear>
                        <span>Loading...</span>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs1></v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment'
import mtz from 'moment-timezone'
import axios from 'axios'
import { EventBus } from '@/main'

export default {
    props: ['oilSpillAttributes'],
    watch: {
        oilSpillAttributes(val) {
            console.log(this.oilSpillAttributes)
            this.appendOilSpillData()
        },
    },
    data() {
        return {
            manual: true,
            isLoading: false,
            datePicker: false,
            fetchModel: false,
            date: new Date().toISOString().substr(0, 10),
            time: '',
            statusMsg: 'Checking oil map modeling service status...',
            disabledBtnRun: true,
            scenario: {
                id: '',
                emid: '',
                facilityId: '',
                sid: '',
                eventId: '',
                name: '',
                longitude: '',
                latitude: '',
                description: '',
                // dateStarted: new Date().toISOString().substr(0, 10),
                dateStarted: moment(new Date().setSeconds(0)).format(),
                timeStarted: '',
                oilType: 'Diesel',
                units: 'Barrels',
                volume: 1000.0,
                duration: 1.0,
                simulationLength: 8.0,
                temperature: 26.0,
                windDataSource: 'Manual',
                windSpeed: 2.0,
                windDirection: 'NE',
                currentSpeed: 1.0,
                currentDirection: 'E',
            },
            timeList: [],
            oilTypeList: [
                'Abu Crude',
                'Angsi',
                'Bintulu Condensate',
                'Bintulu',
                'Bunga Kekwa',
                'Bunker C',
                'Cendor',
                'Dulang',
                'Diesel',
                'Gasoline',
                'Heavy Fuel Oil',
                'Kidurong',
                'Kikeh',
                'Labuan',
                'Masa',
                'Miri',
                'Penara Blend',
                'Tapis Blend',
                'Tapis',
                'Tembungo',
                'Terengganu Condensate',
            ],
            unitsList: ['Barrels', 'Liters', 'Gallon', 'Cubic Meters', 'Tonnes', 'Pounds', 'Kilograms'],
            windDataSourceList: ['EDS Winds and Currents', 'Manual'],
            directionList: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
        }
    },
    methods: {
        appendOilSpillData() {
            if (this.oilSpillAttributes) {
                this.scenario.id = this.oilSpillAttributes.attributes.OBJECTID + '-' + new Date().getTime()
                this.scenario.eventId = this.oilSpillAttributes.attributes.OBJECTID
                this.scenario.latitude = this.oilSpillAttributes.geometry.latitude
                this.scenario.longitude = this.oilSpillAttributes.geometry.longitude
                this.scenario.dateStarted = moment(new Date(`${this.date} ${this.time}:00`).setSeconds(0)).format()
                this.scenario.timeStarted = `${this.scenario.timeStarted}:00`
            }
        },
        runScenario() {
            if (!this.oilSpillAttributes) return
            this.appendOilSpillData()
            this.isLoading = true
            this.fetchModel = true

            // console.log(moment(new Date(`${this.date} ${this.time}:00`).setSeconds(0)).format());
            // console.log(this.scenario);
            axios
                .post(`${process.env.VUE_APP_API_URL}/oilmapscenario/add`, this.scenario, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    // console.log(res)
                    // console.log('Success');
                    this.isLoading = false
                    this.fetchModel = false
                    EventBus.$emit('closeBottomPanel')

                    this.$store.dispatch('setCreatedOilSpill', res.data)

                    EventBus.$emit('changeTab', 1)
                    EventBus.$emit('sendToViewScenarios', res.data)
                })
                .catch((err) => {
                    this.isLoading = false
                    this.fetchModel = false
                    console.log(err)
                })
        },
        validateNumberInput({ evt, inputField, minNum, maxNum }) {
            if (this.scenario[inputField] === '') {
                return true
            }
            if (this.scenario[inputField] < minNum || this.scenario[inputField] > maxNum) {
                if (evt.key == 'Backspace') {
                    return true
                }
                this.scenario[inputField] = this.scenario[inputField].slice(0, -1)
                evt.preventDefault()
            } else if (!isNaN(evt.key) || evt.key == 'Backspace' || evt.key == '.' || evt.key == '-') {
                return true
            } else {
                evt.preventDefault()
            }
        },
        validateCharInput({ evt, inputField, maxChar = 255 }) {
            if (this.scenario[inputField].length > maxChar) {
                if (evt.key == 'Backspace') {
                    return true
                }
                evt.preventDefault()
            } else {
                return true
            }
        },
        validateName(evt) {
            this.validateCharInput({ evt, inputField: 'name' })
        },
        validateLatitude(evt) {
            this.validateNumberInput({ evt, inputField: 'latitude', minNum: -90, maxNum: 90 })
        },
        validateLongitude(evt) {
            this.validateNumberInput({ evt, inputField: 'longitude', minNum: -180, maxNum: 180 })
        },
        validateDescription(evt) {
            this.validateCharInput({ evt, inputField: 'description' })
        },
        validateVolume(evt) {
            this.validateNumberInput({ evt, inputField: 'volume', minNum: 1, maxNum: 99000 })
        },
        validateDuration(evt) {
            this.validateNumberInput({ evt, inputField: 'duration', minNum: 0, maxNum: 84 })
        },
        validateSimulationLength(evt) {
            this.validateNumberInput({ evt, inputField: 'simulationLength', minNum: 1, maxNum: 84 })
        },
        validateTemperature(evt) {
            this.validateNumberInput({ evt, inputField: 'temperature', minNum: -10, maxNum: 54 })
        },
        validateWindSpeed(evt) {
            this.validateNumberInput({ evt, inputField: 'windSpeed', minNum: 0, maxNum: 90 })
        },
        validateCurrentSpeed(evt) {
            this.validateNumberInput({ evt, inputField: 'currentSpeed', minNum: 0, maxNum: 90 })
        },
        generateTimeList() {
            const interval = ['00', '15', '30', '45']
            for (let hour = 0; hour < 24; hour++) {
                interval.forEach((minute) => {
                    this.timeList.push(`${hour}:${minute}`)
                })
            }
        },
        formatDate(date) {
            const finalDate = new Date(date)
            console.log(finalDate)
        },
    },
    computed: {
        getTimeListing() {
            const date = new Date()
            const currHour = date.getHours()
            this.scenario.timeStarted = `${currHour}:00`
            this.time = `${currHour}:00`
            return this.timeList.filter((time) => {
                const [hour, minute] = time.split(':')
                return hour >= currHour
            })
        },
        sortedOilTypeList() {
            return this.oilTypeList.sort()
        },
        unitsLabel() {
            if (this.scenario.duration == 0) {
                return `Instantaneous Release`
            } else {
                return `${(this.scenario.volume / this.scenario.duration).toFixed(2)} ${this.scenario.units} per hour`
            }
        },
    },
    watch: {
        timeList: {
            handler(value) {},
            deep: true,
        },
    },
    mounted() {
        this.scenario.emid = this.$route.params.id
        const facilityId = this.$route.params.id
            .split('-')
            .splice(0, this.$route.params.id.split('-').length - 1)
            .join('-')
        this.scenario.facilityId = facilityId
        this.appendOilSpillData()
        this.generateTimeList()
        // this.formatDate(this.scenario.dateStarted)

        // CHECK AVAILABILITY
        setInterval(() => {
            axios
                .get(`${process.env.VUE_APP_API_URL}/oilmapscenario/status`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    if (res.data) {
                        this.statusMsg = 'Service Locked by Other User'
                        this.disabledBtnRun = true
                    } else {
                        this.statusMsg = 'Service Available.'
                        this.disabledBtnRun = false
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }, 1000)
    },
}
</script>

<style lang="scss" scoped></style>
