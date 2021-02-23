<template>
    <div>
        <v-card flat class="pa-5">
            <v-card-text class="mt-5">
                <h1 class="primaryGreen--text">Foam application estimator for full surface tank fires using fixed equipment</h1>
            </v-card-text>
        </v-card>
        <v-layout row wrap>
            <v-flex xs12 md4>
                <v-card flat class="px-5 pb-5">
                    <v-card-text>
                        <v-radio-group v-model="unit" @change="removeSeparators" label="Unit:" row>
                            <v-radio label="Metric" value="metric"></v-radio>
                            <v-radio label="Imperial" value="imperial"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            v-if="unit == 'metric'"
                            v-model="calculator.tankDiameter"
                            label="Tank Diameter"
                            @change="convertToImperial"
                            @keydown="numberOnly"
                            @keyup="checkValue"
                            @focus="removeSeparators()"
                            suffix="Meter(s)"
                        ></v-text-field>
                        <v-text-field
                            v-if="unit == 'imperial'"
                            v-model="calculator.tankDiameterImp"
                            label="Tank Diameter"
                            @change="convertToMetric"
                            @keydown="numberOnly"
                            @keyup="checkValue"
                            @focus="removeSeparators()"
                            suffix="Feet"
                        ></v-text-field>
                        <v-radio-group label="Concentration" row v-model="calculator.concentration">
                            <v-radio label="1%" value="1"></v-radio>
                            <v-radio label="3%" value="3"></v-radio>
                            <v-radio label="6%" value="6"></v-radio>
                        </v-radio-group>
                        <v-text-field
                            v-if="unit == 'metric'"
                            v-model="calculator.applicationRate"
                            label="Application Rate"
                            @change="convertToImperial"
                            @keydown="numberOnly"
                            suffix="LPM/m²"
                        ></v-text-field>
                        <v-text-field
                            v-if="unit == 'imperial'"
                            v-model="calculator.applicationRateImp"
                            label="Application Rate"
                            @change="convertToMetric"
                            @keydown="numberOnly"
                            suffix="GPM/m²"
                        ></v-text-field>
                        <v-text-field
                            v-model="calculator.duration"
                            label="Application Time"
                            @keydown="numberOnly"
                            suffix="Minutes"
                        ></v-text-field>
                        <v-btn class="mt-4" depressed block color="primaryGreen white--text" @click="calculate">Calculate</v-btn>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12 md8>
                <v-card absolute class="elevation-7 mb-8" :style="{ left: '50%', transform: 'translateX(-50%)' }" width="80%">
                    <v-card-text>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>Flow Premix</v-subheader>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.flowPremix"
                                    label="Metric"
                                    placeholder="0.00"
                                    suffix="L/min"
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.flowPremixImp"
                                    label="Imperial"
                                    placeholder="0.00"
                                    suffix="Gal/min"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>Flow Concentrate</v-subheader>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.flowConcentrate"
                                    label="Metric"
                                    placeholder="0.00"
                                    suffix="L/min"
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.flowConcentrateImp"
                                    label="Imperial"
                                    placeholder="0.00"
                                    suffix="Gal/min"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>Total Premix</v-subheader>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.totalPremix"
                                    label="Metric"
                                    placeholder="0.00"
                                    suffix="M³"
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.totalPremixImp"
                                    label="Imperial"
                                    placeholder="0.00"
                                    suffix="Gal"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>Total Required Concentrate</v-subheader>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.totalConcentrate"
                                    label="Metric"
                                    placeholder="0.00"
                                    suffix="L"
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.totalConcentrateImp"
                                    label="Imperial"
                                    placeholder="0.00"
                                    suffix="Gal"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="3">
                                <v-subheader>Total Water Required</v-subheader>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.totalWater"
                                    label="Metric"
                                    placeholder="0.00"
                                    suffix="M³"
                                    readonly
                                ></v-text-field>
                            </v-col>
                            <v-col cols="4">
                                <v-text-field
                                    v-model="calculator.totalWaterImp"
                                    label="Imperial"
                                    placeholder="0.00"
                                    suffix="Gal"
                                    readonly
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <v-card tile color="primaryGreen" class="px-5 pb-5">
            <v-card-text>
                <h4 class="pt-3 white--text">Application Rate:</h4>
                <p class="mb-0 white--text">
                    0.1 US GPM/m² foam premix per square foot (4.1 LPM/M²) up to 45m (150ft diameter) 0.15 US Gal/min foam premix
                    per square foot (6litre minute per square metre) more than to 45m (150ft) diameter<br />
                </p>

                <h4 class="pt-3 white--text">Application Time:</h4>
                <p class="mb-0 white--text">55 minutes<br /></p>
                <div class="pt-3">
                    <table width="100%">
                        <tr>
                            <th width="40%" class="white--text">Rate of burn in a tank</th>
                            <th width="30%" class="white--text">cm/hr</th>
                            <th width="30%" class="white--text">in/hr</th>
                        </tr>
                    </table>

                    <table border="2" rules="cols" style="background-color: #fff" width="100%">
                        <tr>
                            <td align="center" width="40%">Crude Oil</td>
                            <td align="center" width="30%">10 to 40</td>
                            <td align="center" width="30%">4 to 16</td>
                        </tr>
                        <tr>
                            <td align="center" width="40%">Diesel, Jet</td>
                            <td align="center" width="30%">13 to 20</td>
                            <td align="center" width="30%">5 to 8</td>
                        </tr>
                        <tr>
                            <td align="center" width="40%">Fuel Oil</td>
                            <td align="center" width="30%">8 to 15</td>
                            <td align="center" width="30%">3 to 6</td>
                        </tr>
                        <tr>
                            <td align="center" width="40%">Gasoline</td>
                            <td align="center" width="30%">15 to 30</td>
                            <td align="center" width="30%">3 to 12</td>
                        </tr>
                    </table>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import numbersOnly from '@/mixins/numbersOnly'

export default {
    data() {
        return {
            unit: 'metric',
            calculator: {
                tankDiameter: 6,
                tankDiameterImp: 20,
                concentration: '3',
                applicationRate: 4.1,
                applicationRateImp: 0.1025,
                duration: 55,
                flowPremix: null,
                flowConcentrate: null,
                totalPremix: null,
                totalConcentrate: null,
                totalWater: null,
                flowPremixImp: null,
                flowConcentrateImp: null,
                totalPremixImp: null,
                totalConcentrateImp: null,
                totalWaterImp: null,
            },
        }
    },
    watch: {
        tab(val) {
            this.convertToImperial()
        },
    },
    methods: {
        convertToMetric() {
            this.calculator.tankDiameter = (this.calculator.tankDiameterImp / 3.281).toFixed(0)
            this.calculator.applicationRate = this.calculator.applicationRateImp * 40
        },
        convertToImperial() {
            console.log('changed')
            this.calculator.tankDiameterImp = (this.calculator.tankDiameter * 3.281).toFixed(0)
            this.calculator.applicationRateImp = this.calculator.applicationRate / 40
        },
        checkValue(evt) {
            if (this.calculator.tankDiameter > 45 || this.calculator.tankDiameterImp > 148) {
                this.calculator.applicationRate = 6
                this.calculator.applicationRateImp = this.calculator.applicationRate / 40
            } else {
                this.calculator.applicationRate = 4.1
                this.calculator.applicationRateImp = this.calculator.applicationRate / 40
            }
        },
        thousandsSeparators(num) {
            if (num !== null) {
                let numParts = num.toString().split('.')
                numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return numParts.join('.')
            }
        },
        removeSeparators() {
            let mafa = this.calculator.tankDiameter
            if (isNaN(mafa)) {
                mafa = mafa.replace(/,/g, '')
                this.calculator.tankDiameter = mafa
            }

            let maqa = this.calculator.tankDiameterImp
            if (isNaN(maqa)) {
                maqa = maqa.replace(/,/g, '')
                this.calculator.tankDiameterImp = maqa
            }
        },
        calculate() {
            this.removeSeparators()
            let rootSurfaceArea = (this.calculator.tankDiameter * this.calculator.tankDiameter * 3.142) / 4
            let rsa = rootSurfaceArea
            rootSurfaceArea = parseFloat(rsa).toFixed(2)
            rootSurfaceArea = this.thousandsSeparators(rootSurfaceArea)
            this.calculator.tankDiameter = this.thousandsSeparators(this.calculator.tankDiameter)

            this.calculator.tankDiameterImp = this.thousandsSeparators(this.calculator.tankDiameterImp)

            this.calculator.flowPremix = rsa * this.calculator.applicationRate
            let talpm = this.calculator.flowPremix
            this.calculator.flowPremix = parseFloat(talpm).toFixed(0)
            this.calculator.flowPremix = this.thousandsSeparators(this.calculator.flowPremix)

            this.calculator.flowPremixImp = talpm / 3.7854
            let tagpm = this.calculator.flowPremixImp
            this.calculator.flowPremixImp = parseFloat(tagpm).toFixed(0)
            this.calculator.flowPremixImp = this.thousandsSeparators(this.calculator.flowPremixImp)

            this.calculator.flowConcentrate = talpm * (parseInt(this.calculator.concentration, 10) / 100)
            let fcv = this.calculator.flowConcentrate
            this.calculator.flowConcentrate = parseFloat(fcv).toFixed(2)
            this.calculator.flowConcentrate = this.thousandsSeparators(this.calculator.flowConcentrate)

            this.calculator.flowConcentrateImp = fcv / 3.7854
            let fcvgpm = this.calculator.flowConcentrateImp
            this.calculator.flowConcentrateImp = parseFloat(fcvgpm).toFixed(2)
            this.calculator.flowConcentrateImp = this.thousandsSeparators(this.calculator.flowConcentrateImp)

            let water = 100 - parseInt(this.calculator.concentration, 10)

            this.calculator.totalConcentrate =
                talpm * (parseInt(this.calculator.concentration, 10) / 100) * this.calculator.duration
            let tfcr = this.calculator.totalConcentrate
            this.calculator.totalConcentrate = parseFloat(tfcr).toFixed(0)
            this.calculator.totalConcentrate = this.thousandsSeparators(this.calculator.totalConcentrate)

            this.calculator.totalConcentrateImp = parseFloat(tfcr).toFixed(0) / 3.7854
            let tfcrg = this.calculator.totalConcentrateImp
            this.calculator.totalConcentrateImp = parseFloat(tfcrg).toFixed(0)
            this.calculator.totalConcentrateImp = this.thousandsSeparators(this.calculator.totalConcentrateImp)

            this.calculator.totalPremix = (talpm * (water / 100) * this.calculator.duration) / 1000
            let twr = this.calculator.totalPremix
            this.calculator.totalPremix = parseFloat(twr).toFixed(0)
            this.calculator.totalPremix = this.thousandsSeparators(this.calculator.totalPremix)

            this.calculator.totalPremixImp = parseFloat(twr).toFixed(0) * 264.17205234375
            let twrg = this.calculator.totalPremixImp
            this.calculator.totalPremixImp = parseFloat(twrg).toFixed(0)
            this.calculator.totalPremixImp = this.thousandsSeparators(this.calculator.totalPremixImp)

            this.calculator.totalWater = parseFloat(parseFloat(twr).toFixed(0) / 0.001).toFixed(0) / 1000
            this.calculator.totalWater = this.thousandsSeparators(this.calculator.totalWater)

            this.calculator.totalWaterImp = (parseFloat(parseFloat(twr).toFixed(0) / 0.001) / 3.785).toFixed(0)
            this.calculator.totalWaterImp = this.thousandsSeparators(this.calculator.totalWaterImp)
        },
    },
    computed: {},
    mounted() {},
}
</script>

<style lang="css" scoped></style>
