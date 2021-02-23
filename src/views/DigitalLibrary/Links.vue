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
                        <h2 class="primaryGreen--text">Links</h2>
                        <v-spacer></v-spacer>
                        <v-btn
                            v-if="userCanPerformAction"
                            color="primaryGreen white--text"
                            class="elevation-0"
                            @click="openAddDialog"
                        >
                            <v-icon small dark>mdi-plus</v-icon>
                            Add
                        </v-btn>
                    </v-card-actions>
                    <v-card-text class="px-6">
                        <template>
                            <v-data-table
                                :headers="headers"
                                :items-per-page="10"
                                :sort-by="['datePublished']"
                                :sort-desc="[true, false]"
                                must-sort
                                class="elevation-0"
                                search="search"
                            >
                                <template v-slot:item.action="{ item }">
                                    <v-icon small class="mr-2" color="primaryGreen" @click="">mdi-download</v-icon>
                                    <v-icon v-if="userCanPerformAction" small class="mr-2" @click="">mdi-pencil</v-icon>
                                    <v-icon v-if="userCanPerformAction" small @click="">mdi-delete</v-icon>
                                </template>
                            </v-data-table>
                        </template>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition">
            <v-card>
                <v-card-title primary-title>
                    <span class="subheading font-weight-medium">Upload Document</span>
                </v-card-title>
                <v-card-text class="pt-0">
                    <v-container class="pb-0" grid-list-md>
                        <v-layout row wrap>
                            <v-flex xs12 px-2>
                                <v-text-field label="Document name"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
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
            search: '',
            addDocDialog: false,
            dialog: false,
            headers: [
                { text: 'Document Name', value: 'documentName' },
                { text: 'Version', value: 'version' },
                { text: 'Date Published', value: 'datePublished' },
                { text: 'Published By', value: 'publishedBy' },
                { text: 'Remarks', value: 'remarks', sortable: false },
                { text: 'Action', align: 'center', value: 'action', sortable: false },
            ],
        }
    },
    methods: {
        openAddDialog() {
            this.addDocDialog = true
            this.dialog = true
        },
    },
    computed: {},
    mounted() {},
}
</script>

<style lang="scss" scoped></style>
