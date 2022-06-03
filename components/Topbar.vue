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
            <li class="topbar-list-item"><span>Workspace <span class="ml-1"><font-awesome-icon :icon="['fa', 'chevron-down']" /></span></span></li>
        </ul>
        <!-- <div class="topbar-workspace-container">
            <div class="topbar-workspace-card card text-dark">
                <div class="card-header">
                    <h6 class="text-center mb-0">
                        <span>Workspace</span>
                        <span class="float-right hover-pointer">
                            <font-awesome-icon :icon="['fa', 'xmark']"/>
                        </span>
                    </h6>
                </div>
                <div class="card-body px-1">
                    <div v-for="(work) in workspace" :key="work.workspace_id">
                        <div class="hover-pointer">
                            <h6><a :href="`/project/workspace`">{{ work.workspace_name }}</a></h6>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
    export default {
        data() {
            return {
                workspace: this.data.workspace
            }
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>