<style>
    .workspace-card {
        min-height: 110px;
    }
</style>
<template>
    <div class="px-3 py-3 container-fluid">
        <div class="px-2">
            <h5 class="mb-2"><font-awesome-icon :icon="['fa', 'user']" /> Your boards</h5>
        </div>
        <div class="row">
            <div class="col-12 col-sm-6 col-md-3 mb-2" v-for="(board, index) in board_data">
                <a :href="`/project/${board.board_id}/kanban`" target="_blank">
                    <div class="card workspace-card hover-pointer">
                        <div class="card-body px-2 py-2 bg-primary text-white">
                            <h6 class="mb-0 no-select">{{ board.board_name }}</h6>
                        </div>
                    </div>
                </a>
            </div>
            <div class="col-12 col-sm-6 col-md-3 mb-2">
                <div class="card workspace-card hover-pointer" v-on:click="openCreateBoard">
                    <div class="card-body">
                        <h6 class="mb-0 mt-2 text-center text-muted"><font-awesome-icon :icon="['fa', 'plus']" /></h6>
                        <h6 class="mb-0 text-center no-select text-muted" style="margin: auto;">Create new board</h6>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <b-modal id="create_new_board" size="md" title="Add new board" hide-footer>
                <div class="w-100">
                    <div class="form-group">
                        <label class="kanban-text">
                            Board title
                        </label>
                        <input type="text" class="form-control" placeholder="Board title" />
                    </div>
                </div>
                <div class="w-100 mt-2">
                    <div class="form-group">
                        <label class="kanban-text">
                            Visibility
                        </label>
                        <select class="form-control">
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                </div>
                <div class="w-100 mt-3">
                    <button class="btn btn-block btn-primary">
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
            this.loadAllDataBoard()
        },
        data() {
            return {
                workspace: this.data.workspace,
                board_data: []
            }
        },
        methods: {
            loadAllDataBoard() {
                let a = this.workspace
                for(let i = 0; i < a.length; i++) {
                    for(let x = 0; x < a[i].workspace_data.length; x++) {
                        this.board_data.push(a[i].workspace_data[x])   
                    }
                }
            },
            openCreateBoard() {
                this.$bvModal.show('create_new_board')
            },
        },
        props: {
            data: {
                type: Object
            }
        }
    }
</script>