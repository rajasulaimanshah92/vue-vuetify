<template>
    <section>
        <!-- <v-container grid-list-xs class="pa-0" id="left-panel">
            <v-layout row wrap>
                <v-flex xs12 class="primaryGreen">
                    <div v-for="(tabItem, index) in leftPanelTabs"
                    class="caption tab-content"
                    :class="{ active: pos === index + 1 }"
                    @click="pos = index + 1"
                    >
                    {{ tabItem.text }}
                    </div>
                </v-flex>
            </v-layout>
        </v-container> -->
        <v-window v-model="pos">
            <v-window-item v-for="(tabItem, index) in leftPanelTabs" :value="index + 1" :key="index">
                <component :is="tabItem.component"></component>
            </v-window-item>
        </v-window>
    </section>
</template>

<script>
import Facilities from '@/components/MapViewer/Facilities'
import Emergency from '@/components/MapViewer/Emergency'
import Exercise from '@/components/MapViewer/Exercise'
import Archive from '@/components/MapViewer/Archive'
import DigitalTools from '@/components/MapViewer/DigitalTools'

export default {
    components: {
        facilities: Facilities,
        emergency: Emergency,
        exercise: Exercise,
        archive: Archive,
        'digital-tools': DigitalTools,
    },
    data() {
        return {
            pos: 1,
            leftPanelTabs: [
                { text: 'Facilities', icon: 'mdi-factory', component: Facilities },
                { text: 'Emergency', icon: 'mdi-alert', component: Emergency },
                { text: 'Exercise', icon: 'mdi-map', component: Exercise },
                { text: 'Archive', icon: 'mdi-map', component: Archive },
                { text: 'Digital Tools', icon: 'mdi-map', component: DigitalTools },
            ],
        }
    },
}
</script>

<style lang="scss" scoped>
#left-panel {
    border-top: 2px solid #00b1a9;
    .tab-content {
        cursor: pointer;
        border-bottom: 2px solid #00b1a9;
        transition: all 0.3s ease-out;
        color: #fff;
        width: auto;
        padding: 4px;
        display: inline-block;
        &:hover {
            background: #00ccc2;
        }
    }
    .tab-content.active {
        border-bottom: 2px solid #402b53;
    }
}
</style>
