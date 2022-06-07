<style>
    @import '../assets/styles/kanban.css';
</style>
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
                workspace: workspace
            }" />
            <Content :data="{
                workspace: workspace
            }" />
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
                workspace: [
                    {
                        workspace_id: 1,
                        workspace_name: 'Jatim',
                        workspace_visibility: 'public',
                        workspace_data: [
                            {
                                board_id: 1,
                                board_name: 'Mojopait',
                                // board_visibility: 'public'
                            },
                            {
                                board_id: 2,
                                board_name: 'Prasasti',
                                // board_visibility: 'public'
                            }
                        ]
                    },
                    {
                        workspace_id: 2,
                        workspace_name: 'Balnus',
                        workspace_visibility: 'public',
                        workspace_data: [
                            {
                                board_id: 3,
                                board_name: 'DitaAja',
                                // board_visibility: 'public'
                            }
                        ]
                    }
                ],
            }
        },
        components: {
            TopBar,
            Sidebar,
            Content
        }
    }
</script>
