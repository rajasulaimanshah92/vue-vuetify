<template>
    <v-card class="elevation-0">
        <v-card-text>
            <v-layout row wrap>
                <!-- LEFT PANEL ITEM -->
                <v-flex pl-3 pt-3 xs3>
                    <v-list flat nav>
                        <v-list-item-group v-model="item" color="primary">
                            <v-list-item
                                v-for="(obj, index) in leftPanelItems"
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
                <v-flex pa-3 xs9>
                    <!-- WYSIWYG TEXT EDITOR -->
                    <v-layout row wrap v-if="editAction">
                        <v-flex v-if="currentCat == 'generalInformation'" xs12>
                            <text-editor ref="textEditor" @clicked="getDataFromChild" :id="id" :html="html"></text-editor>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn depressed @click="editAction = !editAction" text small color="primaryGreen">Cancel</v-btn>
                                <v-btn depressed @click="save" small color="primaryGreen white--text">Save</v-btn>
                            </v-card-actions>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap v-else>
                        <!-- GENERAL INFORMATION -->
                        <v-flex v-show="currentCat == 'generalInformation'" xs12>
                            <v-container class="pt-0" grid-list-xs>
                                <div class="tableBorder" v-html="html"></div>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        v-if="userCanPerformAction"
                                        depressed
                                        @click="editAction = !editAction"
                                        small
                                        color="primaryGreen white--text"
                                        >Edit</v-btn
                                    >
                                </v-card-actions>
                            </v-container>
                        </v-flex>
                        <!-- HEADCOUNT -->
                        <v-flex v-show="currentCat == 'headCount'" xs12>
                            <v-container grid-list-xs>
                                <v-card-actions>
                                    <h3>Headcount</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        v-if="userCanPerformAction"
                                        color="primaryGreen white--text"
                                        small
                                        class="elevation-0"
                                        @click="addUserDialog = true"
                                    >
                                        <v-icon small dark>mdi-plus</v-icon>
                                        Add
                                    </v-btn>
                                    <v-btn
                                        v-if="userCanPerformAction"
                                        color="primaryGreen white--text"
                                        small
                                        class="elevation-0"
                                        @click="openDialog()"
                                    >
                                        <v-icon small dark>mdi-file-import</v-icon>
                                        Import Excel
                                    </v-btn>
                                </v-card-actions>
                                <v-data-table
                                    :headers="headcountHeaders"
                                    :sort-by="['name']"
                                    :sort-desc="[false, true]"
                                    :items="headcountData"
                                    class="elevation-0"
                                >
                                    <template v-if="loading" v-slot:no-data>
                                        <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                                    </template>
                                    <template v-slot:item.action="{ item }">
                                        <template v-if="userCanPerformAction">
                                            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
                                            <v-icon small @click="deleteItem(item.id)">mdi-delete</v-icon>
                                        </template>
                                        <span v-else>-</span>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </v-flex>
                        <!-- EMERGENCY CONTACT -->
                        <v-flex v-show="currentCat == 'emergencyContact'" xs12>
                            <v-container grid-list-xs>
                                <v-card-actions>
                                    <h3>Emergency Contacts</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        v-if="userCanPerformAction"
                                        color="primaryGreen white--text"
                                        small
                                        class="elevation-0"
                                        @click="addContactDialog = true"
                                    >
                                        <v-icon small dark>mdi-plus</v-icon>
                                        Add
                                    </v-btn>
                                </v-card-actions>
                                <v-data-table
                                    :headers="emergencyContactHeaders"
                                    :items="emergencyContactData"
                                    class="elevation-0"
                                >
                                    <template v-if="loading" v-slot:no-data>
                                        <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                                    </template>
                                    <template v-slot:item.action="{ item }">
                                        <template v-if="userCanPerformAction">
                                            <v-icon small class="mr-2" @click="openEditEmergencyContactDialog(item)"
                                                >mdi-pencil</v-icon
                                            >
                                            <v-icon small @click="openDeleteEmergencyDialog(item.id)">mdi-delete</v-icon>
                                        </template>
                                        <span v-else>-</span>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </v-flex>
                        <!-- IAP AND CIMAH -->
                        <v-flex
                            v-show="currentCat !== 'headCount' && currentCat !== 'emergencyContact' && currentCat !== 'resources'"
                            xs12
                        >
                            <v-container grid-list-xs>
                                <v-card-actions>
                                    <h3>Documents</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        v-if="userCanPerformAction"
                                        color="primaryGreen white--text"
                                        small
                                        class="elevation-0"
                                        @click="openDocDialog()"
                                    >
                                        <v-icon small dark>mdi-plus</v-icon>
                                        Add
                                    </v-btn>
                                </v-card-actions>
                                <v-data-table :headers="headers" :items="documentData" class="elevation-0">
                                    <template v-if="loading" v-slot:no-data>
                                        <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                                    </template>
                                    <template v-slot:item.datePublished="{ item }">
                                        <span>{{ formatDate(item.datePublished) }}</span>
                                    </template>
                                    <template v-slot:item.action="{ item }">
                                        <template v-if="userCanPerformAction">
                                            <v-icon
                                                class="px-1 cursor"
                                                small
                                                @click="downloadDocument(item.id)"
                                                color="primaryGreen"
                                                >mdi-download</v-icon
                                            >
                                            <v-icon class="px-1 cursor" small @click="openEditDialog(item)" color="primaryGreen"
                                                >mdi-pencil</v-icon
                                            >
                                            <v-icon class="px-1 cursor" small @click="openDeleteDialog(item.id)" color="red"
                                                >mdi-delete</v-icon
                                            >
                                        </template>
                                        <span v-else>-</span>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </v-flex>
                        <!-- RESOURCES -->
                        <v-flex v-show="currentCat == 'resources'" xs12>
                            <v-container grid-list-xs>
                                <v-card-actions>
                                    <h3>Resources</h3>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        v-if="userCanPerformAction"
                                        color="primaryGreen white--text"
                                        small
                                        class="elevation-0"
                                        @click="addResourcesData"
                                    >
                                        <v-icon small dark>mdi-plus</v-icon>
                                        Add
                                    </v-btn>
                                </v-card-actions>
                                <v-col cols="12" sm="12" class="text-center pt-3 pb-7">
                                    <v-btn-toggle mandatory>
                                        <v-btn text @click="toggleTable('internal')">Internal</v-btn>
                                        <v-btn text @click="toggleTable('external')" class="ml-0">External</v-btn>
                                    </v-btn-toggle>
                                </v-col>
                                <v-data-table :headers="tableHeaderData" :items="resourcesTableData" class="elevation-0">
                                    <template v-if="loading" v-slot:no-data>
                                        <v-progress-linear :indeterminate="true" color="primaryGreen"></v-progress-linear>
                                    </template>
                                    <template v-slot:item.dateCr="{ item }">{{ formatDate(item.dateCr) }}</template>
                                    <template v-slot:item.actions="props">
                                        <template v-if="userCanPerformAction">
                                            <v-icon small class="mr-2" @click="editResourcesData(props.item)">mdi-pencil</v-icon>
                                            <v-icon small text @click="deleteRecourcesItem(props.item.id)">mdi-delete</v-icon>
                                        </template>
                                        <span v-else>-</span>
                                    </template>
                                </v-data-table>
                            </v-container>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card-text>
        <!-- UPLOAD FILE DIALOG -->
        <v-dialog v-model="addDocDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Import Document</span>
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
                                <v-menu v-model="dateModal" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :value="
                                                documentAdd.datePublished == ''
                                                    ? ''
                                                    : moment(documentAdd.datePublished).format('YYYY-MM-DD')
                                            "
                                            clearable
                                            label="Date published"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="documentAdd.datePublished"
                                        @change="dateModal = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs12 px-2>
                                <v-text-field label="Published by" v-model="documentAdd.publishedBy"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea filled label="Remarks" v-model="documentAdd.remarks" auto-grow></v-textarea>
                            </v-flex>
                            <v-flex xs12 px-2>
                                <v-file-input v-model="documentAdd.file" label="File input"></v-file-input>
                                <p v-show="progressBar">Please wait...</p>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="closeAddDoc()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                small
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="uploadFile()"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog v-model="addDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Import Document</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12 px-2>
                                <v-file-input accept=".xlsx" v-model="documentAdd.file" label="File input"></v-file-input>
                                <p v-show="progressBar">Please wait...</p>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="closeAddDoc()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                small
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="postHeadcount()"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- ADD USER DIALOG -->
        <v-dialog v-model="addUserDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Add User</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="nameHeadcount" label="Name"></v-text-field>
                                <v-text-field v-model="staffIdHeadcount" label="Staff ID"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="addUserDialog = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                small
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="postAddUser()"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- ADD CONTACT DIALOG -->
        <v-dialog v-model="addContactDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Add Contact</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="agencies" label="Agencies"></v-text-field>
                                <v-text-field v-model="contactNo" label="Contact No"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="closeAddContactDialog()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                small
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="addEmergencyContact()"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- EMERGENCY CONTACT EDIT DIALOG -->
        <v-dialog v-model="editContactDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Add Contact</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="selectedAgencies" label="Agencies"></v-text-field>
                                <v-text-field v-model="selectedContactNo" label="Contact No"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="closeEditContactDialog()"
                                >Cancel</v-btn
                            >
                            <v-btn
                                small
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="editEmergencyContact()"
                                >OK</v-btn
                            >
                        </v-card-actions>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- HEADCOUNT EDIT USER DIALOG -->
        <v-dialog v-model="editDialog" persistent max-width="600px">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">Edit User</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-text-field v-model="nameEditHeadcount" label="Name"></v-text-field>
                                <v-text-field v-model="staffIdEditHeadcount" label="Staff ID"></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-card-actions class="pr-0">
                            <v-spacer></v-spacer>
                            <v-btn
                                small
                                class="elevation-0"
                                text
                                color="primaryGreen"
                                :disabled="progressBar"
                                @click="editDialog = false"
                                >Cancel</v-btn
                            >
                            <v-btn
                                small
                                class="elevation-0"
                                :disabled="progressBar"
                                color="primaryGreen white--text"
                                @click="postEditUser()"
                                >OK</v-btn
                            >
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
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="deleteDialog = false">Cancel</v-btn>
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="deleteDocument()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleteEmergencyDialog" max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Delete</span>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this item?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="deleteEmergencyDialog = false"
                        >Cancel</v-btn
                    >
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="deleteEmergencyContact()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="delDialog" max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Delete</span>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this user?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text small class="elevation-0" color="primaryGreen" @click="delDialog = false">Cancel</v-btn>
                    <v-btn small class="elevation-0" color="primaryGreen white--text" @click="deleteUser()">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- Resources Dialog -->
        <v-dialog v-model="dialogResources" max-width="600px" class="d-block">
            <v-card>
                <v-card-title class="primaryGreen white--text">
                    <span class="subheading font-weight-medium">{{ formTitle }} </span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text v-if="internal == false" class="pa-0">
                    <v-container grid-list-md>
                        <v-layout wrap row>
                            <v-flex xs12>
                                <v-text-field
                                    v-model="editedExternalItem.description"
                                    label="Resources Description"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-select v-model="editedExternalItem.status" label="Status" :items="statusItems"></v-select>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="editedExternalItem.location" label="Location"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6 px-2>
                                <v-text-field
                                    name="name"
                                    label="Time"
                                    v-model="editedExternalItem.availability"
                                    hide-details
                                    @keydown="validateTime"
                                    @keyup="validateTime"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6 px-2>
                                <v-menu v-model="dateModal" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :value="editedExternalItem.dateCr"
                                            clearable
                                            label="Date"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="editedExternalItem.dateCr"
                                        @change="dateModal = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-flex xs6>
                                <v-text-field v-model="editedExternalItem.agencies" label="Agencies"></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="editedExternalItem.contactNo" label="Contact No"></v-text-field>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="editedExternalItem.personInCharge" label="Person-In-Charge"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text small class="elevation-0" color="primaryGreen" @click="closeAddDoc">Cancel</v-btn>
                        <v-btn :loading="loading" small dark depressed color="primaryGreen" @click="postResourcesExternalData"
                            >OK</v-btn
                        >
                    </v-card-actions>
                </v-card-text>
                <v-card-text v-else class="pa-0">
                    <v-container grid-list-md>
                        <v-layout wrap row>
                            <v-flex xs12>
                                <v-text-field
                                    v-model="editedInternalItem.description"
                                    label="Resources Description"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6 px-2>
                                <v-text-field
                                    name="name"
                                    label="Time"
                                    v-model="editedInternalItem.availability"
                                    hide-details
                                    @keydown="validateTime"
                                    @keyup="validateTime"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6 px-2>
                                <v-menu v-model="dateModal" :close-on-content-click="false" max-width="290">
                                    <template v-slot:activator="{ on }">
                                        <v-text-field
                                            :value="editedInternalItem.dateCr"
                                            clearable
                                            label="Date"
                                            readonly
                                            v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                        v-model="editedInternalItem.dateCr"
                                        @change="dateModal = false"
                                    ></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs6>
                                <v-select v-model="editedInternalItem.status" label="Status" :items="statusItems"></v-select>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="editedInternalItem.location" label="Location"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field v-model="editedInternalItem.personInCharge" label="Person-in-Charge"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small text dark depressed color="primaryGreen" @click="closeAddDoc">Cancel</v-btn>
                        <v-btn :loading="loading" small dark depressed color="primaryGreen" @click="postResourcesInternalData"
                            >Save</v-btn
                        >
                    </v-card-actions>
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-dialog persistent v-model="resourcesDelDialog" max-width="500px">
            <v-card class="pa-3">
                <v-card-title>
                    <span class="headline">Delete</span>
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this ?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text dark small color="primaryGreen" @click="closeAddDoc">Cancel</v-btn>
                    <v-btn :loading="loading" small color="primaryGreen white--text" @click="deleteResourcesData">OK</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import XLSX from 'xlsx'
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
            editedIndex: -1,
            resourcesDelDialog: false,
            resourcesTableData: [],
            resourcesAction: '',
            addNew: '',
            dialogResources: false,
            statusItems: [
                {
                    text: 'Assigned',
                },
                {
                    text: 'Available',
                },
                {
                    text: 'Out of Service',
                },
            ],
            editedExternalItem: {
                type: 'External',
                description: '',
                dateCr: new Date().toISOString().substr(0, 10),
                availability: moment().format('HH:mm'),
                status: '',
                location: '',
                agencies: '',
                personInCharge: '',
                contactNo: '',
            },
            editedInternalItem: {
                type: 'Internal',
                dateCr: new Date().toISOString().substr(0, 10),
                description: '',
                availability: moment().format('HH:mm'),
                status: '',
                location: '',
                personInCharge: '',
            },
            text: 'Internal',
            internal: true,
            facilityID: '',
            html: '',
            item: 0,
            dataFI: '',
            loading: false,
            dateModal: false,
            addDialog: false,
            addDocDialog: false,
            addContactDialog: false,
            deleteDialog: false,
            deleteEmergencyDialog: false,
            delDialog: false,
            editDialog: false,
            progressBar: false,
            addUserDialog: false,
            selectedDeleteId: '',
            editContactDialog: false,
            selectedAgencies: '',
            selectedContactNo: '',
            selectedEditedItem: null,
            agencies: '',
            contactNo: '',
            nameEditHeadcount: '',
            staffIdEditHeadcount: '',
            nameHeadcount: '',
            staffIdHeadcount: '',
            headcountHeaders: [
                {
                    text: 'Name',
                    value: 'name',
                },
                {
                    text: 'Staff ID',
                    value: 'staffId',
                },
                {
                    text: 'Company',
                    value: 'company',
                },
                // { text: 'Attendance', value: 'attendance' },
                {
                    text: 'Action',
                    align: 'center',
                    value: 'action',
                    sortable: false,
                },
            ],
            headcountData: [],
            emergencyContactHeaders: [
                {
                    text: 'Agency',
                    value: 'agencies',
                },
                {
                    text: 'Contact No.',
                    value: 'contactNo',
                },
                // { text: 'Attendance', value: 'attendance' },
                {
                    text: 'Action',
                    align: 'center',
                    value: 'action',
                    sortable: false,
                },
            ],
            emergencyContactData: [],
            dialog: {
                title: '',
            },
            documentAdd: {
                documentName: '',
                file: null,
                version: '',
                datePublished: moment().format('YYYY-MM-DD'),
                publishedBy: '',
                remarks: '',
            },
            docList: [],
            documentData: [],
            rowsPerPage: [
                10,
                20,
                30,
                {
                    text: '$vuetify.dataIterator.rowsPerPageAll',
                    value: -1,
                },
            ],
            headers: [
                {
                    text: 'Document Name',
                    value: 'documentName',
                },
                {
                    text: 'Version',
                    value: 'version',
                },
                {
                    text: 'Date Published',
                    value: 'datePublished',
                },
                {
                    text: 'Published By',
                    value: 'publishedBy',
                },
                {
                    text: 'Remarks',
                    value: 'remarks',
                    sortable: false,
                },
                {
                    text: 'Action',
                    align: 'center',
                    value: 'action',
                    sortable: false,
                },
            ],
            selectionValue: 'LPG',
            currentCat: 'generalInformation',
            leftPanelItems: [
                {
                    name: 'General Information',
                    code: 'generalInformation',
                    isActive: true,
                }, //te
                {
                    name: 'ERP, OSRP',
                    code: 'erp',
                    isActive: false,
                }, //up
                {
                    name: 'Headcount List, POB',
                    code: 'headCount',
                    isActive: false,
                }, //up
                {
                    name: 'Emergency Contacts',
                    code: 'emergencyContact',
                    isActive: false,
                },
                {
                    name: 'IAP',
                    code: 'iap',
                    isActive: false,
                }, //up
                {
                    name: 'CIMAH, HER, DOSO',
                    code: 'cimah',
                    isActive: false,
                }, //up
                {
                    name: 'Resources',
                    code: 'resources',
                    isActive: false,
                }, //up
            ],
            resourcesInternalHeaders: [
                {
                    text: 'Description',
                    align: 'left',
                    value: 'description',
                },
                {
                    text: 'Type',
                    align: 'left',
                    value: 'type',
                },
                {
                    text: 'Date',
                    align: 'left',
                    value: 'dateCr',
                },
                {
                    text: 'Availability Time',
                    align: 'left',
                    value: 'availability',
                },
                {
                    text: 'Status',
                    align: 'left',
                    value: 'status',
                },
                {
                    text: 'Location',
                    align: 'left',
                    value: 'location',
                },
                {
                    text: 'Person-in-Charge',
                    align: 'left',
                    value: 'personInCharge',
                },
                {
                    text: 'Action',
                    align: 'left',
                    value: 'actions',
                },
            ],
            resourcesExternalHeaders: [
                {
                    text: 'Description',
                    align: 'left',
                    value: 'description',
                },
                {
                    text: 'Type',
                    align: 'left',
                    value: 'type',
                },
                {
                    text: 'Date',
                    align: 'left',
                    value: 'dateCr',
                },
                {
                    text: 'Availability Time',
                    align: 'left',
                    value: 'availability',
                },
                {
                    text: 'Status',
                    align: 'left',
                    value: 'status',
                },
                {
                    text: 'Location',
                    align: 'left',
                    value: 'location',
                },
                {
                    text: 'Agencies',
                    align: 'left',
                    value: 'agencies',
                },
                {
                    text: 'Person-in-Charge',
                    align: 'left',
                    value: 'personInCharge',
                },
                {
                    text: 'Contact No',
                    align: 'left',
                    value: 'contactNo',
                },
                {
                    text: 'Action',
                    align: 'left',
                    value: 'actions',
                },
            ],
            itemActive: '',
            deleteId: '',
            editAction: false,
        }
    },
    watch: {
        progressBar(val) {
            console.log(val)
        },
        id(val) {
            this.leftPanelItems.find((obj) => obj.isActive).isActive = false
            this.leftPanelItems[0].isActive = true
            this.currentCat = 'generalInformation'
            this.getData()
        },
        currentCat(val) {
            this.html = this.dataFI[val]
            this.documentData = this.docList.filter((list) => {
                if (list.sector == val) {
                    return list
                }
            })
            // console.log(this.documentData);
            if (val == 'headCount') this.getUserList()
        },
    },
    methods: {
        validateTime(evt) {
            if (this.internal == false) {
                this.validate24HourFormat(evt, this.editedExternalItem.availability)
            } else {
                this.validate24HourFormat(evt, this.editedInternalItem.availability)
            }
        },
        postResourcesExternalData() {
            var payload
            if (this.resourcesAction == 'add') {
                payload = {
                    id: `${this.$route.params.id}-${Date.now()}`,
                    facilityID: this.facilityID,
                    availability: this.editedExternalItem.availability,
                    dateCr: momentTZ.tz(this.editedExternalItem.dateCr, 'Asia/Kuala_Lumpur').format('DD-MMM-YYYY'),
                    description: this.editedExternalItem.description,
                    location: this.editedExternalItem.location,
                    personInCharge: this.editedExternalItem.personInCharge,
                    status: this.editedExternalItem.status,
                    agencies: this.editedExternalItem.agencies,
                    contactNo: this.editedExternalItem.contactNo,
                    type: 'External',
                }
                var path = '/facilityresources/add'
            }
            if (this.resourcesAction == 'edit') {
                payload = {
                    ...this.editedExternalItem,
                }
                var path = '/facilityresources/edit'
            }
            this.loading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}${path}`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getResourcesExternalData()
                    this.dialogResources = false
                    this.loading = false
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                })
        },
        postResourcesInternalData() {
            var payload
            if (this.resourcesAction == 'add') {
                payload = {
                    id: `${this.$route.params.id}-${Date.now()}`,
                    facilityID: this.facilityID,
                    availability: this.editedInternalItem.availability,
                    description: this.editedInternalItem.description,
                    location: this.editedInternalItem.location,
                    personInCharge: this.editedInternalItem.personInCharge,
                    status: this.editedInternalItem.status,
                    type: 'Internal',
                    dateCr: momentTZ.tz(this.editedInternalItem.dateCr, 'Asia/Kuala_Lumpur').format('DD-MMM-YYYY'),
                }
                var path = '/facilityresources/add'
            }
            if (this.resourcesAction == 'edit') {
                payload = {
                    ...this.editedInternalItem,
                }
                var path = '/facilityresources/edit'
            }
            this.loading = true
            axios
                .post(`${process.env.VUE_APP_API_URL}${path}/`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    // console.log(response.data);
                    this.getResourcesInternalData()
                    this.dialogResources = false
                    this.loading = false
                })
                .catch((error) => {
                    this.loading = false
                    console.log(error)
                })
        },
        getResourcesInternalData() {
            this.loading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityresources/internal/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.resourcesTableData = response.data
                    console.log(this.resourcesTableData)
                    this.loading = false
                    return this.resourcesTableData.filter((element) => {
                        return element.type == 'Internal'
                    })
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                    this.loading = false
                })
        },
        getResourcesExternalData() {
            this.loading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityresources/external/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.resourcesTableData = response.data
                    this.loading = false
                    return this.resourcesTableData.filter((element) => {
                        return element.type == 'External'
                    })
                })
                .catch((error) => {
                    // handle error
                    console.log(error)
                    this.loading = false
                })
        },
        addResourcesData() {
            this.resourcesAction = 'add'
            if (this.editedInternalItem) {
                Object.keys(this.editedInternalItem).map((key) => {
                    if (key == 'dateCr') {
                        this.editedInternalItem[key] = new Date().toISOString().substr(0, 10)
                    } else if (key == 'availability') {
                        this.editedInternalItem[key] = moment().format('HH:mm')
                    } else {
                        this.editedInternalItem[key] = ''
                    }
                })
                this.dialogResources = true
                this.addNew = true
            }
            if (this.editedExternalItem) {
                Object.keys(this.editedExternalItem).map((key) => {
                    if (key == 'dateCr') {
                        this.editedExternalItem[key] = new Date().toISOString().substr(0, 10)
                    } else if (key == 'availability') {
                        this.editedExternalItem[key] = moment().format('HH:mm')
                    } else {
                        this.editedExternalItem[key] = ''
                    }
                })
                this.dialogResources = true
                this.addNew = true
            }
        },
        toggleTable(section) {
            this.search = ''
            if (section === 'internal') {
                this.internal = true
                this.type = 'Internal'
                this.getResourcesInternalData()
            } else {
                this.internal = false
                this.type = 'External'
                this.getResourcesExternalData()
            }
        },
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
        formatDate(date) {
            return moment(date).format('Do MMMM YYYY')
        },
        upload() {
            this.$refs.uploadfile.browse()
        },
        getDataFromChild(value) {
            this.html = value // someValue
            this.editAction = false
        },
        postAddUser() {
            let user = {
                id: `${this.facilityID}-${Date.now()}`,
                facilityId: `${this.facilityID}`,
                name: this.nameHeadcount,
                staffId: this.staffIdHeadcount,
                company: 'PETRONAS',
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityheadcount/add`, user, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    // console.log(response)
                    this.getData()
                    this.addUserDialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getEmergencyContact() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityinformation/contact/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.emergencyContactData = response.data
                    // console.log(response.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        openEditEmergencyContactDialog(item) {
            this.selectedEditedItem = item
            this.selectedAgencies = item.agencies
            this.selectedContactNo = item.contactNo
            this.editContactDialog = true
        },
        closeEditContactDialog() {
            this.selectedEditedItem = null
            this.selectedAgencies = ''
            this.selectedContactNo = ''
            this.editContactDialog = false
        },
        editEmergencyContact() {
            const payload = {
                id: this.selectedEditedItem.id,
                facilityId: this.selectedEditedItem.facilityId,
                agencies: this.selectedAgencies,
                contactNo: this.selectedContactNo,
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityinformation/contact/edit`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally((resolve) => {
                    this.closeEditContactDialog()
                })
        },
        addEmergencyContact() {
            let user = {
                id: `${this.facilityID}-${Date.now()}`,
                facilityId: `${this.facilityID}`,
                agencies: this.agencies,
                contactNo: this.contactNo,
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityinformation/contact/add`, user, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally((resolve) => {
                    this.closeAddContactDialog()
                })
        },
        closeAddContactDialog() {
            this.agencies = ''
            this.contactNo = ''
            this.addContactDialog = false
        },
        openDeleteEmergencyDialog(id) {
            this.selectedDeleteId = id
            this.deleteEmergencyDialog = true
        },
        deleteEmergencyContact() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityinformation/contact/delete/${this.selectedDeleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally((resolve) => {
                    this.deleteEmergencyDialog = false
                })
        },
        getData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityinformation/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    console.log(response.data)
                    this.getEmergencyContact()
                    if (response.data.length) {
                        this.dataFI = response.data[0]
                        this.html = this.dataFI[this.currentCat]
                    }
                    this.getUserList()
                    this.getDocument()
                })
                .catch((error) => {
                    this.html = ''
                    console.log(error)
                })
        },
        deleteItem(id) {
            this.deleteId = id
            this.delDialog = true
        },
        deleteUser() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityheadcount/delete/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.deleteId = null
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        deleteRecourcesItem(id) {
            this.deleteId = id
            this.resourcesDelDialog = true
        },
        deleteResourcesData() {
            this.isLoading = true
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityresources/delete/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    let temp = this.resourcesTableData.findIndex((item) => item.id === this.deleteId)
                    this.resourcesTableData.splice(temp, 1)
                    this.isLoading = false
                    this.resourcesDelDialog = false
                })
                .catch((error) => {
                    console.log(error)
                    if (this.internal) {
                        this.getResourcesInternalData()
                    } else {
                        this.getResourcesExternalData()
                    }
                    this.isLoading = false
                })
        },
        editItem(item) {
            this.selectedEditItem = item
            this.nameEditHeadcount = item.name
            this.staffIdEditHeadcount = item.staffId
            this.editDialog = true
        },
        postEditUser() {
            const payload = {
                id: this.selectedEditItem.id,
                facilityId: this.selectedEditItem.facilityId,
                name: this.nameEditHeadcount,
                staffId: this.staffIdEditHeadcount,
                company: this.selectedEditItem.company,
            }

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityheadcount/edit`, payload, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.editDialog = false
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getUserList() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityheadcount/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    // console.log(response.data);
                    this.headcountData = response.data
                    // this.documentData = this.docList.filter(list => {
                    //   if (list.sector == this.currentCat) {
                    //     return list
                    //   }
                    // })
                    // if(this.currentCat == 'headCount') this.readExcel()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getDocument() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityinformation/document/${this.facilityID}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.docList = response.data
                    this.documentData = this.docList.filter((list) => {
                        if (list.sector == this.currentCat) {
                            return list
                        }
                    })
                    // console.log(this.documentData)
                    // if (this.currentCat == 'headCount') this.readExcel()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        chosenList(item) {
            this.leftPanelItems.find((obj) => obj.isActive).isActive = false
            item.isActive = true
            this.currentCat = item.code
            //CALL FUNC LEPAS CLICK LIST
        },
        editData(category, content) {
            // for (var key in this.dataFI) {
            //     if (this.dataFI.hasOwnProperty(key)) {
            //         if (key == category) {
            //             this.dataFI[key] = content
            //         }
            //     }
            // }
            const editorData = {
                id: this.facilityID,
                generalInformation: content,
            }
            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityinformation/edit`, editorData, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                })
                .catch((response) => {
                    console.log(error)
                })
        },
        deleteDocument() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityinformation/document/delete/${this.deleteId}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.deleteDialog = false
                    this.getData()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        // readExcel(){
        //   var tempArray = []
        //   this.headcountData = []
        //   this.documentData.forEach((el, index) => {
        //     axios.get(`${process.env.VUE_APP_API_URL}/facilityinformation/document/download/${el.id}`, {
        //         headers: {
        //           'Authorization': 'Bearer ' + this.$store.getters.user.token
        //         },
        //         responseType: 'arraybuffer',
        //     })
        //     .then(response => {
        //       var data = new Uint8Array(response.data)
        //       var arr = new Array()
        //       for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i])
        //       var bstr = arr.join("")
        //
        //       var workbook = XLSX.read(bstr, {type:"binary"})
        //
        //       var first_sheet_name = workbook.SheetNames[0]
        //
        //       var worksheet = workbook.Sheets[first_sheet_name]
        //       var jsonTemp = JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(worksheet)))
        //       // console.log(jsonTemp);
        //       jsonTemp.forEach(el => {
        //         tempArray.push({
        //           name: el.Name,
        //           staffId: el['Staff ID'],
        //           company: 'PETRONAS',
        //           attendance: 'Present'
        //         })
        //       })
        //     })
        //     .catch(error => {
        //       console.log(error)
        //     })
        //     .finally(resolve => {
        //       this.headcountData = JSON.parse(JSON.stringify(tempArray))
        //     })
        //   })
        // },
        downloadDocument(id) {
            axios
                .get(`${process.env.VUE_APP_API_URL}/facilityinformation/document/download/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    window.open(response.config.url, '_blank')
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        openEditDialog(item) {
            Object.keys(item).map((key) => {
                if (key == 'files') {
                    this.documentAdd.files = []
                } else {
                    this.documentAdd[key] = item[key]
                }
            })
            this.openDialog('edit')
        },
        editResourcesData(item) {
            this.resourcesAction = 'edit'
            this.addNew = false
            this.editResourcesItem(item)
        },
        editResourcesItem(item) {
            if (this.internal) {
                this.editedIndex = this.resourcesTableData.indexOf(item)
                this.editedInternalItem = Object.assign({}, item)
                this.editedInternalItem.dateCr = moment(item.dateCr).format('YYYY-MM-DD')
                this.dialogResources = true
            } else {
                this.editedIndex = this.resourcesTableData.indexOf(item)
                this.editedExternalItem = Object.assign({}, item)
                this.editedExternalItem.dateCr = moment(item.dateCr).format('YYYY-MM-DD')
                this.dialogResources = true
            }
        },
        editDocument() {
            const formData = new FormData()

            Object.keys(this.documentAdd).map((key) => {
                if (key == 'files') {
                    if (this.documentAdd.file) {
                        formData.append('files', this.documentAdd.file)
                    } else {
                        formData.append('files', null)
                    }
                } else {
                    formData.append(key, this.documentAdd[key])
                }
            })

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityinformation/document/edit`, formData, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.closeAddDoc()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        postHeadcount() {
            this.progressBar = true

            if (this.documentAdd.file) {
                let ext = /^.+\.([^.]+)$/.exec(this.documentAdd.file.name)
                if (ext[1] == 'xlsx') {
                    const file = this.documentAdd.file
                    // console.log(file);
                    const reader = new FileReader()

                    reader.onload = (e) => {
                        var data = new Uint8Array(e.target.result)
                        var workbook = XLSX.read(data, {
                            type: 'array',
                        })

                        var first_sheet_name = workbook.SheetNames[0]

                        var worksheet = workbook.Sheets[first_sheet_name]
                        var jsonTemp = JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(worksheet)))
                        console.log(jsonTemp)

                        jsonTemp.forEach((el) => {
                            console.log(el)
                            let user = {
                                id: `${this.facilityID}-${Date.now()}`,
                                facilityId: `${this.facilityID}`,
                                name: el.Name,
                                staffId: `${el['Staff ID']}`,
                                company: `${el['Company']}`,
                            }

                            axios
                                .post(`${process.env.VUE_APP_API_URL}/facilityheadcount/add`, user, {
                                    headers: {
                                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                                    },
                                })
                                .then((response) => {
                                    // console.log(response)
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                            this.wait(1000)
                        })
                    }
                    reader.readAsArrayBuffer(file)
                    this.getData()
                    this.closeAddDoc()
                } else {
                    alert('Please upload valid document')
                    this.documentAdd.file = null
                    this.progressBar = false
                }
            } else {
                alert('Please select document to upload')
                this.progressBar = false
            }
        },
        wait(ms) {
            let start = new Date().getTime()
            let end = start
            while (end < start + ms) {
                end = new Date().getTime()
            }
        },
        uploadFile() {
            const formData = new FormData()

            formData.append('files', this.documentAdd.file)
            formData.append('id', this.facilityID + '-' + moment())
            formData.append('facilityId', this.facilityID)
            formData.append('sector', this.currentCat)
            formData.append('datePublished', this.documentAdd.datePublished)
            formData.append('documentName', this.documentAdd.documentName)
            formData.append('publishedBy', this.documentAdd.publishedBy)
            formData.append('remarks', this.documentAdd.remarks)
            formData.append('version', this.documentAdd.version)

            this.progressBar = true

            axios
                .post(`${process.env.VUE_APP_API_URL}/facilityinformation/document/add`, formData, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.getData()
                    this.closeAddDoc()
                })
                .catch((error) => {
                    alert(error)
                    console.log(error)
                })
                .finally((resolve) => {
                    this.progressBar = false
                })
        },
        closeAddDoc() {
            Object.keys(this.documentAdd).map((key) => {
                if (key == 'datePublished') {
                    this.documentAdd.datePublished = moment().format('YYYY-MM-DD')
                } else if (key == 'file') {
                    this.documentAdd.file = null
                } else {
                    this.documentAdd[key] = ''
                }
            })
            this.addDialog = false
            this.addDocDialog = false
            this.dialogResources = false
            this.resourcesDelDialog = false
        },
        save() {
            this.$refs.textEditor.passDatatoParent()
            this.editData(this.currentCat, this.html)
            //SAVE WYSIWYG
        },
        openDialog() {
            this.progressBar = false
            // console.log(this.progressBar);
            this.addDialog = true
        },
        openDocDialog() {
            this.addDocDialog = true
        },
        openDeleteDialog(id) {
            // console.log(id);
            this.deleteId = id
            this.deleteDialog = true
        },
    },
    computed: {
        tableHeaderData() {
            if (this.internal == true) {
                return this.resourcesInternalHeaders.filter((item) => {
                    return item.text !== 'Type'
                })
            } else {
                return this.resourcesExternalHeaders.filter((item) => {
                    return item.text !== 'Type'
                })
            }
        },
        formTitle() {
            if (this.internal == true) {
                return this.addNew ? 'Internal Resources' : 'Edit'
            } else {
                return this.addNew ? 'External Resources' : 'Edit'
            }
        },
    },
    updated() {},
    created() {},
    mounted() {
        if (this.id) {
            this.facilityID = this.getFacilityId(this.id)
            this.currentCat = 'generalInformation'
            this.getData()
        }
        if (this.internal == true) {
            this.getResourcesInternalData()
        } else {
            this.getResourcesExternalData()
        }
    },
}
</script>

<style lang="scss" scoped>
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

    ::v-deep td,
    ::v-deep th {
        padding: 15px 24px;
        vertical-align: middle;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    ::v-deep td p {
        margin-bottom: 0;
    }

    ::v-deep th p {
        margin-bottom: 0;
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
