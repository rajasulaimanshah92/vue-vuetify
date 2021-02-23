<template lang="html">
    <v-layout class="mx-1" row wrap>
        <!-- <v-card-title class="body-1 pb-4">
      Emergency Info
    </v-card-title> -->
        <!-- <v-flex class="pb-4" xs12>
      <v-card class="elevation-0">
        <v-card-title>
          <span class="primaryGreen--text body-1 font-weight-medium">Indicator</span>
        </v-card-title>
        <v-card-text style="height: 150px;">

        </v-card-text>
      </v-card>
    </v-flex> -->
        <!-- <v-flex class="pb-4" xs12>
      <v-card class="elevation-0">
        <v-card-title class="mb-4 primaryGreen--text body-1 font-weight-medium">
          Facility
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Single-line item</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Two-line item</v-list-item-title>
              <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Three-line item</v-list-item-title>
              <v-list-item-subtitle>
                Secondary line text Lorem ipsum dolor sit amet,
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                consectetur adipiscing elit.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
      </v-card>
    </v-flex> -->

        <!-- MASUK ACCORDION - EJAT -->
        <!-- remove road, perimeter -->
        <!-- sort by - tank, open area, parking area and pond -->
        <!-- add event utk zoom setiap infrastructure item -->
        <v-flex xs12>
            <v-card class="elevation-0">
                <v-card-title class="mb-4 primaryGreen--text body-1 font-weight-bold">
                    Infrastructure
                </v-card-title>
                <v-card-text>
                    <v-list>
                        <v-list-group v-for="infra in infrastructure" :key="infra.title" v-model="infra.active" no-action>
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title v-text="infra.title.replace('_', ' ')"></v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item v-for="(item, index) in infra.data" :key="item.title" class="pl-9" @click="zoomTo(item)">
                                <v-list-item-content>
                                    <v-list-item-title
                                        >{{ `${index + 1}.` }}
                                        {{
                                            item.attributes['Tank_Desc'] ||
                                                item.attributes['Remarks'] ||
                                                item.attributes['Remark'] ||
                                                item.attributes['NAME'] ||
                                                item.attributes['Name'] ||
                                                item.attributes['ZONE']
                                        }}</v-list-item-title
                                    >
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                    </v-list>
                    <!-- <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Two-line item</v-list-item-title>
              <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="mb-5" three-line>
            <v-list-item-content>
              <v-list-item-title>Three-line item</v-list-item-title>
              <v-list-item-subtitle>
                Secondary line text Lorem ipsum dolor sit amet,
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                consectetur adipiscing elit.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item> -->
                    <!-- <span class="subtitle-1 font-weight-regular">Title</span>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Single-line item</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>Two-line item</v-list-item-title>
              <v-list-item-subtitle>Secondary text</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title>Three-line item</v-list-item-title>
              <v-list-item-subtitle>
                Secondary line text Lorem ipsum dolor sit amet,
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                consectetur adipiscing elit.
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item> -->
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<!-- remove road, perimeter -->
<!-- sort by - tank, open area, parking area and pond -->
<!-- add event utk zoom setiap infrastructure item -->

<script>
import { loadModules } from 'esri-loader'

export default {
    data() {
        return {
            map: null,
            view: null,
            infrastructure: [],
        }
    },
    methods: {
        generateInfrastructure(layer) {
            this.infrastructure = []
            // console.log(layer);
            // console.log();
            const infra = layer.allSublayers.items.filter((layer) =>
                ['Tank', 'Building', 'Pond', 'Open Area', 'Platform Outline'].includes(layer.title)
            )

            if (infra.length) {
                infra.forEach((lyr) => {
                    const query = lyr.createQuery()
                    const fac_id = this.$route.params.id
                        .split('-')
                        .splice(0, this.$route.params.id.split('-').length - 1)
                        .join('-')
                    // query.where = '1=1'
                    // console.log(fac_id);
                    query.where = `FacilityID = '${fac_id}'`
                    query.outFields = ['*']
                    lyr.queryFeatures(query)
                        .then(function(res) {
                            lyr['data'] = res.features
                            return lyr
                        })
                        .then((res) => {
                            // console.log(res);
                            this.infrastructure.push(res)
                        })
                    // console.log(this.infrastructure);
                    // console.log(lyr);
                })
            }
            // const infrastructure = layer.allSublayers.items.find(layer => layer.title == 'PPTSB')
            // infrastructure.sublayers.items.filter(type => !['Perimeter','Road'].includes(type.title)).forEach(sub => {
            //   const query = sub.createQuery()
            //   query.where = '1=1'
            //   sub.queryFeatures(query).then(function(res){
            //     sub['data'] = res.features
            //     return sub
            //   }).then((res) => {
            //     this.infrastructure.push(res)
            //   });
            // })
        },
        zoomTo(item) {
            // console.log(item);
            // console.log(this.map);
            this.view.goTo(
                {
                    target: item.geometry,
                    zoom: 19,
                },
                500
            )
        },
    },
    mounted() {
        this.$root.$on('sendMap', (config) => {
            this.map = config.map
            this.view = config.view
            // console.log(config);
            // console.log(this.map);
            const parentLayer = this.map.layers.items.find((layer) => layer.title == 'Crisis Management')
            // console.log(parentLayer);
            setTimeout(() => {
                this.generateInfrastructure(parentLayer)
            }, 500)
        })
    },
}
</script>

<style lang="css" scoped></style>
