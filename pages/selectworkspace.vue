<template>
    <div class="position-relative h-100 w-100">
        <div id="login_panel">
            <form method="POST" action="#">
                <div class="row w-100 h-100" style="">
                    <div class="col-12 col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4 w-100 pr-0">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="text-center">Select Workspace</h5>
                            </div>
                            <div class="card-body">
                                <div class="form-group">
                                    <label class="login-text">Workspace</label>
                                    <div class="form-group">
                                        <select class="form-control" v-model="selected_workspace">
                                            <option value="" disabled selected hidden>Select Workspace</option>
                                            <option v-for="work in workspace" :value="work._id">{{ work.name }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <button type="button" class="btn btn-block btn-primary" v-on:click="selectWorkspace">Select Workspace</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    export default {
        middleware: ['auth', 'selectworkspace'],
        mounted() {
            this.loadData()
        },
        methods: {
            loadData() {
                this.workspace = this.$store.state.sidebar.sidebar_data.workspaces.filter(val => val.visibility === 'public')
            },
            selectWorkspace() {
                let config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                if(!this.selected_workspace) return
                this.$axios.$post(`/api/workspace/select`, {
                    workspace_id: this.selected_workspace
                }, config)
                .then((response) => {
                    if(response.status == 'OK') {
                        // window.location.href = `/`
                        this.$axios.$get(`/api/workspace`)
                        .then((response_workspace) => {
                            if(response_workspace.status != 'OK') {
                                return
                            }
                            this.$axios.$get(`/api/board`)
                            .then((response_board) => {
                                if(response_board.status != 'OK') {
                                    return
                                }
                                this.$store.commit('sidebar/setSidebarData', {
                                    workspaces: response_workspace.data,
                                    boards: response_board.data
                                })
                                this.$router.push('/')
                            }) 
                        })
                        .catch((error) => {

                        })
                    }
                })
                .catch((error) => {
                    alert("Error: Telah terjadi kesalahan")
                })
            }
        },
        data() {
            return {
                workspace: [],
                selected_workspace: ''
            }
        }
    }
</script>