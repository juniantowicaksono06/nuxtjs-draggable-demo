<style>
    .topbar {
        background-color: rgb(71,98,112);
    }
    .topbar-list {
        display: flex;
        list-style-type: none;
        padding-left: 40px;
        padding-right: 40px;
        margin-bottom: 0;
        margin-top: 0;
        height: 100%;
        line-height: 100%;
    }
    .topbar-list > li.topbar-list-item {
        padding: 15px 15px;
        margin: auto 0;
    }
    .topbar-list > li.topbar-list-item:hover {
        background-color: rgb(127,145,155,0.5);
        cursor: pointer;
    }

    #workspace_topbar_list {
        max-height: 200px;
    }

    #workspace_topbar_list > div.workspace-item:hover {
        background-color: rgb(71,98,112);
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        cursor: pointer;
    }

    #workspace_topbar_list > div.workspace-item:hover a {
        color: rgb(255, 255, 255);
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }

    #workspace_topbar_list > div {
        padding: 5px;
    }

    #workspace_topbar_list a {
        color: black;
    }

    .topbar-workspace-card {
        position: absolute;
        left: 0;
        z-index: 999999;
        width: 250px;
    }
    .topbar-workspace-container {
        position: relative;
        max-width: 250px;
    }
</style>
<template>
    <div class="w-100 text-white px-3 topbar">
        <ul class="topbar-list">
            <li class="topbar-list-item" v-on:click="toggleWorkspace">
                <span>Workspace 
                    <span class="ml-1"><i class="fa fa-chevron-down"></i></span>
                </span>
            </li>
        </ul>
        <div class="topbar-workspace-container" v-if="show">
            <div class="topbar-workspace-card card text-dark">
                <div class="card-header">
                    <h6 class="text-center mb-0">
                        <span>Workspace</span>
                        <span class="float-right hover-pointer" v-on:click="hideWorkspace">
                            <i class="fa fa-times"></i>
                        </span>
                    </h6>
                </div>
                <div class="card-body px-1 py-1" id="workspace_topbar_list">
                    <div>
                        <span class="text-muted kanban-text">Your Workspaces</span>
                    </div>
                    <div v-for="(work) in workspace" :key="work._id" class="workspace-item px-3">
                        <div class="hover-pointer">
                            <h6><a :href="`/project/workspace`">{{ work.name }}</a></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                workspace: this.data.workspace,
                show: false
            }
        },
        methods: {
            toggleWorkspace() {
                this.show = !this.show
            },
            hideWorkspace() {
                this.show = false
            }
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>