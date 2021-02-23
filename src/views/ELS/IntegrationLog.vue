<template>
    <v-container grid-list-xl>
        <v-layout row wrap class="mb-4 mt-1">
            <v-flex xs12>
                <v-card-actions class="mb-5">
                    <v-text-field
                        class="pt-0 mt-0"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-btn
                        v-if="userCanPerformAction"
                        small
                        color="primaryGreen white--text"
                        class="pb-0 elevation-0"
                        @click="exportDialog = true"
                    >
                        <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                        Export
                    </v-btn>
                </v-card-actions>
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
                        <template v-slot:item.logger="{ item }">
                            <v-chip :style="loggerColour(item.logger)" dark>{{ item.logger }}</v-chip>
                        </template>
                        <template v-slot:item.status="{ item }">
                            <v-chip v-if="statusColour(item.status)" :style="statusColour(item.status)" dark>{{
                                item.status
                            }}</v-chip>
                        </template>
                        <template v-slot:item.remarks="{ item }">
                            <ul v-for="item in stringToList(item.remarks)">
                                <li>{{ item }}</li>
                            </ul>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
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
                                <v-btn small class="elevation-0" color="primaryGreen white--text" @click="exportFile">OK</v-btn>
                            </v-card-actions>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'
import moment from 'moment'

export default {
    data() {
        return {
            asc: false,
            Datas: {
                // We will make a Workbook contains 2 Worksheets
                animals: [
                    { name: 'cat', category: 'animal' },
                    { name: 'dog', category: 'animal' },
                    { name: 'pig', category: 'animal' },
                ],
                pokemons: [
                    { name: 'pikachu', category: 'pokemon' },
                    { name: 'Arbok', category: 'pokemon' },
                    { name: 'Eevee', category: 'pokemon' },
                ],
            },
            search: '',
            pagination: {
                sortBy: 'dateCr',
                descending: false,
            },
            rowPerPage: [25, 35, 45, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
            currEmergencyTeam: 'Emergency Response Team',
            emergencyTeams: ['Emergency Response Team', 'Emergency Management Team', 'Business Crisis Management Team'],
            currTeamTypeIndex: 0,
            exportFileName: '',
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            editedItem: {
                dateCr: '',
                logger: '',
                event: '',
                status: '',
                pic: '',
                from: '',
                to: '',
                remarks: '',
            },
            sortBy: 'dateCr',
            descending: false,
            headers: [
                { text: 'Date & Time', align: 'left', value: 'dateCr', sortable: true },
                { text: 'Logger', align: 'left', value: 'logger', sortable: true },
                { text: 'Event / Action', align: 'left', value: 'event', sortable: true },
                { text: 'Status', align: 'left', value: 'status', sortable: true },
                { text: 'Person-in-Charge', align: 'left', value: 'pic', sortable: true },
                { text: 'From', align: 'left', value: 'from', sortable: true },
                { text: 'To', align: 'left', value: 'to', sortable: true },
                { text: 'Remarks', align: 'left', value: 'remarks', sortable: false },
            ],
            dataDetails: [],
        }
    },
    methods: {
        toggleSortState() {
            this.asc = !this.asc
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
                    No: index + 1,
                    'Date & Time': this.toDateTime(el.dateCr),
                    Logger: el.logger,
                    'Event / Action': el.event,
                    Status: el.status,
                    'Person-in-Charge': el.pic,
                    From: el.from,
                    To: el.to,
                    Remarks: el.remarks,
                })
            })

            // Only array possible
            var jsonData = XLSX.utils.json_to_sheet(forExcel)

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
                header.push({ text: el.text, style: 'tableHeader' })
            })

            let dataTable = []
            //sort
            let sortedArrayData
            if (this.asc) {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
            }
            console.log(sortedArrayData)

            sortedArrayData.forEach((el, index) => {
                dataTable[index] = [
                    this.toDateTime(el.dateCr),
                    el.logger,
                    el.event,
                    el.status,
                    el.pic,
                    el.from,
                    el.to,
                    el.remarks,
                ]
            })

            // console.log(dataTable);

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
                        margin: [0, 10, 0, 5],
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
        loggerColour(type) {
            if (type == 'ERT') {
                return 'background-color: #42A5F5; color: white'
            } else if (type == 'EMT') {
                return 'background-color: #96CF40; color: black'
            } else if (type == 'BCMT') {
                return 'background-color: #2E75B5; color: white'
            } else if (type == 'PCMT') {
                return 'background-color: #00B1A9; color: white'
            }
        },
        statusColour(type) {
            if (type == 'Not Started') {
                return 'background-color: grey; color: white'
            } else if (type == 'On-going') {
                return 'background-color: #96CF40; color: black'
            } else if (type == 'Completed') {
                return 'background-color: #42A5F5; color: white'
            } else if (type == 'Canceled') {
                return 'background-color: red; color: white'
            } else {
                return null
            }
        },
        getData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/integrationlog/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    this.dataDetails = response.data
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                })
        },
    },
    mounted() {
        this.exportFileName = this.$route.params.id
        this.getData()
    },
}
</script>

<style lang="scss" scoped>
#box {
    border-radius: 4px;
    text-align: center;
    width: 90px;
    height: 30px;
    line-height: 30px;
}
</style>
