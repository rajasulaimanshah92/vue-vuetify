<template>
    <v-container grid-list-xs,sm,md,lg,xl>
        <v-layout row wrap>
            <v-flex xs10 offset-xs1>
                <v-layout row wrap>
                    <v-flex xs12 pa-1 pl-4 pr-4>
                        <h4>Select existing scenario:</h4>
                    </v-flex>
                    <v-flex xs12 pa-1 pl-4 pr-4>
                        <v-select v-model="scenario" :items="scenarioDropDownList"></v-select>
                    </v-flex>
                    <v-flex xs12 pa-1 pl-4 pr-4>
                        <span class="font-weight-medium">Start Date UTC: </span>
                        <span>{{ startDate }}</span>
                    </v-flex>
                    <v-flex xs12 pa-1 pt-3 pl-4 pr-4>
                        <span class="font-weight-medium">Oil Type: </span>
                        <span>{{ oilType }}</span>
                    </v-flex>
                    <v-flex xs12 pa-1 pt-3 pl-4 pr-4>
                        <span class="font-weight-medium">Amount: </span>
                        <span>{{ oilAmount }}</span>
                    </v-flex>
                    <v-flex xs12 pa-1 pt-3 pl-4 pr-4>
                        <span class="font-weight-medium">Description: </span>
                        <span>{{ description }}</span>
                    </v-flex>
                    <v-flex xs12 pa-1 pt-5 pl-4 pr-4 text-center>
                        <v-btn depressed dark color="primaryGreen" class="ma-2" @click="zoomToScenario">Zoom to Scenario</v-btn>
                        <v-btn depressed dark color="primaryGreen" class="ma-2" @click="refreshScenarioList"
                            >Refresh Scenario List</v-btn
                        >
                        <v-btn
                            v-if="checkScenarioSelected"
                            depressed
                            dark
                            color="primaryGreen"
                            :loading="isLoading"
                            class="ma-2"
                            @click="deleteScenario"
                            >Delete Scenario</v-btn
                        >
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs10 offset-xs1>
                <v-layout wrap>
                    <v-flex xs12>
                        <h5>Legend</h5>
                    </v-flex>
                    <v-flex xs4>
                        <v-img :src="oilmaplegends.oilltrackline"></v-img>
                    </v-flex>
                    <v-flex xs4>
                        <v-img :src="oilmaplegends.oilspillets"></v-img>
                    </v-flex>
                    <v-flex xs4>
                        <v-img :src="oilmaplegends.oilthicknessgrid"></v-img>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialogDeleteScenario" persistent :overlay="false" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    title
                </v-card-title>
                <v-card-text> </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary">Cancel</v-btn>
                    <v-btn color="primary">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import moment from 'moment'
import mtz from 'moment-timezone'
import axios from 'axios'
import { EventBus } from '@/main'

export default {
    props: ['oilSpillAttributes', 'mapConfig'],
    watch: {
        oilSpillAttributes(val) {
            this.startDate = ''
            this.oilType = ''
            this.oilAmount = ''
            this.description = ''
            EventBus.$emit('closeBottomPanel')
            this.getScenarioList()
        },
        scenario(selected) {
            // console.log(selected);
            if (selected === undefined || selected === null) return
            if (!this.scenarioList.length) return

            if (!this.createdItem) this.selectedData = this.scenarioList.find((obj) => obj.sid == selected)

            this.$store.dispatch('setFatesGraphData', this.selectedData)
            EventBus.$emit('sendDataToFatesGraph', this.selectedData)

            this.startDate = this.selectedData.dateStarted
            this.oilType = this.selectedData.oilType
            this.oilAmount = `${this.selectedData.volume} ${this.selectedData.units}`
            this.description = this.selectedData.description

            this.createdItem = false
        },
    },
    data() {
        return {
            map: null,
            view: null,
            scenario: null,
            isLoading: false,
            dialogDeleteScenario: false,
            createdItem: false,
            pos: 0,
            scenarioDropDownList: [],
            scenarioList: [],
            startDate: '',
            oilType: '',
            oilAmount: '',
            description: '',
            selectedData: null,
            oilmaplegends: {
                oilltrackline: require('@/assets/img/oilmap legends/Oil Trackline.png'),
                oilspillets: require('@/assets/img/oilmap legends/Oil Spillets.png'),
                oilthicknessgrid: require('@/assets/img/oilmap legends/Oil Thickness Grid.png'),
            },
        }
    },
    methods: {
        zoomToScenario() {
            EventBus.$emit('openBottomPanel', {
                item: this.selectedData,
                map: this.map,
                view: this.view,
            })
            // EventBus.$emit('closeBottomPanel', payload => {
            //     this.closeBottomPanel()
            // })
        },
        refreshScenarioList() {
            this.getScenarioList()
        },
        getScenarioList() {
            if (!this.oilSpillAttributes) return

            axios
                .get(`${process.env.VUE_APP_API_URL}/oilmapscenario/event/${this.oilSpillAttributes.attributes.OBJECTID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    // if(res.data.length){
                    this.scenarioList = res.data
                    this.scenarioDropDownList = res.data.map((obj) => {
                        return {
                            value: obj.sid,
                            text: obj.name,
                        }
                    })
                    // }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        deleteScenario() {
            // console.log(this.scenario);
            this.isLoading = true

            axios
                .get(`${process.env.VUE_APP_API_URL}/oilmapscenario/deletesid/${this.scenario}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    this.getScenarioList()
                    EventBus.$emit('closeBottomPanel')
                    this.scenario = null
                    this.startDate = ''
                    this.oilType = ''
                    this.oilAmount = ''
                    this.description = ''
                    this.isLoading = false
                })
                .then((err) => {
                    this.getScenarioList()
                    this.isLoading = false
                })
        },
    },
    computed: {
        checkScenarioSelected() {
            // console.log(this.scenario);
            if (!this.scenario) return false
            return true
        },
    },
    mounted() {
        this.map = this.$store.getters.mapEmergency.map
        this.view = this.$store.getters.mapEmergency.view
        // console.log(this.mapConfig);
        this.getScenarioList()
        if (this.$store.getters.getCreatedOilSpill) {
            this.createdItem = true

            this.selectedData = this.$store.getters.getCreatedOilSpill
            this.scenario = this.$store.getters.getCreatedOilSpill.sid
            if (this.scenario) {
                this.startDate = this.selectedData.dateStarted
                this.oilType = this.selectedData.oilType
                this.oilAmount = `${this.selectedData.volume} ${this.selectedData.units}`
                this.description = this.selectedData.description

                this.$store.dispatch('setFatesGraphData', this.selectedData)
                EventBus.$emit('sendDataToFatesGraph', this.selectedData)

                this.zoomToScenario()
            }
        }

        EventBus.$on('sendToViewScenarios', (obj) => {
            this.createdItem = true
            this.getScenarioList()
            // console.log(obj);
            this.selectedData = obj

            this.scenario = obj.sid
            this.startDate = obj.dateStarted
            this.oilType = obj.oilType
            this.oilAmount = `${obj.volume} ${obj.units}`
            this.description = obj.description

            this.$store.dispatch('setFatesGraphData', this.selectedData)
            EventBus.$emit('sendDataToFatesGraph', this.selectedData)

            this.zoomToScenario()
        })
    },
}
</script>

<style lang="scss" scoped></style>
