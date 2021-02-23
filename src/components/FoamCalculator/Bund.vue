<template>
    <div>
        <v-card flat class="pa-5">
            <v-card-text class="mt-5">
                <h1 class="primaryGreen--text">Foam application estimator for bund (dike) fires</h1>
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
                            v-model="calculator.area"
                            label="Area"
                            @change="convertToImperial"
                            @keydown="numberOnly"
                            @focus="removeSeparators()"
                            suffix="m²"
                        ></v-text-field>
                        <v-text-field
                            v-if="unit == 'imperial'"
                            v-model="calculator.areaImp"
                            label="Area"
                            @change="convertToMetric"
                            @keydown="numberOnly"
                            @focus="removeSeparators()"
                            suffix="sqft"
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
                            label="Duration"
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
                                    suffix="Gal/min"
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
                    0.1 US LPM/m² foam premix per square root (4.1 GPM/m² minute per square metre)<br />
                </p>
                <h4 class="pt-3 white--text">Application Time:</h4>
                <p class="mb-0 white--text">60 minutes<br /></p>
                <div class="pt-3">
                    <h2 style="color: #fff;">
                        Fire on surfaces above 6,000 m² (65,000 ft²) are very difficult to tackle, and above 10,000 m² (108,000
                        ft²) would probably be impossible to entinguish. Needs above these values should therefore be only
                        considered as theoretical indications
                    </h2>
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
                area: 1,
                areaImp: 10.7639,
                concentration: '6',
                applicationRate: 4.1,
                applicationRateImp: 0.1025,
                duration: 60,
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
            this.calculator.area = parseFloat((this.calculator.areaImp / 10.7639).toFixed(4))
            this.calculator.applicationRate = this.calculator.applicationRateImp * 40
        },
        convertToImperial() {
            this.calculator.areaImp = parseFloat((this.calculator.area * 10.7639).toFixed(4))
            this.calculator.applicationRateImp = this.calculator.applicationRate / 40
        },
        thousandsSeparators(num) {
            if (num !== null) {
                let numParts = num.toString().split('.')
                numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                return numParts.join('.')
            }
        },
        removeSeparators() {
            let mafa = this.calculator.area
            if (isNaN(mafa)) {
                mafa = mafa.replace(/,/g, '')
                this.calculator.area = mafa
            }

            let maqa = this.calculator.areaImp
            if (isNaN(maqa)) {
                maqa = maqa.replace(/,/g, '')
                this.calculator.areaImp = maqa
            }
        },
        calculate() {
            this.removeSeparators()
            let rootSurfaceArea = this.calculator.area
            let rsa = rootSurfaceArea
            rootSurfaceArea = parseFloat(rsa).toFixed(2)
            rootSurfaceArea = this.thousandsSeparators(rootSurfaceArea)
            this.calculator.area = this.thousandsSeparators(this.calculator.area)

            this.calculator.areaImp = this.thousandsSeparators(this.calculator.areaImp)

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
