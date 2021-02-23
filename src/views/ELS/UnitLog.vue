<template>
    <v-container grid-list-xl>
        <v-layout row wrap class="mb-4">
            <v-flex xs12 md4 sm3>
                <v-select
                    :items="listOfTeam"
                    item-text="text"
                    return-object
                    @change="getUserData"
                    v-model="teamSelected"
                    label="Team"
                ></v-select>
                <v-select
                    :items="userData"
                    item-text="title"
                    return-object
                    v-model="functionSelected"
                    label="Function"
                    :disabled="teamSelected == ''"
                ></v-select>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex v-if="functionSelected" text-xs-center xs12 md4 sm3>
                <h4 class="mb-0 subheading" style="text-align: center;">{{ teamSelected.text }}</h4>
                <div style="background-color: #D9272C;" class="my-2 white--text" id="box">
                    {{ functionSelected.title }}
                </div>
                <h4 v-if="functionSelected.name" style="text-align: center;" class="body-1 mb-0">{{ functionSelected.name }}</h4>
                <div v-if="functionSelected.phone" style="background-color: #FAF8F3;" class="my-2 black--text" id="box">
                    {{ functionSelected.phone }}
                </div>
            </v-flex>
            <v-flex xs12>
                <v-dialog v-model="dialog.state" max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-card-actions class="mb-3 ma-0 pa-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                v-if="functionSelected"
                                color="primaryGreen white--text"
                                small
                                class="elevation-0"
                                @click="openDialog('Add')"
                            >
                                <v-icon small dark>mdi-plus</v-icon>
                                Add
                            </v-btn>
                            <v-btn
                                v-if="functionSelected"
                                color="primaryGreen white--text"
                                small
                                class="elevation-0"
                                @click="exportDialog = true"
                            >
                                <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                                Export
                            </v-btn>
                        </v-card-actions>
                    </template>
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span v-if="dialog.type == 'Add'" class="subheading font-weight-medium">Unit Log</span>
                            <span v-if="dialog.type == 'Edit'" class="subheading font-weight-medium">Edit</span>
                        </v-card-title>
                        <!-- <v-card-title>
              <span v-if="dialog.type == 'Add'" class="headline">Issues / Event</span>
              <span v-if="dialog.type == 'Edit'" class="headline">Edit</span>
            </v-card-title> -->
                        <v-card-text>
                            <v-container class="pb-0" grid-list-xs,md>
                                <v-layout wrap>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-menu v-model="dateModal" :close-on-content-click="false" max-width="290">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    :value="editedItem.date"
                                                    clearable
                                                    label="Date"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="editedItem.date" @change="dateModal = false"></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field
                                            name="name"
                                            label="Time"
                                            v-model="editedItem.time"
                                            hide-details
                                            @keydown="validateTime"
                                            @keyup="validateTime"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 px-2>
                                        <v-text-field
                                            v-model="editedItem.event"
                                            @input="remarksAuto"
                                            label="Description"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 px-2>
                                        <v-textarea v-model="editedItem.remarks" filled label="Remarks" auto-grow></v-textarea>
                                    </v-flex>
                                </v-layout>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn small dark outlined depressed class="elevation-0" color="primaryGreen" @click="close"
                                        >Cancel</v-btn
                                    >
                                    <v-btn
                                        :loading="isLoading"
                                        small
                                        class="elevation-0"
                                        color="primaryGreen white--text"
                                        @click="submit(dialog.type)"
                                        >OK</v-btn
                                    >
                                </v-card-actions>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-card>
                    <v-data-table
                        :headers="headers"
                        :items="dataDetails"
                        :sort-by="['dateCr']"
                        :sort-desc="[true, false]"
                        must-sort
                        class="elevation-0"
                    >
                        <template v-slot:header.dateCr>
                            <button @click="toggleSortState">Date / Time</button>
                        </template>
                        <template v-slot:item.dateCr="{ item }">
                            {{ toDateTime(item.dateCr) }}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <template v-if="userCanPerformAction">
                                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                                <v-icon :loading="isLoading" small @click="deleteItem(item.id)">mdi-delete</v-icon>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="exportDialog" max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Export</span>
                </v-card-title>
                <v-card-text>
                    <v-container class="pb-0" grid-list-xs,md>
                        <v-text-field v-model="exportFileName" class="pb-2" label="File Name"></v-text-field>
                        <span class="subheading font-weight-medium">Save as type:</span>
                        <v-checkbox v-model="exportPDF" hide-details label="PDF"></v-checkbox>
                        <v-checkbox v-model="exportExcel" hide-details label="Excel"></v-checkbox>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                dark
                                outlined
                                depressed
                                class="elevation-0"
                                color="primaryGreen"
                                @click="exportDialog = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                :loading="isLoading"
                                small
                                class="elevation-0"
                                color="primaryGreen white--text"
                                @click="exportFile"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog persistent v-model="delDialog" max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Delete</span>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this event?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small dark outlined depressed class="elevation-0" color="primaryGreen" @click="delDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn :loading="isLoading" small class="elevation-0" color="primaryGreen white--text" @click="getDeleteData"
                        >OK</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import XLSX from 'xlsx'

export default {
    data() {
        return {
            disabled: 0,
            asc: false,
            isLoading: false,
            rowPerPage: [25, 50, 75, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
            listOfTeam: [
                { text: 'Emergency Response Team', code: 'ERT' },
                { text: 'Emergency Management Team', code: 'EMT' },
                { text: 'Business Crisis Management Team', code: 'BCMT' },
                { text: 'PETRONAS Group Crisis Management Team', code: 'PCMT' },
            ],
            teamSelected: '',
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            exportFileName: '',
            userData: null,
            listOfFunction: ['Incident Commander'],
            functionSelected: '',
            editedIndex: -1,
            currEmergencyTeam: 'Emergency Response Team',
            emergencyTeams: ['Emergency Response Team', 'Emergency Management Team', 'Business Crisis Management Team'],
            currTeamTypeIndex: 0,
            dialog: {
                state: false,
                type: '',
            },
            delDialog: false,
            dateModal: false,
            timeModal: false,
            deleteId: null,
            addLines: true,
            editedItem: {
                date: new Date().toISOString().substr(0, 10),
                time: moment().format('HH:mm'),
                dateCr: '',
                event: '',
                remarks: '',
            },
            sortBy: 'dateCr',
            descending: false,
            headers: [
                { text: 'Date & Time', align: 'left', value: 'dateCr', sortable: true },
                { text: 'Issues / Event', align: 'left', value: 'event', sortable: false },
                { text: 'Remarks', align: 'left', value: 'remarks', sortable: false },
                { text: 'Action', align: 'left', value: 'action', sortable: false },
            ],
            dataDetails: [],
        }
    },
    watch: {
        functionSelected(val) {
            this.getData()
        },
    },
    methods: {
        toggleSortState() {
            this.asc = !this.asc
        },
        validateTime(evt) {
            this.validate24HourFormat(evt, this.editedItem.time)
        },
        toDateTime(date) {
            return moment(date).format('DD-MMM-YYYY HH:mm:ss')
        },
        exportFile() {
            if (this.exportPDF && this.exportExcel) {
                this.generatePDF()
                this.generateExcel()
            } else if (this.exportPDF) {
                this.generatePDF()
            } else if (this.exportExcel) {
                this.generateExcel()
            }
            this.exportDialog = false
        },
        generateExcel() {
            let forExcel = []
            let sortedArrayData
            if (this.asc) {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
            }
            console.log(sortedArrayData)
            sortedArrayData.forEach((el, index) => {
                forExcel.push({
                    No: `${index + 1}`,
                    'Date & Time': this.toDateTime(el.dateCr),
                    'Event / Action': el.event,
                    Remarks: el.remarks,
                })
            })

            let userData = [
                { A: 'Team:', B: this.teamSelected.text },
                { A: 'Function:', B: this.functionSelected.title },
                { A: 'Name:', B: this.functionSelected.name },
                { A: 'Contact No:', B: this.functionSelected.phone },
            ]

            // Only array possible

            // User data
            var jsonData = XLSX.utils.json_to_sheet(userData, { skipHeader: true, origin: 'A1' })

            // Insert other table in same sheet
            XLSX.utils.sheet_add_json(jsonData, forExcel, { skipHeader: false, origin: 'A6' })

            // A workbook is the name given to an Excel file
            var wb = XLSX.utils.book_new()

            // add Worksheet to Workbook
            XLSX.utils.book_append_sheet(wb, jsonData, 'data')

            // export Excel file
            XLSX.writeFile(wb, `${this.exportFileName}.xlsx`)
        },
        generatePDF() {
            let header = []

            this.headers.forEach((el) => {
                if (el.text != 'Action') {
                    header.push({ text: el.text, style: 'tableHeader' })
                }
            })

            let dataTable = []
            let sortedArrayData

            if (this.asc) {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
            }

            sortedArrayData.forEach((el, index) => {
                dataTable[index] = [this.toDateTime(el.dateCr), el.event, el.remarks]
            })

            var pdfMake = require('pdfmake/build/pdfmake.js')
            if (pdfMake.vfs == undefined) {
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs
            }
            var docDefinition = {
                pageOrientation: 'landscape',
                pageSize: 'A4',
                content: [
                    {
                        text: this.teamSelected.text,
                        style: 'header',
                    },
                    {
                        text: `Function: ${this.functionSelected.title}`,
                        style: 'subheader',
                    },
                    {
                        text: `Name: ${this.functionSelected.name}`,
                        style: 'subheader',
                    },
                    {
                        text: `Contact no: ${this.functionSelected.phone}`,
                        style: 'subheader',
                    },
                    {
                        text: '',
                        style: 'spacer',
                    },
                    {
                        // layout: 'lightHorizontalLines', // optional
                        table: {
                            // widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
                            body: [header, ...dataTable],
                        },
                    },
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                    },
                    spacer: {
                        margin: [0, 0, 0, 10],
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                    },
                },
            }
            pdfMake.createPdf(docDefinition).download(`${this.exportFileName}.pdf`)
        },
        remarksAuto() {
            let temp = `${this.editedItem.event} at ${this.editedItem.date} ${this.editedItem.time}`

            if (this.editedItem.event) {
                if (this.addLines == true) {
                    this.editedItem.remarks = this.editedItem.remarks + temp
                    this.addLines = false
                } else {
                    let lines = this.editedItem.remarks.substring(this.editedItem.remarks.lastIndexOf('\n') + 1, -1)
                    this.editedItem.remarks = lines + temp
                }
            }
        },
        getData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/unitlog/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.addLines = true
                    this.dataDetails = response.data.filter((item) => {
                        return item.orgChartId == this.functionSelected.id
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getUserData() {
            this.functionSelected = ''
            const [id, timestamp] = this.$route.params.id.split('-')
            axios
                .get(`${process.env.VUE_APP_API_URL}/organization/${this.$route.params.id}?team=${this.teamSelected.code}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    this.userData = response.data
                    // this.addLines = true
                    // console.log(response.data)
                    // this.dataDetails = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        postAddData() {
            this.editedItem.dateCr = `${this.editedItem.date} ${this.editedItem.time}`

            const id = `${this.$route.params.id}-${Date.now()}`
            const emergencyId = this.$route.params.id
            const payload = {
                id: id,
                orgChartId: this.functionSelected.id,
                emergencyId: emergencyId,
                dateCr: momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'),
                event: this.editedItem.event,
                remarks: this.editedItem.remarks,
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/unitlog/add`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.isLoading = false
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })
        },
        postEditData() {
            this.editedItem.dateCr = `${this.editedItem.date} ${this.editedItem.time}`

            const payload = {
                id: this.editedItem.id,
                orgChartId: this.functionSelected.id,
                emergencyId: this.editedItem.emergencyId,
                dateCr: momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'),
                event: this.editedItem.event,
                remarks: this.editedItem.remarks,
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/unitlog/edit`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.isLoading = false
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })
        },
        submit(type) {
            if (type == 'Add') {
                this.postAddData()
            } else {
                this.postEditData()
            }
            this.close()
        },
        editItem(item) {
            this.editedIndex = this.dataDetails.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.editedItem.date = moment(item.dateCr).format('YYYY-MM-DD')
            this.editedItem.time = moment(item.dateCr).format('HH:MM')
            if (item.remarks) this.editedItem.remarks = item.remarks + '\n'
            else this.editedItem.remarks = ''
            this.editedItem.event = item.event
            this.openDialog('Edit')
        },
        getDeleteData() {
            this.isLoading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/unitlog/delete/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.deleteId = null
                    this.isLoading = false
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })

            this.delDialog = false
        },
        deleteItem(id) {
            this.deleteId = id
            this.delDialog = true
        },
        openDialog(type) {
            this.dialog.type = type
            this.dialog.state = true
        },
        close() {
            this.dialog.state = false
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.dataDetails)
                this.editedIndex = -1
                this.editedItem.date = new Date().toISOString().substr(0, 10)
                this.editedItem.time = moment().format('HH:mm')
                this.editedItem.remarks = ''
            }, 300)
        },
    },
    computed: {},
    mounted() {
        this.exportFileName = this.$route.params.id
        this.getData()
    },
}
</script>

<style lang="scss" scoped>
#box {
    border-radius: 1px;
    text-align: center;
    width: auto;
    height: 35px;
    line-height: 35px;
}
</style>
