<style>
    #workspace_label {
        font-size: .95em;
        padding-right: 8px;
    }
    .workspace-text, .workspace-item-list {
        font-size: .75em;
    }
    .workspace-icon-square {
        font-size: 1.2em;
        margin-left: -5px;
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
    .workspace-item-list {
        padding: 0px 5px;
    }
    #workspace_container {
        overflow-y: auto;
        overflow-x: hidden;
    }
    .sidebar-anim-close #workspace_container, .sidebar-close #workspace_container {
        overflow: hidden;
    }
    .sidebar-anim-open #workspace_container {
        overflow-y: auto;
    }
    #sidebar_close:hover, .sidebar-anim-open #workspace_container .workspace > div.workspace-name:hover, .workspace-item div.workspace-item-list:hover {
        background-color: rgb(127,145,155,0.5);
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    .sidebar-anim-open div.workspace-item-list-active {
        background-color: rgb(127,145,155,0.8);
    }
    .sidebar-anim-close .workspace > div.workspace-name:hover,.sidebar-close .workspace > div.workspace-name:hover {
        cursor: default;
    }
    div.workspace-item-list > a, div.workspace-item-list > span {
        display: block;
        width: 100%;
        padding: 10px;
        color: #fff;
    }
    /* #sidebar.sidebar-close {
        width: 20px;
    } */
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
    .sidebar-anim-close .workspace-item {
        display: block;
    }
    .sidebar-anim-open .board-name, .sidebar-anim-open .workspace-title, .sidebar-anim-open .workspace-title, .sidebar-anim-open #workspace_label, .sidebar-anim-open .workspace-item-list .board-name-add  {
        animation-name: fade-in;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        display: block;
    }
    .sidebar-anim-close .board-name, .sidebar-anim-close .workspace-title, .sidebar-anim-close .workspace-title, .sidebar-anim-close #workspace_label, .sidebar-anim-close .board-name-add {
        animation-name: fade-out;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        overflow-x: hidden;
    }
    .sidebar-anim-close > #sidebar_content span.board-name {
        display: none;
    }
    .sidebar-anim-open > #sidebar_content div.board-icon {
        display: none;
    }
    #sidebar.sidebar-close {
        width: 60px;
    }
    .board-icon-circle {
        margin-bottom: 5px;
    }
    .sidebar-close .board-name, .sidebar-close #workspace_label {
        overflow-x: hidden;
        opacity: 0;
    }
    .sidebar-close .workspace-title {
        opacity: 0;
        overflow-x: hidden;
    }
    .sidebar-close .board-name-add {
        display: none;
    }
    .sidebar-close .workspace-icon, .sidebar-anim-close .workspace-icon {
        display: block;
        margin-right: 30px;
        margin-left: 2px;
    }
    .sidebar-close .board-name-add, .sidebar-anim-close .board-name-add {
        display: none;
    }
    .sidebar-anim-open .board-name-add  {
        display: block;
    }
    .sidebar-anim-open .workspace-icon {
        display: none;
    }
    .sidebar-anim-close .board-icon, .sidebar-close .board-icon {
        margin-right: 30px;
        margin-bottom: 15px;
    }
    .sidebar-open {
        width: 200px;
    }
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
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
            width: 200px;
        }
    }
    @keyframes sidebar-anim-close {
        from {
            width: 200px;
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
    <div id="sidebar" class="h-100 px-2 sidebar-close" ref="sidebar_ref">
        <div id="sidebar_header" ref="sidebar_header_ref">
            <div id="btn_sidebar_close" :class="(!sidebar_open ? 'd-none' : '')" v-on:click="sidebarClose">
                <font-awesome-icon :icon="['fa', 'chevron-left']"/>
                <span class="ml-2 no-wrap">Close</span>
            </div>
            <div id="btn_sidebar_open" :class="(!sidebar_open ? '' : 'd-none')" v-on:click="sidebarOpen">
                <font-awesome-icon :icon="['fa', 'chevron-right']" class="ml-2" />
            </div>
        </div>
        <div class="px-2" id="sidebar_content" ref="sidebar_content_ref">
            <div class="d-flex justify-content-between mt-3 mb-2" id="workspace_label" ref="workspace_label_ref">
                <span class="">Workspace</span>
                <button class="btn btn-transparent text-white py-0 px-0" v-on:click="openAddWorkspace" >
                    <font-awesome-icon :icon="['fa', 'plus']" class="d-inline-block mt-1" />
                </button>
            </div>
            <div id="workspace_container" ref="workspace_container_ref">
                <div v-for="(work, index) in workspace" class="workspace">
                    <div class="workspace-text hover-pointer workspace-name d-flex justify-content-between">
                        <div class="workspace-icon">
                            <span class="workspace-icon-square">
                                <font-awesome-icon :icon="['fa', 'users']" />
                            </span>
                        </div>
                        <div class="workspace-title d-flex justify-content-between w-100" v-on:click="toggleWorkspaceItem($event, index)">
                            <span class="">{{ work.name }}</span>
                            <font-awesome-icon :icon="['fa', 'chevron-up']" class="mt-1" ref="chevron_ref" />
                        </div>
                    </div>
                    <div class='workspace-item workspace-item-open' @click.stop="" ref="workspace_item_ref">
                        <div v-for="(board, board_index) in boards" :key="board._id" v-if="board.workspace_id == work._id">
                            <div class="d-flex justify-content-between">
                                <div class="board-icon">
                                    <span class="board-icon-circle kanban-text">
                                        <font-awesome-icon :icon="['fa', 'circle']" />
                                    </span>
                                </div>
                                <div :class="(board._id == board_id ? 'workspace-item-list workspace-item-list-active mb-0 w-100' : 'workspace-item-list mb-0 w-100')" >
                                    <a :href="`/project_management/board?board_id=${board._id}`" target="_blank" v-if="(board._id != board_id)">
                                        <div class="d-flex justify-content-between">
                                            <span class="board-name">{{ board.name }}</span>
                                        </div>
                                    </a>
                                    <span v-else>
                                        <div class="d-flex justify-content-between">
                                            <span class="board-name">{{ board.name }}</span>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="workspace-item-list mb-0 board-name-add" v-on:click="openCreateBoard($event, index)" >
                                <button class="btn btn-transparent text-white kanban-text px-2">
                                    <span><font-awesome-icon :icon="['fa', 'plus']"/> Create new board</span>
                                </button>
                            </div>
                        </div>
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
            
            <b-modal id="create_new_board" size="md" title="Add new board" hide-footer>
                <div class="w-100">
                    <div class="form-group">
                        <label class="kanban-text">
                            Board title
                        </label>
                        <input type="text" class="form-control" placeholder="Board title" v-model="add_board.board_name" />
                    </div>
                </div>
                <div class="w-100 mt-3">
                    <button class="btn btn-block btn-primary" v-on:click="saveBoard">
                        Create board
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
                board_id: null,
                workspace: this.data.workspace,
                boards: this.data.boards,
                sidebar_open: false,
                add_workspace: {
                    workspace_name: '',
                    workspace_visibility: 'public'
                },
                add_board: {
                    workspace_index: null,
                    board_name: '',
                }
            }    
        },
        props: {
            data: {
                type: Object
            }
        },
        mounted() {
            let urlParams = new URLSearchParams(window.location.search)
            this.board_id = urlParams.get('board_id')
            this.calculateSidebar()
            this.calculateSidebarContainerHeight()

            // Listen to sidebar resize
            window.addEventListener('resize', () => {
                this.calculateSidebarContainerHeight()
                this.resizeKanbanContainer()
            })
            this.resizeKanbanContainer()
            new ResizeObserver(() => {
                this.resizeKanbanContainer()
            }).observe(document.getElementById("sidebar"))
        },
        methods: {
            resizeKanbanContainer() {
                let sidebar = document.getElementById("sidebar")
                let width = window.innerWidth - sidebar.offsetWidth
                let kanban_container = document.getElementById('kanban_container')
                if(kanban_container) {
                    kanban_container.style.width = (width - 60) + 'px'
                }
            },
            calculateSidebarContainerHeight() {
                let window_height = window.innerHeight
                if(typeof this.$refs.workspace_label_ref != 'undefined') {
                    let workspace_label_height = this.$refs.workspace_label_ref.offsetHeight
                    let sidebar_header_height = this.$refs.sidebar_header_ref.offsetHeight
                    document.getElementById("workspace_container").style.height = ( window_height - (workspace_label_height + sidebar_header_height + 85) ) + 'px'
                }
            },
            openCreateBoard(event, index) {
                this.$bvModal.show('create_new_board')
                this.add_board= {
                    workspace_index: index,
                    board_name: '',
                    // board_visibility: 'public'
                }
            },
            saveBoard() {
                this.data.workspace[this.add_board.workspace_index].workspace_data.push({
                    board_id: Math.round(Math.random() * 10240),
                    board_name: this.add_board.board_name,
                    board_visibility: this.add_board.board_visibility
                })
                this.add_board= {
                    workspace_index: null,
                    board_name: '',
                    // board_visibility: 'public'
                }
                this.$bvModal.hide('create_new_board')
            },
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