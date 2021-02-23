<template>
    <v-container grid-list-xl>
        <v-layout row wrap class="mb-4 mt-1">
            <v-flex xs12 class="mb-5">
                <v-card-actions class="mb-5">
                    <v-text-field
                        class="pt-0 mt-0"
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <template v-if="userCanPerformAction">
                        <v-btn color="primaryGreen white--text" small class="ml-2 elevation-0" @click="addbtn()">
                            <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                            Add
                        </v-btn>
                        <v-btn color="primaryGreen white--text" small class="elevation-0" @click="exportDialog = true">
                            <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                            Export
                        </v-btn>
                    </template>
                </v-card-actions>
                <v-card>
                    <v-data-table
                        :headers="headers"
                        :items="dataDetails"
                        :search="search"
                        :sort-by="['dateCr']"
                        :sort-desc="[true, false]"
                        must-sort
                        class="elevation-0"
                    >
                        <template v-slot:header.dateCr>
                            <button @click="toggleSortState">Date & Time</button>
                        </template>
                        <template v-slot:item.dateCr="{ item }">
                            {{ item.dateCr }}
                        </template>
                        <template v-slot:item.action="{ item }">
                            <template v-if="userCanPerformAction">
                                <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                            </template>
                            <span v-else>-</span>
                        </template>
                    </v-data-table>
                </v-card>
                <v-dialog persistent v-model="dialog" max-width="500px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="headline subheading font-weight-medium">Notification</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container grid-list-xl>
                                <v-layout wrap>
                                    <v-flex xs12>
                                        <v-text-field v-model="editedItem.notificationTitle" label="Notification"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field v-model="editedItem.to" label="To"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                        <v-text-field v-model="editedItem.message" label="Message"></v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn small dark outlined depressed color="primaryGreen" @click="close">Cancel</v-btn>
                            <v-btn
                                :loading="isLoading"
                                small
                                depressed
                                color="primaryGreen"
                                class="white--text"
                                @click="addPerson"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="delDialog" max-width="500px">
                    <v-card class="pa-3">
                        <v-card-title>
                            <span class="headline">Delete</span>
                        </v-card-title>
                        <v-card-text>
                            Are you sure you want to delete this event?
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
                            <v-btn small class="elevation-0" color="primaryGreen white--text" @click="getDeleteData">OK</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="exportDialog" max-width="600px">
                    <v-card>
                        <v-card-title class="primaryGreen white--text">
                            <span class="subheading font-weight-medium">Export</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container class="pb-0" grid-list-xl>
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
                                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="exportFile"
                                        >OK</v-btn
                                    >
                                </v-card-actions>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import XLSX from 'xlsx'

export default {
    data() {
        return {
            asc: false,
            isLoading: false,
            delDialog: false,
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            dateModal: false,
            timeModal: false,
            exportFileName: '',
            dialog: false,
            editedIndex: -1,
            search: '',
            headers: [
                { text: 'Date & Time', value: 'dateCr', sortable: true },
                { text: 'Notification', value: 'notificationTitle', sortable: true },
                { text: 'To', value: 'to', sortable: true },
                { text: 'Message', value: 'message', sortable: false },
                { text: 'Action', align: 'center', value: 'action', sortable: false },
            ],
            dataDetails: [],
            editedItem: {
                dateCr: '',
                notification: '',
                to: '',
                message: '',
            },
        }
    },
    methods: {
        toggleSortState() {
            this.asc = !this.asc
        },
        toDateTime(date) {
            return moment(date).format('DD-MMM-YYYY HH:mm')
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
        },
        generateExcel() {
            let forExcel = []
            let sortedArrayData
            if (this.asc) {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
            }
            console.log(sortedArrayData)
            sortedArrayData.forEach((el, index) => {
                forExcel.push({
                    No: index + 1,
                    'Date & Time': this.toDateTime(el.dateCr),
                    Notification: el.notificationTitle,
                    To: el.to,
                    Message: el.message,
                })
            })

            // Only array possible
            var jsonData = XLSX.utils.json_to_sheet(forExcel)

            // A workbook is the name given to an Excel file
            var wb = XLSX.utils.book_new()

            // add Worksheet to Workbook
            XLSX.utils.book_append_sheet(wb, jsonData, 'data')

            // export Excel file
            XLSX.writeFile(wb, `${this.exportFileName}.xlsx`)
        },
        breakword(word, num) {
            var index = 10
            if (word.length > 11) {
                return word.substring(0, index) + '\n' + word.substring(index)
            } else {
                return word
            }
        },
        generatePDF() {
            var pdfMake = require('pdfmake/build/pdfmake.js')
            if (pdfMake.vfs == undefined) {
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs
            }

            let arrBasket = []
            let y

            let sortedArrayData
            if (this.asc) {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr > b.dateCr ? 1 : -1))
            } else {
                sortedArrayData = [...this.dataDetails].sort((a, b) => (a.dateCr < b.dateCr ? 1 : -1))
            }
            console.log(sortedArrayData)
            for (y = 0; y < this.sortedArrayData.length; y++) {
                let bb = []
                console.log(this.dataDetails)
                bb.push(
                    y + 1,
                    this.breakword(this.toDateTime(this.sortedArrayData[y].dateCr)),
                    this.sortedArrayData[y].notificationTitle,
                    this.breakword(this.sortedArrayData[y].to),
                    this.sortedArrayData[y].message
                )
                arrBasket.push(bb)
            }

            arrBasket.unshift(['NO.', 'DATE & TIME', 'NOTIFICATION', 'TO', 'MESSAGE'])
            console.log(arrBasket)
            var docDefinition = {
                content: [
                    {
                        layout: 'lightHorizontalLines', // optional
                        table: {
                            headerRows: 1,
                            widths: ['auto', 'auto', 'auto', 'auto', 200],
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
                        fontSize: 12,
                        color: 'black',
                    },
                },
            }
            pdfMake.createPdf(docDefinition).download(`${this.exportFileName}.pdf`)
        },
        addbtn() {
            this.dialog = true
            ;(this.editedItem.notificationTitle = ''), (this.editedItem.to = ''), (this.editedItem.message = '')
        },
        addPerson() {
            this.editedItem.dateCr = `${this.editedItem.date} ${this.editedItem.time}`
            const info = {
                id: `${this.$route.params.id}-${Date.now()}`,
                emergencyId: this.$route.params.id,
                notificationTitle: this.editedItem.notificationTitle,
                to: this.editedItem.to,
                message: this.editedItem.message,
            }

            // const loading = {
            //   notificationTitle: '',
            //   to: '',
            //   message: '',
            //   dateCr: ''
            // }
            //
            // this.dataDetails.push(loading)
            this.isLoading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/notification/add`, info, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    const url = `${process.env.VUE_APP_API_URL}/notification/${this.$route.params.id}`
                    this.getfunction(url, 'add')
                    this.isLoading = false
                    this.dialog = false
                })
                .catch((error) => {
                    this.isLoading = false
                    this.dialog = false
                    console.log(error)
                })
        },
        close() {
            this.dialog = false
            this.exportFileName = this.$route.params.id
        },
        deleteItem(item) {
            this.delDialog = true
            this.deletedItem = item
        },
        getDeleteData() {
            const index = this.dataDetails.indexOf(this.deletedItem)
            this.dataDetails.splice(index, 1)
            this.getfunction(`${process.env.VUE_APP_API_URL}/notification/delete/${this.deletedItem.id}`)
            this.delDialog = false
        },

        getfunction(url, action) {
            axios
                .get(url, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })

                .then((response) => {
                    if (action == 'mounted') {
                        this.dataDetails = response.data
                        this.dataDetails.map((detail) => {
                            const patt = new RegExp('<br>')
                            if (patt.test(detail.message)) {
                                return (
                                    (detail.message = detail.message.replace(/<br>/g, ' - ')),
                                    (detail.dateCr = moment(detail.dateCr).format('DD-MMM-YYYY HH:mm:ss'))
                                )
                            }
                            return (detail.dateCr = moment(detail.dateCr).format('DD-MMM-YYYY HH:mm:ss'))
                        })
                        // this.dataDetails[1].message = this.dataDetails[1].message.replace(/<br>/g, ' - ')
                    }
                    if (action == 'add') {
                        console.log(response.data)
                        this.dataDetails = response.data
                        // let i;
                        // for (i = 0; i < response.data.length; i++) {
                        //   if(response.data[i].notificationTitle == this.editedItem.notificationTitle && response.data[i].to == this.editedItem.to){
                        //       let arr = this.array_move(response.data, i, response.data.length-1)
                        //       Object.assign(this.dataDetails[this.dataDetails.length-1], arr[arr.length-1])
                        //   }
                        // }
                    }
                    console.log(this.dataDetails)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        array_move(arr, old_index, new_index) {
            if (new_index >= arr.length) {
                var k = new_index - arr.length + 1
                while (k--) {
                    arr.push(undefined)
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
            return arr // for testing
        },
    },
    mounted() {
        this.exportFileName = this.$route.params.id
        const url = `${process.env.VUE_APP_API_URL}/notification/${this.$route.params.id}`
        this.getfunction(url, 'mounted')
    },
}
</script>
