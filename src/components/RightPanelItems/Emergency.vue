<template lang="html">
    <v-layout class="ma-5" row wrap>
        <v-flex xs6>
            <emergency-mapping></emergency-mapping>
        </v-flex>
        <v-flex xs6 style="border-left: 1px dashed; border-color: rgba(0, 0, 0, 0.12)">
            <emergency-info></emergency-info>
        </v-flex>
        <!-- <v-flex style="border-left: 1px dashed; border-color: rgba(0, 0, 0, 0.12)" xs4>
            <analysis></analysis>
        </v-flex> -->
    </v-layout>
</template>

<script>
import EmergencyInfo from '@/components/RightPanelItems/EmergencyInfo'
import EmergencyMapping from '@/components/RightPanelItems/EmergencyMapping'
import Analysis from '@/components/RightPanelItems/Analysis'

export default {
    components: {
        'emergency-info': EmergencyInfo,
        'emergency-mapping': EmergencyMapping,
        analysis: Analysis,
    },
    data() {
        return {}
    },
}
</script>

<style lang="css" scoped></style>
