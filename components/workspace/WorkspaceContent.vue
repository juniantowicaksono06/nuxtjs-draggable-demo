<style scoped>
    .workspace-card {
        min-height: 110px;
    }

    .card-background {
        background-color: rgba(228, 228, 228, 0.9);
        backdrop-filter: blur(5px);
        border-radius: 10px;
        /* overflow: hidden; */
    }
    .rounded {
        border-radius: 5px !important;
    }
</style>
<template>
    <div class="px-3 py-3 container-fluid" style="overflow: auto;">
        <div class="card card-background">
            <div class="card-body">
                <div class="px-2">
                    <h5 class="mb-2">Boards</h5>
                </div>
                <div class="mb-2">
                    <b-button variant="primary" v-on:click="openCreateBoard"><i class="fa fa-plus"></i> Create new board</b-button>
                </div>
                <div class="row">
                    <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-2" v-for="(board, index) in $store.state.sidebar.sidebar_data.boards" v-if="board.workspace_id == $store.state.auth.identity.workspace_id._id || board.members.includes($store.state.auth.identity._id)" :key="board._id">
                        <nuxt-link :to="`/board/?board_id=${board._id}`">
                            <div class="card rounded workspace-card hover-pointer" style="border: none;">
                                <div class="card-body rounded px-2 py-2 bg-primary text-white">
                                    <h6 class="mb-0 no-select">{{ board.name }}</h6>
                                    <div class="mt-4">
                                        <h6 class="kanban-text"><i class="fa fa-check" :key="board._id"></i><span class="ml-2">Task Completed: </span> <span v-if="board.lists.task_total > 0">{{ board.lists.task_finish }} / {{ board.lists.task_total }} ({{ Math.round(100 * (board.lists.task_finish / board.lists.task_total)) }}%)</span><span v-else>0 / 0</span></h6>
                                    </div>
                                    <div v-if="$isValidUrl(board.url)">
                                        <h6 class="kanban-text"><i class="fa fa-globe"></i><span class="ml-2">Platform: Web</span></h6>
                                        <h6 class="kanban-text"><i class="fa fa-link"></i><span class="ml-2">URL: <a :href="board.url" v-on:click.stop="" class="text-white" v-if="$isValidUrl(board.url)">{{ board.url }}</a><span v-else>{{ board.url }}</span></span></h6>
                                    </div>
                                    <div v-else-if="board.url">
                                        <h6 class="kanban-text">
                                            <i class="fa fa-mobile ml-1 position-absolute" v-if="board.url == 'Aplikasi Mobile'"></i>
                                            <i class="fa fa-robot position-absolute" v-if="board.url.includes('Bot')"></i>
                                            <span class="pl-3 ml-1">Platform: {{ board.url }}</span>
                                        </h6>
                                    </div>
                                    <div v-if="board.project_owner">
                                        <div v-if="board.project_owner.trim() != '' && board.project_owner != null">
                                            <h6 class="kanban-text"><i class="fa fa-user"></i><span class="ml-2">Owner: {{ board.project_owner }}</span></h6>
                                        </div>
                                    </div>
                                    <div v-if="board.description">
                                        <div v-if="board.description.trim() != '' && board.description != null">
                                            <h6 class="kanban-text"><i class="fa fa-info-circle"></i><span class="ml-2">Description: {{ board.description }}</span></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nuxt-link>
                    </div>
                    <!-- <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-2">
                        <div class="card workspace-card hover-pointer bg-secondary" v-on:click="openCreateBoard">
                            <div class="card-body">
                                <h6 class="mb-0 mt-2 text-center text-white"><i class="fa fa-plus"></i></h6>
                                <h6 class="mb-0 text-center no-select text-white" style="margin: auto;">Create new board</h6>
                            </div>
                        </div>
                    </div> -->
                </div>
                <div>
                    <b-modal id="create_new_board2" size="md" title="Add new board" hide-footer>
                        <div class="w-100">
                            <div class="form-group">
                                <label for="board_title" class="kanban-text">
                                    Board Title
                                </label>
                                <input type="text" class="form-control" placeholder="Board Title" v-model="board_title" v-on:keypress.enter="saveBoard" />
                            </div>
                            <div class="form-group">
                                <label class="kanban-text">
                                    Project Platform
                                </label>
                                <select class="form-control" v-model="board_platform">
                                    <option value="">Select Platform</option>
                                    <option value="Aplikasi Mobile">Aplikasi Mobile</option>
                                    <option value="Bot Telegram">Bot Telegram</option>
                                    <option value="Web">Web</option>
                                </select>
                            </div>
                            <div class="form-group" v-if="board_platform == 'Web'">
                                <label for="access_url" class="kanban-text">
                                    Access URL
                                </label>
                                <input type="text" class="form-control" placeholder="Access URL" v-model="board_url" v-on:keypress.enter="saveBoard" />
                            </div>
                            <div class="form-group">
                                <label for="project_owner" class="kanban-text">
                                    Project Owner
                                </label>
                                <input type="text" class="form-control" placeholder="Project Owner" v-model="board_project_owner" v-on:keypress.enter="saveBoard" />
                            </div>
                            <div class="form-group">
                                <label for="description" class="kanban-text">
                                    Description
                                </label>
                                <!-- <input type="text" class="form-control" placeholder="Description" v-model="board_title" v-on:keypress.enter="saveBoard" /> -->
                                <textarea id="" rows="3" class="form-control" v-model="board_description" style="resize: none;" placeholder="Add a Description"></textarea>
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
        },
        data() {
            return {
                selected_workspace: '',
                board_title: '',
                board_url: '',
                board_platform: '',
                board_description: '',
                board_project_owner: '',
            }
        },
        methods: {
            saveBoard() {
                if(this.board_title.trim() == '') return
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                let dataSend = {
                    name: this.board_title,
                    workspace_id: this.$store.state.auth.identity.workspace_id._id
                }
                // if(this.board_url) {
                //     dataSend['url'] = this.board_url
                // }
                if(this.board_platform) {
                    if(this.board_platform == 'Web' && this.board_url) {
                        dataSend['url'] = this.board_url
                    }
                    else if(this.board_platform != 'Web') {
                        dataSend['url'] = this.board_platform
                    }
                }
                if(this.board_project_owner) {
                    dataSend['project_owner'] = this.board_project_owner
                }
                if(this.board_description) {
                    dataSend['description'] = this.board_description
                }
                this.$axios.$post(`/api/board`, new URLSearchParams(dataSend), config)
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
                        boards.push({
                            _id: data._id,
                            name: this.board_title,
                            description: this.board_description,
                            url: this.board_platform == 'Web' ? this.board_url : this.board_platform,
                            project_owner: this.board_project_owner,
                            workspace_id: this.$store.state.auth.identity.workspace_id._id,
                            lists: [],
                            members: [],
                        })
                        let sidebar_data = {
                            workspaces: workspaces,
                            boards: boards
                        }
                        this.$store.commit('sidebar/setSidebarData', sidebar_data)
                        this.$router.push(`/board/?board_id=${data._id}`)
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            openCreateBoard() {
                this.$bvModal.show('create_new_board2')
            },
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>