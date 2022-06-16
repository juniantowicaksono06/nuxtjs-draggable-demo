<style>
    .workspace-card {
        min-height: 110px;
    }
</style>
<template>
    <div class="px-3 py-3 container-fluid">
        <div class="px-2">
            <h5 class="mb-2">Boards</h5>
        </div>
        <div class="row">
            <div class="col-12 col-sm-6 col-md-3 mb-2" v-for="(board, index) in board_data">
                <a :href="`/project_management/board?board_id=${board._id}`">
                    <div class="card workspace-card hover-pointer">
                        <div class="card-body px-2 py-2 bg-primary text-white">
                            <h6 class="mb-0 no-select">{{ board.name }}</h6>
                        </div>
                    </div>
                </a>
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
                    <div class="form-group">
                        <label for="board_workspace" class="kanban-text">
                            Workspace
                        </label>
                        <select class="form-control" v-model="selected_workspace">
                            <option value="" disabled selected hidden>Select Workspace</option>
                            <option v-for="work in workspace_data" :value="work._id">{{ work.name }}</option>
                        </select>
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
                board_data: this.data.board,
                workspace_data: this.data.workspace,
                selected_workspace: '',
                board_title: ''
            }
        },
        methods: {
            saveBoard() {
                if(this.board_title.trim() == '' || this.selected_workspace.trim() == '') return
                let config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
                this.$axios.$post(`/api/board`, new URLSearchParams({
                    name: this.board_title,
                    workspace_id: this.selected_workspace
                }), config)
                .then((response) => {
                    if(response.status == 'OK') {
                        let {data} = response
                        let id = data._id
                        window.location.href = `/project_management/board?board_id=${id}`
                        this.$bvModal.hide('create_new_board2')
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            },
            loadAllDataBoard() {
                let a = this.workspace
                for(let i = 0; i < a.length; i++) {
                    for(let x = 0; x < a[i].workspace_data.length; x++) {
                        this.board_data.push(a[i].workspace_data[x])   
                    }
                }
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