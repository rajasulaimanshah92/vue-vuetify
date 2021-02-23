<template>
    <v-app>
        <!-- APP HEADER -->
        <app-header></app-header>

        <!-- LEFT PANEL -->
        <left-panel></left-panel>

        <!-- RIGHT PANEL -->
        <right-panel v-if="$route.meta.showRightPanel"></right-panel>

        <!-- BOTTOM PANEL -->
        <bottom-panel></bottom-panel>

        <!-- CONTENT -->
        <v-content>
            <page-header></page-header>
            <status-header v-if="$route.meta.showEmergencyStatusBoardHeader"></status-header>
            <transition name="slide">
                <router-view></router-view>
            </transition>
        </v-content>

        <!-- APP FOOTER -->
        <app-footer></app-footer>
    </v-app>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import PageHeader from '@/components/PageHeader'
import EmergencyStatusBoardHeader from '@/components/EmergencyStatusBoardHeader'
import LeftPanel from '@/components/LeftPanel'
import RightPanel from '@/components/RightPanel'
import BottomPanel from '@/components/BottomPanel'
import AppFooter from '@/components/AppFooter'

export default {
    components: {
        'app-header': AppHeader,
        'page-header': PageHeader,
        'status-header': EmergencyStatusBoardHeader,
        'left-panel': LeftPanel,
        'right-panel': RightPanel,
        'bottom-panel': BottomPanel,
        'app-footer': AppFooter,
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss">
@import '~scss/main';
</style>
