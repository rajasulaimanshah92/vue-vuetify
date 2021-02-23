<template lang="html">
    <v-container grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12>
                <h4>List of Facilities</h4>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
            <v-flex xs12>
                <template>
                    <v-card>
                        <v-card-title>
                            <v-layout row wrap>
                                <v-flex xs12 md3 class="pr-6">
                                    <v-select
                                        :items="countries"
                                        v-model="country"
                                        @change="getFilterItems('country')"
                                        label="Country"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 md3 class="pr-6">
                                    <v-select
                                        :items="buItems"
                                        v-model="businessUnit"
                                        @change="getFilterItems('bu')"
                                        label="Business Unit (BU)"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 md3 class="pr-6">
                                    <v-select
                                        :items="opuItems"
                                        v-model="operationUnit"
                                        @change="getFilterItems('opu')"
                                        item-text="name"
                                        label="Operating Unit (OPU)"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 md3>
                                    <v-text-field
                                        v-model="search"
                                        append-icon="mdi-magnify"
                                        label="Search"
                                        single-line
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="facilityItems"
                            :loading="isLoading"
                            :search="search"
                            :sort-by="['facilityName']"
                            :sort-desc="[false, true]"
                            must-sort
                        >
                            <template v-slot:item.facilityInfo="{ item }">
                                <v-btn
                                    small
                                    depressed
                                    color="primaryGreen white--text"
                                    @click="gotoPage(`/datamanagement/facilitylist/facilitypage/${item.facilityId}`)"
                                    >View</v-btn
                                >
                            </template>
                            <template v-slot:item.chemicalInfo="{ item }">
                                <v-btn
                                    small
                                    depressed
                                    color="primaryGreen white--text"
                                    @click="gotoPage(`/datamanagement/facilitylist/chemicalpage/${item.facilityId}`)"
                                    >View</v-btn
                                >
                            </template>
                            <template v-slot:item.orgChart="{ item }">
                                <v-btn
                                    small
                                    depressed
                                    color="primaryGreen white--text"
                                    @click="gotoPage(`/datamanagement/facilitylist/orgchart/${item.facilityId}`)"
                                    >View</v-btn
                                >
                            </template>
                            <template v-slot:item.resources="{ item }">
                                <v-btn
                                    small
                                    depressed
                                    color="primaryGreen white--text"
                                    @click="gotoPage(`/datamanagement/facilitylist/resources/${item.facilityId}`)"
                                    >View</v-btn
                                >
                            </template>
                            <template v-slot:item.emergencyArchive="{ item }">
                                <v-btn
                                    small
                                    depressed
                                    color="primaryGreen white--text"
                                    @click="gotoPage(`/datamanagement/facilitylist/emergencyarchive/${item.facilityId}`)"
                                    >View</v-btn
                                >
                            </template>
                            <template v-slot:item.exerciseArchive="{ item }">
                                <v-btn
                                    small
                                    depressed
                                    color="primaryGreen white--text"
                                    @click="gotoPage(`/datamanagement/facilitylist/exercisearchive/${item.facilityId}`)"
                                    >View</v-btn
                                >
                            </template>
                        </v-data-table>
                    </v-card>
                </template>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            search: '',
            isLoading: false,
            country: 'ALL',
            businessUnit: 'ALL',
            operationUnit: 'ALL',
            countries: [],
            buItems: [],
            opuItems: [],
            headers: [
                { text: 'Facility Name', sortable: true, align: 'left', value: 'facilityName' },
                { text: 'Facility ID', sortable: false, width: 125, align: 'left', value: 'facilityId' },
                { text: 'Facility Type', sortable: true, width: 125, align: 'left', value: 'facilityType' },
                { text: 'Country', sortable: true, width: 125, align: 'left', value: 'country' },
                { text: 'Business Unit', sortable: true, width: 125, align: 'left', value: 'businessUnit' },
                { text: 'Operating Unit', sortable: true, width: 125, align: 'left', value: 'operatingUnit' },
                { text: 'Facility Info', sortable: false, width: 125, align: 'center', value: 'facilityInfo' },
                { text: 'Chemical Info', sortable: false, width: 125, align: 'center', value: 'chemicalInfo' },
                { text: 'Organization Chart', sortable: false, width: 155, align: 'center', value: 'orgChart' },
                { text: 'Emergency Archive', sortable: false, width: 155, align: 'center', value: 'emergencyArchive' },
                { text: 'Exercise Archive', sortable: false, width: 155, align: 'center', value: 'exerciseArchive' },
            ],
            facilityItems: [],
        }
    },
    methods: {
        escapeCharacter(str) {
            if (str.includes('&')) {
                return str.replace(/&/g, '%26')
            } else {
                return str
            }
        },
        getFilterItems(selected) {
            if (selected === 'country') {
                this.businessUnit = 'ALL'
                this.operationUnit = 'ALL'
            } else if (selected === 'bu') {
                this.operationUnit = 'ALL'
            }
            axios
                .get(`${process.env.VUE_APP_API_URL}/facility/filter?country=${this.country}&bu=${this.businessUnit}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.countries = ['ALL', ...response.data.country]
                    this.buItems = ['ALL', ...response.data.businessUnit]
                    this.opuItems = ['ALL', ...response.data.operationUnit]
                    this.getFacilities()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getFacilities() {
            const opu = this.escapeCharacter(this.operationUnit)
            this.isLoading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/facility/list?country=${this.country}&bu=${this.businessUnit}&opu=${opu}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    // console.log(response.data)
                    setTimeout(() => {
                        this.facilityItems = response.data
                        this.isLoading = false
                    }, 500)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
    computed: {},
    mounted() {
        this.countries = 'ALL'
        this.getFilterItems()
    },
}
</script>

<style lang="scss" scoped></style>
