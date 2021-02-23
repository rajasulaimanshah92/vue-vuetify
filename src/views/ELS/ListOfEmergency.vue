<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-layout row wrap>
                        <v-flex v-show="false" xs3>
                            <div id="filter" class="hidden-sm-and-down">
                                <v-container fluid grid-list-xl>
                                    <v-layout wrap align-center>
                                        <v-flex xs12 d-flex class="pt-1 pb-1">
                                            <v-select
                                                color="primaryGreen"
                                                v-model="selectedDateRange"
                                                :items="dateRange"
                                                label="Date range"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 class="pt-1 pb-1">
                                            <v-menu v-model="dateFrom.active" :close-on-content-click="false" max-width="290">
                                                <v-text-field
                                                    :value="computedDateFormattedMomentjs(dateFrom.date)"
                                                    slot="activator='{ on }'"
                                                    :label="dateFrom.label"
                                                    prepend-icon="event"
                                                    readonly
                                                ></v-text-field>
                                                <v-date-picker
                                                    v-model="dateFrom.date"
                                                    :min="dateMin"
                                                    :max="dateMax"
                                                    @change="setDate(dateFrom)"
                                                ></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                        <v-flex xs12 class="pt-1 pb-1">
                                            <v-menu v-model="dateTo.active" :close-on-content-click="false" max-width="290">
                                                <v-text-field
                                                    :value="computedDateFormattedMomentjs(dateTo.date)"
                                                    slot="activator='{ on }'"
                                                    :label="dateTo.label"
                                                    prepend-icon="event"
                                                    readonly
                                                ></v-text-field>
                                                <v-date-picker
                                                    v-model="dateTo.date"
                                                    :min="dateFrom.date"
                                                    :max="dateMax"
                                                    @change="setDate(dateTo)"
                                                ></v-date-picker>
                                            </v-menu>
                                        </v-flex>
                                        <v-flex xs12 d-flex class="pt-1 pb-1">
                                            <v-select
                                                color="primaryGreen"
                                                v-model="selectedType"
                                                :items="type"
                                                label="Type"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 d-flex class="pt-1 pb-1">
                                            <v-select
                                                color="primaryGreen"
                                                v-model="selectedResponseTier"
                                                :items="responseTier"
                                                label="Response Tier"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 d-flex class="pt-1 pb-1">
                                            <v-select
                                                color="primaryGreen"
                                                v-model="selectedTypeOfEmergency"
                                                :items="typeOfEmergency"
                                                label="Type of Emergency"
                                            ></v-select>
                                        </v-flex>
                                        <v-flex xs12 d-flex class="pt-1 pb-1">
                                            <v-select
                                                color="primaryGreen"
                                                v-model="selectedLocation"
                                                :items="location"
                                                label="Location"
                                            ></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-container>
                            </div>
                        </v-flex>
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
                                        <template v-slot:item.type="{ item }">
                                            <v-btn small dark depressed :color="item.type === 'Exercise' ? 'green' : 'orange'">{{
                                                item.type
                                            }}</v-btn>
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
                                        <template v-slot:no-data>
                                            <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                                        </template>
                                    </v-data-table>
                                </v-container>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Delete</span>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this item?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small depressed outlined class="caption mr-2" color="primaryGreen" @click="deleteDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn small depressed class="caption" color="primaryGreen white--text" @click="deleteApi()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
    data() {
        return {
            eventMode: 'emergency',
            page: 1,
            itemsPerPage: 10,
            deleteDialog: false,
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
                // {
                //     text: 'No',
                //     align: 'left',
                //     sortable: false,
                //     value: 'no'
                // },
                { text: 'Date', value: 'date' },
                { text: 'Time', value: 'time' },
                { text: 'Emergency Name', value: 'emergencyName' },
                { text: 'Tier', align: 'center', value: 'tier' },
                { text: 'Type of Emergency', value: 'typeOfEmergency' },
                { text: 'Location', value: 'location' },
                { text: 'Type', align: 'center', value: 'type' },
                { text: 'Map', value: 'map', align: 'center', sortable: false },
                { text: 'Action', value: 'delete', align: 'center', sortable: false },
                // { text: 'Close Case', value: 'isClosed', sortable: false },
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
        generatePDF() {
            var pdfMake = require('pdfmake/build/pdfmake.js')
            if (pdfMake.vfs == undefined) {
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs
            }
            var docDefinition = {
                content: [
                    {
                        layout: 'lightHorizontalLines', // optional
                        table: {
                            // headers are automatically repeated if the table spans over multiple pages
                            // you can declare how many rows should be treated as headers
                            headerRows: 1,
                            widths: ['*', 'auto', 100, '*'],
                            body: [
                                ['First', 'Second', 'Third', 'The last one'],
                                ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
                                [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
                            ],
                        },
                    },
                ],
            }
            pdfMake.createPdf(docDefinition).download('optionalName.pdf')
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
            let url
            if (this.eventMode === 'emergency') url = `${process.env.VUE_APP_API_URL}/emergency/emergency/all`
            else url = `${process.env.VUE_APP_API_URL}/emergency/exercise/all`

            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
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
                    // let tempType = el.natureOfEmergency.hsseAndProcessSafety.hsseType.split(",")
                })
                .catch((error) => console.log(error))
        },
        openDeleteDialog(itemId) {
            this.deleteId = itemId
            this.deleteDialog = true
        },
        deleteApi() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/emergency/delete/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.deleteId = null
                    this.getListApi()
                })
                .catch((error) => {
                    console.log(error)
                })
            this.deleteDialog = false
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
    },
    created() {
        this.eventMode = this.$route.query.mode
        console.log(this.eventMode)
    },
    mounted() {
        if (this.eventMode === 'exercise') {
            const [date, time, emergencyName, tier, typeOfEmergency, location, type, map, action] = this.headers
            emergencyName.text = 'Exercise Name'
            typeOfEmergency.text = 'Type of Exercise'
        }
        this.getListApi()
        let type = this.$route.query.mode
        if (type) {
            this.selectedType = type.charAt(0).toUpperCase() + type.slice(1)
        }
    },
}
</script>

<style lang="scss" scoped>
#filter {
    // float: left;
    // width: 260px;
    border-right: 1px solid #ccc;
}

#emergency-list {
    // float: left;
    // width: calc(100% - 300px);
}
</style>
