<template>
    <section>
        <v-list class="pt-0 pb-0" dense flat>
            <v-list-item
                value="true"
                active-class="active"
                color="primary"
                :to="`/statusboard/emergencylist?mode=${this.currMode}`"
            >
                <v-list-item-action>
                    <v-icon v-if="backToEmergency">mdi-view-list</v-icon>
                    <v-icon v-else>mdi-arrow-left</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">{{ modeTitle }} LIST</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list class="pt-0 pb-0" dense v-if="!hideELSMenu">
            <v-list-item-group color="primary">
                <v-list-item v-for="list in ELSLists" :key="list.text" :to="list.url + '/' + $store.getters.emergencyID">
                    <v-list-item-icon>
                        <v-icon v-text="list.icon"></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="font-weight-regular body-2" v-text="list.text"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </section>
</template>

<script>
export default {
    data() {
        return {
            modeTitle: 'EMERGENCY',
            currMode: 'emergency',
            ELSLists: [
                { icon: 'mdi-help-rhombus', text: 'Incident Facts', url: '/statusboard/incidentfacts' },
                { icon: 'mdi-map', text: 'Map', url: '/statusboard/map' },
                { icon: 'mdi-sitemap', text: 'Organization Chart', url: '/statusboard/organizationchart' },
                { icon: 'mdi-account-multiple', text: 'Headcount', url: '/statusboard/headcountmanagement' },
                { icon: 'mdi-calendar-text', text: 'Event Log', url: '/statusboard/eventlog' },
                { icon: 'mdi-note-multiple', text: 'Integration Log', url: '/statusboard/integrationlog' },
                { icon: 'mdi-google-circles-extended', text: 'Unit Log', url: '/statusboard/unitlog' },
                { icon: 'mdi-hospital', text: 'Casualties', url: '/statusboard/casualties' },
                { icon: 'mdi-clipboard', text: 'Resources', url: '/statusboard/resources' },
                { icon: 'mdi-forum', text: 'IAP', url: '/statusboard/incidentactionplan' },
                { icon: 'mdi-bell', text: 'Notifications', url: '/statusboard/notificationalert' },
            ],
        }
    },
    computed: {
        backToEmergency() {
            return this.$route.name === 'List of Emergencies' ? true : false
        },
        hideELSMenu() {
            const pageLists = ['List of Emergencies', 'Create Emergency']
            return pageLists.includes(this.$route.name) ? true : false
        },
    },
    mounted() {
        if (this.$route.query.mode === 'exercise') {
            this.modeTitle = 'EXERCISE'
            this.currMode = 'exercise'
        } else {
            this.modeTitle = 'EMERGENCY'
            this.currMode = 'emergency'
        }
    },
}
</script>

<style lang="scss" scoped></style>
