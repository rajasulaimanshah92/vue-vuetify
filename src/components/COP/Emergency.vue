<template>
    <v-container grid-list-lg id="create-emergency" pa-5>
        <v-layout row wrap>
            <v-flex xs12>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                >
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout class="primaryGreen" row wrap>
                                <v-flex class="white--text text-center font-weight-medium" xs4 style="padding:6px; border-right: 1px solid #dddddd">
                                    HQ : {{ hqDateTime }}
                                </v-flex>
                                <v-flex class="white--text text-center font-weight-medium" xs4 style="padding:6px; border-right: 1px solid #dddddd;">
                                    INCIDENT FACTS
                                </v-flex>
                                <v-flex  class="white--text text-center font-weight-medium" xs4 style="padding:6px; 1px solid #dddddd;">
                                    SITE : {{ siteDateTime }}
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                    ECC PHONE NO
                                </v-flex>
                                <v-flex xs12 md2>
                                    <v-text-field
                                      name="name"
                                      label="Phone Number"
                                      hide-details
                                      placeholder=" "
                                      v-model="formData.emergencyInfo.phoneNumber"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md1 class="primaryDarkGrey white--text font-weight-medium">
                                    ECC FAX NO
                                </v-flex>
                                <v-flex xs12 md3>
                                    <v-text-field
                                      name="name"
                                      label="Fax Number"
                                      placeholder=" "
                                      hide-details
                                      v-model="formData.emergencyInfo.faxNumber"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                    RADIO CHANNEL / FREQ
                                </v-flex>
                                <v-flex xs12 md2>
                                    <v-text-field
                                      name="name"
                                      label="Radio Channel / Freq"
                                      placeholder=" "
                                      hide-details
                                      v-model="formData.emergencyInfo.radioChannel"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                    EMERGENCY NAME
                                </v-flex>
                                <v-flex xs12 md6>
                                    <v-text-field
                                      ref="emergencyfocus"
                                      name="name"
                                      label="Emergency Name"
                                      placeholder=" "
                                      hide-details
                                      :rules="nameEmergency"
                                      required
                                      v-model="formData.emergencyInfo.emergencyName"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                    RESPONSE TIER
                                </v-flex>
                                <v-flex xs12 md2>
                                    <v-container grid-list-xs,sm,md,lg,xl fluid>
                                        <v-layout justify-center align-center row wrap text-center>
                                            <v-flex xs4 v-for="(column,index) in responseTier" :class= "{ [column.color]: column.isActive }" class="pointer border-1" @click="toggleResponseTier(index)">
                                                {{ column.text }}
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                    DATE
                                </v-flex>
                                <v-flex xs12 md2>
                                    <v-menu
                                      v-model="dateModal"
                                      :close-on-content-click="false"
                                      max-width="290"
                                    >
                                      <template v-slot:activator="{ on }">
                                        <v-text-field
                                          :value="computedDateFormattedMoment"
                                          clearable
                                          label="Date"
                                          prepend-icon="mdi-calendar"
                                          readonly
                                          v-on="on"
                                          hide-details
                                        ></v-text-field>
                                      </template>
                                      <v-date-picker
                                        v-model="formData.emergencyInfo.date"
                                        @change="dateModal = false"
                                        :value="moment(formData.emergencyInfo.date).format('Do MMMM YYYY')"
                                      ></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 md1 class="primaryDarkGrey white--text font-weight-medium">
                                    TIME
                                </v-flex>
                                <v-flex xs12 md3>
                                    <v-text-field
                                      name="name"
                                      label="Time"
                                      v-model="formData.emergencyInfo.time"
                                      hide-details
                                      @keydown="validateTime"
                                      @keyup="validateTime"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs4 md2 :class="{ bordertop: $vuetify.breakpoint.smAndDown }" class="primaryDarkGrey white--text font-weight-medium">
                                    LOCATION
                                </v-flex>
                                <v-flex xs8 md2 :class="{ bordertop: $vuetify.breakpoint.smAndDown }">
                                    <v-text-field
                                        v-model="formData.emergencyInfo.location"
                                        name="name"
                                        label="Location"
                                        readonly
                                        placeholder=" "
                                        hide-details
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex md10>
                                    <v-layout row wrap class="border-1">
                                        <v-flex xs12 class="primaryGreen white--text font-weight-medium">
                                            NATURE OF EMERGENCY / CRISIS
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap class="border-1">
                                        <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                            HSE & PROCESS SAFETY
                                        </v-flex>
                                        <v-flex xs12 md10>
                                            <v-layout row wrap>
                                                <v-flex xs4 md3 v-for="item in natureOfEmergencyStatus.row1"
                                                    class="border-1 pointer"
                                                    :class="{ accentOrange: item.isActive }"
                                                    @click="toggleBG(item)"
                                                    >
                                                    {{ item.text }}
                                                </v-flex>
                                                <v-flex xs4 md3 v-for="item in natureOfEmergencyStatus.row2"
                                                    class="border-1 pointer"
                                                    :class="{ accentOrange: item.isActive }"
                                                    @click="toggleBG(item)"
                                                    >
                                                    {{ item.text }}
                                                </v-flex>
                                                <v-flex xs4 md3 class="border-1 primaryDarkGrey white--text font-weight-medium">
                                                    TOTAL RELEASED VOLUME
                                                </v-flex>
                                                <v-flex xs12 md6 class="border-1">
                                                    <v-layout row wrap>
                                                        <v-flex xs6 md6>
                                                            <v-text-field
                                                              name="name"
                                                              v-model="formData.natureOfEmergency.hsseAndProcessSafety.releasedVolume"
                                                              label="Enter Volume"
                                                              placeholder=" "
                                                              hide-details
                                                              :disabled="!natureOfEmergencyStatus.row2[0].isActive && !natureOfEmergencyStatus.row3[0].isActive"
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-spacer></v-spacer>
                                                        <v-flex xs6 md6>
                                                            <v-select
                                                              :items="releasedVolumeData"
                                                              v-model="formData.natureOfEmergency.hsseAndProcessSafety.volumeUnit"
                                                              label="Unit"
                                                              placeholder=" "
                                                              hide-details
                                                              :disabled="!natureOfEmergencyStatus.row2[0].isActive && !natureOfEmergencyStatus.row3[0].isActive"
                                                              clearable
                                                            ></v-select>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                            <v-layout row wrap class="border-1">
                                                <v-flex xs12 md3>
                                                    <v-layout row wrap>
                                                        <v-flex xs6 md12 v-for="item in natureOfEmergencyStatus.row3"
                                                            class="border-1 pointer"
                                                            :class="{ accentOrange: item.isActive }"
                                                            @click="toggleBG(item)"
                                                            >
                                                            {{ item.text }}
                                                        </v-flex>
                                                        <v-flex xs6 md12 v-for="item in natureOfEmergencyStatus.row4"
                                                            class="border-1 pointer"
                                                            :class="{ accentOrange: item.isActive }"
                                                            @click="toggleBG(item)"
                                                            >
                                                            {{ item.text }}
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12 md3 d-flex>
                                                    <v-layout row wrap>
                                                        <v-flex xs12 class="border-1 primaryDarkGrey white--text font-weight-medium">
                                                            RECOVERED VOLUME
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs12 md6 class="border-1">
                                                    <v-layout row wrap>
                                                        <v-flex xs6 md6>
                                                            <v-text-field
                                                              label="Recovered Volume"
                                                              placeholder=" "
                                                              hide-details
                                                              v-model="formData.natureOfEmergency.hsseAndProcessSafety.recoveredVolume"
                                                              :disabled="!natureOfEmergencyStatus.row2[0].isActive && !natureOfEmergencyStatus.row3[0].isActive"
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs6 md6>
                                                            <v-select
                                                              :items="releasedVolumeData"
                                                              v-model="formData.natureOfEmergency.hsseAndProcessSafety.volumeUnit"
                                                              label="Unit"
                                                              placeholder=" "
                                                              hide-details
                                                              :disabled="!natureOfEmergencyStatus.row2[0].isActive && !natureOfEmergencyStatus.row3[0].isActive"
                                                              clearable
                                                            ></v-select>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs3 md3 class="primaryDarkGrey white--text font-weight-medium">
                                                    OTHERS
                                                </v-flex>
                                                <v-flex xs9 md9>
                                                    <v-text-field
                                                      name="name"
                                                      v-model="formData.natureOfEmergency.hsseAndProcessSafety.others"
                                                      label=""
                                                      hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap class="border-1">
                                        <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                            SECURITY
                                        </v-flex>
                                        <v-flex xs12 md10>
                                            <v-layout row wrap border-1>
                                                <v-flex xs4 md3 v-for="item in securityOptions"
                                                    class="border-1 pointer"
                                                    :class="{ accentOrange: item.isActive }"
                                                    @click="toggleBG(item)"
                                                    >
                                                    {{ item.text }}
                                                </v-flex>
                                                <v-flex xs3 md3 class="primaryDarkGrey white--text font-weight-medium">
                                                    OTHERS
                                                </v-flex>
                                                <v-flex xs9 md9>
                                                    <v-text-field
                                                      name="name"
                                                      v-model="formData.natureOfEmergency.security.others"
                                                      label=""
                                                      hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap class="border-1">
                                        <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                            TRANSPORTATION
                                        </v-flex>
                                        <v-flex xs12 md10>
                                            <v-layout row wrap>
                                                <v-flex xs4 md2 v-for="item in transportationOptions"
                                                    class="border-1 pointer"
                                                    :class="{ accentOrange: item.isActive }"
                                                    @click="toggleBG(item)"
                                                    >
                                                    {{ item.text }}
                                                </v-flex>
                                                <v-flex xs3 md2 class="primaryDarkGrey white--text font-weight-medium">
                                                    OTHERS
                                                </v-flex>
                                                <v-flex xs9 md4 class="border-1">
                                                    <v-text-field
                                                      name="name"
                                                      v-model="formData.natureOfEmergency.transportation.others"
                                                      label=""
                                                      hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap class="border-1">
                                        <v-flex xs12 md2 class="primaryDarkGrey white--text font-weight-medium">
                                            NATURAL DISASTER
                                        </v-flex>
                                        <v-flex xs12 md10>
                                            <v-layout row wrap>
                                                <v-flex xs4 md2 v-for="item in naturalDisasterOptions"
                                                    class="border-1 pointer"
                                                    :class="{ accentOrange: item.isActive }"
                                                    @click="toggleBG(item)"
                                                    >
                                                    {{ item.text }}
                                                </v-flex>
                                                <v-flex xs3 md2 class="primaryDarkGrey white--text font-weight-medium">
                                                    OTHERS
                                                </v-flex>
                                                <v-flex xs9 md4 class="border-1">
                                                    <v-text-field
                                                      name="name"
                                                      v-model="formData.natureOfEmergency.naturalDisaster.others"
                                                      label=""
                                                      hide-details
                                                    ></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex md2>
                                    <v-layout row wrap class="border-1">
                                        <v-flex xs12 class="primaryGreen white--text font-weight-medium" style="position: relative;">
                                            RESPONSE PRIORITIES
                                            <div style="position: absolute; top: 6px; right: 2px;">
                                                <v-icon fab dark color="white" @click="addResponse">mdi-plus-box</v-icon>
                                            </div>
                                        </v-flex>
                                        <v-flex xs12 class="pa-0">
                                            <v-card flat id="priorities-container" ref="responseDiv" :height="setResponsePrioritiesHeight">
                                                <table id="responsive-table">
                                                    <tr v-for="(n,i) in formData.responsePrioritiesData">
                                                        <td>{{ i + 1 }}</td>
                                                        <td>
                                                            <v-textarea
                                                              style=" margin: 0px;padding: 0px;"
                                                              label=""
                                                              hide-details
                                                              v-model="formData.responsePrioritiesData[i].response"
                                                            ></v-textarea>
                                                            <td><v-icon @click="removeResponse(i, formData.responsePrioritiesData)">mdi-delete</v-icon></td>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </v-card>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex md9>
                            <v-layout row wrap>
                                <v-flex xs12 class="primaryGreen white--text font-weight-medium" style="position: relative;">
                                    WEATHER STATUS
                                    <v-icon fab dark style="position: absolute; top: 6px; right: 4px;" color="white" @click="addRowWeather">mdi-plus-box</v-icon>
                                </v-flex>
                                <v-flex xs12 class="pa-0">
                                    <table id="weather-emergency-table" style="width:100%">
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Weather</th>
                                            <th>Wind Direction</th>
                                            <th colspan="3">Wind Speed</th>
                                        </tr>
                                        <template v-for="(list, index) in formData.weatherStatus">
                                            <tr>
                                                <td>
                                                    <v-layout row wrap>
                                                        <v-flex xs12 md5 >
                                                            <v-menu
                                                              v-model="list.menuDate"
                                                              :close-on-content-click="false"
                                                              max-width="290"
                                                            >
                                                                <template v-slot:activator="{ on }">
                                                                    <v-text-field
                                                                      :value="moment(list.weatherStatusDate).format('Do MMMM YYYY')"
                                                                      prepend-icon="mdi-calendar"
                                                                      clearable
                                                                      label="Date"
                                                                      readonly
                                                                      hide-details
                                                                      v-on="on"
                                                                    ></v-text-field>
                                                                </template>
                                                                <v-date-picker
                                                                    v-model="list.weatherStatusDate"
                                                                    @change="list.menuDate = false"
                                                                ></v-date-picker>
                                                            </v-menu>
                                                        </v-flex>
                                                        <v-flex xs12 md6 >
                                                          <v-text-field
                                                            name="name"
                                                            label="Time"
                                                            v-model="list.weatherStatusTime"
                                                            hide-details
                                                            @keydown="validateWeatherTime"
                                                            @keyup="validateWeatherTime"
                                                          ></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                </td>
                                                <td style="width:18%">
                                                    <v-select
                                                      style="width:100%"
                                                      :items="listOfWeather"
                                                      v-model="list.weather"
                                                      placeholder=" "
                                                      clearable
                                                    ></v-select>
                                                </td>
                                                <td style="width:18%">
                                                    <v-select
                                                      style="width:100%"
                                                      v-model='list.windDirection'
                                                      :items="listOfWindDirection"
                                                      placeholder=" "
                                                      clearable
                                                      prepend-inner-icon=""
                                                      item-text="text"
                                                      item-value="text"
                                                    >
                                                    <template slot="selection" slot-scope="data">
                                                      {{ data.item.text }} {{ data.item.icon }}
                                                    </template>
                                                    <template slot="item" slot-scope="data">
                                                      {{ data.item.text }} {{ data.item.icon }}
                                                    </template>
                                                </v-select>
                                                </td>
                                                <td style="border-right:none; width:10%">
                                                  <v-layout row wrap>
                                                    <v-flex xs12 md12>
                                                      <v-text-field
                                                          style="width:100%"
                                                          v-model="list.windSpeed"
                                                          placeholder=" "
                                                      ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 md12>
                                                      <v-select
                                                          style="width:100%"
                                                          :items="unitOfWindSpeed"
                                                          label="Unit"
                                                          v-model="list.windSpeedUnit"
                                                      ></v-select>
                                                    </v-flex>
                                                  </v-layout>
                                                </td>
                                                <td>
                                                    <v-icon @click="removeRow(index, formData.weatherStatus)">mdi-delete</v-icon>
                                                </td>
                                            </tr>
                                        </template>
                                    </table>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex md3>
                            <v-layout row wrap>
                                <v-flex xs12 class="primaryGreen white--text font-weight-medium" style="position: relative">
                                    EMERGENCY CONTACT NUMBER
                                    <v-icon fab dark style="position: absolute; top: 6px; right: 4px;" color="white" @click="addRowEmergency">mdi-plus-box</v-icon>
                                </v-flex>
                                <v-flex xs12 class="pa-0">
                                    <table id="weather-emergency-table">
                                        <tr>
                                            <th>Agencies</th>
                                            <th colspan="2">Contact No.</th>
                                        </tr>
                                        <template v-for="(list, index) in formData.emergencyContactNo">
                                            <tr>
                                                <td>
                                                    <v-text-field
                                                        v-model="list.agencies"
                                                        placeholder=" "
                                                    ></v-text-field>
                                                </td>
                                                <td>
                                                    <v-textarea
                                                        v-model="list.contactNo"
                                                        placeholder=" "
                                                        auto-grow
                                                        rows="1"
                                                    ></v-textarea>
                                                </td>
                                                <td>
                                                    <v-icon @click="removeRow(index, formData.emergencyContactNo)">mdi-delete</v-icon>
                                                </td>
                                            </tr>
                                        </template>
                                    </table>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <template v-if="update">
                        <v-layout row wrap>
                            <v-flex xs12 class="text-right pa-0 pt-3">
                                <v-btn small outlined depressed color="primaryGreen" @click="cancelUpdate">Cancel</v-btn>
                                <v-btn small depressed color="primaryGreen" class="white--text ml-2 mr-0" @click="updateEmergency">Update</v-btn>
                            </v-flex>
                        </v-layout>
                    </template>
                    <template v-else>
                        <v-layout row wrap>
                            <v-flex xs12 class="text-right pa-0 pt-3">
                                <v-btn depressed small outlined color="primaryGreen" dark @click="$router.push('/')">Cancel</v-btn>
                                <v-btn depressed small color="primaryGreen" class="white--text ml-2 mr-0" :disabled="!valid" :loading="loading" @click="createEmergency">Create</v-btn>
                            </v-flex>
                        </v-layout>
                    </template>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment'
import momentTZ from 'moment-timezone'
import axios from 'axios'

export default {
    data () {
        return {
            updateDescriptionCloseCase: '',
            closeCaseTimeFormat: moment().format('HH:mm'),
            closeCaseTime: false,
            closeCaseDateFormat: new Date().toISOString().substr(0, 10),
            closeCaseDate: null,
            closeCaseSwitch: '',
            dateCr: null,
            update: false,
            loading: false,
            valid: true,
            releasedVolumeData: ['m³', 'L', 'kg', 'bbl'],
            // listOfWindDirection: ['N \u{2193}', 'NE \u{2199}', 'E \u{2190}', 'SE \u{2196}', 'S \u{2191}', 'SW \u{2197}', 'W \u{2192}', 'NW \u{2198}'],
            listOfWeather: ['Sunny', 'Cloudy', 'Rainy', 'Windy', 'Snowy'],
            unitOfWindSpeed: ['m/s', 'knot'],
            date: new Date().toISOString().substr(0, 10),
            time: moment().format('HH:mm'),
            menu1: false,
            menu2: false,
            dateModal: false,
            dialog: false,
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
            nameEmergency: [
                v => !!v,
                v => (v && v.length <= 55)
            ],
            formData: {
                id:'',
                x: this.$route.query.x,
                y: this.$route.query.y,
                status: 'active',
                standdownRemarks: '',
                standdownDate: '',
                emergencyInfo: {
                    id:'',
                    mode:'',
                    location:'',
                    locationId:'',
                    hqDT: new Date().toISOString().substr(0, 10),
                    siteDT: new Date().toISOString().substr(0, 10),
                    phoneNumber: '',
                    faxNumber: '',
                    radioChannel: '',
                    emergencyName: '',
                    responseTierData: '1',
                    dateCr: null,
                    date: new Date().toISOString().substr(0, 10),
                    time: moment().format('HH:mm'),
                    timezone: '',
                    createdBy: ''
                },
                natureOfEmergency: {
                    hsseAndProcessSafety: {
                        type: [],
                        releasedVolume: '',
                        volumeUnit: '',
                        recoveredVolume: '',
                        others: ''
                    },
                    security: {
                        type: [],
                        others: ''
                    },
                    transportation: {
                        type: [],
                        others: ''
                    },
                    naturalDisaster: {
                        type: [],
                        others: ''
                    }
                },
                weatherStatus: [
                    {
                        weatherStatusDate: new Date().toISOString().substr(0, 10),
                        weatherStatusTime: moment().format('HH:mm'),
                        weatherTimezone: '',
                        weather: '',
                        windDirection: '',
                        windSpeed: '',
                        windSpeedUnit: '',
                        menuDate: false,
                        menuTime: false
                    }
                ],
                emergencyContactNo: [
                    {
                        agencies: '',
                        contactNo: ''
                    }
                ],
                responsePrioritiesData: [
                    {
                        id: '',
                        emergencyDataId: '',
                        response: ''
                    }
                ],
            },
            responseTier: [
                { isActive: true, text: '1', color:'green'},
                { isActive: false, text: '2', color:'orange' },
                { isActive: false, text: '3', color:'red' }
            ],
            natureOfEmergencyStatus: {
                row1: [
                    { isActive: false, text: 'FIRE'},
                    { isActive: false, text: 'EXPLOSION'},
                    { isActive: false, text: 'HAZMAT'},
                    { isActive: false, text: 'HI-PO', colspan: '2' },
                ],
                row2: [
                    { isActive: false, text: 'LO PC (LIQUID)', colspan:'2'}
                ],
                row3: [
                    { isActive: false, text: 'LO PC (GASEOUS)', colspan:'2' }
                ],
                row4: [
                    { isActive: false, text: 'SPILLAGE', colspan:'2' }
                ],
            },
            securityOptions: [
                { isActive: false, text: 'COMMUNITY DISTURBANCE'},
                { isActive: false, text: 'ENCROACHMENT / INTRUSION'},
                { isActive: false, text: 'BOMB THREAT'},
                { isActive: false, text: 'PIRACY' },
                { isActive: false, text: 'ROBBERY'},
                { isActive: false, text: 'DEMONSTRATION'},
                { isActive: false, text: 'HOSTAGE'},
                { isActive: false, text: 'KIDNAPPING' },
                { isActive: false, text: 'HIJACK'},
                { isActive: false, text: 'SEA ROBBERY'},
                { isActive: false, text: 'MURDER'},
                { isActive: false, text: 'TERRORIST ATTACK' }
            ],
            transportationOptions: [
                { isActive: false, text: 'LAND' },
                { isActive: false, text: 'WATER' },
                { isActive: false, text: 'AIR' }
            ],
            naturalDisasterOptions: [
                { isActive: false, text: 'FLOOD'},
                { isActive: false, text: 'EARTHQUAKE'},
                { isActive: false, text: 'TSUNAMI'}
            ],
        }
    },
    watch: {
        responseTier: {
            handler: function (val, oldVal) {
                val.forEach(el=>{
                    if (el.isActive == true) {
                        this.formData.emergencyInfo.responseTierData = el.text
                    }
                })
            },
            deep: true
        },
        releasedVolume: {
            handler: function (val, oldVal) {
                this.formData.natureOfEmergency.releasedVolume = []
                this.selectedArray(val, this.formData.natureOfEmergency.releasedVolume)
            },
            deep: true
        },
        natureOfEmergencyStatus: {
            handler: function (val, oldVal) {
                this.formData.natureOfEmergency.hsseAndProcessSafety.type = []
                this.selectedArray(val, this.formData.natureOfEmergency.hsseAndProcessSafety.type)
            },
            deep: true
        },
        securityOptions: {
            handler: function (val, oldVal) {
                this.formData.natureOfEmergency.security.type = [...val.filter(item => item.isActive === true).map(item => item.text)]
            },
            deep: true
        },
        transportationOptions: {
            handler: function (val, oldVal) {
                this.formData.natureOfEmergency.transportation.type = [...val.filter(item => item.isActive === true).map(item => item.text)]
            },
            deep: true
        },
        naturalDisasterOptions: {
            handler: function (val, oldVal) {
                this.formData.natureOfEmergency.naturalDisaster.type = [...val.filter(item => item.isActive === true).map(item => item.text)]
            },
            deep: true
        },
        chooseWeather: {
            handler: function (val, oldVal) {
                this.formData.weatherStatus.weather = []

                const keys = Object.keys(val)

                keys.forEach(el => {
                val[el].forEach(el=>{
                     if (el.isActive == true) {
                            this.formData.weatherStatus.weather.push(el)
                        }
                    })
                })
            },
            deep: true
        }
    },
    methods: {
        validateTime(evt) {
          console.log(this.formData.emergencyInfo.time);
            this.validate24HourFormat(evt, this.formData.emergencyInfo.time)
        },
        validateWeatherTime(evt) {
          for (let item in this.formData.weatherStatus) {
            // console.log(this.formData.weatherStatus[item].weatherStatusTime);
            this.validate24HourFormat(evt, this.formData.weatherStatus[item].weatherStatusTime)
          }
        },
        getEmergencyContact() {
            axios.get(`${process.env.VUE_APP_API_URL}/facilityinformation/contact/${this.$route.query.location}`, {
                headers: {
                  'Authorization': 'Bearer ' + this.$store.getters.user.token
                }
            })
            .then(response => {
                this.formData.emergencyContactNo = response.data
                // console.log('contact number');
            })
            .catch(response => {
                console.log(error);
            })
        },
        addRowEmergency() {
            let emergencyContactNo = {}
            if (this.update) {
            emergencyContactNo = {
                    agencies: '',
                    contactNo: '',
                    id: `${this.$route.params.id}-${Date.now()}`,
                    emergencyDataId: this.$route.params.id
                }
                this.formData.emergencyContactNo.push(emergencyContactNo)

                const payload = {
                  id: `${this.$route.params.id}-${Date.now()}`,
                  emergencyDataId: this.$route.params.id,
                }
                // console.log(payload);
                axios.post(`${process.env.VUE_APP_API_URL}/emergency/contact/add`, payload, {
                  headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.user.token
                  }
                })
                .then(response => {
                    console.log('done add contact priority');
                })
                .catch(response => {
                  console.log(error)
                })
            } else {
                emergencyContactNo = {
                    agencies: '',
                    contactNo: ''
                }
                this.formData.emergencyContactNo.push(emergencyContactNo)
            }
        },
        removeRow(index, array) {
            const [obj] = array
            let section = ''
            if (obj.hasOwnProperty('agencies')) section = 'contact'
            else section = 'weather'
            console.log(array);
            if (array.length > 1) {
                if (this.$route.name === 'Incident Facts Update') {
                    axios.get(`${process.env.VUE_APP_API_URL}/emergency/${section}/delete/${array[index].id}`, {
                       headers: {
                         'Authorization': 'Bearer ' + this.$store.getters.user.token
                       }
                   })
                   .then(response => {
                       array.splice(index, 1)
                   })
                   .catch(error => {
                     console.log(error)
                   })
                } else {
                    array.splice(index, 1)
                }
            } else {
                if (obj.hasOwnProperty('agencies')) {
                    obj.agencies = ''
                    obj.contactNo = ''
                } else {
                    obj.weatherStatusDate = new Date().toISOString().substr(0, 10)
                    obj.weatherStatusTime = moment().format('HH:mm')
                    obj.weatherTimezone = ''
                    obj.weather = ''
                    obj.windDirection = ''
                    obj.windSpeed = ''
                    obj.windSpeedUnit = ''
                    obj.menuDate = false
                    obj.menuTime = false
                }
            }
        },
        addRowWeather() {
            let weatherStatus = {}
            if (this.update) {
                weatherStatus = {
                     weatherStatusDate: new Date().toISOString().substr(0, 10),
                     weatherStatusTime: moment().format('HH:mm'),
                     weatherTimezone: '',
                     weather: '',
                     windDirection: '',
                     windSpeed: '',
                     windSpeedUnit: '',
                     menuDate: false,
                     menuTime: false,
                     id: `${this.$route.params.id}-${Date.now()}`,
                     emergencyDataId: this.$route.params.id
                }
                this.formData.weatherStatus.push(weatherStatus)

                const payload = {
                  id: `${this.$route.params.id}-${Date.now()}`,
                  emergencyDataId: this.$route.params.id,
                }
                // console.log(payload);
                axios.post(`${process.env.VUE_APP_API_URL}/emergency/weather/add`, payload, {
                  headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.user.token
                  }
                })
                .then(response => {
                    console.log('done add weather priority');
                })
                .catch(response => {
                  console.log(error)
                })
            } else {
                weatherStatus = {
                     weatherStatusDate: new Date().toISOString().substr(0, 10),
                     weatherStatusTime: moment().format('HH:mm'),
                     weatherTimezone: '',
                     weather: '',
                     windDirection: '',
                     windSpeed: '',
                     windSpeedUnit: '',
                     menuDate: false,
                     menuTime: false
                }
                this.formData.weatherStatus.push(weatherStatus)
            }
        },
        addResponse() {
            if (this.update) {
                let responsePrioritiesData = {
                    id: `${this.$route.params.id}-${Date.now()}`,
                    emergencyDataId: this.$route.params.id,
                    response: ''
                }
                this.formData.responsePrioritiesData.push(responsePrioritiesData)

                const payload = {
                    id: `${this.$route.params.id}-${Date.now()}`,
                    emergencyDataId: this.$route.params.id,
                }
                // console.log(payload);
                axios.post(`${process.env.VUE_APP_API_URL}/emergency/response/add`, payload, {
                    headers: {
                        'Authorization': 'Bearer ' + this.$store.getters.user.token
                    }
                })
                .then(response => {
                        console.log('done add response priority');
                })
                .catch(response => {
                    console.log(error)
                })
            } else {
                let responsePrioritiesData = {
                    id: '',
                    emergencyDataId: '',
                    response: ''
                }
                this.formData.responsePrioritiesData.push(responsePrioritiesData)
            }
        },
        removeResponse(index, array) {
            if (this.update) {
                axios.get(`${process.env.VUE_APP_API_URL}/emergency/response/delete/${array[index].id}`, {
                    headers: {
                      'Authorization': 'Bearer ' + this.$store.getters.user.token
                    }
                })
                .then(response => {
                    array.splice(index, 1)
                })
                .catch(error => {
                  console.log(error)
                })
            } else {
                this.formData.responsePrioritiesData.length > 1
                this.formData.responsePrioritiesData.splice(index, 1)
            }
        },
        createEmergency() {
            this.loading = true
            this.formData.emergencyInfo.timezone = this.convertToTimeZone(this.formData.emergencyInfo.date, this.formData.emergencyInfo.time)
            this.formData.emergencyInfo.id = `${this.formData.emergencyInfo.location}-${moment().format('x')}`
            this.formData.id = this.formData.emergencyInfo.id
            this.formData.emergencyInfo.dateCr = `${this.formData.emergencyInfo.date}T${this.formData.emergencyInfo.time}`
            this.formData.emergencyInfo.date = `${this.formData.emergencyInfo.date}T${this.formData.emergencyInfo.time}`
            this.formData.weatherStatus.map(obj => {
                return obj.dateCr = `${obj.weatherStatusDate}T${obj.weatherStatusTime}`,obj.weatherTimezone = this.convertToTimeZone(obj.weatherStatusDate, obj.weatherStatusTime)
            })
            this.formData.responsePrioritiesData.map((obj,index) => {
                return obj.id = `${this.formData.id}-${index}`,obj.emergencyDataId = this.formData.id
            })

            axios.post(`${process.env.VUE_APP_API_URL}/emergency/create`, this.formData , {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.user.token
                }
            })
            .then((response) => {
                this.loading = false
                this.$store.dispatch('setEmergencyID', this.formData.id)
                this.$store.dispatch('setEmergencyName', this.formData.emergencyInfo.emergencyName)
                this.gotoPage(`/statusboard/incidentfacts/${this.formData.id}`)

            })
            .catch(error => {
                this.loading = false
                console.log(error)
            })
        },
        updateEmergency() {
            this.loading = true
            this.formData.emergencyInfo.timezone = this.convertToTimeZone(this.formData.emergencyInfo.date, this.formData.emergencyInfo.time)
            this.formData.emergencyInfo.id = `${this.$route.params.id}`
            this.formData.id = this.formData.emergencyInfo.id
            this.formData.weatherStatus.weatherTimezone = this.convertToTimeZone(this.formData.weatherStatus.weatherStatusDate, this.formData.weatherStatus.weatherStatusTime)
            this.formData.emergencyInfo.dateCr = `${this.formData.emergencyInfo.date}T${this.formData.emergencyInfo.time}`

            this.formData.weatherStatus.map((obj,index) => {
                return obj.dateCr = `${obj.weatherStatusDate}T${obj.weatherStatusTime}`
            })
            console.log(this.formData.emergencyInfo.dateCr);
            console.log(this.formData)
            axios.post(`${process.env.VUE_APP_API_URL}/emergency/edit`, this.formData, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.user.token
                }
            })
            .then((response) => {
                this.loading = false
                this.$router.push(`/statusboard/incidentfacts/${this.$route.params.id}`)
                console.log(response);
            })
            .catch(error => {
                this.loading = false
                console.log(error)
            })
        },
        getData() {
            axios.get(`${process.env.VUE_APP_API_URL}/emergency/${this.$route.params.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + this.$store.getters.user.token
                }
            })
            .then(response => {
                this.formData = response.data
                this.formData.responsePrioritiesData.sort((a, b) => {
                    var x = a.id.toLowerCase();
                    var y = b.id.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                })
                this.formData.weatherStatus.map((obj,index) => {
                    return obj.dateCr = response.data.weatherStatus[index].dateCr ,
                    obj.id = response.data.weatherStatus[index].id ,
                    obj.emergencyDataId = response.data.weatherStatus[index].emergencyDataId,
                    obj.weatherStatusDate = moment(response.data.weatherStatus[index].dateCr).format('YYYY-MM-DD'),
                    obj.weatherStatusTime = moment(response.data.weatherStatus[index].dateCr).format('HH:mm')
                })
                this.formData.weatherStatus.sort((a, b) => {
                    var x = a.id.toLowerCase();
                    var y = b.id.toLowerCase();
                    if (x < y) {return -1;}
                    if (x > y) {return 1;}
                    return 0;
                })

                this.responseTier[0].isActive = false
                this.responseTier.forEach(obj => {
                    if(obj.text == this.formData.emergencyInfo.responseTierData){
                        obj.isActive = true
                    }
                })

                response.data.emergencyInfo.date = moment(response.data.emergencyInfo.dateCr).format('YYYY-MM-DD')
                response.data.emergencyInfo.time = moment(response.data.emergencyInfo.dateCr).format('HH:mm')
                if (this.formData.natureOfEmergency.hsseAndProcessSafety.hsseType){
                    this.formData.natureOfEmergency.hsseAndProcessSafety.type = this.formData.natureOfEmergency.hsseAndProcessSafety.hsseType.split(',')
                    Object.values(this.natureOfEmergencyStatus).forEach(arr => {
                        arr.forEach(obj => {
                            if(this.formData.natureOfEmergency.hsseAndProcessSafety.hsseType.split(',').includes(obj.text)){
                                obj.isActive = true
                            }
                        })
                    })
                }
                if (this.formData.natureOfEmergency.security.hsseType) {
                    this.activateType(this.securityOptions, this.formData.natureOfEmergency.security.hsseType.split(','))
                }
                if (this.formData.natureOfEmergency.transportation.hsseType){
                    this.activateType(this.transportationOptions, this.formData.natureOfEmergency.transportation.hsseType.split(','))
                }
                if (this.formData.natureOfEmergency.naturalDisaster.hsseType){
                    this.activateType(this.naturalDisasterOptions, this.formData.natureOfEmergency.naturalDisaster.hsseType.split(','))
                }
            })
            .catch(error => {
                // handle error
                console.log(error)
            })
        },
        cancelUpdate() {
            this.$router.push(`/statusboard/incidentfacts/${this.$route.params.id}`)
        },
        activateType(lists, types) {
            lists.forEach(item => {
                types.forEach(type => {
                    if (item.text === type) {
                        item.isActive = true
                    }
                })
            })
        },
        convertToTimeZone(date, time) {
            let timezone = momentTZ.tz(`${date} ${time}`, 'Asia/Kuala_Lumpur')
            return timezone.format()
        },
        toggleBG(item) {
            if (item.hasOwnProperty('isActive')) {
                item.isActive = !item.isActive
            }
        },
        toggleResponseTier(index) {
            this.responseTier.map((obj,i)=>{
                if (index === i) {
                    return obj.isActive = true
                } else {
                    return obj.isActive = false
                }
            })
        },
        selectedArray(val, array) {
            const keys = Object.keys(val)
            keys.forEach(el => {
                val[el].forEach(el => {
                    if (el.isActive == true) {
                        array.push(el.text)
                    }
                })
            })
        }
    },
    computed: {
        setResponsePrioritiesHeight() {
            if (this.$vuetify.breakpoint.smAndDown) {
                return 'auto'
            } else {
                return 557
            }
        },
        computedDateFormattedMoment() {
            return this.formData.emergencyInfo.date ? moment(this.formData.emergencyInfo.date).format('Do MMMM YYYY') : ''
        },
        hqDateTime() {
            const datetime = moment(new Date()).format('Do MMMM YYYY, h:mm:ss A')
            this.formData.emergencyInfo.hqDT = datetime
            return datetime
        },
        siteDateTime() {
            const datetime = moment(new Date()).format('Do MMMM YYYY, h:mm:ss A')
            this.formData.emergencyInfo.siteDT = datetime
            return datetime
        }
    },
    mounted(){
        this.getEmergencyContact()
        this.formData.emergencyInfo.mode = this.$route.query.mode
        this.formData.emergencyInfo.location = this.$route.query.location
        if (this.$route.name === 'Incident Facts Update') {
            this.update = true
            this.formData.id = this.$route.params.id
            this.getData()
        } else {
            this.update = false
            this.formData.id = `${this.$route.query.location}-${this.$route.query.mode.toUpperCase()}`
            this.$refs.emergencyfocus.focus()
        }
    }
}
</script>

<style lang="scss" scoped>
#create-emergency {
    font-size: 13px !important;
}

@media screen and (max-width: 600px) {
    #create-emergency {
        font-size: 11px !important;
    }
}

table {
    width:100%;
    border-collapse: collapse;
}

table th, table td {
    border: 1px solid #dddddd;
    padding: 3px;
}

table th {
    padding: 6px 2px;
    color: #FFF;
}

#priorities-container {
    overflow-y: scroll;
    border-radius: 0;
    border-top: 1px solid #dddddd;
    border-bottom: 1px solid #dddddd;
}

#responsive-table tr td:first-child {
    width: 48px;
    text-align:center;
}

#weather-emergency-table tr th {
    background-color: #263238;
    color:#FFF;
}

#weather-emergency-table tr td {
    text-align: center;
    padding: 2px;
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
</style>
