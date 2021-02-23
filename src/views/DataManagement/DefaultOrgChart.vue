<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs6>
                <h4>Organization Chart: {{ facilityName }}</h4>
            </v-flex>
            <v-spacer></v-spacer>
            <v-btn text @click="gotoPage('/datamanagement/facilitylist')">
                <v-icon color="gray">mdi-arrow-left</v-icon>
                Back to Facility List
            </v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-toolbar dense class="elevation-1 white">
                        <v-overflow-btn
                            v-if="$vuetify.breakpoint.xsOnly"
                            :items="emergencyTeams"
                            item-text="mode"
                            item-value="mode"
                            v-model="currEmergencyTeam"
                            hide-details
                            class="pa-0"
                            overflow
                            @change="loadChartData(facility, currEmergencyTeam)"
                        ></v-overflow-btn>
                        <v-overflow-btn
                            v-else
                            :items="emergencyTeams"
                            item-text="text"
                            item-value="mode"
                            v-model="currEmergencyTeam"
                            hide-details
                            class="pa-0"
                            overflow
                            @change="loadChartData(facility, currEmergencyTeam)"
                        ></v-overflow-btn>
                        <v-divider class="mx-2" vertical></v-divider>
                        <v-btn-toggle v-model="currTeamTypeIndex" mandatory color="primaryDarkGrey">
                            <v-btn
                                v-for="(type, index) in emergencyTeamTypes"
                                :key="index"
                                :value="index"
                                text
                                height="36"
                                @change="createChart(currEmergencyTeam, type.value, orgChartData)"
                            >
                                <v-icon color="primaryDarkGrey">{{ type.icon }}</v-icon>
                                {{ type.text }}
                            </v-btn>
                        </v-btn-toggle>
                    </v-toolbar>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout wrap>
            <v-flex xs12>
                <v-card>
                    <v-container id="chartcontainer" ref="chartcontainer"></v-container>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog eager v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Edit Organization Chart</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pt-0">
                    <v-container grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-select
                                    v-model="color"
                                    label="Template"
                                    :items="templateColor"
                                    @change="setChartTemplate"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="title" label="Title"></v-text-field>
                            </v-flex>
                            <v-flex xs12 v-if="descriptionInput">
                                <v-text-field v-model="description" label="Decription"></v-text-field>
                            </v-flex>
                            <template v-if="currTeamTypeIndex === 0">
                                <v-flex xs12>
                                    <v-text-field v-model="name" label="Name"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field v-model="phone" label="Contact No"></v-text-field>
                                </v-flex>
                            </template>
                            <template v-else>
                                <v-flex xs12>
                                    <v-text-field v-model="altname" label="Alt Name"></v-text-field>
                                </v-flex>
                                <v-flex xs12>
                                    <v-text-field v-model="altphone" label="Alt Contact No"></v-text-field>
                                </v-flex>
                            </template>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn id="btn-cancel" @click="dialog = false" small outlined depressed color="primaryGreen">Cancel</v-btn>
                    <v-btn id="btn-save" @click="updateChart(currNodeID)" small dark depressed color="primaryGreen">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios'
import OrgChart from '@/vendor/orgchart'

function EditForm() {
    this.nodeId = null
}

export default {
    data() {
        return {
            OrgChart: {},
            currNodeID: '',
            facilityInfo: [],
            title: '',
            description: '',
            descriptionInput: false,
            name: '',
            phone: '',
            altname: '',
            altphone: '',
            chart: {},
            chartType: '',
            dialog: false,
            facility: '',
            currEmergencyTeam: 'ERT',
            currTeamTypeIndex: 0,
            color: 'Standard (Green)',
            templateItems: [
                { tag: 'ERT', color: 'Standard (Green)' },
                { tag: 'EMT', color: 'Standard (Purple)' },
                { tag: 'BCMT1a', color: 'Standard (Blue)' },
                { tag: 'BCMT1b', color: 'Standard (Yellow)' },
                { tag: 'ERT,assistant', color: 'Assistant (Green)' },
                { tag: 'EMT,assistant', color: 'Assistant (Purple)' },
                { tag: 'BCMT1a,assistant', color: 'Assistant (Blue)' },
                { tag: 'BCMT1b,assistant', color: 'Assistant (Yellow)' },
                { tag: 'ERTDESC', color: 'Standard with Description (Green)' },
                { tag: 'ERTDESC,assistant', color: 'Standard with Description (Green)' },
            ],
            emergencyTeams: [
                { text: 'Emergency Response Team', mode: 'ERT' },
                { text: 'Emergency Management Team', mode: 'EMT' },
                { text: 'Business Crisis Management Team 1', mode: 'BCMT1' },
                // { text: 'Business Crisis Management Team 2', mode: 'BCMT2'},
                { text: 'PETRONAS Group Crisis Management Team', mode: 'PCMT' },
                // { text: 'Overall', mode: 'ALL'}
            ],
            emergencyTeamTypes: [
                { text: 'Primary', value: '', icon: 'mdi-format-align-left' },
                { text: 'Alternate', value: 'alt', icon: 'mdi-format-align-center' },
            ],
            orgChartData: [],
        }
    },
    methods: {
        getTag() {
            return this.templateItems.filter((item) => item.color === this.color).map((item) => item.tag)
        },
        updateChart(nodeId) {
            let node = this.chart.get(nodeId)
            const [tag] = this.getTag()
            node.tag = tag
            node.tags = this.getTag()
            node.title = this.title
            node.titledescription = this.description
            if (this.currTeamTypeIndex === 0) {
                node.name = this.name
                node.phone = this.phone
            } else {
                node.altname = this.altname
                node.altphone = this.altphone
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityorganization/edit`, node, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.chart.updateNode(node)
                    this.loadChartData(this.facility, this.currEmergencyTeam)
                    this.dialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        showUpdateChartDialog(nodeId) {
            this.currNodeID = nodeId
            this.dialog = true
            let node = this.chart.get(nodeId)
            if (!node.tag) {
                this.color = 'Standard (Green)'
            } else {
                const templateItem = this.templateItems.find((item) => item.tag === node.tag)
                this.color = templateItem.color
            }
            this.title = node.title
            this.description = node.titledescription
            if (node.titledescription) {
                this.descriptionInput = true
            } else {
                this.descriptionInput = false
            }
            this.name = node.name
            this.phone = node.phone
            this.altname = node.altname
            this.altphone = node.altphone
        },
        createChart(team, chartType, chartData) {
            const VM = this
            const facility = this.facility
            const currEmergencyTeam = this.currEmergencyTeam
            this.chartType = chartType
            this.chart = new OrgChart(this.$refs.chartcontainer, {
                nodeMouseClick: OrgChart.action.edit,
                onUpdate(sender, oldNode, newNode) {
                    // console.log('chart onUpdate')
                },
                onAdd(sender, node) {
                    console.log('Add node', node)
                    const newNode = {
                        ...node,
                        altname: '',
                        altphone: '',
                        facilityId: facility,
                        name: '',
                        phone: '',
                        tag: 'ERT',
                        tags: ['ERT'],
                        team: currEmergencyTeam,
                        title: '',
                        titledescription: '',
                    }

                    axios
                        .post(`${process.env.VUE_APP_API_URL}/facilityorganization/add`, newNode, {
                            headers: {
                                Authorization: 'Bearer ' + VM.$store.getters.user.token,
                            },
                        })
                        .then((response) => {
                            console.log('Add node', newNode)
                            VM.loadChartData(facility, currEmergencyTeam)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                },
                onRemove(sender, nodeId) {
                    console.log('Remove node', nodeId)
                    if (VM.orgChartData.length <= 1) {
                        console.log('Root node cannot be removed')
                        return false
                    } else {
                        axios
                            .get(`${process.env.VUE_APP_API_URL}/facilityorganization/delete/${nodeId}`, {
                                headers: {
                                    Authorization: 'Bearer ' + VM.$store.getters.user.token,
                                },
                            })
                            .then((response) => {
                                console.log('Remove node', nodeId)
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                },
                nodeBinding: {
                    field_0: 'title',
                    field_1: `${chartType}name`,
                    field_2: `${chartType}phone`,
                    field_3: 'titledescription',
                },
                nodeMenu: {
                    edit: { text: 'Edit' },
                    add: { text: 'Add' },
                    remove: { text: 'Remove' },
                },
                editUI: new EditForm(),
                toolbar: {
                    layout: true,
                    zoom: true,
                    fit: true,
                    expandAll: true,
                },
                tags: {
                    ERT: { template: 'ERT' },
                    EMT: { template: 'EMT' },
                    BCMT1a: { template: 'BCMT1a' },
                    BCMT1b: { template: 'BCMT1b' },
                    BCMT2: { template: 'BCMT2' },
                    ERTDESC: { template: 'ERTDESC' },
                    assistant: { template: 'ula' },
                },
                nodes: this.orgChartData,
            })
            if (this.orgChartData.length > 5) this.chart.fit()
        },
        loadChartData(facility, team) {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityorganization/${facility}?team=${team}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.orgChartData = response.data
                    this.createChart(this.currEmergencyTeam, this.chartType, this.orgChartData)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        setChartTemplate(color) {
            if (color === 'Standard with Description (Green)') this.descriptionInput = true
            else this.descriptionInput = false
        },
        initChartTemplate() {
            const customNodeMenuButtonCircular = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,300,130)" control-node-menu-id="{id}">
            <rect x="-4" y="-16" fill="#000000" fill-opacity="0" width="36" height="36"></rect>
            <circle cx="-5" cy="6" r="3" fill="#666666" />
            <circle cx="5" cy="6" r="3" fill="#666666" />
            <circle cx="15" cy="6" r="3" fill="#666666" />
            </g>`

            const customNodeMenuButtonCircularDescription = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,300,160)" control-node-menu-id="{id}">
            <rect x="-4" y="-16" fill="#000000" fill-opacity="0" width="36" height="36"></rect>
            <circle cx="-5" cy="6" r="3" fill="#666666" />
            <circle cx="5" cy="6" r="3" fill="#666666" />
            <circle cx="15" cy="6" r="3" fill="#666666" />
            </g>`

            const customNodeMenuButtonVerticalLine = `<g style="cursor:pointer;" transform="matrix(1,0,0,1,300,130)" control-node-menu-id="{id}">
             <rect x="-4" y="-16" fill="#000000" fill-opacity="0" width="36" height="36"></rect>
             <line x1="4" y1="0" x2="4" y2="15" stroke-width="3" stroke="#666666" />
             <line x1="12" y1="0" x2="12" y2="15" stroke-width="3" stroke="#666666" />
             <line x1="20" y1="0" x2="20" y2="15" stroke-width="3" stroke="#666666" />
             </g>`

            // ERT TEMPLATE
            OrgChart.templates.ERT = Object.assign({}, OrgChart.templates.ana)
            OrgChart.templates.ERT.size = [330, 165]
            OrgChart.templates.ERT.node =
                '<rect x="0" y="0" width="330" height="50" fill="#00B1A9" stroke-width="1" stroke="#FFF"></rect>' +
                '<rect x="0" y="50" width="330" height="100" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>'
            OrgChart.templates.ERT.field_0 =
                '<text style="font-size: 18px;" fill="#FFFFFF" x="165" y="30" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERT.field_1 =
                '<text style="font-size: 18px;" fill="#666" x="165" y="80" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERT.field_2 =
                '<text style="font-size: 16px;" fill="#666" x="165" y="110" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERT.nodeMenuButton = customNodeMenuButtonCircular

            OrgChart.templates.ERT.ripple = {
                radius: 0,
                color: '#000000',
                rect: null,
            }

            // EMT TEMPLATE
            OrgChart.templates.EMT = Object.assign({}, OrgChart.templates.ana)
            OrgChart.templates.EMT.size = [330, 130]
            OrgChart.templates.EMT.node =
                '<rect x="0" y="0" width="330" height="50" fill="#615E9A" stroke-width="1" stroke="#FFF"></rect>' +
                '<rect x="0" y="50" width="330" height="100" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>'
            OrgChart.templates.EMT.field_0 =
                '<text style="font-size: 18px;" fill="#FFFFFF" x="165" y="30" text-anchor="middle">{val}</text>'
            OrgChart.templates.EMT.field_1 =
                '<text style="font-size: 18px;" fill="#666" x="165" y="80" text-anchor="middle">{val}</text>'
            OrgChart.templates.EMT.field_2 =
                '<text style="font-size: 16px;" fill="#666" x="165" y="110" text-anchor="middle">{val}</text>'
            OrgChart.templates.EMT.nodeMenuButton = customNodeMenuButtonCircular

            OrgChart.templates.EMT.ripple = {
                radius: 0,
                color: '#000000',
                rect: null,
            }

            // BCMT1A TEMPLATE
            OrgChart.templates.BCMT1a = Object.assign({}, OrgChart.templates.ana)
            OrgChart.templates.BCMT1a.size = [330, 130]
            OrgChart.templates.BCMT1a.node =
                '<rect x="0" y="0" width="330" height="50" fill="#2e75b5" stroke-width="1" stroke="#FFF"></rect>' +
                '<rect x="0" y="50" width="330" height="100" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>'
            OrgChart.templates.BCMT1a.field_0 =
                '<text style="font-size: 18px;" fill="#FFFFFF" x="165" y="30" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT1a.field_1 =
                '<text style="font-size: 18px;" text-overflow="multiline" width="300" fill="#666" x="165" y="80" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT1a.field_2 =
                '<text style="font-size: 16px;" fill="#666" x="165" y="110" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT1a.nodeMenuButton = customNodeMenuButtonCircular

            OrgChart.templates.BCMT1a.ripple = {
                radius: 0,
                color: '#000000',
                rect: null,
            }

            // BCMT1B TEMPLATE
            OrgChart.templates.BCMT1b = Object.assign({}, OrgChart.templates.ana)
            OrgChart.templates.BCMT1b.size = [330, 130]
            OrgChart.templates.BCMT1b.node =
                '<rect x="0" y="0" width="330" height="50" fill="#ffc000" stroke-width="1" stroke="#FFF"></rect>' +
                '<rect x="0" y="50" width="330" height="100" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>'
            OrgChart.templates.BCMT1b.field_0 =
                '<text style="font-size: 18px;" fill="#FFFFFF" x="165" y="30" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT1b.field_1 =
                '<text style="font-size: 18px;" text-overflow="multiline" width="300" fill="#666" x="165" y="80" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT1b.field_2 =
                '<text style="font-size: 16px;" fill="#666" x="165" y="110" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT1b.nodeMenuButton = customNodeMenuButtonCircular

            OrgChart.templates.BCMT1b.ripple = {
                radius: 0,
                color: '#000000',
                rect: null,
            }

            // BCMT2 TEMPLATE
            OrgChart.templates.BCMT2 = Object.assign({}, OrgChart.templates.ana)
            OrgChart.templates.BCMT2.size = [330, 130]
            OrgChart.templates.BCMT2.node =
                '<rect x="0" y="0" width="330" height="50" fill="#548235" stroke-width="1" stroke="#FFF"></rect>' +
                '<rect x="0" y="50" width="330" height="100" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>'
            OrgChart.templates.BCMT2.field_0 =
                '<text style="font-size: 18px;" fill="#FFFFFF" x="165" y="30" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT2.field_1 =
                '<text style="font-size: 18px;" fill="#666" x="165" y="80" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT2.field_2 =
                '<text style="font-size: 16px;" fill="#666" x="165" y="110" text-anchor="middle">{val}</text>'
            OrgChart.templates.BCMT2.nodeMenuButton = customNodeMenuButtonCircular

            OrgChart.templates.BCMT2.ripple = {
                radius: 0,
                color: '#000000',
                rect: null,
            }

            // ERT DESCRIPTION TEMPLATE
            OrgChart.templates.ERTDESC = Object.assign({}, OrgChart.templates.ana)
            OrgChart.templates.ERTDESC.size = [330, 180]
            OrgChart.templates.ERTDESC.node =
                '<rect x="0" y="0" width="330" height="80" fill="#00B1A9" stroke-width="1" stroke="#FFF"></rect>' +
                '<rect x="0" y="80" width="330" height="100" fill="#ffffff" stroke-width="1" stroke="#aeaeae"></rect>'
            OrgChart.templates.ERTDESC.field_0 =
                '<text style="font-size: 18px;" fill="#FFFFFF" x="165" y="30" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERTDESC.field_1 =
                '<text style="font-size: 18px;" fill="#666" x="165" y="110" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERTDESC.field_2 =
                '<text style="font-size: 16px;" fill="#666" x="165" y="140" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERTDESC.field_3 =
                '<text style="font-size: 16px;" text-overflow="multiline" width="300" fill="#FFFFFF" x="165" y="50" text-anchor="middle">{val}</text>'
            OrgChart.templates.ERTDESC.nodeMenuButton = customNodeMenuButtonCircularDescription

            OrgChart.templates.ERTDESC.ripple = {
                radius: 0,
                color: '#000000',
                rect: null,
            }
        },
    },
    computed: {
        templateColor() {
            return this.templateItems.map((item) => item.color)
        },
        facilityName() {
            if (this.facilityInfo.length) {
                const [facility] = this.facilityInfo
                return facility.facilityName
            } else {
                return ''
            }
        },
    },
    created() {
        const VM = this
        let tempID = null

        EditForm.prototype.init = function(obj) {
            //console.log('Load Chart Options')
        }

        EditForm.prototype.show = function(nodeId) {
            tempID = nodeId
            this.nodeId = nodeId
            VM.showUpdateChartDialog(nodeId)
        }

        EditForm.prototype.hide = function(nodeId) {
            VM.dialog = false
        }
    },
    mounted() {
        this.initChartTemplate()
        this.facility = this.$route.params.id
        this.loadChartData(this.facility, this.currEmergencyTeam)
        axios
            .get(`${process.env.VUE_APP_API_URL}/facility/${this.facility}`, {
                headers: {
                    Authorization: 'Bearer ' + this.$store.getters.user.token,
                },
            })
            .then((response) => {
                this.facilityInfo = response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
}
</script>

<style lang="scss" scoped>
#chartcontainer {
    height: 700px;
}
</style>
