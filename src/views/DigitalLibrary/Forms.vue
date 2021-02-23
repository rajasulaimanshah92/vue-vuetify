<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <v-card class="pa-3">
                    <v-card-actions class="px-6">
                        <v-text-field
                            class="pt-0 mt-0"
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            single-line
                            hide-details
                        ></v-text-field>
                        <v-spacer></v-spacer>
                    </v-card-actions>
                    <v-card-actions class="px-6">
                        <h2 class="primaryGreen--text">Forms</h2>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="userCanPerformAction"
                            color="primaryGreen white--text"
                            class="elevation-0"
                            @click="openAddDialog"
                        >
                            <v-icon small dark>mdi-plus</v-icon>
                            Add Document
                        </v-btn>
                    </v-card-actions>
                    <v-card-text class="px-6">
                        <template>
                            <v-data-table
                                :headers="headers"
                                :items="dataDetails"
                                :items-per-page="5"
                                :sort-by="['datePublished']"
                                :sort-desc="[true, false]"
                                must-sort
                                class="elevation-0"
                            >
                                <template v-slot:item.datePublished="{ item }">
                                    {{ datePublishedFormat(item.datePublished) }}
                                </template>
                                <template v-slot:item.action="{ item }">
                                    <template v-if="userCanPerformAction">
                                        <a
                                            :href="`${url}/digitallibrary/download/` + item.id"
                                            style="text-decoration-color: transparent;"
                                        >
                                            <v-icon small class="mr-2" color="primaryGreen">mdi-download</v-icon>
                                        </a>
                                    </template>
                                    <v-icon v-if="userCanPerformAction" small class="mr-2" @click="openEditDialog(item)"
                                        >mdi-pencil</v-icon
                                    >
                                    <v-icon v-if="userCanPerformAction" small @click="openDeleteDialog(item.id)"
                                        >mdi-delete</v-icon
                                    >
                                </template>
                            </v-data-table>
                        </template>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="addDocDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Upload Document</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12 px-2>
                                <v-text-field label="Document name" v-model="documentAdd.documentName"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 px-2>
                                <v-text-field label="Version" v-model="documentAdd.version"></v-text-field>
                            </v-flex>
                            <v-flex xs12 md6 px-2>
                                <v-text-field
                                    name="name"
                                    label="Time"
                                    v-model="documentAdd.datePublished"
                                    hide-details
                                    @keydown="validateTime"
                                    @keyup="validateTime"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 px-2>
                                <v-text-field label="Published by" v-model="documentAdd.publishedBy"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea filled label="Remarks" v-model="documentAdd.remarks" auto-grow></v-textarea>
                            </v-flex>
                            <v-flex xs12 px-2>
                                <v-file-input v-model="documentAdd.files" label="File input"></v-file-input>
                                <v-progress-linear
                                    class="pt-0 mt-0"
                                    color="primaryGreen"
                                    :indeterminate="true"
                                    v-show="progressBar"
                                ></v-progress-linear>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn class="elevation-0" text color="primaryGreen" :disabled="progressBar" @click="closeAddDoc()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="postForms()"
                                >OK</v-btn
                            >
                            <!-- <v-btn v-if="dialog.title == 'Edit'" small class="elevation-0" :disabled="progressBar" color="primaryGreen white--text" @click="editDocument()">OK</v-btn> -->
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">{{ header }}</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12 px-2>
                                <v-file-input accept=".xlsx" v-model="editedForms.files" label="File input"></v-file-input>
                                <!-- <v-progress-linear class="pt-0 mt-0" :indeterminate="true" color="primaryGreen" v-show="progressBar"></v-progress-linear> -->
                                <p v-show="progressBar">Please wait...</p>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="closeEditDialog()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="saveEditDocument(editedForms.files)"
                                >OK</v-btn
                            >
                            <!-- <v-btn v-if="dialog.title == 'Edit'" small class="elevation-0" :disabled="progressBar" color="primaryGreen white--text" @click="editDocument()">OK</v-btn> -->
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Delete</span>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this item?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text class="elevation-0" color="primaryGreen" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn class="elevation-0" color="primaryGreen white--text" @click="getDeleteData()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
    data() {
        return {
            url: process.env.VUE_APP_API_URL,
            isLoading: false,
            search: '',
            addDocDialog: false,
            progressBar: false,
            editDialog: false,
            deleteDialog: false,
            editedIndex: -1,
            changeHeader: '',
            filename: '',
            getType: [],
            headers: [
                { text: 'Document Name', value: 'documentName' },
                { text: 'Version', value: 'version' },
                { text: 'Date Published', value: 'datePublished' },
                { text: 'Published By', value: 'publishedBy' },
                { text: 'Remarks', value: 'remarks', sortable: false },
                { text: 'Action', align: 'center', value: 'action', sortable: false },
            ],
            dataDetails: [],
            docsToBeDeleted: '',
            documentAdd: {
                id: '',
                type: 'Forms',
                url: '',
                documentName: '',
                version: '',
                datePublished: '',
                publishedBy: '',
                remarks: '',
                fileid: '',
                files: null,
            },
            editedForms: {
                id: '',
                type: 'Forms',
                url: '',
                documentName: '',
                version: '',
                datePublished: '',
                publishedBy: '',
                remarks: '',
                fileid: '',
                files: null,
            },
            header: '',
        }
    },
    methods: {
        validateTime(evt) {
            this.validate24HourFormat(evt, this.documentAdd.datePublished)
        },
        postForms() {
            this.documentAdd.id = moment().unix()
            const payload = {
                ...this.documentAdd,
            }
            let info = new FormData()
            Object.keys(payload).forEach((key, i) => {
                console.log(key)
                info.append(key, payload[key])
            })
            // console.log(info.get('files'));
            // return
            // console.log(payload);
            axios
                .post(`${process.env.VUE_APP_API_URL}/digitallibrary/add`, info, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.addDocDialog = false
                    this.getForms()
                    this.clearItem()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getForms() {
            this.isLoading = true
            // const str = this.$route.params.id
            axios
                .get(`${process.env.VUE_APP_API_URL}/digitallibrary/all`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    // this.isLoading = false
                    console.log(response.data)
                    this.dataDetails = response.data
                    this.filteredType()
                })
                .catch((error) => {
                    this.isLoading = false
                })
        },
        getDeleteData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/digitallibrary/delete/${this.docsToBeDeleted}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.isLoading = false
                    this.deleteDialog = false
                    this.getForms()
                })
                .catch((error) => {
                    console.log(error)
                })
            this.isLoading = true
        },
        closeAddDoc() {
            // Object.keys(this.documentAdd).map(key => {
            //   if (key == 'datePublished') {
            //     this.documentAdd.datePublished = moment().format('YYYY-MM-DD')
            //   } else if (key == 'files'){
            //     this.documentAdd.files = null
            //   } else {
            //     this.documentAdd[key] = ''
            //   }
            // })
            this.addDocDialog = false
            this.clearItem()
        },
        openEditDialog(item) {
            this.editedIndex = this.dataDetails.indexOf(item)
            // this.editedForms = Object.assign({}, item)
            this.header = 'Import Document'
            this.changeHeader = 'edit'
            this.editDialog = true
            // Object.keys(item).map(key => {
            //     if (key == 'files') {
            //         this.documentAdd.files = []
            //     } else {
            //         this.documentAdd[key] = item[key]
            //     }
            // })
        },
        saveEditDocument(item) {
            // let payload = this.editedForms.files
            // let id = this.documentAdd.id
            axios
                .post(`${process.env.VUE_APP_API_URL}/digitallibrary/edit/`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.editDialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        closeEditDialog() {
            this.documentAdd.files = null
            this.editDialog = false
        },
        openAddDialog() {
            this.addDocDialog = true
            this.changeHeader = 'add'
        },
        openDeleteDialog(id) {
            this.docsToBeDeleted = id
            this.deleteDialog = true
            this.deletedItem = item
        },
        clearItem() {
            ;(this.documentAdd.documentName = ''),
                (this.documentAdd.version = ''),
                (this.documentAdd.datePublished = ''),
                (this.documentAdd.publishedBy = ''),
                (this.documentAdd.remarks = ''),
                (this.documentAdd.files = '')
        },
        datePublishedFormat(date) {
            return moment(date).format('DD-MMM-YYYY HH:mm:ss')
        },
    },
    computed: {
        filteredType() {
            const type = this.dataDetails.type ? 'Forms' : 'Training Modules'
            console.log(type)
        },
    },
    mounted() {
        this.getForms()
    },
}
</script>

<style lang="scss" scoped></style>
