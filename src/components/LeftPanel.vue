<template lang="html">
    <section v-if="userIsAuthenticated">
        <v-navigation-drawer app :width="leftPanelWidth" fixed v-model="leftPanel" clipped>
            <!-- MAPVIEWER -->
            <mapviewer-tabs v-if="$route.meta.leftPanelSection === 'mapviewer'"></mapviewer-tabs>
            <!-- ELS -->
            <els-nav v-if="$route.meta.leftPanelSection === 'ELS'"></els-nav>
            <!-- DIGITAL TOOLS -->
            <digitaltools-nav v-if="$route.meta.leftPanelSection === 'digitaltools'"></digitaltools-nav>
            <!-- DIGITAL TOOLS -->
            <digitallibrary-nav v-if="$route.meta.leftPanelSection === 'digitallibrary'"></digitallibrary-nav>
            <!-- SYSTEM ADMIN -->
            <systemadmin-nav v-if="$route.meta.leftPanelSection === 'systemadmin'"></systemadmin-nav>
            <!-- DATA MANAGEMENT -->
            <datamanagement-nav v-if="$route.meta.leftPanelSection === 'datamanagement'"></datamanagement-nav>
        </v-navigation-drawer>
        <!-- FIXED TEMPORARY LEFT PANEL -->
        <v-navigation-drawer temporary :width="leftPanelWidth" v-model="leftDrawer" fixed></v-navigation-drawer>
    </section>
</template>

<script>
import { EventBus } from '@/main'
import MapViewerTabs from '@/components/LeftPanelItems/MapViewerTabs'
import ELSNav from '@/components/LeftPanelItems/ELSNav'
import DigitalToolsNav from '@/components/LeftPanelItems/DigitalToolsNav'
import DigitalLibraryNav from '@/components/LeftPanelItems/DigitalLibraryNav'
import SystemAdminNav from '@/components/LeftPanelItems/SystemAdminNav'
import DataManagementNav from '@/components/LeftPanelItems/DataManagementNav'

export default {
    components: {
        'mapviewer-tabs': MapViewerTabs,
        'els-nav': ELSNav,
        'digitaltools-nav': DigitalToolsNav,
        'digitallibrary-nav': DigitalLibraryNav,
        'systemadmin-nav': SystemAdminNav,
        'datamanagement-nav': DataManagementNav,
    },
    data() {
        return {
            leftPanel: true,
            leftDrawer: null,
            leftPanelWidth: 299,
        }
    },
    methods: {
        toggleLeftPanel() {
            this.leftPanel = !this.leftPanel
        },
        showLeftPanel() {
            this.leftPanel = true
        },
        hideLeftPanel() {
            this.leftPanel = false
        },
    },
    computed: {},
    created() {
        EventBus.$on('toggleLeftPanel', (payload) => {
            this.toggleLeftPanel()
        })
        EventBus.$on('hideLeftPanel', (payload) => {
            this.hideLeftPanel()
        })
        EventBus.$on('showLeftPanel', (payload) => {
            this.showLeftPanel()
        })
    },
}
</script>

<style lang="scss" scoped></style>
