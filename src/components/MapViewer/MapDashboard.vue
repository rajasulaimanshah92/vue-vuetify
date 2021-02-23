<template>
    <section id="map-dashboard">
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <v-layout id="status" wrap class="text-center">
                        <v-flex xs6 class="pt-1 pb-1 pointer" @click="viewEmergency('emergency')">
                            <h2 class="display-1 highlight--text font-weight-bold mb-1">{{ emergency }}</h2>
                            <h4 class="highlight--text" :class="{ caption: $vuetify.breakpoint.xs }">ACTIVE</h4>
                            <h4 class="highlight--text" :class="{ caption: $vuetify.breakpoint.xs }">EMERGENCY</h4>
                        </v-flex>
                        <v-flex xs6 class="pt-1 pb-1 pointer" @click="viewEmergency('exercise')">
                            <h1 class="display-1 accentPurple2--text font-weight-bold mb-1">{{ exercise }}</h1>
                            <h4 class="accentPurple2--text" :class="{ caption: $vuetify.breakpoint.xs }">ACTIVE</h4>
                            <h4 class="accentPurple2--text" :class="{ caption: $vuetify.breakpoint.xs }">EXERCISE</h4>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </section>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            emergency: 0,
            exercise: 0,
            callInterval: null,
        }
    },
    methods: {
        viewEmergency(mode) {
            const path =
                mode === 'emergency' ? '/statusboard/emergencylist?mode=emergency' : '/statusboard/emergencylist?mode=exercise'
            this.gotoPage(path)
        },
        createEmergency(mode) {
            const path = mode === 'emergency' ? '/createemergency?mode=emergency' : '/createemergency?mode=exercise'
            this.gotoPage(path)
        },
        getData(sector) {
            let url = `${process.env.VUE_APP_API_URL}/emergency/${sector}/all`

            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((res) => {
                    this[sector] = res.data.length
                })
                .catch((err) => {
                    console.error(err)
                })
        },
        refreshActive() {
            this.getData('emergency')
            this.getData('exercise')
        },
    },
    created() {
        this.refreshActive()
        this.callInterval = setInterval(this.refreshActive, 15000)
    },
    beforeDestroy() {
        clearInterval(this.callInterval)
    },
}
</script>

<style lang="scss" scoped>
#map-dashboard {
    position: absolute;
    bottom: 24px;
    right: 24px;
    width: 300px;
}

#status {
    > div {
        transition: background 0.3s ease-out;
        &:not(:last-child) {
            border-right: 1px solid #a6a6a6;
        }
        &:hover {
            background: #f2f2f2;
        }
    }
}

#icon-add {
    font-size: 44px !important;
    // margin-bottom: 20px !important;
}
</style>
