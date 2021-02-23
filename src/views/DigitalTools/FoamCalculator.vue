<template>
    <v-container grid-list-lg>
        <v-card>
            <v-card-title class="text-center justify-center py-6">
                <h1 class="font-weight-bold display-1 primaryGreen--text">Foam Calculator</h1>
            </v-card-title>

            <v-tabs v-model="tab" background-color="transparent" color="primaryGreen" grow>
                <v-tab v-for="item in items" :key="item.index">
                    {{ item }}
                </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
                <v-tab-item key="0">
                    <fixed-calculator></fixed-calculator>
                </v-tab-item>
                <v-tab-item key="1">
                    <mobile-calculator></mobile-calculator>
                </v-tab-item>
                <v-tab-item key="2">
                    <bund-calculator></bund-calculator>
                </v-tab-item>
                <v-tab-item key="3">
                    <rim-seal-calculator></rim-seal-calculator>
                </v-tab-item>
            </v-tabs-items>
        </v-card>
    </v-container>
</template>

<script>
import moment from 'moment'
import axios from 'axios'
import Fixed from '@/components/FoamCalculator/Fixed'
import Mobile from '@/components/FoamCalculator/Mobile'
import Bund from '@/components/FoamCalculator/Bund'
import RimSeal from '@/components/FoamCalculator/RimSeal'

export default {
    components: {
        'fixed-calculator': Fixed,
        'mobile-calculator': Mobile,
        'bund-calculator': Bund,
        'rim-seal-calculator': RimSeal,
    },
    data() {
        return {
            tab: null,
            items: ['Full Surface Fire (Fixed)', 'Full Surface Fire (Mobile)', 'Bund (Dike) Fires', 'Rim Seal Fires'],
        }
    },
}
</script>

<style lang="scss" scoped></style>
