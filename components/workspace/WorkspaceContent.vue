<style>
    .workspace-card {
        min-height: 110px;
    }
</style>
<template>
    <div class="px-3 py-3 container-fluid">
        <div class="px-2">
            <h5 class="mb-2 text-white">Boards</h5>
        </div>
        <div class="row">
            <div class="col-12 col-sm-6 col-md-3 mb-2" v-for="(board, index) in $store.state.sidebar.sidebar_data.boards" v-if="board.workspace_id == $store.state.auth.identity.workspace_id._id">
                <nuxt-link :to="`/board?board_id=${board._id}`">
                    <div class="card workspace-card hover-pointer" style="border: none;">
                        <div class="card-body px-2 py-2 bg-primary text-white">
                            <h6 class="mb-0 no-select">{{ board.name }}</h6>
                        </div>
                    </div>
                </nuxt-link>
            </div>
            <div class="col-12 col-sm-6 col-md-3 mb-2">
                <div class="card workspace-card hover-pointer bg-secondary" v-on:click="openCreateBoard">
                    <div class="card-body">
                        <h6 class="mb-0 mt-2 text-center text-white"><font-awesome-icon :icon="['fa', 'plus']" /></h6>
                        <h6 class="mb-0 text-center no-select text-white" style="margin: auto;">Create new board</h6>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <b-modal id="create_new_board2" size="md" title="Add new board" hide-footer>
                <div class="w-100">
                    <div class="form-group">
                        <label for="board_title" class="kanban-text">
                            Board title
                        </label>
                        <input type="text" class="form-control" placeholder="Board title" v-model="board_title" />
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
        mounted() {
            // this.loadAllDataBoard()
        },
        data() {
            return {
                selected_workspace: '',
                board_title: ''
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
                this.$axios.$post(`/api/board`, new URLSearchParams({
                    name: this.board_title,
                    workspace_id: this.$store.state.auth.identity.workspace_id._id
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        let boards = structuredClone(this.$store.state.sidebar.sidebar_data.boards)
                        let workspaces = this.$store.state.sidebar.sidebar_data.workspaces
                        boards.push({
                            _id: data._id,
                            name: this.board_title,
                            workspace_id: this.$store.state.auth.identity.workspace_id._id,
                            lists: [],
                            members: [],
                        })
                        let sidebar_data = {
                            workspaces: workspaces,
                            boards: boards
                        }
                        this.$store.commit('sidebar/setSidebarData', sidebar_data)
                        this.$router.push(`/board?board_id=${data._id}`)
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