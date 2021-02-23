<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
                <v-container>
                    <template>
                        <v-card-actions v-if="userCanPerformAction" class="ma-0 mb-5 pb-3">
                            <v-spacer></v-spacer>
                            <v-btn color="primaryGreen white--text" small class="elevation-0 " @click="showLayout">
                                <v-icon small dark>{{ button.icon }}</v-icon>
                                {{ button.text }}
                            </v-btn>
                            <v-btn color="primaryGreen white--text" small class="elevation-0" @click="exportDialog = true">
                                <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                                Export
                            </v-btn>
                        </v-card-actions>
                    </template>

                    <v-card>
                        <v-layout row wrap>
                            <v-flex xs6 sm6 md6 pr-3>
                                <v-chip pill class="ml-3 mt-3">
                                    <v-avatar left color="primaryGreen" class="white--text">
                                        {{ counter.present }}
                                    </v-avatar>
                                    Present
                                </v-chip>
                                <v-chip pill class="ml-3 mt-3">
                                    <v-avatar left color="red" class="white--text">
                                        {{ counter.absent }}
                                    </v-avatar>
                                    Absent
                                </v-chip>
                            </v-flex>
                            <v-flex xs12 sm6 md6 pr-5 pl-5>
                                <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    single-line
                                    hide-details
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row v-show="isShowing" class="pa-3" wrap>
                            <v-flex xs12 sm3 md3 pr-3>
                                <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm2 md2 pr-3>
                                <v-text-field v-model="editedItem.staffId" label="Staff ID"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm2 md2 pr-3>
                                <v-select v-model="editedItem.company" label="Company" :items="companyItems"></v-select>
                            </v-flex>
                            <v-flex xs12 sm3 md3 pr-3>
                                <v-text-field v-model="editedItem.remarks" label="Remarks"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm2 md2 pr-3>
                                <v-switch v-model="editedItem.attendance" label="Attendance" color="primaryGreen"></v-switch>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-btn small dark outlined depressed color="primaryGreen" class="ml-0" @click="cancelItem"
                                    >Cancel</v-btn
                                >
                                <v-btn
                                    :loading="isLoading"
                                    small
                                    depressed
                                    color="primaryGreen"
                                    class="white--text ml-2"
                                    @click="addPerson"
                                    ><v-icon small>mdi-plus</v-icon>Add</v-btn
                                >
                            </v-flex>
                        </v-layout>

                        <v-data-table
                            :headers="headers"
                            :items="headcount"
                            :sort-by="['name']"
                            :sort-desc="[false, true]"
                            must-sort
                            :search="search"
                            class="elevation-0"
                            :footer-props="{
                                'items-per-page-options': [10, 20, 30, -1],
                            }"
                        >
                            <!-- <template v-slot:item.no="{ item }">{{ setPageNumber(item.no + 1, pagination.page, pagination.itemsPerPage) }}</template> -->
                            <template v-slot:item.attendance="{ item }">
                                <v-switch
                                    :loading="isLoading"
                                    v-model="item.attendance"
                                    class="mt-0"
                                    hide-details
                                    color="primaryGreen"
                                    @change="postfunction(item, 'edit')"
                                ></v-switch>
                            </template>
                            <template v-slot:item.Action="{ item }">
                                <template v-if="userCanPerformAction">
                                    <v-icon small @click="editItem(item)">mdi-pencil</v-icon>
                                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                                </template>
                                <span v-else>-</span>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-container>
                <!-- EDIT DIALOG -->
                <v-dialog persistent v-model="dialog" max-width="500px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Edit</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-md>
                                <v-layout wrap>
                                    <v-flex xs12 sm12 md12>
                                        <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-text-field v-model="editedItem.staffId" label="Staff ID"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12 sm6 md6>
                                        <v-select v-model="editedItem.company" label="Company" :items="companyItems"></v-select>
                                    </v-flex>
                                    <v-flex xs12 sm12 md12>
                                        <v-textarea v-model="editedItem.remarks" filled label="Remarks" auto-grow></v-textarea>
                                    </v-flex>
                                    <v-flex xs12 sm4 md4>
                                        <v-switch
                                            v-model="editedItem.attendance"
                                            label="Attendance"
                                            color="primaryGreen"
                                        ></v-switch>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small dark outlined depressed color="primaryGreen" @click="close">Cancel</v-btn>
                            <v-btn :loading="isLoading" small depressed color="primaryGreen" class="white--text" @click="save"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <!-- EXPORT DIALOG -->
                <v-dialog persistent v-model="exportDialog" max-width="600px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Export</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="pb-0" grid-list-xs,md>
                                <v-text-field v-model="exportFileName" class="pb-2" label="File Name"></v-text-field>
                                <span class="subheading font-weight-medium">Save as type:</span>
                                <v-checkbox v-model="exportPDF" hide-details label="PDF"></v-checkbox>
                                <v-checkbox v-model="exportExcel" hide-details label="Excel"></v-checkbox>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        small
                                        dark
                                        outlined
                                        depressed
                                        class="elevation-0"
                                        color="primaryGreen"
                                        @click="exportDialog = false"
                                        >Cancel</v-btn
                                    >
                                    <v-btn
                                        :loading="isLoading"
                                        small
                                        class="elevation-0"
                                        color="primaryGreen white--text"
                                        @click="exportFile"
                                        >OK</v-btn
                                    >
                                </v-card-actions>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
                <!-- DELETE DIALOG -->
                <v-dialog persistent v-model="delDialog" max-width="500px">
                    <v-card class="pa-3">
                        <v-card-title>
                            <span class="headline">Delete</span>
                        </v-card-title>
                        <v-card-text>
                            Are you sure you want to delete this name?
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                dark
                                outlined
                                depressed
                                class="elevation-0"
                                color="primaryGreen"
                                @click="delDialog = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                :loading="isLoading"
                                small
                                class="elevation-0"
                                color="primaryGreen white--text"
                                @click="getDeleteData"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'
import moment from 'moment'
import momentTZ from 'moment-timezone'

export default {
    data() {
        return {
            isLoading: false,
            search: '',
            remarks: '',
            emergencyLocation: '',
            emergencydate: '',
            emergencyName: '',
            pagination: {
                page: 1,
                itemsPerPage: 10,
            },
            dialog: false,
            exportDialog: false,
            exportFileName: '',
            exportPDF: false,
            exportExcel: false,
            attendancePick: '',
            delDialog: false,
            editedIndex: -1,
            button: {
                text: ' Add',
                icon: 'mdi-plus',
            },
            isShowing: false,
            headers: [
                // {
                //     text: 'No.',
                //     align: 'left',
                //     sortable: false,
                //     value: 'no'
                // },
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name',
                    sortable: true,
                },
                {
                    text: 'Staff ID',
                    align: 'left',
                    value: 'staffId',
                    sortable: true,
                },
                {
                    text: 'Company',
                    align: 'left',
                    value: 'company',
                    sortable: true,
                },
                {
                    text: 'Remarks',
                    align: 'left',
                    value: 'remarks',
                    sortable: false,
                },
                {
                    text: 'Attendance',
                    align: 'left',
                    value: 'attendance',
                    sortable: true,
                },
                {
                    text: 'Action',
                    align: 'left',
                    value: 'Action',
                    sortable: false,
                },
            ],
            headcount: [],
            editedItem: {
                name: '',
                staffId: '',
                company: '',
                remarks: '',
                attendance: '',
            },
            counter: {
                absent: '',
                present: '',
            },
            companyItems: [
                {
                    text: 'PETRONAS',
                },
                {
                    text: 'Contractor',
                },
                {
                    text: 'Others/Third Party',
                },
            ],
        }
    },
    methods: {
        toDateTime(date) {
            return moment(date).format('DD-MMM-YYYY HH:mm')
        },

        returnPresntRemark(val, ind) {
            if (ind == 'attendance') {
                if (val == true) {
                    return 'present'
                } else {
                    return 'absent'
                }
            }

            if (ind == 'remarks') {
                if (!val) {
                    return ' '
                } else {
                    return val
                }
            }
        },
        exportFile() {
            if (this.exportPDF && this.exportExcel) {
                this.generatePDF()
                this.generateExcel()
            } else if (this.exportPDF) {
                this.generatePDF()
            } else if (this.exportExcel) {
                this.generateExcel()
            }
            this.exportDialog = false
        },
        generateExcel() {
            let forExcel = []
            this.headcount.forEach((el, index) => {
                forExcel.push({
                    No: index + 1,
                    Name: el.name,
                    'Staff ID': el.staffId,
                    Company: el.company,
                    remarks: this.returnPresntRemark(el.remarks, 'remarks'),
                    Attendance: this.returnPresntRemark(el.attendance, 'attendance'),
                })
            })

            //bb.push(y+1,this.headcount[y].name, this.headcount[y].staffId, this.headcount[y].company, this.remarks, this.attendancePick)

            // Only array possible
            var jsonData = XLSX.utils.json_to_sheet(forExcel)

            // A workbook is the name given to an Excel file
            var wb = XLSX.utils.book_new()

            // add Worksheet to Workbook
            XLSX.utils.book_append_sheet(wb, jsonData, 'data')

            // export Excel file
            XLSX.writeFile(wb, `${this.exportFileName}.xlsx`)
        },
        generatePDF() {
            var pdfMake = require('pdfmake/build/pdfmake.js')
            if (pdfMake.vfs == undefined) {
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs
            }

            let arrBasket = []
            let y

            for (y = 0; y < this.headcount.length; y++) {
                let bb = []

                bb.push(
                    y + 1,
                    this.headcount[y].name,
                    this.headcount[y].staffId,
                    this.headcount[y].company,
                    this.returnPresntRemark(this.headcount[y].remarks, 'remarks'),
                    this.returnPresntRemark(this.headcount[y].attendance, 'attendance')
                )
                arrBasket.push(bb)
            }

            arrBasket.unshift(['NO.', 'NAME', 'STAFF ID', 'COMPANY', 'REMARKS', 'ATTENDANCE'])
            console.log(arrBasket)
            var docDefinition = {
                content: [
                    {
                        text: 'Emergency Name : ' + this.emergencyName,
                        style: 'header',
                    },
                    {
                        text: 'Date & Time : ' + this.toDateTime(this.emergencydate),
                        style: 'header',
                    },
                    {
                        text: 'Location : ' + this.emergencyLocation,
                        style: 'header',
                    },

                    {
                        layout: 'lightHorizontalLines', // optional
                        table: {
                            headerRows: 1,
                            widths: ['auto', '*', 100, 'auto', 'auto', 'auto'],
                            body: arrBasket,
                        },
                    },
                ],
                styles: {
                    header: {
                        fontSize: 15,
                        bold: true,
                        margin: [0, 0, 0, 10],
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5],
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black',
                    },
                },
            }
            pdfMake.createPdf(docDefinition).download(`${this.exportFileName}.pdf`)
        },
        addPerson() {
            const info = {
                id: `${this.$route.params.id}-${Date.now()}`,
                emergencyId: this.$route.params.id,
                name: this.editedItem.name,
                staffId: this.editedItem.staffId,
                company: this.editedItem.company,
                remarks: this.editedItem.remarks,
                attendance: this.editedItem.attendance,
            }

            if (info.attendance == true) {
                info.attendance = 1
            } else {
                info.attendance = 0
            }
            //console.log(info);
            this.headcount.push(info)
            this.postfunction(info, 'add')
            this.cancelItem()
        },
        deleteItem(item) {
            this.delDialog = true
            this.deletedItem = item
        },
        getDeleteData() {
            const index = this.headcount.indexOf(this.deletedItem)

            this.headcount.splice(index, 1)
            this.getfunction(`${process.env.VUE_APP_API_URL}/headcount/delete/${this.deletedItem.id}`)
            this.isLoading = false

            if (this.deletedItem.attendance == true) {
                this.counter.present = this.counter.present - 1
            } else {
                this.counter.absent = this.counter.absent - 1
            }
            this.delDialog = false
        },
        editItem(item) {
            this.editedIndex = this.headcount.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
            this.isLoading = false
            this.isShowing = false
            this.button.text = 'Add'
        },
        close() {
            this.dialog = false
            this.exportFileName = this.$route.params.id
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.headcount[this.editedIndex], this.editedItem)
            } else {
                this.headcount.push(this.editedItem)
            }
            this.postfunction(this.editedItem, 'edit')

            this.close()
        },

        cancelItem() {
            this.editedItem.name = ''
            this.editedItem.staffId = ''
            this.editedItem.company = ''
            this.editedItem.remarks = ''
            this.editedItem.attendance = ''
        },
        showLayout() {
            this.cancelItem()
            this.isShowing ^= true
            if (this.isShowing == false) {
                this.button.text = 'Add'
                this.button.icon = 'mdi-plus'
            } else {
                this.button.text = 'Close'
                this.button.icon = ''
            }
        },
        getStatus(status) {
            this.attendance = status
        },
        postfunction(data, action) {
            if (data.attendance == true || data.attendance == 1) {
                data.attendance = 1
                if (action == 'add') {
                    this.counter.present = this.counter.present + 1
                }
            } else {
                data.attendance = 0
                if (action == 'add') {
                    this.counter.absent = this.counter.absent + 1
                }
            }
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/headcount/${action}`, data, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.isLoading = false
                    this.getfunction(`${process.env.VUE_APP_API_URL}/headcount/${this.$route.params.id}`, 'mounted')
                    // if (action == 'edit') {
                    //   this.getfunction(`${process.env.VUE_APP_API_URL}/headcount/${action}/${this.$route.params.id}`, "mounted")
                    // }
                })
                .catch((error) => {
                    this.isLoading = false
                    this.dialog = false
                    this.delDialog = false
                    console.log(error)
                })
        },
        getfunction(url, action) {
            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response)
                    if (action == 'emrgencyTitle') {
                        this.emergencyName = response.data.emergencyInfo.emergencyName
                        // console.log(this.emergencyName)
                        this.emergencydate = response.data.emergencyInfo.dateCr
                        this.emergencyLocation = response.data.emergencyInfo.location
                    }

                    if (action == 'mounted') {
                        let present = 0
                        let absent = 0

                        for (const res in response.data) {
                            if (response.data[res].attendance == 0) {
                                response.data[res].attendance = false
                                absent = absent + 1
                            } else {
                                response.data[res].attendance = true
                                present = present + 1
                            }
                        }

                        this.headcount = response.data
                        this.counter.present = present
                        this.counter.absent = absent
                    } else {
                        this.deletedItem = null
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        },
    },
    mounted() {
        this.exportFileName = this.$route.params.id
        // console.log(this.$route.params.id);
        const url = `${process.env.VUE_APP_API_URL}/headcount/${this.$route.params.id}`
        this.getfunction(url, 'mounted')

        const url2 = `${process.env.VUE_APP_API_URL}/emergency/${this.$route.params.id}`
        this.getfunction(url2, 'emrgencyTitle')
    },
}
</script>

<style lang="scss" scoped>
.btn-page {
    margin: 6px 0;
}
</style>
