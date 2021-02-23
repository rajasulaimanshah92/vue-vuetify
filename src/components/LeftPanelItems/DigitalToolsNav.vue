<template>
    <section>
        <v-list class="pt-0 pb-0" dense flat>
            <v-list-item value="true" active-class="active" color="primary" to="/statusboard/emergencylist?mode=emergency">
                <v-list-item-action>
                    <v-icon v-if="backToEmergency">mdi-view-list</v-icon>
                    <v-icon v-else>mdi-arrow-left</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">EMERGENCY LIST</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list class="pt-0 pb-0 border-radius-0" dark dense flat color="primaryGreen">
            <v-list-item>
                <v-list-item-action>
                    <v-icon>mdi-tools</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">DIGITAL TOOLS</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-list class="pt-0 pb-0" dense>
            <v-list-item-group color="primary">
                <v-list-item v-for="list in digitalToolsLists" :key="list.text" :to="list.url">
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
            digitalToolsLists: [
                { icon: 'mdi-calculator', text: 'Foam Calculator', url: '/digitaltools/foamcalculator' },
                { icon: 'mdi-format-list-checks', text: 'SCAT', url: '/digitaltools/scat' },
                { icon: 'mdi-calculator-variant', text: 'SIMA', url: '/digitaltools/sima' },
            ],
        }
    },
    computed: {
        backToEmergency() {
            return this.$route.name === 'List of Emergencies' ? true : false
        },
    },
}
</script>

<style lang="scss" scoped>
.border-radius-0 {
    border-radius: 0 !important;
}
</style>
