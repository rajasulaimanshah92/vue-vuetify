<template>
    <div class="">
        <!-- SHORELINE OILING SUMMARY -->
        <v-container grid-list-lg>
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-btn color="primaryGreen white--text" small class="elevation-0" @click="generatePDF" style="float: right">
                        <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                        Export
                    </v-btn>
                </v-flex>
                <v-flex xs12>
                    <v-flex xs12>
                        <v-card-title class="text-center justify-center pt-1">
                            <h1 class="font-weight-bold display-1 primaryGreen--text">SCAT Form</h1>
                        </v-card-title>
                    </v-flex>
                    <v-layout row wrap class="border-1 font-weight-medium text-center">
                        <v-flex xs12 class="header-style pa-2">
                            <p class="mb-0">SHORELINE OILING SUMMARY (SOS)</p>
                            <p class="mb-0">
                                Please ensure a full site specific risk assessment is carried out prior to commencing shoreline
                                oiling assessment
                            </p>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap class="border-1">
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryGreen white--text font-weight-medium text-center text-size"
                                >
                                    1. General Information
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Incident
                                </v-flex>
                                <v-flex xs12 md2 class="styled-input pa-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="18"
                                        hide-details
                                        v-model="generalInformationItems.incident"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Segment Id
                                </v-flex>
                                <v-flex xs12 md4 class="styled-input border-bottom pa-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="18"
                                        v-model="generalInformationItems.segmentId"
                                        hide-details
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Date (DD/MM/YY)
                                </v-flex>
                                <v-flex xs12 md2 class="styled-input border-bottom">
                                    <v-menu
                                        ref="menu"
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        :return-value.sync="date"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="290px"
                                    >
                                        <template v-slot:activator="{ on }">
                                            <v-text-field
                                                class="pt-0 mt-1 text-center"
                                                height="15"
                                                v-model="generalInformationItems.dateCr"
                                                readonly
                                                hide-details
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            v-model="generalInformationItems.dateCr"
                                            @input="menu = false"
                                        ></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Survey Time
                                </v-flex>
                                <v-flex
                                    xs6
                                    md1
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    From
                                </v-flex>
                                <v-flex xs6 md2 class="styled-input border-bottom">
                                    <!-- <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="generalInformationItems.from"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                      class="pt-0 mt-1"
                      height="15"
                      v-model="generalInformationItems.from"
                      hide-details
                      readonly
                      v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="generalInformationItems.from"
                      full-width
                      @click:minute="$refs.menu.save(generalInformationItems.from)"
                    ></v-time-picker>
                  </v-menu> -->
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        v-model="generalInformationItems.from"
                                        hide-details
                                        @keydown="validateTime"
                                        @keyup="validateTime"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs6
                                    md1
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    To
                                </v-flex>
                                <v-flex xs6 md2 class="styled-input border-bottom">
                                    <!-- <v-menu
                    ref="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="generalInformationItems.to"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                      class="pt-0 mt-1"
                      height="15"
                      v-model="generalInformationItems.to"
                      readonly
                      v-on="on"
                      hide-details
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-model="generalInformationItems.to"
                      full-width
                      @click:minute="$refs.menu2.save(generalInformationItems.to)"
                    ></v-time-picker>
                  </v-menu> -->
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        v-model="generalInformationItems.to"
                                        hide-details
                                        @keydown="validateTime"
                                        @keyup="validateTime"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class=" border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Survey Platform
                                </v-flex>
                                <v-flex xs12 md10 class="pa-0 pl-2 pt-3">
                                    <template v-for="checkbox in generalInformationItems.surveyPlatform">
                                        <v-checkbox
                                            hide-details
                                            :key="checkbox.text"
                                            :label="checkbox.text"
                                            v-model="checkbox.value"
                                            class="ma-0 mr-5 mt-0 pt-0 d-inline-flex"
                                        ></v-checkbox>
                                    </template>
                                    <v-text-field
                                        class="styled-input d-inline-flex"
                                        height="14"
                                        hide-details
                                        v-model="generalInformationItems.remoteText"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Weather
                                </v-flex>
                                <v-flex xs12 md10 class="styled-input border-top">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="generalInformationItems.weather"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap class="border-1">
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryGreen white--text font-weight-medium text-center text-size"
                                >
                                    2. Survey Team
                                </v-flex>
                                <v-flex xs12 md4 class="styled-input border-bottom">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="surveyTeamItems.surveyTeam"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Name
                                </v-flex>
                                <v-flex xs12 md4 class="styled-input border-bottom">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="surveyTeamItems.name"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Organization
                                </v-flex>
                                <v-flex xs12 md4 class="styled-input">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="surveyTeamItems.organization"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Contact Details
                                </v-flex>
                                <v-flex xs12 md4 class="styled-input">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="surveyTeamItems.contactDetails"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap class="border-1">
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryGreen white--text font-weight-medium text-center text-size"
                                >
                                    3. Segment
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Total length (m)
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-bottom">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="segmentItems.totalLength"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Length Surveyed (m)
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-bottom">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="segmentItems.lengthSurveyed"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Start
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Lat (decimal degrees)
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-bottom">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="segmentItems.lat1"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Lat (decimal degrees)
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-bottom">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="segmentItems.lat2"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Finish
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Lat (decimal degrees)
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="segmentItems.lat3"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Lat (decimal degrees)
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="segmentItems.lat4"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- SHORELINE TYPE -->
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-layout row wrap class="border-1 font-weight-medium">
                        <v-flex xs2 class="border-1 primaryGreen white--text text-center">
                            4. Shoreline Type
                        </v-flex>
                        <v-flex xs10 class="border-1">
                            Please indicate ONE Primary Shoreline type (1) and secondary shoreline types (2) for both the
                            intertidal (foreshore) and supertidal (backshore) environment
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md4 class="pb-0">
                            <v-layout row wrap>
                                <v-flex xs4 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                    Shoreline Type
                                </v-flex>
                                <v-flex xs8 class="border-1 primaryDarkGrey white--text font-weight-medium">
                                    <v-layout row wrap>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            Intertidal
                                        </v-flex>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            Supertidal
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            1
                                        </v-flex>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            2
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <template v-for="item in shoreLine.section1.types">
                                    <v-flex xs4 class="border-1 text-size" :key="item.text">
                                        {{ item.text }}
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value1">
                                        <v-checkbox v-model="item.checkbox.value1"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value2">
                                        <v-checkbox v-model="item.checkbox.value2"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value3">
                                        <v-checkbox v-model="item.checkbox.value3"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value4">
                                        <v-checkbox v-model="item.checkbox.value4"></v-checkbox>
                                    </v-flex>
                                </template>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-layout row wrap>
                                <v-flex xs4 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                    Shoreline Type
                                </v-flex>
                                <v-flex xs8 class="border-1 primaryDarkGrey white--text font-weight-medium">
                                    <v-layout row wrap>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            Intertidal
                                        </v-flex>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            Supertidal
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            1
                                        </v-flex>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            2
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <template v-for="item in shoreLine.section2.types">
                                    <v-flex xs4 class="border-1 text-size" :key="item.text">
                                        {{ item.text }}
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value1">
                                        <v-checkbox v-model="item.checkbox.value1"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value2">
                                        <v-checkbox v-model="item.checkbox.value2"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value3">
                                        <v-checkbox v-model="item.checkbox.value3"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value4">
                                        <v-checkbox v-model="item.checkbox.value4"></v-checkbox>
                                    </v-flex>
                                </template>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-layout row wrap>
                                <v-flex xs4 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                    Shoreline Type
                                </v-flex>
                                <v-flex xs8 class="border-1 primaryDarkGrey white--text font-weight-medium">
                                    <v-layout row wrap>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            Intertidal
                                        </v-flex>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            Supertidal
                                        </v-flex>
                                    </v-layout>
                                    <v-layout row wrap>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            1
                                        </v-flex>
                                        <v-flex xs6 class="border-1 primaryDarkGrey white--text font-weight-medium text-center">
                                            2
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap>
                                <template v-for="item in shoreLine.section3.types">
                                    <v-flex xs4 class="border-1 text-size" :key="item.text">
                                        {{ item.text }}
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value1">
                                        <v-checkbox v-model="item.checkbox.value1"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value2">
                                        <v-checkbox v-model="item.checkbox.value2"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value3">
                                        <v-checkbox v-model="item.checkbox.value3"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 class="border-1 d-flex" :key="item.checkbox.value4">
                                        <v-checkbox v-model="item.checkbox.value4"></v-checkbox>
                                    </v-flex>
                                </template>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 md4>
                            <v-layout row wrap>
                                <template>
                                    <v-flex xs4 class="border-1">
                                        Other
                                    </v-flex>
                                </template>
                                <template v-for="item in shoreLine.others">
                                    <v-flex xs2 md2 class="border-1 d-flex" :key="item.value1">
                                        <v-checkbox v-model="item.value1"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 md2 class="border-1 d-flex" :key="item.value2">
                                        <v-checkbox v-model="item.value2"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 md2 class="border-1 d-flex" :key="item.value3">
                                        <v-checkbox v-model="item.value3"></v-checkbox>
                                    </v-flex>
                                    <v-flex xs2 md2 class="border-1 d-flex" :key="item.value4">
                                        <v-checkbox v-model="item.value4"></v-checkbox>
                                    </v-flex>
                                </template>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12 md8>
                            <v-layout row wrap>
                                <v-flex xs3 class="border-1 d-flex">
                                    If other please indicate
                                </v-flex>
                                <v-flex xs9 class="border-1 d-flex">
                                    <v-text-field v-model="shoreLine.otherIndicate"></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex>
                            <v-layout row wrap>
                                <v-flex xs12 md2 class="border-1">
                                    <v-layout row wrap>
                                        <v-flex xs12 class="d-flex text-center">
                                            Other features
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 md10>
                                    <v-layout row wrap>
                                        <v-flex
                                            xs12
                                            md2
                                            v-for="item in shoreLine.otherFeatures"
                                            :key="item.text"
                                            class="border-1 d-flex text-center text-size"
                                        >
                                            <v-checkbox :label="item.text" hide-details v-model="item.value"></v-checkbox>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex xs3 class="border-1 d-flex">
                                    Please provide details of other features
                                </v-flex>
                                <v-flex xs9 class="border-1 d-flex">
                                    <v-text-field
                                        name="name"
                                        hide-details
                                        label=""
                                        v-model="shoreLine.otherFeatureDetails"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- OPERATIONAL FEATURES -->
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-layout row wrap class="border-1 primaryGreen white--text font-weight-medium">
                        <v-flex xs12>
                            5. Operational Features
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap class="border-1">
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Load bearing capacity
                                </v-flex>
                                <v-flex xs12 md2 class="styled-input border-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="operationalFeatures.loadBearing"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md1
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Access
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="operationalFeatures.access"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md2
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Clean up activities
                                </v-flex>
                                <v-flex xs12 md2 class="styled-input border-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="operationalFeatures.cleanUp"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md3
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Suitable lay down area
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="operationalFeatures.suitableLayDownArea"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex
                                    xs12
                                    md3
                                    class="styled-input border-1 primaryDarkGrey white--text font-weight-medium text-center text-size"
                                >
                                    Additional details
                                </v-flex>
                                <v-flex xs12 md3 class="styled-input border-1">
                                    <v-text-field
                                        class="pt-0 mt-1"
                                        height="15"
                                        hide-details
                                        v-model="operationalFeatures.additionalInfo"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- SURFACE OIL -->
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-layout row wrap class="styled-input-header border-1 ">
                        <v-flex xs6 class="primaryGreen white--text font-weight-medium">
                            6. Surface Oil
                        </v-flex>
                        <v-flex xs6 class="border-1">
                            <v-checkbox
                                class="ml-1 mt-3 styled-input"
                                height="0"
                                v-model="checkbox"
                                label="Tick here if no oil observed"
                            ></v-checkbox>
                        </v-flex>
                    </v-layout>
                    <v-layout style="overflow-x:auto;" row wrap>
                        <template>
                            <table>
                                <template>
                                    <thead class="primaryDarkGrey white--text font-weight-medium">
                                        <template v-for="item in surfaceOilTitleName">
                                            <td
                                                class="border-1 primaryDarkGrey text-center"
                                                :key="item.name"
                                                :colspan="item.colspan"
                                            >
                                                {{ item.name }}
                                            </td>
                                        </template>
                                    </thead>
                                </template>
                                <template>
                                    <tr class="primaryDarkGrey white--text font-weight-medium">
                                        <template v-for="item in surfaceOilHeaderName">
                                            <td class="border-1 primaryDarkGrey text-center" :key="item.name">{{ item.name }}</td>
                                        </template>
                                    </tr>
                                </template>
                                <template>
                                    <tr v-for="item in surfaceOil" :key="item.zoneId">
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    name="item.zoneId"
                                                    label=""
                                                    v-model="item.zoneId"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template v-for="checkbox in item.position">
                                            <td :key="checkbox.value1">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value1"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value2">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value2"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value3">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value3"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value4">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value4"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    name="item.oilCover.length"
                                                    label=""
                                                    v-model="item.oilCover.length"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    name="item.oilCover.width"
                                                    label=""
                                                    v-model="item.oilCover.width"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template v-for="checkbox in item.distribution">
                                            <td :key="checkbox.value1">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value1"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value2">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value2"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value3">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value3"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value4">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value4"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value5">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value5"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                        </template>
                                        <template v-for="checkbox in item.oilThickness">
                                            <td :key="checkbox.value1">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value1"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value2">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value2"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value3">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value3"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value4">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value4"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value5">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value5"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                        </template>
                                        <template v-for="checkbox in item.oilCharacter">
                                            <td :key="checkbox.value1">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value1"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value2">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value2"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value3">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value3"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value4">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value4"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value5">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value5"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value6">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value6"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value7">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value7"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value8">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value8"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                        </template>
                                    </tr>
                                </template>
                            </table>
                        </template>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- SUB SURFACE OIL -->
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-layout row wrap class="styled-input-header border-1 ">
                        <v-flex xs6 class="primaryGreen white--text font-weight-medium">
                            7. Sub Surface Oil
                        </v-flex>
                        <v-flex xs6 class="border-1">
                            <v-checkbox
                                class="ml-1 mt-3 styled-input"
                                height="0"
                                v-model="checkbox"
                                label="Tick here if no oil observed"
                            ></v-checkbox>
                        </v-flex>
                    </v-layout>
                    <v-layout style="overflow-x:auto;" row wrap>
                        <template>
                            <table>
                                <template>
                                    <thead class="primaryDarkGrey white--text font-weight-medium">
                                        <template v-for="item in subSurfaceOilTitleName">
                                            <td
                                                class="border-1 primaryDarkGrey text-center"
                                                :key="item.name"
                                                :colspan="item.colspan"
                                            >
                                                {{ item.name }}
                                            </td>
                                        </template>
                                    </thead>
                                </template>
                                <template>
                                    <tr class="primaryDarkGrey white--text font-weight-medium">
                                        <template v-for="item in subSurfaceOilHeaderName">
                                            <td class="border-1 primaryDarkGrey text-center" :key="item.name">{{ item.name }}</td>
                                        </template>
                                    </tr>
                                </template>
                                <template>
                                    <tr v-for="item in subSurfaceOil" :key="item.pitId">
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    name="item.zoneId"
                                                    label=""
                                                    v-model="item.pitId"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template v-for="checkbox in item.position">
                                            <td :key="checkbox.value1">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value1"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value2">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value2"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value3">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value3"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value4">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value4"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    label=""
                                                    v-model="item.pitDepth"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    label=""
                                                    v-model="item.oiledZone"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template v-for="checkbox in item.subSurfaceOilCharacter">
                                            <td :key="checkbox.value1">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value1"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value2">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value2"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value3">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value3"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value4">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value4"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value5">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value5"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value6">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value6"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                            <td :key="checkbox.value7">
                                                <v-checkbox
                                                    hide-details
                                                    label=""
                                                    v-model="checkbox.value7"
                                                    class="ma-0 text-center"
                                                ></v-checkbox>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    label=""
                                                    v-model="item.waterTable"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    label=""
                                                    v-model="item.lat"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                        <template>
                                            <td class="pa-1">
                                                <v-text-field
                                                    hide-details
                                                    label=""
                                                    v-model="item.long"
                                                    class="pa-0"
                                                ></v-text-field>
                                            </td>
                                        </template>
                                    </tr>
                                </template>
                            </table>
                        </template>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- COMMENTS -->
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-layout row wrap class="border-1 primaryDarkGrey white--text font-weight-medium">
                        <v-flex xs12>
                            Noted sensitives or limitations
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="border-1">
                        <v-flex xs12>
                            <v-textarea filled hide-details name="" label="" v-model="notedSensitivesOrLimitations"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="border-1 primaryDarkGrey white--text font-weight-medium">
                        <v-flex xs12>
                            General comments
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="border-1">
                        <v-flex xs12>
                            <v-textarea filled hide-details name="input-7-4" label="" v-model="generalComments"></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="border-1 primaryDarkGrey white--text font-weight-medium">
                        <v-flex xs12>
                            Sketch map/profiles
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap class="border-1">
                        <v-flex xs6 class="border-1">
                            <v-card :loading="loader.loading0" height="300">
                                <v-img height="300" contain :src="getImage(0)"></v-img>
                            </v-card>
                        </v-flex>
                        <v-flex xs6 class="border-1">
                            <v-card :loading="loader.loading1" height="300">
                                <v-img height="300" contain :src="getImage(1)"></v-img>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap>
                                <v-flex class="pa-0 pt-4 pb-3 pr-3 border-1" xs6>
                                    <v-file-input
                                        class="pa-0"
                                        v-model="uploadSection.file0"
                                        hide-details
                                        label="Upload Image"
                                        accept="image/*"
                                        @change="uploadImage(0)"
                                    ></v-file-input>
                                </v-flex>
                                <v-flex class="pa-0 pt-4 pb-3 pr-3 border-1" xs6>
                                    <v-file-input
                                        class="pa-0"
                                        v-model="uploadSection.file1"
                                        hide-details
                                        label="Upload Image"
                                        accept="image/*"
                                        @change="uploadImage(1)"
                                    ></v-file-input>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 class="border-1">
                            <v-textarea filled hide-details name="" label="" v-model="sketchMapProfiles2"></v-textarea>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
            <!-- LEGEND -->
            <v-layout class="mb-2" row wrap>
                <v-flex xs12>
                    <v-layout row wrap class="border-1 primaryDarkGrey white--text font-weight-medium">
                        <v-flex xs12>
                            Legend:
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="border-right font-weight-medium">
                                    Distribution
                                </v-flex>
                                <v-flex xs12 md10>
                                    <p>
                                        <strong>TR</strong>ace (&#60;1%), <strong>SP</strong>oradic (1-10%),
                                        <strong>P</strong>a<strong>T</strong>chy(11-50%), <strong>BR</strong>oken(51-90%),
                                        <strong>CO</strong>ntinuous(91-100%)
                                    </p>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="border-right font-weight-medium">
                                    Thickness
                                </v-flex>
                                <v-flex xs12 md10>
                                    <p>
                                        <strong>TO</strong>-Thick Oil(&#62;1cm), <strong>CV</strong>-CoVer(1mm to 1cm),
                                        <strong>CT</strong>-CoaT(&#60;1mm), <strong>F</strong>L-FiLm(transparent sheen)
                                    </p>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="border-right font-weight-medium">
                                    Surface Oil Characteristic
                                </v-flex>
                                <v-flex xs12 md10>
                                    <p><strong>FR</strong>-Fresh</p>
                                    <p><strong>MS</strong>-Mousse</p>
                                    <p><strong>TB</strong>-TarBalls (&#60;10cm)</p>
                                    <p><strong>PT</strong>-Tar Patties (10cm-1m)</p>
                                    <p><strong>PA</strong>-Patches (1 – 30m)</p>
                                    <p><strong>SR</strong>-Surface oil Residue (non-cohesive oiled sediment)</p>
                                    <p><strong>AP</strong>-Asphalt Pavement (cohesive mixture)</p>
                                    <p><strong>TA</strong>-Tarry (Almost solid weathered oil)</p>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap class="border-1">
                                <v-flex xs12 md2 class="border-right font-weight-medium">
                                    Subsurface Oil Characteristic
                                </v-flex>
                                <v-flex xs12 md10>
                                    <p>
                                        <strong>SAP</strong>-Subsurface Asphalt Pavement (sediment below surface layer. Oil will
                                        flow out when disturbed)
                                    </p>
                                    <p><strong>OP</strong>-Oil filled Pores (pores spaces completely filled)</p>
                                    <p>
                                        <strong>PP</strong>-Partially Filled Pores (oil doesn’t flow out the sediment when
                                        disturbed
                                    </p>
                                    <p><strong>OR</strong>-Oil Residue (sediment are visibly oiled with black/brown coat)</p>
                                    <p><strong>OF</strong>-Oil Film (sediment are lightly oiled with film, stain or clasts)</p>
                                    <p><strong>TR</strong>-Trace (discontinuous film or spots of oil or and odor or tackiness)</p>
                                    <p><strong>NO</strong>-No Oil (no visible or apparent evidence of oil)</p>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import moment from 'moment'
import momentTZ from 'moment-timezone'
import axios from 'axios'

export default {
    data() {
        return {
            imageBase64_1: null,
            imageBase64_2: null,
            loader: {
                loading0: false,
                loading1: false,
            },
            uploadedFiles: [
                { filedid: null, id: null, item: 0, fileid: null },
                { filedid: null, id: null, item: 0, fileid: null },
            ],
            uploadSection: {
                file0: null,
                file1: null,
            },
            userName: null,
            date: new Date().toISOString().substr(0, 10),
            checkbox: false,
            checkbox2: false,
            menu: false,
            time: null,
            timeMenu: false,
            timeMenu2: false,
            exportFileName:
                'SCAT FORM' +
                '_' +
                `${this.$store.getters.user.userInfos.userName}` +
                '_' +
                new Date().toISOString().substr(0, 10) +
                '_' +
                moment().format('HH:mm'),
            generalInformationItems: {
                incident: '',
                segmentId: '',
                dateCr: new Date().toISOString().substr(0, 10),
                from: '',
                to: '',
                surveyPlatform: [
                    { text: 'Air', value: false },
                    { text: 'Foot', value: false },
                    { text: 'Viewpoint', value: false },
                    { text: 'Vehicle', value: false },
                    { text: 'Remote', value: false },
                ],
                remoteText: '',
                weather: '',
            },
            surveyTeamItems: {
                surveyTeam: '',
                name: '',
                organization: '',
                contactDetails: '',
            },
            segmentItems: {
                totalLength: '',
                lengthSurveyed: '',
                lat1: '',
                lat2: '',
                lat3: '',
                lat4: '',
            },
            shoreLine: {
                section1: {
                    types: [
                        {
                            text: 'Expose Rocky shores 1A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Exposed Manmade Structures 1B',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Exposed Rocky platforms 2A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Fine-Medium Sandy Beaches 3A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Scraps and steep slopes in sand',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                    ],
                },
                section2: {
                    types: [
                        {
                            text: 'Coarse to medium sandy Beaches 4',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Mixed sand and gravel 5',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Gravel Beaches 6A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'RipRap 6B',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Exposed Tidal flats 7',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                    ],
                },
                section3: {
                    types: [
                        {
                            text: 'Sheltered Rocky shores 8A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Sheltered manmade 8B',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Sheltered Tidal flats 9A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Salt marshes 10A',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                        {
                            text: 'Mangroves 10D',
                            checkbox: {
                                value1: false,
                                value2: false,
                                value3: false,
                                value4: false,
                            },
                        },
                    ],
                },
                others: [
                    {
                        value1: false,
                        value2: false,
                        value3: false,
                        value4: false,
                    },
                ],
                otherIndicate: '',
                otherFeatures: [
                    { text: 'Amenity area', value: false },
                    { text: 'Estuary', value: false },
                    { text: 'Historical', value: false },
                    { text: 'Crack and crevices', value: false },
                    { text: 'Pools', value: false },
                    { text: 'Biological Outpost', value: false },
                ],
                otherFeatureDetails: '',
            },
            operationalFeatures: {
                loadBearing: '',
                access: '',
                cleanUp: '',
                suitableLayDownArea: '',
                additionalInfo: '',
            },
            surfaceOilTitleName: [
                { name: 'Zone Id', colspan: '' },
                { name: 'Position', colspan: '4' },
                { name: 'Oil Cover', colspan: '2' },
                { name: 'Distribution', colspan: '5' },
                { name: 'Oil Thickness', colspan: '5' },
                { name: 'Oil Character', colspan: '8' },
            ],
            subSurfaceOilTitleName: [
                { name: 'Pit Id', colspan: '' },
                { name: 'Position', colspan: '4' },
                { name: 'Pit depth', colspan: '' },
                { name: 'Oiled zone', colspan: '' },
                { name: 'Sub-surface Oil Character', colspan: '7' },
                { name: 'Water Table', colspan: '' },
                { name: 'Lat', colspan: '' },
                { name: 'Long', colspan: '' },
            ],
            surfaceOilHeaderName: [
                { name: '' },
                { name: 'L' },
                { name: 'M' },
                { name: 'U' },
                { name: 'S' },
                { name: 'Length' },
                { name: 'Width' },
                { name: 'TR' },
                { name: 'SP' },
                { name: 'PT' },
                { name: 'BR' },
                { name: 'CO' },
                { name: 'TO' },
                { name: 'CV' },
                { name: 'CT' },
                { name: 'ST' },
                { name: 'FL' },
                { name: 'FR' },
                { name: 'MS' },
                { name: 'TB' },
                { name: 'PT' },
                { name: 'PA' },
                { name: 'SR' },
                { name: 'AP' },
                { name: 'TA' },
            ],
            subSurfaceOilHeaderName: [
                { name: '' },
                { name: 'L' },
                { name: 'M' },
                { name: 'U' },
                { name: 'S' },
                { name: '(cm)' },
                { name: 'Depth (cm)' },
                { name: 'SAP' },
                { name: 'OP' },
                { name: 'PP' },
                { name: 'OR' },
                { name: 'OF' },
                { name: 'TR' },
                { name: 'NO' },
                { name: 'Depth (cm)' },
                { name: 'd.dd' },
                { name: 'd.dd' },
            ],
            surfaceOil: [
                {
                    zoneId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    oilCover: {
                        length: '',
                        width: '',
                    },
                    distribution: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilThickness: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                            value8: false,
                        },
                    ],
                },
                {
                    zoneId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    oilCover: {
                        length: '',
                        width: '',
                    },
                    distribution: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilThickness: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                            value8: false,
                        },
                    ],
                },
                {
                    zoneId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    oilCover: {
                        length: '',
                        width: '',
                    },
                    distribution: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilThickness: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                            value8: false,
                        },
                    ],
                },
                {
                    zoneId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    oilCover: {
                        length: '',
                        width: '',
                    },
                    distribution: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilThickness: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                            value8: false,
                        },
                    ],
                },
                {
                    zoneId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    oilCover: {
                        length: '',
                        width: '',
                    },
                    distribution: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilThickness: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                        },
                    ],
                    oilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                            value8: false,
                        },
                    ],
                },
            ],
            subSurfaceOil: [
                {
                    pitId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    pitDepth: '',
                    oiledZone: '',
                    subSurfaceOilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                        },
                    ],
                    waterTable: '',
                    lat: '',
                    long: '',
                },
                {
                    pitId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    pitDepth: '',
                    oiledZone: '',
                    subSurfaceOilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                        },
                    ],
                    waterTable: '',
                    lat: '',
                    long: '',
                },
                {
                    pitId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    pitDepth: '',
                    oiledZone: '',
                    subSurfaceOilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                        },
                    ],
                    waterTable: '',
                    lat: '',
                    long: '',
                },
                {
                    pitId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    pitDepth: '',
                    oiledZone: '',
                    subSurfaceOilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                        },
                    ],
                    waterTable: '',
                    lat: '',
                    long: '',
                },
                {
                    pitId: '',
                    position: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                        },
                    ],
                    pitDepth: '',
                    oiledZone: '',
                    subSurfaceOilCharacter: [
                        {
                            value1: false,
                            value2: false,
                            value3: false,
                            value4: false,
                            value5: false,
                            value6: false,
                            value7: false,
                        },
                    ],
                    waterTable: '',
                    lat: '',
                    long: '',
                },
            ],
            notedSensitivesOrLimitations: '',
            generalComments: '',
            sketchMapProfiles2: '',
        }
    },
    methods: {
        validateTime(evt) {
            this.validate24HourFormat(evt, this.generalInformationItems.from)
        },
        getImageData() {
            axios
                .get(`${process.env.VUE_APP_API_URL}/scatimage/${this.userName}`, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    this.uploadedFiles = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getImage(index) {
            if (this.uploadedFiles[index].fileid === null) {
                return 'https://dummyimage.com/300/fff/fff.png'
            } else {
                return `${process.env.VUE_APP_API_URL}/scatimage/file/${this.uploadedFiles[index].fileid}`
            }
        },
        uploadImage(index) {
            const formData = new FormData()
            formData.append('id', `${this.userName}-${index}`)
            formData.append('userName', this.userName)
            formData.append('item', index)
            formData.append('files', this.uploadSection['file' + index])
            this.loader['loading' + index] = true
            axios
                .post(`${process.env.VUE_APP_API_URL}/scatimage/add/`, formData, {
                    headers: {
                        Authorization: 'Bearer ' + this.$store.getters.user.token,
                    },
                })
                .then((response) => {
                    setTimeout(() => {
                        this.uploadedFiles[index].fileid = response.data.fileid
                        this.loader['loading' + index] = false
                    }, 1000)
                })
                .catch((error) => {
                    console.log(error)
                    this.loader['loading' + index] = false
                })
        },
        convertImage(src, callback, outputFormat) {
            var img = new Image()
            img.crossOrigin = 'Anonymous'
            img.onload = function() {
                var canvas = document.createElement('CANVAS')
                var ctx = canvas.getContext('2d')
                var dataURL
                canvas.height = this.naturalHeight
                canvas.width = this.naturalWidth
                ctx.drawImage(this, 0, 0)
                dataURL = canvas.toDataURL(outputFormat)
                callback(dataURL)
            }
            img.src = src
            if (img.complete || img.complete === undefined) {
                img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='
                img.src = src
            }
        },
        generatePDF() {
            const vm = this
            this.convertImage(this.getImage(0), function(dataUrl) {
                vm.imageBase64_1 = dataUrl
            })
            this.convertImage(this.getImage(1), function(dataUrl) {
                vm.imageBase64_2 = dataUrl
            })

            setTimeout(() => {
                let header = []
                let dataTable = []
                var pdfMake = require('pdfmake/build/pdfmake.js')
                if (pdfMake.vfs == undefined) {
                    var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                    pdfMake.vfs = pdfFonts.pdfMake.vfs
                }
                let checkImage =
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAA80lEQVQ4jc3UMUoDQRTG8V80hZUXMBgQEbyBCSSFIFaCINhYhFzBC8TCm4iewCYgBGxS24tVDpFCo8XOkrjshNkkRT4Y3swb3n8e+y2PbVetcG6jU5HxjnHZRQu/K65WDqkvAC9CvMRnYnfHGIbacRG4E+IEX4nAvULtfFNR0bpVgE18oLsJ4JHM1VM01gU28YYD9PFSBbiPB3PT8s4O0cNT7NUY8B4DPOMEo9BZL+Siqkfyj7LvdItr7KbAlgG/cRf2N6kwlpuSQ89TYfzvcBZiA9OF/ERmSpnyX2dWdtm2geFQHF9nuJKZkKIfvIqMr+3UHwilPQumnDFpAAAAAElFTkSuQmCC'
                let uncheckImage =
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAABmJLR0QA/wD/AP+gvaeTAAAAiUlEQVQ4jWNgGOyAEY1vxcDAYEuiGYcYGBiOY5OwZGBg+E8mtoQZwoJkoCuUdmdgYLhDpOtUGBgYdkL1Hkc3kAlKP2FgYLhHpIEcaHoRDGqBUQNHDRwMBiLnlH9QWoaBgeEHkfpl0PSiACsGKhQO6MWXBQMDgy8DAwMzkS78y8DAsIUBR/E1OAEAlrIqNUPo6pAAAAAASUVORK5CYII='
                var docDefinition = {
                    pageOrientation: 'landscape',
                    pageSize: 'A4',
                    content: [
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [
                                    150,
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    100,
                                ],
                                headerRows: 2,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        {
                                            text:
                                                'SHORELINE OILING SUMMARY (SOS)\n Please ensure a full site specific risk assessment is carried out prior to commencing shoreline oiling assessment',
                                            style: 'tableHeader',
                                            colSpan: 12,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: '1.	General information', style: 'tableBlackHeader', alignment: 'center' },
                                        { text: 'Incident', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: `${this.generalInformationItems.incident}`, colSpan: 2, alignment: 'left' },
                                        {},
                                        { text: 'Segment ID', style: 'tableBlueHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: `${this.generalInformationItems.segmentId}`, colSpan: 4, alignment: 'left' },
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Date (DD/MM/YYYY)', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.generalInformationItems.dateCr}`, colSpan: 2, alignment: 'left' },
                                        {},
                                        { text: 'Survey time', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'From', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: `${this.generalInformationItems.from}`, colSpan: 2, alignment: 'left' },
                                        {},
                                        { text: 'To', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: `${this.generalInformationItems.to}`, colSpan: 2, alignment: 'left' },
                                        {},
                                    ],
                                    [
                                        { text: 'Survey Platform', style: 'tableBlueHeader', alignment: 'center' },
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.generalInformationItems.surveyPlatform[0].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Air',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.generalInformationItems.surveyPlatform[1].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Foot',
                                                    ],
                                                ],
                                            },
                                            alignment: 'center',
                                        },
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.generalInformationItems.surveyPlatform[2].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Viewpoint',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.generalInformationItems.surveyPlatform[3].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Vehicle',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.generalInformationItems.surveyPlatform[4].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Remote',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        { text: `${this.generalInformationItems.remoteText}`, colSpan: 2 },
                                        {},
                                    ],
                                    [
                                        { text: 'Weather', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.generalInformationItems.weather}`, colSpan: 11, alignment: 'left' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: '2.	Survey Team', style: 'tableBlackHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: 'Name', style: 'tableBlueHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: 'Organization', style: 'tableBlueHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: 'Contact details', style: 'tableBlueHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: `${this.surveyTeamItems.surveyTeam}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: `${this.surveyTeamItems.name}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: `${this.surveyTeamItems.organization}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: `${this.surveyTeamItems.contactDetails}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: '3.	Segment', style: 'tableBlackHeader', alignment: 'center' },
                                        { text: 'Total lenth (m)', style: 'tableBlueHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        { text: `${this.segmentItems.totalLength}`, colSpan: 2, alignment: 'center' },
                                        {},
                                        {
                                            text: 'Length Surveyed (m)',
                                            style: 'tableBlueHeader',
                                            colSpan: 3,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        { text: `${this.segmentItems.lengthSurveyed}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Start', style: 'tableBlueHeader', alignment: 'center' },
                                        {
                                            text: 'Lat (decimal degree)',
                                            style: 'tableBlueHeader',
                                            colSpan: 3,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        { text: `${this.segmentItems.lat1}`, colSpan: 2, alignment: 'center' },
                                        {},
                                        {
                                            text: 'Lat (decimal degree)',
                                            style: 'tableBlueHeader',
                                            colSpan: 3,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        { text: `${this.segmentItems.lat2}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Finish', style: 'tableBlueHeader', alignment: 'center' },
                                        {
                                            text: 'Lat (decimal degree)',
                                            style: 'tableBlueHeader',
                                            colSpan: 3,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        { text: `${this.segmentItems.lat3}`, colSpan: 2, alignment: 'center' },
                                        {},
                                        {
                                            text: 'Lat (decimal degree)',
                                            style: 'tableBlueHeader',
                                            colSpan: 3,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        { text: `${this.segmentItems.lat4}`, colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                    ],
                                ],
                            },
                        },
                        { text: '', fontSize: 11, bold: true, pageBreak: 'before', margin: [0, 20, 0, 8] },
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [
                                    100,
                                    30,
                                    30,
                                    'auto',
                                    'auto',
                                    75,
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                    'auto',
                                ],
                                headerRows: 2,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        { text: '4.	Shoreline Type', style: 'tableBlackHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        {
                                            text:
                                                'Please indicate ONE Primary Shoreline type (1) and secondary shoreline types (2) for both the intertidal (foreshore) and supratidal (backshore) environment',
                                            style: 'tableHeader',
                                            colSpan: 13,
                                            alignment: 'left',
                                        },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Shoreline Type', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Intertidal', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: 'Supertidal', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: 'Shoreline Type', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Intertidal', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: 'Supertidal', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: 'Shoreline Type', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Intertidal', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: 'Supertidal', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                    ],
                                    [
                                        {},
                                        { text: 1, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 2, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 1, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 2, style: 'tableBlueHeader', alignment: 'center' },
                                        {},
                                        { text: 1, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 2, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 1, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 2, style: 'tableBlueHeader', alignment: 'center' },
                                        {},
                                        { text: 1, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 2, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 1, style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 2, style: 'tableBlueHeader', alignment: 'center' },
                                    ],
                                    [
                                        { text: 'Expose Rocky shores 1A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[0].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[0].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[0].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[0].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Coarse to medium sandy Beaches 4', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[0].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[0].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[0].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[0].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Sheltered Rocky shores 8A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[0].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[0].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[0].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[0].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: 'Exposed Manmade Structures 1B', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[1].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[1].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[1].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[1].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Mixed sand and gravel 5', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[1].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[1].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[1].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[1].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Sheltered manmade 8B', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[1].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[1].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[1].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[1].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: 'Exposed Rocky platforms 2A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[2].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[2].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[2].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[2].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Gravel Beaches 6A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[2].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[2].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[2].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[2].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Sheltered Tidal flats 9A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[2].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[2].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[2].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[2].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: 'Fine-Medium Sandy Beaches 3A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[3].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[3].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[3].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[3].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'RipRap 6B', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[3].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[3].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[3].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[3].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Salt marshes 10A', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[3].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[3].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[3].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[3].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: 'Scraps and steep slopes in sand', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[4].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[4].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[4].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section1.types[4].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Exposed Tidal flats 7', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[4].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[4].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[4].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section2.types[4].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: 'Mangroves 10D', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[4].checkbox.value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[4].checkbox.value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[4].checkbox.value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.shoreLine.section3.types[4].checkbox.value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: 'Other', style: 'tableHeader', alignment: 'center' },
                                        {
                                            image: `${this.shoreLine.others[0].value1 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.shoreLine.others[0].value2 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.shoreLine.others[0].value3 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.shoreLine.others[0].value4 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        { text: 'If other please indicate ', style: 'tableHeader', alignment: 'center' },
                                        { text: `${this.shoreLine.otherIndicate}`, colSpan: 9, alignment: 'left' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Other features', style: 'tableHeader', colSpan: 3, alignment: 'center' },
                                        {},
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.shoreLine.otherFeatures[0].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Amenity area',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.shoreLine.otherFeatures[1].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Estuary',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.shoreLine.otherFeatures[2].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Historical',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.shoreLine.otherFeatures[3].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Crack and crevices',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.shoreLine.otherFeatures[4].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Pools',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                        {
                                            table: {
                                                body: [
                                                    [
                                                        {
                                                            image: `${
                                                                this.shoreLine.otherFeatures[5].value == true
                                                                    ? checkImage
                                                                    : uncheckImage
                                                            }`,
                                                        },
                                                        'Biological Outpost',
                                                    ],
                                                ],
                                            },
                                            colSpan: 2,
                                        },
                                        {},
                                    ],
                                    [
                                        {
                                            text: 'Please provide details of other features',
                                            style: 'tableHeader',
                                            colSpan: 3,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        { text: `${this.shoreLine.otherFeatureDetails}`, colSpan: 12, alignment: 'center' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                ],
                            },
                        },
                        { text: '', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 20, 0, 8] },
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [180, 180, 180, 180],
                                headerRows: 2,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        { text: '5.	Operational features', style: 'tableBlackHeader', alignment: 'center' },
                                        {},
                                        { text: 'Load bearing capacity', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.operationalFeatures.loadBearing}`, alignment: 'left' },
                                    ],
                                    [
                                        { text: 'Access', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.operationalFeatures.access}`, alignment: 'left' },
                                        { text: 'Clean up activities', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.operationalFeatures.cleanUp}`, alignment: 'left' },
                                    ],
                                    [
                                        { text: 'Suitable lay down area', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.operationalFeatures.suitableLayDownArea}`, alignment: 'left' },
                                        { text: 'Additional details', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: `${this.operationalFeatures.additionalInfo}`, alignment: 'left' },
                                    ],
                                ],
                            },
                        },
                        { text: '', fontSize: 10, bold: true, pageBreak: 'before', margin: [0, 10, 0, 8] },
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [
                                    50,
                                    10,
                                    10,
                                    10,
                                    10,
                                    50,
                                    50,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                    20,
                                ],
                                // widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                                headerRows: 1,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        { text: '6.	Surface Oil', style: 'tableBlackHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        {
                                            text: 'Tick here if no oil observed',
                                            style: 'tableHeader',
                                            colSpan: 23,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Zone Id', style: 'tableBlueHeader', rowSpan: 2, alignment: 'center' },
                                        { text: 'Position', style: 'tableBlueHeader', colSpan: 4, alignment: 'center' },
                                        {},
                                        {},
                                        {},
                                        { text: 'Oil Cover', style: 'tableBlueHeader', colSpan: 2, alignment: 'center' },
                                        {},
                                        { text: 'Distribution', style: 'tableBlueHeader', colSpan: 5, alignment: 'center' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        { text: 'Oil Thickness', style: 'tableBlueHeader', colSpan: 5, alignment: 'center' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        { text: 'Oil Character', style: 'tableBlueHeader', colSpan: 8, alignment: 'center' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        {},
                                        { text: 'L', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'M', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'U', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'S', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Lenght', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Width', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'TR', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'SP', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'PT', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'BR', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'CO', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'TO', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'CV', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'CT', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'ST', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'FL', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'FR', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'MS', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'TB', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'PT', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'PA', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'SR', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'AP', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'TA', style: 'tableBlueHeader', alignment: 'center' },
                                    ],
                                    [
                                        { text: `${this.surfaceOil[0].zoneId}`, alignment: 'left' },
                                        {
                                            image: `${this.surfaceOil[0].position[0].value1 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[0].position[0].value2 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[0].position[0].value3 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[0].position[0].value4 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.surfaceOil[0].oilCover.length}`, alignment: 'left' },
                                        { text: `${this.surfaceOil[0].oilCover.width}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.surfaceOil[0].distribution[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].distribution[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].distribution[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].distribution[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].distribution[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilThickness[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilThickness[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilThickness[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilThickness[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilThickness[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value6 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value7 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[0].oilCharacter[0].value8 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: `${this.surfaceOil[1].zoneId}`, alignment: 'left' },
                                        {
                                            image: `${this.surfaceOil[1].position[0].value1 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[1].position[0].value2 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[1].position[0].value3 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[1].position[0].value4 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.surfaceOil[1].oilCover.length}`, alignment: 'left' },
                                        { text: `${this.surfaceOil[1].oilCover.width}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.surfaceOil[1].distribution[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].distribution[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].distribution[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].distribution[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].distribution[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilThickness[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilThickness[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilThickness[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilThickness[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilThickness[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value6 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value7 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[1].oilCharacter[0].value8 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: `${this.surfaceOil[2].zoneId}`, alignment: 'left' },
                                        {
                                            image: `${this.surfaceOil[2].position[0].value1 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[2].position[0].value2 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[2].position[0].value3 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[2].position[0].value4 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.surfaceOil[2].oilCover.length}`, alignment: 'left' },
                                        { text: `${this.surfaceOil[2].oilCover.width}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.surfaceOil[2].distribution[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].distribution[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].distribution[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].distribution[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].distribution[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilThickness[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilThickness[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilThickness[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilThickness[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilThickness[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value6 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value7 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[2].oilCharacter[0].value8 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: `${this.surfaceOil[3].zoneId}`, alignment: 'left' },
                                        {
                                            image: `${this.surfaceOil[3].position[0].value1 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[3].position[0].value2 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[3].position[0].value3 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[3].position[0].value4 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.surfaceOil[3].oilCover.length}`, alignment: 'left' },
                                        { text: `${this.surfaceOil[3].oilCover.width}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.surfaceOil[3].distribution[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].distribution[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].distribution[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].distribution[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].distribution[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilThickness[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilThickness[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilThickness[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilThickness[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilThickness[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value6 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value7 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[3].oilCharacter[0].value8 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                    [
                                        { text: `${this.surfaceOil[4].zoneId}`, alignment: 'left' },
                                        {
                                            image: `${this.surfaceOil[4].position[0].value1 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[4].position[0].value2 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[4].position[0].value3 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${this.surfaceOil[4].position[0].value4 == true ? checkImage : uncheckImage}`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.surfaceOil[4].oilCover.length}`, alignment: 'left' },
                                        { text: `${this.surfaceOil[4].oilCover.width}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.surfaceOil[4].distribution[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].distribution[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].distribution[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].distribution[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].distribution[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilThickness[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilThickness[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilThickness[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilThickness[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilThickness[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value5 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value6 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value7 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.surfaceOil[4].oilCharacter[0].value8 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                    ],
                                ],
                            },
                        },
                        { text: '', fontSize: 10, bold: true, pageBreak: 'before', margin: [0, 10, 0, 8] },
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [70, 20, 20, 20, 20, 40, 70, 30, 30, 30, 30, 30, 30, 30, 70, 30, 30],
                                // widths: ['auto', 'auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto','auto',],
                                headerRows: 1,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        {
                                            text: '7.	Sub Surface Oiling',
                                            style: 'tableBlackHeader',
                                            colSpan: 2,
                                            alignment: 'center',
                                        },
                                        {},
                                        {
                                            text: 'Tick here if no oil observed',
                                            style: 'tableHeader',
                                            colSpan: 15,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'Pit Id', style: 'tableBlueHeader', rowSpan: 2, alignment: 'center' },
                                        { text: 'Position', style: 'tableBlueHeader', colSpan: 4, alignment: 'center' },
                                        {},
                                        {},
                                        {},
                                        { text: 'Pit depth', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Oiled zone', style: 'tableBlueHeader', alignment: 'center' },
                                        {
                                            text: 'Sub-surface Oil Character',
                                            style: 'tableBlueHeader',
                                            colSpan: 7,
                                            alignment: 'center',
                                        },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                        { text: 'Water Table', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Lat', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Long', style: 'tableBlueHeader', alignment: 'center' },
                                    ],
                                    [
                                        {},
                                        { text: 'L', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'M', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'U', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'S', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: '(cm)', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Depth(cm)', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'SAP', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'OP', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'PP', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'OR', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'OF', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'TR', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'NO', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'Depth(cm)', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'd.dd', style: 'tableBlueHeader', alignment: 'center' },
                                        { text: 'd.dd', style: 'tableBlueHeader', alignment: 'center' },
                                    ],
                                    [
                                        { text: `${this.subSurfaceOil[0].pitId}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].position[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].position[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].position[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].position[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[0].pitDepth}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[0].oiledZone}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value5 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value6 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[0].subSurfaceOilCharacter[0].value7 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[0].waterTable}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[0].lat}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[0].long}`, alignment: 'left' },
                                    ],
                                    [
                                        { text: `${this.subSurfaceOil[1].pitId}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].position[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].position[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].position[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].position[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[1].pitDepth}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[1].oiledZone}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value5 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value6 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[1].subSurfaceOilCharacter[0].value7 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[1].waterTable}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[1].lat}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[1].long}`, alignment: 'left' },
                                    ],
                                    [
                                        { text: `${this.subSurfaceOil[2].pitId}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].position[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].position[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].position[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].position[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[2].pitDepth}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[2].oiledZone}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value5 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value6 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[2].subSurfaceOilCharacter[0].value7 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[2].waterTable}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[2].lat}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[2].long}`, alignment: 'left' },
                                    ],
                                    [
                                        { text: `${this.subSurfaceOil[3].pitId}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].position[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].position[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].position[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].position[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[3].pitDepth}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[3].oiledZone}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value5 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value6 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[3].subSurfaceOilCharacter[0].value7 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[3].waterTable}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[3].lat}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[3].long}`, alignment: 'left' },
                                    ],
                                    [
                                        { text: `${this.subSurfaceOil[4].pitId}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].position[0].value1 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].position[0].value2 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].position[0].value3 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].position[0].value4 == true ? checkImage : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[4].pitDepth}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[4].oiledZone}`, alignment: 'left' },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value1 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value2 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value3 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value4 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value5 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value6 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        {
                                            image: `${
                                                this.subSurfaceOil[4].subSurfaceOilCharacter[0].value7 == true
                                                    ? checkImage
                                                    : uncheckImage
                                            }`,
                                            alignment: 'center',
                                        },
                                        { text: `${this.subSurfaceOil[4].waterTable}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[4].lat}`, alignment: 'left' },
                                        { text: `${this.subSurfaceOil[4].long}`, alignment: 'left' },
                                    ],
                                ],
                            },
                        },
                        { text: '', fontSize: 10, bold: true, pageBreak: 'before', margin: [0, 10, 0, 8] },
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [145, 100, 100, 100, 100, 145],
                                headerRows: 1,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        {
                                            text: 'Noted sensitivities or limitations',
                                            style: 'tableBlueHeader',
                                            colSpan: 6,
                                            alignment: 'left',
                                        },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: this.notedSensitivesOrLimitations, colSpan: 6, alignment: 'left' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { text: 'General Comment', style: 'tableBlueHeader', colSpan: 6, alignment: 'left' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [{ text: this.generalComments, colSpan: 6, alignment: 'left' }, {}, {}, {}, {}, {}],
                                    [
                                        { text: 'Sketch map/profiles', style: 'tableBlueHeader', colSpan: 6, alignment: 'left' },
                                        {},
                                        {},
                                        {},
                                        {},
                                        {},
                                    ],
                                    [
                                        { image: vm.imageBase64_1, colSpan: 3 },
                                        {},
                                        {},
                                        { image: vm.imageBase64_2, colSpan: 3 },
                                        {},
                                        {},
                                    ],
                                    [{ text: this.sketchMapProfiles2, colSpan: 6, alignment: 'left' }, {}, {}, {}, {}, {}],
                                ],
                            },
                        },
                        { text: '', fontSize: 10, bold: true, pageBreak: 'before', margin: [0, 10, 0, 8] },
                        {
                            // layout: 'lightHorizontalLines', // optional
                            table: {
                                widths: [200, 550],
                                headerRows: 1,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [{ text: 'Legend:', style: 'tableBlueHeader', colSpan: 2, alignment: 'left' }, {}],
                                    [
                                        { text: 'Distribution', style: 'tableHeader', alignment: 'left' },
                                        {
                                            ul: [
                                                'TRace (<1%)',
                                                'SPoradic (1-10%)',
                                                'PaTchy(11-50%)',
                                                'BRoken(51-90%)',
                                                'COntinuous(91-100%)',
                                            ],
                                        },
                                    ],
                                    [
                                        { text: 'Thickness', style: 'tableHeader', alignment: 'left' },
                                        {
                                            ul: [
                                                'TO-Thick Oil(>1cm)',
                                                'CV-CoVer(1mm to 1cm)',
                                                'CT-CoaT(<1mm)',
                                                'FL-FiLm(transparent sheen)',
                                            ],
                                        },
                                    ],
                                    [
                                        { text: 'Surface Oil Characteristic', style: 'tableHeader', alignment: 'left' },
                                        {
                                            ul: [
                                                'FR-Fresh',
                                                'MS-Mousse',
                                                'TB-TarBalls (<10cm)',
                                                'PT-Tar Patties (10cm-1m)',
                                                'PA-Patches (1 – 30m)',
                                                'SR-Surface oil Residue (non-cohesive oiled sediment)',
                                                'AP-Asphalt Pavement (cohesive mixture)',
                                                'TA-Tarry (Almost solid weathered oil)',
                                            ],
                                        },
                                    ],
                                    [
                                        { text: 'Subsurface Oil Characteristic', style: 'tableHeader', alignment: 'left' },
                                        {
                                            ul: [
                                                'SAP-Subsurface Asphalt Pavement (sediment below surface layer. Oil will flow out when disturbed)',
                                                'OP-Oil filled Pores (pores spaces completely filled)',
                                                'PP-Partially Filled Pores (oil doesn’t flow out the sediment when disturbed',
                                                'OR-Oil Residue (sediment are visibly oiled with black/brown coat)',
                                                'OF-Oil Film (sediment are lightly oiled with film, stain or clasts)',
                                                'TR-Trace (discontinuous film or spots of oil or and odor or tackiness)',
                                                'NO-No Oil (no visible or apparent evidence of oil)',
                                            ],
                                        },
                                    ],
                                ],
                            },
                        },
                    ],
                    styles: {
                        header: {
                            fontSize: 18,
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
                        tableBlackHeader: {
                            bold: true,
                            fontSize: 13,
                            color: 'white',
                            fillColor: 'black',
                        },
                        tableBlueHeader: {
                            bold: true,
                            fontSize: 13,
                            color: 'black',
                            fillColor: '#cccccc',
                        },
                    },
                }
                pdfMake.createPdf(docDefinition).download(`${this.exportFileName}.pdf`)
            }, 500)
        },
    },
    mounted() {
        this.generalInformationItems.dateCr = new Date().toISOString().substr(0, 10)
        this.userName = this.$store.getters.user.userInfos.userName
        this.getImageData()
        const vm = this
    },
}
</script>

<style lang="scss" scoped>
.text-size {
    font-size: 12px !important;
}

table {
    width: 100%;
    border-collapse: collapse;
}

table th,
table td {
    border: 1px solid #dddddd;
    padding: 3px;
}

table th {
    padding: 6px 2px;
    color: #fff;
}

.header-style {
    font-size: 20px;
}

.styled-input {
    padding-top: 5px !important;
    height: 32px !important;
}

.styled-input-header {
    height: 45px !important;
}

.border-1 {
    border: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-top {
    border-top: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-top-none {
    border-top: none !important;
}

.border-bottom-none {
    border-bottom: none !important;
}

.border-bottom {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-right {
    border-right: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-right-none {
    border-right: none !important;
}

.border-left {
    border-left: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.border-left-none {
    border-left: none !important;
}
</style>
