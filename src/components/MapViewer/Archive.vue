<template>
    <v-container grid-list-xs,sm,md,lg,xl class="pt-0 pb-0 scroll">
        <v-layout row>
            <v-flex xs12 id="archive-container">
                <v-card flat>
                    Archive
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.scroll {
    height: calc(100vh - 80px);
    overflow-y: auto;
}

@media screen and (max-width: 1264px) {
    .scroll {
        height: calc(100vh - 32px);
    }
}
</style>
