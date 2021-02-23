<template>
    <v-container grid-list-xs,sm,md,lg,xl>
        <v-layout row wrap>
            <v-flex v-if="scenario" xs12 pa-4 pt-1 pb-1>
                <Highcharts :options="chartOptions"></Highcharts>
            </v-flex>
            <v-flex v-else xs12 pa-4 pt-1 pb-1>
                <span>Please select scenario in View Scenarios tab.</span>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/main'

export default {
    data() {
        return {
            scenario: null,
            lineChart: {
                chart: {
                    type: 'line',
                    style: {
                        fontFamily: 'Roboto',
                    },
                },
                title: {
                    text: 'Scenario Test',
                    style: {
                        fontSize: '14px',
                    },
                },
                xAxis: {
                    categories: ['0 hours', '1 hours', '2 hours', '3 hours', '4 hours', '5 hours', '6 hours'],
                },
                yAxis: {
                    title: {
                        text: 'Tonnes',
                    },
                    gridLineColor: '#666666',
                    gridLineWidth: 0.2,
                    lineWidth: 1,
                    plotLines: [
                        {
                            color: '#FF0000',
                            width: 1,
                            value: 0,
                        },
                    ],
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                },
                plotOptions: {
                    series: {
                        label: {
                            connectorAllowed: false,
                        },
                    },
                },
                series: [
                    {
                        name: 'Water Column',
                        data: [0, 100, 80, 70, 60, 55, 50],
                    },
                    {
                        name: 'Surface',
                        data: [0, 25, 28, 31, 33, 37, 40],
                    },
                    {
                        name: 'Evaporated',
                        data: [0, 20, 27, 50, 46, 44, 45],
                    },
                    {
                        name: 'Ashore',
                        data: [0, 55, 60, 65, 75, 80, 90],
                    },
                ],
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 500,
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom',
                                },
                            },
                        },
                    ],
                },
                credits: {
                    enabled: false,
                },
            },
        }
    },
    // watch: {
    //   scenario(obj){
    //     console.log('TEST SCENARIO');
    //     this.setChartObject()
    //   }
    // },
    methods: {
        setChartObject() {
            if (!this.scenario) return

            this.lineChart.title.text = `Scenario ${this.scenario.name}`
            //https://rps.serasi.tech/petronas-oilmap/GetTimeSeries.aspx?CaseName=test_502_43819&Location=WORLD&ClientKey=W00ds1de337&UseEXE=false&ModelType=OILSPILL
            //axios.get(`${process.env.VUE_APP_API_URL}/oilmapscenario/event/${this.oilSpillAttributes.attributes.OBJECTID}`,{
            axios
                .get(`${process.env.VUE_APP_API_URL}/oilmapscenario/chart/${this.scenario.sid}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    if (res.data.length) {
                        // console.log(res.data);
                        this.lineChart.xAxis.categories = res.data.map((obj) => {
                            return obj.time + ' hours'
                        })
                        this.lineChart.series[0].data = res.data.map((obj) => {
                            return obj.waterColumn
                        })
                        this.lineChart.series[1].data = res.data.map((obj) => {
                            return obj.surface
                        })
                        this.lineChart.series[2].data = res.data.map((obj) => {
                            return obj.evaporated
                        })
                        this.lineChart.series[3].data = res.data.map((obj) => {
                            return obj.ashore
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
    },
    computed: {
        chartOptions() {
            return this.lineChart
        },
    },
    updated() {
        // console.log(this.$store.getters.getFatesGraphData);
        // this.scenario = this.$store.getters.getFatesGraphData
    },
    mounted() {
        // console.log(this.scenario);
        // console.log(this.$store.getters.getFatesGraphData);
        this.scenario = this.$store.getters.getFatesGraphData
        this.setChartObject()
        // this.$store.getters.getFatesGraphData
        EventBus.$on('sendDataToFatesGraph', (data) => {
            // console.log(data);
            this.scenario = data
            this.setChartObject()
        })
    },
}
</script>

<style lang="scss" scoped></style>
