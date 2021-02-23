<template>
    <v-container grid-list-xs,sm,md,lg,xl class="pt-0 pb-0 scroll">
        <v-layout row>
            <v-flex xs12 id="exercise-container">
                <v-sheet class="pa-2 radius-0">
                    <v-select
                        hide-details
                        :items="exerciselist"
                        item-text="name"
                        item-value="id"
                        v-model="exerciseselect"
                        @change="exercisechange"
                        clearable
                        label="Exercise List"
                    ></v-select>
                </v-sheet>
                <v-card flat>
                    <v-list v-show="getEventOneList.length > 0" dense subheader>
                        <v-subheader>Event 1</v-subheader>
                        <v-list-item v-for="(feature, index) in getEventOneList" :key="index">
                            <v-list-item-action>
                                <v-checkbox
                                    v-model="eventOneArr"
                                    :value="feature.attributes.OBJECTID"
                                    @change="filterEventOneDefinition"
                                ></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content @click="feature.visible = !feature.visible">
                                <v-list-item-title>{{ feature.attributes.TYPE }}</v-list-item-title>
                                <v-list-item-subtitle
                                    >Date:
                                    {{
                                        feature.attributes.DATECR
                                            ? moment(feature.attributes.DATECR).format('YYYY-MM-DD HH:MM')
                                            : '-'
                                    }}</v-list-item-subtitle
                                >
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>

                    <v-list v-show="getEventTwoList.length > 0" dense subheader>
                        <v-subheader>Event 2</v-subheader>
                        <v-list-item v-for="(feature, index) in getEventTwoList" :key="index">
                            <v-list-item-action>
                                <v-checkbox
                                    v-model="eventTwoArr"
                                    :value="feature.attributes.OBJECTID"
                                    @change="filterEventTwoDefinition"
                                ></v-checkbox>
                            </v-list-item-action>
                            <v-list-item-content @click="feature.visible = !feature.visible">
                                <v-list-item-title>{{ feature.attributes.CATEGORY }}</v-list-item-title>
                                <v-list-item-subtitle
                                    >Date:
                                    {{
                                        feature.attributes.DATECR
                                            ? moment(feature.attributes.DATECR).format('YYYY-MM-DD HH:MM')
                                            : '-'
                                    }}</v-list-item-subtitle
                                >
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    components: {},
    data() {
        return {
            exerciseselect: null,
            exerciselist: [],
            eventOneArr: [],
            eventOneQuery: '',
            eventOneQueryDetailed: '',
            eventTwoArr: [],
            eventTwoQuery: '',
            eventTwoQueryDetailed: '',
            listitem: {
                event1: [],
                event2: [],
            },
        }
    },
    watch: {},
    methods: {
        exercisechange() {
            if (!this.exerciseselect) {
                this.listitem.event1 = []
                this.listitem.event2 = []
                return
            }
            // this.$root.$emit('emergencyselect',this.emergencyselect)
            // this.eventOneQuery = `EMERGENCY_ID = '${this.emergencyselect}'`
            // this.eventOneQuery = "EMERGENCY_ID = 'PPTSB-EX-123456789'"
            this.eventOneQuery = '1=1'
            this.eventTwoQuery = '1=1'
            this.genEventOneList()
            this.genEventTwoList()
        },
        filterEventOneDefinition() {
            if (this.eventOneArr.length) {
                let event1 = this.$store.getters.map.webmap.allLayers.items.filter((obj) => obj.title == 'Event (Point)')[0]
                event1.definitionExpression = `${this.eventOneQuery} AND OBJECTID IN (${this.eventOneArr.join(',')})`
            } else {
                let event1 = this.$store.getters.map.webmap.allLayers.items.filter((obj) => obj.title == 'Event (Point)')[0]
                event1.definitionExpression = `${this.eventOneQuery}`
            }
        },
        filterEventTwoDefinition() {
            if (this.eventTwoArr.length) {
                let event2 = this.$store.getters.map.webmap.allLayers.items.filter((obj) => obj.title == 'Event (Perimeter)')[0]
                event2.definitionExpression = `${this.eventTwoQuery} AND OBJECTID IN (${this.eventTwoArr.join(',')})`
            } else {
                let event2 = this.$store.getters.map.webmap.allLayers.items.filter((obj) => obj.title == 'Event (Perimeter)')[0]
                event2.definitionExpression = `${this.eventTwoQuery}`
            }
        },
        genEventOneList() {
            let view = this.$store.getters.map.view

            // let PPTSBFac = this.$store.getters.map.webmap.allLayers.items.filter(obj => obj.title == 'PPTSB Facility')[0]
            // PPTSBFac.visible = true
            // console.log(PPTSBFac);

            let self = this
            let event1 = this.$store.getters.map.webmap.allLayers.items.filter((obj) => obj.title == 'Event (Point)')[0]
            event1.definitionExpression = this.eventOneQuery
            event1.visible = true

            const queryParams = event1.createQuery()
            queryParams.returnGeometry = true
            queryParams.where = `${this.eventOneQuery}`

            event1.queryFeatures(queryParams).then(function(results) {
                self.listitem.event1 = results.features
                self.eventOneArr = [...results.features.map((obj) => obj.attributes.OBJECTID)]
            })

            // event1.queryExtent(queryParams).then(function(results){
            //   view.goTo(results.extent)
            // })
        },
        genEventTwoList() {
            let view = this.$store.getters.map.view

            // let PPTSBFac = this.$store.getters.map.webmap.allLayers.items.filter(obj => obj.title == 'PPTSB Facility')[0]
            // PPTSBFac.visible = true
            // console.log(PPTSBFac);

            let self = this
            let event2 = this.$store.getters.map.webmap.allLayers.items.filter((obj) => obj.title == 'Event (Perimeter)')[0]
            event2.definitionExpression = this.eventTwoQuery
            event2.visible = true

            const queryParams = event2.createQuery()
            queryParams.returnGeometry = true
            queryParams.where = `${this.eventTwoQuery}`

            event2.queryFeatures(queryParams).then(function(results) {
                self.listitem.event2 = results.features
                self.eventTwoArr = [...results.features.map((obj) => obj.attributes.OBJECTID)]
            })

            // event2.queryExtent(queryParams).then(function(results){
            //   view.goTo(results.extent)
            // })
        },
        loadData() {
            let url = `${process.env.VUE_APP_API_URL}/emergency/exercise/all`
            // console.log(url);
            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    if (res.data.length) {
                        const data = res.data
                        // console.log(data);
                        // this.data = data
                        data.forEach((obj) => {
                            this.exerciselist.push({ id: obj.id, name: obj.emergencyInfo.emergencyName })
                        })
                        // console.log(this.data);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
    },
    computed: {
        getEventOneList() {
            // return this.listitem.event1.map(obj => obj.attributes)
            return this.listitem.event1
        },
        getEventTwoList() {
            // return this.listitem.event1.map(obj => obj.attributes)
            return this.listitem.event2
        },
    },
    created() {},
    mounted() {
        this.loadData()
    },
}
</script>

<style lang="scss" scoped>
.scroll {
    height: calc(100vh - 80px);
    overflow-y: auto;
}

@media screen and (max-width: 1264px) {
    .scroll {
        height: calc(100vh - 32px);
    }
}
</style>
