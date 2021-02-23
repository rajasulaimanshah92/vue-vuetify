<template lang="html">
    <section v-if="userIsAuthenticated">
        <v-navigation-drawer app :width="rightPanelSize" fixed right v-model="rightPanel" clipped>
            <template>
                <v-card class="elevation-0">
                    <v-tabs
                        v-model="tab"
                        height="38"
                        background-color="blue lighten-1"
                        color="accentPurple3"
                        grow
                        class="no-radius"
                    >
                        <v-tab v-for="item in checkOilSpill" :key="item" class="white--text">
                            {{ item }}
                        </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                        <v-tab-item key="Emergency">
                            <v-card flat>
                                <emergency :id="id"></emergency>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="Facility Info">
                            <v-card flat>
                                <facility-info :id="id"></facility-info>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="Chemical Info">
                            <v-card flat>
                                <chemical-info :id="id"></chemical-info>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item key="Oil Spill">
                            <v-card flat>
                                <oil-spill :id="id" :oilSpillAttributes="oilSpillAttributes"></oil-spill>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </template>
        </v-navigation-drawer>
        <!-- FIXED TEMPORARY RIGHT PANEL -->
        <v-navigation-drawer temporary right :width="rightPanelSize" v-model="rightDrawer" fixed></v-navigation-drawer>
    </section>
</template>

<script>
import axios from 'axios'
import { EventBus } from '@/main'
import Emergency from '@/components/RightPanelItems/Emergency'
import OilSpill from '@/components/RightPanelItems/OilSpill'
import FIDialog from '@/components/MapViewer/Dialog/FIDialog'
import CSHIDialog from '@/components/MapViewer/Dialog/CSHIDialog'

export default {
    components: {
        emergency: Emergency,
        'chemical-info': CSHIDialog,
        'facility-info': FIDialog,
        'oil-spill': OilSpill,
    },
    data() {
        return {
            rightPanel: false,
            rightDrawer: false,
            rightPanelWidth: 600,
            sectionPos: 0,
            tab: 0,
            id: '',
            tabItems: ['Emergency', 'Facility Info', 'Chemical Info', 'Oil Spill'],
            oilSpillAttributes: null,
        }
    },
    methods: {
        toggleRightPanel() {
            this.rightPanel = !this.rightPanel
        },
        hideRightPanel() {
            this.rightPanel = false
        },
        changeWidth(width) {
            if (this.$vuetify.breakpoint.xsOnly) {
                console.log('mobile view')
            } else {
                this.rightPanelWidth = width
                EventBus.$emit('hideLeftPanel')
            }
        },
        activateOilSpillTab() {
            this.tab = 3
        },
        getLocation() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/emergency/${this.$route.params.id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.id = response.data.emergencyInfo.location
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
    computed: {
        rightPanelSize() {
            return window.innerWidth / 2
        },
        checkOilSpill() {
            if (!this.oilSpillAttributes) {
                return this.tabItems.filter((val) => val != 'Oil Spill')
            }
            return this.tabItems
        },
    },
    created() {
        EventBus.$on('toggleRightPanel', (payload) => {
            this.toggleRightPanel()
        })
        EventBus.$on('hideRightPanel', (payload) => {
            this.hideRightPanel()
        })
    },
    mounted() {
        console.log(window.innerWidth / 2)
        this.getLocation()
        this.$root.$on('openOilSpillTab', (attributes) => {
            this.oilSpillAttributes = attributes
            this.activateOilSpillTab()
        })
    },
}
</script>

<style lang="scss" scoped>
.right-panel-section {
    #emergency-mapping {
        border-left: 1px solid #ccc;
    }
    #analysis {
        border-left: 1px solid #ccc;
    }
    .border-bottom-1 {
        border-bottom: 1px solid #ccc !important;
    }
}

.no-radius {
    border-radius: 0 !important;
}
</style>
