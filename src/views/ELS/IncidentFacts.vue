<template>
    <v-container grid-list-lg pa-5>
        <v-layout row wrap>
            <v-flex xs12 class="pa-0">
                <table>
                    <tr class="white--text primaryGreen">
                        <td width="37.5%">HQ : {{ toDateTime(esbData.emergencyInfo.dateCr) }}</td>
                        <td width="37.5%" class="text-md-center white--text font-weight-medium">
                            INCIDENT FACTS
                        </td>
                        <td width="25%">SITE : {{ toDateTime(esbData.emergencyInfo.dateCr) }}</td>
                    </tr>
                    <tr class="white black--text ">
                        <td>
                            <span class="esb-title">ECC Phone No</span>
                            <span>
                                {{ esbData.emergencyInfo.phoneNumber }}
                            </span>
                        </td>
                        <td>
                            <span class="esb-title">ECC Fax No</span>
                            <span>{{ esbData.emergencyInfo.faxNumber }}</span>
                        </td>
                        <td>
                            <span class="esb-title">Radio Channel / Freq</span>
                            <span>{{ esbData.emergencyInfo.radioChannel }}</span>
                        </td>
                    </tr>

                    <tr class="white black--text ">
                        <td>
                            <span class="esb-title">Emergency Name</span>
                            <span>
                                {{ esbData.emergencyInfo.emergencyName }}
                            </span>
                        </td>
                        <td>
                            <span class="esb-title">Location</span>
                            <span>{{ esbData.emergencyInfo.location }}</span>
                        </td>
                        <td>
                            <span class="esb-title">Response Tier</span>
                            <div id="rcorners" :style="tierColour(esbData.emergencyInfo.responseTierData)">
                                <span>Tier {{ esbData.emergencyInfo.responseTierData }}</span>
                            </div>
                        </td>
                    </tr>
                </table>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex id="temp" xs12 md9 class="white border-bottom border-left">
                <v-layout row wrap id="nature-weather">
                    <v-flex id="nature-of-emergency-title" xs12 class="primaryGreen white--text font-weight-medium">
                        NATURE OF EMERGENCY / CRISIS
                    </v-flex>
                    <v-flex id="nature-of-emergency" xs12 class="pa-0">
                        <table style="height:100%">
                            <tr class="white black--text">
                                <td style="width:25%">
                                    <span class="esb-title">HSE & Process Safety</span>
                                    <span>{{ esbData.natureOfEmergency.hsseAndProcessSafety.hsseType }}</span>
                                </td>
                                <td style="width:25%">
                                    <span class="esb-title">Total Released Volume</span>
                                    <span
                                        >{{ esbData.natureOfEmergency.hsseAndProcessSafety.releasedVolume }}
                                        {{ esbData.natureOfEmergency.hsseAndProcessSafety.volumeUnit }}</span
                                    >
                                </td>
                                <td style="width:25%">
                                    <span class="esb-title">Recovered Volume</span>
                                    <span
                                        >{{ esbData.natureOfEmergency.hsseAndProcessSafety.recoveredVolume }}
                                        {{ esbData.natureOfEmergency.hsseAndProcessSafety.volumeUnit }}</span
                                    >
                                </td>
                                <td style="width:25%">
                                    <span class="esb-title">Others</span>
                                    <span>{{ esbData.natureOfEmergency.hsseAndProcessSafety.others }}</span>
                                </td>
                            </tr>
                            <tr class="white black--text ">
                                <td colspan="3" style="width:75%;">
                                    <span class="esb-title">Security</span>
                                    <span>{{ esbData.natureOfEmergency.security.hsseType }}</span>
                                </td>
                                <td style="width:25%;">
                                    <span class="esb-title">Others</span>
                                    <span>{{ esbData.natureOfEmergency.security.others }}</span>
                                </td>
                            </tr>
                            <tr class="white black--text ">
                                <td colspan="3" style="width:75%;">
                                    <span class="esb-title">Transportation</span>
                                    <span>{{ esbData.natureOfEmergency.transportation.hsseType }}</span>
                                </td>
                                <td style="width:25%;">
                                    <span class="esb-title">Others</span>
                                    <span>{{ esbData.natureOfEmergency.transportation.others }}</span>
                                </td>
                            </tr>
                            <tr class="white black--text ">
                                <td colspan="3" style="width:75%;">
                                    <span class="esb-title">Natural Disaster</span>
                                    <span>{{ esbData.natureOfEmergency.naturalDisaster.hsseType }}</span>
                                </td>
                                <td style="width:25%;">
                                    <span class="esb-title">Others</span>
                                    <span>{{ esbData.natureOfEmergency.naturalDisaster.others }}</span>
                                </td>
                            </tr>
                        </table>
                    </v-flex>
                </v-layout>
                <v-layout row wrap>
                    <v-flex xs12 md7 pa-0>
                        <v-flex xs12 class="primaryGreen white--text border-right font-weight-medium">
                            WEATHER STATUS
                        </v-flex>
                        <v-flex xs12 class="pa-0" style="height: 200px; overflow-y: auto;">
                            <table id="WeatherStatus">
                                <tbody>
                                    <tr class="primaryGreen--text esb-title">
                                        <td>Date & Time</td>
                                        <td>Weather</td>
                                        <td>Wind Direction</td>
                                        <td>Wind Speed</td>
                                    </tr>
                                    <tr v-for="(weather, index) in esbData.weatherStatus">
                                        <td>{{ toDateTime(weather.dateCr) }}</td>
                                        <td>{{ weather.weather }}</td>
                                        <td>{{ getWindDirection(index) }}</td>
                                        <td>{{ weather.windSpeed }} {{ weather.windSpeedUnit }}</td>
                                    </tr>
                                    <tr v-for="i in esbData.weatherStatus.length" class="white black--text "></tr>
                                </tbody>
                            </table>
                        </v-flex>
                    </v-flex>
                    <v-flex xs12 md5 pa-0>
                        <v-flex xs12 class="primaryGreen white--text font-weight-medium">
                            EMERGENCY CONTACT NUMBER
                        </v-flex>
                        <v-flex id="emergency-contact" xs12 class="pa-0" style="height: 200px; overflow-y: auto;">
                            <table id="EmCtctNum">
                                <tbody>
                                    <tr class="primaryGreen--text esb-title">
                                        <td>Agencies</td>
                                        <td>Contact No</td>
                                    </tr>
                                    <tr v-for="contact in esbData.emergencyContactNo" class="white black--text border">
                                        <td>{{ returnValue(contact.agencies) }}</td>
                                        <td>{{ returnValue(contact.contactNo) }}</td>
                                    </tr>
                                    <tr v-for="i in esbData.emergencyContactNo.length" class="white black--text"></tr>
                                </tbody>
                            </table>
                        </v-flex>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12 md3 class="white border-bottom border-left border-right">
                <v-layout row wrap>
                    <v-flex xs12 class="primaryGreen white--text font-weight-medium">
                        RESPONSE PRIORITIES
                    </v-flex>
                    <v-flex xs12 id="response-priorities" class="pa-0 border-1" style="height: 235px; overflow-y: auto;">
                        <table id="ResPri" class="text-left">
                            <tbody>
                                <tr v-for="(resp, index) in esbData.responsePrioritiesData">
                                    <td>{{ index + 1 }}</td>
                                    <td class="text-md-left">{{ returnValue(resp.response) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12 class="text-right pa-0 pt-3">
                <v-btn
                    v-if="userCanPerformAction"
                    small
                    depressed
                    color="primaryGreen"
                    class="white--text mr-0 ml-0"
                    @click="gotoUpdate"
                    >Edit</v-btn
                >
            </v-flex>
        </v-layout>
        <v-layout row wrap v-if="userCanPerformAction && userTeam">
            <v-flex class="pa-0 pt-3" md6 xs12>
                <v-card>
                    <table id="standDownTable">
                        <tbody>
                            <th class="primaryGreen border-right white--text">
                                LEVEL
                            </th>
                            <th class="primaryGreen white--text">
                                STATUS
                            </th>
                            <tr v-if="userTeam === 'ERT'">
                                <td>Emergency Response Team</td>
                                <td>
                                    <v-switch
                                        class="pt-0 mt-0"
                                        @change="openDialogStandDown('ERT', ertStandDownSwitch)"
                                        v-model="ertStandDownSwitch"
                                        hide-details
                                        label="Stand Down"
                                    ></v-switch>
                                </td>
                            </tr>
                            <tr v-if="userTeam === 'EMT'">
                                <td>Emergency Management Team</td>
                                <td>
                                    <v-switch
                                        class="pt-0 mt-0"
                                        @change="openDialogStandDown('EMT', emtStandDownSwitch)"
                                        v-model="emtStandDownSwitch"
                                        hide-details
                                        label="Stand Down"
                                    ></v-switch>
                                </td>
                            </tr>
                            <tr v-if="userTeam === 'BCMT'">
                                <td>Business Crisis Management Team</td>
                                <td>
                                    <v-switch
                                        class="pt-0 mt-0"
                                        @change="openDialogStandDown('BCMT', bcmtStandDownSwitch)"
                                        v-model="bcmtStandDownSwitch"
                                        hide-details
                                        label="Stand Down"
                                    ></v-switch>
                                </td>
                            </tr>
                            <tr v-if="userTeam === 'PCMT'">
                                <td>PETRONAS Group Crisis Management Team</td>
                                <td>
                                    <v-switch
                                        class="pt-0 mt-0"
                                        @change="openDialogStandDown('PCMT', pcmtStandDownSwitch)"
                                        v-model="pcmtStandDownSwitch"
                                        hide-details
                                        label="Stand Down"
                                    ></v-switch>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout row wrap v-if="$store.getters.userPermission == 'System Admin'">
            <v-flex class="pa-0 pt-3" md6 xs12>
                <v-card>
                    <table id="standDownTable">
                        <tbody>
                            <tr>
                                <td>
                                    <v-switch
                                        class="pt-0 mt-0"
                                        @change="openDialogEmergency('Close Emergency', closedEmergencySwitch)"
                                        v-model="closedEmergencySwitch"
                                        hide-details
                                    ></v-switch>
                                </td>
                                <td>Closed Emergency</td>
                            </tr>
                            <tr>
                                <td>
                                    <v-switch
                                        class="pt-0 mt-0"
                                        @change="openDialogEmergency('Archive Emergency', archivedEmergencySwitch)"
                                        v-model="archivedEmergencySwitch"
                                        hide-details
                                    ></v-switch>
                                </td>
                                <td>Archive Emergency</td>
                            </tr>
                        </tbody>
                    </table>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="emergencyStatusDialog" max-width="600px">
            <v-card>
                <v-container grid-list-xl>
                    <v-card-text class="mb-0 pb-0">
                        <h1 class="pa-md-4 mx-lg-auto primaryGreen--text text-center">
                            Are you sure want to {{ disclaimerEmergencyStatus }} the emergency?
                        </h1>
                        <!-- <h1 class="primaryGreen--text text-center">{{selectedDept}}?</h1> -->
                        <p>
                            <br /><b>Disclaimer:</b><br />{{ selectedDept }} is only be made once all the emergency reporting is
                            completed and there is no any further update required.
                        </p>
                        <p>Please check and ensure all the actions listed in ELS had been completed.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text class="elevation-0" color="primaryGreen" @click="closeStandDown">No</v-btn>
                        <v-btn class="elevation-0" color="primaryGreen white--text" @click="submitEmergencyStatus">Yes</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog persistent v-model="standDownDialog" max-width="600px">
            <v-card>
                <v-container grid-list-xl>
                    <v-card-text class="mb-0 pb-0">
                        <h1 class="pa-md-4 mx-lg-auto primaryGreen--text text-center">
                            Are you sure want to {{ disclaimerStatus }} for
                        </h1>
                        <h1 class="primaryGreen--text text-center">{{ selectedDept }}?</h1>
                        <p>
                            <br /><b>Disclaimer:</b><br />
                            Stand Down Declaration is only be made once the emergency is contained or situation under control and
                            there is no possibility of further escalation.
                        </p>
                        <p>Please check and ensure all the actions listed in ELS had been completed.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text class="elevation-0" color="primaryGreen" @click="closeStandDown">No</v-btn>
                        <v-btn class="elevation-0" color="primaryGreen white--text" @click="submitStandDown">Yes</v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import momentTZ from 'moment-timezone'

export default {
    data() {
        return {
            listOfWindDirection: [
                { text: 'N', icon: '\u{2193}' },
                { text: 'NE', icon: '\u{2199}' },
                { text: 'E', icon: '\u{2190}' },
                { text: 'SE', icon: '\u{2196}' },
                { text: 'S', icon: '\u{2191}' },
                { text: 'SW', icon: '\u{2197}' },
                { text: 'W', icon: '\u{2192}' },
                { text: 'NW', icon: '\u{2198}' },
            ],
            closeCaseData: '',
            standDownData: '',
            updateDescriptionCloseCase: '',
            closeCaseTimeFormat: '',
            disclaimerStatus: '',
            disclaimerEmergencyStatus: '',
            closeCaseTime: false,
            closeCaseDateFormat: '',
            closeCaseDate: null,
            closeCaseSwitch: false,
            confirmDialog: false,
            standDownDialog: false,
            emergencyStatusDialog: false,
            selectedDept: '',
            ertStandDownSwitch: false,
            emtStandDownSwitch: false,
            bcmtStandDownSwitch: false,
            pcmtStandDownSwitch: false,
            closedEmergencySwitch: false,
            archivedEmergencySwitch: false,
            esbData: {
                natureOfEmergency: {
                    hsseAndProcessSafety: {
                        id: '',
                        natureOfEmergencyId: '',
                        hsseType: '',
                        releasedVolume: '',
                        recoveredVolume: '',
                        volumeUnit: '',
                        others: '',
                    },
                    security: {
                        id: '',
                        natureOfEmergencyId: '',
                        hsseType: '',
                        others: '',
                    },
                    transportation: {
                        id: '',
                        natureOfEmergencyId: '',
                        hsseType: '',
                        others: '',
                    },
                    naturalDisaster: {
                        id: '',
                        natureOfEmergencyId: '',
                        hsseType: '',
                        others: '',
                    },
                },

                weatherStatus: [
                    {
                        dateCr: '',
                        windDirection: '',
                        windSpeed: '',
                        windSpeedUnit: '',
                    },
                ],
                emergencyContactNo: [
                    {
                        agencies: '',
                        contactNo: '',
                    },
                ],
                responsePrioritiesData: [
                    {
                        response: '',
                    },
                ],
                emergencyInfo: {
                    phoneNumber: '',
                    faxNumber: '',
                    radioChannel: '',
                    emergencyName: '',
                    location: '',
                    mode: '',
                    responseTierData: '',
                    dateCr: '',
                },
            },
        }
    },
    computed: {},
    methods: {
        getWindDirection(index) {
            if ((this.esbData.weatherStatus[0].windDirection === null) | (this.esbData.weatherStatus[0].windDirection === '')) {
                return ''
            } else {
                if (this.esbData.weatherStatus[index].windDirection) {
                    const direction = this.esbData.weatherStatus[index].windDirection
                    const unicode = this.listOfWindDirection.find((item) => {
                        return item.text === this.esbData.weatherStatus[index].windDirection
                    })
                    if (unicode.icon) {
                        return `${direction} ${unicode.icon}`
                    }
                }
            }
        },
        openDialogStandDown(val, state) {
            this.selectedDept = val
            if (state == true) {
                this.disclaimerStatus = 'Stand Down'
            } else {
                this.disclaimerStatus = 'Reactivate'
            }
            this.standDownDialog = true
        },
        openDialogEmergency(val, state) {
            this.selectedDept = val
            if (val == 'Close Emergency' && state == true) {
                this.disclaimerEmergencyStatus = 'close'
            } else if (val == 'Archive Emergency' && state == true) {
                this.disclaimerEmergencyStatus = 'archive'
            }
            this.emergencyStatusDialog = true
        },
        closeStandDown() {
            switch (this.selectedDept) {
                case 'ERT':
                    this.ertStandDownSwitch = !this.ertStandDownSwitch
                    break
                case 'EMT':
                    this.emtStandDownSwitch = !this.emtStandDownSwitch
                    break
                case 'BCMT':
                    this.bcmtStandDownSwitch = !this.bcmtStandDownSwitch
                    break
                case 'PCMT':
                    this.pcmtStandDownSwitch = !this.pcmtStandDownSwitch
                    break
                case 'Close Emergency':
                    this.closedEmergencySwitch = !this.closedEmergencySwitch
                    break
                case 'Archive Emergency':
                    this.archivedEmergencySwitch = !this.archivedEmergencySwitch
                    break
                default:
            }
            this.standDownDialog = false
            this.emergencyStatusDialog = false
        },
        submitStandDown() {
            this.postStandDownData()
            this.updateStandDown()
        },
        postStandDownData() {
            let eventValue = ''

            switch (this.selectedDept) {
                case 'ERT':
                    if (this.ertStandDownSwitch == true) {
                        eventValue = `${this.selectedDept} is stand down`
                    } else {
                        eventValue = `${this.selectedDept} is reactivated`
                    }
                    break
                case 'EMT':
                    if (this.emtStandDownSwitch == true) {
                        eventValue = `${this.selectedDept} is stand down`
                    } else {
                        eventValue = `${this.selectedDept} is reactivated`
                    }
                    break
                case 'BCMT':
                    if (this.bcmtStandDownSwitch == true) {
                        eventValue = `${this.selectedDept} is stand down`
                    } else {
                        eventValue = `${this.selectedDept} is reactivated`
                    }
                    break
                case 'PCMT':
                    if (this.pcmtStandDownSwitch == true) {
                        eventValue = `${this.selectedDept} is stand down`
                    } else {
                        eventValue = `${this.selectedDept} is reactivated`
                    }
                    break
                default:
            }

            const id = `${this.$route.params.id}-${Date.now()}`
            const emergencyId = this.$route.params.id
            const payload = {
                id: id,
                emergencyId: emergencyId,
                dateCr: momentTZ.tz(Date.now(), 'Asia/Kuala_Lumpur').format('YYYY-MM-DDTHH:mm:ss'),
                logger: this.selectedDept,
                from: this.selectedDept,
                to: '',
                event: eventValue,
                status: 'Completed',
                pic: this.selectedDept,
                remarks: `Status Completed at ${momentTZ.tz(Date.now(), 'Asia/Kuala_Lumpur').format('YYYY-MM-DD HH:mm')}`,
            }
            axios
                .post(`${process.env.VUE_APP_API_URL}/eventlog/add`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getStandDown()
                })
                .catch((error) => {
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
                    //console.log(response.data);
                    if (response.data.standDownERT == 'true') {
                        this.ertStandDownSwitch = true
                    } else {
                        this.ertStandDownSwitch = false
                    }

                    if (response.data.standDownEMT == 'true') {
                        this.emtStandDownSwitch = true
                    } else {
                        this.emtStandDownSwitch = false
                    }

                    if (response.data.standDownBCMT == 'true') {
                        this.bcmtStandDownSwitch = true
                    } else {
                        this.bcmtStandDownSwitch = false
                    }

                    if (response.data.standDownPCMT == 'true') {
                        this.pcmtStandDownSwitch = true
                    } else {
                        this.pcmtStandDownSwitch = false
                    }

                    if (response.data.closedStatus == 'true') {
                        this.closedEmergencySwitch = true
                    } else {
                        this.closedEmergencySwitch = false
                    }

                    if (response.data.archivedStatus == 'true') {
                        this.archivedEmergencySwitch = true
                    } else {
                        this.archivedEmergencySwitch = false
                    }
                    this.standDownData = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        updateStandDown() {
            let payload = this.standDownData

            payload = {
                ...this.standDownData,
                id: this.standDownData.id,
                standdownRemarks: this.updateDescriptionStandDown,
                standownDate: '',
            }

            switch (this.selectedDept) {
                case 'ERT':
                    if (this.ertStandDownSwitch == true) {
                        payload['standDownERT'] = 'true'
                    } else {
                        payload['standDownERT'] = 'false'
                    }
                    break
                case 'EMT':
                    if (this.emtStandDownSwitch == true) {
                        payload['standDownEMT'] = 'true'
                    } else {
                        payload['standDownEMT'] = 'false'
                    }
                    break
                case 'BCMT':
                    if (this.bcmtStandDownSwitch == true) {
                        payload['standDownBCMT'] = 'true'
                    } else {
                        payload['standDownBCMT'] = 'false'
                    }
                    break
                case 'PCMT':
                    if (this.pcmtStandDownSwitch == true) {
                        payload['standDownPCMT'] = 'true'
                    } else {
                        payload['standDownPCMT'] = 'false'
                    }
                    break
                default:
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/emergency/standown/${this.selectedDept}`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.standDownDialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        submitEmergencyStatus() {
            switch (this.selectedDept) {
                case 'Close Emergency':
                    if (this.closedEmergencySwitch === true) {
                        this.closedEmergencyStatus()
                    } else {
                        this.closedEmergencyStatus()
                    }
                    break
                case 'Archive Emergency':
                    if (this.archivedEmergencySwitch === true) {
                        this.archivedEmergencyStatus()
                    } else {
                        this.archivedEmergencyStatus()
                    }
                    break
                default:
            }
        },
        closedEmergencyStatus() {
            let payload = this.standDownData
            payload = {
                ...this.standDownData,
                id: this.standDownData.id,
                closedStatus: this.standDownData.closedStatus,
                closedRemarks: this.standDownData.closedRemarks,
            }

            if (this.closedEmergencySwitch == true) {
                payload['closedStatus'] = 'true'
            } else {
                payload['closedStatus'] = 'false'
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/emergency/closed`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.emergencyStatusDialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        archivedEmergencyStatus() {
            let payload = this.standDownData
            payload = {
                ...this.standDownData,
                id: this.standDownData.id,
                archivedStatus: this.standDownData.archivedStatus,
            }

            if (this.archivedEmergencySwitch == true) {
                payload['archivedStatus'] = 'true'
            } else {
                payload['archivedStatus'] = 'false'
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/emergency/archived`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.emergencyStatusDialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        tierColour(tier) {
            if (tier == '1') {
                return 'background-color: green; color: white'
            } else if (tier == '2') {
                return 'background-color: orange; color: white'
            } else if (tier == '3') {
                return 'background-color: red; color: white'
            }
        },
        toDateTime(date) {
            return moment(date).format('DD-MMM-YYYY HH:mm:ss')
        },
        gotoUpdate() {
            this.$router.push(`/statusboard/incidentfactsupdate/${this.$route.params.id}`)
        },
        returnValue(val) {
            if (val == null) {
                return '-'
            } else {
                return val
            }
        },
        // setDivHeight() {
        //     const elemHeight = document.querySelector('#nature-weather').offsetHeight
        //     document.querySelector('#emergency-contact').style.height = `${elemHeight}px`
        //     document.querySelector('#emergency-contact').style.overflow = 'auto'
        //     document.querySelector('#response-priorities').style.height = `${elemHeight}px`
        //     document.querySelector('#response-priorities').style.overflow = 'auto'
        // }
    },
    watch: {
        standDownSwitch(val) {
            if (val == true) {
                this.disclaimerStatus = 'Stand Down'
            } else {
                this.disclaimerStatus = 'Reactivate'
            }
        },
    },
    mounted() {
        axios
            .get(`${process.env.VUE_APP_API_URL}/emergency/${this.$route.params.id}`, {
                headers: {
                    Authorization: 'Bearer ' + this.$store.getters.user.token,
                },
            })
            .then((response) => {
                this.esbData = response.data
                this.esbData.responsePrioritiesData.sort(function(a, b) {
                    var x = a.id.toLowerCase()
                    var y = b.id.toLowerCase()
                    if (x < y) {
                        return -1
                    }
                    if (x > y) {
                        return 1
                    }
                    return 0
                })
                this.esbData.weatherStatus.sort(function(a, b) {
                    var x = a.id.toLowerCase()
                    var y = b.id.toLowerCase()
                    if (x < y) {
                        return -1
                    }
                    if (x > y) {
                        return 1
                    }
                    return 0
                })
                //console.log(this.esbData)
                // this.setDivHeight()
            })
            .catch((error) => {
                console.log(error)
            })
        this.getStandDown()
    },
}
</script>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}

td,
th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}

#EmCtctNum tr td:nth-child(1) {
    width: 50%;
}

#ResPri tr td:nth-child(1) {
    width: 20%;
    text-align: center;
}

#ResPri tbody tr:nth-child(odd) {
    background-color: #c6c9ce !important;
}

#standDownTable tbody tr td,
th {
    padding: 15px;
}

span {
    display: block;
    width: 100%;
}

.esb-title {
    font-size: 10px;
    color: rgb(000, 177, 169);
}

.border-1 {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.bordertop {
    border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-right {
    border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-left {
    border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.scroll {
    overflow-y: auto;
}

#rcorners {
    border-radius: 4px;
    text-align: center;
    width: 70px;
    height: 25px;
    line-height: 25px;
    font-size: 13px;
}

/* #rcorners {
border-radius: 4px;
text-align: center;
width: 90px;
height: 30px;
line-height: 30px;
} */
</style>
