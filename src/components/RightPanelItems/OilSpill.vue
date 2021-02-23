<template>
    <v-card class="elevation-0">
        <v-tabs v-model="tab" color="primaryDarkGrey" height="38" grow>
            <v-tab v-for="item in tabItems" :key="item" class="secondaryLightGrey">
                {{ item }}
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
            <v-tab-item key="Run Model">
                <v-card flat>
                    <run-model :oilSpillAttributes="oilSpillAttributes" />
                </v-card>
            </v-tab-item>
            <v-tab-item key="View Scenarios">
                <v-card flat>
                    <view-scenarios :oilSpillAttributes="oilSpillAttributes" :mapConfig="{ map, view }" />
                </v-card>
            </v-tab-item>
            <v-tab-item key="Fates Graph">
                <v-card flat>
                    <fates-graph />
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
import RunModel from '@/components/RightPanelItems/OilSpill/RunModel'
import ViewScenarios from '@/components/RightPanelItems/OilSpill/ViewScenarios'
import FatesGraph from '@/components/RightPanelItems/OilSpill/FatesGraph'
import { EventBus } from '@/main'

export default {
    props: ['oilSpillAttributes'],
    components: {
        'run-model': RunModel,
        'view-scenarios': ViewScenarios,
        'fates-graph': FatesGraph,
    },
    watch: {
        tab(index) {
            // console.log(index);
            if (index == 0) {
                EventBus.$emit('closeBottomPanel')
            }
        },
    },
    data() {
        return {
            map: null,
            view: null,
            tab: 0,
            tabItems: ['Run Model', 'View Scenarios', 'Fates Graph'],
        }
    },
    mounted() {
        this.map = this.$store.getters.mapEmergency.map
        this.view = this.$store.getters.mapEmergency.view

        EventBus.$on('changeTab', (index) => {
            this.tab = index
        })
    },
}
</script>

<style lang="scss" scoped></style>
