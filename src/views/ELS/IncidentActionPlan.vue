<template>
    <v-container grid-list-xl>
        <v-layout row wrap class="mb-4 mt-1">
            <v-flex xs12>
                <v-card-actions class="mb-5">
                    <v-text-field
                        class="mr-2 pt-0 mt-0"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <template v-if="userCanPerformAction">
                        <!-- <v-btn color="primaryGreen white--text" small class="elevation-0"@click="dialogIAP">
                            <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                            Add
                        </v-btn> -->
                        <v-btn color="primaryGreen white--text" small class="elevation-0" @click="dialogUpload">
                            <v-icon class="mr-1" small dark>mdi-upload</v-icon>
                            Upload
                        </v-btn>
                        <v-btn small color="primaryGreen white--text" class="pb-0 elevation-0" @click="exportDialog = true">
                            <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                            Export
                        </v-btn>
                    </template>
                </v-card-actions>
                <v-card>
                    <v-data-table
                        :headers="headers"
                        :items="dataDetails"
                        :sort-by="['datePublished']"
                        :sort-desc="[true, false]"
                        must-sort
                        :search="search"
                        class="elevation-0"
                    >
                        <template v-slot:header.datePublished>
                            <button @click="toggleSortState">Date Published</button>
                        </template>
                        <template v-if="loading" v-slot:no-data>
                            <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                        </template>
                        <template v-slot:item.datePublished="{ item }">
                            {{ toDateTime(item.datePublished) }}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <template v-if="userCanPerformAction">
                                <a :href="`${url}/iap/download/${item.id}`" style="text-decoration-color: transparent;">
                                    <v-icon small class="cursor mr-2 mt-1" download>mdi-download</v-icon>
                                </a>
                                <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                                <v-icon small @click="deleteItem(item.id)">mdi-delete</v-icon>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </v-data-table>
                </v-card>
            </v-flex>
            <v-dialog persistent v-model="dialog" max-width="500px">
                <v-card>
                    <v-card-title class="primaryGreen white--text">
                        <span class="headline subheading font-weight-medium">{{ header }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-xl>
                            <v-layout wrap>
                                <v-flex xs6>
                                    <v-text-field v-model="editedItem.documentName" label="Document Name"></v-text-field>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field v-model="editedItem.version" label="Version"></v-text-field>
                                </v-flex>
                                <v-flex xs6>
                                    <v-menu v-model="menu2" :close-on-content-click="false" max-width="290">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                :value="editedItem.datePublished"
                                                clearable
                                                label="Date Published"
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editedItem.datePublished" @change="menu2 = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field v-model="editedItem.publishedBy" label="Published By"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field v-model="editedItem.remarks" label="Remarks"></v-text-field>
                                </v-flex>
                                <v-flex xs12 md3 class="pa-0 pl-3">
                                    <template class="red--text pr-3">Max 20MB file</template>
                                    <input type="file" ref="fileupload" style="display:none;" @change="changeUpload" />
                                    <v-btn
                                        small
                                        depressed
                                        color="primaryGreen"
                                        class="white--text pa-0 ml-2"
                                        @click="browseUpload"
                                        >Upload</v-btn
                                    >
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small dark outlined depressed color="primaryGreen" @click="cancelItem">Cancel</v-btn>
                        <v-btn :loading="isLoading" small depressed color="primaryGreen" class="white--text" @click="saveitem()"
                            >OK</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog persistent v-model="delDialog" max-width="500px">
                <v-card class="pa-3">
                    <v-card-title primary-title>
                        <span class="headline">Delete</span>
                    </v-card-title>
                    <v-card-text>
                        Are you sure you want to delete this event?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            small
                            dark
                            outlined
                            depressed
                            class="elevation-0"
                            color="primaryGreen white--text"
                            @click="delDialog = false"
                            >Cancel</v-btn
                        >
                        <v-btn
                            :loading="isLoading"
                            small
                            depressed
                            class="elevation-0 white--text"
                            color="primaryGreen"
                            @click="getDeleteData"
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
                                <v-btn small class="elevation-0" color="primaryGreen white--text" @click="exportFile">OK</v-btn>
                            </v-card-actions>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <div id="tableIAP">
                <v-dialog v-model="addIAP" max-width="80%">
                    <v-simple-table>
                        <table class="IAP">
                            <tr>
                                <th colspan="5" class="text-center primaryGreen white--text">Column / Vessel Fire</th>
                            </tr>
                            <tr>
                                <th colspan="5" class="text-left" style="border-right: 1px solid #dddddd;">
                                    RESPONSE STRATEGY: PREVENT INCIDENT ESCALATION & MINIMIZE IMPACT <br />Confirmed fire -
                                    Shutdown heat source and system accordingly - If possible apply steam lance - Actuate fire
                                    water spray on exposed / adjacent area - Evacuation to assembly point - Maintain steam blanket
                                </th>
                            </tr>
                            <tr>
                                <th
                                    colspan="2"
                                    width="10%;"
                                    class="text-center"
                                    style="border: 1px solid #dddddd; border-right: none;"
                                >
                                    Initial
                                </th>
                                <th
                                    width="30%;"
                                    class="text-center"
                                    style="border: 1px solid #dddddd; border-left: 1px solid #dddddd;"
                                >
                                    Actions
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">
                                    Equipment / Resources
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">Details</th>
                            </tr>
                            <tr>
                                <th rowspan="6" class="text-center primaryGreen white--text" style="border: 1px solid #dddddd;">
                                    At control room
                                </th>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="panelman" label="Panelman"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Request confirmation and notify OSC. Get details of incident.
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Walkie-talkie</td>
                                <td style="border-right: 1px solid #dddddd;">
                                    • Location/area/unit/equipment, casualties, product, source of fire if possible & provide
                                    weather data to OSC.Priorities: PEAR
                                </td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Take command & control and give direction to ERT.
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• CCTV</td>
                                <td style="border-right: 1px solid #dddddd;">• Notify authorities soonest</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Instruct Panelman to activate siren / alarm & announcement. Secure system & area.
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;">• Notify COMCEN within 1 hour.</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Notify as per notification list
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;">• Refer to plant operation manual</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Stop operation at facilities & consider ESD
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <th
                                    width="10%;"
                                    colspan="2"
                                    class="text-center"
                                    style="border: 1px solid #dddddd; border-right: none;"
                                >
                                    1st Response
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    Actions
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">
                                    Equipment / Resources
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">Details</th>
                            </tr>
                            <tr>
                                <th rowspan="9" class="text-center primaryGreen white--text">At location</th>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Size up / zoning & determine fire source.
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Walkie-talkie</td>
                                <td style="border-right: 1px solid #dddddd;">
                                    • Risk & Potential. Determine any casualties @ number & location
                                </td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Activate cooling system and fixed monitor through boundary cooling of adjacent equipment.
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Fixed system</td>
                                <td style="border-right: 1px solid #dddddd;">• Wind direction & weather condition</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Apply steam lance if required
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• ERT with full PPE & gas detector</td>
                                <td style="border-right: 1px solid #dddddd;">• Stand-by ERT, fire trucks, ambulance, BOMBA</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Request for support & advise OSC to declare Tier 2 / 3
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Determine support from external resources
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ap" label="AP"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Close main gate to stop all ingress except emergency vehicles
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• CCTV at control room</td>
                                <td style="border-right: 1px solid #dddddd;">
                                    • Monitor vehicles & people movement through CCTV
                                </td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ap" label="AP"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Check headcount.
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ap" label="AP"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Ensure non-responders have evacuated & direct all external assistance to staging area.
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <th
                                    width="10%;"
                                    colspan="2"
                                    class="text-center"
                                    style="border: 1px solid #dddddd; border-right: none;"
                                >
                                    2nd Response
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    Actions
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">
                                    Equipment / Resources
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">Details</th>
                            </tr>
                            <tr>
                                <th rowspan="7" class="text-center primaryGreen white--text">At location</th>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Check personnel evacuation status through headcount system at security
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Headcount system record at assembly point.</td>
                                <td style="border-right: 1px solid #dddddd;">• External responders report to OSC</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC & ERT & Support Team"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Perform UC if required. Brief external supports (CEFS / BOMBA / MA) on current situation
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Portable monitor</td>
                                <td style="border-right: 1px solid #dddddd;">
                                    • Ensure ERT / external response wearing full firefighting PPE.
                                </td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Maintain stream blanketing & fire fighting
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Fire trucks</td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ert" label="ERT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Apply preventive foam blanket to cover any spillage
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Fire extinguisher</td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="emt" label="EMT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Managing incident as ruled out in OPUs ERP
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="osc" label="OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Advice and request IC to declare stand down and activate all clear siren
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <th
                                    width="10%;"
                                    colspan="2"
                                    class="text-center"
                                    style="border: 1px solid #dddddd; border-right: none;"
                                >
                                    3rd Response
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    Actions
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">
                                    Equipment / Resources
                                </th>
                                <th class="text-center" style="border: 1px solid #dddddd; border-left: none;">Details</th>
                            </tr>
                            <tr>
                                <th rowspan="5" class="text-center primaryGreen white--text">UC</th>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ic" label="IC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Update response
                                </td>
                                <td style="border-right: 1px solid #dddddd;">• Walkie-talkie</td>
                                <td style="border-right: 1px solid #dddddd;">• Handover certificate</td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="ertOsc" label="ERT / OSC"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Handover command to authorities
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="emt" label="EMT"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Perform overhaul before advise UC / IC to declare stand down
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <td><v-checkbox v-model="icAuthority" label="IC Authority"></v-checkbox></td>
                                <td style="border-right: 1px solid #dddddd; border-left: 1px solid #dddddd;">
                                    • Declare stand down and activate all clear siren
                                </td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                                <td style="border-right: 1px solid #dddddd;"></td>
                            </tr>
                            <tr>
                                <th colspan="2" style="border: 1px solid #dddddd; border-bottom: none; border-right: none;">
                                    Incident potential hazards
                                </th>
                                <td colspan="3" style="border: 1px solid #dddddd; border-bottom: none;">
                                    Consider the rapid escalation of the fire incident and the possibility to occur explosion.
                                    Beware of equipment collapse and use of jet water can cause equipment damage(thermal
                                    shock).Liquid carryover causes spill fire that require to extinguish <br />It can cause
                                    explosion due to overpressure. Structure and associated equipment collapse due to fire
                                    exposure and material strength degradation.
                                </td>
                            </tr>
                            <tr>
                                <th colspan="2" style="border: 1px solid #dddddd; border-right: none;">
                                    Other concern / hazards
                                </th>
                                <td colspan="3" style="border: 1px solid #dddddd;">
                                    Delay in extinguishing the fire may cause damage of the whole equipment
                                </td>
                            </tr>
                        </table>
                    </v-simple-table>
                </v-dialog>
            </div>
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
            isLoading: false,
            url: process.env.VUE_APP_API_URL,
            menu2: false,
            delDialog: false,
            filename: '',
            dialog: false,
            editedIndex: -1,
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            exportFileName: '',
            addIAP: false,
            panelman: '',
            ert: '',
            osc: '',
            ic: '',
            ap: '',
            ertOsc: '',
            emt: '',
            icAuthority: '',
            loading: false,
            rowsPerPage: [10, 20, 30, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
            search: '',
            headers: [
                { text: 'Document Name', value: 'documentName' },
                { text: 'Version', value: 'version' },
                { text: 'Date Published', value: 'datePublished' },
                { text: 'Published By', value: 'publishedBy' },
                { text: 'Remarks', value: 'remarks', sortable: false, width: 250 },
                { text: 'Action', align: 'center', value: 'action', sortable: false },
            ],
            dataDetails: [],
            editedItem: {
                documentName: '',
                version: '',
                datePublished: new Date().toISOString().substr(0, 10),
                publishedBy: '',
                remarks: '',
            },
            header: '',
            editadd: '',
        }
    },
    methods: {
        toggleSortState() {
            this.asc = !this.asc
        },
        dialogIAP() {
            this.addIAP = true
        },
        toDateTime(date) {
            return moment(date).format('DD-MMM-YYYY')
        },
        browseUpload() {
            this.$refs.fileupload.click()
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
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.datePublished > b.datePublished ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
            }
            sortedArrayData.forEach((el, index) => {
                forExcel.push({
                    No: index + 1,
                    'Document Name': el.documentName,
                    Version: el.version,
                    Date: el.datePublished,
                    'Published By': el.publishedBy,
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
                if (el.text != 'Action') {
                    header.push({ text: el.text, style: 'tableHeader' })
                }
            })

            let dataTable = []
            let sortedArrayData
            if (this.asc) {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.datePublished > b.datePublished ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1))
            }

            sortedArrayData.forEach((el, index) => {
                dataTable[index] = [el.documentName, el.version, this.toDateTime(el.datePublished), el.publishedBy, el.remarks]
            })

            console.log(dataTable)

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
        changeUpload() {
            if (!this.$refs.fileupload.files.length) {
                this.editedItem.remarks = ''
            } else {
                this.editedItem.remarks = this.$refs.fileupload.files[0].name
            }
        },
        getDeleteData() {
            //console.log(this.deletedItem)
            const index = this.dataDetails.indexOf(this.deletedItem)

            this.dataDetails.splice(index, 1)
            this.isLoading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/iap/delete/${this.deletedItem}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.isLoading = false
                })
                .catch((error) => {
                    this.isLoading = false
                    console.log(error)
                })

            this.delDialog = false
        },
        deleteItem(item) {
            this.delDialog = true
            this.deletedItem = item
        },
        editItem(item) {
            this.filename = item.documentName
            this.editedIndex = this.dataDetails.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            this.header = 'Edit'
            this.editadd = 'edit'
            this.editedItem.datePublished = this.toDateTime(item.datePublished)
        },
        dialogUpload() {
            this.filename = ''
            this.clearitem()
            this.editedItem.datePublished = new Date().toISOString().substr(0, 10)
            this.header = 'Incident Action Plan'
            this.editadd = 'add'
            this.dialog = true
        },
        cancelItem() {
            this.dialog = false
            this.clearitem()
        },
        clearitem() {
            ;(this.editedItem.documentName = ''),
                (this.editedItem.version = ''),
                (this.editedItem.datePublished = ''),
                (this.editedItem.publishedBy = ''),
                (this.editedItem.remarks = '')
        },
        saveitem() {
            if (this.editadd == 'add') {
                const info = {
                    emergencyId: this.$route.params.id,
                    documentName: this.editedItem.documentName,
                    version: this.editedItem.version,
                    datePublished: this.editedItem.datePublished,
                    publishedBy: this.editedItem.publishedBy,
                    remarks: this.editedItem.remarks,
                    files: this.$refs.fileupload.files[0],
                }
                this.dataDetails.push(info)
                this.postfunction(info, 'add')
                this.filename = 'Uploading'
            } else {
                if (this.editedIndex > -1) {
                    Object.assign(this.dataDetails[this.editedIndex], this.editedItem)
                } else {
                    this.dataDetails.push(this.editedItem)
                }
                this.postfunction(this.editedItem, 'edit')
            }
        },

        postfunction(data, action) {
            var formData = new FormData()
            formData.append('documentName', this.editedItem.documentName)
            formData.append('version', this.editedItem.version)
            formData.append('datePublished', this.editedItem.datePublished)
            formData.append('publishedBy', this.editedItem.publishedBy)
            formData.append('remarks', this.editedItem.remarks)

            if (action == 'add') {
                formData.append('files', data.files)
                formData.append('emergencyId', this.$route.params.id)
            }

            if (action == 'edit') {
                formData.append('emergencyId', this.editedItem.emergencyId)
                formData.append('fileid', this.editedItem.fileid)
                formData.append('id', this.editedItem.id)
                if (!this.$refs.fileupload.files.length) {
                    formData.append('files', null)
                } else {
                    formData.append('files', this.$refs.fileupload.files[0])
                }
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/iap/${action}`, formData, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response)
                    this.filename = ' '
                    this.dialog = false
                    this.isLoading = false
                    this.getfunction()
                })
                .catch((response) => {
                    this.isLoading = false
                    console.log(error)
                })
        },
        getfunction() {
            this.loading = true
            const str = this.$route.params.id
            const res = str.split('-')
            axios
                .get(`${process.env.VUE_APP_API_URL}/iap/${str}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.loading = false
                    this.dataDetails = response.data
                })
                .catch((error) => {
                    this.loading = false
                })
        },
    },
    mounted() {
        this.exportFileName = this.$route.params.id
        this.getfunction()
    },
}
</script>

<style lang="scss" scoped></style>
