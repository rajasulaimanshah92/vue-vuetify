<template lang="">
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs6>
                <h4>Exercise Archive: {{ facilityName }}</h4>
            </v-flex>
            <v-spacer></v-spacer>
            <v-btn text @click="gotoPage('/datamanagement/facilitylist')">
                <v-icon color="gray">mdi-arrow-left</v-icon>
                Back to Facility List
            </v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-flex xs12 md12>
                        <div id="emergency-list">
                            <v-container fluid grid-list-xl class="pt-0 px-2">
                                <v-card-title class="pt-0">
                                    <v-spacer v-if="$vuetify.breakpoint.mdAndUp"></v-spacer>
                                    <v-text-field
                                        v-model="search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                        hide-details
                                    ></v-text-field>
                                </v-card-title>
                                <v-data-table
                                    :headers="headers"
                                    :items="filteredLists"
                                    :page.sync="page"
                                    :items-per-page="itemsPerPage"
                                    :search="search"
                                    :sort-by="['date']"
                                    :sort-desc="[true, false]"
                                    must-sort
                                    :footer-props="{
                                        'items-per-page-options': [10, 20, 30, -1],
                                    }"
                                >
                                    <template v-slot:item.no="{ item }">{{ filteredLists.indexOf(item) + 1 }}</template>
                                    <template v-slot:item.date="{ item }">{{
                                        computedDateFormattedMomentjs(item.date)
                                    }}</template>
                                    <template v-slot:item.emergencyName="{ item }">
                                        <a v-if="item.read" @click="setEmergencyName(item.emergencyName, item.emergencyID)">{{
                                            item.emergencyName
                                        }}</a>
                                        <span v-else>{{ item.emergencyName }}</span>
                                    </template>
                                    <template v-slot:item.typeOfEmergency="{ item }">
                                        {{ item.typeOfEmergency | convertNullToDash }}
                                    </template>
                                    <template v-slot:item.tier="{ item }">
                                        <v-btn small dark depressed :color="tierColour(item.tier)">{{ item.tier }}</v-btn>
                                    </template>
                                    <template v-slot:item.map="{ item }">
                                        <v-btn text icon @click="accessMap(item.emergencyID)" color="grey">
                                            <v-icon small>mdi-map</v-icon>
                                        </v-btn>
                                    </template>
                                    <template v-slot:item.delete="{ item }">
                                        <v-btn
                                            v-if="item.delete"
                                            text
                                            icon
                                            @click="openDeleteDialog(item.emergencyID)"
                                            color="grey"
                                        >
                                            <v-icon small>mdi-delete</v-icon>
                                        </v-btn>
                                        <span v-else>-</span>
                                    </template>
                                    <template v-slot:no-data v-if="loadExerciseArchive">
                                        <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </div>
                    </v-flex>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    data() {
        return {
            id: this.$route.params.id,
            facilityInfo: [],
            loadExerciseArchive: false,
            page: 1,
            itemsPerPage: 10,
            deleteId: null,
            selectedDateRange: 'All',
            selectedResponseTier: 'All',
            selectedType: 'All',
            selectedTypeOfEmergency: 'All',
            selectedLocation: 'All',
            dateRange: ['All', 'Today', 'This Month', 'Previous Month', 'This Year', 'Previous Year'],
            responseTier: ['All', 'Tier 1', 'Tier 2', 'Tier 3'],
            type: ['All', 'Emergency', 'Exercise'],
            typeOfEmergency: ['All', 'LOPC (Gas)', 'Fire', 'HAZMAT'],
            location: ['All', 'Pengerang', 'Paka'],
            dateFrom: {
                active: false,
                label: 'Date From:',
                date: new Date().toISOString().substr(0, 10),
            },
            dateTo: {
                active: false,
                label: 'Date To:',
                date: new Date().toISOString().substr(0, 10),
            },
            dateMin: null,
            dateMax: null,
            search: '',
            headers: [
                { text: 'Date', value: 'date' },
                { text: 'Time', value: 'time' },
                { text: 'Exercise Name', value: 'emergencyName' },
                { text: 'Tier', align: 'center', value: 'tier' },
                { text: 'Type of Emergency', value: 'typeOfEmergency' },
                { text: 'Location', value: 'location' },
                { text: 'Map', value: 'map', align: 'center', sortable: false },
            ],
            emergencyLists: [],
        }
    },
    methods: {
        accessMap(emergencyID) {
            this.gotoPage(`/statusboard/map/${emergencyID}`)
        },
        tierColour(tier) {
            if (tier == 'Tier 1') {
                return 'green'
            } else if (tier == 'Tier 2') {
                return 'orange'
            } else if (tier == 'Tier 3') {
                return 'red'
            }
        },
        computedDateFormattedMomentjs(selectedDate) {
            return selectedDate ? moment(selectedDate).format('Do MMMM YYYY') : ''
        },
        computedTimeFormattedMomentjs(selectedTime) {
            return selectedTime ? moment(selectedTime).format('HH:mm:ss') : ''
        },
        setDate(menu) {
            menu.active = false
        },
        setEmergencyName(name, id) {
            this.gotoPage(`/statusboard/incidentfacts/${id}`)
            this.$store.dispatch('setEmergencyID', id)
            this.$store.dispatch('setEmergencyName', name)
            localStorage.setItem('emergencyInfo', JSON.stringify({ id: id, name: name }))
        },
        filteredDate() {
            return this.emergencyLists.filter((list) => {
                switch (this.selectedDateRange) {
                    case 'Today':
                        this.dateMin = moment().format('YYYY-MM-DD')
                        this.dateMax = moment().format('YYYY-MM-DD')
                        this.dateFrom.date = this.dateMin
                        this.dateTo.date = this.dateMax
                        return moment(list.date).isSame(moment(), 'day')
                        break
                    case 'This Month':
                        this.dateMin = moment()
                            .startOf('month')
                            .format('YYYY-MM-DD')
                        this.dateMax = moment()
                            .endOf('month')
                            .format('YYYY-MM-DD')
                        this.dateFrom.date = this.dateMin
                        this.dateTo.date = this.dateMax
                        return moment(list.date).isSame(moment(), 'month')
                        break
                    case 'Previous Month':
                        this.dateMin = moment()
                            .subtract(1, 'month')
                            .startOf('month')
                            .format('YYYY-MM-DD')
                        this.dateMax = moment()
                            .subtract(1, 'month')
                            .endOf('month')
                            .format('YYYY-MM-DD')
                        this.dateFrom.date = this.dateMin
                        this.dateTo.date = this.dateMax
                        return moment(list.date).isSame(moment().subtract(1, 'month'), 'month')
                        break
                    case 'This Year':
                        this.dateMin = moment()
                            .startOf('year')
                            .format('YYYY-MM-DD')
                        this.dateMax = moment()
                            .endOf('year')
                            .format('YYYY-MM-DD')
                        this.dateFrom.date = this.dateMin
                        this.dateTo.date = this.dateMax
                        return moment(list.date).isSame(moment(), 'year')
                        break
                    case 'Previous Year':
                        this.dateMin = moment()
                            .subtract(1, 'year')
                            .startOf('year')
                            .format('YYYY-MM-DD')
                        this.dateMax = moment()
                            .subtract(1, 'year')
                            .endOf('year')
                            .format('YYYY-MM-DD')
                        this.dateFrom.date = this.dateMin
                        this.dateTo.date = this.dateMax
                        return moment(list.date).isSame(moment().subtract(1, 'year'), 'year')
                        break
                    default:
                        this.dateMin = null
                        this.dateMax = null
                        return list.date
                }
            })
        },
        getListApi() {
            this.loadExerciseArchive = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/emergency/exercise/archived/${this.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.loadExerciseArchive = false
                    let tempArray = []
                    console.log(response)
                    // this.emergencyLists = response.data
                    response.data.forEach((el) => {
                        tempArray.push({
                            no: tempArray.length,
                            emergencyID: el.emergencyInfo.emergencyDataId,
                            date: moment(el.emergencyInfo.dateCr).format('YYYY-MM-DD'),
                            time: moment(el.emergencyInfo.dateCr).format('HH:mm:ss'),
                            emergencyName: el.emergencyInfo.emergencyName,
                            tier: 'Tier ' + el.emergencyInfo.responseTierData,
                            typeOfEmergency:
                                el.natureOfEmergency.hsseAndProcessSafety.hsseType == null
                                    ? 'null'
                                    : el.natureOfEmergency.hsseAndProcessSafety.hsseType.split(',')[0],
                            location: el.emergencyInfo.location,
                            type: el.emergencyInfo.mode.charAt(0).toUpperCase() + el.emergencyInfo.mode.slice(1),
                            read: el.read,
                            delete: el.delete,
                        })
                    })
                    this.emergencyLists = tempArray
                    this.location = ['All', ...new Set(tempArray.map((obj) => obj.location))]
                    this.typeOfEmergency = ['All', ...new Set(tempArray.map((obj) => obj.typeOfEmergency))]
                    // console.log(this.location);
                    // let tempType = el.natureOfEmergency.hsseAndProcessSafety.hsseType.split(",")
                })
                .catch((error) => {
                    this.loadExerciseArchive = false
                    console.log(error)
                })
        },
        openDeleteDialog(itemId) {
            this.deleteId = itemId
        },
    },
    computed: {
        filteredLists() {
            if (
                this.selectedResponseTier === 'All' &&
                this.selectedTypeOfEmergency === 'All' &&
                this.selectedLocation === 'All' &&
                this.selectedType === 'All'
            ) {
                return this.filteredDate()
            } else {
                return this.filteredDate().filter((list) => {
                    return (
                        (this.selectedResponseTier === 'All' || list.tier === this.selectedResponseTier) &&
                        (this.selectedTypeOfEmergency === 'All' || list.typeOfEmergency === this.selectedTypeOfEmergency) &&
                        (this.selectedLocation === 'All' || list.location === this.selectedLocation) &&
                        (this.selectedType === 'All' || list.type === this.selectedType)
                    )
                })
            }
        },
        facilityName() {
            if (this.facilityInfo.length) {
                const [facility] = this.facilityInfo
                return facility.facilityName
            } else {
                return ''
            }
        },
    },
    mounted() {
        this.getListApi()
        let type = this.$route.query.mode
        if (type) {
            this.selectedType = type.charAt(0).toUpperCase() + type.slice(1)
        }
        axios
            .get(`${process.env.VUE_APP_API_URL}/facility/${this.id}`, {
                headers: {
                    Authorization: 'Bearer ' + this.$store.getters.user.token,
                },
            })
            .then((response) => {
                console.log(response.data)
                this.facilityInfo = response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
}
</script>

<style lang="scss" scoped></style>
