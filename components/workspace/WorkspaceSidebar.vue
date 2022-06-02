<style>
    #workspace_label {
        font-size: .95em;
        padding-right: 8px;
    }
    .workspace-text, .workspace-item-text {
        font-size: .75em;
    }
    #sidebar {
        width: 300px;
        position: relative;
        background-color: rgb(71,98,112);
        color: white;
    }
    .no-select {
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    #sidebar * {
        white-space: nowrap;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    #btn_sidebar_open:hover {
        background-color: rgb(127,145,155,0.5);
    }
    #sidebar_close {
        color: white;
        margin-top: 10px;
        padding: 20px;
        /* max-width: 48px; */
    }
    .workspace > div {
        padding: 10px 10px;
    }
    #sidebar_close:hover, .workspace > div.workspace-name:hover, .workspace-item > div.workspace-item-list:hover {
        background-color: rgb(127,145,155,0.5);
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    div.workspace-item-list > a {
        display: block;
        width: 100%;
        padding: 10px;
        color: #fff;
    }
    #sidebar.sidebar-close {
        width: 20px;
    }
    #btn_sidebar_open:hover {
        cursor: pointer;
    }
    #btn_sidebar_open {
        padding: 10px;
        z-index: 99999;
    }
    #btn_sidebar_close {
        padding: 10px;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
    }
    #btn_sidebar_close:hover {
        cursor: pointer;
        background-color: rgb(127,145,155,0.5);
    }
    .sidebar-anim-close {
        animation-name: sidebar-anim-close;
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }
    .sidebar-anim-open {
        animation-name: sidebar-anim-open;
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }
    .sidebar-anim-open > #sidebar_content {
        display: block;
    }
    .sidebar-anim-close > #sidebar_content {
        animation-name: fade-out;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        overflow-x: hidden;
    }
    @keyframes fade-out {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @keyframes sidebar-anim-open {
        from {
            width: 60px;
        }
        to {
            width: 300px;
        }
    }
    @keyframes sidebar-anim-close {
        from {
            width: 300px;
        }
        to {
            width: 60px;
        }
    }
    .workspace-item > ul {
        padding: 0;
        margin-bottom: 0;
    }
    .workspace-item-close {
        display: none;
    }
    .workspace-item-open {
        display: block;
    }
    .workspace-item-list {
        margin-bottom: 0;
        margin-top: 0;
    }
    .workspace-card {
        min-height: 110px;
    }
</style>
<template>
    <div id="sidebar" class="h-100 px-2" ref="sidebar_ref">
        <div id="btn_sidebar_close" :class="(!sidebar_open ? 'd-none' : '')" v-on:click="sidebarClose">
            <font-awesome-icon :icon="['fa', 'chevron-left']"/>
            <span class="ml-2 no-wrap">Close</span>
        </div>
        <div id="btn_sidebar_open" :class="(!sidebar_open ? '' : 'd-none')" v-on:click="sidebarOpen">
            <font-awesome-icon :icon="['fa', 'chevron-right']" class="ml-2" />
        </div>
        <div class="px-2" id="sidebar_content">
            <div class="d-flex justify-content-between mt-3 mb-2" id="workspace_label">
                <span class="">Workspace</span>
                <button class="btn btn-transparent text-white py-0 px-0" v-on:click="openAddWorkspace" >
                    <font-awesome-icon :icon="['fa', 'plus']" class="d-inline-block mt-1" />
                </button>
            </div>
            <div v-for="(work, index) in workspace" class="workspace" v-on:click="toggleWorkspaceItem($event, index)">
                <div class="workspace-text hover-pointer workspace-name d-flex justify-content-between">
                    <span class="">{{ work.workspace_name }}</span>
                    <font-awesome-icon :icon="['fa', 'chevron-up']" class="mt-1" ref="chevron_ref" />
                </div>
                <div class='workspace-item workspace-item-open' @click.stop="" ref="workspace_item_ref">
                    <div class="workspace-item-list workspace-item-text mb-0" v-for="(board, board_index) in work.workspace_data" :key="board.board_id">
                        <a :href="`/project/${board.board_id}/kanban`" target="_blank">
                            <span>{{ board.board_name }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <b-modal id="create_new_workspace" size="md" title="Add new workspace" hide-footer>
                <div class="form-group">
                    <label class="kanban-text">
                        Workspace name
                    </label>
                    <input type="text" class="form-control" placeholder="Workspace name" v-model="add_workspace.workspace_name" />
                </div>
                <div class="form-group">
                    <label>Workspace visibility</label>
                    <select class="form-control" v-model="add_workspace.workspace_visibility">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary btn-block" v-on:click="saveWorkspace">
                        Add workspace
                    </button>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                workspace: this.data.workspace,
                sidebar_open: false,
                workspace_id: this.$nuxt.$route.params.slug,
                add_workspace: {
                    workspace_name: '',
                    workspace_visibility: 'public'
                },
            }    
        },
        props: {
            data: {
                type: Object
            }
        },
        mounted() {
            this.calculateSidebar()
        },
        methods: {
            saveWorkspace() {
                this.$bvModal.hide('create_new_workspace')
                if(this.add_workspace.workspace_name == '') return false
                this.data.workspace.push({
                    workspace_id: Math.round(Math.random() * 10240),
                    workspace_name: this.add_workspace.workspace_name,
                    workspace_visibility: this.add_workspace.workspace_visibility,
                    workspace_data: []
                })
            },
            toggleWorkspaceItem(event, index) {
                let chevron_ref = this.$refs.chevron_ref[index]
                if(chevron_ref.style.transform.includes('rotate(180deg)')) {
                    chevron_ref.style.transform = ''
                }
                else {
                    chevron_ref.style.transform = 'rotate(180deg)'
                }
                let workspace_item_ref = this.$refs.workspace_item_ref[index].classList
                if(workspace_item_ref.contains('workspace-item-open')) {
                    workspace_item_ref.remove('workspace-item-open')
                    workspace_item_ref.add('workspace-item-close')
                    return
                }
                    workspace_item_ref.remove('workspace-item-close')
                    workspace_item_ref.add('workspace-item-open')
                return
            },
            sidebarClose() {
                this.$refs.sidebar_ref.classList.remove('sidebar-anim-open')
                this.$refs.sidebar_ref.classList.add('sidebar-anim-close')
                this.sidebar_open = false
            },
            sidebarOpen() {
                this.$refs.sidebar_ref.classList.remove('sidebar-anim-close')
                this.$refs.sidebar_ref.classList.add('sidebar-anim-open')
                this.sidebar_open = true
            },
            calculateSidebar() {
                let windowWidth = window.innerWidth
                if(windowWidth > 775) {
                    this.sidebar_open = true
                    return 1
                }
                this.sidebar_open = false
                return 0
            },
            openAddWorkspace() {
                this.add_workspace= {
                    workspace_name: '',
                    workspace_visibility: 'public'
                }
                this.$bvModal.show('create_new_workspace')
            }
        }
    }
</script>