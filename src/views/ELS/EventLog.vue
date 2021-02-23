<template>
    <v-container grid-list-xl>
        <v-layout row wrap class="mb-4">
            <v-flex xs12 md4>
                <v-select
                    :items="emergencyTeams"
                    item-value="value"
                    v-model="currEmergencyTeam"
                    @change="changeDefaultLogger"
                    hide-details
                ></v-select>
            </v-flex>
            <v-flex xs12>
                <v-dialog persistent v-model="dialog.state" max-width="600px">
                    <template v-slot:activator="{ on }">
                        <v-card-actions v-if="userCanPerformAction" class="mt-3 mb-3 ma-0 pa-0">
                            <v-spacer></v-spacer>
                            <v-btn color="primaryGreen white--text" small class="elevation-0" @click="openDialog('Add')">
                                <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                                Add
                            </v-btn>
                            <v-btn color="primaryGreen white--text" small class="elevation-0" @click="exportDialog = true">
                                <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                                Export
                            </v-btn>
                        </v-card-actions>
                    </template>
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span v-if="dialog.type == 'Add'" class="subheading font-weight-medium">Event / Action</span>
                            <span v-if="dialog.type == 'Edit'" class="subheading font-weight-medium">Edit</span>
                        </v-card-title>
                        <v-card-text class="pt-0">
                            <v-container class="pb-0" grid-list-md>
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
                                    <v-flex xs12 md6 px-2>
                                        <v-text-field v-model="editedItem.from" label="From"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 md6 px-2>
                                        <v-text-field v-model="editedItem.to" label="To"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-textarea
                                            v-model="editedItem.event"
                                            filled
                                            :rules="[rules.length(500)]"
                                            counter="500"
                                            label="Event / Action"
                                            auto-grow
                                        ></v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="statusItems"
                                            @change="remarksAuto"
                                            v-model="editedItem.status"
                                            label="Status"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12 md6>
                                        <v-text-field v-model="editedItem.pic" label="PIC"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-textarea v-model="editedItem.remarks" filled label="Remarks" auto-grow></v-textarea>
                                    </v-flex>
                                </v-layout>
                                <v-card-actions class="pr-0">
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
                <v-dialog persistent v-model="standDownDialog" max-width="600px">
                    <v-card>
                        <v-container grid-list-xl>
                            <v-card-text class="mb-0 pb-0">
                                <h1 class="pa-md-4 mx-lg-auto primaryGreen--text text-center">
                                    Are you sure want to {{ disclaimerStatus }} for
                                </h1>
                                <h1 class="primaryGreen--text text-center">{{ currEmergencyTeam }}?</h1>
                                <p>
                                    <br /><b>Disclaimer:</b><br />
                                    Stand Down Declaration is only be made once the emergency is contained or situation under
                                    control and there is no possibility of further escalation.
                                </p>
                                <p>Please check and ensure all the actions listed in ELS had been completed.</p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn dark outlined class="elevation-0" color="primaryGreen" @click="closeStandDown">No</v-btn>
                                <v-btn
                                    :loading="isLoading"
                                    class="elevation-0"
                                    color="primaryGreen white--text"
                                    @click="submitStandDown"
                                    >Yes</v-btn
                                >
                            </v-card-actions>
                        </v-container>
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
                        <template v-slot:item.action="{ item }">
                            <template v-if="userCanPerformAction">
                                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                                <v-icon small @click="deleteItem(item.id)">mdi-delete</v-icon>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
            <v-flex v-show="standDownData.status !== 'case closed'" xs7 class="mt-4">
                <v-switch
                    v-if="userCanPerformAction"
                    v-model="standDownSwitch"
                    @change="openDialogStandDown"
                    label="Stand Down"
                ></v-switch>
                <!-- <v-layout row wrap>
          <v-flex xs12 md6>
            <v-menu
              v-model="standDownDate"
              :close-on-content-click="false"
              max-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="standDownDateFormat"
                  prepend-icon="mdi-calendar"
                  clearable
                  label="Date"
                  readonly
                  hide-details
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="standDownDateFormat"
                @change="standDownDate = false"
              ></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12 md6>
            <v-menu
              ref="menu"
              v-model="standDownTime"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="standDownTimeFormat"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="standDownTimeFormat"
                  label="Time"
                  prepend-icon="mdi-clock-outline"
                  clearable
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="standDownTime"
                v-model="standDownTimeFormat"
                @click:minute="$refs.menu.save(standDownTimeFormat)"
              ></v-time-picker>
            </v-menu>
          </v-flex>
          <v-flex xs12>
            <v-textarea
             v-model="updateDescriptionStandDown"
             filled
             label="Description"
             auto-grow
            ></v-textarea>
          </v-flex>
          <v-flex xs12>
            <v-card-actions class="mt-0 pt-0 pr-0">
              <v-spacer></v-spacer>
              <v-btn small class="elevation-0" color="primaryGreen white--text" @click="confirmDialog = true">Update</v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout> -->
            </v-flex>
        </v-layout>
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
        <v-dialog persistent v-model="confirmDialog" max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Disclaimer</span>
                </v-card-title>
                <v-card-text>
                    Are you sure want to change the status to stand down?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small dark outlined depressed class="elevation-0" color="primaryGreen" @click="confirmDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn
                        :loading="isLoading"
                        small
                        class="elevation-0"
                        color="primaryGreen white--text"
                        @click="updateStandDown()"
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
            asc: false,
            isLoading: false,
            updateDescriptionStandDown: '',
            standDownDialog: false,
            standDownTimeFormat: '',
            standDownTime: false,
            standDownDateFormat: '',
            standDownDate: null,
            standDownSwitch: '',
            standDownData: { status: '' },
            disclaimerStatus: 'Stand Down',
            confirmDialog: false,
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            isStandDown: '',
            pagination: {
                sortBy: 'dateCr',
                descending: false,
            },
            rowsPerPageItems: [10, 20, 30, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
            editedIndex: -1,
            addLines: true,
            currEmergencyTeam: 'ERT',
            // emergencyTeams: ['Emergency Response Team', 'Emergency Management Team', 'Business Crisis Management Team', 'PETRONAS Crisis Management Team'],
            emergencyTeams: [
                {
                    text: 'Emergency Response Team',
                    value: 'ERT',
                },
                {
                    text: 'Emergency Management Team',
                    value: 'EMT',
                },
                {
                    text: 'Business Crisis Management Team',
                    value: 'BCMT',
                },
                {
                    text: 'PETRONAS Crisis Management Team',
                    value: 'PCMT',
                },
            ],
            loggerItems: ['ERT', 'EMT', 'BCMT', 'PCMT'],
            statusItems: ['Not Started', 'On-going', 'Completed', 'Canceled'],
            currTeamTypeIndex: 0,
            dialog: {
                state: false,
                type: '',
            },
            rules: {
                length: (len) => (v) => (v || '').length <= len || `Invalid character length, required ${len}`,
            },
            delDialog: false,
            dateModal: false,
            timeModal: false,
            editDateModal: false,
            editTimeModal: false,
            deleteId: null,
            exportFileName: '',
            editedItem: {
                date: new Date().toISOString().substr(0, 10),
                time: moment().format('HH:mm'),
                dateCr: '',
                logger: 'ERT',
                from: '',
                to: '',
                event: '',
                status: '',
                pic: '',
                remarks: '',
            },
            sortBy: 'dateCr',
            descending: false,
            headers: [
                { text: 'Date & Time', align: 'left', value: 'dateCr', sortable: true },
                { text: 'Logger', align: 'left', value: 'logger', sortable: false },
                { text: 'Event / Action', align: 'left', value: 'event', sortable: false },
                { text: 'Status', align: 'left', value: 'status', sortable: false },
                { text: 'PIC', align: 'left', value: 'pic', sortable: false },
                { text: 'From', align: 'left', value: 'from', sortable: false },
                { text: 'To', align: 'left', value: 'to', sortable: false },
                { text: 'Remarks', align: 'left', value: 'remarks', sortable: false },
                { text: 'Action', align: 'left', value: 'action', sortable: false },
            ],
            dataDetails: [],
        }
    },
    watch: {
        currEmergencyTeam(val) {
            this.getData()
        },
        standDownSwitch(val) {
            if (val == true) {
                this.disclaimerStatus = 'Stand Down'
            } else {
                this.disclaimerStatus = 'Reactivate'
            }
        },
    },
    methods: {
        toggleSortState() {
            this.asc = !this.asc
        },
        validateTime(evt) {
            this.validate24HourFormat(evt, this.editedItem.time)
        },
        openDialogStandDown() {
            this.standDownDialog = true
        },
        closeStandDown() {
            this.standDownSwitch = !this.standDownSwitch
            this.standDownDialog = false
        },
        submitStandDown() {
            this.postStandDownData()
            this.updateStandDown()
        },
        postStandDownData() {
            let eventValue = ''
            this.editedItem.dateCr = `${this.editedItem.date} ${this.editedItem.time}`
            // console.log(momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'));
            if (this.standDownSwitch == true) {
                eventValue = `${this.editedItem.logger} is stand down`
            } else {
                eventValue = `${this.editedItem.logger} is reactivated`
            }
            const id = `${this.$route.params.id}-${Date.now()}`
            const emergencyId = this.$route.params.id
            const payload = {
                id: id,
                emergencyId: emergencyId,
                dateCr: momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'),
                logger: this.editedItem.logger,
                from: this.editedItem.logger,
                to: 'test',
                event: eventValue,
                status: 'Completed',
                pic: this.editedItem.logger,
                remarks: `Status Completed at ${this.editedItem.dateCr}`,
            }
            // console.log(payload);
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/eventlog/add`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.isLoading = false
                })
                .catch((response) => {
                    this.isLoading = false
                    console.log(error)
                })
        },
        updateStandDown() {
            let payload = this.standDownData

            if (this.standDownSwitch == true) {
                payload = {
                    ...this.standDownData,
                    id: this.standDownData.id,
                    standdownRemarks: this.updateDescriptionStandDown,
                    standownDate: '',
                }
                payload['standown' + this.emergencyTeamShortName] = 'true'
            } else {
                payload = {
                    ...this.standDownData,
                    id: this.standDownData.id,
                    standdownRemarks: this.updateDescriptionStandDown,
                    standownDate: '',
                }
                payload['standown' + this.emergencyTeamShortName] = 'false'
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/emergency/standown/${this.emergencyTeamShortName}`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.standDownDialog = false
                    this.$router.push(`/statusboard/incidentfacts/${this.$route.params.id}`)
                    this.isLoading = false
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })
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
            let userData = [{ A: 'Team:', B: this.currEmergencyTeam }]
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

            // sort array
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
                        text: this.currEmergencyTeam,
                        style: 'header',
                    },
                    {
                        // layout: 'lightHorizontalLines', // optional
                        table: {
                            // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
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
        changeDefaultLogger() {
            console.log(this.currEmergencyTeam)
            this.editedItem.logger = this.currEmergencyTeam
            this.editedItem.from = this.currEmergencyTeam
        },
        remarksAuto() {
            let temp = `Status ${this.editedItem.status} at ${this.editedItem.date} ${this.editedItem.time}`
            if (this.addLines == true) {
                this.addLines = false
                if (this.editedItem.remarks == '') {
                    this.editedItem.remarks = temp
                } else {
                    this.editedItem.remarks = this.editedItem.remarks + '\n' + temp
                }
            } else {
                let lines = this.editedItem.remarks.substring(this.editedItem.remarks.lastIndexOf('\n') + 1, -1)
                this.editedItem.remarks = lines + temp
            }
        },
        getData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/eventlog/${this.$route.params.id}?sector=${this.currEmergencyTeam}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    // console.log(response.data)
                    this.addLines = true
                    this.dataDetails = response.data
                    this.getStandDown()
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                })
        },
        getStandDown() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/emergency/standown/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    if (this.currEmergencyTeam === 'Emergency Response Team') {
                        response.data.standownERT == 'true' ? (this.standDownSwitch = true) : (this.standDownSwitch = false)
                    } else if (this.currEmergencyTeam === 'Emergency Management Team') {
                        response.data.standownEMT == 'true' ? (this.standDownSwitch = true) : (this.standDownSwitch = false)
                    } else if (this.currEmergencyTeam === 'Business Crisis Management Team') {
                        response.data.standownBCMT == 'true' ? (this.standDownSwitch = true) : (this.standDownSwitch = false)
                    } else if (this.currEmergencyTeam === 'PETRONAS Crisis Management Team') {
                        response.data.standownPCMT == 'true' ? (this.standDownSwitch = true) : (this.standDownSwitch = false)
                    }
                    this.updateDescriptionStandDown = response.data.standdownRemarks
                    console.log(response.data)
                    this.standDownData = response.data
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                })
        },
        postAddData() {
            this.editedItem.dateCr = `${this.editedItem.date} ${this.editedItem.time}`
            // console.log(momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'));
            const id = `${this.$route.params.id}-${Date.now()}`
            const emergencyId = this.$route.params.id
            const payload = {
                id: id,
                emergencyId: emergencyId,
                dateCr: momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'),
                logger: this.editedItem.logger,
                from: this.editedItem.from,
                to: this.editedItem.to,
                event: this.editedItem.event,
                status: this.editedItem.status,
                pic: this.editedItem.pic,
                remarks: this.editedItem.remarks,
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/eventlog/add`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.isLoading = false
                })
                .catch((response) => {
                    this.isLoading = false
                    console.log(error)
                })
        },
        postEditData() {
            this.editedItem.dateCr = `${this.editedItem.date} ${this.editedItem.time}`

            const payload = {
                id: this.editedItem.id,
                emergencyId: this.editedItem.emergencyId,
                dateCr: momentTZ.tz(this.editedItem.dateCr, 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'),
                time: this.editedItem.time,
                logger: this.editedItem.logger,
                from: this.editedItem.from,
                to: this.editedItem.to,
                event: this.editedItem.event,
                status: this.editedItem.status,
                pic: this.editedItem.pic,
                remarks: this.editedItem.remarks,
            }
            // console.log(payload)
            console.log(this.editedItem.time)
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/eventlog/edit`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.isLoading = false
                    this.getData()
                })
                .catch((response) => {
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
            console.log(item)
            this.editedIndex = this.dataDetails.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.editedItem.date = moment(item.dateCr).format('YYYY-MM-DD')
            this.editedItem.time = moment(item.time).format('HH:mm')
            this.editedItem.remarks = item.remarks
            // this.editedItem.logger = this.editedItem.logger
            this.openDialog('Edit')
        },
        getDeleteData() {
            this.isLoading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/eventlog/delete/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.deleteId = null
                    this.isLoading = false
                    this.delDialog = false
                })
                .catch((error) => {
                    this.isLoading = false
                    this.delDialog = false
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
            if (type == 'Add') {
                this.changeDefaultLogger()
            }
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
                this.editedItem.from = this.editedItem.logger
            }, 300)
        },
    },
    computed: {
        emergencyTeamShortName() {
            if (this.currEmergencyTeam === 'Emergency Response Team') {
                return 'ERT'
            } else if (this.currEmergencyTeam === 'Emergency Management Team') {
                return 'EMT'
            } else if (this.currEmergencyTeam === 'Business Crisis Management Team') {
                return 'BCMT'
            } else if (this.currEmergencyTeam === 'PETRONAS Crisis Management Team') {
                return 'PCMT'
            }
        },
    },
    mounted() {
        // this.editedItem.time = moment().format('HH:mm')
        this.exportFileName = this.$route.params.id
        this.getStandDown()
        this.getData()
        this.currEmergencyTeam = this.$store.getters.user.userAccesses.team
        let arrIndex = null
        this.emergencyTeams.forEach((team, index, arr) => {
            if (team.value == this.$store.getters.user.userAccesses.team) {
                arrIndex = index
            }
        })
        console.log(this.emergencyTeams)
        this.emergencyTeams = this.emergencyTeams.splice(0, arrIndex + 1)
        console.log(this.emergencyTeams)
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
