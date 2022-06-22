<template>
    <div class="w-100 h-100" id="content_wrap">
        <div class="w-100 h-100" v-if="!loading">
            <div class="h-100 d-flex">
                <div>
                    <WorkspaceSidebar 
                    :key="sidebarKey" />
                </div>
                <Nuxt />
            </div>
        </div>
    </div>
</template>

<script>
    const CryptoJS = require("crypto-js");
    import WorkspaceSidebar from "../components/workspace/WorkspaceSidebar.vue";
    export default {
        middleware: ['auth'],
        components: {
            WorkspaceSidebar
        },
        mounted() {
            this.loadDataWorkspaceAndMember()
        },
        methods: {
            loadDataWorkspaceAndMember() {
                this.$axios.$get(`/api/workspace`)
                .then((response_workspace) => {
                    if(response_workspace.status != 'OK') {
                        return
                    }
                    this.$axios.$get(`/api/board`)
                    .then((response_board) => {
                        if(response_board.status != 'OK') {
                            return
                        }
                        this.$store.commit('sidebar/setSidebarData', {
                            workspaces: response_workspace.data,
                            boards: response_board.data
                        })

                        this.$nextTick()
                        this.$forceUpdate()
                        this.sidebarKey += 1
                        this.loading = false
                    }) 
                })
            }
        },
        data() {
            return {
                sidebarKey: 0,
                loading: true,
            }
        }
    }
</script>