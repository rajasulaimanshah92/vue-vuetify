<template lang="html">
    <v-app-bar dense id="app-header" flat color="primaryDarkGrey" dark fixed clipped-right clipped-left>
        <div>
            <v-app-bar dense id="app-header-left" flat color="white" app clipped-left clipped-right>
                <v-app-bar-nav-icon v-if="userIsAuthenticated" color="grey darken-4" @click.stop="toggleLeftPanel"></v-app-bar-nav-icon>
                <img id="pet-logo" height="44" max-height="44" src="~img/logo/pet-logo-corp.png" class="pointer mr-3 mb-1" @click="gotoPage('/')"></img>
                <v-toolbar-title class="display-1 grey--text text--darken-4 font-weight-bold pointer hidden-xs-only pointer" @click="gotoPage('/')">CMIS</v-toolbar-title>
            </v-app-bar>
        </div>
        <v-spacer></v-spacer>
        <v-tooltip v-if="userIsAuthenticated" v-for="list in menuLists" bottom nudge-bottom="-10">
            <template v-slot:activator="{ on }">
                <v-btn v-if="checkUserRole(list.icon)" icon v-on="on" @click="gotoPage(list.url)">
                    <v-icon>{{ list.icon }}</v-icon>
                </v-btn>
            </template>
            <span>{{ list.tooltipText }}</span>
        </v-tooltip>
        <v-menu v-if="userIsAuthenticated" :close-on-content-click="false" offset-y nudge-bottom="2">
            <template #activator="{ on: menu }">
                <v-tooltip bottom nudge-bottom="-10">
                    <template #activator="{ on: tooltip }">
                        <v-btn icon v-on="{ ...tooltip, ...menu }">
                            <v-icon>mdi-account</v-icon>
                        </v-btn>
                    </template>
                    <span>Sign Out</span>
                </v-tooltip>
            </template>
            <v-card>
                <v-list>
                    <v-list-item>
                        <v-list-item-avatar v-if="$store.getters.user.userInfos.imgURL">
                            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                        </v-list-item-avatar>
                        <v-list-item-avatar v-else>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title>{{ user.userInfos.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ user.userAccesses.permission }}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn class="primaryGreen--text" icon>
                                <v-icon>mdi-earth</v-icon>
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn depressed small @click="signOut">Sign Out</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </v-app-bar>
</template>

<script>
import { EventBus } from '@/main'

export default {
    data() {
        return {
            menuLists: [
                { tooltipText: 'Map Viewer', icon: 'mdi-map', url: '/'},
                { tooltipText: 'Digital Tools', icon: 'mdi-tools', url: '/digitaltools/foamcalculator'},
                { tooltipText: 'Digital Library', icon: 'mdi-library-books', url: '/digitallibrary/trainingmodules'},
                { tooltipText: 'Data Management', icon: 'mdi-file', url: '/datamanagement/facilitylist'},
                { tooltipText: 'System Admin', icon: 'mdi-settings', url: '/admin/usermanagement'}
            ]
        }
    },
    methods: {
        signOut() {
            EventBus.$emit('hideLeftPanel')
            EventBus.$emit('hideRightPanel')
            this.$store.dispatch('signOut')
        },
        toggleLeftPanel() {
            EventBus.$emit('toggleLeftPanel')
        },
        toggleRightPanel() {
            EventBus.$emit('toggleRightPanel')
        },
        checkUserRole(icon) {
            if (icon === 'mdi-settings') {
                if (this.$store.getters.userPermission.toLowerCase().includes('user')) return false
                else return true
            }
            return true
        }
    },
    computed: {
        user() {
            return this.$store.getters.user
        },
        profileImg() {
            return true
        }
    }
}
</script>

<style lang="scss" scoped>
.pointer {
    cursor: pointer !important;
}

.v-toolbar__extension {
    background: #eceff1 !important;
}

#app-header {
    border-bottom: 2px solid #00B1A9 !important;
    overflow: hidden !important;
}

#app-header-left {
    width: 299px;
    z-index: auto !important;
}

@media only screen and (max-width: 660px) {
    #app-header-left {
        width: 140px !important;
    }
}
</style>
