<template>
    <div class="w-100 h-100" id="content_wrap">
        <div class="w-100 h-100" v-if="!loading">
            <div class="h-100 d-flex">
                <div>
                    <WorkspaceSidebar 
                    :data="{
                        workspace: this.sidebar_data.workspaces,
                        boards: this.sidebar_data.boards
                    }" 
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
        watch: {
            '$store.state.sidebar.sidebar_data': function() {
                if(window.location.pathname.indexOf('selectworkspace') > -1) return
                this.sidebar_data = this.$store.state.sidebar.sidebar_data
                this.sidebarKey += 1
            }
        },
        methods: {
            loadDataWorkspaceAndMember() {
                this.$axios.$get(`/api/workspace`)
                .then((response_workspace) => {
                    if(response_workspace.status != 'OK') {
                        return
                    }
                    let {data} = response_workspace
                    this.$axios.$get(`/api/member?workspace_id=${data._id}`)
                    .then((response_member) => {
                        if(response_member.status == 'OK') {
                            let {data} = response_member
                            this.$store.commit('members/loadMembers', data)
                        }
                    })
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
                sidebar_data: this.$store.state.sidebar.sidebar_data,
                loading: true,
            }
        }
    }
</script>