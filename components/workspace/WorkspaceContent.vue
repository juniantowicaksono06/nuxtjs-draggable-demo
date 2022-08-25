<style scoped>
    .workspace-card {
        min-height: 110px;
    }

    .card-background {
        border-radius: 10px;
        /* overflow: hidden; */
    }
    .rounded {
        border-radius: 5px !important;
    }
    #upload_background {
        min-height: 150px;
        border: 1px dashed darkgray;
    }
    #background_file {
        min-height: 150px;
        /* visibility: hidden; */
        opacity: 0;
        position: relative;
        z-index: 999;
    }
    #background_file:hover {
        cursor: pointer;
    }
    #drag_and_drop_file:hover {
        cursor: pointer;
    }
    #drag_and_drop_file {
        position: absolute;
        top: 30%;
        left: 18%;
    }
</style>
<template>
    <div class="px-3 py-3 container-fluid" style="overflow: auto;">
        <div class="card card-background">
            <div class="card-header">
                <h5 class="mb-0">Hello {{ $store.state.auth.identity.name }}</h5>
            </div>
            <div class="card-body">
                <div class="px-2">
                    <h5 class="mb-2">Boards</h5>
                </div>
                <div class="mb-2">
                    <b-button variant="primary" v-on:click="openCreateBoard"><i class="fa fa-plus"></i> Create new board</b-button>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-2" v-for="(board, index) in $store.state.sidebar.sidebar_data.boards" v-if="board.workspace_id == $store.state.auth.identity.workspace_id._id || board.members.includes($store.state.auth.identity._id)" :key="board._id">
                        <div class="card rounded workspace-card hover-pointer" style="border: none;">
                            <div class="card-header bg-primary">
                                <div class="row">
                                    <nuxt-link :to="`/board/?board_id=${board._id}`" :class="board.platform  ? 'col-12 col-md-6' : 'col-12'">
                                        <h6 class="mb-0 no-select text-white">{{ board.name }}</h6>
                                    </nuxt-link>
                                    <div v-if="board.platform" class="col-12 col-md-6 text-right mt-3 mt-md-0 cursor-default">
                                        <div class="d-inline-block text-white" v-for="platform in board.platform">
                                            <span v-if="platform == 'Aplikasi Mobile'" class="ml-3" v-b-tooltip.hover :title="platform"><i class="fa fa-mobile hover-pointer" v-on:click.stop=""></i></span>
                                            <a target="_blank" :href="board.bot_url" v-else-if="platform == 'Bot Telegram' && board.bot_url" class="ml-3 text-white" v-b-tooltip.hover :title="platform" v-on:click.stop=""><i class="fa fa-robot hover-pointer"></i></a>
                                            <a target="_blank" :href="board.url" v-else-if="platform == 'Web' && board.url" class="ml-3 text-white" v-b-tooltip.hover :title="platform" v-on:click.stop=""><i class="fa fa-globe hover-pointer"></i></a>
                                        </div>
                                        <div class="d-inline-block text-white hover-pointer" v-if="board.project_owner || board.description">
                                            <span v-on:click="openBoardInfo(board)" class="ml-2 text-white" v-b-tooltip.hover title="Board Info" v-on:click.stop=""><i class="fa fa-info-circle"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body rounded px-2 py-2 text-dark cursor-default">
                                <div class="row">
                                    <div class="col-12 col-md-4">
                                        <h4 class="text-center text-info">
                                            {{ board.lists.task_total - board.lists.task_done ? board.lists.task_total - board.lists.task_done : 0}}
                                        </h4>
                                        <h6 class="text-center kanban-text text-info">Progress</h6>
                                    </div>
                                    <div class="col-12 col-md-4">
                                        <h4 class="text-center text-success">{{ board.lists.task_total ? board.lists.task_total : 0 }}</h4>
                                        <h6 class="text-center kanban-text text-success">Total</h6>
                                    </div>
                                    <div class="col-12 col-md-4">
                                        <h4 class="text-center text-danger">{{ board.lists.task_overdue ? board.lists.task_overdue : 0 }}</h4>
                                        <h6 class="text-center kanban-text text-danger">Overdue</h6>
                                    </div>
                                    <!-- <div class="col-12 mt-3" v-if="board.project_owner">
                                        <h3 class="text-center"><i class="fa fa-user"></i></h3>
                                        <h6 class="text-center kanban-text">{{ board.project_owner }}</h6>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <b-modal id="board_info" size="md" :title="board_info.name" hide-footer>
                        <div class="row">
                            <div class="col-12" v-if="board_info.project_owner">
                                <div>
                                    <h5>Owner</h5>
                                    <h5 class="kanban-text">{{ board_info.project_owner }}</h5>
                                </div>
                            </div>
                            <div class="col-12">
                                <div v-if="board_info.subdept">
                                    <h5>Sub Departement</h5>
                                    <h5 class="kanban-text">{{ board_info.subdept }}</h5>
                                </div>
                            </div>
                            <div class="col-12">
                                <div v-if="board_info.description">
                                    <h5>Description</h5>
                                    <h5 class="kanban-text">{{ board_info.description }}</h5>
                                </div>
                            </div>
                        </div>
                    </b-modal>
                    <b-modal id="create_new_board2" size="md" title="Add new board" hide-footer>
                        <div class="w-100">
                            <div class="form-group">
                                <label for="board_title" class="kanban-text">
                                    Board Title
                                </label>
                                <input type="text" class="form-control" placeholder="Board Title" v-model="board_title" v-on:keypress.enter="saveBoard" />
                            </div>
                            <div class="form-group mb-0">
                                <label class="kanban-text">
                                    Project Platform
                                </label>
                            </div>
                            <div class="row">
                                <div class="col-12 col-md-4 col-lg-4">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" value="Aplikasi Mobile" v-model="board_platform_list['Aplikasi Mobile']" :checked="board_platform_list['Aplikasi Mobile']">
                                        <label for="aplikasiMobile" class="form-check-label"> Aplikasi Mobile</label>
                                    </div>
                                </div>
                                <div class="col-12 col-md-4 col-lg-4">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" value="Bot Telegram" v-model="board_platform_list['Bot Telegram']" :checked="board_platform_list['Bot Telegram']">
                                        <label for="botTelegram" class="form-check-label"> Bot Telegram</label>
                                    </div>
                                </div>
                                <div class="col-12 col-md-4 col-lg-4">
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" value="Web" v-model="board_platform_list['Web']" :checked="board_platform_list['Web']" v-on:keypress.enter="saveBoard()">
                                        <label for="web" class="form-check-label"> Web</label>
                                    </div>
                                </div> 
                            </div>
                            <div class="form-group" v-if="board_platform_list['Bot Telegram']">
                                <label for="bot_url" class="kanban-text">
                                    Bot URL
                                </label>
                                <input type="text" class="form-control" placeholder="Bot URL" v-model="board_bot_url" v-on:keypress.enter="saveBoard" />
                            </div>
                            <div class="form-group" v-if="board_platform_list['Web']">
                                <label for="access_url" class="kanban-text">
                                    Access URL
                                </label>
                                <input type="text" class="form-control" placeholder="Access URL" v-model="board_url" v-on:keypress.enter="saveBoard()" />
                            </div>
                            <div class="form-group">
                                <label for="project_owner" class="kanban-text">
                                    Project Owner
                                </label>
                                <input type="text" class="form-control" placeholder="Project Owner" v-model="board_project_owner" v-on:keypress.enter="saveBoard" />
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
                                <label for="description" class="kanban-text">
                                    Description
                                </label>
                                <!-- <input type="text" class="form-control" placeholder="Description" v-model="board_title" v-on:keypress.enter="saveBoard" /> -->
                                <textarea id="" rows="3" class="form-control" v-model="board_description" style="resize: none;" placeholder="Add a Description"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="change_background" class="kanban-text">
                                    Change Background
                                </label>
                                <div class="w-100 mb-3" v-if="bg_picture">
                                    <img :src="bg_picture" alt="" class="w-100">
                                </div>
                                <div class="position-relative" id="upload_background">
                                    <input type="file" id="background_file" ref="background_file_ref" v-on:change="fileChange" accept=".png,.jpg,.jpeg">
                                    <div class="text-center" id="drag_and_drop_file">
                                        <span><i class="fa fa-camera fa-3x"></i></span>
                                        <div class="text-center">
                                            <span>Drag or Click Here To Upload Background</span>
                                        </div>
                                    </div>
                                </div>
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
        </div>
    </div>
</template>
<script>
    import Swal from 'sweetalert2'
    export default {
        mounted() {
            // this.loadAllDataBoard()
            this.webSocketEvent()
        },
        data() {
            return {
                selected_workspace: '',
                bg_picture: '',
                board_title: '',
                board_url: '',
                board_bot_url: '',
                board_platform: '',
                board_description: '',
                board_project_owner: '',
                board_sub_dept: '',
                board_info: {},
                board_platform_list: {
                    "Aplikasi Mobile": false,
                    "Bot Telegram": false,
                    "Web": false
                },
            }
        },
        computed: {
            wsInstance: function() {
                return this.$getWsInstance()
            },
        },
        methods: {
            webSocketEvent() {
                this.wsInstance.on('workspace', (response) => {
                    let result = JSON.parse(response)
                    console.log(result)
                    let boards = JSON.parse(JSON.stringify(this.$store.state.sidebar.sidebar_data.boards))
                    let workspaces = this.$store.state.sidebar.sidebar_data.workspaces
                    boards.some((board, board_index) => {
                        if(board._id == result.board_id) {
                            Object.keys(result.data).some((key, data_index) => {
                                if(key == 'lists') {
                                    Object.keys(result.data[key]).some((list_key) => {
                                        board.lists[list_key] += result.data[key][list_key]
                                    })
                                    this.$nextTick(() => {
                                        let sidebar_data = {
                                            boards: boards,
                                            workspaces: workspaces
                                        }
                                        this.$store.commit('sidebar/setSidebarData', sidebar_data)
                                    })
                                    return
                                }
                            })
                            return
                        }
                    })
                })
            },
            fileChange() {
                const files = this.$refs.background_file_ref.files
                var file_reader = this.$convertFileTob64(files[0])
                file_reader.onload = () => {
                    this.bg_picture = file_reader.result
                }
                file_reader.onerror = (error) => {
                    Swal.fire({
                        text: 'Telah terjadi kesalahan',
                        toast: true,
                        timer: 3000,
                        position: 'bottom-right',
                        showConfirmButton: false,
                        showCancelButton: false,
                        icon: 'error',
                        title: 'Error'
                    })
                }
            },
            saveBoard() {
                if(this.board_title.trim() == '') return

                let config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                let formData = new FormData()
                formData.append('name', this.board_title)
                formData.append('workspace_id', this.$store.state.auth.identity.workspace_id._id)
                if(this.board_platform_list) {
                    for(const key in this.board_platform_list) {
                        if(key == 'Web') {
                            if(this.board_platform_list[key] == true) {
                                // dataSend['url'] = this.board_url
                                formData.append('url', this.board_url)
                            }
                            else {
                                formData.append('url', '')
                            }
                        }
                        if(key == 'Bot Telegram') {
                            if(this.board_platform_list[key] == true) {
                               formData.append('bot_url', this.board_bot_url)
                            }
                            else {
                               formData.append('bot_url', '')
                            }
                        }
                        if(this.board_platform_list[key] == true) {
                            // dataSend['platform'].push(key)
                            formData.append('platform[]', key)
                        } 
                    }
                }
                formData.append('project_owner', this.board_project_owner)
                formData.append('description', this.board_description)
                formData.append('subdept', this.board_sub_dept)
                if(this.$refs.background_file_ref.files.length > 0) {
                    formData.append('picture', this.$refs.background_file_ref.files[0])
                }
                this.$axios.$post(`/api/board`, formData, config)
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
                            name: this.board_title,
                            description: this.board_description,
                            url: this.board_url,
                            project_owner: this.board_project_owner,
                            workspace_id: this.$store.state.auth.identity.workspace_id._id,
                            lists: [],
                            members: [],
                        })
                        let sidebar_data = {
                            workspaces: workspaces,
                            boards: boards
                        }
                        this.$wsEmit({
                            data: {
                                _id: data._id,
                                name: this.board_title,
                                description: this.board_description,
                                url: this.board_url,
                                project_owner: this.board_project_owner,
                                workspace_id: this.$store.state.auth.identity.workspace_id._id,
                                lists: [],
                                members: [],
                            }
                        }, 'add_board')
                        this.$store.commit('sidebar/setSidebarData', sidebar_data)
                        this.$router.push(`/board/?board_id=${data._id}`)
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            openBoardInfo(board) {
                this.board_info = board
                this.$bvModal.show('board_info')
            },
            openCreateBoard() {
                this.$bvModal.show('create_new_board2')
                this.board_platform_list = {
                    "Aplikasi Mobile": false,
                    "Bot Telegram": false,
                    "Web": false
                }
            },
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>