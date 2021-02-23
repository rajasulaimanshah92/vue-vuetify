<template>
    <div>
        <v-container grid-list-xl id="sima-container">
            <v-layout row wrap pa-5>
                <v-flex xs12>
                    <v-btn
                        color="primaryGreen white--text"
                        small
                        class="elevation-0"
                        @click="exportDialog = true"
                        style="float: right"
                    >
                        <v-icon class="mr-1" small dark>mdi-file-export</v-icon>
                        Export
                    </v-btn>
                </v-flex>
                <v-flex xs12 style="overflow-x:auto;">
                    <table id="tableFirst" style="width:100%; border:none;">
                        <tr>
                            <td style="border:none; text-align: center;" colspan="3">SIMA Stage 2: Predict Outcomes</td>
                            <td style="border:none; text-align: center;" colspan="9">SIMA Stage 3: Balance trade-offs</td>
                        </tr>
                        <br />
                        <tr>
                            <td style="border:none;"></td>
                            <td style="border:none;"></td>
                            <td style="border:none;"></td>
                            <td style="border:none;"></td>
                            <td colspan="9" style="background: #696969; text-align: center; border:none;">
                                <font color="white">4. Impact modification factors</font>
                            </td>
                        </tr>
                        <tr class="text-md-center font-weight-medium">
                            <td style="border:none;"></td>
                            <td class="text-md-center" colspan="2" style="border:none;font-size: 11.5px;">
                                <font color="red">2. Relative impact assessment</font>
                            </td>
                            <td style="border:none;"></td>
                            <td colspan="2" style="position: relative; border:none;">
                                <span style="font-size:32px; position: absolute; top:-16px; color: #696969;">&#11015;</span>
                            </td>
                            <td colspan="2" style="position: relative; border:none;">
                                <span style="font-size:32px; position: absolute; top:-16px; color: #696969;">&#11015;</span>
                            </td>
                            <td class="text-md-center" style="border:none;"></td>
                            <td colspan="2" style="position: relative; border:none;">
                                <span style="font-size:32px; position: absolute; top:-16px; color: #696969;">&#11015;</span>
                            </td>
                            <td colspan="2" style="position: relative; border:none;">
                                <span style="font-size:32px; position: absolute; top:-16px; color: #696969;">&#11015;</span>
                            </td>
                        </tr>
                        <tr class="text-md-center font-weight-medium">
                            <th style="border-left:none; border-top:none; border-bottom:none;"></th>
                            <th class="text-md-center font-weight-medium" colspan="2">
                                <font color="#989cff">NO INTERVENTION</font>
                            </th>
                            <th style="border:0;"></th>
                            <th class="text-md-center font-weight-medium" colspan="2">
                                <font color="#989cff">CONTAINMENT AND RECOVERY</font>
                            </th>
                            <th class="text-md-center font-weight-medium" colspan="2">
                                <font color="#989cff">SURFACE DISPERSANT</font>
                            </th>
                            <th class="text-md-center font-weight-medium">
                                <font color="#989cff">SUBSEA DISPERSANT</font>
                            </th>
                            <th class="text-md-center font-weight-medium" colspan="2">
                                <font color="#989cff">CONTROLLED IN-SITU BURNING</font>
                            </th>
                            <th class="text-md-center font-weight-medium" colspan="2">
                                <font color="#989cff">SHORELINE BOOMING</font>
                            </th>
                        </tr>
                        <tr class="text-md-center font-weight-medium">
                            <td style="border-left:none; border-top:none; border-bottom:none;"></td>
                            <td colspan="2">
                                <p class="horizontalScript" style="display:inline;">Potential relative impact</p>
                            </td>
                            <td rowspan="16" style="border:none; width:300px">
                                <p class="horizontalScript" style="display:inline;">
                                    <font color="red"
                                        >3. Predict the effectiveness and impact modification<br />potential of the various
                                        response options</font
                                    >
                                </p>
                            </td>
                            <td style="border-right: dashed;">
                                <p class="horizontalScript" style="display:inline;">Impact modification factor</p>
                            </td>
                            <td>
                                <p class="horizontalScript" style="display:inline;">Relative impact mitigation score</p>
                            </td>
                            <td style="border-right: dashed;">
                                <p class="horizontalScript" style="display:inline;">Impact modification factor</p>
                            </td>
                            <td>
                                <p class="horizontalScript" style="display:inline;">Relative impact mitigation score</p>
                            </td>
                            <td rowspan="16">
                                <p style="display:inline;">Not feasible for a surface spill</p>
                            </td>
                            <td style="border-right: dashed;">
                                <p class="horizontalScript" style="display:inline;">Impact modification factor</p>
                            </td>
                            <td>
                                <p class="horizontalScript" style="display:inline;">Relative impact mitigation score</p>
                            </td>
                            <td style="border-right: dashed;">
                                <p class="horizontalScript" style="display:inline;">Impact modification factor</p>
                            </td>
                            <td>
                                <p class="horizontalScript" style="display:inline;">Relative impact mitigation score</p>
                            </td>
                        </tr>
                        <tr>
                            <td width="15%;" style="border:none;"><font color="red">1. Resource Compartment</font></td>
                            <td width="7%;"></td>
                            <td width="7%;" style="text-align:center;">A</td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">B1</td>
                            <td width="7%;" style="text-align:center;">AxB1</td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">B2</td>
                            <td width="7%;" style="text-align:center;">AxB2</td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">B4</td>
                            <td width="7%;" style="text-align:center;">AxB4</td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">B5</td>
                            <td width="7%;" style="text-align:center;">AxB5</td>
                        </tr>
                        <tr pt-0 pb-0>
                            <td width="15%;">Seabed</td>
                            <td width="7%;" :style="impactColor(resourcesCompartment.seabed.A)">
                                {{ impactOfDegree(resourcesCompartment.seabed.A) }}
                            </td>
                            <td width="7%;" style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.seabed.A,
                                            resourcesCompartment.seabed.B1,
                                            'seabed',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.seabed.A"
                                    style="text-align:center;"
                                    type="number"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.seabed.A,
                                            resourcesCompartment.seabed.B1,
                                            'seabed',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.seabed.B1"
                                    style="text-align:center;"
                                    type="number"
                                    class="textField"
                                />
                            </td>
                            <td width="7%;" :style="mitigationColor(resourcesCompartment.seabed.AxB1)">
                                {{ resourcesCompartment.seabed.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.seabed.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','seabed')" hide-details></v-checkbox> -->
                            </td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.seabed.A,
                                            resourcesCompartment.seabed.B2,
                                            'seabed',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.seabed.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td width="7%;" :style="mitigationColor(resourcesCompartment.seabed.AxB2)">
                                {{ resourcesCompartment.seabed.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.seabed.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','seabed')" hide-details></v-checkbox> -->
                            </td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.seabed.A,
                                            resourcesCompartment.seabed.B4,
                                            'seabed',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.seabed.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td width="7%;" :style="mitigationColor(resourcesCompartment.seabed.AxB4)">
                                {{ resourcesCompartment.seabed.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.seabed.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','seabed')" hide-details></v-checkbox> -->
                            </td>
                            <td width="7%;" style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.seabed.A,
                                            resourcesCompartment.seabed.B5,
                                            'seabed',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.seabed.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td width="7%;" :style="mitigationColor(resourcesCompartment.seabed.AxB5)">
                                {{ resourcesCompartment.seabed.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.seabed.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','seabed')" hide-details></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Lower Water Column</td>
                            <td :style="impactColor(resourcesCompartment.lowerWaterColumn.A)">
                                {{ impactOfDegree(resourcesCompartment.lowerWaterColumn.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.lowerWaterColumn.A,
                                            resourcesCompartment.lowerWaterColumn.B1,
                                            'lowerWaterColumn',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.lowerWaterColumn.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.lowerWaterColumn.A,
                                            resourcesCompartment.lowerWaterColumn.B1,
                                            'lowerWaterColumn',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.lowerWaterColumn.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.lowerWaterColumn.AxB1)">
                                {{ resourcesCompartment.lowerWaterColumn.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.lowerWaterColumn.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','lowerWaterColumn')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.lowerWaterColumn.A,
                                            resourcesCompartment.lowerWaterColumn.B2,
                                            'lowerWaterColumn',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.lowerWaterColumn.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.lowerWaterColumn.AxB2)">
                                {{ resourcesCompartment.lowerWaterColumn.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.lowerWaterColumn.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','lowerWaterColumn')" hide-details></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.lowerWaterColumn.A,
                                            resourcesCompartment.lowerWaterColumn.B4,
                                            'lowerWaterColumn',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.lowerWaterColumn.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.lowerWaterColumn.AxB4)">
                                {{ resourcesCompartment.lowerWaterColumn.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.lowerWaterColumn.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','lowerWaterColumn')" hide-details></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.lowerWaterColumn.A,
                                            resourcesCompartment.lowerWaterColumn.B5,
                                            'lowerWaterColumn',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.lowerWaterColumn.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.lowerWaterColumn.AxB5)">
                                {{ resourcesCompartment.lowerWaterColumn.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.lowerWaterColumn.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','lowerWaterColumn')" hide-details></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Upper Water Column</td>
                            <td :style="impactColor(resourcesCompartment.upperWaterColumn.A)">
                                {{ impactOfDegree(resourcesCompartment.upperWaterColumn.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.upperWaterColumn.A,
                                            resourcesCompartment.upperWaterColumn.B1,
                                            'upperWaterColumn',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.upperWaterColumn.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.upperWaterColumn.A,
                                            resourcesCompartment.upperWaterColumn.B1,
                                            'upperWaterColumn',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.upperWaterColumn.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.upperWaterColumn.AxB1)">
                                {{ resourcesCompartment.upperWaterColumn.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.upperWaterColumn.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','upperWaterColumn')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.upperWaterColumn.A,
                                            resourcesCompartment.upperWaterColumn.B2,
                                            'upperWaterColumn',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.upperWaterColumn.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.upperWaterColumn.AxB2)">
                                {{ resourcesCompartment.upperWaterColumn.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.upperWaterColumn.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','upperWaterColumn')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.upperWaterColumn.A,
                                            resourcesCompartment.upperWaterColumn.B4,
                                            'upperWaterColumn',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.upperWaterColumn.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.upperWaterColumn.AxB4)">
                                {{ resourcesCompartment.upperWaterColumn.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.upperWaterColumn.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','upperWaterColumn')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.upperWaterColumn.A,
                                            resourcesCompartment.upperWaterColumn.B5,
                                            'upperWaterColumn',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.upperWaterColumn.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.upperWaterColumn.AxB5)">
                                {{ resourcesCompartment.upperWaterColumn.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.upperWaterColumn.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','upperWaterColumn')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Water Surface</td>
                            <td :style="impactColor(resourcesCompartment.waterSurface.A)">
                                {{ impactOfDegree(resourcesCompartment.waterSurface.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterSurface.A,
                                            resourcesCompartment.waterSurface.B1,
                                            'waterSurface',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterSurface.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterSurface.A,
                                            resourcesCompartment.waterSurface.B1,
                                            'waterSurface',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterSurface.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterSurface.AxB1)">
                                {{ resourcesCompartment.waterSurface.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterSurface.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','waterSurface')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterSurface.A,
                                            resourcesCompartment.waterSurface.B2,
                                            'waterSurface',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterSurface.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterSurface.AxB2)">
                                {{ resourcesCompartment.waterSurface.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterSurface.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','waterSurface')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterSurface.A,
                                            resourcesCompartment.waterSurface.B4,
                                            'waterSurface',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterSurface.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterSurface.AxB4)">
                                {{ resourcesCompartment.waterSurface.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterSurface.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','waterSurface')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterSurface.A,
                                            resourcesCompartment.waterSurface.B5,
                                            'waterSurface',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterSurface.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterSurface.AxB5)">
                                {{ resourcesCompartment.waterSurface.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterSurface.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','waterSurface')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Air</td>
                            <td :style="impactColor(resourcesCompartment.air.A)">
                                {{ impactOfDegree(resourcesCompartment.air.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(resourcesCompartment.air.A, resourcesCompartment.air.B1, 'air', 'AxB1')
                                    "
                                    v-model="resourcesCompartment.air.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(resourcesCompartment.air.A, resourcesCompartment.air.B1, 'air', 'AxB1')
                                    "
                                    v-model="resourcesCompartment.air.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.air.AxB1)">
                                {{ resourcesCompartment.air.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.air.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','air')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(resourcesCompartment.air.A, resourcesCompartment.air.B2, 'air', 'AxB2')
                                    "
                                    v-model="resourcesCompartment.air.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.air.AxB2)">
                                {{ resourcesCompartment.air.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.air.AxB2checked" class="checkBox"  @change="calcResourceCompartment('A','B2','air')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(resourcesCompartment.air.A, resourcesCompartment.air.B4, 'air', 'AxB4')
                                    "
                                    v-model="resourcesCompartment.air.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.air.AxB4)">
                                {{ resourcesCompartment.air.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.air.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','air')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(resourcesCompartment.air.A, resourcesCompartment.air.B5, 'air', 'AxB5')
                                    "
                                    v-model="resourcesCompartment.air.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.air.AxB5)">
                                {{ resourcesCompartment.air.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.air.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','air')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Shorelines</td>
                            <td :style="impactColor(resourcesCompartment.shorelines.A)">
                                {{ impactOfDegree(resourcesCompartment.shorelines.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.shorelines.A,
                                            resourcesCompartment.shorelines.B1,
                                            'shorelines',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.shorelines.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.shorelines.A,
                                            resourcesCompartment.shorelines.B1,
                                            'shorelines',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.shorelines.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.shorelines.AxB1)">
                                {{ resourcesCompartment.shorelines.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.shorelines.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','shorelines')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.shorelines.A,
                                            resourcesCompartment.shorelines.B2,
                                            'shorelines',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.shorelines.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.shorelines.AxB2)">
                                {{ resourcesCompartment.shorelines.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.shorelines.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','shorelines')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.shorelines.A,
                                            resourcesCompartment.shorelines.B4,
                                            'shorelines',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.shorelines.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.shorelines.AxB4)">
                                {{ resourcesCompartment.shorelines.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.shorelines.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','shorelines')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.shorelines.A,
                                            resourcesCompartment.shorelines.B5,
                                            'shorelines',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.shorelines.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.shorelines.AxB5)">
                                {{ resourcesCompartment.shorelines.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.shorelines.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','shorelines')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td><i>Saltmarsh</i></td>
                            <td :style="impactColor(resourcesCompartment.saltmarsh.A)">
                                <i>{{ impactOfDegree(resourcesCompartment.saltmarsh.A) }}</i>
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.saltmarsh.A,
                                            resourcesCompartment.saltmarsh.B1,
                                            'saltmarsh',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.saltmarsh.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.saltmarsh.A,
                                            resourcesCompartment.saltmarsh.B1,
                                            'saltmarsh',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.saltmarsh.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.saltmarsh.AxB1)">
                                {{ resourcesCompartment.saltmarsh.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.saltmarsh.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','saltmarsh')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.saltmarsh.A,
                                            resourcesCompartment.saltmarsh.B2,
                                            'saltmarsh',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.saltmarsh.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.saltmarsh.AxB2)">
                                {{ resourcesCompartment.saltmarsh.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.saltmarsh.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','saltmarsh')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.saltmarsh.A,
                                            resourcesCompartment.saltmarsh.B4,
                                            'saltmarsh',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.saltmarsh.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.saltmarsh.AxB4)">
                                {{ resourcesCompartment.saltmarsh.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.saltmarsh.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','saltmarsh')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.saltmarsh.A,
                                            resourcesCompartment.saltmarsh.B5,
                                            'saltmarsh',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.saltmarsh.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.saltmarsh.AxB5)">
                                {{ resourcesCompartment.saltmarsh.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.saltmarsh.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','saltmarsh')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td><i>Esturaine mudflats</i></td>
                            <td :style="impactColor(resourcesCompartment.esturaineMudflats.A)">
                                <i>{{ impactOfDegree(resourcesCompartment.esturaineMudflats.A) }}</i>
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.esturaineMudflats.A,
                                            resourcesCompartment.esturaineMudflats.B1,
                                            'esturaineMudflats',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.esturaineMudflats.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.esturaineMudflats.A,
                                            resourcesCompartment.esturaineMudflats.B1,
                                            'esturaineMudflats',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.esturaineMudflats.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.esturaineMudflats.AxB1)">
                                {{ resourcesCompartment.esturaineMudflats.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.esturaineMudflats.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','esturaineMudflats')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.esturaineMudflats.A,
                                            resourcesCompartment.esturaineMudflats.B2,
                                            'esturaineMudflats',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.esturaineMudflats.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.esturaineMudflats.AxB2)">
                                {{ resourcesCompartment.esturaineMudflats.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.esturaineMudflats.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','esturaineMudflats')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.esturaineMudflats.A,
                                            resourcesCompartment.esturaineMudflats.B4,
                                            'esturaineMudflats',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.esturaineMudflats.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.esturaineMudflats.AxB4)">
                                {{ resourcesCompartment.esturaineMudflats.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.esturaineMudflats.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','esturaineMudflats')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.esturaineMudflats.A,
                                            resourcesCompartment.esturaineMudflats.B5,
                                            'esturaineMudflats',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.esturaineMudflats.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.esturaineMudflats.AxB5)">
                                {{ resourcesCompartment.esturaineMudflats.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.esturaineMudflats.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','esturaineMudflats')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td><i>Sandy Beaches</i></td>
                            <td :style="impactColor(resourcesCompartment.sandyBeaches.A)">
                                <i>{{ impactOfDegree(resourcesCompartment.sandyBeaches.A) }}</i>
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.sandyBeaches.A,
                                            resourcesCompartment.sandyBeaches.B1,
                                            'sandyBeaches',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.sandyBeaches.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.sandyBeaches.A,
                                            resourcesCompartment.sandyBeaches.B1,
                                            'sandyBeaches',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.sandyBeaches.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.sandyBeaches.AxB1)">
                                {{ resourcesCompartment.sandyBeaches.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.sandyBeaches.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','sandyBeaches')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.sandyBeaches.A,
                                            resourcesCompartment.sandyBeaches.B2,
                                            'sandyBeaches',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.sandyBeaches.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.sandyBeaches.AxB2)">
                                {{ resourcesCompartment.sandyBeaches.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.sandyBeaches.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','sandyBeaches')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.sandyBeaches.A,
                                            resourcesCompartment.sandyBeaches.B4,
                                            'sandyBeaches',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.sandyBeaches.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.sandyBeaches.AxB4)">
                                {{ resourcesCompartment.sandyBeaches.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.sandyBeaches.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','sandyBeaches')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.sandyBeaches.A,
                                            resourcesCompartment.sandyBeaches.B5,
                                            'sandyBeaches',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.sandyBeaches.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.sandyBeaches.AxB5)">
                                {{ resourcesCompartment.sandyBeaches.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.sandyBeaches.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','sandyBeaches')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>High Value Resource</td>
                            <td :style="impactColor(resourcesCompartment.highValueResource.A)">
                                {{ impactOfDegree(resourcesCompartment.highValueResource.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.highValueResource.A,
                                            resourcesCompartment.highValueResource.B1,
                                            'highValueResource',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.highValueResource.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.highValueResource.A,
                                            resourcesCompartment.highValueResource.B1,
                                            'highValueResource',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.highValueResource.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.highValueResource.AxB1)">
                                {{ resourcesCompartment.highValueResource.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.highValueResource.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','highValueResource')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.highValueResource.A,
                                            resourcesCompartment.highValueResource.B2,
                                            'highValueResource',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.highValueResource.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.highValueResource.AxB2)">
                                {{ resourcesCompartment.highValueResource.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.highValueResource.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','highValueResource')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.highValueResource.A,
                                            resourcesCompartment.highValueResource.B4,
                                            'highValueResource',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.highValueResource.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.highValueResource.AxB4)">
                                {{ resourcesCompartment.highValueResource.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.highValueResource.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','highValueResource')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.highValueResource.A,
                                            resourcesCompartment.highValueResource.B5,
                                            'highValueResource',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.highValueResource.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.highValueResource.AxB5)">
                                {{ resourcesCompartment.highValueResource.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.highValueResource.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','highValueResource')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Socio-economic</td>
                            <td :style="impactColor(resourcesCompartment.socioEconomic.A)">
                                {{ impactOfDegree(resourcesCompartment.socioEconomic.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.socioEconomic.A,
                                            resourcesCompartment.socioEconomic.B1,
                                            'socioEconomic',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.socioEconomic.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.socioEconomic.A,
                                            resourcesCompartment.socioEconomic.B1,
                                            'socioEconomic',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.socioEconomic.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.socioEconomic.AxB1)">
                                {{ resourcesCompartment.socioEconomic.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.socioEconomic.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','socioEconomic')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.socioEconomic.A,
                                            resourcesCompartment.socioEconomic.B2,
                                            'socioEconomic',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.socioEconomic.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.socioEconomic.AxB2)">
                                {{ resourcesCompartment.socioEconomic.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.socioEconomic.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','socioEconomic')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.socioEconomic.A,
                                            resourcesCompartment.socioEconomic.B4,
                                            'socioEconomic',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.socioEconomic.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.socioEconomic.AxB4)">
                                {{ resourcesCompartment.socioEconomic.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.socioEconomic.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','socioEconomic')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.socioEconomic.A,
                                            resourcesCompartment.socioEconomic.B5,
                                            'socioEconomic',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.socioEconomic.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.socioEconomic.AxB5)">
                                {{ resourcesCompartment.socioEconomic.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.socioEconomic.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','socioEconomic')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align:center;"><i>Boat Harbour</i></td>
                            <td :style="impactColor(resourcesCompartment.boatHarbour.A)">
                                <i>{{ impactOfDegree(resourcesCompartment.boatHarbour.A) }}</i>
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.boatHarbour.A,
                                            resourcesCompartment.boatHarbour.B1,
                                            'boatHarbour',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.boatHarbour.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.boatHarbour.A,
                                            resourcesCompartment.boatHarbour.B1,
                                            'boatHarbour',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.boatHarbour.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.boatHarbour.AxB1)">
                                {{ resourcesCompartment.boatHarbour.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.boatHarbour.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','boatHarbour')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.boatHarbour.A,
                                            resourcesCompartment.boatHarbour.B2,
                                            'boatHarbour',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.boatHarbour.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.boatHarbour.AxB2)">
                                {{ resourcesCompartment.boatHarbour.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.boatHarbour.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','boatHarbour')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.boatHarbour.A,
                                            resourcesCompartment.boatHarbour.B4,
                                            'boatHarbour',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.boatHarbour.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.boatHarbour.AxB4)">
                                {{ resourcesCompartment.boatHarbour.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.boatHarbour.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','boatHarbour')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.boatHarbour.A,
                                            resourcesCompartment.boatHarbour.B5,
                                            'boatHarbour',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.boatHarbour.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.boatHarbour.AxB5)">
                                {{ resourcesCompartment.boatHarbour.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.boatHarbour.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','boatHarbour')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td style="text-align:center;"><i>Water Recreation</i></td>
                            <td :style="impactColor(resourcesCompartment.waterRecreation.A)">
                                <i>{{ impactOfDegree(resourcesCompartment.waterRecreation.A) }}</i>
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterRecreation.A,
                                            resourcesCompartment.waterRecreation.B1,
                                            'waterRecreation',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterRecreation.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterRecreation.A,
                                            resourcesCompartment.waterRecreation.B1,
                                            'waterRecreation',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterRecreation.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterRecreation.AxB1)">
                                {{ resourcesCompartment.waterRecreation.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterRecreation.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','waterRecreation')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterRecreation.A,
                                            resourcesCompartment.waterRecreation.B2,
                                            'waterRecreation',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterRecreation.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterRecreation.AxB2)">
                                {{ resourcesCompartment.waterRecreation.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterRecreation.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','waterRecreation')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterRecreation.A,
                                            resourcesCompartment.waterRecreation.B4,
                                            'waterRecreation',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterRecreation.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterRecreation.AxB4)">
                                {{ resourcesCompartment.waterRecreation.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterRecreation.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','waterRecreation')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.waterRecreation.A,
                                            resourcesCompartment.waterRecreation.B5,
                                            'waterRecreation',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.waterRecreation.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.waterRecreation.AxB5)">
                                {{ resourcesCompartment.waterRecreation.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.waterRecreation.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','waterRecreation')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr>
                            <td>Cultural</td>
                            <td :style="impactColor(resourcesCompartment.cultural.A)">
                                {{ impactOfDegree(resourcesCompartment.cultural.A) }}
                            </td>
                            <td style="text-align:center;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.cultural.A,
                                            resourcesCompartment.cultural.B1,
                                            'cultural',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.cultural.A"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                    min="0"
                                    max="4"
                                    onKeyDown="return false"
                                />
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.cultural.A,
                                            resourcesCompartment.cultural.B1,
                                            'cultural',
                                            'AxB1'
                                        )
                                    "
                                    v-model="resourcesCompartment.cultural.B1"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.cultural.AxB1)">
                                {{ resourcesCompartment.cultural.AxB1 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.cultural.AxB1checked" class="checkBox" @change="calcResourceCompartment('A','B1','cultural')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.cultural.A,
                                            resourcesCompartment.cultural.B2,
                                            'cultural',
                                            'AxB2'
                                        )
                                    "
                                    v-model="resourcesCompartment.cultural.B2"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.cultural.AxB2)">
                                {{ resourcesCompartment.cultural.AxB2 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.cultural.AxB2checked" class="checkBox" @change="calcResourceCompartment('A','B2','cultural')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.cultural.A,
                                            resourcesCompartment.cultural.B4,
                                            'cultural',
                                            'AxB4'
                                        )
                                    "
                                    v-model="resourcesCompartment.cultural.B4"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.cultural.AxB4)">
                                {{ resourcesCompartment.cultural.AxB4 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.cultural.AxB4checked" class="checkBox" @change="calcResourceCompartment('A','B4','cultural')" hide-details ></v-checkbox> -->
                            </td>
                            <td style="text-align:center;border-right:dashed;">
                                <input
                                    @change="
                                        calculateMultiply(
                                            resourcesCompartment.cultural.A,
                                            resourcesCompartment.cultural.B5,
                                            'cultural',
                                            'AxB5'
                                        )
                                    "
                                    v-model="resourcesCompartment.cultural.B5"
                                    type="number"
                                    style="text-align:center;"
                                    class="textField"
                                />
                            </td>
                            <td :style="mitigationColor(resourcesCompartment.cultural.AxB5)">
                                {{ resourcesCompartment.cultural.AxB5 }}
                                <!-- <v-checkbox v-model="resourcesCompartment.cultural.AxB5checked" class="checkBox" @change="calcResourceCompartment('A','B5','cultural')" hide-details ></v-checkbox> -->
                            </td>
                        </tr>
                        <tr style="border:none;">
                            <td colspan="5" style="text-align:right; border:none;">Total impact mitigation score:</td>
                            <td rowspan="1">{{ calculateAddAxB1('AXB1') }}</td>
                            <td style="border:none;"></td>
                            <td rowspan="1">{{ calculateAddAxB2('AXB2') }}</td>
                            <td style="border:none;"></td>
                            <td style="border:none;"></td>
                            <td rowspan="1">{{ calculateAddAxB4('AXB4') }}</td>
                            <td style="border:none;"></td>
                            <td rowspan="1">{{ calculateAddAxB5('AXB5') }}</td>
                        </tr>
                        <tr style="border:none;">
                            <td colspan="5" style="text-align:right; border:none;">Ranking:</td>
                            <td>{{ getRanking('AXB1') }}</td>
                            <td style="border:none;"></td>
                            <td>{{ getRanking('AXB2') }}</td>
                            <td colspan="2" style="border:none;"></td>
                            <td>{{ getRanking('AXB4') }}</td>
                            <td style="border:none;"></td>
                            <td>{{ getRanking('AXB5') }}</td>
                        </tr>
                        <tr>
                            <td style="border:none;" colspan="2"></td>
                            <td colspan="12" style="background: #696969; text-align: center;">
                                <font color="white">5. Total impact mitigation score and ranking</font>
                            </td>
                        </tr>
                    </table>
                </v-flex>
                <v-flex xs12 pt-10>
                    <table style="width:100%; border:none;">
                        <tr>
                            <th
                                style="border-top:none; border-left:none; border-right:none;"
                                class="text-md-center font-weight-medium"
                                colspan="2"
                            >
                                Relative Impact Levels
                            </th>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-bottom:none;"></td>
                            <th class="text-md-center font-weight-medium" colspan="4">Recovery Period</th>
                            <th style="text-align:right; border:none;">1 -</th>
                            <td style="border:none; text-align:left;">None Impact</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-top:none; border-bottom:none;"></td>
                            <th class="text-md-center font-weight-medium" colspan="4">
                                Slow (------------------------------------)
                            </th>
                            <th style="text-align:right; border:none;">2 -</th>
                            <td style="border:none; text-align:left;">Low Impact</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-top:none;"></td>
                            <th>> 5 years</th>
                            <th>3-5 years</th>
                            <th>1-3 years</th>
                            <th>< 1 years</th>
                            <th style="text-align:right; border:none;">3 -</th>
                            <td style="border:none; text-align:left;">Medium Impact</td>
                        </tr>
                        <tr>
                            <th rowspan="6">Impact of degree</th>
                            <td class="text-md-center font-weight-medium">High</td>
                            <td style="background: #EE9A00; text-align:center;">High</td>
                            <td style="background: #EE9A00; text-align:center;">High</td>
                            <td style="background: #EE9A00; text-align:center;">High</td>
                            <td style="background: #f0bf60; text-align:center;">Medium</td>
                            <th style="text-align:right; border:none;">4 -</th>
                            <td style="border:none; text-align:left;">High Impact</td>
                        </tr>
                        <tr>
                            <td class="text-md-center font-weight-medium">Medium</td>
                            <td style="background: #EE9A00; text-align:center;">High</td>
                            <td style="background: #f0bf60; text-align:center;">Medium</td>
                            <td style="background: #f0bf60; text-align:center;">Medium</td>
                            <td style="background: #c4d79b; text-align:center;">Low</td>
                        </tr>
                        <tr>
                            <td class="text-md-center font-weight-medium">Low</td>
                            <td style="background: #f0bf60; text-align:center;">Medium</td>
                            <td style="background: #c4d79b; text-align:center;">Low</td>
                            <td style="background: #c4d79b; text-align:center;">Low</td>
                            <td style="background: #c4d79b; text-align:center;">Low</td>
                        </tr>
                    </table>
                </v-flex>
                <v-flex xs12 pt-10>
                    <table style="width:100%; border:none;">
                        <tr>
                            <th style="background: #00b1a9; text-align:center;">IMPACT MODIFICATION FACTOR</th>
                            <th style="background: #00b1a9; text-align:center;">DESCRIPTION</th>
                            <th style="border:none;">8 to 12</th>
                            <td style="border:none; background: #76933C; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">Major mitigation of impact</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">+3</td>
                            <td style="padding-left:10px;">Major mitigation of impact</td>
                            <th style="border:none;">3 to <8</th>
                            <td style="border: none; background: #C4D79B; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">Moderate mitigation of impact</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">+2</td>
                            <td style="padding-left:10px;">Moderate mitigation of impact</td>
                            <th style="border:none;">>0 to <3</th>
                            <td style="border: none; background: #D8E4BC; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">Minor mitigation of impact</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">+1</td>
                            <td style="padding-left:10px;">Minor mitigation of impact</td>
                            <th style="border:none;">0</th>
                            <td style="border: none; background: white; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">No or insignificant change</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">0</td>
                            <td style="padding-left:10px;">No or insignificant alteration of impact</td>
                            <th style="border:none;">>-3 to <0</th>
                            <td style="border: none; background: yellow; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">Minor increase in impact</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">-1</td>
                            <td style="padding-left:10px;">Minor additional impact</td>
                            <th style="border:none;">>-8 to -3</th>
                            <td style="border: none; background: orange; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">Moderate increase in impact</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">-2</td>
                            <td style="padding-left:10px;">Moderate additional impact</td>
                            <th style="border:none;">-12 to -8</th>
                            <td style="border: none; background: red; width:7%;">&nbsp;</td>
                            <td style="border:none; padding-left:7px;">Major increase in impact</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">-3</td>
                            <td style="padding-left:10px;">Major additional impact</td>
                        </tr>
                    </table>

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
                                        <v-btn text small class="elevation-0" color="primaryGreen" @click="exportDialog = false"
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
    </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import XLSX from 'xlsx'

export default {
    data() {
        return {
            exportDialog: false,
            exportPDF: false,
            exportExcel: false,
            exportFileName: 'SIMA FORM' + '_' + new Date().toISOString().substr(0, 10) + '_' + moment().format('HH:mm'),
            ranking: [
                { total: 0, factor: 'AXB1' },
                { total: 0, factor: 'AXB2' },
                { total: 0, factor: 'AXB4' },
                { total: 0, factor: 'AXB5' },
            ],
            resourcesCompartment: {
                seabed: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                lowerWaterColumn: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                upperWaterColumn: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                waterSurface: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                air: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                shorelines: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                saltmarsh: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                esturaineMudflats: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                sandyBeaches: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                highValueResource: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                socioEconomic: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                boatHarbour: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                waterRecreation: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
                cultural: {
                    A: '',
                    B1: '',
                    B2: '',
                    B4: '',
                    B5: '',
                    AxB1: 0,
                    AxB2: 0,
                    AxB4: 0,
                    AxB5: 0,
                },
            },
        }
    },
    methods: {
        getRanking(factor) {
            const index = this.ranking.findIndex((x) => x.factor === factor)
            return index + 1
        },
        calculateMultiply(num1, num2, compartment, factor) {
            let total = num1 * num2
            this.resourcesCompartment[compartment][factor] = total
            this.ranking.sort((a, b) => b.total - a.total)
        },
        impactOfDegree(num) {
            if (num == 1) {
                return 'None'
            } else if (num == 2) {
                return 'Low'
            } else if (num == 3) {
                return 'Medium'
            } else if (num == 4) {
                return 'High'
            }
        },
        impactColor(text) {
            if (text == 2) {
                return 'background-color: #C4D79B;'
            } else if (text == 3) {
                return 'background-color: #F0BF60;'
            } else if (text == 4) {
                return 'background-color: #EE9A00 '
            }
        },
        mitigationColor(num) {
            if (num >= 8 && num <= 12) {
                return 'background-color: #76933C;'
            } else if (num >= 3 && num < 8) {
                return 'background-color: #C4D79B;'
            } else if (num > 0 && num < 3) {
                return 'background-color: #D8E4BC;'
            } else if (num === 0) {
                return 'background-color: #ffffff;'
            } else if (num >= -3 && num < 0) {
                return 'background-color: yellow;'
            } else if (num >= -8 && num < -3) {
                return 'background-color: orange;'
            } else if (num >= -12 && num < -8) {
                return 'background-color: red;'
            }
        },
        calculateAddAxB1(factor) {
            let total = 0
            Object.keys(this.resourcesCompartment).forEach((key) => {
                total +=
                    (this.resourcesCompartment[key]['A'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['A'])) *
                    (this.resourcesCompartment[key]['B1'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['B1']))
            })
            const rank = this.ranking.find((item) => {
                return item.factor === factor
            })
            rank.total = total
            return total
        },
        calculateAddAxB2(factor) {
            let total = 0
            Object.keys(this.resourcesCompartment).forEach((key) => {
                total +=
                    (this.resourcesCompartment[key]['A'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['A'])) *
                    (this.resourcesCompartment[key]['B2'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['B2']))
            })
            const rank = this.ranking.find((item) => {
                return item.factor === factor
            })
            rank.total = total
            return total
        },
        calculateAddAxB4(factor) {
            let total = 0
            Object.keys(this.resourcesCompartment).forEach((key) => {
                total +=
                    (this.resourcesCompartment[key]['A'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['A'])) *
                    (this.resourcesCompartment[key]['B4'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['B4']))
            })
            const rank = this.ranking.find((item) => {
                return item.factor === factor
            })
            rank.total = total
            return total
        },
        calculateAddAxB5(factor) {
            let total = 0
            Object.keys(this.resourcesCompartment).forEach((key) => {
                total +=
                    (this.resourcesCompartment[key]['A'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['A'])) *
                    (this.resourcesCompartment[key]['B5'] == '' ? 0 : parseInt(this.resourcesCompartment[key]['B5']))
            })
            const rank = this.ranking.find((item) => {
                return item.factor === factor
            })
            rank.total = total
            return total
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
            // var compartment = this.resourcesCompartment
            for (var compartment in this.resourcesCompartment) {
                console.log(compartment)
                if (this.resourcesCompartment.hasOwnProperty(compartment)) {
                    forExcel.push(this.resourcesCompartment[compartment])
                }
            }
            // export json to Worksheet of Excel
            // only array possible
            var jsonData = XLSX.utils.json_to_sheet(forExcel)

            // A workbook is the name given to an Excel file
            var wb = XLSX.utils.book_new() // make Workbook of Excel

            // add Worksheet to Workbook
            // Workbook contains one or more worksheets
            XLSX.utils.book_append_sheet(wb, jsonData, 'data')

            // export Excel file
            XLSX.writeFile(wb, `${this.exportFileName}.xlsx`) // name of the file is 'book.xlsx'

            // export Excel file
            //XLSX.writeFile(wb, `${this.exportFileName}.xlsx`)
        },
        generatePDF() {
            let header = []
            let dataTable = []

            var pdfMake = require('pdfmake/build/pdfmake.js')
            if (pdfMake.vfs == undefined) {
                var pdfFonts = require('pdfmake/build/vfs_fonts.js')
                pdfMake.vfs = pdfFonts.pdfMake.vfs
            }
            var docDefinition = {
                pageOrientation: 'potrait',
                pageSize: 'A4',
                content: [
                    {
                        table: {
                            widths: [
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
                                'auto',
                                'auto',
                                'auto',
                            ],
                            body: [
                                [
                                    {
                                        border: [false, false, false, false],
                                        text: 'SIMA Stage 2: Predict Outcomes',
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        colSpan: '3',
                                    },
                                    {},
                                    {},
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        text: 'SIMA Stage 3: Balance trade-offs',
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        colSpan: '9',
                                    },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    {},
                                    {},
                                    {},
                                    {},
                                    {},
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        border: [false, false, false, false],
                                        text: '2. Relative impact assessment',
                                        style: 'secondLayerTable',
                                        alignment: 'center',
                                        colSpan: '2',
                                    },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        border: [true, true, true, true],
                                        text: '4.Impact modification factors',
                                        alignment: 'center',
                                        fillColor: '#696969',
                                        color: 'white',
                                        fontSize: 7,
                                        colSpan: 9,
                                    },
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
                                    { border: [false, false, false, false], text: '' },
                                    { text: 'NO INTERVENTION', style: 'thirdLayerTable', alignment: 'center', colSpan: 2 },
                                    {},
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        text: 'CONTAINMENT AND RECOVERY',
                                        style: 'thirdLayerTable',
                                        alignment: 'center',
                                        colSpan: 2,
                                    },
                                    {},
                                    { text: 'SURFACE DISPERSANT', style: 'thirdLayerTable', alignment: 'center', colSpan: 2 },
                                    {},
                                    { text: 'SUBSEA DISPERSANT', style: 'thirdLayerTable', alignment: 'center' },
                                    {
                                        text: 'CONTROLLED IN-SITU BURNING',
                                        style: 'thirdLayerTable',
                                        alignment: 'center',
                                        colSpan: 2,
                                    },
                                    {},
                                    { text: 'SHORELINE BOOMING', style: 'thirdLayerTable', alignment: 'center', colSpan: 2 },
                                    {},
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    { text: 'Positive Relative Impact', style: 'tableHeader', alignment: 'center', colSpan: 2 },
                                    {},
                                    { border: [false, false, false, false], text: '' },
                                    { text: 'Impact Modification Factor', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Relative impact mitigation score', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Impact Modification Factor', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Relative impact mitigation score', style: 'tableHeader', alignment: 'center' },
                                    { border: [false, false, false, false], text: '' },
                                    { text: 'Impact Modification Factor', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Relative impact mitigation score', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Impact Modification Factor', style: 'tableHeader', alignment: 'center' },
                                    { text: 'Relative impact mitigation score', style: 'tableHeader', alignment: 'center' },
                                ],
                                [
                                    { text: '1.Resource Compartment', style: 'secondLayerTable', alignment: 'center' },
                                    {},
                                    { text: 'A', style: 'tableHeader', alignment: 'center' },
                                    { rowSpan: 15, border: [false, false, false, false], text: '' },
                                    { text: 'B1', style: 'tableHeader', alignment: 'center' },
                                    { text: 'AxB1', style: 'tableHeader', alignment: 'center' },
                                    { text: 'B2', style: 'tableHeader', alignment: 'center' },
                                    { text: 'AxB2', style: 'tableHeader', alignment: 'center' },
                                    {
                                        rowSpan: 15,
                                        border: [false, false, false, true],
                                        text: 'Not feasible for a surface spill',
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    { text: 'B4', style: 'tableHeader', alignment: 'center' },
                                    { text: 'AxB4', style: 'tableHeader', alignment: 'center' },
                                    { text: 'B5', style: 'tableHeader', alignment: 'center' },
                                    { text: 'AxB5', style: 'tableHeader', alignment: 'center' },
                                ],
                                [
                                    { text: 'Seabed', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.seabed.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.resourcesCompartment.seabed.A}`,
                                    },
                                    { text: `${this.resourcesCompartment.seabed.A}`, style: 'bodyTable', alignment: 'center' },
                                    {},
                                    { text: `${this.resourcesCompartment.seabed.B1}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.seabed.AxB1}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    { text: `${this.resourcesCompartment.seabed.B2}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.seabed.AxB2}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    { text: `${this.resourcesCompartment.seabed.B4}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.seabed.AxB4}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    { text: `${this.resourcesCompartment.seabed.B5}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.seabed.AxB5}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Lower Water Column', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.lowerWaterColumn.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.lowerWaterColumn.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.lowerWaterColumn.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankinglowerWaterColumn.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Upper Water Column', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.upperWaterColumn.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.upperWaterColumn.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.upperWaterColumn.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingupperWaterColumn.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Water Surface', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.waterSurface.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.waterSurface.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterSurface.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingwaterSurface.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Air', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.air.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.air.A)}`,
                                    },
                                    { text: `${this.resourcesCompartment.air.A}`, style: 'bodyTable', alignment: 'center' },
                                    {},
                                    { text: `${this.resourcesCompartment.air.B1}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.air.AxB1}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    { text: `${this.resourcesCompartment.air.B2}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.air.AxB2}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    { text: `${this.resourcesCompartment.air.B4}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.air.AxB4}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    { text: `${this.resourcesCompartment.air.B5}`, style: 'bodyTable', alignment: 'center' },
                                    { text: `${this.resourcesCompartment.air.AxB5}`, style: 'bodyTable', alignment: 'center' }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingair.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Shorelines', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.shorelines.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.shorelines.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.shorelines.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.shorelines.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.shorelines.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.shorelines.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.shorelines.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.shorelines.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.shorelines.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.shorelines.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.shorelines.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingshorelines.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Saltmarsh', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.saltmarsh.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.saltmarsh.A)}`,
                                    },
                                    { text: `${this.resourcesCompartment.saltmarsh.A}`, style: 'bodyTable', alignment: 'center' },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.saltmarsh.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingsaltmarsh.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Esturaine mudflats', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.esturaineMudflats.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.esturaineMudflats.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.esturaineMudflats.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingesturaineMudflats.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Sandy Beaches', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.sandyBeaches.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.sandyBeaches.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.sandyBeaches.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingsandyBeaches.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'High Value Resource', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.highValueResource.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.highValueResource.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.highValueResource.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankinghighValueResource.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Socio-economic', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.socioEconomic.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.socioEconomic.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.socioEconomic.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingsocioEconomic.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Boat Harbour', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.boatHarbour.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.boatHarbour.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.boatHarbour.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingboatHarbour.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Water Recreation', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.waterRecreation.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.waterRecreation.A)}`,
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.A}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.B1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.B2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.B4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.B5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    },
                                    {
                                        text: `${this.resourcesCompartment.waterRecreation.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingwaterRecreation.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { text: 'Cultural', style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.impactOfDegree(this.resourcesCompartment.cultural.A)}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                        fillColor: `${this.impactColor(this.resourcesCompartment.cultural.A)}`,
                                    },
                                    { text: `${this.resourcesCompartment.cultural.A}`, style: 'bodyTable', alignment: 'center' },
                                    {},
                                    { text: `${this.resourcesCompartment.cultural.B1}`, style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.resourcesCompartment.cultural.AxB1}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //ranking
                                    { text: `${this.resourcesCompartment.cultural.B2}`, style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.resourcesCompartment.cultural.AxB2}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB2checked}`,alignment:'center'}, //ranking
                                    {},
                                    { text: `${this.resourcesCompartment.cultural.B4}`, style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.resourcesCompartment.cultural.AxB4}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text:''},// {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB1checked}`,alignment:'center'}, //rankingseabed.AxB4checked}`,alignment:'center'}, //ranking
                                    { text: `${this.resourcesCompartment.cultural.B5}`, style: 'bodyTable', alignment: 'center' },
                                    {
                                        text: `${this.resourcesCompartment.cultural.AxB5}`,
                                        style: 'bodyTable',
                                        alignment: 'center',
                                    }, // {text: `${this.resourcesCompartment.seabed.AxB1checked}`,alignment:'center'}, //rankingcultural.AxB5checked}`,alignment:'center'}, //ranking
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        border: [false, false, false, false],
                                        colSpan: 4,
                                        text: 'Total impact mitigation score:',
                                        style: 'bodyTable',
                                    },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.calculateAddAxB1('AXB1')}`, style: 'bodyTable', alignment: 'center' }, // {text:`${this.calculateAddAxB1}`,alignment:'center'}, //score
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.calculateAddAxB2('AXB2')}`, style: 'bodyTable', alignment: 'center' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.calculateAddAxB4('AXB4')}`, style: 'bodyTable', alignment: 'center' },
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.calculateAddAxB5('AXB5')}`, style: 'bodyTable', alignment: 'center' },
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], colSpan: 1, text: 'Ranking:', style: 'bodyTable' },
                                    { text: `${this.getRanking('AXB1')}`, style: 'bodyTable', alignment: 'center' }, //ranking rankingColourAxB1
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.getRanking('AXB2')}`, style: 'bodyTable', alignment: 'center' }, //ranking
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.getRanking('AXB4')}`, style: 'bodyTable', alignment: 'center' }, //ranking
                                    { border: [false, false, false, false], text: '' },
                                    { text: `${this.getRanking('AXB5')}`, style: 'bodyTable', alignment: 'center' }, //ranking
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        border: [true, true, true, true],
                                        colSpan: 11,
                                        text: '5.Total impaction mitigation score and ranking',
                                        alignment: 'center',
                                        fillColor: '#696969',
                                        color: 'white',
                                        fontSize: 7,
                                    },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                ],
                            ],
                        },
                        layout: {
                            defaultBorder: true,
                        },
                    },
                    {
                        table: {
                            widths: [200],
                            body: [[{ text: 'Relative Impact Levels', style: 'bodyTable' }]],
                        },
                        layout: {
                            defaultBorder: false,
                        },
                    },
                    {
                        table: {
                            widths: [80, 80, 80, 80, 80, 80, 80], //row , colSpan:1  rowSpan: 3,
                            body: [
                                [
                                    { border: [true, true, false, false], text: '' },
                                    { border: [false, true, false, false], text: '' },
                                    { text: 'Recovery Period', alignment: 'center', style: 'bodyTable', colSpan: 4 },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                ],
                                [
                                    { border: [true, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    {
                                        text: 'Slow <-------------------------------->',
                                        alignment: 'center',
                                        style: 'bodyTable',
                                        colSpan: 4,
                                    },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                ],
                                [
                                    { border: [true, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { text: '> 5 years', style: 'impactTable' },
                                    { text: '3-5 years', style: 'impactTable' },
                                    { text: '1-3 years', style: 'impactTable' },
                                    { text: '< 1 years', style: 'impactTable' },
                                ],
                                [
                                    { border: [true, true, false, false], text: '' },
                                    { text: 'High', style: 'bodyTable' },
                                    { text: 'High', style: 'impactTable', fillColor: 'orange' },
                                    { text: 'High', style: 'impactTable', fillColor: 'orange' },
                                    { text: 'High', style: 'impactTable', fillColor: 'orange' },
                                    { text: 'Medium', style: 'impactTable', fillColor: '#f0bf60' },
                                ],
                                [
                                    {
                                        border: [true, false, false, false],
                                        text: 'Impact of degree',
                                        alignment: 'center',
                                        style: 'bodyTable',
                                    },
                                    { text: 'Medium', style: 'bodyTable' },
                                    { text: 'High', style: 'impactTable', fillColor: 'orange' },
                                    { text: 'Medium', style: 'impactTable', fillColor: '#f0bf60' },
                                    { text: 'Medium', style: 'impactTable', fillColor: '#f0bf60' },
                                    { text: 'Low', style: 'impactTable', fillColor: '#c4d79b' },
                                ],
                                [
                                    { border: [true, false, false, true], text: '' },
                                    { text: 'Low', style: 'bodyTable' },
                                    { text: 'Medium', style: 'impactTable', fillColor: '#f0bf60' },
                                    { text: 'Low', style: 'impactTable', fillColor: '#c4d79b' },
                                    { text: 'Low', style: 'impactTable', fillColor: '#c4d79b' },
                                    { text: 'Low', style: 'impactTable', fillColor: '#c4d79b' },
                                ],
                            ],
                        },
                        layout: {
                            defaultBorder: true,
                        },
                    },
                    {
                        table: {
                            widths: [100, 100, 'auto', 50, 'auto'],
                            body: [
                                [
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                ],
                                [
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                    { border: [false, false, false, false], text: '' },
                                ],
                                [
                                    {
                                        text: 'IMPACT MODIFICATION FACTOR',
                                        alignment: 'center',
                                        style: 'bodyTable',
                                        fillColor: '#00b1a9',
                                    },
                                    { text: 'DESCRIPTION', alignment: 'center', style: 'bodyTable', fillColor: '#00b1a9' },
                                    {
                                        text: '8 to 12',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: '#76933C', border: [false, false, false, false] },
                                    {
                                        text: 'Major mitigation of impact',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '+3', alignment: 'center', style: 'impactTable' },
                                    { text: 'Major mitigation of impact', alignment: 'left', style: 'impactTable' },
                                    {
                                        text: '3 to <8',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: '#C4D79B', border: [false, false, false, false] },
                                    {
                                        text: 'Moderate mitigation of impact',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '+2', alignment: 'center', style: 'impactTable' },
                                    { text: 'Moderate mitigation of impact', alignment: 'left', style: 'impactTable' },
                                    {
                                        text: '>0 to <3',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: '#D8E4BC', border: [false, false, false, false] },
                                    {
                                        text: 'Minor mitigation of impact',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '+1', alignment: 'center', style: 'impactTable' },
                                    { text: 'Minor mitigation of impact', alignment: 'left', style: 'impactTable' },
                                    {
                                        text: '0',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: '#ffffff', border: [false, false, false, false] },
                                    {
                                        text: 'No or insignificant change',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '0', alignment: 'center', style: 'impactTable' },
                                    { text: 'No or insignificant change', alignment: 'left', style: 'impactTable' },
                                    {
                                        text: '>-3 to <0',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: 'yellow', border: [false, false, false, false] },
                                    {
                                        text: 'Minor increase in impact',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '-1', alignment: 'center', style: 'impactTable' },
                                    { text: 'Minor additional impact', alignment: 'left', style: 'impactTable' },
                                    {
                                        text: '>-8 to -3',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: 'orange', border: [false, false, false, false] },
                                    {
                                        text: 'Moderate increase in impact',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '-2', alignment: 'center', style: 'impactTable' },
                                    { text: 'Moderate additional impact', alignment: 'left', style: 'impactTable' },
                                    {
                                        text: '-12 to -8',
                                        alignment: 'center',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                    { text: '', fillColor: 'red', border: [false, false, false, false] },
                                    {
                                        text: 'Major increase in impact',
                                        alignment: 'left',
                                        border: [false, false, false, false],
                                        style: 'impactTable',
                                    },
                                ],
                                [
                                    { text: '-3', alignment: 'center', style: 'impactTable' },
                                    { text: 'Major additional impact', alignment: 'left', style: 'impactTable' },
                                    { text: '', border: [false, false, false, false] },
                                    { text: '', border: [false, false, false, false] },
                                    { text: '', border: [false, false, false, false] },
                                ],
                            ],
                        },
                        // unbreakable: true
                    },
                ],
                styles: {
                    impactTable: {
                        fontSize: 7,
                        color: 'black',
                    },
                    bodyTable: {
                        fontSize: 6,
                        bold: true,
                        color: 'black',
                    },
                    secondLayerTable: {
                        bold: true,
                        fontSize: 6,
                        color: 'red',
                    },
                    thirdLayerTable: {
                        bold: true,
                        fontSize: 7,
                        color: 'blue',
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 7,
                        color: 'black',
                    },
                    horizontalScript1: {
                        rotate: 90,
                    },
                },
            }
            pdfMake.createPdf(docDefinition).download(`${this.exportFileName}.pdf`)
        },
    },
    computed: {
        sortedRanking() {
            return this.ranking.sort((a, b) => (a.total < b.total ? 1 : -1))
        },
    },
}
</script>
<style lang="scss" scoped>
#tableFirst td {
    padding: 6px 4px;
}

input[type='number'] {
    width: 100%;
    border-bottom: 1px solid #666666;
}
</style>
