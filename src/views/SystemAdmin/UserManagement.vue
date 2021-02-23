<template>
    <v-container grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12 class="text-right pb-0">
                <v-btn
                    v-if="userCanPerformAction"
                    color="primaryGreen white--text"
                    small
                    class="elevation-0"
                    @click="openDialog('Add User')"
                >
                    <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                    Add User
                </v-btn>
            </v-flex>
            <v-flex xs12>
                <template>
                    <v-card>
                        <v-card-title>
                            <v-flex xs12 md2>
                                <v-select
                                    :items="countries"
                                    v-model="country"
                                    @change="getFilterItems()"
                                    label="Country"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 md2>
                                <v-select
                                    :items="buItems"
                                    v-model="businessUnit"
                                    @change="getFilterItems()"
                                    label="Business Unit (BU)"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 md2>
                                <v-select
                                    :items="opuItems"
                                    v-model="operationUnit"
                                    @change="getFilterItems()"
                                    label="Operating Unit (OPU)"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 md2>
                                <v-select
                                    :items="facilityItems"
                                    v-model="facility"
                                    @change="getFilterItems()"
                                    label="Facilities"
                                ></v-select>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs12 md4>
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    single-line
                                ></v-text-field>
                            </v-flex>
                        </v-card-title>
                        <v-data-table
                            :headers="headers"
                            :items="userList"
                            :search="search"
                            class="elevation-0"
                            :sort-by="['username']"
                            :sort-desc="[false, true]"
                            :loading="isLoading"
                            must-sort
                        >
                            <template v-if="userCanPerformAction" v-slot:item.action="{ item }">
                                <v-icon small class="mr-2" @click="openDialog('Edit User', item)">mdi-account-edit</v-icon>
                                <v-icon small class="mr-2" @click="deleteUser(item.username)">mdi-account-remove</v-icon>
                            </template>
                        </v-data-table>
                    </v-card>
                </template>
            </v-flex>
            <!-- ADD USER DIALOG -->
            <v-dialog v-model="dialog" max-width="700px" max-height="700px">
                <v-card>
                    <v-flex xs12>
                        <v-card-title class="primaryGreen white--text">
                            <span class="headline subheading font-weight-medium">{{ header }}</span>
                        </v-card-title>
                        <v-radio-group v-if="showDomainRadioButton" hide-details row v-model="domain" class="pl-8">
                            <v-radio v-if="showAll" row label="All" color="primaryGreen"></v-radio>
                            <v-radio v-if="showDomestic" row label="Domestic" color="primaryGreen"></v-radio>
                            <v-radio v-if="showInternational" row label="International" color="primaryGreen"></v-radio>
                            <v-radio v-if="showHQ" row label="Headquarters" color="primaryGreen"></v-radio>
                        </v-radio-group>
                        <v-card-text class="pt-0">
                            <v-container class="pb-0" grid-list-md>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field
                                            v-model="userData.username"
                                            label="Username"
                                            :rules="usernameRules"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field v-model="userData.name" label="Name" maxlength="50"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-select :items="position" v-model="userData.position" label="Position"></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableBU" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userBuItems"
                                            v-model="userData.bu"
                                            label="Business Unit (BU)"
                                            clearable
                                            @change="getUserFilterItems('add')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableOPU" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userOpuItems"
                                            v-model="userData.opu"
                                            label="Operating Unit (OPU)"
                                            clearable
                                            @change="getUserFilterItems('add')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableCountry" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userCountries"
                                            v-model="userData.country"
                                            label="Country"
                                            clearable
                                            @change="getUserFilterItems('add')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableFacilities" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userFacilityItems"
                                            v-model="userData.facility"
                                            label="Facilities"
                                            clearable
                                            @change="getUserFilterItems('add')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-select :items="team" v-model="userData.team" label="Team" clearable></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field v-model="userData.title" label="Title" maxlength="50"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-btn
                                            float="right"
                                            style="float: right;"
                                            small
                                            depressed
                                            color="primaryGreen"
                                            class="white--text elevation-0 ml-1"
                                            @click="addUser"
                                        >
                                            <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                                            Add
                                        </v-btn>
                                        <v-btn
                                            float="right"
                                            style="float: right;"
                                            outlined
                                            small
                                            depressed
                                            color="primaryGreen"
                                            class="elevation-0 mr-1"
                                            @click="closeAddDialog"
                                        >
                                            Cancel
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-flex>
                </v-card>
            </v-dialog>
            <!-- EDIT USER DIALOG -->
            <v-dialog v-model="editDialog" max-width="700px" max-height="700px">
                <v-card>
                    <v-flex xs12>
                        <v-card-title class="primaryGreen white--text">
                            <span class="headline subheading font-weight-medium">{{ header }}</span>
                        </v-card-title>
                        <v-card-text class="pt-0">
                            <v-container class="pb-0" grid-list-md>
                                <v-layout row wrap>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field
                                            v-model="tempUserData.username"
                                            label="Username"
                                            :rules="usernameRules"
                                            required
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field v-model="tempUserData.name" label="Name" maxlength="50"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-select :items="position" v-model="tempUserData.position" label="Position"></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-select :items="team" v-model="tempUserData.team" label="Team" clearable></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableBU" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userBuItems"
                                            v-model="tempUserData.bu"
                                            label="Business Unit (BU)"
                                            clearable
                                            @change="getUserFilterItems('edit')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableOPU" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userOpuItems"
                                            v-model="tempUserData.opu"
                                            label="Operating Unit (OPU)"
                                            clearable
                                            @change="getUserFilterItems('edit')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableFacilities" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userFacilityItems"
                                            v-model="tempUserData.facility"
                                            label="Facilities"
                                            clearable
                                            @change="getUserFilterItems('edit')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex v-if="enableCountry" xs12 sm6 md6 px-2>
                                        <v-select
                                            :items="userCountries"
                                            v-model="tempUserData.country"
                                            label="Country"
                                            clearable
                                            @change="getUserFilterItems('edit')"
                                        ></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6 px-2>
                                        <v-text-field v-model="tempUserData.title" label="Title" maxlength="50"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-btn
                                            float="right"
                                            style="float: right;"
                                            small
                                            depressed
                                            color="primaryGreen"
                                            class="white--text elevation-0 ml-1"
                                            @click="editUser"
                                        >
                                            <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                                            Save
                                        </v-btn>
                                        <v-btn
                                            float="right"
                                            style="float: right;"
                                            outlined
                                            small
                                            depressed
                                            color="primaryGreen"
                                            class="elevation-0 mr-1"
                                            @click="closeEditDialog"
                                        >
                                            Cancel
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                    </v-flex>
                </v-card>
            </v-dialog>
            <!-- DELETE USER DIALOG -->
            <v-dialog v-model="deleteDialog" max-width="500px">
                <v-card class="pa-3">
                    <v-card-title>
                        <span class="headline">Delete</span>
                    </v-card-title>
                    <v-card-text>
                        Are you sure you want to delete this user?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            :loading="isLoading"
                            small
                            class="elevation-0"
                            color="primaryGreen white--text"
                            @click="forDeleteUser"
                            >Yes</v-btn
                        >
                        <v-btn text small class="elevation-0" color="primaryGreen" @click="deleteDialog = false">No</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </v-container>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
    data() {
        return {
            domain: 0,
            allDomain: ['All', 'Domestic', 'International', 'Headquarters'],
            showDomainRadioButton: true,
            showAll: false,
            showDomestic: false,
            showInternational: false,
            showHQ: false,
            deleteDialog: false,
            editDialog: false,
            isLoading: false,
            search: '',
            countries: [],
            buItems: [],
            opuItems: [],
            facilityItems: [],
            team: ['ERT', 'EMT', 'BCMT', 'PCMT'],
            country: 'ALL',
            businessUnit: 'ALL',
            operationUnit: 'ALL',
            facility: 'ALL',
            dialog: false,
            header: '',
            editAdd: '',
            addCountries: [],
            addBuItems: [],
            addOpuItems: [],
            addFacilityItems: [],
            usernameRules: [(v) => !!v || 'Username is required', (v) => v && v.length <= 30],
            position: ['Admin', 'User'],
            userCountries: [],
            userBuItems: [],
            userOpuItems: [],
            userFacilityItems: [],
            userToBeDeleted: '',
            userData: {
                id: moment().unix(),
                name: '',
                username: '',
                position: '',
                department: '',
                country: '',
                bu: '',
                opu: '',
                facility: '',
                team: '',
                domain: '',
                title: '',
                token: null,
            },
            tempUserData: {
                id: moment().unix(),
                name: '',
                username: '',
                position: '',
                department: '',
                country: '',
                bu: '',
                opu: '',
                facility: '',
                team: '',
                domain: '',
                title: '',
                token: null,
            },
            headers: [
                { text: 'Username', value: 'username', sortable: false },
                { text: 'Name', value: 'name' },
                { text: 'Country', value: 'country' },
                { text: 'BU', value: 'bu' },
                { text: 'OPU', value: 'opu' },
                { text: 'Facilities', value: 'facility' },
                { text: 'Position', value: 'position', sortable: false },
                { text: 'Team', value: 'team' },
                { text: 'Action', value: 'action', align: 'center', sortable: false },
            ],
            userList: [],
        }
    },
    watch: {
        domain(val) {
            if (val === 1) {
                this.userData.country = 'MALAYSIA'
                this.userData.domain = 'Domestic'
            } else if (val === 2) {
                this.userData.country = ''
                this.userData.bu = ''
                this.userData.team = ''
                this.userData.opu = ''
            } else if (val === 3) {
                this.userData.domain = 'Headquarters'
                this.userData.country = 'Headquarters'
                this.userData.bu = ''
                this.userData.opu = ''
                this.userData.team = ''
            } else {
                this.userData.country = ''
            }
            this.getUserFilterItems('add')
            this.clearInput()
        },
    },
    methods: {
        setDomain(domain) {
            this.domain = this.allDomain.findIndex((domainName) => domainName === domain)
        },
        getDomain(index) {
            return this.allDomain[index]
        },
        openDialog(title, item) {
            this.header = title
            this.editAdd = 'add'
            if (title === 'Add User') {
                this.dialog = true
                this.userData.position = 'User'
                this.clearInput()
            } else {
                this.setDomain(item.domain)
                this.editDialog = true
                this.tempUserData = {
                    ...item,
                }
            }
        },
        forDeleteUser() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/user/delete/${this.userToBeDeleted}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.deleteDialog = false
                    this.getUserList()
                })
                .catch((error) => {
                    this.deleteDialog = false
                    console.log(error)
                })
            this.deleteDialog = false
        },
        editUser() {
            const payload = {
                ...this.tempUserData,
                domain: this.getDomain(this.domain),
            }
            axios
                .post(`${process.env.VUE_APP_API_URL}/user/edit`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.editDialog = false
                    this.getUserList()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        addUser() {
            this.userData.id = moment().unix()
            if (this.domain == 1) {            //temporary fix
              this.userData.country = 'MALAYSIA'
            } else if (this.domain == 3) {
              this.userData.country = 'Headquarters'
            }
            const payload = {
                ...this.userData,
                domain: this.getDomain(this.domain),
            }
            console.log(payload)
            axios
                .post(`${process.env.VUE_APP_API_URL}/user/add`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.dialog = false
                    this.getUserList()
                    this.getUserFilterItems()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getFilterItems() {
            const opu = this.escapeCharacter(this.operationUnit)
            axios
                .get(
                    `${process.env.VUE_APP_API_URL}/facility/filter?country=${this.country}&bu=${this.businessUnit}&opu=${opu}&facility=${this.facility}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + this.$store.getters.user.token,
                        },
                    }
                )
                .then((response) => {
                    this.countries = ['ALL', ...response.data.country]
                    this.buItems = ['ALL', ...response.data.businessUnit]
                    this.opuItems = ['ALL', ...response.data.operationUnit]
                    this.facilityItems = ['ALL', ...response.data.facility]
                    this.getUserList()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getUserFilterItems(action) {
            let opu, url
            let domain = this.getDomain(this.domain)
            if (action === 'add') {
                opu = this.escapeCharacter(this.userData.opu)
                this.domain === 3
                    ? (url = `${process.env.VUE_APP_API_URL}/facility/filter?country=Headquarters&bu=${this.userData.bu}&opu=${opu}&facility=${this.userData.facility}&domain=${domain}`)
                    : (url = `${process.env.VUE_APP_API_URL}/facility/filter?country=${this.userData.country}&bu=${this.userData.bu}&opu=${opu}&facility=${this.userData.facility}&domain=${domain}`)
            } else if (action === 'edit') {
                opu = this.escapeCharacter(this.tempUserData.opu)
                this.domain === 3
                    ? (url = `${process.env.VUE_APP_API_URL}/facility/filter?country=Headquarters&bu=${this.tempUserData.bu}&opu=${opu}&facility=${this.tempUserData.facility}&domain=${domain}`)
                    : (url = `${process.env.VUE_APP_API_URL}/facility/filter?country=${this.tempUserData.country}&bu=${this.tempUserData.bu}&opu=${opu}&facility=${this.tempUserData.facility}&domain=${domain}`)
            }
            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    if (this.domain === 2) {
                        this.userCountries = response.data.country.filter(
                            (country) => country !== 'MALAYSIA' && country !== 'Headquarters'
                        )
                        // console.log(userCountries);
                    } else {
                        this.userCountries = response.data.country
                    }
                    this.userBuItems = response.data.businessUnit
                    this.userOpuItems = response.data.operationUnit
                    this.userFacilityItems = response.data.facility
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getUserList() {
            const opu = this.escapeCharacter(this.operationUnit)
            axios
                .get(
                    `${process.env.VUE_APP_API_URL}/user/list?country=${this.country}&bu=${this.businessUnit}&opu=${opu}&facility=${this.facility}`,
                    {
                        headers: {
                            Authorization: 'Bearer ' + this.$store.getters.user.token,
                        },
                    }
                )
                .then((response) => {
                    setTimeout(() => {
                        this.userList = response.data
                        // console.log(this.userList)
                        this.isLoading = false
                    }, 500)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        escapeCharacter(str) {
            if (str.includes('&')) {
                return str.replace(/&/g, '%20')
            } else {
                return str
            }
        },
        closeAddDialog() {
            this.dialog = false
        },
        clearInput() {
            this.userData.username = ''
            this.userData.name = ''
            this.userData.department = ''
            this.userData.team = ''
            this.userData.bu = ''
            this.userData.opu = ''
            this.userData.facility = ''
            this.userData.country = ''
        },
        openEditDialog(item) {
            this.tempUserData = item
            this.editDialog = true
            this.header = 'Edit User'
            this.tempUserData.position = 'User'
        },
        closeEditDialog() {
            this.editDialog = false
        },
        deleteUser(username) {
            this.userToBeDeleted = username
            this.deleteDialog = true
        },
    },
    computed: {
        enableBU() {
            if ((this.domain === 1) | (this.domain === 3)) return true
            else return false
        },
        enableOPU() {
            if (this.domain === 1) return true
            else return false
        },
        enableFacilities() {
            if ((this.domain === 1) | (this.domain === 2)) return true
            else return false
        },
        enableCountry() {
            if (this.domain === 2) return true
            else return false
        },
    },
    beforeCreate() {
        if (this.$store.getters.userPermission === 'General User') {
            this.$router.push('/error404')
        }
    },
    created() {
        switch (this.$store.getters.userPermission) {
            case 'System Admin':
                this.domain = 0
                this.showAll = true
                this.showDomestic = true
                this.showInternational = true
                this.showHQ = true
                break
            case 'Country Admin':
                this.domain = 1
                this.showDomainRadioButton = false
                break
            case 'BU Admin':
                this.domain = 2
                this.showDomainRadioButton = false
                break
            case 'OPU Admin':
                this.domain = 2
                this.showDomainRadioButton = false
                break
            case 'Facility Admin':
                this.domain = 2
                this.showDomainRadioButton = false
                break
            default:
                console.log('User not defined')
        }
    },
    mounted() {
        this.getFilterItems()
        this.getUserFilterItems('add')
    },
}
</script>
