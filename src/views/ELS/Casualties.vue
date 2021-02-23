<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12>
              <v-row>
                <v-col cols="12" sm="12" class="text-center pt-0 pb-0">
                 <v-btn-toggle mandatory>
                   <v-btn text @click="toggleTable('summary')">Summary</v-btn>
                   <v-btn text @click="toggleTable('details')" class="">Details</v-btn>
                 </v-btn-toggle>
                </v-col>
              </v-row>
              <v-card-actions class="mb-2 ma-0 pa-0 mb-5">
                 <v-text-field
                    class="mr-2"
                    v-show="summary == false"
                    v-model="search"
                    label="Search"
                    append-icon="mdi-magnify"
                    single-line
                    clearable
                    hide-details
                 ></v-text-field>
                 <v-spacer></v-spacer>
                 <template v-if="userCanPerformAction">
                   <v-btn v-show="summary == false" color="primaryGreen white--text" small depressed class="mt-3 mr-0 elevation-0" @click="addData">
                     <v-icon class="mr-1" small dark>mdi-plus</v-icon>
                     Add
                   </v-btn>
                   <v-btn v-show="summary == false" color="primaryGreen white--text" small class="mt-3 elevation-0" @click="exportDialog = true">
                     <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                     Export
                   </v-btn>
                 </template>
               </v-card-actions>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-data-table
                      :headers="tableHeaderData"
                      :items="casualtiesTableData"
                      :sort-by="['name']"
                      :sort-desc="[false, true]"
                      must-sort
                      class="elevation-1"
                      :search="search"
                      :loading="loading"
                      loading-text="Loading... Please wait"
                      :footer-props="{
                          'items-per-page-options': [10, 20, 30, -1]
                      }"
                      >
                      <template v-slot:item.triage="{ item }">
                        <div id="rcorners1" :style="triageColour(item.triage)">
                            {{ item.triage }}
                        </div>
                      </template>
                      <template v-slot:item.actions="{ item }">
                        <template v-if="userCanPerformAction">
                          <v-icon small class="mr-2" @click="editCasualtiesData(item)">mdi-pencil</v-icon>
                          <v-icon small @click="deleteItem(item.id)">mdi-delete</v-icon>
                        </template>
                        <span v-else>-</span>
                      </template>
                    </v-data-table>
                  </v-flex>
              </v-layout>
            </v-flex>
        </v-layout>
        <v-layout class="mb2" row wrap v-if="summary == false">
          <v-flex md12 xs6>
            <table>
              <thead v-for="item in legendHeader">
                <td> {{ item.name }} </td>
                <td> {{ item.name1 }} </td>
                <td> {{ item.name2 }} </td>
                <td> {{ item.name3 }} </td>
                <td> {{ item.name4 }} </td>
              </thead>
              <tbody v-for="item in legendItems">
                <td>{{item.priority}}</td>
                <td :style="legendColour(item.colour)">{{item.colour}}</td>
                <td>{{item.description}}</td>
                <td>{{item.explanation}}</td>
                <td>{{item.examples}}</td>
              </tbody>
            </table>
          </v-flex>
        </v-layout>
        <v-dialog persistent v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="primaryGreen white--text">
                <span class="subheading font-weight-medium" >{{ formTitle }} </span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pt-0">
              <v-container grid-list-md>
                <v-layout wrap row>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select v-model="editedItem.company" label="Company" :items="companyItems" ></v-select>
                  </v-flex>
                  <v-flex v-if="editedItem.company == 'Others/Third Party'" xs12>
                    <v-text-field v-model="editedItem.companyOther" label="Company (Others)"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.nok" label="Next of Kin"></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field v-model="editedItem.contact" label="Contact No"></v-text-field>
                  </v-flex>
                  <v-flex xs6>
                    <v-select v-model="editedItem.status" label="Status" :items="statusItems"></v-select>
                  </v-flex>
                  <v-flex xs12
                    <v-textarea hide-details auto-grow v-model="editedItem.remark" label="Remark"></v-textarea>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field v-model="editedItem.sendTo" label="Sent To"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select v-model="editedItem.triage" label="Triage" :items="triageItems"></v-select>
                  </v-flex>
                </v-layout>
                <template v-if="summary == false">
                  <v-layout>
                    <v-flex class="box2">
                      <ul class="legend">
                        <li id="legend">**Triage Tag Color: </li>
                        <li><span class="red"></span> Critical</li>
                        <li><span class="yellow"></span> Semi-Critical</li>
                        <li><span class="green"></span> Non-Critical </li>
                        <li><span class="black"></span> Expectant </li>
                      </ul>
                    </v-flex>
                  </v-layout>

                </template>
              </v-container>
            </v-card-text>
            <v-layout align-end justify-end>
              <v-card-actions class="pr-5 pb-5">
                <v-btn small dark outlined depressed color="primaryGreen" @click="close">Cancel</v-btn>
                <v-btn :loading="isLoading" class="pr-2" small dark depressed color="primaryGreen" @click="postCasualtiesData">OK</v-btn>
              </v-card-actions>
            </v-layout>
          </v-card>
        </v-dialog>
        <v-dialog persistent v-model="delDialog" max-width="500px">
          <v-card class="pa-3">
            <v-card-title>
              <span class="headline">Delete</span>
            </v-card-title>
            <v-card-text>
              Are you sure you want to delete this ?
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn small dark outlined depressed color="primaryGreen" @click="close">Cancel</v-btn>
              <v-btn :loading="isLoading" small color="primaryGreen white--text" @click="deleteCasualtiesData()">OK</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>
      <v-dialog v-model="exportDialog" max-width="600px">
        <v-card>
          <v-card-title class="primaryGreen white--text">
            <span class="subheading font-weight-medium">Export</span>
          </v-card-title>
          <v-card-text>
            <v-container class="pb-0" grid-list-xs,md>
                <v-text-field
                  v-model="exportFileName"
                  class="pb-2"
                  label="File Name"
                ></v-text-field>
                <span class="subheading font-weight-medium">Save as type:</span>
                <v-checkbox v-model="exportPDF" hide-details label="PDF"></v-checkbox>
                <v-checkbox v-model="exportExcel" hide-details label="Excel"></v-checkbox>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn small dark outlined depressed class="elevation-0" color="primaryGreen" @click="exportDialog = false">Cancel</v-btn>
                <v-btn small class="elevation-0" color="primaryGreen white--text" @click="exportFile">OK</v-btn>
              </v-card-actions>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
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
      loading: false,
      exportDialog: false,
      headcount: [],
      exportPDF: false,
      exportExcel: false,
      exportFileName: '',
      emergencyName:'',
      emergencyLocation:'',
      action : '',
      delSelected: '',
      delDialog: false,
      pagination: {
          page: 1,
          itemsPerPage: 10
      },
      addNew: true,
      dialog: false,
      editedIndex: -1,
      summary: true,
      search: '',
      editedItem: {
        name: '',
        company: '',
        companyOther: '',
        nok: '',
        contact: '',
        status: '',
        remark: '',
        sendTo: '',
        triage: ''
      },
      emergencyDetails: null,
      casualtiesTableData: [],
      summaryHeaders: [{
          text: 'Company',
          align: 'left',
          value: 'company',
          sortable: false
        },
        {
          text: 'Injured',
          align: 'left',
          value: 'injured',
          sortable: false
        },
        {
          text: 'Fatal',
          align: 'left',
          value: 'fatal',
          sortable: false
        },
        {
          text: 'Missing',
          align: 'left',
          value: 'missing',
          sortable: false
        },
        {
          text: 'Unknown',
          align: 'left',
          value: 'unknown',
          sortable: false
        },
        {
          text: 'Total',
          align: 'left',
          value: 'total',
          sortable: false
        }
      ],

      detailsHeaders: [
        {
          text: 'Name',
          align: 'left',
          value: 'name'
        },
        {
          text: 'Company',
          align: 'left',
          value: 'company'
        },
        {
          text: 'Company (Others / Third Party)',
          align: 'left',
          value: 'companyOther'
        },
        {
          text: 'NOK',
          align: 'left',
          value: 'nok'
        },
        {
          text: 'Contact No',
          align: 'left',
          value: 'contact'
        },
        {
          text: 'Status',
          align: 'left',
          value: 'status'
        },
        {
          text: 'Remark',
          align: 'left',
          value: 'remark'
        },
        {
          text: 'Send To',
          align: 'left',
          value: 'sendTo'
        },
        {
          text: 'Triage Tag',
          align: 'left',
          value: 'triage'
        },
        {
          text: 'Action',
          align: 'center',
          value: 'actions',
          align: 'center',
        }
      ],
      statusItems: [
        {
          text: 'Injured'
        },
        {
          text: 'Fatal'
        },
        {
          text: 'Missing'
        },
        {
          text: 'Unknown'
        }
      ],
      companyItems: [{
          text: 'PETRONAS'
        },
        {
          text: 'Contractor'
        },
        {
          text: 'Others/Third Party'
        }
      ],
      triageItems: [
        {
          text: 'Red'
        },
        {
          text: 'Yellow'
        },
        {
          text: 'Green'
        },
        {
          text: 'Black'
        },
      ],
      legendHeader: [{
        name: 'Priority',
        name1: 'Colour',
        name2: 'Description',
        name3: 'Explanation',
        name4: 'Examples',
      }],
      legendItems: [
        { priority: 1, colour: 'Red', description: 'Critical (Immediate)', explanation: 'Conditions that are a threat to a life or limb with imminent risk of deterioration. The casualty is considered first priority for aggressive resuscitation, surgical intervention or transport to advanced facilities. Injuries are severe, and are likely to survive with immediate treatment. Immediate aggressive resuscitation is required.', examples: 'Tension pneumothorax, severe bleeding.' },
        { priority: 2, colour: 'Yellow', description: 'Semi-Critical (Delayed)', explanation: 'These are conditions that could potentially progress to a serious problem requireing emergency intervention. Observation by trained persons and frequent re-triage is required. The casualty will need hospital care (and would receive immediate priority care under "normal" circumstances). Urgent emergency attention required', examples: 'Clinical suspicion of ectopic pregnancy with stable signs, proximal long bone fractures, compound fractures.' },
        { priority: 3, colour: 'Green', description: 'Non-Critical (Minor)', explanation: 'Conditions where intervention can be delayed. The casualty will require a  doctor\'s intervention, but may not deteriorate immediately. Emergency action is delayed or non-urgent till concurrent stages 1-2 above are stable or transferred ', examples: 'Closed fracture of distal areas, sprained ankle' },
        { priority: 4, colour: 'Black', description: 'Expectant (Deceased)', explanation: 'The casualty is so severely injured that they are either dead or in terminal state and beyond resuscitation.', examples: 'Lethal large area body burns.' },
      ]
    }
  },
  methods: {
    toDateTime(date) {
      return moment(date).format('DD-MMM-YYYY HH:mm')
    },

    exportFile(){
      if (this.exportPDF && this.exportExcel) {
        this.generatePDF()
        this.generateExcel()
      } else if (this.exportPDF){
        this.generatePDF()
      } else if (this.exportExcel) {
        this.generateExcel()
      }
      this.exportDialog = false
    },

    generateExcel(){
      let forExcel = []
      this.casualtiesTableData.forEach((el, index) => {
      forExcel.push({
        'No': index + 1,
        'Name': el.name,
        'Company': el.company,
        'Company (Others/Third Party)':el.companyOther,
        'NOK': el.nok,
        'Contact No': el.contact,
        'Status': el.status,
        'Remark': el.remark,
        'Send To': el.sendTo,
        'Triage Tag': el.triage
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

    generatePDF() {
      let header = [];
      this.tableHeaderData.forEach(el => {
        if (el.text != 'Actions') {
          header.push({ text: el.text, style: 'tableHeader'})
        }
      })

      let dataTable = [];

      this.casualtiesTableData.forEach((el, index) => {
        dataTable[index] = [el.name, el.company, el.companyOther, el.nok, el.contact, el.status, el.remark, el.sendTo,  el.triage]
      })

      //console.log(dataTable);

      var pdfMake = require('pdfmake/build/pdfmake.js')
      if (pdfMake.vfs == undefined){
        var pdfFonts = require('pdfmake/build/vfs_fonts.js')
        pdfMake.vfs = pdfFonts.pdfMake.vfs
      }
      var docDefinition = {
        pageOrientation: 'landscape',
        pageSize: 'A4',
        content: [
          {text: "Emergency Name : " + this.emergencyDetails.emergencyInfo.emergencyName, style: 'header'},
          {text: "Date & Time : " + this.toDateTime(this.emergencyDetails.emergencyInfo.dateCr), style: 'header'},
          {text: "Location : " + this.emergencyDetails.emergencyInfo.location, style: 'header'},
          {
            // layout: 'lightHorizontalLines', // optional
            table: {
              // widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
              body: [
                header,
                ...dataTable
              ]
            }
          }
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          }
        },
      }
      pdfMake.createPdf(docDefinition).download(`${this.exportFileName}.pdf`)
    },

    addData() {
      this.action = 'add'
        Object.keys(this.editedItem).map(key => {
          this.editedItem[key] = ''
        })
        this.dialog = true
        this.addNew = true
    },

    triageColour(triageItems){
      if (triageItems == 'Red') {
        return 'background-color: #D9272C; color: white'
      } else if (triageItems == 'Yellow') {
        return 'background-color: #fff703; color: black'
      } else if (triageItems == 'Black') {
        return 'background-color: #000000; color: white'
      } else if (triageItems == 'Green') {
        return 'background-color: #00a624; color: white'
      }
    },

    legendColour(colour){
      if (colour == 'Red') {
        return 'background-color: #D9272C; color: black'
      } else if (colour == 'Yellow') {
        return 'background-color: #fff703; color: black'
      } else if (colour == 'Black') {
        return 'background-color: #000000; color: white'
      } else if (colour == 'Green') {
        return 'background-color: #00a624; color: black'
      }
    },

    toggleTable(section) {
      this.search = ''
      if (section === 'summary') {
        this.summary = true
        this.getSummaryData()
      }
      else {
        this.summary = false
        this.getCasualtiesData()
      }
    },

    getEmergencyDetails() {
      axios.get(`${process.env.VUE_APP_API_URL}/emergency/${this.$route.params.id}`, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters.user.token
        }
      })
      .then(response => {
          this.emergencyDetails = response.data
      })
      .catch(error => {
        console.log(error)
      })
    },

    getCasualtiesData() {
      this.loading = true
        axios.get(`${process.env.VUE_APP_API_URL}/casualties/details/${this.$route.params.id}`, {
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters.user.token
          }
        })
        .then(response => {
          this.casualtiesTableData = response.data
          this.loading = false
        })
        .catch(error => {
          // handle error
          console.log(error)
          this.loading = false
        })
    },

    postCasualtiesData() {
      let payload
      let path
      if (this.action == 'add'){
         payload = {
          id: `${this.$route.params.id}-${Date.now()}`,
          emergencyId: this.$route.params.id,
          name : this.editedItem.name,
          company: this.editedItem.company,
          companyOther: this.editedItem.companyOther,
          contact: this.editedItem.contact,
          nok: this.editedItem.nok,
          sendTo: this.editedItem.sendTo,
          status: this.editedItem.status,
          remark: this.editedItem.remark,
          triage:this.editedItem.triage
        }
        path = '/casualties/add'
      }
      if (this.action == 'edit'){
        payload = {
         ...this.editedItem
       }
       path = '/casualties/edit'
      }
      this.isLoading = true
      axios.post(`${process.env.VUE_APP_API_URL}${path}`, payload, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters.user.token
        }
      })
      .then(response => {
        this.getCasualtiesData()
        this.isLoading = false
        this.save()
        this.close()
      })
      .catch(error => {
        this.isLoading = false
        console.log(error)
      })
    },

    editCasualtiesData(item) {
      this.action= 'edit'
      this.addNew = false
      this.editItem(item)
    },

    deleteCasualtiesData(id, index) {
      this.isLoading = true
      axios.get(`${process.env.VUE_APP_API_URL}/casualties/delete/${this.delSelected}`, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters.user.token
        }
      })
      .then(response => {
          let temp = this.casualtiesTableData.findIndex(item => item.id === this.delSelected)
          this.casualtiesTableData.splice(temp, 1)
          this.isLoading = false
          this.close()
      })
      .catch(error => {
          this.getCasualtiesData()
          this.isLoading = false
          this.close()
      })
    },

    deleteItem(val) {
      this.delSelected = val
      this.delDialog = true
    },

    getSummaryData() {
      this.loading = true
      axios.get(`${process.env.VUE_APP_API_URL}/casualties/summary/${this.$route.params.id}`, {
        headers: {
          'Authorization': 'Bearer ' + this.$store.getters.user.token
        }
      })
      .then(response => {
        this.casualtiesTableData = response.data
        this.loading = false
      })
      .catch(error => {
          console.log(error)
          this.loading = false
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.casualtiesTableData[this.editedIndex], this.editedItem)
      } else {
        this.casualtiesTableData.push(this.editedItem)
      }
    },

    editItem(item) {
      this.editedIndex = this.casualtiesTableData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    close() {
      this.dialog = false
      this.delDialog = false
      this.exportFileName = this.$route.params.id
    },
  },

  computed: {
    formTitle() {
      return this.addNew ? 'Casualties' : 'Edit'
    },

    tableHeaderData() {
      return this.summary ? this.summaryHeaders : this.detailsHeaders
    }
  },

  mounted() {
    this.loading = true
    this.exportFileName = this.$route.params.id
    this.getEmergencyDetails()
    if(this.summary == true) {
      this.getSummaryData()
    } else {
      this.getCasualtiesData()
    }
  }
}
</script>

<style lang="scss" scoped>
.border-1 {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

table {
  border-collapse: collapse;
  border: 1px solid black;
  width: 100%;

}

table, thead, td {
  font-family: "Roboto", sans-serif;
  border: 1px solid #ddd;
  height: 30px;
}

thead {
  font-weight: bold;
  background-color: #bcc9cf
}
td {
  padding: 5px;
  font-size: 11.5px;
}

#rcorners1 {
  border-radius: 4px;
  text-align: center;
  width: 90px;
  height: 30px;
  line-height: 30px;
}

.box {
  padding: 5px;
  margin-left: -30px;
}

.box2 {
  margin-left: -10px;
  font-size: 12px;
}

#legend {
  font-style: italic;
}

.legend {
  list-style: none;
  span {
    float: left; width: 15px; height: 15px; margin: 2px;
  }
  .black { background-color: #000000; }
  .green { background-color: #00a624; }
  .yellow { background-color: #fff703; }
  .red { background-color: #D9272C; }
  li {
    float: left;
    margin: 7px;
  }
 }

</style>
