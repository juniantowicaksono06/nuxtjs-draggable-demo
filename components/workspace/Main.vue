<!-- <style>
    @import '../assets/styles/kanban.css';
</style> -->
<style scoped>
    #content_wrap {
        background-color: #fff;
        background-image: none;
    }
</style>
<template>
    <div class="w-100 h-100" id="content_wrap">
        <TopBar :data="{
                workspace: workspace
            }"/>
        <div class="d-flex w-100 position-relative h-100">
            <Sidebar :data="{
                workspace: workspace,
                boards: all_board
            }" :key="sidebarKey" />
            <Content :data="{
                board: all_board
            }" :key="contentKey" />
        </div>
    </div>
</template>
<script>
    import TopBar from "../Topbar.vue";
    import Sidebar from "./WorkspaceSidebar.vue";
    import Content from "./WorkspaceContent.vue";
    export default {
        data() {
            return {
                workspace: [],
                all_board: [],
                sidebarKey: 0,
                contentKey: 0
            }
        },
        mounted() {
            this.loadDataWorkspace()
        },
        methods: {
            loadDataWorkspace() {
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
                        this.workspace = response_workspace.data
                        this.all_board = response_board.data
                        this.$nextTick()
                        this.$forceUpdate()
                        this.sidebarKey += 1
                        this.contentKey += 2
                    }) 
                    
                })
            },
        },
        components: {
            TopBar,
            Sidebar,
            Content
        }
    }
</script>
