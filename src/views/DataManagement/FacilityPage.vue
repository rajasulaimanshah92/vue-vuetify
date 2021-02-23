<template lang="">
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs6>
                <h4>Facility Info: {{ facilityName }}</h4>
            </v-flex>
            <v-spacer></v-spacer>
            <v-btn text @click="gotoPage('/datamanagement/facilitylist')">
                <v-icon color="gray">mdi-arrow-left</v-icon>
                Back to Facility List
            </v-btn>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card>
                    <facility-info :id="$route.params.id"></facility-info>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import FIDialog from '@/components/MapViewer/Dialog/FIDialog'

export default {
    name: 'FacilityPage',
    components: {
        'facility-info': FIDialog
    },
    data() {
        return {
            id: this.$route.params.id,
            facilityInfo: []
        }
    },
    computed: {
        facilityName() {
            if (this.facilityInfo.length) {
                const [facility] = this.facilityInfo
                return facility.facilityName
            } else {
                return ''
            }
        }
    },
    mounted() {
        axios.get(`${process.env.VUE_APP_API_URL}/facility/${this.id}`, {
            headers: {
                'Authorization': 'Bearer ' + this.$store.getters.user.token
            }
        })
        .then(response => {
            console.log(response.data)
            this.facilityInfo = response.data
        })
        .catch(error => {
            console.log(error)
        })
    }
}
</script>

<style lang="save-text=""css" scoped>
</style>
