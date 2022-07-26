<style @scoped>
    #workspace_label {
        font-size: .95em;
        /* padding: 10px 8px; */
    }
    .sidebar-text, .sidebar-item {
        font-size: .75em;
    }
    .workspace-icon-square {
        font-size: 1.2em;
        margin-left: -5px;
    }
    #sidebar {
        width: 200px;
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
    #btn_sidebar_open:hover, #workspace_label:hover {
        background-color: rgb(127,145,155,0.5);
        cursor: pointer;
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
    .sidebar-item {
        padding: 0px 5px;
    }
    #sidebar_container {
        overflow-y: auto;
        overflow-x: hidden;
    }
    .sidebar-anim-close #sidebar_container, .sidebar-close #sidebar_container {
        overflow: hidden;
    }
    .sidebar-anim-open #sidebar_container {
        overflow-y: auto;
    }
    #sidebar_close:hover, .sidebar-anim-open #sidebar_container .workspace > div.workspace-name:hover, .workspace-item div.sidebar-item:hover {
        background-color: rgb(127,145,155,0.5);
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
    }
    .sidebar-anim-open div.sidebar-item-active {
        background-color: rgb(127,145,155,0.8);
    }
    .sidebar-anim-close .workspace > div.workspace-name:hover,.sidebar-close .workspace > div.workspace-name:hover {
        cursor: default;
    }
    div.sidebar-item > a, div.sidebar-item > span {
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
    #btn_sidebar_close:hover, .sidebar-item:hover {
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
    .sidebar-anim-open .board-name, .sidebar-anim-open .sidebar-item, .sidebar-anim-open .sidebar-item, .sidebar-anim-open #workspace_label, .sidebar-anim-open .sidebar-item .board-name-add  {
        animation-name: fade-in;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        display: block;
    }
    .sidebar-anim-close .board-name, .sidebar-anim-close .sidebar-item, .sidebar-anim-close .sidebar-item, .sidebar-anim-close #workspace_label, .sidebar-anim-close .board-name-add {
        animation-name: fade-out;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        overflow-x: hidden;
    }
    .sidebar-anim-close > #sidebar_content span.board-name, .sidebar-anim-close .sidebar-item, .sidebar-close .sidebar-item {
        display: none !important;
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
    .sidebar-close .sidebar-item {
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
    @keyframes logo-anim-close {
        from {
            width: 84px;
        }
        to {
            width: 44px;
        }
    }
    @keyframes logo-anim-open {
        from {
            width: 44px;
        }
        to {
            width: 84px;
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
    .sidebar-item {
        margin-bottom: 0;
        margin-top: 0;
    }
    .workspace-card {
        min-height: 110px;
    }
    #sidebar_logo {
        display: flex;
        justify-content: center;
    }
    .sidebar-anim-open > #sidebar_logo > img {
        animation-name: logo-anim-open;
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }
    .sidebar-anim-close > #sidebar_logo > img {
        animation-name: logo-anim-close;
        animation-duration: 1s;
        animation-fill-mode: forwards;
    }
    .sidebar-item .btn:focus, .sidebar-item .btn:active {
        outline: none !important;
        box-shadow: none;
    }
</style>
<template>
    <div id="sidebar" class="h-100 px-2 sidebar-close" ref="sidebar_ref">
        <div id="sidebar_logo" ref="sidebar_logo_ref" class="pt-2">
            <img src="/img/IT-Rajawali.png" width="44" alt="">
        </div>
        <div id="sidebar_header" ref="sidebar_header_ref" class="pt-3 pb-2">
            <div id="btn_sidebar_close" :class="(!sidebar_open ? 'd-none' : '')" v-on:click="closeSidebar">
                <i class="fa fa-chevron-left"></i>
                <span class="ml-2 no-wrap">Close</span>
            </div>
            <div id="btn_sidebar_open" :class="(!sidebar_open ? '' : 'd-none')" v-on:click="openSidebar">
                <i class="fa fa-chevron-right ml-2"></i>
            </div>
        </div>
        <div class="px-2" id="sidebar_content" ref="sidebar_content_ref">
            <div id="menu" ref="menu_ref" class="mb-2">
                <div :class="($route.path == '/gantt/' ? 'sidebar-item-active sidebar-item' : 'sidebar-item sidebar-item')">
                    <nuxt-link to="/gantt/" class="text-white btn btn-transparent text-left">
                        Gantt
                    </nuxt-link>
                </div>
                <div :class="($route.path == '/' ? 'd-flex justify-content-between sidebar-item-active sidebar-item' : 'd-flex justify-content-between sidebar-item')" id="workspace_label" ref="workspace_label_ref" v-if="$store.state.auth.identity.workspace_id">
                    <span v-if="$route.path != '/'" v-on:click="changeWorkspace">Workspace</span>
                    <span v-else>Workspace</span>
                </div>
            </div>
            <div id="sidebar_container" ref="sidebar_container_ref">
                <div v-if="'workspace_id' in $store.state.auth.identity">
                    <div v-for="(work, index) in $store.state.sidebar.sidebar_data.workspaces" class="workspace" v-if="work._id == $store.state.auth.identity.workspace_id._id || getMemberWorkspaceInBoard.includes(work._id)">
                        <div class="sidebar-text hover-pointer workspace-name d-flex justify-content-between">
                            <div class="workspace-icon">
                                <span class="workspace-icon-square">
                                    <i class="fa fa-users"></i>
                                </span>
                            </div>
                            <div class="d-flex justify-content-between w-100 pl-2" v-on:click="toggleWorkspaceItem($event, index)">
                                <span class="">{{ work.name }}</span>
                                <i class="fa fa-chevron-up d-inline-block mr-1 pt-1" ref="chevron_ref"></i>
                            </div>
                        </div>
                        <div class='workspace-item workspace-item-open' @click.stop="" ref="workspace_item_ref">
                            <div v-for="(board, board_index) in $store.state.sidebar.sidebar_data.boards" :key="$store.state.sidebar.sidebar_data.boards._id" v-if="work._id == board.workspace_id">
                                <div class="d-flex justify-content-between">
                                    <div class="board-icon">
                                        <span class="board-icon-circle kanban-text">
                                            <i class="fa fa-circle"></i>
                                        </span>
                                    </div>
                                    <div :class="(board._id == $route.query.board_id ? 'sidebar-item sidebar-item-active mb-0 w-100' : 'sidebar-item mb-0 w-100')" >
                                        <span v-on:click="changeBoard(board._id)" v-if="(board._id != $route.query.board_id)">
                                            <div class="d-flex justify-content-between">
                                                <span class="board-name">{{ board.name }}</span>
                                            </div>
                                        </span>
                                        <span v-else>
                                            <div class="d-flex justify-content-between">
                                                <span class="board-name">{{ board.name }}</span>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="sidebar-item mb-0 board-name-add" v-on:click="openCreateBoard($event, index, work._id)" >
                                    <button class="btn btn-transparent text-white kanban-text px-2">
                                        <span><i class="fa fa-plus"></i> Create new board</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div :class="($route.path == '/mom/' ? 'sidebar-item-active sidebar-item' : 'sidebar-item sidebar-item')">
                    <nuxt-link to="/mom/" v-if="$route.path != '/mom/'" class="text-white btn btn-transparent text-left">
                        MOM
                    </nuxt-link>
                    <span v-else class="text-white btn btn-transparent text-left">MOM</span>
                </div>
                <div class="sidebar-item">
                    <button class="btn btn-transparent text-white" v-on:click="actionLogout">Logout</button>
                </div>
            </div>
        </div>
        <div>
            <b-modal id="create_new_workspace" size="md" title="Add New Workspace" hide-footer>
                <div class="form-group">
                    <label class="kanban-text">
                        Workspace name
                    </label>
                    <input type="text" class="form-control" placeholder="Workspace name" v-model="add_workspace.workspace_name" />
                </div>
                <div class="form-group">
                    <label class="kanban-text">Workspace visibility</label>
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
            
            <b-modal id="create_new_board" size="md" title="Add New Board" hide-footer>
                <div class="w-100">
                    <div class="form-group">
                        <label class="kanban-text">
                            Board Title
                        </label>
                        <input type="text" class="form-control" placeholder="Board Title" v-model="add_board.board_name" v-on:keypress.enter="saveBoard()" />
                    </div>
                    <div class="form-group mb-0">
                        <label class="kanban-text">
                            Project Platform
                        </label>
                    </div>
                    <div class="row">
                        <div class="col-12 col-md-4 col-lg-4">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" value="Aplikasi Mobile" v-model="add_board.board_platform_list['Aplikasi Mobile']" :checked="add_board.board_platform_list['Aplikasi Mobile']">
                                <label for="aplikasiMobile" class="form-check-label"> Aplikasi Mobile</label>
                            </div>
                        </div>
                        <div class="col-12 col-md-4 col-lg-4">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" value="Bot Telegram" v-model="add_board.board_platform_list['Bot Telegram']" :checked="add_board.board_platform_list['Bot Telegram']">
                                <label for="botTelegram" class="form-check-label"> Bot Telegram</label>
                            </div>
                        </div>
                       <div class="col-12 col-md-4 col-lg-4">
                            <div class="form-check">
                                <input type="checkbox" class="form-check-input" value="Web" v-model="add_board.board_platform_list['Web']" :checked="add_board.board_platform_list['Web']">
                                <label for="web" class="form-check-label"> Web</label>
                            </div>
                       </div> 
                    </div>
                    <div class="form-group" v-if="add_board.board_platform_list['Bot Telegram']">
                        <label for="bot_url" class="kanban-text">
                            Bot URL
                        </label>
                        <input type="text" class="form-control" placeholder="Bot URL" v-model="add_board.board_bot_url" v-on:keypress.enter="saveBoard" />
                    </div>
                    <div class="form-group" v-if="add_board.board_platform_list['Web']">
                        <label for="access_url" class="kanban-text">
                            Access URL
                        </label>
                        <input type="text" class="form-control" placeholder="Access URL" v-model="add_board.board_url" v-on:keypress.enter="saveBoard()" />
                    </div>
                    <div class="form-group">
                        <label class="kanban-text">
                            Project Owner
                        </label>
                        <input type="text" class="form-control" placeholder="Project Owner" v-model="add_board.board_project_owner" v-on:keypress.enter="saveBoard()" />
                    </div>
                    <div class="form-group">
                        <label for="sub_department" class="kanban-text">
                            Sub Departement
                        </label>
                        <select class="form-control" v-model="board_sub_dept">
                            <option value="">Select Sub Departement</option>
                            <option :value="subdept" v-for="subdept in $store.state.auth.identity.workspace_id.subdept">{{ subdept }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="kanban-text">
                            Description
                        </label>
                        <textarea rows="3" class="form-control" placeholder="Add a Description" v-model="add_board.board_description" style="resize: none;"></textarea>
                    </div>
                </div>
                <div class="w-100 mt-3">
                    <button class="btn btn-block btn-primary" v-on:click="saveBoard()">
                        Create board
                    </button>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
    import Swal from 'sweetalert2'
    export default {
        data() {
            return {
                board_id: null,
                sidebar_open: false,
                add_workspace: {
                    workspace_name: '',
                    workspace_visibility: 'public'
                },
                board_platform: '',
                board_sub_dept: '',
                add_board: {
                    workspace_id: null,
                    workspace_index: null,
                    board_name: '',
                    // board_platform: "",
                    board_url: '',
                    board_bot_url: '',
                    board_project_owner: '',
                    board_description: '',
                    board_platform_list: {
                        "Aplikasi Mobile": false,
                        "Bot Telegram": false,
                        "Web": false
                    },
                },
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
            })
            new ResizeObserver(() => {
                this.calculateSidebarContainerHeight()
            }).observe(this.$refs.sidebar_logo_ref)
        },
        computed: {
            getMemberWorkspaceInBoard() {
                let boards = Object.assign([], this.$store.state.sidebar.sidebar_data.boards)
                let workspace_id = []
                for(let i = 0; i < boards.length; i++) {
                    if(boards[i].members.includes(this.$store.state.auth.identity._id)) {
                        workspace_id.push(boards[i].workspace_id)
                    }
                }
                return workspace_id
            }
        },
        methods: {
            changeWorkspace() {
                this.$emit('loadWorkspaceContent', false)
                this.$router.push('/')
            },
            changeBoard(board_id) {
                this.$router.push({
                    path: `/board/`,
                    query: {
                        board_id: board_id
                    }
                })
            },
            actionLogout() {
                this.$cookies.remove('credentials');
                this.$router.push('/login/');
                // this.$store.commit('auth/destroy')
            },
            calculateSidebarContainerHeight() {
                let window_height = window.innerHeight
                if(typeof this.$refs.workspace_label_ref != 'undefined') {
                    let menu_height = this.$refs.menu_ref.offsetHeight
                    let sidebar_header_height = this.$refs.sidebar_header_ref.offsetHeight
                    let workspace_icon = this.$refs.sidebar_logo_ref.offsetHeight
                    this.$refs.sidebar_container_ref.style.height = ( window_height - (workspace_icon + menu_height + sidebar_header_height + 20) ) + 'px'
                }
            },
            openCreateBoard(event, index, workspace_id) {
                this.$bvModal.show('create_new_board')
                this.add_board= {
                    workspace_id: workspace_id,
                    workspace_index: index,
                    board_name: '',
                    board_url: '',
                    board_project_owner: '',
                    board_description: '',
                    board_platform_list: {
                        "Aplikasi Mobile": false,
                        "Bot Telegram": false,
                        "Web": false
                    },
                }
            },
            saveBoard() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                let dataSend = {
                    name: this.add_board.board_name,
                    workspace_id: this.add_board.workspace_id,
                    platform: []
                }
                for(const key in this.add_board.board_platform_list) {
                    if(key == 'Web') {
                        if(this.add_board.board_platform_list[key] == true) {
                            dataSend['url'] = this.add_board.board_url
                        }
                        else {
                            dataSend['url'] = ''
                        }
                    }
                    if(key == 'Bot Telegram') {
                        if(this.add_board.board_platform_list[key] == true) {
                            dataSend['bot_url'] = this.add_board.board_bot_url
                        }
                        else {
                            dataSend['bot_url'] = ''
                        }
                    }
                    if(this.add_board.board_platform_list[key] == true) {
                        dataSend['platform'].push(key)
                    } 
                }
                dataSend['project_owner'] = this.add_board.board_project_owner
                dataSend['description'] = this.add_board.board_description
                dataSend['subdept'] = this.board_sub_dept
                this.$axios.$post(`/api/board`, dataSend, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        Swal.fire({
                            text: 'Board has been created',
                            toast: true,
                            timer: 3000,
                            position: 'bottom-right',
                            showConfirmButton: false,
                            showCancelButton: false,
                            icon: 'success',
                            title: 'Success'
                        })
                        let {data} = response
                        let boards = Object.assign([], this.$store.state.sidebar.sidebar_data.boards)
                        let workspaces = this.$store.state.sidebar.sidebar_data.workspaces
                        this.board_sub_dept = ''
                        boards.push({
                            _id: data._id,
                            name: this.add_board.board_name,
                            description: this.add_board.board_description,
                            // url: this.add_board.board_url,
                            url: dataSend['url'],
                            project_owner: this.add_board.board_project_owner,
                            workspace_id: this.add_board.workspace_id,
                            lists: [],
                            members: [],
                        })
                        let sidebar_data = {
                            workspaces: workspaces,
                            boards: boards
                        }
                        this.board_platform = ''
                        this.$store.commit('sidebar/setSidebarData', sidebar_data)
                        this.$bvModal.hide('create_new_board')
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
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
            closeSidebar() {
                this.$refs.sidebar_ref.classList.remove('sidebar-anim-open')
                this.$refs.sidebar_ref.classList.add('sidebar-anim-close')
                this.$refs.sidebar_container_ref.scrollTo(0, 0)
                this.sidebar_open = false
            },
            openSidebar() {
                this.$refs.sidebar_container_ref.scrollTo(0, 0)
                this.$refs.sidebar_ref.classList.remove('sidebar-anim-close')
                this.$refs.sidebar_ref.classList.remove('sidebar-close')
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