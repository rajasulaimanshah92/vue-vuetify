<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <v-row>
                    <v-col cols="12" sm="12" class="text-center pt-0 pb-0">
                        <v-btn-toggle mandatory>
                            <v-btn text @click="toggleTable('internal')">Internal</v-btn>
                            <v-btn text @click="toggleTable('external')" class="ml-0">External</v-btn>
                        </v-btn-toggle>
                    </v-col>
                </v-row>
                <v-dialog v-model="dialog" max-width="600px" class="d-block">
                    <template v-slot:activator="{ on }">
                        <v-card-actions class="ma-0 pa-0 mb-5">
                            <v-text-field
                                class="mr-2"
                                v-model="search"
                                label="Search"
                                append-icon="mdi-magnify"
                                clearable
                                hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>
                            <template v-if="userCanPerformAction">
                                <v-btn color="primaryGreen white--text" small class="mt-3 elevation-0" @click="addData">
                                    <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                                    Add
                                </v-btn>
                                <v-btn
                                    color="primaryGreen white--text"
                                    small
                                    class="mt-3 elevation-0"
                                    @click="exportDialog = true"
                                >
                                    <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                                    Export
                                </v-btn>
                            </template>
                        </v-card-actions>
                    </template>
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">{{ formTitle }} </span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text v-if="internal == false" class="pa-0">
                            <v-container grid-list-md>
                                <v-layout wrap row>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="editedItem.description"
                                            label="Resources Description"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-select v-model="editedItem.status" label="Status" :items="statusItems"></v-select>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field v-model="editedItem.location" label="Location"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field
                                            name="name"
                                            label="Time"
                                            v-model="editedItem.availability"
                                            hide-details
                                            @keydown="validateTime"
                                            @keyup="validateTime"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-menu v-model="dateModal" :close-on-content-click="false" max-width="290">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    :value="editedItem.dateCr"
                                                    clearable
                                                    label="Date"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="editedItem.dateCr"
                                                @change="dateModal = false"
                                            ></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-spacer></v-spacer>
                                    <v-flex xs6>
                                        <v-text-field v-model="editedItem.agencies" label="Agencies"></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field v-model="editedItem.contactNo" label="Contact No"></v-text-field>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field v-model="editedItem.personInCharge" label="Person-In-Charge"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn small dark outlined depressed class="elevation-0" color="primaryGreen" @click="close"
                                    >Cancel</v-btn
                                >
                                <v-btn :loading="isLoading" small dark depressed color="primaryGreen" @click="postResourcesData"
                                    >OK</v-btn
                                >
                            </v-card-actions>
                        </v-card-text>
                        <v-card-text v-else class="pa-0">
                            <v-container grid-list-md>
                                <v-layout wrap row>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="editedInternalItem.description"
                                            label="Resources Description"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field
                                            name="name"
                                            label="Time"
                                            v-model="editedInternalItem.availability"
                                            hide-details
                                            @keydown="validateTime"
                                            @keyup="validateTime"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-menu v-model="dateModal" :close-on-content-click="false" max-width="290">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    :value="editedInternalItem.dateCr"
                                                    clearable
                                                    label="Date"
                                                    readonly
                                                    v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="editedInternalItem.dateCr"
                                                @change="dateModal = false"
                                            ></v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-select
                                            v-model="editedInternalItem.status"
                                            label="Status"
                                            :items="statusItems"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs6>
                                        <v-text-field v-model="editedInternalItem.location" label="Location"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="editedInternalItem.personInCharge"
                                            label="Person-in-Charge"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn small dark outlined depressed color="primaryGreen" @click="close">Cancel</v-btn>
                                <v-btn
                                    :loading="isLoading"
                                    small
                                    dark
                                    depressed
                                    color="primaryGreen"
                                    @click="postResourcesInternalData"
                                    >Save</v-btn
                                >
                            </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-layout row wrap>
                    <v-flex xs12 auto>
                        <v-data-table
                            :headers="tableHeaderData"
                            :items="resourcesTableData"
                            :search="search"
                            :sort-by="['dateCr']"
                            :sort-desc="[true, false]"
                            must-sort
                            class="elevation-1"
                            :loading="loading"
                            loading-text="Loading... Please wait"
                            :footer-props="{
                                'items-per-page-options': [10, 20, 30, -1],
                            }"
                        >
                            <template v-slot:header.dateCr>
                                <button @click="toggleSortState">Date</button>
                            </template>
                            <template v-slot:item.dateCr="{ item }">{{ toDateTime(item.dateCr) }}</template>
                            <template v-slot:item.actions="props">
                                <template v-if="userCanPerformAction">
                                    <v-icon small class="mr-2" @click="editResourcesData(props.item)">mdi-pencil</v-icon>
                                    <v-icon small text @click="deleteItem(props.item.id)">mdi-delete</v-icon>
                                </template>
                                <span v-else>-</span>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
                <v-dialog persistent v-model="delDialog" max-width="500px">
                    <v-card class="pa-3">
                        <v-card-title>
                            <span class="headline">Delete</span>
                        </v-card-title>
                        <v-card-text>
                            Are you sure you want to delete this ?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small dark outlined depressed color="primaryGreen" @click="close">Cancel</v-btn>
                            <v-btn :loading="isLoading" small color="primaryGreen white--text" @click="deleteResourcesData()"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog persistent v-model="exportDialog" max-width="600px">
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
                                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="exportFile"
                                        >OK</v-btn
                                    >
                                </v-card-actions>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'
import moment from 'moment'
import momentTZ from 'moment-timezone'

export default {
    data() {
        return {
            asc: false,
            isLoading: false,
            loading: false,
            search: '',
            date: new Date().toISOString().substr(0, 10),
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            exportFileName: '',
            emergencyName: '',
            emergencyLocation: '',
            emergencyDetails: null,
            timeMenu1: false,
            timeMenu2: false,
            dateModal: false,
            pagination: {
                page: 1,
                itemsPerPage: 10,
            },
            action: '',
            delSelected: '',
            rowsPerPage: [10, 20, 30, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
            delDialog: false,
            addNew: false,
            text: 'Internal',
            internal: true,
            editedIndex: -1,
            dialog: false,
            resourcesTableData: [],
            editedItem: {
                type: 'External',
                description: '',
                dateCr: new Date().toISOString().substr(0, 10),
                availability: moment().format('HH:mm'),
                status: '',
                location: '',
                agencies: '',
                personInCharge: '',
                contactNo: '',
            },
            editedInternalItem: {
                type: 'Internal',
                dateCr: new Date().toISOString().substr(0, 10),
                description: '',
                availability: moment().format('HH:mm'),
                status: '',
                location: '',
                personInCharge: '',
            },
            internalHeaders: [
                { text: 'Description', align: 'left', value: 'description' },
                { text: 'Type', align: 'left', value: 'type' },
                { text: 'Date', align: 'left', value: 'dateCr' },
                { text: 'Availability Time', align: 'left', value: 'availability' },
                { text: 'Status', align: 'left', value: 'status' },
                { text: 'Location', align: 'left', value: 'location' },
                { text: 'Person-in-Charge', align: 'left', value: 'personInCharge' },
                { text: 'Action', align: 'left', value: 'actions' },
            ],
            externalHeaders: [
                { text: 'Description', align: 'left', value: 'description' },
                { text: 'Type', align: 'left', value: 'type' },
                { text: 'Date', align: 'left', value: 'dateCr' },
                { text: 'Availability Time', align: 'left', value: 'availability' },
                { text: 'Status', align: 'left', value: 'status' },
                { text: 'Location', align: 'left', value: 'location' },
                { text: 'Agencies', align: 'left', value: 'agencies' },
                { text: 'Person-in-Charge', align: 'left', value: 'personInCharge' },
                { text: 'Contact No', align: 'left', value: 'contactNo' },
                { text: 'Action', align: 'left', value: 'actions' },
            ],
            statusItems: [{ text: 'Assigned' }, { text: 'Available' }, { text: 'Out of Service' }],
            InternalItems: [
                {
                    text: 'Internal',
                },
            ],
            ExternalItems: [
                {
                    text: 'External',
                },
            ],
        }
    },

    methods: {
        toggleSortState() {
            this.asc = !this.asc
        },
        validateTime(evt) {
            if (this.internal == false) {
                this.validate24HourFormat(evt, this.editedItem.availability)
            } else {
                this.validate24HourFormat(evt, this.editedInternalItem.availability)
            }
        },
        toDateTime(date) {
            return moment(date).format('DD-MMM-YYYY')
        },

        toDateTimePdf(date) {
            return moment(date).format('DD-MMM-YYYY HH:mm')
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
            if (this.internal === true) {
                let sortedArrayData
                if (this.asc) {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
                } else {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
                }
                console.log(sortedArrayData)
                sortedArrayData.forEach((el, index) => {
                    forExcel.push({
                        No: index + 1,
                        Description: el.description,
                        Date: this.toDateTime(el.dateCr),
                        Availability: el.availability,
                        Status: el.status,
                        Location: el.location,
                        'Person-in-Charge': el.personInCharge,
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
            } else {
                let sortedArrayData
                if (this.asc) {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
                } else {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
                }
                console.log(sortedArrayData)
                sortedArrayData.forEach((el, index) => {
                    forExcel.push({
                        No: index + 1,
                        Description: el.description,
                        Availability: el.availability,
                        Date: this.toDateTime(el.dateCr),
                        Status: el.status,
                        Location: el.location,
                        Agencies: el.agencies,
                        'Person-in-Charge': el.personInCharge,
                        'Contact No': el.contactNo,
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
            }
        },

        generatePDF() {
            let header = []
            if (this.internal == true) {
                this.tableHeaderData.forEach((el) => {
                    if (el.text != 'Action') {
                        header.push({ text: el.text, style: 'tableHeader' })
                    }
                })
                let dataTable = []
                let sortedArrayData
                if (this.asc) {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
                } else {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
                }
                console.log(sortedArrayData)
                sortedArrayData.forEach((el, index) => {
                    dataTable[index] = [
                        el.description,
                        this.toDateTime(el.dateCr),
                        el.availability,
                        el.status,
                        el.location,
                        el.personInCharge,
                    ]
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
                        { text: 'Emergency Name : ' + this.emergencyDetails.emergencyInfo.emergencyName, style: 'header' },
                        { text: 'Date & Time : ' + this.toDateTime(this.emergencyDetails.emergencyInfo.dateCr), style: 'header' },
                        { text: 'Location : ' + this.emergencyDetails.emergencyInfo.location, style: 'header' },
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
            } else {
                this.tableHeaderData.forEach((el) => {
                    if (el.text != 'Action') {
                        header.push({ text: el.text, style: 'tableHeader' })
                    }
                })
                let dataTable = []
                let sortedArrayData
                if (this.asc) {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
                } else {
                    sortedArrayData = [...this.resourcesTableData].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
                }
                console.log(sortedArrayData)
                sortedArrayData.forEach((el, index) => {
                    dataTable[index] = [
                        el.description,
                        this.toDateTime(el.dateCr),
                        el.availability,
                        el.status,
                        el.location,
                        el.agencies,
                        el.personInCharge,
                        el.contactNo,
                    ]
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
                        { text: 'Emergency Name : ' + this.emergencyDetails.emergencyInfo.emergencyName, style: 'header' },
                        { text: 'Date & Time : ' + this.toDateTime(this.emergencyDetails.emergencyInfo.dateCr), style: 'header' },
                        { text: 'Location : ' + this.emergencyDetails.emergencyInfo.location, style: 'header' },
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
            }
        },

        getEmergencyDetails() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/emergency/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.emergencyDetails = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        addData() {
            this.action = 'add'
            if (this.editedInternalItem) {
                Object.keys(this.editedInternalItem).map((key) => {
                    if (key == 'dateCr') {
                        this.editedInternalItem[key] = new Date().toISOString().substr(0, 10)
                    } else if (key == 'availability') {
                        this.editedInternalItem[key] = moment().format('HH:mm')
                    } else {
                        this.editedInternalItem[key] = ''
                    }
                })
                this.dialog = true
                this.addNew = true
            }
            if (this.editedItem) {
                Object.keys(this.editedItem).map((key) => {
                    if (key == 'dateCr') {
                        this.editedItem[key] = new Date().toISOString().substr(0, 10)
                    } else if (key == 'availability') {
                        this.editedItem[key] = moment().format('HH:mm')
                    } else {
                        this.editedItem[key] = ''
                    }
                })
                this.dialog = true
                this.addNew = true
            }
        },

        toggleTable(section) {
            this.search = ''
            if (section === 'internal') {
                this.internal = true
                this.type = 'Internal'
                this.getResourcesInternalData()
            } else {
                this.internal = false
                this.type = 'External'
                this.getResourcesExternalData()
            }
        },

        getResourcesInternalData() {
            this.loading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/resources/internal/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.resourcesTableData = response.data
                    this.loading = false
                    return this.resourcesTableData.filter((element) => {
                        return element.type == 'Internal'
                    })
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                    this.loading = false
                })
        },

        getResourcesExternalData() {
            this.loading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/resources/external/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.resourcesTableData = response.data
                    this.loading = false
                    return this.resourcesTableData.filter((element) => {
                        return element.type == 'External'
                    })
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                    this.loading = false
                })
        },

        postResourcesData() {
            var payload
            if (this.action == 'add') {
                payload = {
                    id: `${this.$route.params.id}-${Date.now()}`,
                    emergencyId: this.$route.params.id,
                    availability: this.editedItem.availability,
                    dateCr: momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('DD-MMM-YYYY'),
                    description: this.editedItem.description,
                    location: this.editedItem.location,
                    personInCharge: this.editedItem.personInCharge,
                    status: this.editedItem.status,
                    agencies: this.editedItem.agencies,
                    contactNo: this.editedItem.contactNo,
                    type: 'External',
                }
                var path = '/resources/add'
            }
            if (this.action == 'edit') {
                payload = {
                    ...this.editedItem,
                }
                var path = '/resources/edit'
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}${path}`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getResourcesExternalData()
                    this.isLoading = false
                    this.close()
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })
        },

        postResourcesInternalData() {
            var payload
            if (this.action == 'add') {
                payload = {
                    id: `${this.$route.params.id}-${Date.now()}`,
                    emergencyId: this.$route.params.id,
                    availability: this.editedInternalItem.availability,
                    description: this.editedInternalItem.description,
                    location: this.editedInternalItem.location,
                    personInCharge: this.editedInternalItem.personInCharge,
                    status: this.editedInternalItem.status,
                    type: 'Internal',
                    dateCr: momentTZ.tz(this.editedInternalItem.dateCr, 'Asia/Kuala_Lumpur').format('DD-MMM-YYYY'),
                }
                var path = '/resources/add'
            }
            if (this.action == 'edit') {
                payload = {
                    ...this.editedInternalItem,
                }
                var path = '/resources/edit'
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}${path}`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getResourcesInternalData()
                    this.isLoading = false
                    this.close()
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })
        },

        editResourcesData(item) {
            this.action = 'edit'
            this.addNew = false
            if (this.internal == true) {
                this.editInternalItem(item)
            } else {
                this.editItem(item)
            }
        },

        deleteResourcesData() {
            this.isLoading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/resources/delete/${this.delSelected}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    let temp = this.resourcesTableData.findIndex((item) => item.id === this.delSelected)
                    this.resourcesTableData.splice(temp, 1)
                    this.isLoading = false
                    this.close()
                })
                .catch((error) => {
                    console.log(error)
                    if (this.internal) {
                        this.getResourcesInternalData()
                    } else {
                        this.getResourcesExternalData()
                    }
                    this.isLoading = false
                    this.close()
                })
        },

        deleteItem(val) {
            this.delSelected = val
            this.delDialog = true
        },

        editItem(item) {
            this.editedIndex = this.resourcesTableData.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.editedItem.dateCr = moment(item.dateCr).format('YYYY-MM-DD')
            this.dialog = true
        },

        editInternalItem(item) {
            this.editedIndex = this.resourcesTableData.indexOf(item)
            this.editedInternalItem = Object.assign({}, item)
            this.editedInternalItem.dateCr = moment(item.dateCr).format('YYYY-MM-DD')
            this.dialog = true
        },

        close() {
            setTimeout(() => {
                this.dialog = false
                this.delDialog = false
                this.exportFileName = this.$route.params.id
                this.editedItem.dateCr = new Date().toISOString().substr(0, 10)
                this.editedInternalItem.dateCr = new Date().toISOString().substr(0, 10)
                this.editedInternalItem.availability = moment().format('HH:mm')
                this.editedItem.availability = moment().format('HH:mm')
            }, 300)
        },
        // destructureInternalObj({ description, type, dateCr, availability, status, location, personInCharge }) {
        //   return { description, dateCr, type, availability, status, location, personInCharge }
        // },
        // destructureExternalObj({ description, type,dateCr, availability, status, location, agencies, personInCharge, contactNo }) {
        //   return { description, dateCr, type,availability, status, location, agencies, personInCharge, contactNo }
        // }
    },

    computed: {
        formTitle() {
            if (this.internal == true) {
                return this.addNew ? 'Internal Resources' : 'Edit'
            } else {
                return this.addNew ? 'External Resources' : 'Edit'
            }
        },

        tableHeaderData() {
            if (this.internal) {
                return this.internalHeaders.filter((item) => {
                    return item.text !== 'Type'
                })
            }
            if (this.internal == false) {
                return this.externalHeaders.filter((item) => {
                    return item.text !== 'Type'
                })
            }
        },
    },

    mounted() {
        this.loading = true
        this.getEmergencyDetails()
        this.exportFileName = this.$route.params.id
        if (this.internal) {
            this.getResourcesInternalData()
        } else {
            this.getResourcesExternalData()
        }
    },
}
</script>

<style></style>
