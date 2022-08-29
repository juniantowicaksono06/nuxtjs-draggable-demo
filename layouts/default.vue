<style>
    #user_menu_section {
        margin-left: auto;
        margin-right: 20px;
        position: absolute;
        right: 29px;
        top: 10px;
    }
</style>
<template>
    <div class="w-100 h-100" id="content_wrap">
        <div class="w-100 h-100" v-if="!loading">
            <div class="h-100 d-flex">
                <div>
                    <WorkspaceSidebar 
                    :key="sidebarKey" @loadWorkspaceContent="loadDataWorkspaceAndMember" />
                </div>
                <div id="user_menu_section" v-if="!$route.path.startsWith('/board')">
                    <UserMenu />
                </div>
                <div class="mt-5 w-100 h-100 pb-5" v-if="!$route.path.startsWith('/board')">
                    <Nuxt />
                </div>
                <Nuxt v-else />
            </div>
        </div>
    </div>
</template>

<script>
    const CryptoJS = require("crypto-js");
    import WorkspaceSidebar from "../components/workspace/WorkspaceSidebar.vue";
    import UserMenu from "../components/global/UserMenu.vue";
    // import { io } from 'socket.io-client'
    export default {
        middleware: ['auth'],
        components: {
            WorkspaceSidebar,
            UserMenu
        },
        mounted() {
            this.loadDataWorkspaceAndMember()
            this.$createWsInstance()
            this.webSocketEvent()
        },
        computed: {
            wsInstance: function() {
                return this.$getWsInstance()
            },
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('member', (response) => {
                    let result = JSON.parse(response)
                    let members = JSON.parse(JSON.stringify(this.$store.state.members.board_members))
                    let members_picture = JSON.parse(JSON.stringify(this.$store.state.members.board_members_picture))
                    members.some((member, member_index) => {
                        if(member._id == result.member_id) {
                            members[member_index] = result.data
                            return
                        }
                    })
                    if(Object.keys(members_picture).length > 0) {
                        Object.keys(members_picture).some((key) => {
                            if(key == result.member_id) {
                                members_picture[key] = result.data.picture
                                return
                            }
                        })
                    }
                    this.$store.commit('members/loadMembers', members)
                    this.$store.commit('members/loadMembersPicture', members_picture)
                })
            },
            loadDataWorkspaceAndMember(init = true) {
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

                        if(init) {
                            this.$nextTick()
                            this.$forceUpdate()
                            this.sidebarKey += 1
                            this.loading = false
                        }
                    }) 
                })
                .catch((error) => {

                })
            }
        },
        data() {
            return {
                sidebarKey: 0,
                loading: true,
            }
        },
    }
</script>