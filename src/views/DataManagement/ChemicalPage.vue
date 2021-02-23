<template lang="">
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs6>
                <h4>Chemical Info: {{ facilityName }}</h4>
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
                    <chemical-info :id="id"></chemical-info>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import CSHIDialog from '@/components/MapViewer/Dialog/CSHIDialog'

export default {
    name: 'ChemicalPage',
    components: {
        'chemical-info': CSHIDialog,
    },
    data() {
        return {
            id: this.$route.params.id,
            facilityInfo: [],
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
        },
    },
    mounted() {
        axios
            .get(`${process.env.VUE_APP_API_URL}/facility/${this.id}`, {
                headers: {
                    Authorization: 'Bearer ' + this.$store.getters.user.token,
                },
            })
            .then((response) => {
                console.log(response.data)
                this.facilityInfo = response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
}
</script>

<style lang="css" scoped></style>
