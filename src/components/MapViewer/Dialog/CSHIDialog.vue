<template>
    <v-card class="elevation-0">
        <!-- <v-btn color="primary" @click="test">text</v-btn> -->
        <v-card-text>
            <v-layout row wrap>
                <v-flex xs3>
                    <v-layout ml-3 pt-3 row wrap>
                        <v-flex xs10>
                            <v-select
                                :items="itemSelection"
                                item-text="chemical"
                                :disabled="editAction"
                                v-model="selectionValue"
                                label="Chemical"
                            ></v-select>
                        </v-flex>
                        <v-flex pt-5 xs2>
                            <v-btn v-if="userCanPerformAction" text small icon @click="editDialog = true" color="primaryGreen">
                                <v-icon>mdi-pencil</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-list flat nav>
                        <v-list-item-group v-model="item" color="primary">
                            <v-list-item
                                v-for="(obj, index) in itemList"
                                :key="index"
                                @click="chosenList(obj)"
                                :disabled="editAction"
                                :class="obj.isActive ? 'primaryDarkGrey white--text' : ''"
                            >
                                <v-list-item-content>
                                    <v-list-item-title v-text="obj.name"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-flex>
                <v-flex xs9>
                    <v-layout row wrap v-if="editAction">
                        <v-flex ma-6 xs12>
                            <text-editor ref="textEditor" @clicked="getDataFromChild" :html="html"></text-editor>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn depressed @click="editAction = !editAction" text small color="primaryGreen">Cancel</v-btn>
                                <v-btn depressed @click="save" small color="primaryGreen white--text">Save</v-btn>
                            </v-card-actions>
                        </v-flex>
                        <!-- <v-flex xs12>
              <v-container grid-list-xs>
                <v-text-field
                  disabled
                  label="Upload file"
                  prepend-icon="mdi-paperclip"
                ></v-text-field>
              </v-container>
            </v-flex> -->
                    </v-layout>
                    <v-layout row wrap v-else>
                        <v-flex ma-9 xs10>
                            <div class="tableBorder" v-html="html"></div>
                        </v-flex>
                        <v-flex class="mt-1 ml-9" xs1>
                            <v-btn
                                v-if="userCanPerformAction"
                                depressed
                                @click="editAction = !editAction"
                                small
                                color="primaryGreen white--text"
                                >Edit</v-btn
                            >
                        </v-flex>
                        <!-- <v-flex xs12>
              <v-container grid-list-xs>
                <h3>Documents</h3>
                <v-data-table :headers="headers" :items="datadetails" :pagination.sync="pagination" class="elevation-0" :rows-per-page-items="rowsPerPage">
                    <template v-if="loading" v-slot:no-data>
                        <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                    </template>
                    <template v-slot:items="props">
                        <td>{{ setPageNumber(props.index + 1, pagination.page, pagination.rowsPerPage) }}</td>
                        <td>{{ props.item.documentName }}</td>
                        <td>{{ props.item.version }}</td>
                        <td>{{ props.item.datePublished }}</td>
                        <td>{{ props.item.publishedBy }}</td>
                        <td>{{ props.item.remarks }}</td>
                        <td class="text-xs-center"><v-icon class="cursor" color="primaryGreen">mdi-download</v-icon></td>
                    </template>
                </v-data-table>
              </v-container>
            </v-flex> -->
                    </v-layout>
                </v-flex>
                <v-dialog persistent v-model="editDialog" max-width="600px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Chemical List</span>
                            <v-spacer></v-spacer>
                            <v-btn class="py-0 my-0" text icon color="white" @click="editDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-data-table :headers="itemSelectionHeaders" :items="itemSelection" class="elevation-0">
                                <template v-if="userCanPerformAction" v-slot:item.action="{ item }">
                                    <v-icon small @click="editChemical(item)">mdi-pencil</v-icon>
                                    <v-icon small @click="deleteChemicalList(item.id)">mdi-delete</v-icon>
                                </template>
                            </v-data-table>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primaryGreen" class="elevation-0" @click="addChemicalDialog = true" dark fab small
                                    ><v-icon>mdi-plus</v-icon></v-btn
                                >
                            </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <v-dialog persistent v-model="addChemicalDialog" max-width="300px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Add Chemical</span>
                            <v-spacer></v-spacer>
                            <v-btn class="py-0 my-0" text icon color="white" @click="addChemicalDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Name" v-model="chemicalNameField"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryGreen white--text" class="elevation-0" @click="addChemical" small>Add</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog persistent v-model="editChemicalDialog" max-width="300px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Edit Chemical</span>
                            <v-spacer></v-spacer>
                            <v-btn class="py-0 my-0" text icon color="white" @click="editChemicalDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <v-text-field label="Name" v-model="chemicalNameField"></v-text-field>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryGreen white--text" text class="elevation-0" @click="editChemicalDialog = false"
                                >Cancel</v-btn
                            >
                            <v-btn color="primaryGreen white--text" class="elevation-0" @click="editChemicalList">Confirm</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog persistent v-model="deleteChemicalDialog" max-width="300px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Delete Chemical</span>
                            <v-spacer></v-spacer>
                            <v-btn class="py-0 my-0" text icon color="white" @click="deleteChemicalDialog = false">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <h3 class="mt-3">Are you sure want to remove this chemical?</h3>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primaryGreen white--text" class="elevation-0" text @click="deleteChemicalDialog = false"
                                >Cancel</v-btn
                            >
                            <v-btn color="primaryGreen white--text" class="elevation-0" @click="deleteChemical">Confirm</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
import axios from 'axios'
import TextEditor from '@/components/Global/TextEditor'

export default {
    components: {
        'text-editor': TextEditor,
    },
    props: {
        id: {
            required: true,
        },
    },
    data() {
        return {
            facilityID: '',
            pagination: {
                sortBy: 'date',
                descending: true,
            },
            loading: false,
            item: 0,
            editDialog: false,
            addChemicalDialog: false,
            editChemicalDialog: false,
            deleteChemicalDialog: false,
            chemicalNameField: '',
            pickedChemical: '',
            rowsPerPage: [10, 20, 30, { text: '$vuetify.dataIterator.rowsPerPageAll', value: -1 }],
            headers: [
                { text: 'No', value: 'No', sortable: false },
                { text: 'Document Name', value: 'DocumentName' },
                { text: 'Version', value: 'Version' },
                { text: 'Date Published', value: 'Date' },
                { text: 'Published By', value: 'PublishedBy' },
                { text: 'Remarks', value: 'Remarks', sortable: false },
                { text: 'Action', align: 'center', value: 'Action', sortable: false },
            ],
            datadetails: [],
            html: '',
            itemSelection: [],
            itemSelectionHeaders: [
                { text: 'Name', value: 'chemical' },
                { text: 'Action', align: 'right', value: 'action' },
            ],
            selectionValue: '',
            currentCat: 'potentialHazards',
            itemList: [
                { name: 'Potential Hazards', code: 'potentialHazard', isActive: true },
                { name: 'Public Safety', code: 'publicSafety', isActive: false },
                { name: 'Emergency Response', code: 'emergencyResponse', isActive: false },
                { name: 'Safe Distance', code: 'safeDistance', isActive: false },
                { name: 'Potential Major Accident', code: 'potentialMajorAccident', isActive: false },
            ],
            itemActive: '',
            editAction: false,
        }
    },
    watch: {
        selectionValue(val) {
            this.item = 0
            this.chosenList(this.itemList[0])
            let tempVal = this.itemSelection.findIndex((el) => el.chemical == val)
            this.html = this.itemSelection[tempVal]['potentialHazard']
        },
        currentCat(val) {
            let tempVal = this.itemSelection.findIndex((el) => el.chemical == this.selectionValue)
            console.log(this.selectionValue)
            this.html = this.itemSelection[tempVal][val]
        },
    },
    methods: {
        getFacilityId(currFacility) {
            let id = ''
            if (currFacility instanceof Array) {
                const [fullFacilityName] = currFacility
                const [item, type, location] = fullFacilityName.split('_')
                id = location
            } else {
                id = currFacility
            }
            return id
        },
        editChemical(item) {
            this.pickedChemical = item.id
            this.chemicalNameField = item.chemical
            this.editChemicalDialog = true
        },
        editChemicalList() {
            let data = {
                id: this.pickedChemical,
                facilityId: this.facilityID,
                chemical: this.chemicalNameField,
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/chemicalinfo/edit`, data, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response)
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally((resolve) => {
                    this.pickedChemical = ''
                    this.editChemicalDialog = false
                })
        },
        getDataFromChild(value) {
            this.html = value // someValue
            this.editAction = false
        },
        getData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/chemicalinfo/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    this.itemSelection = []
                    this.itemSelection = response.data
                    console.log(this.itemSelection)
                    if (this.selectionValue == '') {
                        this.selectionValue = this.itemSelection[0].chemical
                    }
                    let tempVal = this.itemSelection.findIndex((el) => el.chemical == this.selectionValue)

                    this.html = this.itemSelection[tempVal][this.currentCat]
                })
                .catch((error) => {
                    this.html = ''
                    console.log(error)
                })
        },
        addChemical() {
            let data = {
                id: `${this.facilityID}-${Date.now()}`,
                facilityId: `${this.facilityID}`,
                chemical: this.chemicalNameField,
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/chemicalinfo/add`, data, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response)
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally((resolve) => {
                    this.addChemicalDialog = false
                })
        },
        deleteChemicalList(id) {
            this.pickedChemical = id
            this.deleteChemicalDialog = true
        },
        deleteChemical() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/chemicalinfo/delete/${this.pickedChemical}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally((resolve) => {
                    this.pickedChemical = ''
                    this.deleteChemicalDialog = false
                })
        },
        chosenList(item) {
            this.itemList.find((obj) => obj.isActive).isActive = false
            item.isActive = true
            this.currentCat = item.code
            //CALL FUNC LEPAS CLICK LIST
        },
        save() {
            this.$refs.textEditor.passDatatoParent()
            this.editData(this.selectionValue, this.currentCat, this.html)
            //SAVE WYSIWYG
        },
        editData(chemical, category, content) {
            let tempVal = this.itemSelection.findIndex((el) => el.chemical == chemical)
            this.itemSelection[tempVal][category] = content

            axios
                .post(`${process.env.VUE_APP_API_URL}/chemicalinfo/edit`, this.itemSelection[tempVal], {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData(this.id)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
    mounted() {
        this.facilityID = this.getFacilityId(this.id)
        this.getData()
    },
}
</script>

<style lang="scss" scoped>
::v-deep .v-text-field input {
    font-size: 12px !important;
}
.tableBorder {
    ::v-deep table {
        border-collapse: collapse;
        width: 100%;
    }

    ::v-deep th {
        color: rgba(0, 0, 0, 0.54);
        font-weight: 500;
        font-size: 12px;
    }

    ::v-deep td {
        font-weight: 500;
        font-size: 12px;
    }

    ::v-deep th,
    ::v-deep td {
        padding: 15px 24px;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    ::v-deep td p {
        margin-bottom: 0px;
    }

    ::v-deep th p {
        margin-bottom: 0px;
    }

    ::v-deep tr:hover {
        background-color: #f5f5f5;
    }

    ::v-deep pre code {
        padding: 0.7rem 1rem;
        border-radius: 5px;
        background: #000;
        color: #fff;
        font-size: 0.8rem;
        overflow-x: auto;
        display: block;
    }

    ::v-deep p code {
        display: inline-block;
        padding: 0 0.4rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: bold;
        background: rgba(#000, 0.1);
        color: rgba(#000, 0.8);
    }
}
</style>
